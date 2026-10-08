# ELF RE report: `c2prj1_cards/deck-c4.o`

- size: 4752 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `deck-c4.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `__PRETTY_FUNCTION__.2914` | STT_OBJECT | STB_LOCAL | .rodata | 0xb0 | 18 |
| `CHECK_GRADER_ENV` | STT_FUNC | STB_LOCAL | .text | 0x0 | 127 |
| `make_deck_exclude` | STT_FUNC | STB_GLOBAL | .text | 0x7f | 337 |
| `add_card_to` | STT_FUNC | STB_GLOBAL | .text | 0x1d0 | 204 |
| `add_empty_card` | STT_FUNC | STB_GLOBAL | .text | 0x29c | 232 |
| `free_deck` | STT_FUNC | STB_GLOBAL | .text | 0x384 | 119 |
| `build_remaining_deck` | STT_FUNC | STB_GLOBAL | .text | 0x3fb | 288 |

## Undefined (imported) symbols

```
_GLOBAL_OFFSET_TABLE_
getenv
atoi
stderr
fprintf
abort
malloc
card_from_num
deck_contains
__assert_fail
realloc
free
```

## String literals in .rodata

- `+0x0`  "PokerProjectStep"
- `+0x18`  "Oops, you seem to be using our code for a step you were supposed to do! (%d,%d,%d,%d)\n"
- `+0x6f`  "deck-c4.c"
- `+0x79`  "index < ans->n_cards"
- `+0x8e`  "index == ans->n_cards"
- `+0xb0`  "make_deck_exclude"

## String literals grouped by referencing function

### `CHECK_GRADER_ENV`

- "PokerProjectStep"
- "Oops, you seem to be using our code for a step you were supposed to do! (%d,%d,%d,%d)\n"

### `make_deck_exclude`

- "make_deck_exclude"
- "deck-c4.c"
- "index < ans->n_cards"
- "index == ans->n_cards"

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/c2prj1_cards/deck-c4.o:	file format elf64-x86-64

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

000000000000007f <make_deck_exclude>:
      7f:      	endbr64
      83:      	pushq	%rbp
      84:      	movq	%rsp, %rbp
      87:      	pushq	%rbx
      88:      	subq	$0x38, %rsp
      8c:      	movq	%rdi, -0x38(%rbp)
      90:      	movl	$0x1, %esi
      95:      	movl	$0x4, %edi
      9a:      	callq	0x0 <CHECK_GRADER_ENV>
      9f:      	movl	$0x10, %edi
      a4:      	callq	0xa9 <make_deck_exclude+0x2a>
;   malloc+-4
      a9:      	movq	%rax, -0x20(%rbp)
      ad:      	movq	-0x38(%rbp), %rax
      b1:      	movq	0x8(%rax), %rax
      b5:      	movl	$0x34, %edx
      ba:      	subq	%rax, %rdx
      bd:      	movq	-0x20(%rbp), %rax
      c1:      	movq	%rdx, 0x8(%rax)
      c5:      	movq	-0x20(%rbp), %rax
      c9:      	movq	0x8(%rax), %rax
      cd:      	shlq	$0x3, %rax
      d1:      	movq	%rax, %rdi
      d4:      	callq	0xd9 <make_deck_exclude+0x5a>
;   malloc+-4
      d9:      	movq	%rax, %rdx
      dc:      	movq	-0x20(%rbp), %rax
      e0:      	movq	%rdx, (%rax)
      e3:      	movq	$0x0, -0x28(%rbp)
      eb:      	movl	$0x0, -0x2c(%rbp)
      f2:      	jmp	0x18e <make_deck_exclude+0x10f>
      f7:      	movl	-0x2c(%rbp), %eax
      fa:      	movl	%eax, %edi
      fc:      	callq	0x101 <make_deck_exclude+0x82>
;   card_from_num+-4
     101:      	movq	%rax, -0x18(%rbp)
     105:      	movq	-0x18(%rbp), %rdx
     109:      	movq	-0x38(%rbp), %rax
     10d:      	movq	%rdx, %rsi
     110:      	movq	%rax, %rdi
     113:      	callq	0x118 <make_deck_exclude+0x99>
;   deck_contains+-4
     118:      	testl	%eax, %eax
     11a:      	jne	0x18a <make_deck_exclude+0x10b>
     11c:      	movq	-0x20(%rbp), %rax
     120:      	movq	(%rax), %rax
     123:      	movq	-0x28(%rbp), %rdx
     127:      	shlq	$0x3, %rdx
     12b:      	leaq	(%rax,%rdx), %rbx
     12f:      	movl	$0x8, %edi
     134:      	callq	0x139 <make_deck_exclude+0xba>
;   malloc+-4
     139:      	movq	%rax, (%rbx)
     13c:      	movq	-0x20(%rbp), %rax
     140:      	movq	(%rax), %rax
     143:      	movq	-0x28(%rbp), %rdx
     147:      	shlq	$0x3, %rdx
     14b:      	addq	%rdx, %rax
     14e:      	movq	(%rax), %rax
     151:      	movq	-0x18(%rbp), %rdx
     155:      	movq	%rdx, (%rax)
     158:      	movq	-0x20(%rbp), %rax
     15c:      	movq	0x8(%rax), %rax
     160:      	cmpq	%rax, -0x28(%rbp)
     164:      	jb	0x185 <make_deck_exclude+0x106>
     166:      	leaq	(%rip), %rcx            # 0x16d <make_deck_exclude+0xee>
;   .rodata -> "make_deck_exclude"
     16d:      	movl	$0x12, %edx
     172:      	leaq	(%rip), %rsi            # 0x179 <make_deck_exclude+0xfa>
;   .rodata -> "deck-c4.c"
     179:      	leaq	(%rip), %rdi            # 0x180 <make_deck_exclude+0x101>
;   .rodata -> "index < ans->n_cards"
     180:      	callq	0x185 <make_deck_exclude+0x106>
;   __assert_fail+-4
     185:      	addq	$0x1, -0x28(%rbp)
     18a:      	addl	$0x1, -0x2c(%rbp)
     18e:      	cmpl	$0x33, -0x2c(%rbp)
     192:      	jbe	0xf7 <make_deck_exclude+0x78>
     198:      	movq	-0x20(%rbp), %rax
     19c:      	movq	0x8(%rax), %rax
     1a0:      	cmpq	%rax, -0x28(%rbp)
     1a4:      	je	0x1c5 <make_deck_exclude+0x146>
     1a6:      	leaq	(%rip), %rcx            # 0x1ad <make_deck_exclude+0x12e>
;   .rodata -> "make_deck_exclude"
     1ad:      	movl	$0x16, %edx
     1b2:      	leaq	(%rip), %rsi            # 0x1b9 <make_deck_exclude+0x13a>
;   .rodata -> "deck-c4.c"
     1b9:      	leaq	(%rip), %rdi            # 0x1c0 <make_deck_exclude+0x141>
;   .rodata -> "index == ans->n_cards"
     1c0:      	callq	0x1c5 <make_deck_exclude+0x146>
;   __assert_fail+-4
     1c5:      	movq	-0x20(%rbp), %rax
     1c9:      	addq	$0x38, %rsp
     1cd:      	popq	%rbx
     1ce:      	popq	%rbp
     1cf:      	retq

00000000000001d0 <add_card_to>:
     1d0:      	endbr64
     1d4:      	pushq	%rbp
     1d5:      	movq	%rsp, %rbp
     1d8:      	pushq	%rbx
     1d9:      	subq	$0x18, %rsp
     1dd:      	movq	%rdi, -0x18(%rbp)
     1e1:      	movq	%rsi, -0x20(%rbp)
     1e5:      	movl	$0x1, %esi
     1ea:      	movl	$0x4, %edi
     1ef:      	callq	0x0 <CHECK_GRADER_ENV>
     1f4:      	movq	-0x20(%rbp), %rdx
     1f8:      	movq	-0x18(%rbp), %rax
     1fc:      	movq	%rdx, %rsi
     1ff:      	movq	%rax, %rdi
     202:      	callq	0x207 <add_card_to+0x37>
;   deck_contains+-4
     207:      	testl	%eax, %eax
     209:      	jne	0x294 <add_card_to+0xc4>
     20f:      	movq	-0x18(%rbp), %rax
     213:      	movq	0x8(%rax), %rax
     217:      	addq	$0x1, %rax
     21b:      	leaq	(,%rax,8), %rdx
     223:      	movq	-0x18(%rbp), %rax
     227:      	movq	(%rax), %rax
     22a:      	movq	%rdx, %rsi
     22d:      	movq	%rax, %rdi
     230:      	callq	0x235 <add_card_to+0x65>
;   realloc+-4
     235:      	movq	-0x18(%rbp), %rdx
     239:      	movq	%rax, (%rdx)
     23c:      	movq	-0x18(%rbp), %rax
     240:      	movq	(%rax), %rdx
     243:      	movq	-0x18(%rbp), %rax
     247:      	movq	0x8(%rax), %rax
     24b:      	shlq	$0x3, %rax
     24f:      	leaq	(%rdx,%rax), %rbx
     253:      	movl	$0x8, %edi
     258:      	callq	0x25d <add_card_to+0x8d>
;   malloc+-4
     25d:      	movq	%rax, (%rbx)
     260:      	movq	-0x18(%rbp), %rax
     264:      	movq	(%rax), %rdx
     267:      	movq	-0x18(%rbp), %rax
     26b:      	movq	0x8(%rax), %rax
     26f:      	shlq	$0x3, %rax
     273:      	addq	%rdx, %rax
     276:      	movq	(%rax), %rax
     279:      	movq	-0x20(%rbp), %rdx
     27d:      	movq	%rdx, (%rax)
     280:      	movq	-0x18(%rbp), %rax
     284:      	movq	0x8(%rax), %rax
     288:      	leaq	0x1(%rax), %rdx
     28c:      	movq	-0x18(%rbp), %rax
     290:      	movq	%rdx, 0x8(%rax)
     294:      	nop
     295:      	addq	$0x18, %rsp
     299:      	popq	%rbx
     29a:      	popq	%rbp
     29b:      	retq

000000000000029c <add_empty_card>:
     29c:      	endbr64
     2a0:      	pushq	%rbp
     2a1:      	movq	%rsp, %rbp
     2a4:      	pushq	%rbx
     2a5:      	subq	$0x18, %rsp
     2a9:      	movq	%rdi, -0x18(%rbp)
     2ad:      	movl	$0x1, %esi
     2b2:      	movl	$0x4, %edi
     2b7:      	callq	0x0 <CHECK_GRADER_ENV>
     2bc:      	movq	-0x18(%rbp), %rax
     2c0:      	movq	0x8(%rax), %rax
     2c4:      	addq	$0x1, %rax
     2c8:      	leaq	(,%rax,8), %rdx
     2d0:      	movq	-0x18(%rbp), %rax
     2d4:      	movq	(%rax), %rax
     2d7:      	movq	%rdx, %rsi
     2da:      	movq	%rax, %rdi
     2dd:      	callq	0x2e2 <add_empty_card+0x46>
;   realloc+-4
     2e2:      	movq	-0x18(%rbp), %rdx
     2e6:      	movq	%rax, (%rdx)
     2e9:      	movq	-0x18(%rbp), %rax
     2ed:      	movq	(%rax), %rdx
     2f0:      	movq	-0x18(%rbp), %rax
     2f4:      	movq	0x8(%rax), %rax
     2f8:      	shlq	$0x3, %rax
     2fc:      	leaq	(%rdx,%rax), %rbx
     300:      	movl	$0x8, %edi
     305:      	callq	0x30a <add_empty_card+0x6e>
;   malloc+-4
     30a:      	movq	%rax, (%rbx)
     30d:      	movq	-0x18(%rbp), %rax
     311:      	movq	(%rax), %rdx
     314:      	movq	-0x18(%rbp), %rax
     318:      	movq	0x8(%rax), %rax
     31c:      	shlq	$0x3, %rax
     320:      	addq	%rdx, %rax
     323:      	movq	(%rax), %rax
     326:      	movl	$0x0, (%rax)
     32c:      	movq	-0x18(%rbp), %rax
     330:      	movq	(%rax), %rdx
     333:      	movq	-0x18(%rbp), %rax
     337:      	movq	0x8(%rax), %rax
     33b:      	shlq	$0x3, %rax
     33f:      	addq	%rdx, %rax
     342:      	movq	(%rax), %rax
     345:      	movl	$0x0, 0x4(%rax)
     34c:      	movq	-0x18(%rbp), %rax
     350:      	movq	0x8(%rax), %rax
     354:      	leaq	0x1(%rax), %rdx
     358:      	movq	-0x18(%rbp), %rax
     35c:      	movq	%rdx, 0x8(%rax)
     360:      	movq	-0x18(%rbp), %rax
     364:      	movq	(%rax), %rdx
     367:      	movq	-0x18(%rbp), %rax
     36b:      	movq	0x8(%rax), %rax
     36f:      	shlq	$0x3, %rax
     373:      	subq	$0x8, %rax
     377:      	addq	%rdx, %rax
     37a:      	movq	(%rax), %rax
     37d:      	addq	$0x18, %rsp
     381:      	popq	%rbx
     382:      	popq	%rbp
     383:      	retq

0000000000000384 <free_deck>:
     384:      	endbr64
     388:      	pushq	%rbp
     389:      	movq	%rsp, %rbp
     38c:      	subq	$0x20, %rsp
     390:      	movq	%rdi, -0x18(%rbp)
     394:      	movl	$0x1, %esi
     399:      	movl	$0x4, %edi
     39e:      	callq	0x0 <CHECK_GRADER_ENV>
     3a3:      	movq	$0x0, -0x8(%rbp)
     3ab:      	jmp	0x3cf <free_deck+0x4b>
     3ad:      	movq	-0x18(%rbp), %rax
     3b1:      	movq	(%rax), %rax
     3b4:      	movq	-0x8(%rbp), %rdx
     3b8:      	shlq	$0x3, %rdx
     3bc:      	addq	%rdx, %rax
     3bf:      	movq	(%rax), %rax
     3c2:      	movq	%rax, %rdi
     3c5:      	callq	0x3ca <free_deck+0x46>
;   free+-4
     3ca:      	addq	$0x1, -0x8(%rbp)
     3cf:      	movq	-0x18(%rbp), %rax
     3d3:      	movq	0x8(%rax), %rax
     3d7:      	cmpq	%rax, -0x8(%rbp)
     3db:      	jb	0x3ad <free_deck+0x29>
     3dd:      	movq	-0x18(%rbp), %rax
     3e1:      	movq	(%rax), %rax
     3e4:      	movq	%rax, %rdi
     3e7:      	callq	0x3ec <free_deck+0x68>
;   free+-4
     3ec:      	movq	-0x18(%rbp), %rax
     3f0:      	movq	%rax, %rdi
     3f3:      	callq	0x3f8 <free_deck+0x74>
;   free+-4
     3f8:      	nop
     3f9:      	leave
     3fa:      	retq

00000000000003fb <build_remaining_deck>:
     3fb:      	endbr64
     3ff:      	pushq	%rbp
     400:      	movq	%rsp, %rbp
     403:      	subq	$0x30, %rsp
     407:      	movq	%rdi, -0x28(%rbp)
     40b:      	movq	%rsi, -0x30(%rbp)
     40f:      	movl	$0x1, %esi
     414:      	movl	$0x4, %edi
     419:      	callq	0x0 <CHECK_GRADER_ENV>
     41e:      	movl	$0x10, %edi
     423:      	callq	0x428 <build_remaining_deck+0x2d>
;   malloc+-4
     428:      	movq	%rax, -0x10(%rbp)
     42c:      	movq	-0x10(%rbp), %rax
     430:      	movq	$0x0, (%rax)
     437:      	movq	-0x10(%rbp), %rax
     43b:      	movq	$0x0, 0x8(%rax)
     443:      	movq	$0x0, -0x20(%rbp)
     44b:      	jmp	0x4eb <build_remaining_deck+0xf0>
     450:      	movq	$0x0, -0x18(%rbp)
     458:      	jmp	0x4c2 <build_remaining_deck+0xc7>
     45a:      	movq	-0x20(%rbp), %rax
     45e:      	leaq	(,%rax,8), %rdx
     466:      	movq	-0x28(%rbp), %rax
     46a:      	addq	%rdx, %rax
     46d:      	movq	(%rax), %rax
     470:      	movq	(%rax), %rax
     473:      	movq	-0x18(%rbp), %rdx
     477:      	shlq	$0x3, %rdx
     47b:      	addq	%rdx, %rax
     47e:      	movq	(%rax), %rax
     481:      	movl	(%rax), %eax
     483:      	testl	%eax, %eax
     485:      	je	0x4bd <build_remaining_deck+0xc2>
     487:      	movq	-0x20(%rbp), %rax
     48b:      	leaq	(,%rax,8), %rdx
     493:      	movq	-0x28(%rbp), %rax
     497:      	addq	%rdx, %rax
     49a:      	movq	(%rax), %rax
     49d:      	movq	(%rax), %rax
     4a0:      	movq	-0x18(%rbp), %rdx
     4a4:      	shlq	$0x3, %rdx
     4a8:      	addq	%rdx, %rax
     4ab:      	movq	(%rax), %rdx
     4ae:      	movq	-0x10(%rbp), %rax
     4b2:      	movq	(%rdx), %rsi
     4b5:      	movq	%rax, %rdi
     4b8:      	callq	0x4bd <build_remaining_deck+0xc2>
;   add_card_to+-4
     4bd:      	addq	$0x1, -0x18(%rbp)
     4c2:      	movq	-0x20(%rbp), %rax
     4c6:      	leaq	(,%rax,8), %rdx
     4ce:      	movq	-0x28(%rbp), %rax
     4d2:      	addq	%rdx, %rax
     4d5:      	movq	(%rax), %rax
     4d8:      	movq	0x8(%rax), %rax
     4dc:      	cmpq	%rax, -0x18(%rbp)
     4e0:      	jb	0x45a <build_remaining_deck+0x5f>
     4e6:      	addq	$0x1, -0x20(%rbp)
     4eb:      	movq	-0x20(%rbp), %rax
     4ef:      	cmpq	-0x30(%rbp), %rax
     4f3:      	jb	0x450 <build_remaining_deck+0x55>
     4f9:      	movq	-0x10(%rbp), %rax
     4fd:      	movq	%rax, %rdi
     500:      	callq	0x505 <build_remaining_deck+0x10a>
;   make_deck_exclude+-4
     505:      	movq	%rax, -0x8(%rbp)
     509:      	movq	-0x10(%rbp), %rax
     50d:      	movq	%rax, %rdi
     510:      	callq	0x515 <build_remaining_deck+0x11a>
;   free_deck+-4
     515:      	movq	-0x8(%rbp), %rax
     519:      	leave
     51a:      	retq
```
