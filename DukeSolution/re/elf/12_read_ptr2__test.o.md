# ELF RE report: `12_read_ptr2/test.o`

- size: 2920 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `test.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `.LC0` | STT_NOTYPE | STB_LOCAL | .rodata.str1.1 | 0x0 | 0 |
| `.LC1` | STT_NOTYPE | STB_LOCAL | .rodata.str1.1 | 0xa | 0 |
| `.LC2` | STT_NOTYPE | STB_LOCAL | .rodata.str1.1 | 0x14 | 0 |
| `.LC3` | STT_NOTYPE | STB_LOCAL | .rodata.str1.1 | 0x1c | 0 |
| `.LC4` | STT_NOTYPE | STB_LOCAL | .rodata.str1.1 | 0x25 | 0 |
| `.LC5` | STT_NOTYPE | STB_LOCAL | .rodata.str1.1 | 0x2e | 0 |
| `.LC6` | STT_NOTYPE | STB_LOCAL | .rodata.str1.1 | 0x36 | 0 |
| `f` | STT_FUNC | STB_GLOBAL | .text | 0x0 | 118 |
| `main` | STT_FUNC | STB_GLOBAL | .text.startup | 0x0 | 218 |

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

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/12_read_ptr2/test.o:	file format elf64-x86-64

Disassembly of section .text:

0000000000000000 <f>:
       0:      	endbr64
       4:      	pushq	%r14
       6:      	pushq	%r13
       8:      	pushq	%r12
       a:      	pushq	%rbp
       b:      	movq	%rsi, %rbp
       e:      	pushq	%rbx
       f:      	movq	(%rdi), %r12
      12:      	movq	%rdi, %rbx
      15:      	movq	(%rsi), %rax
      18:      	movl	(%r12), %r13d
      1c:      	movl	(%rax), %r14d
      1f:      	movq	%rax, (%rdi)
      22:      	movq	%r12, (%rsi)
      25:      	movq	(%rdi), %rax
      28:      	leaq	(%rip), %rsi            # 0x2f <f+0x2f>
;   .LC0+-4
      2f:      	movl	$0x1, %edi
      34:      	movl	(%rax), %edx
      36:      	xorl	%eax, %eax
      38:      	callq	0x3d <f+0x3d>
;   __printf_chk+-4
      3d:      	movq	(%rbp), %rax
      41:      	movl	$0x1, %edi
      46:      	leaq	(%rip), %rsi            # 0x4d <f+0x4d>
;   .LC1+-4
      4d:      	movl	(%rax), %edx
      4f:      	xorl	%eax, %eax
      51:      	callq	0x56 <f+0x56>
;   __printf_chk+-4
      56:      	movq	(%rbp), %rax
      5a:      	addl	$0x3, (%r12)
      5f:      	subl	$0x8, (%rax)
      62:      	movq	(%rbx), %rax
      65:      	subl	$0x13, (%rax)
      68:      	leal	(%r13,%r14), %eax
      6d:      	popq	%rbx
      6e:      	popq	%rbp
      6f:      	popq	%r12
      71:      	popq	%r13
      73:      	popq	%r14
      75:      	retq

Disassembly of section .text.startup:

0000000000000000 <main>:
       0:      	endbr64
       4:      	subq	$0x28, %rsp
       8:      	movq	%fs:0x28, %rax
      11:      	movq	%rax, 0x18(%rsp)
      16:      	xorl	%eax, %eax
      18:      	movq	%rsp, %rax
      1b:      	leaq	0x10(%rsp), %rsi
      20:      	leaq	0x8(%rsp), %rdi
      25:      	movq	%rax, 0x8(%rsp)
      2a:      	leaq	0x4(%rsp), %rax
      2f:      	movl	$0x50, (%rsp)
      36:      	movl	$0xc, 0x4(%rsp)
      3e:      	movq	%rax, 0x10(%rsp)
      43:      	callq	0x48 <main+0x48>
      48:      	leaq	(%rip), %rsi            # 0x4f <main+0x4f>
      4f:      	movl	$0x1, %edi
      54:      	movl	%eax, %edx
      56:      	xorl	%eax, %eax
      58:      	callq	0x5d <main+0x5d>
      5d:      	movq	0x8(%rsp), %rax
      62:      	movl	$0x1, %edi
      67:      	leaq	(%rip), %rsi            # 0x6e <main+0x6e>
      6e:      	movl	(%rax), %edx
      70:      	xorl	%eax, %eax
      72:      	callq	0x77 <main+0x77>
      77:      	movq	0x10(%rsp), %rax
      7c:      	movl	$0x1, %edi
      81:      	leaq	(%rip), %rsi            # 0x88 <main+0x88>
      88:      	movl	(%rax), %edx
      8a:      	xorl	%eax, %eax
      8c:      	callq	0x91 <main+0x91>
      91:      	movl	(%rsp), %edx
      94:      	movl	$0x1, %edi
      99:      	xorl	%eax, %eax
      9b:      	leaq	(%rip), %rsi            # 0xa2 <main+0xa2>
      a2:      	callq	0xa7 <main+0xa7>
      a7:      	movl	0x4(%rsp), %edx
      ab:      	xorl	%eax, %eax
      ad:      	movl	$0x1, %edi
      b2:      	leaq	(%rip), %rsi            # 0xb9 <main+0xb9>
      b9:      	callq	0xbe <main+0xbe>
      be:      	movq	0x18(%rsp), %rax
      c3:      	xorq	%fs:0x28, %rax
      cc:      	jne	0xd5 <main+0xd5>
      ce:      	xorl	%eax, %eax
      d0:      	addq	$0x28, %rsp
      d4:      	retq
      d5:      	callq	0xda <main+0xda>
```
