# ELF RE report: `11_read_ptr1/test.o`

- size: 2784 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `test.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `.LC0` | STT_NOTYPE | STB_LOCAL | .rodata.str1.1 | 0x0 | 0 |
| `.LC1` | STT_NOTYPE | STB_LOCAL | .rodata.str1.1 | 0x17 | 0 |
| `.LC2` | STT_NOTYPE | STB_LOCAL | .rodata.str1.1 | 0x2e | 0 |
| `.LC3` | STT_NOTYPE | STB_LOCAL | .rodata.str1.1 | 0x4a | 0 |
| `g` | STT_FUNC | STB_GLOBAL | .text | 0x0 | 51 |
| `f` | STT_FUNC | STB_GLOBAL | .text | 0x40 | 108 |
| `main` | STT_FUNC | STB_GLOBAL | .text.startup | 0x0 | 103 |

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

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/11_read_ptr1/test.o:	file format elf64-x86-64

Disassembly of section .text:

0000000000000000 <g>:
       0:      	endbr64
       4:      	pushq	%rbp
       5:      	movl	%edi, %edx
       7:      	movq	%rsi, %rbp
       a:      	xorl	%eax, %eax
       c:      	pushq	%rbx
       d:      	movl	%edi, %ebx
       f:      	movl	$0x1, %edi
      14:      	addl	$0x1, %ebx
      17:      	subq	$0x8, %rsp
      1b:      	movl	(%rsi), %ecx
      1d:      	leaq	(%rip), %rsi            # 0x24 <g+0x24>
;   .LC0+-4
      24:      	callq	0x29 <g+0x29>
;   __printf_chk+-4
      29:      	subl	%ebx, (%rbp)
      2c:      	addq	$0x8, %rsp
      30:      	popq	%rbx
      31:      	popq	%rbp
      32:      	retq
      33:      	nopw	%cs:(%rax,%rax)
      3e:      	nop

0000000000000040 <f>:
      40:      	endbr64
      44:      	pushq	%r12
      46:      	movl	%esi, %ecx
      48:      	xorl	%eax, %eax
      4a:      	pushq	%rbp
      4b:      	movq	%rdi, %rbp
      4e:      	pushq	%rbx
      4f:      	movl	(%rdi), %edx
      51:      	movl	%esi, %ebx
      53:      	movl	$0x1, %edi
      58:      	leaq	(%rip), %rsi            # 0x5f <f+0x1f>
;   .LC1+-4
      5f:      	callq	0x64 <f+0x24>
;   __printf_chk+-4
      64:      	movl	(%rbp), %r12d
      68:      	movl	$0x1, %edi
      6d:      	xorl	%eax, %eax
      6f:      	leaq	(%rip), %rsi            # 0x76 <f+0x36>
;   .LC0+-4
      76:      	addl	%ebx, %r12d
      79:      	addl	%ebx, %ebx
      7b:      	movl	%r12d, (%rbp)
      7f:      	movl	%ebx, %ecx
      81:      	movl	%r12d, %edx
      84:      	addl	$0x1, %r12d
      88:      	callq	0x8d <f+0x4d>
;   __printf_chk+-4
      8d:      	movl	%ebx, %ecx
      8f:      	movl	(%rbp), %edx
      92:      	popq	%rbx
      93:      	subl	%r12d, %ecx
      96:      	popq	%rbp
      97:      	leaq	(%rip), %rsi            # 0x9e <f+0x5e>
;   .LC2+-4
      9e:      	movl	$0x1, %edi
      a3:      	xorl	%eax, %eax
      a5:      	popq	%r12
      a7:      	jmp	0xac <f+0x6c>

Disassembly of section .text.startup:

0000000000000000 <main>:
       0:      	endbr64
       4:      	subq	$0x18, %rsp
       8:      	movl	$0x4, %esi
       d:      	movq	%fs:0x28, %rax
      16:      	movq	%rax, 0x8(%rsp)
      1b:      	xorl	%eax, %eax
      1d:      	leaq	0x4(%rsp), %rdi
      22:      	movl	$0x3, 0x4(%rsp)
      2a:      	callq	0x2f <main+0x2f>
      2f:      	movl	0x4(%rsp), %edx
      33:      	xorl	%eax, %eax
      35:      	movl	$0x4, %ecx
      3a:      	leaq	(%rip), %rsi            # 0x41 <main+0x41>
      41:      	movl	$0x1, %edi
      46:      	callq	0x4b <main+0x4b>
      4b:      	movq	0x8(%rsp), %rax
      50:      	xorq	%fs:0x28, %rax
      59:      	jne	0x62 <main+0x62>
      5b:      	xorl	%eax, %eax
      5d:      	addq	$0x18, %rsp
      61:      	retq
      62:      	callq	0x67 <main+0x67>
;   __printf_chk+-4
```
