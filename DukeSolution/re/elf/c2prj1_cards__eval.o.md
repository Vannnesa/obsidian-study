# ELF RE report: `c2prj1_cards/eval.o`

- size: 10480 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `eval.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `__PRETTY_FUNCTION__.2970` | STT_OBJECT | STB_LOCAL | .rodata | 0x1d0 | 23 |
| `__PRETTY_FUNCTION__.2985` | STT_OBJECT | STB_LOCAL | .rodata | 0x1f0 | 22 |
| `__PRETTY_FUNCTION__.3026` | STT_OBJECT | STB_LOCAL | .rodata | 0x208 | 14 |
| `__PRETTY_FUNCTION__.3044` | STT_OBJECT | STB_LOCAL | .rodata | 0x218 | 14 |
| `__PRETTY_FUNCTION__.3059` | STT_OBJECT | STB_LOCAL | .rodata | 0x228 | 14 |
| `CHECK_GRADER_ENV` | STT_FUNC | STB_LOCAL | .text | 0x0 | 127 |
| `card_ptr_comp` | STT_FUNC | STB_GLOBAL | .text | 0x7f | 127 |
| `flush_suit` | STT_FUNC | STB_GLOBAL | .text | 0xfe | 193 |
| `get_largest_element` | STT_FUNC | STB_GLOBAL | .text | 0x1bf | 138 |
| `get_match_index` | STT_FUNC | STB_GLOBAL | .text | 0x249 | 134 |
| `is_n_length_straight_at` | STT_FUNC | STB_LOCAL | .text | 0x2cf | 251 |
| `is_ace_low_straight_at` | STT_FUNC | STB_LOCAL | .text | 0x3ca | 155 |
| `is_straight_at` | STT_FUNC | STB_GLOBAL | .text | 0x465 | 167 |
| `build_hand_from_match` | STT_FUNC | STB_GLOBAL | .text | 0x50c | 369 |
| `find_secondary_pair` | STT_FUNC | STB_GLOBAL | .text | 0x67d | 231 |
| `compare_hands` | STT_FUNC | STB_GLOBAL | .text | 0x764 | 310 |
| `copy_straight` | STT_FUNC | STB_GLOBAL | .text | 0x89a | 396 |
| `find_straight` | STT_FUNC | STB_GLOBAL | .text | 0xa26 | 527 |
| `evaluate_hand` | STT_FUNC | STB_GLOBAL | .text | 0xc35 | 1420 |

## Undefined (imported) symbols

```
_GLOBAL_OFFSET_TABLE_
getenv
atoi
stderr
fprintf
abort
__stack_chk_fail
fwrite
__assert_fail
qsort
get_match_counts
free
```

## String literals in .rodata

- `+0x0`  "PokerProjectStep"
- `+0x18`  "Oops, you seem to be using our code for a step you were supposed to do! (%d,%d,%d,%d)\n"
- `+0x70`  "Couldnt find the matches I thought I had\n"
- `+0x9a`  "eval.c"
- `+0xa8`  "hand->cards[index]->value == VALUE_ACE"
- `+0xcf`  "n<=4"
- `+0xd8`  "fs == NUM_SUITS || from->cards[ind]->suit == fs"
- `+0x108`  "ind < from->n_cards"
- `+0x11c`  "nextv >= 2"
- `+0x127`  "to_ind <5"
- `+0x138`  "hand->cards[i]->value == VALUE_ACE && (fs == NUM_SUITS || hand->cards[i]->suit == fs)"
- `+0x18e`  "cpind < hand->n_cards"
- `+0x1a4`  "n_of_a_kind <= 4"
- `+0x1b5`  "n_of_a_kind ==2"
- `+0x1d0`  "is_ace_low_straight_at"
- `+0x1f0`  "build_hand_from_match"
- `+0x208`  "copy_straight"
- `+0x218`  "find_straight"
- `+0x228`  "evaluate_hand"

## String literals grouped by referencing function

### `CHECK_GRADER_ENV`

- "PokerProjectStep"
- "Oops, you seem to be using our code for a step you were supposed to do! (%d,%d,%d,%d)\n"

### `get_match_index`

- "Couldnt find the matches I thought I had\n"

### `is_ace_low_straight_at`

- "is_ace_low_straight_at"
- "eval.c"
- "hand->cards[index]->value == VALUE_ACE"

### `build_hand_from_match`

- "build_hand_from_match"
- "eval.c"
- "n<=4"

### `copy_straight`

- "copy_straight"
- "eval.c"
- "fs == NUM_SUITS || from->cards[ind]->suit == fs"
- "ind < from->n_cards"
- "nextv >= 2"
- "to_ind <5"

### `find_straight`

- "find_straight"
- "eval.c"
- "hand->cards[i]->value == VALUE_ACE && (fs == NUM_SUITS || hand->cards[i]->suit == fs)"
- "cpind < hand->n_cards"

### `evaluate_hand`

- "evaluate_hand"
- "eval.c"
- "n_of_a_kind <= 4"
- "n_of_a_kind ==2"

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/c2prj1_cards/eval.o:	file format elf64-x86-64

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

000000000000007f <card_ptr_comp>:
      7f:      	endbr64
      83:      	pushq	%rbp
      84:      	movq	%rsp, %rbp
      87:      	subq	$0x30, %rsp
      8b:      	movq	%rdi, -0x28(%rbp)
      8f:      	movq	%rsi, -0x30(%rbp)
      93:      	movl	$0x2, %esi
      98:      	movl	$0x3, %edi
      9d:      	callq	0x0 <CHECK_GRADER_ENV>
      a2:      	movq	-0x28(%rbp), %rax
      a6:      	movq	%rax, -0x20(%rbp)
      aa:      	movq	-0x30(%rbp), %rax
      ae:      	movq	%rax, -0x18(%rbp)
      b2:      	movq	-0x20(%rbp), %rax
      b6:      	movq	(%rax), %rax
      b9:      	movq	%rax, -0x10(%rbp)
      bd:      	movq	-0x18(%rbp), %rax
      c1:      	movq	(%rax), %rax
      c4:      	movq	%rax, -0x8(%rbp)
      c8:      	movq	-0x10(%rbp), %rax
      cc:      	movl	(%rax), %edx
      ce:      	movq	-0x8(%rbp), %rax
      d2:      	movl	(%rax), %eax
      d4:      	cmpl	%eax, %edx
      d6:      	jne	0xec <card_ptr_comp+0x6d>
      d8:      	movq	-0x8(%rbp), %rax
      dc:      	movl	0x4(%rax), %edx
      df:      	movq	-0x10(%rbp), %rax
      e3:      	movl	0x4(%rax), %eax
      e6:      	subl	%eax, %edx
      e8:      	movl	%edx, %eax
      ea:      	jmp	0xfc <card_ptr_comp+0x7d>
      ec:      	movq	-0x8(%rbp), %rax
      f0:      	movl	(%rax), %edx
      f2:      	movq	-0x10(%rbp), %rax
      f6:      	movl	(%rax), %eax
      f8:      	subl	%eax, %edx
      fa:      	movl	%edx, %eax
      fc:      	leave
      fd:      	retq

00000000000000fe <flush_suit>:
      fe:      	endbr64
     102:      	pushq	%rbp
     103:      	movq	%rsp, %rbp
     106:      	subq	$0x40, %rsp
     10a:      	movq	%rdi, -0x38(%rbp)
     10e:      	movq	%fs:0x28, %rax
     117:      	movq	%rax, -0x8(%rbp)
     11b:      	xorl	%eax, %eax
     11d:      	movl	$0x2, %esi
     122:      	movl	$0x3, %edi
     127:      	callq	0x0 <CHECK_GRADER_ENV>
     12c:      	movq	$0x0, -0x20(%rbp)
     134:      	movq	$0x0, -0x18(%rbp)
     13c:      	movq	$0x0, -0x28(%rbp)
     144:      	jmp	0x172 <flush_suit+0x74>
     146:      	movq	-0x38(%rbp), %rax
     14a:      	movq	(%rax), %rax
     14d:      	movq	-0x28(%rbp), %rdx
     151:      	shlq	$0x3, %rdx
     155:      	addq	%rdx, %rax
     158:      	movq	(%rax), %rax
     15b:      	movl	0x4(%rax), %edx
     15e:      	movl	%edx, %eax
     160:      	movl	-0x20(%rbp,%rax,4), %eax
     164:      	addl	$0x1, %eax
     167:      	movl	%edx, %edx
     169:      	movl	%eax, -0x20(%rbp,%rdx,4)
     16d:      	addq	$0x1, -0x28(%rbp)
     172:      	movq	-0x38(%rbp), %rax
     176:      	movq	0x8(%rax), %rax
     17a:      	cmpq	%rax, -0x28(%rbp)
     17e:      	jb	0x146 <flush_suit+0x48>
     180:      	movl	$0x0, -0x2c(%rbp)
     187:      	jmp	0x19e <flush_suit+0xa0>
     189:      	movl	-0x2c(%rbp), %eax
     18c:      	movl	-0x20(%rbp,%rax,4), %eax
     190:      	cmpl	$0x4, %eax
     193:      	jle	0x19a <flush_suit+0x9c>
     195:      	movl	-0x2c(%rbp), %eax
     198:      	jmp	0x1a9 <flush_suit+0xab>
     19a:      	addl	$0x1, -0x2c(%rbp)
     19e:      	cmpl	$0x3, -0x2c(%rbp)
     1a2:      	jbe	0x189 <flush_suit+0x8b>
     1a4:      	movl	$0x4, %eax
     1a9:      	movq	-0x8(%rbp), %rcx
     1ad:      	xorq	%fs:0x28, %rcx
     1b6:      	je	0x1bd <flush_suit+0xbf>
     1b8:      	callq	0x1bd <flush_suit+0xbf>
;   __stack_chk_fail+-4
     1bd:      	leave
     1be:      	retq

00000000000001bf <get_largest_element>:
     1bf:      	endbr64
     1c3:      	pushq	%rbp
     1c4:      	movq	%rsp, %rbp
     1c7:      	subq	$0x20, %rsp
     1cb:      	movq	%rdi, -0x18(%rbp)
     1cf:      	movq	%rsi, -0x20(%rbp)
     1d3:      	movl	$0x2, %esi
     1d8:      	movl	$0x3, %edi
     1dd:      	callq	0x0 <CHECK_GRADER_ENV>
     1e2:      	cmpq	$0x0, -0x20(%rbp)
     1e7:      	jne	0x1f0 <get_largest_element+0x31>
     1e9:      	movl	$0x0, %eax
     1ee:      	jmp	0x247 <get_largest_element+0x88>
     1f0:      	movq	-0x18(%rbp), %rax
     1f4:      	movl	(%rax), %eax
     1f6:      	movl	%eax, -0xc(%rbp)
     1f9:      	movq	$0x1, -0x8(%rbp)
     201:      	jmp	0x23a <get_largest_element+0x7b>
     203:      	movq	-0x8(%rbp), %rax
     207:      	leaq	(,%rax,4), %rdx
     20f:      	movq	-0x18(%rbp), %rax
     213:      	addq	%rdx, %rax
     216:      	movl	(%rax), %eax
     218:      	cmpl	%eax, -0xc(%rbp)
     21b:      	jae	0x235 <get_largest_element+0x76>
     21d:      	movq	-0x8(%rbp), %rax
     221:      	leaq	(,%rax,4), %rdx
     229:      	movq	-0x18(%rbp), %rax
     22d:      	addq	%rdx, %rax
     230:      	movl	(%rax), %eax
     232:      	movl	%eax, -0xc(%rbp)
     235:      	addq	$0x1, -0x8(%rbp)
     23a:      	movq	-0x8(%rbp), %rax
     23e:      	cmpq	-0x20(%rbp), %rax
     242:      	jb	0x203 <get_largest_element+0x44>
     244:      	movl	-0xc(%rbp), %eax
     247:      	leave
     248:      	retq

0000000000000249 <get_match_index>:
     249:      	endbr64
     24d:      	pushq	%rbp
     24e:      	movq	%rsp, %rbp
     251:      	subq	$0x30, %rsp
     255:      	movq	%rdi, -0x18(%rbp)
     259:      	movq	%rsi, -0x20(%rbp)
     25d:      	movl	%edx, -0x24(%rbp)
     260:      	movl	$0x2, %esi
     265:      	movl	$0x3, %edi
     26a:      	callq	0x0 <CHECK_GRADER_ENV>
     26f:      	movq	$0x0, -0x8(%rbp)
     277:      	jmp	0x29e <get_match_index+0x55>
     279:      	movq	-0x8(%rbp), %rax
     27d:      	leaq	(,%rax,4), %rdx
     285:      	movq	-0x18(%rbp), %rax
     289:      	addq	%rdx, %rax
     28c:      	movl	(%rax), %eax
     28e:      	cmpl	%eax, -0x24(%rbp)
     291:      	jne	0x299 <get_match_index+0x50>
     293:      	movq	-0x8(%rbp), %rax
     297:      	jmp	0x2cd <get_match_index+0x84>
     299:      	addq	$0x1, -0x8(%rbp)
     29e:      	movq	-0x8(%rbp), %rax
     2a2:      	cmpq	-0x20(%rbp), %rax
     2a6:      	jb	0x279 <get_match_index+0x30>
     2a8:      	movq	(%rip), %rax            # 0x2af <get_match_index+0x66>
;   stderr+-4
     2af:      	movq	%rax, %rcx
     2b2:      	movl	$0x29, %edx
     2b7:      	movl	$0x1, %esi
     2bc:      	leaq	(%rip), %rdi            # 0x2c3 <get_match_index+0x7a>
;   .rodata -> "Couldnt find the matches I thought I had\n"
     2c3:      	callq	0x2c8 <get_match_index+0x7f>
;   fwrite+-4
     2c8:      	callq	0x2cd <get_match_index+0x84>
;   abort+-4
     2cd:      	leave
     2ce:      	retq

00000000000002cf <is_n_length_straight_at>:
     2cf:      	endbr64
     2d3:      	pushq	%rbp
     2d4:      	movq	%rsp, %rbp
     2d7:      	movq	%rdi, -0x18(%rbp)
     2db:      	movq	%rsi, -0x20(%rbp)
     2df:      	movl	%edx, -0x24(%rbp)
     2e2:      	movl	%ecx, -0x28(%rbp)
     2e5:      	movl	$0x0, -0x8(%rbp)
     2ec:      	movq	-0x18(%rbp), %rax
     2f0:      	movq	0x8(%rax), %rdx
     2f4:      	movl	-0x28(%rbp), %eax
     2f7:      	cltq
     2f9:      	subq	%rax, %rdx
     2fc:      	movq	%rdx, %rax
     2ff:      	cmpq	%rax, -0x20(%rbp)
     303:      	jbe	0x30f <is_n_length_straight_at+0x40>
     305:      	movl	$0x0, %eax
     30a:      	jmp	0x3c8 <is_n_length_straight_at+0xf9>
     30f:      	movq	-0x18(%rbp), %rax
     313:      	movq	(%rax), %rax
     316:      	movq	-0x20(%rbp), %rdx
     31a:      	shlq	$0x3, %rdx
     31e:      	addq	%rdx, %rax
     321:      	movq	(%rax), %rax
     324:      	movl	(%rax), %eax
     326:      	movl	%eax, -0x4(%rbp)
     329:      	jmp	0x3b1 <is_n_length_straight_at+0xe2>
     32e:      	movq	-0x18(%rbp), %rax
     332:      	movq	(%rax), %rax
     335:      	movq	-0x20(%rbp), %rdx
     339:      	shlq	$0x3, %rdx
     33d:      	addq	%rdx, %rax
     340:      	movq	(%rax), %rax
     343:      	movl	(%rax), %eax
     345:      	cmpl	%eax, -0x4(%rbp)
     348:      	jne	0x384 <is_n_length_straight_at+0xb5>
     34a:      	cmpl	$0x4, -0x24(%rbp)
     34e:      	je	0x36d <is_n_length_straight_at+0x9e>
     350:      	movq	-0x18(%rbp), %rax
     354:      	movq	(%rax), %rax
     357:      	movq	-0x20(%rbp), %rdx
     35b:      	shlq	$0x3, %rdx
     35f:      	addq	%rdx, %rax
     362:      	movq	(%rax), %rax
     365:      	movl	0x4(%rax), %eax
     368:      	cmpl	%eax, -0x24(%rbp)
     36b:      	jne	0x3ac <is_n_length_straight_at+0xdd>
     36d:      	addl	$0x1, -0x8(%rbp)
     371:      	subl	$0x1, -0x4(%rbp)
     375:      	movl	-0x8(%rbp), %eax
     378:      	cmpl	-0x28(%rbp), %eax
     37b:      	jne	0x3ac <is_n_length_straight_at+0xdd>
     37d:      	movl	$0x1, %eax
     382:      	jmp	0x3c8 <is_n_length_straight_at+0xf9>
     384:      	movq	-0x18(%rbp), %rax
     388:      	movq	(%rax), %rax
     38b:      	movq	-0x20(%rbp), %rdx
     38f:      	shlq	$0x3, %rdx
     393:      	addq	%rdx, %rax
     396:      	movq	(%rax), %rax
     399:      	movl	(%rax), %eax
     39b:      	movl	-0x4(%rbp), %edx
     39e:      	addl	$0x1, %edx
     3a1:      	cmpl	%edx, %eax
     3a3:      	je	0x3ac <is_n_length_straight_at+0xdd>
     3a5:      	movl	$0x0, %eax
     3aa:      	jmp	0x3c8 <is_n_length_straight_at+0xf9>
     3ac:      	addq	$0x1, -0x20(%rbp)
     3b1:      	movq	-0x18(%rbp), %rax
     3b5:      	movq	0x8(%rax), %rax
     3b9:      	cmpq	%rax, -0x20(%rbp)
     3bd:      	jb	0x32e <is_n_length_straight_at+0x5f>
     3c3:      	movl	$0x0, %eax
     3c8:      	popq	%rbp
     3c9:      	retq

00000000000003ca <is_ace_low_straight_at>:
     3ca:      	endbr64
     3ce:      	pushq	%rbp
     3cf:      	movq	%rsp, %rbp
     3d2:      	subq	$0x20, %rsp
     3d6:      	movq	%rdi, -0x8(%rbp)
     3da:      	movq	%rsi, -0x10(%rbp)
     3de:      	movl	%edx, -0x14(%rbp)
     3e1:      	movq	-0x8(%rbp), %rax
     3e5:      	movq	(%rax), %rax
     3e8:      	movq	-0x10(%rbp), %rdx
     3ec:      	shlq	$0x3, %rdx
     3f0:      	addq	%rdx, %rax
     3f3:      	movq	(%rax), %rax
     3f6:      	movl	(%rax), %eax
     3f8:      	cmpl	$0xe, %eax
     3fb:      	je	0x421 <is_ace_low_straight_at+0x57>
     3fd:      	leaq	(%rip), %rcx            # 0x404 <is_ace_low_straight_at+0x3a>
;   .rodata -> "is_ace_low_straight_at"
     404:      	movl	$0x5a, %edx
     409:      	leaq	(%rip), %rsi            # 0x410 <is_ace_low_straight_at+0x46>
;   .rodata -> "eval.c"
     410:      	leaq	(%rip), %rdi            # 0x417 <is_ace_low_straight_at+0x4d>
;   .rodata -> "hand->cards[index]->value == VALUE_ACE"
     417:      	callq	0x41c <is_ace_low_straight_at+0x52>
;   __assert_fail+-4
     41c:      	addq	$0x1, -0x10(%rbp)
     421:      	movq	-0x8(%rbp), %rax
     425:      	movq	0x8(%rax), %rax
     429:      	cmpq	%rax, -0x10(%rbp)
     42d:      	jae	0x44b <is_ace_low_straight_at+0x81>
     42f:      	movq	-0x8(%rbp), %rax
     433:      	movq	(%rax), %rax
     436:      	movq	-0x10(%rbp), %rdx
     43a:      	shlq	$0x3, %rdx
     43e:      	addq	%rdx, %rax
     441:      	movq	(%rax), %rax
     444:      	movl	(%rax), %eax
     446:      	cmpl	$0x5, %eax
     449:      	jne	0x41c <is_ace_low_straight_at+0x52>
     44b:      	movl	-0x14(%rbp), %edx
     44e:      	movq	-0x10(%rbp), %rsi
     452:      	movq	-0x8(%rbp), %rax
     456:      	movl	$0x4, %ecx
     45b:      	movq	%rax, %rdi
     45e:      	callq	0x2cf <is_n_length_straight_at>
     463:      	leave
     464:      	retq

0000000000000465 <is_straight_at>:
     465:      	endbr64
     469:      	pushq	%rbp
     46a:      	movq	%rsp, %rbp
     46d:      	subq	$0x20, %rsp
     471:      	movq	%rdi, -0x8(%rbp)
     475:      	movq	%rsi, -0x10(%rbp)
     479:      	movl	%edx, -0x14(%rbp)
     47c:      	movl	$0x2, %esi
     481:      	movl	$0x3, %edi
     486:      	callq	0x0 <CHECK_GRADER_ENV>
     48b:      	cmpl	$0x4, -0x14(%rbp)
     48f:      	je	0x4b5 <is_straight_at+0x50>
     491:      	movq	-0x8(%rbp), %rax
     495:      	movq	(%rax), %rax
     498:      	movq	-0x10(%rbp), %rdx
     49c:      	shlq	$0x3, %rdx
     4a0:      	addq	%rdx, %rax
     4a3:      	movq	(%rax), %rax
     4a6:      	movl	0x4(%rax), %eax
     4a9:      	cmpl	%eax, -0x14(%rbp)
     4ac:      	je	0x4b5 <is_straight_at+0x50>
     4ae:      	movl	$0x0, %eax
     4b3:      	jmp	0x50a <is_straight_at+0xa5>
     4b5:      	movq	-0x8(%rbp), %rax
     4b9:      	movq	(%rax), %rax
     4bc:      	movq	-0x10(%rbp), %rdx
     4c0:      	shlq	$0x3, %rdx
     4c4:      	addq	%rdx, %rax
     4c7:      	movq	(%rax), %rax
     4ca:      	movl	(%rax), %eax
     4cc:      	cmpl	$0xe, %eax
     4cf:      	jne	0x4f2 <is_straight_at+0x8d>
     4d1:      	movl	-0x14(%rbp), %edx
     4d4:      	movq	-0x10(%rbp), %rcx
     4d8:      	movq	-0x8(%rbp), %rax
     4dc:      	movq	%rcx, %rsi
     4df:      	movq	%rax, %rdi
     4e2:      	callq	0x3ca <is_ace_low_straight_at>
     4e7:      	testl	%eax, %eax
     4e9:      	je	0x4f2 <is_straight_at+0x8d>
     4eb:      	movl	$0xffffffff, %eax       # imm = 0xFFFFFFFF
     4f0:      	jmp	0x50a <is_straight_at+0xa5>
     4f2:      	movl	-0x14(%rbp), %edx
     4f5:      	movq	-0x10(%rbp), %rsi
     4f9:      	movq	-0x8(%rbp), %rax
     4fd:      	movl	$0x5, %ecx
     502:      	movq	%rax, %rdi
     505:      	callq	0x2cf <is_n_length_straight_at>
     50a:      	leave
     50b:      	retq

000000000000050c <build_hand_from_match>:
     50c:      	endbr64
     510:      	pushq	%rbp
     511:      	movq	%rsp, %rbp
     514:      	pushq	%rbx
     515:      	subq	$0x88, %rsp
     51c:      	movq	%rdi, -0x78(%rbp)
     520:      	movq	%rsi, -0x80(%rbp)
     524:      	movl	%edx, -0x84(%rbp)
     52a:      	movl	%ecx, -0x88(%rbp)
     530:      	movq	%r8, -0x90(%rbp)
     537:      	movq	%fs:0x28, %rax
     540:      	movq	%rax, -0x18(%rbp)
     544:      	xorl	%eax, %eax
     546:      	movl	$0x2, %esi
     54b:      	movl	$0x3, %edi
     550:      	callq	0x0 <CHECK_GRADER_ENV>
     555:      	cmpl	$0x4, -0x84(%rbp)
     55c:      	jbe	0x57d <build_hand_from_match+0x71>
     55e:      	leaq	(%rip), %rcx            # 0x565 <build_hand_from_match+0x59>
;   .rodata -> "build_hand_from_match"
     565:      	movl	$0x75, %edx
     56a:      	leaq	(%rip), %rsi            # 0x571 <build_hand_from_match+0x65>
;   .rodata -> "eval.c"
     571:      	leaq	(%rip), %rdi            # 0x578 <build_hand_from_match+0x6c>
;   .rodata -> "n<=4"
     578:      	callq	0x57d <build_hand_from_match+0x71>
;   __assert_fail+-4
     57d:      	movl	-0x88(%rbp), %eax
     583:      	movl	%eax, -0x50(%rbp)
     586:      	movq	$0x0, -0x68(%rbp)
     58e:      	jmp	0x5bd <build_hand_from_match+0xb1>
     590:      	movq	-0x80(%rbp), %rax
     594:      	movq	(%rax), %rax
     597:      	movq	-0x68(%rbp), %rcx
     59b:      	movq	-0x90(%rbp), %rdx
     5a2:      	addq	%rcx, %rdx
     5a5:      	shlq	$0x3, %rdx
     5a9:      	addq	%rdx, %rax
     5ac:      	movq	(%rax), %rdx
     5af:      	movq	-0x68(%rbp), %rax
     5b3:      	movq	%rdx, -0x48(%rbp,%rax,8)
     5b8:      	addq	$0x1, -0x68(%rbp)
     5bd:      	movl	-0x84(%rbp), %eax
     5c3:      	cmpq	%rax, -0x68(%rbp)
     5c7:      	jb	0x590 <build_hand_from_match+0x84>
     5c9:      	movl	-0x84(%rbp), %eax
     5cf:      	movq	%rax, -0x60(%rbp)
     5d3:      	jmp	0x621 <build_hand_from_match+0x115>
     5d5:      	movl	-0x84(%rbp), %eax
     5db:      	movq	-0x60(%rbp), %rdx
     5df:      	subq	%rax, %rdx
     5e2:      	movq	%rdx, %rax
     5e5:      	movq	%rax, -0x58(%rbp)
     5e9:      	movq	-0x58(%rbp), %rax
     5ed:      	cmpq	-0x90(%rbp), %rax
     5f4:      	jb	0x5fe <build_hand_from_match+0xf2>
     5f6:      	movq	-0x60(%rbp), %rax
     5fa:      	movq	%rax, -0x58(%rbp)
     5fe:      	movq	-0x80(%rbp), %rax
     602:      	movq	(%rax), %rax
     605:      	movq	-0x58(%rbp), %rdx
     609:      	shlq	$0x3, %rdx
     60d:      	addq	%rdx, %rax
     610:      	movq	(%rax), %rdx
     613:      	movq	-0x60(%rbp), %rax
     617:      	movq	%rdx, -0x48(%rbp,%rax,8)
     61c:      	addq	$0x1, -0x60(%rbp)
     621:      	cmpq	$0x4, -0x60(%rbp)
     626:      	jbe	0x5d5 <build_hand_from_match+0xc9>
     628:      	movq	-0x78(%rbp), %rax
     62c:      	movq	-0x50(%rbp), %rcx
     630:      	movq	-0x48(%rbp), %rbx
     634:      	movq	%rcx, (%rax)
     637:      	movq	%rbx, 0x8(%rax)
     63b:      	movq	-0x40(%rbp), %rcx
     63f:      	movq	-0x38(%rbp), %rbx
     643:      	movq	%rcx, 0x10(%rax)
     647:      	movq	%rbx, 0x18(%rax)
     64b:      	movq	-0x30(%rbp), %rcx
     64f:      	movq	-0x28(%rbp), %rbx
     653:      	movq	%rcx, 0x20(%rax)
     657:      	movq	%rbx, 0x28(%rax)
     65b:      	movq	-0x18(%rbp), %rax
     65f:      	xorq	%fs:0x28, %rax
     668:      	je	0x66f <build_hand_from_match+0x163>
     66a:      	callq	0x66f <build_hand_from_match+0x163>
;   __stack_chk_fail+-4
     66f:      	movq	-0x78(%rbp), %rax
     673:      	addq	$0x88, %rsp
     67a:      	popq	%rbx
     67b:      	popq	%rbp
     67c:      	retq

000000000000067d <find_secondary_pair>:
     67d:      	endbr64
     681:      	pushq	%rbp
     682:      	movq	%rsp, %rbp
     685:      	subq	$0x40, %rsp
     689:      	movq	%rdi, -0x28(%rbp)
     68d:      	movq	%rsi, -0x30(%rbp)
     691:      	movq	%rdx, -0x38(%rbp)
     695:      	movl	$0x2, %esi
     69a:      	movl	$0x3, %edi
     69f:      	callq	0x0 <CHECK_GRADER_ENV>
     6a4:      	movq	$-0x1, -0x10(%rbp)
     6ac:      	movq	-0x28(%rbp), %rax
     6b0:      	movq	(%rax), %rax
     6b3:      	movq	-0x38(%rbp), %rdx
     6b7:      	shlq	$0x3, %rdx
     6bb:      	addq	%rdx, %rax
     6be:      	movq	(%rax), %rax
     6c1:      	movl	(%rax), %eax
     6c3:      	movl	%eax, -0x14(%rbp)
     6c6:      	movq	$0x0, -0x8(%rbp)
     6ce:      	jmp	0x74c <find_secondary_pair+0xcf>
     6d0:      	movq	-0x8(%rbp), %rax
     6d4:      	leaq	(,%rax,4), %rdx
     6dc:      	movq	-0x30(%rbp), %rax
     6e0:      	addq	%rdx, %rax
     6e3:      	movl	(%rax), %eax
     6e5:      	cmpl	$0x1, %eax
     6e8:      	jbe	0x747 <find_secondary_pair+0xca>
     6ea:      	movq	-0x28(%rbp), %rax
     6ee:      	movq	(%rax), %rax
     6f1:      	movq	-0x8(%rbp), %rdx
     6f5:      	shlq	$0x3, %rdx
     6f9:      	addq	%rdx, %rax
     6fc:      	movq	(%rax), %rax
     6ff:      	movl	(%rax), %eax
     701:      	cmpl	%eax, -0x14(%rbp)
     704:      	je	0x747 <find_secondary_pair+0xca>
     706:      	cmpq	$-0x1, -0x10(%rbp)
     70b:      	je	0x73f <find_secondary_pair+0xc2>
     70d:      	movq	-0x28(%rbp), %rax
     711:      	movq	(%rax), %rax
     714:      	movq	-0x8(%rbp), %rdx
     718:      	shlq	$0x3, %rdx
     71c:      	addq	%rdx, %rax
     71f:      	movq	(%rax), %rax
     722:      	movl	(%rax), %edx
     724:      	movq	-0x28(%rbp), %rax
     728:      	movq	(%rax), %rax
     72b:      	movq	-0x10(%rbp), %rcx
     72f:      	shlq	$0x3, %rcx
     733:      	addq	%rcx, %rax
     736:      	movq	(%rax), %rax
     739:      	movl	(%rax), %eax
     73b:      	cmpl	%eax, %edx
     73d:      	jbe	0x747 <find_secondary_pair+0xca>
     73f:      	movq	-0x8(%rbp), %rax
     743:      	movq	%rax, -0x10(%rbp)
     747:      	addq	$0x1, -0x8(%rbp)
     74c:      	movq	-0x28(%rbp), %rax
     750:      	movq	0x8(%rax), %rax
     754:      	cmpq	%rax, -0x8(%rbp)
     758:      	jb	0x6d0 <find_secondary_pair+0x53>
     75e:      	movq	-0x10(%rbp), %rax
     762:      	leave
     763:      	retq

0000000000000764 <compare_hands>:
     764:      	endbr64
     768:      	pushq	%rbp
     769:      	movq	%rsp, %rbp
     76c:      	subq	$0x90, %rsp
     773:      	movq	%rdi, -0x88(%rbp)
     77a:      	movq	%rsi, -0x90(%rbp)
     781:      	movq	%fs:0x28, %rax
     78a:      	movq	%rax, -0x8(%rbp)
     78e:      	xorl	%eax, %eax
     790:      	movl	$0x2, %esi
     795:      	movl	$0x3, %edi
     79a:      	callq	0x0 <CHECK_GRADER_ENV>
     79f:      	movq	-0x88(%rbp), %rax
     7a6:      	movq	0x8(%rax), %rsi
     7aa:      	movq	-0x88(%rbp), %rax
     7b1:      	movq	(%rax), %rax
     7b4:      	leaq	(%rip), %rcx            # 0x7bb <compare_hands+0x57>
;   card_ptr_comp+-4
     7bb:      	movl	$0x8, %edx
     7c0:      	movq	%rax, %rdi
     7c3:      	callq	0x7c8 <compare_hands+0x64>
;   qsort+-4
     7c8:      	movq	-0x90(%rbp), %rax
     7cf:      	movq	0x8(%rax), %rsi
     7d3:      	movq	-0x90(%rbp), %rax
     7da:      	movq	(%rax), %rax
     7dd:      	leaq	(%rip), %rcx            # 0x7e4 <compare_hands+0x80>
;   card_ptr_comp+-4
     7e4:      	movl	$0x8, %edx
     7e9:      	movq	%rax, %rdi
     7ec:      	callq	0x7f1 <compare_hands+0x8d>
;   qsort+-4
     7f1:      	leaq	-0x70(%rbp), %rax
     7f5:      	movq	-0x88(%rbp), %rdx
     7fc:      	movq	%rdx, %rsi
     7ff:      	movq	%rax, %rdi
     802:      	callq	0x807 <compare_hands+0xa3>
;   evaluate_hand+-4
     807:      	leaq	-0x40(%rbp), %rax
     80b:      	movq	-0x90(%rbp), %rdx
     812:      	movq	%rdx, %rsi
     815:      	movq	%rax, %rdi
     818:      	callq	0x81d <compare_hands+0xb9>
;   evaluate_hand+-4
     81d:      	movl	-0x70(%rbp), %edx
     820:      	movl	-0x40(%rbp), %eax
     823:      	cmpl	%eax, %edx
     825:      	je	0x833 <compare_hands+0xcf>
     827:      	movl	-0x40(%rbp), %edx
     82a:      	movl	-0x70(%rbp), %eax
     82d:      	subl	%eax, %edx
     82f:      	movl	%edx, %eax
     831:      	jmp	0x884 <compare_hands+0x120>
     833:      	movq	$0x0, -0x78(%rbp)
     83b:      	jmp	0x878 <compare_hands+0x114>
     83d:      	movq	-0x78(%rbp), %rax
     841:      	movq	-0x68(%rbp,%rax,8), %rax
     846:      	movl	(%rax), %edx
     848:      	movq	-0x78(%rbp), %rax
     84c:      	movq	-0x38(%rbp,%rax,8), %rax
     851:      	movl	(%rax), %eax
     853:      	cmpl	%eax, %edx
     855:      	je	0x873 <compare_hands+0x10f>
     857:      	movq	-0x78(%rbp), %rax
     85b:      	movq	-0x68(%rbp,%rax,8), %rax
     860:      	movl	(%rax), %edx
     862:      	movq	-0x78(%rbp), %rax
     866:      	movq	-0x38(%rbp,%rax,8), %rax
     86b:      	movl	(%rax), %eax
     86d:      	subl	%eax, %edx
     86f:      	movl	%edx, %eax
     871:      	jmp	0x884 <compare_hands+0x120>
     873:      	addq	$0x1, -0x78(%rbp)
     878:      	cmpq	$0x4, -0x78(%rbp)
     87d:      	jbe	0x83d <compare_hands+0xd9>
     87f:      	movl	$0x0, %eax
     884:      	movq	-0x8(%rbp), %rcx
     888:      	xorq	%fs:0x28, %rcx
     891:      	je	0x898 <compare_hands+0x134>
     893:      	callq	0x898 <compare_hands+0x134>
;   __stack_chk_fail+-4
     898:      	leave
     899:      	retq

000000000000089a <copy_straight>:
     89a:      	endbr64
     89e:      	pushq	%rbp
     89f:      	movq	%rsp, %rbp
     8a2:      	subq	$0x40, %rsp
     8a6:      	movq	%rdi, -0x18(%rbp)
     8aa:      	movq	%rsi, -0x20(%rbp)
     8ae:      	movq	%rdx, -0x28(%rbp)
     8b2:      	movl	%ecx, -0x2c(%rbp)
     8b5:      	movq	%r8, -0x38(%rbp)
     8b9:      	cmpl	$0x4, -0x2c(%rbp)
     8bd:      	je	0x8fb <copy_straight+0x61>
     8bf:      	movq	-0x20(%rbp), %rax
     8c3:      	movq	(%rax), %rax
     8c6:      	movq	-0x28(%rbp), %rdx
     8ca:      	shlq	$0x3, %rdx
     8ce:      	addq	%rdx, %rax
     8d1:      	movq	(%rax), %rax
     8d4:      	movl	0x4(%rax), %eax
     8d7:      	cmpl	%eax, -0x2c(%rbp)
     8da:      	je	0x8fb <copy_straight+0x61>
     8dc:      	leaq	(%rip), %rcx            # 0x8e3 <copy_straight+0x49>
;   .rodata -> "copy_straight"
     8e3:      	movl	$0xe1, %edx
     8e8:      	leaq	(%rip), %rsi            # 0x8ef <copy_straight+0x55>
;   .rodata -> "eval.c"
     8ef:      	leaq	(%rip), %rdi            # 0x8f6 <copy_straight+0x5c>
;   .rodata -> "fs == NUM_SUITS || from->cards[ind]->suit == fs"
     8f6:      	callq	0x8fb <copy_straight+0x61>
;   __assert_fail+-4
     8fb:      	movq	-0x20(%rbp), %rax
     8ff:      	movq	(%rax), %rax
     902:      	movq	-0x28(%rbp), %rdx
     906:      	shlq	$0x3, %rdx
     90a:      	addq	%rdx, %rax
     90d:      	movq	(%rax), %rax
     910:      	movl	(%rax), %eax
     912:      	movl	%eax, -0xc(%rbp)
     915:      	movq	$0x0, -0x8(%rbp)
     91d:      	jmp	0xa17 <copy_straight+0x17d>
     922:      	movq	-0x20(%rbp), %rax
     926:      	movq	0x8(%rax), %rax
     92a:      	cmpq	%rax, -0x28(%rbp)
     92e:      	jb	0x94f <copy_straight+0xb5>
     930:      	leaq	(%rip), %rcx            # 0x937 <copy_straight+0x9d>
;   .rodata -> "copy_straight"
     937:      	movl	$0xe5, %edx
     93c:      	leaq	(%rip), %rsi            # 0x943 <copy_straight+0xa9>
;   .rodata -> "eval.c"
     943:      	leaq	(%rip), %rdi            # 0x94a <copy_straight+0xb0>
;   .rodata -> "ind < from->n_cards"
     94a:      	callq	0x94f <copy_straight+0xb5>
;   __assert_fail+-4
     94f:      	cmpl	$0x1, -0xc(%rbp)
     953:      	ja	0x974 <copy_straight+0xda>
     955:      	leaq	(%rip), %rcx            # 0x95c <copy_straight+0xc2>
;   .rodata -> "copy_straight"
     95c:      	movl	$0xe6, %edx
     961:      	leaq	(%rip), %rsi            # 0x968 <copy_straight+0xce>
;   .rodata -> "eval.c"
     968:      	leaq	(%rip), %rdi            # 0x96f <copy_straight+0xd5>
;   .rodata -> "nextv >= 2"
     96f:      	callq	0x974 <copy_straight+0xda>
;   __assert_fail+-4
     974:      	cmpq	$0x4, -0x8(%rbp)
     979:      	jbe	0x99a <copy_straight+0x100>
     97b:      	leaq	(%rip), %rcx            # 0x982 <copy_straight+0xe8>
;   .rodata -> "copy_straight"
     982:      	movl	$0xe7, %edx
     987:      	leaq	(%rip), %rsi            # 0x98e <copy_straight+0xf4>
;   .rodata -> "eval.c"
     98e:      	leaq	(%rip), %rdi            # 0x995 <copy_straight+0xfb>
;   .rodata -> "to_ind <5"
     995:      	callq	0x99a <copy_straight+0x100>
;   __assert_fail+-4
     99a:      	movq	-0x20(%rbp), %rax
     99e:      	movq	(%rax), %rax
     9a1:      	movq	-0x28(%rbp), %rdx
     9a5:      	shlq	$0x3, %rdx
     9a9:      	addq	%rdx, %rax
     9ac:      	movq	(%rax), %rax
     9af:      	movl	(%rax), %eax
     9b1:      	cmpl	%eax, -0xc(%rbp)
     9b4:      	jne	0xa12 <copy_straight+0x178>
     9b6:      	cmpl	$0x4, -0x2c(%rbp)
     9ba:      	je	0x9d9 <copy_straight+0x13f>
     9bc:      	movq	-0x20(%rbp), %rax
     9c0:      	movq	(%rax), %rax
     9c3:      	movq	-0x28(%rbp), %rdx
     9c7:      	shlq	$0x3, %rdx
     9cb:      	addq	%rdx, %rax
     9ce:      	movq	(%rax), %rax
     9d1:      	movl	0x4(%rax), %eax
     9d4:      	cmpl	%eax, -0x2c(%rbp)
     9d7:      	jne	0xa12 <copy_straight+0x178>
     9d9:      	movq	-0x20(%rbp), %rax
     9dd:      	movq	(%rax), %rax
     9e0:      	movq	-0x28(%rbp), %rdx
     9e4:      	shlq	$0x3, %rdx
     9e8:      	addq	%rdx, %rax
     9eb:      	movq	-0x8(%rbp), %rdx
     9ef:      	leaq	(,%rdx,8), %rcx
     9f7:      	movq	-0x18(%rbp), %rdx
     9fb:      	addq	%rcx, %rdx
     9fe:      	movq	(%rax), %rax
     a01:      	movq	%rax, (%rdx)
     a04:      	addq	$0x1, -0x8(%rbp)
     a09:      	subq	$0x1, -0x38(%rbp)
     a0e:      	subl	$0x1, -0xc(%rbp)
     a12:      	addq	$0x1, -0x28(%rbp)
     a17:      	cmpq	$0x0, -0x38(%rbp)
     a1c:      	jne	0x922 <copy_straight+0x88>
     a22:      	nop
     a23:      	nop
     a24:      	leave
     a25:      	retq

0000000000000a26 <find_straight>:
     a26:      	endbr64
     a2a:      	pushq	%rbp
     a2b:      	movq	%rsp, %rbp
     a2e:      	subq	$0x40, %rsp
     a32:      	movq	%rdi, -0x28(%rbp)
     a36:      	movl	%esi, -0x2c(%rbp)
     a39:      	movq	%rdx, -0x38(%rbp)
     a3d:      	movq	-0x28(%rbp), %rax
     a41:      	movq	0x8(%rax), %rax
     a45:      	cmpq	$0x4, %rax
     a49:      	ja	0xa55 <find_straight+0x2f>
     a4b:      	movl	$0x0, %eax
     a50:      	jmp	0xc33 <find_straight+0x20d>
     a55:      	movq	$0x0, -0x18(%rbp)
     a5d:      	jmp	0xaae <find_straight+0x88>
     a5f:      	movl	-0x2c(%rbp), %edx
     a62:      	movq	-0x18(%rbp), %rcx
     a66:      	movq	-0x28(%rbp), %rax
     a6a:      	movq	%rcx, %rsi
     a6d:      	movq	%rax, %rdi
     a70:      	callq	0xa75 <find_straight+0x4f>
;   is_straight_at+-4
     a75:      	movl	%eax, -0x1c(%rbp)
     a78:      	cmpl	$0x0, -0x1c(%rbp)
     a7c:      	jle	0xaa9 <find_straight+0x83>
     a7e:      	movq	-0x38(%rbp), %rax
     a82:      	leaq	0x8(%rax), %rdi
     a86:      	movl	-0x2c(%rbp), %ecx
     a89:      	movq	-0x18(%rbp), %rdx
     a8d:      	movq	-0x28(%rbp), %rax
     a91:      	movl	$0x5, %r8d
     a97:      	movq	%rax, %rsi
     a9a:      	callq	0xa9f <find_straight+0x79>
;   copy_straight+-4
     a9f:      	movl	$0x1, %eax
     aa4:      	jmp	0xc33 <find_straight+0x20d>
     aa9:      	addq	$0x1, -0x18(%rbp)
     aae:      	movq	-0x28(%rbp), %rax
     ab2:      	movq	0x8(%rax), %rax
     ab6:      	subq	$0x5, %rax
     aba:      	cmpq	%rax, -0x18(%rbp)
     abe:      	jbe	0xa5f <find_straight+0x39>
     ac0:      	movq	$0x0, -0x10(%rbp)
     ac8:      	jmp	0xc18 <find_straight+0x1f2>
     acd:      	movl	-0x2c(%rbp), %edx
     ad0:      	movq	-0x10(%rbp), %rcx
     ad4:      	movq	-0x28(%rbp), %rax
     ad8:      	movq	%rcx, %rsi
     adb:      	movq	%rax, %rdi
     ade:      	callq	0xae3 <find_straight+0xbd>
;   is_straight_at+-4
     ae3:      	movl	%eax, -0x20(%rbp)
     ae6:      	cmpl	$0x0, -0x20(%rbp)
     aea:      	jns	0xc13 <find_straight+0x1ed>
     af0:      	movq	-0x28(%rbp), %rax
     af4:      	movq	(%rax), %rax
     af7:      	movq	-0x10(%rbp), %rdx
     afb:      	shlq	$0x3, %rdx
     aff:      	addq	%rdx, %rax
     b02:      	movq	(%rax), %rax
     b05:      	movl	(%rax), %eax
     b07:      	cmpl	$0xe, %eax
     b0a:      	jne	0xb2f <find_straight+0x109>
     b0c:      	cmpl	$0x4, -0x2c(%rbp)
     b10:      	je	0xb4e <find_straight+0x128>
     b12:      	movq	-0x28(%rbp), %rax
     b16:      	movq	(%rax), %rax
     b19:      	movq	-0x10(%rbp), %rdx
     b1d:      	shlq	$0x3, %rdx
     b21:      	addq	%rdx, %rax
     b24:      	movq	(%rax), %rax
     b27:      	movl	0x4(%rax), %eax
     b2a:      	cmpl	%eax, -0x2c(%rbp)
     b2d:      	je	0xb4e <find_straight+0x128>
     b2f:      	leaq	(%rip), %rcx            # 0xb36 <find_straight+0x110>
;   .rodata -> "find_straight"
     b36:      	movl	$0x109, %edx            # imm = 0x109
     b3b:      	leaq	(%rip), %rsi            # 0xb42 <find_straight+0x11c>
;   .rodata -> "eval.c"
     b42:      	leaq	(%rip), %rdi            # 0xb49 <find_straight+0x123>
;   .rodata -> "hand->cards[i]->value == VALUE_ACE && (fs == NUM_SUITS || hand->cards[i]->suit == fs)"
     b49:      	callq	0xb4e <find_straight+0x128>
;   __assert_fail+-4
     b4e:      	nop
     b4f:      	movq	-0x28(%rbp), %rax
     b53:      	movq	(%rax), %rax
     b56:      	movq	-0x10(%rbp), %rdx
     b5a:      	shlq	$0x3, %rdx
     b5e:      	addq	%rdx, %rax
     b61:      	movq	(%rax), %rdx
     b64:      	movq	-0x38(%rbp), %rax
     b68:      	movq	%rdx, 0x28(%rax)
     b6c:      	movq	-0x10(%rbp), %rax
     b70:      	addq	$0x1, %rax
     b74:      	movq	%rax, -0x8(%rbp)
     b78:      	jmp	0xbac <find_straight+0x186>
     b7a:      	addq	$0x1, -0x8(%rbp)
     b7f:      	movq	-0x28(%rbp), %rax
     b83:      	movq	0x8(%rax), %rax
     b87:      	cmpq	%rax, -0x8(%rbp)
     b8b:      	jb	0xbac <find_straight+0x186>
     b8d:      	leaq	(%rip), %rcx            # 0xb94 <find_straight+0x16e>
;   .rodata -> "find_straight"
     b94:      	movl	$0x110, %edx            # imm = 0x110
     b99:      	leaq	(%rip), %rsi            # 0xba0 <find_straight+0x17a>
;   .rodata -> "eval.c"
     ba0:      	leaq	(%rip), %rdi            # 0xba7 <find_straight+0x181>
;   .rodata -> "cpind < hand->n_cards"
     ba7:      	callq	0xbac <find_straight+0x186>
;   __assert_fail+-4
     bac:      	movq	-0x28(%rbp), %rax
     bb0:      	movq	(%rax), %rax
     bb3:      	movq	-0x8(%rbp), %rdx
     bb7:      	shlq	$0x3, %rdx
     bbb:      	addq	%rdx, %rax
     bbe:      	movq	(%rax), %rax
     bc1:      	movl	(%rax), %eax
     bc3:      	cmpl	$0x5, %eax
     bc6:      	jne	0xb7a <find_straight+0x154>
     bc8:      	cmpl	$0x4, -0x2c(%rbp)
     bcc:      	je	0xbeb <find_straight+0x1c5>
     bce:      	movq	-0x28(%rbp), %rax
     bd2:      	movq	(%rax), %rax
     bd5:      	movq	-0x8(%rbp), %rdx
     bd9:      	shlq	$0x3, %rdx
     bdd:      	addq	%rdx, %rax
     be0:      	movq	(%rax), %rax
     be3:      	movl	0x4(%rax), %eax
     be6:      	cmpl	%eax, -0x2c(%rbp)
     be9:      	jne	0xb7a <find_straight+0x154>
     beb:      	movq	-0x38(%rbp), %rax
     bef:      	leaq	0x8(%rax), %rdi
     bf3:      	movl	-0x2c(%rbp), %ecx
     bf6:      	movq	-0x8(%rbp), %rdx
     bfa:      	movq	-0x28(%rbp), %rax
     bfe:      	movl	$0x4, %r8d
     c04:      	movq	%rax, %rsi
     c07:      	callq	0xc0c <find_straight+0x1e6>
;   copy_straight+-4
     c0c:      	movl	$0x1, %eax
     c11:      	jmp	0xc33 <find_straight+0x20d>
     c13:      	addq	$0x1, -0x10(%rbp)
     c18:      	movq	-0x28(%rbp), %rax
     c1c:      	movq	0x8(%rax), %rax
     c20:      	subq	$0x5, %rax
     c24:      	cmpq	%rax, -0x10(%rbp)
     c28:      	jbe	0xacd <find_straight+0xa7>
     c2e:      	movl	$0x0, %eax
     c33:      	leave
     c34:      	retq

0000000000000c35 <evaluate_hand>:
     c35:      	endbr64
     c39:      	pushq	%rbp
     c3a:      	movq	%rsp, %rbp
     c3d:      	pushq	%rbx
     c3e:      	subq	$0xb8, %rsp
     c45:      	movq	%rdi, -0x88(%rbp)
     c4c:      	movq	%rsi, -0x90(%rbp)
     c53:      	movq	%fs:0x28, %rax
     c5c:      	movq	%rax, -0x18(%rbp)
     c60:      	xorl	%eax, %eax
     c62:      	movq	-0x90(%rbp), %rax
     c69:      	movq	%rax, %rdi
     c6c:      	callq	0xc71 <evaluate_hand+0x3c>
;   flush_suit+-4
     c71:      	movl	%eax, -0x80(%rbp)
     c74:      	cmpl	$0x4, -0x80(%rbp)
     c78:      	je	0xcd8 <evaluate_hand+0xa3>
     c7a:      	leaq	-0x50(%rbp), %rdx
     c7e:      	movl	-0x80(%rbp), %ecx
     c81:      	movq	-0x90(%rbp), %rax
     c88:      	movl	%ecx, %esi
     c8a:      	movq	%rax, %rdi
     c8d:      	callq	0xc92 <evaluate_hand+0x5d>
;   find_straight+-4
     c92:      	testl	%eax, %eax
     c94:      	je	0xcd8 <evaluate_hand+0xa3>
     c96:      	movl	$0x0, -0x50(%rbp)
     c9d:      	movq	-0x88(%rbp), %rax
     ca4:      	movq	-0x50(%rbp), %rcx
     ca8:      	movq	-0x48(%rbp), %rbx
     cac:      	movq	%rcx, (%rax)
     caf:      	movq	%rbx, 0x8(%rax)
     cb3:      	movq	-0x40(%rbp), %rcx
     cb7:      	movq	-0x38(%rbp), %rbx
     cbb:      	movq	%rcx, 0x10(%rax)
     cbf:      	movq	%rbx, 0x18(%rax)
     cc3:      	movq	-0x30(%rbp), %rcx
     cc7:      	movq	-0x28(%rbp), %rbx
     ccb:      	movq	%rcx, 0x20(%rax)
     ccf:      	movq	%rbx, 0x28(%rax)
     cd3:      	jmp	0x119c <evaluate_hand+0x567>
     cd8:      	movq	-0x90(%rbp), %rax
     cdf:      	movq	%rax, %rdi
     ce2:      	callq	0xce7 <evaluate_hand+0xb2>
;   get_match_counts+-4
     ce7:      	movq	%rax, -0x68(%rbp)
     ceb:      	movq	-0x90(%rbp), %rax
     cf2:      	movq	0x8(%rax), %rdx
     cf6:      	movq	-0x68(%rbp), %rax
     cfa:      	movq	%rdx, %rsi
     cfd:      	movq	%rax, %rdi
     d00:      	callq	0xd05 <evaluate_hand+0xd0>
;   get_largest_element+-4
     d05:      	movl	%eax, -0x7c(%rbp)
     d08:      	cmpl	$0x4, -0x7c(%rbp)
     d0c:      	jbe	0xd2d <evaluate_hand+0xf8>
     d0e:      	leaq	(%rip), %rcx            # 0xd15 <evaluate_hand+0xe0>
;   .rodata -> "evaluate_hand"
     d15:      	movl	$0x128, %edx            # imm = 0x128
     d1a:      	leaq	(%rip), %rsi            # 0xd21 <evaluate_hand+0xec>
;   .rodata -> "eval.c"
     d21:      	leaq	(%rip), %rdi            # 0xd28 <evaluate_hand+0xf3>
;   .rodata -> "n_of_a_kind <= 4"
     d28:      	callq	0xd2d <evaluate_hand+0xf8>
;   __assert_fail+-4
     d2d:      	movq	-0x90(%rbp), %rax
     d34:      	movq	0x8(%rax), %rcx
     d38:      	movl	-0x7c(%rbp), %edx
     d3b:      	movq	-0x68(%rbp), %rax
     d3f:      	movq	%rcx, %rsi
     d42:      	movq	%rax, %rdi
     d45:      	callq	0xd4a <evaluate_hand+0x115>
;   get_match_index+-4
     d4a:      	movq	%rax, -0x60(%rbp)
     d4e:      	movq	-0x60(%rbp), %rdx
     d52:      	movq	-0x68(%rbp), %rcx
     d56:      	movq	-0x90(%rbp), %rax
     d5d:      	movq	%rcx, %rsi
     d60:      	movq	%rax, %rdi
     d63:      	callq	0xd68 <evaluate_hand+0x133>
;   find_secondary_pair+-4
     d68:      	movq	%rax, -0x58(%rbp)
     d6c:      	movq	-0x68(%rbp), %rax
     d70:      	movq	%rax, %rdi
     d73:      	callq	0xd78 <evaluate_hand+0x143>
;   free+-4
     d78:      	cmpl	$0x4, -0x7c(%rbp)
     d7c:      	jne	0xdaa <evaluate_hand+0x175>
     d7e:      	movq	-0x88(%rbp), %rax
     d85:      	movq	-0x60(%rbp), %rdx
     d89:      	movq	-0x90(%rbp), %rsi
     d90:      	movq	%rdx, %r8
     d93:      	movl	$0x1, %ecx
     d98:      	movl	$0x4, %edx
     d9d:      	movq	%rax, %rdi
     da0:      	callq	0xda5 <evaluate_hand+0x170>
;   build_hand_from_match+-4
     da5:      	jmp	0x119c <evaluate_hand+0x567>
     daa:      	cmpl	$0x3, -0x7c(%rbp)
     dae:      	jne	0xe9f <evaluate_hand+0x26a>
     db4:      	cmpq	$0x0, -0x58(%rbp)
     db9:      	js	0xe9f <evaluate_hand+0x26a>
     dbf:      	leaq	-0xc0(%rbp), %rax
     dc6:      	movq	-0x60(%rbp), %rdx
     dca:      	movq	-0x90(%rbp), %rsi
     dd1:      	movq	%rdx, %r8
     dd4:      	movl	$0x2, %ecx
     dd9:      	movl	$0x3, %edx
     dde:      	movq	%rax, %rdi
     de1:      	callq	0xde6 <evaluate_hand+0x1b1>
;   build_hand_from_match+-4
     de6:      	movq	-0xc0(%rbp), %rax
     ded:      	movq	-0xb8(%rbp), %rdx
     df4:      	movq	%rax, -0x50(%rbp)
     df8:      	movq	%rdx, -0x48(%rbp)
     dfc:      	movq	-0xb0(%rbp), %rax
     e03:      	movq	-0xa8(%rbp), %rdx
     e0a:      	movq	%rax, -0x40(%rbp)
     e0e:      	movq	%rdx, -0x38(%rbp)
     e12:      	movq	-0xa0(%rbp), %rax
     e19:      	movq	-0x98(%rbp), %rdx
     e20:      	movq	%rax, -0x30(%rbp)
     e24:      	movq	%rdx, -0x28(%rbp)
     e28:      	movq	-0x90(%rbp), %rax
     e2f:      	movq	(%rax), %rax
     e32:      	movq	-0x58(%rbp), %rdx
     e36:      	shlq	$0x3, %rdx
     e3a:      	addq	%rdx, %rax
     e3d:      	movq	(%rax), %rax
     e40:      	movq	%rax, -0x30(%rbp)
     e44:      	movq	-0x90(%rbp), %rax
     e4b:      	movq	(%rax), %rax
     e4e:      	movq	-0x58(%rbp), %rdx
     e52:      	addq	$0x1, %rdx
     e56:      	shlq	$0x3, %rdx
     e5a:      	addq	%rdx, %rax
     e5d:      	movq	(%rax), %rax
     e60:      	movq	%rax, -0x28(%rbp)
     e64:      	movq	-0x88(%rbp), %rax
     e6b:      	movq	-0x50(%rbp), %rcx
     e6f:      	movq	-0x48(%rbp), %rbx
     e73:      	movq	%rcx, (%rax)
     e76:      	movq	%rbx, 0x8(%rax)
     e7a:      	movq	-0x40(%rbp), %rcx
     e7e:      	movq	-0x38(%rbp), %rbx
     e82:      	movq	%rcx, 0x10(%rax)
     e86:      	movq	%rbx, 0x18(%rax)
     e8a:      	movq	-0x30(%rbp), %rcx
     e8e:      	movq	-0x28(%rbp), %rbx
     e92:      	movq	%rcx, 0x20(%rax)
     e96:      	movq	%rbx, 0x28(%rax)
     e9a:      	jmp	0x119c <evaluate_hand+0x567>
     e9f:      	cmpl	$0x4, -0x80(%rbp)
     ea3:      	je	0xf63 <evaluate_hand+0x32e>
     ea9:      	movl	$0x3, -0x50(%rbp)
     eb0:      	movq	$0x0, -0x78(%rbp)
     eb8:      	movq	$0x0, -0x70(%rbp)
     ec0:      	jmp	0xf14 <evaluate_hand+0x2df>
     ec2:      	movq	-0x90(%rbp), %rax
     ec9:      	movq	(%rax), %rax
     ecc:      	movq	-0x70(%rbp), %rdx
     ed0:      	shlq	$0x3, %rdx
     ed4:      	addq	%rdx, %rax
     ed7:      	movq	(%rax), %rax
     eda:      	movl	0x4(%rax), %eax
     edd:      	cmpl	%eax, -0x80(%rbp)
     ee0:      	jne	0xf0f <evaluate_hand+0x2da>
     ee2:      	movq	-0x90(%rbp), %rax
     ee9:      	movq	(%rax), %rax
     eec:      	movq	-0x70(%rbp), %rdx
     ef0:      	shlq	$0x3, %rdx
     ef4:      	addq	%rdx, %rax
     ef7:      	movq	(%rax), %rdx
     efa:      	movq	-0x78(%rbp), %rax
     efe:      	movq	%rdx, -0x48(%rbp,%rax,8)
     f03:      	addq	$0x1, -0x78(%rbp)
     f08:      	cmpq	$0x4, -0x78(%rbp)
     f0d:      	ja	0xf27 <evaluate_hand+0x2f2>
     f0f:      	addq	$0x1, -0x70(%rbp)
     f14:      	movq	-0x90(%rbp), %rax
     f1b:      	movq	0x8(%rax), %rax
     f1f:      	cmpq	%rax, -0x70(%rbp)
     f23:      	jb	0xec2 <evaluate_hand+0x28d>
     f25:      	jmp	0xf28 <evaluate_hand+0x2f3>
     f27:      	nop
     f28:      	movq	-0x88(%rbp), %rax
     f2f:      	movq	-0x50(%rbp), %rcx
     f33:      	movq	-0x48(%rbp), %rbx
     f37:      	movq	%rcx, (%rax)
     f3a:      	movq	%rbx, 0x8(%rax)
     f3e:      	movq	-0x40(%rbp), %rcx
     f42:      	movq	-0x38(%rbp), %rbx
     f46:      	movq	%rcx, 0x10(%rax)
     f4a:      	movq	%rbx, 0x18(%rax)
     f4e:      	movq	-0x30(%rbp), %rcx
     f52:      	movq	-0x28(%rbp), %rbx
     f56:      	movq	%rcx, 0x20(%rax)
     f5a:      	movq	%rbx, 0x28(%rax)
     f5e:      	jmp	0x119c <evaluate_hand+0x567>
     f63:      	leaq	-0x50(%rbp), %rdx
     f67:      	movq	-0x90(%rbp), %rax
     f6e:      	movl	$0x4, %esi
     f73:      	movq	%rax, %rdi
     f76:      	callq	0xf7b <evaluate_hand+0x346>
;   find_straight+-4
     f7b:      	testl	%eax, %eax
     f7d:      	je	0xfc1 <evaluate_hand+0x38c>
     f7f:      	movl	$0x4, -0x50(%rbp)
     f86:      	movq	-0x88(%rbp), %rax
     f8d:      	movq	-0x50(%rbp), %rcx
     f91:      	movq	-0x48(%rbp), %rbx
     f95:      	movq	%rcx, (%rax)
     f98:      	movq	%rbx, 0x8(%rax)
     f9c:      	movq	-0x40(%rbp), %rcx
     fa0:      	movq	-0x38(%rbp), %rbx
     fa4:      	movq	%rcx, 0x10(%rax)
     fa8:      	movq	%rbx, 0x18(%rax)
     fac:      	movq	-0x30(%rbp), %rcx
     fb0:      	movq	-0x28(%rbp), %rbx
     fb4:      	movq	%rcx, 0x20(%rax)
     fb8:      	movq	%rbx, 0x28(%rax)
     fbc:      	jmp	0x119c <evaluate_hand+0x567>
     fc1:      	cmpl	$0x3, -0x7c(%rbp)
     fc5:      	jne	0xff3 <evaluate_hand+0x3be>
     fc7:      	movq	-0x88(%rbp), %rax
     fce:      	movq	-0x60(%rbp), %rdx
     fd2:      	movq	-0x90(%rbp), %rsi
     fd9:      	movq	%rdx, %r8
     fdc:      	movl	$0x5, %ecx
     fe1:      	movl	$0x3, %edx
     fe6:      	movq	%rax, %rdi
     fe9:      	callq	0xfee <evaluate_hand+0x3b9>
;   build_hand_from_match+-4
     fee:      	jmp	0x119c <evaluate_hand+0x567>
     ff3:      	cmpq	$0x0, -0x58(%rbp)
     ff8:      	js	0x1147 <evaluate_hand+0x512>
     ffe:      	cmpl	$0x2, -0x7c(%rbp)
    1002:      	je	0x1023 <evaluate_hand+0x3ee>
    1004:      	leaq	(%rip), %rcx            # 0x100b <evaluate_hand+0x3d6>
;   .rodata -> "evaluate_hand"
    100b:      	movl	$0x14b, %edx            # imm = 0x14B
    1010:      	leaq	(%rip), %rsi            # 0x1017 <evaluate_hand+0x3e2>
;   .rodata -> "eval.c"
    1017:      	leaq	(%rip), %rdi            # 0x101e <evaluate_hand+0x3e9>
;   .rodata -> "n_of_a_kind ==2"
    101e:      	callq	0x1023 <evaluate_hand+0x3ee>
;   __assert_fail+-4
    1023:      	leaq	-0xc0(%rbp), %rax
    102a:      	movq	-0x60(%rbp), %rdx
    102e:      	movq	-0x90(%rbp), %rsi
    1035:      	movq	%rdx, %r8
    1038:      	movl	$0x6, %ecx
    103d:      	movl	$0x2, %edx
    1042:      	movq	%rax, %rdi
    1045:      	callq	0x104a <evaluate_hand+0x415>
;   build_hand_from_match+-4
    104a:      	movq	-0xc0(%rbp), %rax
    1051:      	movq	-0xb8(%rbp), %rdx
    1058:      	movq	%rax, -0x50(%rbp)
    105c:      	movq	%rdx, -0x48(%rbp)
    1060:      	movq	-0xb0(%rbp), %rax
    1067:      	movq	-0xa8(%rbp), %rdx
    106e:      	movq	%rax, -0x40(%rbp)
    1072:      	movq	%rdx, -0x38(%rbp)
    1076:      	movq	-0xa0(%rbp), %rax
    107d:      	movq	-0x98(%rbp), %rdx
    1084:      	movq	%rax, -0x30(%rbp)
    1088:      	movq	%rdx, -0x28(%rbp)
    108c:      	movq	-0x90(%rbp), %rax
    1093:      	movq	(%rax), %rax
    1096:      	movq	-0x58(%rbp), %rdx
    109a:      	shlq	$0x3, %rdx
    109e:      	addq	%rdx, %rax
    10a1:      	movq	(%rax), %rax
    10a4:      	movq	%rax, -0x38(%rbp)
    10a8:      	movq	-0x90(%rbp), %rax
    10af:      	movq	(%rax), %rax
    10b2:      	movq	-0x58(%rbp), %rdx
    10b6:      	addq	$0x1, %rdx
    10ba:      	shlq	$0x3, %rdx
    10be:      	addq	%rdx, %rax
    10c1:      	movq	(%rax), %rax
    10c4:      	movq	%rax, -0x30(%rbp)
    10c8:      	cmpq	$0x0, -0x60(%rbp)
    10cd:      	je	0x10e2 <evaluate_hand+0x4ad>
    10cf:      	movq	-0x90(%rbp), %rax
    10d6:      	movq	(%rax), %rax
    10d9:      	movq	(%rax), %rax
    10dc:      	movq	%rax, -0x28(%rbp)
    10e0:      	jmp	0x110f <evaluate_hand+0x4da>
    10e2:      	cmpq	$0x2, -0x58(%rbp)
    10e7:      	jle	0x10fd <evaluate_hand+0x4c8>
    10e9:      	movq	-0x90(%rbp), %rax
    10f0:      	movq	(%rax), %rax
    10f3:      	movq	0x10(%rax), %rax
    10f7:      	movq	%rax, -0x28(%rbp)
    10fb:      	jmp	0x110f <evaluate_hand+0x4da>
    10fd:      	movq	-0x90(%rbp), %rax
    1104:      	movq	(%rax), %rax
    1107:      	movq	0x20(%rax), %rax
    110b:      	movq	%rax, -0x28(%rbp)
    110f:      	movq	-0x88(%rbp), %rax
    1116:      	movq	-0x50(%rbp), %rcx
    111a:      	movq	-0x48(%rbp), %rbx
    111e:      	movq	%rcx, (%rax)
    1121:      	movq	%rbx, 0x8(%rax)
    1125:      	movq	-0x40(%rbp), %rcx
    1129:      	movq	-0x38(%rbp), %rbx
    112d:      	movq	%rcx, 0x10(%rax)
    1131:      	movq	%rbx, 0x18(%rax)
    1135:      	movq	-0x30(%rbp), %rcx
    1139:      	movq	-0x28(%rbp), %rbx
    113d:      	movq	%rcx, 0x20(%rax)
    1141:      	movq	%rbx, 0x28(%rax)
    1145:      	jmp	0x119c <evaluate_hand+0x567>
    1147:      	cmpl	$0x2, -0x7c(%rbp)
    114b:      	jne	0x1176 <evaluate_hand+0x541>
    114d:      	movq	-0x88(%rbp), %rax
    1154:      	movq	-0x60(%rbp), %rdx
    1158:      	movq	-0x90(%rbp), %rsi
    115f:      	movq	%rdx, %r8
    1162:      	movl	$0x7, %ecx
    1167:      	movl	$0x2, %edx
    116c:      	movq	%rax, %rdi
    116f:      	callq	0x1174 <evaluate_hand+0x53f>
;   build_hand_from_match+-4
    1174:      	jmp	0x119c <evaluate_hand+0x567>
    1176:      	movq	-0x88(%rbp), %rax
    117d:      	movq	-0x90(%rbp), %rsi
    1184:      	movl	$0x0, %r8d
    118a:      	movl	$0x8, %ecx
    118f:      	movl	$0x0, %edx
    1194:      	movq	%rax, %rdi
    1197:      	callq	0x119c <evaluate_hand+0x567>
;   build_hand_from_match+-4
    119c:      	movq	-0x18(%rbp), %rax
    11a0:      	xorq	%fs:0x28, %rax
    11a9:      	je	0x11b0 <evaluate_hand+0x57b>
    11ab:      	callq	0x11b0 <evaluate_hand+0x57b>
;   __stack_chk_fail+-4
    11b0:      	movq	-0x88(%rbp), %rax
    11b7:      	addq	$0xb8, %rsp
    11be:      	popq	%rbx
    11bf:      	popq	%rbp
    11c0:      	retq
```
