#!/usr/bin/env python3
"""
elfdump.py -- reverse-engineering miner for the Duke "grade" teacher-supplied
Linux x86-64 ELF object files.

These objects cannot be linked or run on macOS/arm64, so we recover the
grader's test drivers by mining them for:

  * .symtab   -- defined/undefined symbols (function inventory)
  * .rodata   -- string literals (exact printf formats, usage text, messages)
  * .rela.text-- relocations, which tie each string literal to the function
                 that references it
  * DWARF     -- compilation unit name, subprogram signatures (parameter
                 names/types), local variables, struct/typedef layouts,
                 and the source line table
  * disassembly

Output: one Markdown report per object plus a JSON sidecar, written to
re/elf/.  This is DEV-TIME tooling only -- it is not part of the shipped
`grade` runtime, which has zero third-party dependencies.

Usage:
    python3 tools/re/elfdump.py [paths...]        # default: every .o found
    python3 tools/re/elfdump.py --json-only ...
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

try:
    from elftools.elf.elffile import ELFFile
    from elftools.elf.relocation import RelocationSection
except ImportError:  # pragma: no cover
    sys.exit("pyelftools is required: python3 -m pip install pyelftools")

REPO = Path(__file__).resolve().parents[2]
OUTDIR = REPO / "re" / "elf"

# --------------------------------------------------------------------------
# helpers
# --------------------------------------------------------------------------


def sh(cmd: list[str]) -> str:
    try:
        p = subprocess.run(cmd, capture_output=True, text=True, errors="replace")
        return p.stdout
    except FileNotFoundError:
        return ""


# Format strings legitimately contain \n, \t and \r, so those count as
# displayable in addition to ordinary printable ASCII.
_STR_CHARS = rb"\x09\x0a\x0d\x20-\x7e"
_STR_RUN = re.compile(rb"[\x09\x0a\x0d\x20-\x7e]{%d,}")


def is_displayable(raw: bytes) -> bool:
    return bool(raw) and all(
        b in (0x09, 0x0A, 0x0D) or 0x20 <= b <= 0x7E for b in raw
    )


def printable_strings(blob: bytes, minlen: int = 2):
    """Yield (offset, text) for NUL-terminated displayable runs in a blob."""
    for m in re.finditer(rb"[\x09\x0a\x0d\x20-\x7e]{%d,}" % minlen, blob):
        yield m.start(), m.group().decode("ascii")


def demangle_if_needed(name: str) -> str:
    return name


# --------------------------------------------------------------------------
# ELF mining
# --------------------------------------------------------------------------


def read_relocations(elf: ELFFile):
    """Return {section_name: [ {offset, symbol, addend, type} ]}."""
    out: dict[str, list[dict]] = {}
    for sec in elf.iter_sections():
        if not isinstance(sec, RelocationSection):
            continue
        target = sec.name
        # .rela.text -> .text ; .rela.eh_frame -> .eh_frame
        if target.startswith(".rela"):
            target = target[5:]
        elif target.startswith(".rel"):
            target = target[4:]
        symtab = elf.get_section(sec["sh_link"])
        entries = []
        for rel in sec.iter_relocations():
            sym = ""
            try:
                s = symtab.get_symbol(rel["r_info_sym"])
                sym = s.name or ""
                # Section symbols carry st_name == 0; recover the section
                # name from st_shndx so that ".rodata" references resolve.
                if not sym and s["st_shndx"] != "SHN_UNDEF":
                    sym = elf.get_section(s["st_shndx"]).name
            except Exception:
                pass
            try:
                addend = rel["r_addend"] if rel.is_RELA() else 0
            except Exception:
                addend = 0
            entries.append(
                {
                    "offset": rel["r_offset"],
                    "symbol": sym,
                    "addend": addend,
                    "type": rel["r_info_type"],
                }
            )
        out.setdefault(target, []).extend(entries)
    return out


def read_symbols(elf: ELFFile):
    symtab = elf.get_section_by_name(".symtab")
    defs, undefs = [], []
    if symtab is None:
        return defs, undefs
    for s in symtab.iter_symbols():
        if not s.name:
            continue
        info = s["st_info"]
        kind = info["type"]
        if s["st_shndx"] == "SHN_UNDEF":
            undefs.append({"name": s.name, "type": kind})
        else:
            sec = ""
            try:
                sec = elf.get_section(s["st_shndx"]).name
            except Exception:
                pass
            defs.append(
                {
                    "name": s.name,
                    "type": kind,
                    "bind": info["bind"],
                    "size": s["st_size"],
                    "addr": s["st_value"],
                    "section": sec,
                }
            )
    return defs, undefs


def read_rodata(elf: ELFFile):
    """Return (blob, base_offset) for .rodata plus the parsed string list."""
    sec = elf.get_section_by_name(".rodata")
    if sec is None:
        return b"", []
    blob = sec.data()
    return blob, [{"offset": o, "text": t} for o, t in printable_strings(blob)]


def string_at(blob: bytes, off: int) -> str | None:
    if off < 0 or off >= len(blob):
        return None
    end = blob.find(b"\x00", off)
    if end < 0:
        end = len(blob)
    raw = blob[off:end]
    if not is_displayable(raw):
        return None
    return raw.decode("ascii")


def read_dwarf(elf: ELFFile):
    """Extract compilation unit, subprogram signatures, types and line table."""
    if not elf.has_dwarf_info():
        return None
    dwarf = elf.get_dwarf_info()
    report: dict = {"units": [], "types": [], "lines": {}}

    def attr(die, name):
        a = die.attributes.get(name)
        return a.value if a is not None else None

    for cu in dwarf.iter_CUs():
        top = cu.get_top_DIE()
        unit = {
            "name": attr(top, "DW_AT_name"),
            "comp_dir": attr(top, "DW_AT_comp_dir"),
            "producer": attr(top, "DW_AT_producer"),
            "language": attr(top, "DW_AT_language"),
            "functions": [],
            "globals": [],
        }
        if isinstance(unit["name"], bytes):
            unit["name"] = unit["name"].decode("utf-8", "replace")
        if isinstance(unit["comp_dir"], bytes):
            unit["comp_dir"] = unit["comp_dir"].decode("utf-8", "replace")
        if isinstance(unit["producer"], bytes):
            unit["producer"] = unit["producer"].decode("utf-8", "replace")

        for die in cu.iter_DIEs():
            tag = die.tag
            if tag == "DW_TAG_subprogram":
                fn = {
                    "name": attr(die, "DW_AT_name"),
                    "decl_file": attr(die, "DW_AT_decl_file"),
                    "decl_line": attr(die, "DW_AT_decl_line"),
                    "type": attr(die, "DW_AT_type"),
                    "params": [],
                    "locals": [],
                    "prototyped": attr(die, "DW_AT_prototyped"),
                    "external": attr(die, "DW_AT_external"),
                }
                if isinstance(fn["name"], bytes):
                    fn["name"] = fn["name"].decode("utf-8", "replace")
                for child in die.iter_children():
                    if child.tag == "DW_TAG_formal_parameter":
                        child_name = attr(child, "DW_AT_name")
                        if isinstance(child_name, bytes):
                            child_name = child_name.decode("utf-8", "replace")
                        fn["params"].append(
                            {
                                "name": child_name,
                                "type": attr(child, "DW_AT_type"),
                                "decl_line": attr(child, "DW_AT_decl_line"),
                            }
                        )
                    elif child.tag == "DW_TAG_variable":
                        child_name = attr(child, "DW_AT_name")
                        if isinstance(child_name, bytes):
                            child_name = child_name.decode("utf-8", "replace")
                        fn["locals"].append(
                            {
                                "name": child_name,
                                "type": attr(child, "DW_AT_type"),
                                "decl_line": attr(child, "DW_AT_decl_line"),
                            }
                        )
                if fn["name"]:
                    unit["functions"].append(fn)
            elif tag == "DW_TAG_variable" and die.get_parent() is top:
                gname = attr(die, "DW_AT_name")
                if isinstance(gname, bytes):
                    gname = gname.decode("utf-8", "replace")
                unit["globals"].append(
                    {"name": gname, "type": attr(die, "DW_AT_type")}
                )
            elif tag in ("DW_TAG_structure_type", "DW_TAG_union_type", "DW_TAG_enumeration_type"):
                tname = attr(die, "DW_AT_name")
                if isinstance(tname, bytes):
                    tname = tname.decode("utf-8", "replace")
                members = []
                for child in die.iter_children():
                    if child.tag == "DW_TAG_member":
                        mname = attr(child, "DW_AT_name")
                        if isinstance(mname, bytes):
                            mname = mname.decode("utf-8", "replace")
                        members.append(
                            {
                                "name": mname,
                                "type": attr(child, "DW_AT_type"),
                                "byte_size": attr(child, "DW_AT_byte_size"),
                                "data_member_location": attr(
                                    child, "DW_AT_data_member_location"
                                ),
                            }
                        )
                    elif child.tag == "DW_TAG_enumerator":
                        ename = attr(child, "DW_AT_name")
                        if isinstance(ename, bytes):
                            ename = ename.decode("utf-8", "replace")
                        members.append(
                            {"name": ename, "const_value": attr(child, "DW_AT_const_value")}
                        )
                report["types"].append(
                    {
                        "kind": tag.replace("DW_TAG_", ""),
                        "name": tname,
                        "byte_size": attr(die, "DW_AT_byte_size"),
                        "members": members,
                    }
                )
            elif tag == "DW_TAG_typedef":
                tname = attr(die, "DW_AT_name")
                if isinstance(tname, bytes):
                    tname = tname.decode("utf-8", "replace")
                report["types"].append(
                    {"kind": "typedef", "name": tname, "type": attr(die, "DW_AT_type")}
                )

        # line table
        try:
            lt = dwarf.line_program_for_CU(cu)
            if lt is not None:
                files = []
                for f in lt.header["file_entry"]:
                    n = f.name
                    files.append(n.decode("utf-8", "replace") if isinstance(n, bytes) else n)
                rows = []
                for entry in lt.get_entries():
                    st = entry.state
                    if st is None:
                        continue
                    rows.append({"line": st.line, "file": st.file, "addr": st.address})
                report["lines"][unit["name"] or "?"] = {"files": files, "rows": rows[:4000]}
        except Exception as exc:  # pragma: no cover
            report["lines"][unit["name"] or "?"] = {"error": str(exc)}

        report["units"].append(unit)
    return report


def rodata_offset(reloc: dict) -> int:
    """Offset of the string literal a relocation points at.

    R_X86_64_PC32 (type 2) displacements are measured from the end of the
    instruction, so the addend is biased by -4 relative to the section
    offset of the target.
    """
    return reloc["addend"] + 4 if reloc["type"] == 2 else reloc["addend"]


def read_disassembly(path: Path) -> str:
    for tool in ("objdump", "llvm-objdump", "gobjdump"):
        out = sh([tool, "-d", "--no-show-raw-insn", str(path)])
        if out.strip():
            return out
    return ""


_INSN_RE = re.compile(r"^\s*([0-9a-f]+):\s+(.*)$")


def annotate_disassembly(disasm: str, relocs: list[dict], rodata: bytes) -> str:
    """Interleave relocation comments into the disassembly.

    For an unlinked .o every call and every RIP-relative reference is zeroed
    and described by a relocation entry instead.  Re-attaching those entries
    to the instruction that owns the offset is what makes the driver logic
    readable.
    """
    lines = disasm.splitlines()
    insns: list[tuple[int, int]] = []  # (line index, address)
    for i, ln in enumerate(lines):
        m = _INSN_RE.match(ln)
        if m:
            insns.append((i, int(m.group(1), 16)))

    rel_by_line: dict[int, list[str]] = {}
    for r in relocs:
        off = r["offset"]
        owner = None
        for idx, addr in insns:
            if addr <= off:
                owner = idx
            else:
                break
        if owner is None:
            continue
        sym = r["symbol"] or f"<sec:{r['type']}>"
        note = f"{sym}+{r['addend']}" if r["addend"] else sym
        if sym == ".rodata":
            s = string_at(rodata, rodata_offset(r))
            if s is not None:
                note = f".rodata -> {json.dumps(s)}"
        rel_by_line.setdefault(owner, []).append(f";   {note}")

    out: list[str] = []
    for i, ln in enumerate(lines):
        out.append(ln)
        for note in rel_by_line.get(i, []):
            out.append(note)
    return "\n".join(out)


# --------------------------------------------------------------------------
# report assembly
# --------------------------------------------------------------------------


def mine(path: Path) -> dict:
    data = path.read_bytes()
    import io

    elf = ELFFile(io.BytesIO(data))
    defs, undefs = read_symbols(elf)
    rodata, strings = read_rodata(elf)
    relocs = read_relocations(elf)
    text_relocs_all = sorted(relocs.get(".text", []), key=lambda r: r["offset"])
    dwarf = read_dwarf(elf)
    disasm = annotate_disassembly(read_disassembly(path), text_relocs_all, rodata)

    # tie string literals to the function that references them
    text_relocs = text_relocs_all
    funcs = [s for s in defs if s["type"] == "STT_FUNC" and s["section"] == ".text"]
    funcs.sort(key=lambda s: s["addr"])

    def func_for_offset(off: int):
        best = None
        for f in funcs:
            if f["addr"] <= off < f["addr"] + max(f["size"], 1):
                best = f
        return best

    str_refs: dict[str, list[str]] = {}
    for r in text_relocs:
        if r["symbol"] != ".rodata":
            continue
        s = string_at(rodata, rodata_offset(r))
        if not s:
            continue
        f = func_for_offset(r["offset"])
        key = f["name"] if f else "?"
        str_refs.setdefault(key, [])
        if s not in str_refs[key]:
            str_refs[key].append(s)

    return {
        "path": str(path.relative_to(REPO)) if str(path).startswith(str(REPO)) else str(path),
        "size": len(data),
        "class": elf.elfclass,
        "machine": elf.header["e_machine"],
        "type": elf.header["e_type"],
        "comment": _section_string(elf, ".comment"),
        "defined_symbols": defs,
        "undefined_symbols": undefs,
        "rodata_strings": strings,
        "string_refs": str_refs,
        "relocations": {k: v for k, v in relocs.items() if k in (".text", ".rodata")},
        "dwarf": dwarf,
        "disassembly": disasm,
    }


def _section_string(elf: ELFFile, name: str) -> str:
    sec = elf.get_section_by_name(name)
    if sec is None:
        return ""
    raw = sec.data()
    return "\n".join(t for _, t in printable_strings(raw, 4))


def render_markdown(info: dict) -> str:
    L: list[str] = []
    a = L.append
    a(f"# ELF RE report: `{info['path']}`")
    a("")
    a(f"- size: {info['size']} bytes")
    a(f"- machine: {info['machine']} (EM_X86_64=62), type: {info['type']}")
    if info["comment"]:
        a(f"- producer: `{info['comment'].replace(chr(10), ' ')}`")
    a("")

    a("## Defined symbols")
    a("")
    a("| symbol | type | bind | section | addr | size |")
    a("|---|---|---|---|---|---|")
    for s in sorted(info["defined_symbols"], key=lambda x: (x["section"], x["addr"])):
        a(f"| `{s['name']}` | {s['type']} | {s['bind']} | {s['section']} | 0x{s['addr']:x} | {s['size']} |")
    a("")

    a("## Undefined (imported) symbols")
    a("")
    a("```")
    for s in info["undefined_symbols"]:
        a(s["name"])
    a("```")
    a("")

    a("## String literals in .rodata")
    a("")
    for s in info["rodata_strings"]:
        a(f"- `+0x{s['offset']:x}`  {json.dumps(s['text'])}")
    a("")

    a("## String literals grouped by referencing function")
    a("")
    for fn, strs in info["string_refs"].items():
        a(f"### `{fn}`")
        a("")
        for s in strs:
            a(f"- {json.dumps(s)}")
        a("")

    d = info.get("dwarf")
    a("## DWARF")
    a("")
    if not d:
        a("_no debug info_")
        a("")
    else:
        for u in d["units"]:
            a(f"### CU `{u['name']}`")
            a("")
            if u.get("comp_dir"):
                a(f"- comp_dir: `{u['comp_dir']}`")
            if u.get("producer"):
                a(f"- producer: `{u['producer']}`")
            a("")
            a("#### Functions")
            a("")
            for f in u["functions"]:
                params = ", ".join(
                    f"{p['type']} {p['name']}" for p in f["params"]
                ) or "void"
                a(f"- `{f['name']}({params})`  @ line {f['decl_line']}")
                for v in f["locals"]:
                    a(f"    - local `{v['name']}` (type ref {v['type']}) @ line {v['decl_line']}")
            a("")
            if u["globals"]:
                a("#### Globals")
                a("")
                for g in u["globals"]:
                    a(f"- `{g['name']}` (type ref {g['type']})")
                a("")
        if d["types"]:
            a("### Types")
            a("")
            for t in d["types"]:
                a(f"- **{t['kind']} `{t['name']}`** (size {t.get('byte_size')})")
                for m in t.get("members", []):
                    a(f"    - `{m['name']}` type={m.get('type')} off={m.get('data_member_location')} val={m.get('const_value')}")
            a("")
        a("### Line table")
        a("")
        for cu, lt in d["lines"].items():
            a(f"#### `{cu}`")
            a("")
            if "error" in lt:
                a(f"_error: {lt['error']}_")
                continue
            a(f"files: {lt['files']}")
            a("")
            by_line: dict[int, int] = {}
            for r in lt["rows"]:
                by_line[r["line"]] = by_line.get(r["line"], 0) + 1
            a("lines with code: " + ", ".join(str(k) for k in sorted(by_line))[:2000])
            a("")

    a("## Disassembly")
    a("")
    a("```asm")
    a(info["disassembly"].rstrip())
    a("```")
    a("")
    return "\n".join(L)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("paths", nargs="*")
    ap.add_argument("--json-only", action="store_true")
    ap.add_argument("--out", default=str(OUTDIR))
    args = ap.parse_args()

    outdir = Path(args.out)
    outdir.mkdir(parents=True, exist_ok=True)

    if args.paths:
        targets = [Path(p).resolve() for p in args.paths]
    else:
        targets = sorted(REPO.rglob("*.o"))
        targets = [t for t in targets if "tools/" not in str(t)]

    ok = 0
    for t in targets:
        if not t.is_file():
            print(f"skip (missing): {t}", file=sys.stderr)
            continue
        try:
            info = mine(t)
        except Exception as exc:
            print(f"FAILED {t}: {exc}", file=sys.stderr)
            continue
        rel = t.relative_to(REPO)
        slug = str(rel).replace("/", "__")
        (outdir / f"{slug}.json").write_text(json.dumps(info, indent=1, default=str))
        if not args.json_only:
            (outdir / f"{slug}.md").write_text(render_markdown(info))
        ok += 1
        print(f"mined {rel}")
    print(f"\n{ok}/{len(targets)} objects mined -> {outdir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
