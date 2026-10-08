# ELF RE report: `c2prj1_cards/deck.o`

- size: 4144 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `deck.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `__PRETTY_FUNCTION__.2930` | STT_OBJECT | STB_LOCAL | .rodata | 0xc0 | 8 |
| `__PRETTY_FUNCTION__.2940` | STT_OBJECT | STB_LOCAL | .rodata | 0xd0 | 17 |
| `CHECK_GRADER_ENV` | STT_FUNC | STB_LOCAL | .text | 0x0 | 127 |
| `print_hand` | STT_FUNC | STB_GLOBAL | .text | 0x7f | 103 |
| `deck_contains` | STT_FUNC | STB_GLOBAL | .text | 0xe6 | 139 |
| `shuffle` | STT_FUNC | STB_GLOBAL | .text | 0x171 | 333 |
| `assert_full_deck` | STT_FUNC | STB_GLOBAL | .text | 0x2be | 162 |

## Undefined (imported) symbols

```
_GLOBAL_OFFSET_TABLE_
getenv
atoi
stderr
fprintf
abort
print_card
putchar
calloc
random
__assert_fail
free
card_from_num
```

## String literals in .rodata

- `+0x0`  "PokerProjectStep"
- `+0x18`  "Oops, you seem to be using our code for a step you were supposed to do! (%d,%d,%d,%d)\n"
- `+0x6f`  "deck.c"
- `+0x76`  "j < d->n_cards"
- `+0x85`  "d->n_cards == 52"
- `+0x98`  "deck_contains(d, card_from_num(i))"
- `+0xc0`  "shuffle"
- `+0xd0`  "assert_full_deck"

## String literals grouped by referencing function

### `CHECK_GRADER_ENV`

- "PokerProjectStep"
- "Oops, you seem to be using our code for a step you were supposed to do! (%d,%d,%d,%d)\n"

### `shuffle`

- "shuffle"
- "deck.c"
- "j < d->n_cards"

### `assert_full_deck`

- "assert_full_deck"
- "deck.c"
- "d->n_cards == 52"
- "deck_contains(d, card_from_num(i))"

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/c2prj1_cards/deck.o:	file format elf64-x86-64

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

000000000000007f <print_hand>:
      7f:      	endbr64
      83:      	pushq	%rbp
      84:      	movq	%rsp, %rbp
      87:      	subq	$0x20, %rsp
      8b:      	movq	%rdi, -0x18(%rbp)
      8f:      	movl	$0x1, %esi
      94:      	movl	$0x3, %edi
      99:      	callq	0x0 <CHECK_GRADER_ENV>
      9e:      	movq	$0x0, -0x8(%rbp)
      a6:      	jmp	0xd4 <print_hand+0x55>
      a8:      	movq	-0x18(%rbp), %rax
      ac:      	movq	(%rax), %rax
      af:      	movq	-0x8(%rbp), %rdx
      b3:      	shlq	$0x3, %rdx
      b7:      	addq	%rdx, %rax
      ba:      	movq	(%rax), %rax
      bd:      	movq	(%rax), %rdi
      c0:      	callq	0xc5 <print_hand+0x46>
;   print_card+-4
      c5:      	movl	$0x20, %edi
      ca:      	callq	0xcf <print_hand+0x50>
;   putchar+-4
      cf:      	addq	$0x1, -0x8(%rbp)
      d4:      	movq	-0x18(%rbp), %rax
      d8:      	movq	0x8(%rax), %rax
      dc:      	cmpq	%rax, -0x8(%rbp)
      e0:      	jb	0xa8 <print_hand+0x29>
      e2:      	nop
      e3:      	nop
      e4:      	leave
      e5:      	retq

00000000000000e6 <deck_contains>:
      e6:      	endbr64
      ea:      	pushq	%rbp
      eb:      	movq	%rsp, %rbp
      ee:      	subq	$0x20, %rsp
      f2:      	movq	%rdi, -0x18(%rbp)
      f6:      	movq	%rsi, -0x20(%rbp)
      fa:      	movl	$0x1, %esi
      ff:      	movl	$0x3, %edi
     104:      	callq	0x0 <CHECK_GRADER_ENV>
     109:      	movq	$0x0, -0x8(%rbp)
     111:      	jmp	0x15c <deck_contains+0x76>
     113:      	movq	-0x18(%rbp), %rax
     117:      	movq	(%rax), %rax
     11a:      	movq	-0x8(%rbp), %rdx
     11e:      	shlq	$0x3, %rdx
     122:      	addq	%rdx, %rax
     125:      	movq	(%rax), %rax
     128:      	movl	(%rax), %edx
     12a:      	movl	-0x20(%rbp), %eax
     12d:      	cmpl	%eax, %edx
     12f:      	jne	0x157 <deck_contains+0x71>
     131:      	movq	-0x18(%rbp), %rax
     135:      	movq	(%rax), %rax
     138:      	movq	-0x8(%rbp), %rdx
     13c:      	shlq	$0x3, %rdx
     140:      	addq	%rdx, %rax
     143:      	movq	(%rax), %rax
     146:      	movl	0x4(%rax), %edx
     149:      	movl	-0x1c(%rbp), %eax
     14c:      	cmpl	%eax, %edx
     14e:      	jne	0x157 <deck_contains+0x71>
     150:      	movl	$0x1, %eax
     155:      	jmp	0x16f <deck_contains+0x89>
     157:      	addq	$0x1, -0x8(%rbp)
     15c:      	movq	-0x18(%rbp), %rax
     160:      	movq	0x8(%rax), %rax
     164:      	cmpq	%rax, -0x8(%rbp)
     168:      	jb	0x113 <deck_contains+0x2d>
     16a:      	movl	$0x0, %eax
     16f:      	leave
     170:      	retq

0000000000000171 <shuffle>:
     171:      	endbr64
     175:      	pushq	%rbp
     176:      	movq	%rsp, %rbp
     179:      	subq	$0x40, %rsp
     17d:      	movq	%rdi, -0x38(%rbp)
     181:      	movl	$0x1, %esi
     186:      	movl	$0x3, %edi
     18b:      	callq	0x0 <CHECK_GRADER_ENV>
     190:      	movq	-0x38(%rbp), %rax
     194:      	movq	0x8(%rax), %rax
     198:      	movl	$0x8, %esi
     19d:      	movq	%rax, %rdi
     1a0:      	callq	0x1a5 <shuffle+0x34>
;   calloc+-4
     1a5:      	movq	%rax, -0x8(%rbp)
     1a9:      	movq	-0x38(%rbp), %rax
     1ad:      	movq	0x8(%rax), %rax
     1b1:      	movq	%rax, -0x28(%rbp)
     1b5:      	movq	$0x0, -0x20(%rbp)
     1bd:      	jmp	0x28f <shuffle+0x11e>
     1c2:      	callq	0x1c7 <shuffle+0x56>
;   random+-4
     1c7:      	movq	%rax, -0x18(%rbp)
     1cb:      	movq	-0x18(%rbp), %rax
     1cf:      	movl	$0x0, %edx
     1d4:      	divq	-0x28(%rbp)
     1d8:      	movq	%rdx, -0x18(%rbp)
     1dc:      	movq	$0x0, -0x10(%rbp)
     1e4:      	jmp	0x238 <shuffle+0xc7>
     1e6:      	movq	-0x10(%rbp), %rax
     1ea:      	leaq	(,%rax,8), %rdx
     1f2:      	movq	-0x8(%rbp), %rax
     1f6:      	addq	%rdx, %rax
     1f9:      	movq	(%rax), %rax
     1fc:      	testq	%rax, %rax
     1ff:      	jne	0x206 <shuffle+0x95>
     201:      	subq	$0x1, -0x18(%rbp)
     206:      	addq	$0x1, -0x10(%rbp)
     20b:      	movq	-0x38(%rbp), %rax
     20f:      	movq	0x8(%rax), %rax
     213:      	cmpq	%rax, -0x10(%rbp)
     217:      	jb	0x238 <shuffle+0xc7>
     219:      	leaq	(%rip), %rcx            # 0x220 <shuffle+0xaf>
;   .rodata -> "shuffle"
     220:      	movl	$0x27, %edx
     225:      	leaq	(%rip), %rsi            # 0x22c <shuffle+0xbb>
;   .rodata -> "deck.c"
     22c:      	leaq	(%rip), %rdi            # 0x233 <shuffle+0xc2>
;   .rodata -> "j < d->n_cards"
     233:      	callq	0x238 <shuffle+0xc7>
;   __assert_fail+-4
     238:      	cmpq	$0x0, -0x18(%rbp)
     23d:      	jne	0x1e6 <shuffle+0x75>
     23f:      	movq	-0x10(%rbp), %rax
     243:      	leaq	(,%rax,8), %rdx
     24b:      	movq	-0x8(%rbp), %rax
     24f:      	addq	%rdx, %rax
     252:      	movq	(%rax), %rax
     255:      	testq	%rax, %rax
     258:      	jne	0x1e6 <shuffle+0x75>
     25a:      	movq	-0x38(%rbp), %rax
     25e:      	movq	(%rax), %rax
     261:      	movq	-0x20(%rbp), %rdx
     265:      	shlq	$0x3, %rdx
     269:      	addq	%rdx, %rax
     26c:      	movq	-0x10(%rbp), %rdx
     270:      	leaq	(,%rdx,8), %rcx
     278:      	movq	-0x8(%rbp), %rdx
     27c:      	addq	%rcx, %rdx
     27f:      	movq	(%rax), %rax
     282:      	movq	%rax, (%rdx)
     285:      	subq	$0x1, -0x28(%rbp)
     28a:      	addq	$0x1, -0x20(%rbp)
     28f:      	movq	-0x38(%rbp), %rax
     293:      	movq	0x8(%rax), %rax
     297:      	cmpq	%rax, -0x20(%rbp)
     29b:      	jb	0x1c2 <shuffle+0x51>
     2a1:      	movq	-0x38(%rbp), %rax
     2a5:      	movq	(%rax), %rax
     2a8:      	movq	%rax, %rdi
     2ab:      	callq	0x2b0 <shuffle+0x13f>
;   free+-4
     2b0:      	movq	-0x38(%rbp), %rax
     2b4:      	movq	-0x8(%rbp), %rdx
     2b8:      	movq	%rdx, (%rax)
     2bb:      	nop
     2bc:      	leave
     2bd:      	retq

00000000000002be <assert_full_deck>:
     2be:      	endbr64
     2c2:      	pushq	%rbp
     2c3:      	movq	%rsp, %rbp
     2c6:      	subq	$0x20, %rsp
     2ca:      	movq	%rdi, -0x18(%rbp)
     2ce:      	movl	$0x1, %esi
     2d3:      	movl	$0x3, %edi
     2d8:      	callq	0x0 <CHECK_GRADER_ENV>
     2dd:      	movq	-0x18(%rbp), %rax
     2e1:      	movq	0x8(%rax), %rax
     2e5:      	cmpq	$0x34, %rax
     2e9:      	je	0x30a <assert_full_deck+0x4c>
     2eb:      	leaq	(%rip), %rcx            # 0x2f2 <assert_full_deck+0x34>
;   .rodata -> "assert_full_deck"
     2f2:      	movl	$0x32, %edx
     2f7:      	leaq	(%rip), %rsi            # 0x2fe <assert_full_deck+0x40>
;   .rodata -> "deck.c"
     2fe:      	leaq	(%rip), %rdi            # 0x305 <assert_full_deck+0x47>
;   .rodata -> "d->n_cards == 52"
     305:      	callq	0x30a <assert_full_deck+0x4c>
;   __assert_fail+-4
     30a:      	movl	$0x0, -0x4(%rbp)
     311:      	jmp	0x356 <assert_full_deck+0x98>
     313:      	movl	-0x4(%rbp), %eax
     316:      	movl	%eax, %edi
     318:      	callq	0x31d <assert_full_deck+0x5f>
;   card_from_num+-4
     31d:      	movq	%rax, %rdx
     320:      	movq	-0x18(%rbp), %rax
     324:      	movq	%rdx, %rsi
     327:      	movq	%rax, %rdi
     32a:      	callq	0x32f <assert_full_deck+0x71>
;   deck_contains+-4
     32f:      	testl	%eax, %eax
     331:      	jne	0x352 <assert_full_deck+0x94>
     333:      	leaq	(%rip), %rcx            # 0x33a <assert_full_deck+0x7c>
;   .rodata -> "assert_full_deck"
     33a:      	movl	$0x34, %edx
     33f:      	leaq	(%rip), %rsi            # 0x346 <assert_full_deck+0x88>
;   .rodata -> "deck.c"
     346:      	leaq	(%rip), %rdi            # 0x34d <assert_full_deck+0x8f>
;   .rodata -> "deck_contains(d, card_from_num(i))"
     34d:      	callq	0x352 <assert_full_deck+0x94>
;   __assert_fail+-4
     352:      	addl	$0x1, -0x4(%rbp)
     356:      	cmpl	$0x33, -0x4(%rbp)
     35a:      	jbe	0x313 <assert_full_deck+0x55>
     35c:      	nop
     35d:      	nop
     35e:      	leave
     35f:      	retq
```
