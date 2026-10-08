# ELF RE report: `c3prj2_eval/eval-c4.o`

- size: 2504 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `eval-c4.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `CHECK_GRADER_ENV` | STT_FUNC | STB_LOCAL | .text | 0x0 | 127 |
| `get_match_counts` | STT_FUNC | STB_GLOBAL | .text | 0x7f | 208 |

## Undefined (imported) symbols

```
_GLOBAL_OFFSET_TABLE_
getenv
atoi
stderr
fprintf
abort
malloc
```

## String literals in .rodata

- `+0x0`  "PokerProjectStep"
- `+0x18`  "Oops, you seem to be using our code for a step you were supposed to do! (%d,%d,%d,%d)\n"

## String literals grouped by referencing function

### `CHECK_GRADER_ENV`

- "PokerProjectStep"
- "Oops, you seem to be using our code for a step you were supposed to do! (%d,%d,%d,%d)\n"

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/c3prj2_eval/eval-c4.o:	file format elf64-x86-64

Disassembly of section .text:

0000000000000000 <CHECK_GRADER_ENV>:
       0:      	pushq	%rbp
       1:      	movq	%rsp, %rbp
       4:      	subq	$0x20, %rsp
       8:      	movl	%edi, -0x14(%rbp)
       b:      	movl	%esi, -0x18(%rbp)
       e:      	movl	-0x14(%rbp), %eax
      11:      	imull	$0x64, %eax, %edx
      14:      	movl	-0x18(%rbp), %eax
      17:      	addl	%edx, %eax
      19:      	movl	%eax, -0x10(%rbp)
      1c:      	leaq	(%rip), %rdi            # 0x23 <CHECK_GRADER_ENV+0x23>
;   .rodata -> "PokerProjectStep"
      23:      	callq	0x28 <CHECK_GRADER_ENV+0x28>
;   getenv+-4
      28:      	movq	%rax, -0x8(%rbp)
      2c:      	cmpq	$0x0, -0x8(%rbp)
      31:      	je	0x7c <CHECK_GRADER_ENV+0x7c>
      33:      	movq	-0x8(%rbp), %rax
      37:      	movq	%rax, %rdi
      3a:      	callq	0x3f <CHECK_GRADER_ENV+0x3f>
;   atoi+-4
      3f:      	movl	%eax, -0xc(%rbp)
      42:      	movl	-0x10(%rbp), %eax
      45:      	cmpl	-0xc(%rbp), %eax
      48:      	jg	0x7d <CHECK_GRADER_ENV+0x7d>
      4a:      	movq	(%rip), %rax            # 0x51 <CHECK_GRADER_ENV+0x51>
;   stderr+-4
      51:      	movl	-0xc(%rbp), %edi
      54:      	movl	-0x10(%rbp), %esi
      57:      	movl	-0x18(%rbp), %ecx
      5a:      	movl	-0x14(%rbp), %edx
      5d:      	movl	%edi, %r9d
      60:      	movl	%esi, %r8d
      63:      	leaq	(%rip), %rsi            # 0x6a <CHECK_GRADER_ENV+0x6a>
;   .rodata -> "Oops, you seem to be using our code for a step you were supposed to do! (%d,%d,%d,%d)\n"
      6a:      	movq	%rax, %rdi
      6d:      	movl	$0x0, %eax
      72:      	callq	0x77 <CHECK_GRADER_ENV+0x77>
;   fprintf+-4
      77:      	callq	0x7c <CHECK_GRADER_ENV+0x7c>
;   abort+-4
      7c:      	nop
      7d:      	leave
      7e:      	retq

000000000000007f <get_match_counts>:
      7f:      	endbr64
      83:      	pushq	%rbp
      84:      	movq	%rsp, %rbp
      87:      	subq	$0x30, %rsp
      8b:      	movq	%rdi, -0x28(%rbp)
      8f:      	movl	$0x1, %esi
      94:      	movl	$0x4, %edi
      99:      	callq	0x0 <CHECK_GRADER_ENV>
      9e:      	movq	-0x28(%rbp), %rax
      a2:      	movq	0x8(%rax), %rax
      a6:      	shlq	$0x2, %rax
      aa:      	movq	%rax, %rdi
      ad:      	callq	0xb2 <get_match_counts+0x33>
;   malloc+-4
      b2:      	movq	%rax, -0x8(%rbp)
      b6:      	movq	$0x0, -0x18(%rbp)
      be:      	jmp	0x137 <get_match_counts+0xb8>
      c0:      	movl	$0x0, -0x1c(%rbp)
      c7:      	movq	$0x0, -0x10(%rbp)
      cf:      	jmp	0x10c <get_match_counts+0x8d>
      d1:      	movq	-0x28(%rbp), %rax
      d5:      	movq	(%rax), %rax
      d8:      	movq	-0x18(%rbp), %rdx
      dc:      	shlq	$0x3, %rdx
      e0:      	addq	%rdx, %rax
      e3:      	movq	(%rax), %rax
      e6:      	movl	(%rax), %edx
      e8:      	movq	-0x28(%rbp), %rax
      ec:      	movq	(%rax), %rax
      ef:      	movq	-0x10(%rbp), %rcx
      f3:      	shlq	$0x3, %rcx
      f7:      	addq	%rcx, %rax
      fa:      	movq	(%rax), %rax
      fd:      	movl	(%rax), %eax
      ff:      	cmpl	%eax, %edx
     101:      	jne	0x107 <get_match_counts+0x88>
     103:      	addl	$0x1, -0x1c(%rbp)
     107:      	addq	$0x1, -0x10(%rbp)
     10c:      	movq	-0x28(%rbp), %rax
     110:      	movq	0x8(%rax), %rax
     114:      	cmpq	%rax, -0x10(%rbp)
     118:      	jb	0xd1 <get_match_counts+0x52>
     11a:      	movq	-0x18(%rbp), %rax
     11e:      	leaq	(,%rax,4), %rdx
     126:      	movq	-0x8(%rbp), %rax
     12a:      	addq	%rax, %rdx
     12d:      	movl	-0x1c(%rbp), %eax
     130:      	movl	%eax, (%rdx)
     132:      	addq	$0x1, -0x18(%rbp)
     137:      	movq	-0x28(%rbp), %rax
     13b:      	movq	0x8(%rax), %rax
     13f:      	cmpq	%rax, -0x18(%rbp)
     143:      	jb	0xc0 <get_match_counts+0x41>
     149:      	movq	-0x8(%rbp), %rax
     14d:      	leave
     14e:      	retq
```
