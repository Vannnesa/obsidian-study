# ELF RE report: `16_subseq/maxSeq.o`

- size: 1608 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `maxSeq.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `maxSeq` | STT_FUNC | STB_GLOBAL | .text | 0x0 | 250 |

## Undefined (imported) symbols

```
```

## String literals in .rodata


## String literals grouped by referencing function

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/16_subseq/maxSeq.o:	file format elf64-x86-64

Disassembly of section .text:

0000000000000000 <maxSeq>:
       0:      	endbr64
       4:      	pushq	%rbp
       5:      	movq	%rsp, %rbp
       8:      	movq	%rdi, -0x28(%rbp)
       c:      	movq	%rsi, -0x30(%rbp)
      10:      	cmpq	$0x0, -0x30(%rbp)
      15:      	jne	0x21 <maxSeq+0x21>
      17:      	movl	$0x0, %eax
      1c:      	jmp	0xf8 <maxSeq+0xf8>
      21:      	cmpq	$0x0, -0x28(%rbp)
      26:      	jne	0x32 <maxSeq+0x32>
      28:      	movl	$0x0, %eax
      2d:      	jmp	0xf8 <maxSeq+0xf8>
      32:      	movl	$0x1, -0x14(%rbp)
      39:      	movl	$0x0, -0x10(%rbp)
      40:      	movq	-0x28(%rbp), %rax
      44:      	movq	%rax, -0x8(%rbp)
      48:      	movl	$0x1, -0xc(%rbp)
      4f:      	jmp	0xe4 <maxSeq+0xe4>
      54:      	cmpl	$0x0, -0x10(%rbp)
      58:      	jne	0x80 <maxSeq+0x80>
      5a:      	movq	-0x8(%rbp), %rax
      5e:      	movl	(%rax), %edx
      60:      	movl	-0xc(%rbp), %eax
      63:      	cltq
      65:      	leaq	(,%rax,4), %rcx
      6d:      	movq	-0x28(%rbp), %rax
      71:      	addq	%rcx, %rax
      74:      	movl	(%rax), %eax
      76:      	cmpl	%eax, %edx
      78:      	jge	0x80 <maxSeq+0x80>
      7a:      	addl	$0x1, -0x14(%rbp)
      7e:      	jmp	0xb3 <maxSeq+0xb3>
      80:      	cmpl	$0x0, -0x10(%rbp)
      84:      	je	0xac <maxSeq+0xac>
      86:      	movq	-0x8(%rbp), %rax
      8a:      	movl	(%rax), %edx
      8c:      	movl	-0xc(%rbp), %eax
      8f:      	cltq
      91:      	leaq	(,%rax,4), %rcx
      99:      	movq	-0x28(%rbp), %rax
      9d:      	addq	%rcx, %rax
      a0:      	movl	(%rax), %eax
      a2:      	cmpl	%eax, %edx
      a4:      	jge	0xac <maxSeq+0xac>
      a6:      	addl	$0x1, -0x10(%rbp)
      aa:      	jmp	0xb3 <maxSeq+0xb3>
      ac:      	movl	$0x1, -0x10(%rbp)
      b3:      	movl	-0xc(%rbp), %eax
      b6:      	cltq
      b8:      	leaq	(,%rax,4), %rdx
      c0:      	movq	-0x28(%rbp), %rax
      c4:      	addq	%rdx, %rax
      c7:      	movq	%rax, -0x8(%rbp)
      cb:      	movl	-0x14(%rbp), %eax
      ce:      	cmpl	-0x10(%rbp), %eax
      d1:      	jge	0xe0 <maxSeq+0xe0>
      d3:      	movl	-0x10(%rbp), %eax
      d6:      	movl	%eax, -0x14(%rbp)
      d9:      	movl	$0x0, -0x10(%rbp)
      e0:      	addl	$0x1, -0xc(%rbp)
      e4:      	movl	-0xc(%rbp), %eax
      e7:      	cltq
      e9:      	cmpq	%rax, -0x30(%rbp)
      ed:      	ja	0x54 <maxSeq+0x54>
      f3:      	movl	-0x14(%rbp), %eax
      f6:      	cltq
      f8:      	popq	%rbp
      f9:      	retq
```
