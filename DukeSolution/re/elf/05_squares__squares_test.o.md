# ELF RE report: `05_squares/squares_test.o`

- size: 3024 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `squares_test.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `getInt` | STT_FUNC | STB_GLOBAL | .text | 0x0 | 237 |
| `main` | STT_FUNC | STB_GLOBAL | .text | 0xed | 184 |

## Undefined (imported) symbols

```
_GLOBAL_OFFSET_TABLE_
strtol
stderr
fprintf
exit
__stack_chk_fail
fwrite
squares
```

## String literals in .rodata

- `+0x0`  "'%s' does not seem to be (enitrely) a number\n"
- `+0x2e`  "%s is too big of a number!\n"
- `+0x50`  "%s is negative.  Please use only numbers >=0\n"
- `+0x80`  "Usage ./squares size1 x_offset, y_offset, size2\n"

## String literals grouped by referencing function

### `getInt`

- "'%s' does not seem to be (enitrely) a number\n"
- "%s is too big of a number!\n"
- "%s is negative.  Please use only numbers >=0\n"

### `main`

- "Usage ./squares size1 x_offset, y_offset, size2\n"

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/05_squares/squares_test.o:	file format elf64-x86-64

Disassembly of section .text:

0000000000000000 <getInt>:
       0:      	endbr64
       4:      	pushq	%rbp
       5:      	movq	%rsp, %rbp
       8:      	subq	$0x30, %rsp
       c:      	movq	%rdi, -0x28(%rbp)
      10:      	movq	%fs:0x28, %rax
      19:      	movq	%rax, -0x8(%rbp)
      1d:      	xorl	%eax, %eax
      1f:      	leaq	-0x18(%rbp), %rcx
      23:      	movq	-0x28(%rbp), %rax
      27:      	movl	$0xa, %edx
      2c:      	movq	%rcx, %rsi
      2f:      	movq	%rax, %rdi
      32:      	callq	0x37 <getInt+0x37>
;   strtol+-4
      37:      	movq	%rax, -0x10(%rbp)
      3b:      	movq	-0x18(%rbp), %rax
      3f:      	movzbl	(%rax), %eax
      42:      	testb	%al, %al
      44:      	je	0x6f <getInt+0x6f>
      46:      	movq	(%rip), %rax            # 0x4d <getInt+0x4d>
;   stderr+-4
      4d:      	movq	-0x28(%rbp), %rdx
      51:      	leaq	(%rip), %rsi            # 0x58 <getInt+0x58>
;   .rodata -> "'%s' does not seem to be (enitrely) a number\n"
      58:      	movq	%rax, %rdi
      5b:      	movl	$0x0, %eax
      60:      	callq	0x65 <getInt+0x65>
;   fprintf+-4
      65:      	movl	$0x1, %edi
      6a:      	callq	0x6f <getInt+0x6f>
;   exit+-4
      6f:      	movl	$0x80000000, %eax       # imm = 0x80000000
      74:      	cmpq	%rax, -0x10(%rbp)
      78:      	jl	0xa3 <getInt+0xa3>
      7a:      	movq	(%rip), %rax            # 0x81 <getInt+0x81>
;   stderr+-4
      81:      	movq	-0x28(%rbp), %rdx
      85:      	leaq	(%rip), %rsi            # 0x8c <getInt+0x8c>
;   .rodata -> "%s is too big of a number!\n"
      8c:      	movq	%rax, %rdi
      8f:      	movl	$0x0, %eax
      94:      	callq	0x99 <getInt+0x99>
;   fprintf+-4
      99:      	movl	$0x1, %edi
      9e:      	callq	0xa3 <getInt+0xa3>
;   exit+-4
      a3:      	cmpq	$0x0, -0x10(%rbp)
      a8:      	jns	0xd3 <getInt+0xd3>
      aa:      	movq	(%rip), %rax            # 0xb1 <getInt+0xb1>
;   stderr+-4
      b1:      	movq	-0x28(%rbp), %rdx
      b5:      	leaq	(%rip), %rsi            # 0xbc <getInt+0xbc>
;   .rodata -> "%s is negative.  Please use only numbers >=0\n"
      bc:      	movq	%rax, %rdi
      bf:      	movl	$0x0, %eax
      c4:      	callq	0xc9 <getInt+0xc9>
;   fprintf+-4
      c9:      	movl	$0x1, %edi
      ce:      	callq	0xd3 <getInt+0xd3>
;   exit+-4
      d3:      	movq	-0x10(%rbp), %rax
      d7:      	movq	-0x8(%rbp), %rcx
      db:      	xorq	%fs:0x28, %rcx
      e4:      	je	0xeb <getInt+0xeb>
      e6:      	callq	0xeb <getInt+0xeb>
;   __stack_chk_fail+-4
      eb:      	leave
      ec:      	retq

00000000000000ed <main>:
      ed:      	endbr64
      f1:      	pushq	%rbp
      f2:      	movq	%rsp, %rbp
      f5:      	pushq	%r13
      f7:      	pushq	%r12
      f9:      	pushq	%rbx
      fa:      	subq	$0x18, %rsp
      fe:      	movl	%edi, -0x24(%rbp)
     101:      	movq	%rsi, -0x30(%rbp)
     105:      	cmpl	$0x5, -0x24(%rbp)
     109:      	je	0x132 <main+0x45>
     10b:      	movq	(%rip), %rax            # 0x112 <main+0x25>
;   stderr+-4
     112:      	movq	%rax, %rcx
     115:      	movl	$0x30, %edx
     11a:      	movl	$0x1, %esi
     11f:      	leaq	(%rip), %rdi            # 0x126 <main+0x39>
;   .rodata -> "Usage ./squares size1 x_offset, y_offset, size2\n"
     126:      	callq	0x12b <main+0x3e>
;   fwrite+-4
     12b:      	movl	$0x1, %eax
     130:      	jmp	0x19a <main+0xad>
     132:      	movq	-0x30(%rbp), %rax
     136:      	addq	$0x20, %rax
     13a:      	movq	(%rax), %rax
     13d:      	movq	%rax, %rdi
     140:      	callq	0x145 <main+0x58>
;   getInt+-4
     145:      	movl	%eax, %r13d
     148:      	movq	-0x30(%rbp), %rax
     14c:      	addq	$0x18, %rax
     150:      	movq	(%rax), %rax
     153:      	movq	%rax, %rdi
     156:      	callq	0x15b <main+0x6e>
;   getInt+-4
     15b:      	movl	%eax, %r12d
     15e:      	movq	-0x30(%rbp), %rax
     162:      	addq	$0x10, %rax
     166:      	movq	(%rax), %rax
     169:      	movq	%rax, %rdi
     16c:      	callq	0x171 <main+0x84>
;   getInt+-4
     171:      	movl	%eax, %ebx
     173:      	movq	-0x30(%rbp), %rax
     177:      	addq	$0x8, %rax
     17b:      	movq	(%rax), %rax
     17e:      	movq	%rax, %rdi
     181:      	callq	0x186 <main+0x99>
;   getInt+-4
     186:      	movl	%r13d, %ecx
     189:      	movl	%r12d, %edx
     18c:      	movl	%ebx, %esi
     18e:      	movl	%eax, %edi
     190:      	callq	0x195 <main+0xa8>
;   squares+-4
     195:      	movl	$0x0, %eax
     19a:      	addq	$0x18, %rsp
     19e:      	popq	%rbx
     19f:      	popq	%r12
     1a1:      	popq	%r13
     1a3:      	popq	%rbp
     1a4:      	retq
```
