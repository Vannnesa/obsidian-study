# ELF RE report: `c3prj2_eval/future.o`

- size: 3216 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `future.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `__PRETTY_FUNCTION__.2932` | STT_OBJECT | STB_LOCAL | .rodata | 0xa0 | 23 |
| `CHECK_GRADER_ENV` | STT_FUNC | STB_LOCAL | .text | 0x0 | 127 |
| `add_future_card` | STT_FUNC | STB_GLOBAL | .text | 0x7f | 312 |
| `future_cards_from_deck` | STT_FUNC | STB_GLOBAL | .text | 0x1b7 | 219 |

## Undefined (imported) symbols

```
_GLOBAL_OFFSET_TABLE_
getenv
atoi
stderr
fprintf
abort
realloc
__assert_fail
```

## String literals in .rodata

- `+0x0`  "PokerProjectStep"
- `+0x18`  "Oops, you seem to be using our code for a step you were supposed to do! (%d,%d,%d,%d)\n"
- `+0x6f`  "future.c"
- `+0x78`  "fc->n_decks <= deck->n_cards"
- `+0xa0`  "future_cards_from_deck"

## String literals grouped by referencing function

### `CHECK_GRADER_ENV`

- "PokerProjectStep"
- "Oops, you seem to be using our code for a step you were supposed to do! (%d,%d,%d,%d)\n"

### `future_cards_from_deck`

- "future_cards_from_deck"
- "future.c"
- "fc->n_decks <= deck->n_cards"

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/c3prj2_eval/future.o:	file format elf64-x86-64

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

000000000000007f <add_future_card>:
      7f:      	endbr64
      83:      	pushq	%rbp
      84:      	movq	%rsp, %rbp
      87:      	subq	$0x30, %rsp
      8b:      	movq	%rdi, -0x18(%rbp)
      8f:      	movq	%rsi, -0x20(%rbp)
      93:      	movq	%rdx, -0x28(%rbp)
      97:      	movl	$0x2, %esi
      9c:      	movl	$0x4, %edi
      a1:      	callq	0x0 <CHECK_GRADER_ENV>
      a6:      	movq	-0x18(%rbp), %rax
      aa:      	movq	0x8(%rax), %rax
      ae:      	cmpq	%rax, -0x20(%rbp)
      b2:      	jb	0x140 <add_future_card+0xc1>
      b8:      	movq	-0x20(%rbp), %rax
      bc:      	addq	$0x1, %rax
      c0:      	shlq	$0x4, %rax
      c4:      	movq	%rax, %rdx
      c7:      	movq	-0x18(%rbp), %rax
      cb:      	movq	(%rax), %rax
      ce:      	movq	%rdx, %rsi
      d1:      	movq	%rax, %rdi
      d4:      	callq	0xd9 <add_future_card+0x5a>
;   realloc+-4
      d9:      	movq	-0x18(%rbp), %rdx
      dd:      	movq	%rax, (%rdx)
      e0:      	movq	-0x18(%rbp), %rax
      e4:      	movq	0x8(%rax), %rax
      e8:      	movq	%rax, -0x10(%rbp)
      ec:      	jmp	0x126 <add_future_card+0xa7>
      ee:      	movq	-0x18(%rbp), %rax
      f2:      	movq	(%rax), %rax
      f5:      	movq	-0x10(%rbp), %rdx
      f9:      	shlq	$0x4, %rdx
      fd:      	addq	%rdx, %rax
     100:      	movq	$0x0, (%rax)
     107:      	movq	-0x18(%rbp), %rax
     10b:      	movq	(%rax), %rax
     10e:      	movq	-0x10(%rbp), %rdx
     112:      	shlq	$0x4, %rdx
     116:      	addq	%rdx, %rax
     119:      	movq	$0x0, 0x8(%rax)
     121:      	addq	$0x1, -0x10(%rbp)
     126:      	movq	-0x10(%rbp), %rax
     12a:      	cmpq	-0x20(%rbp), %rax
     12e:      	jbe	0xee <add_future_card+0x6f>
     130:      	movq	-0x20(%rbp), %rax
     134:      	leaq	0x1(%rax), %rdx
     138:      	movq	-0x18(%rbp), %rax
     13c:      	movq	%rdx, 0x8(%rax)
     140:      	movq	-0x18(%rbp), %rax
     144:      	movq	(%rax), %rax
     147:      	movq	-0x20(%rbp), %rdx
     14b:      	shlq	$0x4, %rdx
     14f:      	addq	%rdx, %rax
     152:      	movq	%rax, -0x8(%rbp)
     156:      	movq	-0x8(%rbp), %rax
     15a:      	movq	0x8(%rax), %rax
     15e:      	addq	$0x1, %rax
     162:      	leaq	(,%rax,8), %rdx
     16a:      	movq	-0x8(%rbp), %rax
     16e:      	movq	(%rax), %rax
     171:      	movq	%rdx, %rsi
     174:      	movq	%rax, %rdi
     177:      	callq	0x17c <add_future_card+0xfd>
;   realloc+-4
     17c:      	movq	-0x8(%rbp), %rdx
     180:      	movq	%rax, (%rdx)
     183:      	movq	-0x8(%rbp), %rax
     187:      	movq	(%rax), %rdx
     18a:      	movq	-0x8(%rbp), %rax
     18e:      	movq	0x8(%rax), %rax
     192:      	shlq	$0x3, %rax
     196:      	addq	%rax, %rdx
     199:      	movq	-0x28(%rbp), %rax
     19d:      	movq	%rax, (%rdx)
     1a0:      	movq	-0x8(%rbp), %rax
     1a4:      	movq	0x8(%rax), %rax
     1a8:      	leaq	0x1(%rax), %rdx
     1ac:      	movq	-0x8(%rbp), %rax
     1b0:      	movq	%rdx, 0x8(%rax)
     1b4:      	nop
     1b5:      	leave
     1b6:      	retq

00000000000001b7 <future_cards_from_deck>:
     1b7:      	endbr64
     1bb:      	pushq	%rbp
     1bc:      	movq	%rsp, %rbp
     1bf:      	subq	$0x30, %rsp
     1c3:      	movq	%rdi, -0x28(%rbp)
     1c7:      	movq	%rsi, -0x30(%rbp)
     1cb:      	movl	$0x2, %esi
     1d0:      	movl	$0x4, %edi
     1d5:      	callq	0x0 <CHECK_GRADER_ENV>
     1da:      	movq	-0x30(%rbp), %rax
     1de:      	movq	0x8(%rax), %rdx
     1e2:      	movq	-0x28(%rbp), %rax
     1e6:      	movq	0x8(%rax), %rax
     1ea:      	cmpq	%rax, %rdx
     1ed:      	jbe	0x20e <future_cards_from_deck+0x57>
     1ef:      	leaq	(%rip), %rcx            # 0x1f6 <future_cards_from_deck+0x3f>
;   .rodata -> "future_cards_from_deck"
     1f6:      	movl	$0x1c, %edx
     1fb:      	leaq	(%rip), %rsi            # 0x202 <future_cards_from_deck+0x4b>
;   .rodata -> "future.c"
     202:      	leaq	(%rip), %rdi            # 0x209 <future_cards_from_deck+0x52>
;   .rodata -> "fc->n_decks <= deck->n_cards"
     209:      	callq	0x20e <future_cards_from_deck+0x57>
;   __assert_fail+-4
     20e:      	movq	$0x0, -0x18(%rbp)
     216:      	jmp	0x280 <future_cards_from_deck+0xc9>
     218:      	movq	-0x30(%rbp), %rax
     21c:      	movq	(%rax), %rax
     21f:      	movq	-0x18(%rbp), %rdx
     223:      	shlq	$0x4, %rdx
     227:      	addq	%rdx, %rax
     22a:      	movq	%rax, -0x8(%rbp)
     22e:      	movq	$0x0, -0x10(%rbp)
     236:      	jmp	0x26d <future_cards_from_deck+0xb6>
     238:      	movq	-0x28(%rbp), %rax
     23c:      	movq	(%rax), %rax
     23f:      	movq	-0x18(%rbp), %rdx
     243:      	shlq	$0x3, %rdx
     247:      	addq	%rdx, %rax
     24a:      	movq	(%rax), %rdx
     24d:      	movq	-0x8(%rbp), %rax
     251:      	movq	(%rax), %rax
     254:      	movq	-0x10(%rbp), %rcx
     258:      	shlq	$0x3, %rcx
     25c:      	addq	%rcx, %rax
     25f:      	movq	(%rax), %rax
     262:      	movq	(%rdx), %rdx
     265:      	movq	%rdx, (%rax)
     268:      	addq	$0x1, -0x10(%rbp)
     26d:      	movq	-0x8(%rbp), %rax
     271:      	movq	0x8(%rax), %rax
     275:      	cmpq	%rax, -0x10(%rbp)
     279:      	jb	0x238 <future_cards_from_deck+0x81>
     27b:      	addq	$0x1, -0x18(%rbp)
     280:      	movq	-0x30(%rbp), %rax
     284:      	movq	0x8(%rax), %rax
     288:      	cmpq	%rax, -0x18(%rbp)
     28c:      	jb	0x218 <future_cards_from_deck+0x61>
     28e:      	nop
     28f:      	nop
     290:      	leave
     291:      	retq
```
