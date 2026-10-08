# ELF RE report: `13_read_arr1/test.o`

- size: 2256 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `test.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `.LC0` | STT_NOTYPE | STB_LOCAL | .rodata.str1.1 | 0x0 | 0 |
| `.LC1` | STT_NOTYPE | STB_LOCAL | .rodata.str1.1 | 0x9 | 0 |
| `.LC2` | STT_NOTYPE | STB_LOCAL | .rodata.str1.1 | 0x16 | 0 |
| `main` | STT_FUNC | STB_GLOBAL | .text.startup | 0x0 | 178 |

## Undefined (imported) symbols

```
_GLOBAL_OFFSET_TABLE_
__printf_chk
__stack_chk_fail
```

## String literals in .rodata


## String literals grouped by referencing function

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/13_read_arr1/test.o:	file format elf64-x86-64

Disassembly of section .text.startup:

0000000000000000 <main>:
       0:      	endbr64
       4:      	pushq	%r12
       6:      	movl	$0x5, %edx
       b:      	movl	$0x1, %edi
      10:      	leaq	(%rip), %rsi            # 0x17 <main+0x17>
      17:      	pushq	%rbp
      18:      	leaq	(%rip), %rbp            # 0x1f <main+0x1f>
      1f:      	pushq	%rbx
      20:      	xorl	%ebx, %ebx
      22:      	subq	$0x20, %rsp
      26:      	movq	%fs:0x28, %rax
      2f:      	movq	%rax, 0x18(%rsp)
      34:      	xorl	%eax, %eax
      36:      	movq	%rsp, %r12
      39:      	callq	0x3e <main+0x3e>
      3e:      	movl	$0x10, %edx
      43:      	leaq	(%rip), %rsi            # 0x4a <main+0x4a>
      4a:      	xorl	%eax, %eax
      4c:      	movl	$0x1, %edi
      51:      	callq	0x56 <main+0x56>
      56:      	movabsq	$0x2a00000005, %rax     # imm = 0x2A00000005
      60:      	movq	%rax, (%rsp)
      64:      	movabsq	$0xc00000009, %rax      # imm = 0xC00000009
      6e:      	movq	%rax, 0x8(%rsp)
      73:      	movl	(%r12,%rbx,4), %ecx
      77:      	movl	%ebx, %edx
      79:      	movq	%rbp, %rsi
      7c:      	movl	$0x1, %edi
      81:      	xorl	%eax, %eax
      83:      	addq	$0x1, %rbx
      87:      	callq	0x8c <main+0x8c>
      8c:      	cmpq	$0x4, %rbx
      90:      	jne	0x73 <main+0x73>
      92:      	movq	0x18(%rsp), %rax
      97:      	xorq	%fs:0x28, %rax
      a0:      	jne	0xad <main+0xad>
      a2:      	addq	$0x20, %rsp
      a6:      	xorl	%eax, %eax
      a8:      	popq	%rbx
      a9:      	popq	%rbp
      aa:      	popq	%r12
      ac:      	retq
      ad:      	callq	0xb2 <main+0xb2>
```
