# ELF RE report: `c2prj1_cards/my-test-main.o`

- size: 24688 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `my-test-main.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `wm4.0.3171f61f86eacc6b44a36d7c381f8dbe` | STT_NOTYPE | STB_LOCAL | .group | 0x0 | 0 |
| `wm4.stdcpredef.h.19.8dc41bed5d9037ff9622e015fb5f0ce3` | STT_NOTYPE | STB_LOCAL | .group | 0x0 | 0 |
| `wm4.cards.h.2.6ea1f97048b453bd9249855c897949b6` | STT_NOTYPE | STB_LOCAL | .group | 0x0 | 0 |
| `main` | STT_FUNC | STB_GLOBAL | .text | 0x0 | 15 |

## Undefined (imported) symbols

```
```

## String literals in .rodata


## String literals grouped by referencing function

## DWARF

### CU `my-test-main.c`

- comp_dir: `/home/student/learn2prog/c2prj1_cards`
- producer: `GNU C99 9.3.0 -mtune=generic -march=x86-64 -ggdb3 -std=gnu99 -fasynchronous-unwind-tables -fstack-protector-strong -fstack-clash-protection -fcf-protection`

#### Functions

- `main(void)`  @ line 3

### Line table

#### `my-test-main.c`

files: ['my-test-main.c', 'stdc-predef.h', 'cards.h']

lines with code: 3, 5

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/c2prj1_cards/my-test-main.o:	file format elf64-x86-64

Disassembly of section .text:

0000000000000000 <main>:
       0:      	endbr64
       4:      	pushq	%rbp
       5:      	movq	%rsp, %rbp
       8:      	movl	$0x0, %eax
       d:      	popq	%rbp
       e:      	retq
```
