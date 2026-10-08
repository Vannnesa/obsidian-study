# ELF RE report: `23_power_rec/test-power.o`

- size: 2584 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `test-power.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `.LC0` | STT_NOTYPE | STB_LOCAL | .rodata.cst16 | 0x0 | 0 |
| `.LC1` | STT_NOTYPE | STB_LOCAL | .rodata.cst16 | 0x10 | 0 |
| `.LC2` | STT_NOTYPE | STB_LOCAL | .rodata.str1.8 | 0x0 | 0 |
| `main` | STT_FUNC | STB_GLOBAL | .text.startup | 0x0 | 265 |

## Undefined (imported) symbols

```
_GLOBAL_OFFSET_TABLE_
power
__printf_chk
exit
__stack_chk_fail
```

## String literals in .rodata


## String literals grouped by referencing function

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/23_power_rec/test-power.o:	file format elf64-x86-64

Disassembly of section .text.startup:

0000000000000000 <main>:
       0:      	endbr64
       4:      	pushq	%r15
       6:      	pushq	%r14
       8:      	pushq	%r13
       a:      	pushq	%r12
       c:      	pushq	%rbp
       d:      	pushq	%rbx
       e:      	xorl	%ebx, %ebx
      10:      	subq	$0x78, %rsp
      14:      	movdqa	(%rip), %xmm0           # 0x1c <main+0x1c>
      1c:      	movq	%fs:0x28, %rax
      25:      	movq	%rax, 0x68(%rsp)
      2a:      	xorl	%eax, %eax
      2c:      	leaq	0x50(%rsp), %r15
      31:      	leaq	0x30(%rsp), %r14
      36:      	movabsq	$-0x200000000, %rax     # imm = 0xFFFFFFFE00000000
      40:      	movq	%rax, 0x20(%rsp)
      45:      	movabsq	$0x300000004, %rax      # imm = 0x300000004
      4f:      	movq	%rax, 0x40(%rsp)
      54:      	movabsq	$-0x800000000, %rax     # imm = 0xFFFFFFF800000000
      5e:      	movq	%rax, 0x60(%rsp)
      63:      	leaq	0x10(%rsp), %rax
      68:      	movaps	%xmm0, 0x10(%rsp)
      6d:      	movaps	%xmm0, 0x30(%rsp)
      72:      	movdqa	(%rip), %xmm0           # 0x7a <main+0x7a>
      7a:      	movq	%rax, 0x8(%rsp)
      7f:      	movaps	%xmm0, 0x50(%rsp)
      84:      	nopl	(%rax)
      88:      	movq	0x8(%rsp), %rax
      8d:      	movl	(%r14,%rbx), %r13d
      91:      	movl	(%r15,%rbx), %ebp
      95:      	movl	(%rax,%rbx), %r12d
      99:      	movl	%r13d, %esi
      9c:      	movl	%r12d, %edi
      9f:      	callq	0xa4 <main+0xa4>
      a4:      	cmpl	%eax, %ebp
      a6:      	jne	0xd3 <main+0xd3>
      a8:      	addq	$0x4, %rbx
      ac:      	cmpq	$0x18, %rbx
      b0:      	jne	0x88 <main+0x88>
      b2:      	movq	0x68(%rsp), %rax
      b7:      	xorq	%fs:0x28, %rax
      c0:      	jne	0x104 <main+0x104>
      c2:      	addq	$0x78, %rsp
      c6:      	xorl	%eax, %eax
      c8:      	popq	%rbx
      c9:      	popq	%rbp
      ca:      	popq	%r12
      cc:      	popq	%r13
      ce:      	popq	%r14
      d0:      	popq	%r15
      d2:      	retq
      d3:      	movl	%r13d, %esi
      d6:      	movl	%r12d, %edi
      d9:      	callq	0xde <main+0xde>
      de:      	movl	$0x1, %edi
      e3:      	movl	%r13d, %ecx
      e6:      	movl	%r12d, %edx
      e9:      	movl	%eax, %r8d
      ec:      	leaq	(%rip), %rsi            # 0xf3 <main+0xf3>
      f3:      	xorl	%eax, %eax
      f5:      	callq	0xfa <main+0xfa>
      fa:      	movl	$0x1, %edi
      ff:      	callq	0x104 <main+0x104>
     104:      	callq	0x109 <main+0x109>
```
