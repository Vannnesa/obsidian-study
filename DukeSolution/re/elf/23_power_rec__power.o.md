# ELF RE report: `23_power_rec/power.o`

- size: 1392 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `power.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `power` | STT_FUNC | STB_GLOBAL | .text | 0x0 | 48 |

## Undefined (imported) symbols

```
```

## String literals in .rodata


## String literals grouped by referencing function

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/23_power_rec/power.o:	file format elf64-x86-64

Disassembly of section .text:

0000000000000000 <power>:
       0:      	endbr64
       4:      	testl	%esi, %esi
       6:      	je	0x27 <power+0x27>
       8:      	cmpl	$0x1, %esi
       b:      	je	0x2d <power+0x2d>
       d:      	movl	$0x1, %eax
      12:      	nopw	(%rax,%rax)
      18:      	subl	$0x1, %esi
      1b:      	imull	%edi, %eax
      1e:      	cmpl	$0x1, %esi
      21:      	jne	0x18 <power+0x18>
      23:      	imull	%edi, %eax
      26:      	retq
      27:      	movl	$0x1, %eax
      2c:      	retq
      2d:      	movl	%edi, %eax
      2f:      	retq
```
