# ELF RE report: `c3prj2_eval/test-eval.o`

- size: 7808 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `test-eval.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `__PRETTY_FUNCTION__.3251` | STT_OBJECT | STB_LOCAL | .rodata | 0x250 | 14 |
| `describe_hand` | STT_FUNC | STB_GLOBAL | .text | 0x0 | 1123 |
| `main` | STT_FUNC | STB_GLOBAL | .text | 0x463 | 803 |

## Undefined (imported) symbols

```
_GLOBAL_OFFSET_TABLE_
print_hand
putchar
printf
stderr
fwrite
print_card
exit
flush_suit
puts
suit_letter
is_straight_at
get_match_counts
get_largest_element
__assert_fail
get_match_index
find_secondary_pair
free
value_letter
evaluate_hand
ranking_to_string
__stack_chk_fail
stdin
fopen
fprintf
__ctype_b_loc
strchr
hand_from_string
card_ptr_comp
qsort
free_deck
compare_hands
getline
fclose
```

## String literals in .rodata

- `+0x0`  "Warning: had has %zu cards (may behave oddly)\n"
- `+0x2f`  "Duplicated card in hand"
- `+0x47`  " at index %zu and %zu\n"
- `+0x5e`  " - No flush"
- `+0x6a`  " - Flush in suit %c\n"
- `+0x80`  " - Straight flush at index %zu\n"
- `+0xa0`  " - Straight at index %zu\n"
- `+0xba`  "test-eval.c"
- `+0xc6`  "n_of_a_kind <= 4"
- `+0xd8`  " - The most of a kind is %d of a kind (at index %zu / value %c)\n"
- `+0x120`  " - Secondary pair at index %zd (value %c)\n"
- `+0x14b`  " - No secondary pair"
- `+0x160`  " - evaluate_hand's ranking: %s\n"
- `+0x180`  " - 5 cards used for hand: "
- `+0x19d`  "Could not open %s\n"
- `+0x1b0`  "Invalid input line: %s (no ; to split hands)\n"
- `+0x1de`  "Hand 1:"
- `+0x1e6`  "--------"
- `+0x1ef`  "Hand 2:"
- `+0x1f7`  "Comparison : "
- `+0x205`  "--------------"
- `+0x214`  "Hand 1 wins!"
- `+0x221`  "Tie"
- `+0x225`  "Hand 2 wins!"
- `+0x232`  "============================"
- `+0x250`  "describe_hand"

## String literals grouped by referencing function

### `describe_hand`

- "Warning: had has %zu cards (may behave oddly)\n"
- "Duplicated card in hand"
- " at index %zu and %zu\n"
- " - No flush"
- " - Flush in suit %c\n"
- " - Straight flush at index %zu\n"
- " - Straight at index %zu\n"
- "describe_hand"
- "test-eval.c"
- "n_of_a_kind <= 4"
- " - The most of a kind is %d of a kind (at index %zu / value %c)\n"
- " - Secondary pair at index %zd (value %c)\n"
- " - No secondary pair"
- " - evaluate_hand's ranking: %s\n"
- " - 5 cards used for hand: "

### `main`

- "r"
- "Could not open %s\n"
- "Invalid input line: %s (no ; to split hands)\n"
- "Hand 1:"
- "--------"
- "Hand 2:"
- "Comparison : "
- "--------------"
- "Hand 1 wins!"
- "Tie"
- "Hand 2 wins!"
- "============================"

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/c3prj2_eval/test-eval.o:	file format elf64-x86-64

Disassembly of section .text:

0000000000000000 <describe_hand>:
       0:      	endbr64
       4:      	pushq	%rbp
       5:      	movq	%rsp, %rbp
       8:      	subq	$0xa0, %rsp
       f:      	movq	%rdi, -0x98(%rbp)
      16:      	movq	%fs:0x28, %rax
      1f:      	movq	%rax, -0x8(%rbp)
      23:      	xorl	%eax, %eax
      25:      	movq	-0x98(%rbp), %rax
      2c:      	movq	%rax, %rdi
      2f:      	callq	0x34 <describe_hand+0x34>
;   print_hand+-4
      34:      	movl	$0xa, %edi
      39:      	callq	0x3e <describe_hand+0x3e>
;   putchar+-4
      3e:      	movq	-0x98(%rbp), %rax
      45:      	movq	0x8(%rax), %rax
      49:      	cmpq	$0x8, %rax
      4d:      	jbe	0x6e <describe_hand+0x6e>
      4f:      	movq	-0x98(%rbp), %rax
      56:      	movq	0x8(%rax), %rax
      5a:      	movq	%rax, %rsi
      5d:      	leaq	(%rip), %rdi            # 0x64 <describe_hand+0x64>
;   .rodata -> "Warning: had has %zu cards (may behave oddly)\n"
      64:      	movl	$0x0, %eax
      69:      	callq	0x6e <describe_hand+0x6e>
;   printf+-4
      6e:      	movq	$0x0, -0x80(%rbp)
      76:      	jmp	0x187 <describe_hand+0x187>
      7b:      	movq	-0x80(%rbp), %rax
      7f:      	addq	$0x1, %rax
      83:      	movq	%rax, -0x78(%rbp)
      87:      	jmp	0x16d <describe_hand+0x16d>
      8c:      	movq	-0x98(%rbp), %rax
      93:      	movq	(%rax), %rax
      96:      	movq	-0x80(%rbp), %rdx
      9a:      	shlq	$0x3, %rdx
      9e:      	addq	%rdx, %rax
      a1:      	movq	(%rax), %rax
      a4:      	movl	(%rax), %edx
      a6:      	movq	-0x98(%rbp), %rax
      ad:      	movq	(%rax), %rax
      b0:      	movq	-0x78(%rbp), %rcx
      b4:      	shlq	$0x3, %rcx
      b8:      	addq	%rcx, %rax
      bb:      	movq	(%rax), %rax
      be:      	movl	(%rax), %eax
      c0:      	cmpl	%eax, %edx
      c2:      	jne	0x168 <describe_hand+0x168>
      c8:      	movq	-0x98(%rbp), %rax
      cf:      	movq	(%rax), %rax
      d2:      	movq	-0x80(%rbp), %rdx
      d6:      	shlq	$0x3, %rdx
      da:      	addq	%rdx, %rax
      dd:      	movq	(%rax), %rax
      e0:      	movl	0x4(%rax), %edx
      e3:      	movq	-0x98(%rbp), %rax
      ea:      	movq	(%rax), %rax
      ed:      	movq	-0x78(%rbp), %rcx
      f1:      	shlq	$0x3, %rcx
      f5:      	addq	%rcx, %rax
      f8:      	movq	(%rax), %rax
      fb:      	movl	0x4(%rax), %eax
      fe:      	cmpl	%eax, %edx
     100:      	jne	0x168 <describe_hand+0x168>
     102:      	movq	(%rip), %rax            # 0x109 <describe_hand+0x109>
;   stderr+-4
     109:      	movq	%rax, %rcx
     10c:      	movl	$0x17, %edx
     111:      	movl	$0x1, %esi
     116:      	leaq	(%rip), %rdi            # 0x11d <describe_hand+0x11d>
;   .rodata -> "Duplicated card in hand"
     11d:      	callq	0x122 <describe_hand+0x122>
;   fwrite+-4
     122:      	movq	-0x98(%rbp), %rax
     129:      	movq	(%rax), %rax
     12c:      	movq	-0x80(%rbp), %rdx
     130:      	shlq	$0x3, %rdx
     134:      	addq	%rdx, %rax
     137:      	movq	(%rax), %rax
     13a:      	movq	(%rax), %rdi
     13d:      	callq	0x142 <describe_hand+0x142>
;   print_card+-4
     142:      	movq	-0x78(%rbp), %rdx
     146:      	movq	-0x80(%rbp), %rax
     14a:      	movq	%rax, %rsi
     14d:      	leaq	(%rip), %rdi            # 0x154 <describe_hand+0x154>
;   .rodata -> " at index %zu and %zu\n"
     154:      	movl	$0x0, %eax
     159:      	callq	0x15e <describe_hand+0x15e>
;   printf+-4
     15e:      	movl	$0x1, %edi
     163:      	callq	0x168 <describe_hand+0x168>
;   exit+-4
     168:      	addq	$0x1, -0x78(%rbp)
     16d:      	movq	-0x98(%rbp), %rax
     174:      	movq	0x8(%rax), %rax
     178:      	cmpq	%rax, -0x78(%rbp)
     17c:      	jb	0x8c <describe_hand+0x8c>
     182:      	addq	$0x1, -0x80(%rbp)
     187:      	movq	-0x98(%rbp), %rax
     18e:      	movq	0x8(%rax), %rax
     192:      	cmpq	%rax, -0x80(%rbp)
     196:      	jb	0x7b <describe_hand+0x7b>
     19c:      	movq	-0x98(%rbp), %rax
     1a3:      	movq	%rax, %rdi
     1a6:      	callq	0x1ab <describe_hand+0x1ab>
;   flush_suit+-4
     1ab:      	movl	%eax, -0x88(%rbp)
     1b1:      	cmpl	$0x4, -0x88(%rbp)
     1b8:      	jne	0x1c8 <describe_hand+0x1c8>
     1ba:      	leaq	(%rip), %rdi            # 0x1c1 <describe_hand+0x1c1>
;   .rodata -> " - No flush"
     1c1:      	callq	0x1c6 <describe_hand+0x1c6>
;   puts+-4
     1c6:      	jmp	0x202 <describe_hand+0x202>
     1c8:      	movq	$0x0, -0x50(%rbp)
     1d0:      	movl	$0xa, -0x50(%rbp)
     1d7:      	movl	-0x88(%rbp), %eax
     1dd:      	movl	%eax, -0x4c(%rbp)
     1e0:      	movq	-0x50(%rbp), %rax
     1e4:      	movq	%rax, %rdi
     1e7:      	callq	0x1ec <describe_hand+0x1ec>
;   suit_letter+-4
     1ec:      	movsbl	%al, %eax
     1ef:      	movl	%eax, %esi
     1f1:      	leaq	(%rip), %rdi            # 0x1f8 <describe_hand+0x1f8>
;   .rodata -> " - Flush in suit %c\n"
     1f8:      	movl	$0x0, %eax
     1fd:      	callq	0x202 <describe_hand+0x202>
;   printf+-4
     202:      	movq	$0x0, -0x70(%rbp)
     20a:      	jmp	0x28b <describe_hand+0x28b>
     20c:      	cmpl	$0x4, -0x88(%rbp)
     213:      	je	0x24f <describe_hand+0x24f>
     215:      	movl	-0x88(%rbp), %edx
     21b:      	movq	-0x70(%rbp), %rcx
     21f:      	movq	-0x98(%rbp), %rax
     226:      	movq	%rcx, %rsi
     229:      	movq	%rax, %rdi
     22c:      	callq	0x231 <describe_hand+0x231>
;   is_straight_at+-4
     231:      	testl	%eax, %eax
     233:      	je	0x24f <describe_hand+0x24f>
     235:      	movq	-0x70(%rbp), %rax
     239:      	movq	%rax, %rsi
     23c:      	leaq	(%rip), %rdi            # 0x243 <describe_hand+0x243>
;   .rodata -> " - Straight flush at index %zu\n"
     243:      	movl	$0x0, %eax
     248:      	callq	0x24d <describe_hand+0x24d>
;   printf+-4
     24d:      	jmp	0x286 <describe_hand+0x286>
     24f:      	movq	-0x70(%rbp), %rcx
     253:      	movq	-0x98(%rbp), %rax
     25a:      	movl	$0x4, %edx
     25f:      	movq	%rcx, %rsi
     262:      	movq	%rax, %rdi
     265:      	callq	0x26a <describe_hand+0x26a>
;   is_straight_at+-4
     26a:      	testl	%eax, %eax
     26c:      	je	0x286 <describe_hand+0x286>
     26e:      	movq	-0x70(%rbp), %rax
     272:      	movq	%rax, %rsi
     275:      	leaq	(%rip), %rdi            # 0x27c <describe_hand+0x27c>
;   .rodata -> " - Straight at index %zu\n"
     27c:      	movl	$0x0, %eax
     281:      	callq	0x286 <describe_hand+0x286>
;   printf+-4
     286:      	addq	$0x1, -0x70(%rbp)
     28b:      	movq	-0x98(%rbp), %rax
     292:      	movq	0x8(%rax), %rax
     296:      	subq	$0x5, %rax
     29a:      	cmpq	%rax, -0x70(%rbp)
     29e:      	jbe	0x20c <describe_hand+0x20c>
     2a4:      	movq	-0x98(%rbp), %rax
     2ab:      	movq	%rax, %rdi
     2ae:      	callq	0x2b3 <describe_hand+0x2b3>
;   get_match_counts+-4
     2b3:      	movq	%rax, -0x68(%rbp)
     2b7:      	movq	-0x98(%rbp), %rax
     2be:      	movq	0x8(%rax), %rdx
     2c2:      	movq	-0x68(%rbp), %rax
     2c6:      	movq	%rdx, %rsi
     2c9:      	movq	%rax, %rdi
     2cc:      	callq	0x2d1 <describe_hand+0x2d1>
;   get_largest_element+-4
     2d1:      	movl	%eax, -0x84(%rbp)
     2d7:      	cmpl	$0x4, -0x84(%rbp)
     2de:      	jbe	0x2ff <describe_hand+0x2ff>
     2e0:      	leaq	(%rip), %rcx            # 0x2e7 <describe_hand+0x2e7>
;   .rodata -> "describe_hand"
     2e7:      	movl	$0x38, %edx
     2ec:      	leaq	(%rip), %rsi            # 0x2f3 <describe_hand+0x2f3>
;   .rodata -> "test-eval.c"
     2f3:      	leaq	(%rip), %rdi            # 0x2fa <describe_hand+0x2fa>
;   .rodata -> "n_of_a_kind <= 4"
     2fa:      	callq	0x2ff <describe_hand+0x2ff>
;   __assert_fail+-4
     2ff:      	movq	-0x98(%rbp), %rax
     306:      	movq	0x8(%rax), %rcx
     30a:      	movl	-0x84(%rbp), %edx
     310:      	movq	-0x68(%rbp), %rax
     314:      	movq	%rcx, %rsi
     317:      	movq	%rax, %rdi
     31a:      	callq	0x31f <describe_hand+0x31f>
;   get_match_index+-4
     31f:      	movq	%rax, -0x60(%rbp)
     323:      	movq	-0x60(%rbp), %rdx
     327:      	movq	-0x68(%rbp), %rcx
     32b:      	movq	-0x98(%rbp), %rax
     332:      	movq	%rcx, %rsi
     335:      	movq	%rax, %rdi
     338:      	callq	0x33d <describe_hand+0x33d>
;   find_secondary_pair+-4
     33d:      	movq	%rax, -0x58(%rbp)
     341:      	movq	-0x68(%rbp), %rax
     345:      	movq	%rax, %rdi
     348:      	callq	0x34d <describe_hand+0x34d>
;   free+-4
     34d:      	movq	-0x98(%rbp), %rax
     354:      	movq	(%rax), %rax
     357:      	movq	-0x60(%rbp), %rdx
     35b:      	shlq	$0x3, %rdx
     35f:      	addq	%rdx, %rax
     362:      	movq	(%rax), %rax
     365:      	movq	(%rax), %rdi
     368:      	callq	0x36d <describe_hand+0x36d>
;   value_letter+-4
     36d:      	movsbl	%al, %ecx
     370:      	movq	-0x60(%rbp), %rdx
     374:      	movl	-0x84(%rbp), %eax
     37a:      	movl	%eax, %esi
     37c:      	leaq	(%rip), %rdi            # 0x383 <describe_hand+0x383>
;   .rodata -> " - The most of a kind is %d of a kind (at index %zu / value %c)\n"
     383:      	movl	$0x0, %eax
     388:      	callq	0x38d <describe_hand+0x38d>
;   printf+-4
     38d:      	cmpq	$0x0, -0x58(%rbp)
     392:      	js	0x3d1 <describe_hand+0x3d1>
     394:      	movq	-0x98(%rbp), %rax
     39b:      	movq	(%rax), %rax
     39e:      	movq	-0x58(%rbp), %rdx
     3a2:      	shlq	$0x3, %rdx
     3a6:      	addq	%rdx, %rax
     3a9:      	movq	(%rax), %rax
     3ac:      	movq	(%rax), %rdi
     3af:      	callq	0x3b4 <describe_hand+0x3b4>
;   value_letter+-4
     3b4:      	movsbl	%al, %edx
     3b7:      	movq	-0x58(%rbp), %rax
     3bb:      	movq	%rax, %rsi
     3be:      	leaq	(%rip), %rdi            # 0x3c5 <describe_hand+0x3c5>
;   .rodata -> " - Secondary pair at index %zd (value %c)\n"
     3c5:      	movl	$0x0, %eax
     3ca:      	callq	0x3cf <describe_hand+0x3cf>
;   printf+-4
     3cf:      	jmp	0x3dd <describe_hand+0x3dd>
     3d1:      	leaq	(%rip), %rdi            # 0x3d8 <describe_hand+0x3d8>
;   .rodata -> " - No secondary pair"
     3d8:      	callq	0x3dd <describe_hand+0x3dd>
;   puts+-4
     3dd:      	leaq	-0x40(%rbp), %rax
     3e1:      	movq	-0x98(%rbp), %rdx
     3e8:      	movq	%rdx, %rsi
     3eb:      	movq	%rax, %rdi
     3ee:      	callq	0x3f3 <describe_hand+0x3f3>
;   evaluate_hand+-4
     3f3:      	movl	-0x40(%rbp), %eax
     3f6:      	movl	%eax, %edi
     3f8:      	callq	0x3fd <describe_hand+0x3fd>
;   ranking_to_string+-4
     3fd:      	movq	%rax, %rsi
     400:      	leaq	(%rip), %rdi            # 0x407 <describe_hand+0x407>
;   .rodata -> " - evaluate_hand's ranking: %s\n"
     407:      	movl	$0x0, %eax
     40c:      	callq	0x411 <describe_hand+0x411>
;   printf+-4
     411:      	movq	$0x5, -0x48(%rbp)
     419:      	leaq	-0x40(%rbp), %rax
     41d:      	addq	$0x8, %rax
     421:      	movq	%rax, -0x50(%rbp)
     425:      	leaq	(%rip), %rdi            # 0x42c <describe_hand+0x42c>
;   .rodata -> " - 5 cards used for hand: "
     42c:      	movl	$0x0, %eax
     431:      	callq	0x436 <describe_hand+0x436>
;   printf+-4
     436:      	leaq	-0x50(%rbp), %rax
     43a:      	movq	%rax, %rdi
     43d:      	callq	0x442 <describe_hand+0x442>
;   print_hand+-4
     442:      	movl	$0xa, %edi
     447:      	callq	0x44c <describe_hand+0x44c>
;   putchar+-4
     44c:      	nop
     44d:      	movq	-0x8(%rbp), %rax
     451:      	xorq	%fs:0x28, %rax
     45a:      	je	0x461 <describe_hand+0x461>
     45c:      	callq	0x461 <describe_hand+0x461>
;   __stack_chk_fail+-4
     461:      	leave
     462:      	retq

0000000000000463 <main>:
     463:      	endbr64
     467:      	pushq	%rbp
     468:      	movq	%rsp, %rbp
     46b:      	subq	$0x60, %rsp
     46f:      	movl	%edi, -0x54(%rbp)
     472:      	movq	%rsi, -0x60(%rbp)
     476:      	movq	%fs:0x28, %rax
     47f:      	movq	%rax, -0x8(%rbp)
     483:      	xorl	%eax, %eax
     485:      	cmpl	$0x1, -0x54(%rbp)
     489:      	jne	0x498 <main+0x35>
     48b:      	movq	(%rip), %rax            # 0x492 <main+0x2f>
;   stdin+-4
     492:      	movq	%rax, -0x30(%rbp)
     496:      	jmp	0x4ed <main+0x8a>
     498:      	movq	-0x60(%rbp), %rax
     49c:      	addq	$0x8, %rax
     4a0:      	movq	(%rax), %rax
     4a3:      	leaq	(%rip), %rsi            # 0x4aa <main+0x47>
;   .rodata -> "r"
     4aa:      	movq	%rax, %rdi
     4ad:      	callq	0x4b2 <main+0x4f>
;   fopen+-4
     4b2:      	movq	%rax, -0x30(%rbp)
     4b6:      	cmpq	$0x0, -0x30(%rbp)
     4bb:      	jne	0x4ed <main+0x8a>
     4bd:      	movq	-0x60(%rbp), %rax
     4c1:      	addq	$0x8, %rax
     4c5:      	movq	(%rax), %rdx
     4c8:      	movq	(%rip), %rax            # 0x4cf <main+0x6c>
;   stderr+-4
     4cf:      	leaq	(%rip), %rsi            # 0x4d6 <main+0x73>
;   .rodata -> "Could not open %s\n"
     4d6:      	movq	%rax, %rdi
     4d9:      	movl	$0x0, %eax
     4de:      	callq	0x4e3 <main+0x80>
;   fprintf+-4
     4e3:      	movl	$0x1, %eax
     4e8:      	jmp	0x770 <main+0x30d>
     4ed:      	movq	$0x0, -0x40(%rbp)
     4f5:      	movq	$0x0, -0x38(%rbp)
     4fd:      	jmp	0x726 <main+0x2c3>
     502:      	movq	-0x38(%rbp), %rax
     506:      	movq	%rax, -0x28(%rbp)
     50a:      	jmp	0x511 <main+0xae>
     50c:      	addq	$0x1, -0x28(%rbp)
     511:      	callq	0x516 <main+0xb3>
;   __ctype_b_loc+-4
     516:      	movq	(%rax), %rdx
     519:      	movq	-0x28(%rbp), %rax
     51d:      	movzbl	(%rax), %eax
     520:      	movsbq	%al, %rax
     524:      	addq	%rax, %rax
     527:      	addq	%rdx, %rax
     52a:      	movzwl	(%rax), %eax
     52d:      	movzwl	%ax, %eax
     530:      	andl	$0x2000, %eax           # imm = 0x2000
     535:      	testl	%eax, %eax
     537:      	je	0x544 <main+0xe1>
     539:      	movq	-0x28(%rbp), %rax
     53d:      	movzbl	(%rax), %eax
     540:      	testb	%al, %al
     542:      	jne	0x50c <main+0xa9>
     544:      	movq	-0x28(%rbp), %rax
     548:      	movzbl	(%rax), %eax
     54b:      	testb	%al, %al
     54d:      	jne	0x554 <main+0xf1>
     54f:      	jmp	0x726 <main+0x2c3>
     554:      	movq	-0x38(%rbp), %rax
     558:      	movl	$0x3b, %esi
     55d:      	movq	%rax, %rdi
     560:      	callq	0x565 <main+0x102>
;   strchr+-4
     565:      	movq	%rax, -0x20(%rbp)
     569:      	cmpq	$0x0, -0x20(%rbp)
     56e:      	jne	0x594 <main+0x131>
     570:      	movq	-0x38(%rbp), %rdx
     574:      	movq	(%rip), %rax            # 0x57b <main+0x118>
;   stderr+-4
     57b:      	leaq	(%rip), %rsi            # 0x582 <main+0x11f>
;   .rodata -> "Invalid input line: %s (no ; to split hands)\n"
     582:      	movq	%rax, %rdi
     585:      	movl	$0x0, %eax
     58a:      	callq	0x58f <main+0x12c>
;   fprintf+-4
     58f:      	jmp	0x726 <main+0x2c3>
     594:      	movq	-0x20(%rbp), %rax
     598:      	movb	$0x0, (%rax)
     59b:      	addq	$0x1, -0x20(%rbp)
     5a0:      	movq	-0x38(%rbp), %rax
     5a4:      	movl	$0x0, %esi
     5a9:      	movq	%rax, %rdi
     5ac:      	callq	0x5b1 <main+0x14e>
;   hand_from_string+-4
     5b1:      	movq	%rax, -0x18(%rbp)
     5b5:      	movq	-0x20(%rbp), %rax
     5b9:      	movl	$0x0, %esi
     5be:      	movq	%rax, %rdi
     5c1:      	callq	0x5c6 <main+0x163>
;   hand_from_string+-4
     5c6:      	movq	%rax, -0x10(%rbp)
     5ca:      	movq	-0x18(%rbp), %rax
     5ce:      	movq	0x8(%rax), %rsi
     5d2:      	movq	-0x18(%rbp), %rax
     5d6:      	movq	(%rax), %rax
     5d9:      	movq	(%rip), %rdx            # 0x5e0 <main+0x17d>
;   card_ptr_comp+-4
     5e0:      	movq	%rdx, %rcx
     5e3:      	movl	$0x8, %edx
     5e8:      	movq	%rax, %rdi
     5eb:      	callq	0x5f0 <main+0x18d>
;   qsort+-4
     5f0:      	movq	-0x10(%rbp), %rax
     5f4:      	movq	0x8(%rax), %rsi
     5f8:      	movq	-0x10(%rbp), %rax
     5fc:      	movq	(%rax), %rax
     5ff:      	movq	(%rip), %rdx            # 0x606 <main+0x1a3>
;   card_ptr_comp+-4
     606:      	movq	%rdx, %rcx
     609:      	movl	$0x8, %edx
     60e:      	movq	%rax, %rdi
     611:      	callq	0x616 <main+0x1b3>
;   qsort+-4
     616:      	leaq	(%rip), %rdi            # 0x61d <main+0x1ba>
;   .rodata -> "Hand 1:"
     61d:      	callq	0x622 <main+0x1bf>
;   puts+-4
     622:      	leaq	(%rip), %rdi            # 0x629 <main+0x1c6>
;   .rodata -> "--------"
     629:      	callq	0x62e <main+0x1cb>
;   puts+-4
     62e:      	movq	-0x18(%rbp), %rax
     632:      	movq	%rax, %rdi
     635:      	callq	0x63a <main+0x1d7>
;   describe_hand+-4
     63a:      	leaq	(%rip), %rdi            # 0x641 <main+0x1de>
;   .rodata -> "Hand 2:"
     641:      	callq	0x646 <main+0x1e3>
;   puts+-4
     646:      	leaq	(%rip), %rdi            # 0x64d <main+0x1ea>
;   .rodata -> "--------"
     64d:      	callq	0x652 <main+0x1ef>
;   puts+-4
     652:      	movq	-0x10(%rbp), %rax
     656:      	movq	%rax, %rdi
     659:      	callq	0x65e <main+0x1fb>
;   describe_hand+-4
     65e:      	movq	-0x18(%rbp), %rax
     662:      	movq	%rax, %rdi
     665:      	callq	0x66a <main+0x207>
;   free_deck+-4
     66a:      	movq	-0x10(%rbp), %rax
     66e:      	movq	%rax, %rdi
     671:      	callq	0x676 <main+0x213>
;   free_deck+-4
     676:      	movq	-0x38(%rbp), %rax
     67a:      	movl	$0x0, %esi
     67f:      	movq	%rax, %rdi
     682:      	callq	0x687 <main+0x224>
;   hand_from_string+-4
     687:      	movq	%rax, -0x18(%rbp)
     68b:      	movq	-0x20(%rbp), %rax
     68f:      	movl	$0x0, %esi
     694:      	movq	%rax, %rdi
     697:      	callq	0x69c <main+0x239>
;   hand_from_string+-4
     69c:      	movq	%rax, -0x10(%rbp)
     6a0:      	movq	-0x10(%rbp), %rdx
     6a4:      	movq	-0x18(%rbp), %rax
     6a8:      	movq	%rdx, %rsi
     6ab:      	movq	%rax, %rdi
     6ae:      	callq	0x6b3 <main+0x250>
;   compare_hands+-4
     6b3:      	movl	%eax, -0x44(%rbp)
     6b6:      	leaq	(%rip), %rdi            # 0x6bd <main+0x25a>
;   .rodata -> "Comparison : "
     6bd:      	callq	0x6c2 <main+0x25f>
;   puts+-4
     6c2:      	leaq	(%rip), %rdi            # 0x6c9 <main+0x266>
;   .rodata -> "--------------"
     6c9:      	callq	0x6ce <main+0x26b>
;   puts+-4
     6ce:      	cmpl	$0x0, -0x44(%rbp)
     6d2:      	jle	0x6e2 <main+0x27f>
     6d4:      	leaq	(%rip), %rdi            # 0x6db <main+0x278>
;   .rodata -> "Hand 1 wins!"
     6db:      	callq	0x6e0 <main+0x27d>
;   puts+-4
     6e0:      	jmp	0x702 <main+0x29f>
     6e2:      	cmpl	$0x0, -0x44(%rbp)
     6e6:      	jne	0x6f6 <main+0x293>
     6e8:      	leaq	(%rip), %rdi            # 0x6ef <main+0x28c>
;   .rodata -> "Tie"
     6ef:      	callq	0x6f4 <main+0x291>
;   puts+-4
     6f4:      	jmp	0x702 <main+0x29f>
     6f6:      	leaq	(%rip), %rdi            # 0x6fd <main+0x29a>
;   .rodata -> "Hand 2 wins!"
     6fd:      	callq	0x702 <main+0x29f>
;   puts+-4
     702:      	movq	-0x18(%rbp), %rax
     706:      	movq	%rax, %rdi
     709:      	callq	0x70e <main+0x2ab>
;   free_deck+-4
     70e:      	movq	-0x10(%rbp), %rax
     712:      	movq	%rax, %rdi
     715:      	callq	0x71a <main+0x2b7>
;   free_deck+-4
     71a:      	leaq	(%rip), %rdi            # 0x721 <main+0x2be>
;   .rodata -> "============================"
     721:      	callq	0x726 <main+0x2c3>
;   puts+-4
     726:      	movq	-0x30(%rbp), %rdx
     72a:      	leaq	-0x40(%rbp), %rcx
     72e:      	leaq	-0x38(%rbp), %rax
     732:      	movq	%rcx, %rsi
     735:      	movq	%rax, %rdi
     738:      	callq	0x73d <main+0x2da>
;   getline+-4
     73d:      	testq	%rax, %rax
     740:      	jg	0x502 <main+0x9f>
     746:      	movq	-0x38(%rbp), %rax
     74a:      	movq	%rax, %rdi
     74d:      	callq	0x752 <main+0x2ef>
;   free+-4
     752:      	movq	(%rip), %rax            # 0x759 <main+0x2f6>
;   stdin+-4
     759:      	cmpq	%rax, -0x30(%rbp)
     75d:      	je	0x76b <main+0x308>
     75f:      	movq	-0x30(%rbp), %rax
     763:      	movq	%rax, %rdi
     766:      	callq	0x76b <main+0x308>
;   fclose+-4
     76b:      	movl	$0x0, %eax
     770:      	movq	-0x8(%rbp), %rcx
     774:      	xorq	%fs:0x28, %rcx
     77d:      	je	0x784 <main+0x321>
     77f:      	callq	0x784 <main+0x321>
;   __stack_chk_fail+-4
     784:      	leave
     785:      	retq
```
