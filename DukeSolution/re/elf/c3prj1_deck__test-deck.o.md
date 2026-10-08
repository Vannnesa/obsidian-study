# ELF RE report: `c3prj1_deck/test-deck.o`

- size: 11872 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `test-deck.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `__PRETTY_FUNCTION__.2916` | STT_OBJECT | STB_LOCAL | .rodata | 0x2e8 | 15 |
| `__PRETTY_FUNCTION__.2936` | STT_OBJECT | STB_LOCAL | .rodata | 0x2f8 | 14 |
| `__PRETTY_FUNCTION__.2952` | STT_OBJECT | STB_LOCAL | .rodata | 0x310 | 22 |
| `add_and_print` | STT_FUNC | STB_GLOBAL | .text | 0x0 | 162 |
| `check_contains` | STT_FUNC | STB_GLOBAL | .text | 0xa2 | 211 |
| `cnum_for_stest` | STT_FUNC | STB_GLOBAL | .text | 0x175 | 277 |
| `numerize_hand` | STT_FUNC | STB_GLOBAL | .text | 0x28a | 333 |
| `reverse_engineer_hand` | STT_FUNC | STB_GLOBAL | .text | 0x3d7 | 819 |
| `test_reh` | STT_FUNC | STB_GLOBAL | .text | 0x70a | 15 |
| `main` | STT_FUNC | STB_GLOBAL | .text | 0x719 | 1875 |

## Undefined (imported) symbols

```
_GLOBAL_OFFSET_TABLE_
printf
stdout
fflush
card_from_letters
add_card_to
print_hand
putchar
deck_contains
stderr
fwrite
exit
__assert_fail
abort
__stack_chk_fail
puts
make_deck_exclude
assert_full_deck
shuffle
malloc
putc
free_deck
```

## String literals in .rodata

- `+0x0`  "Adding the %c%c"
- `+0x10`  " results in: "
- `+0x20`  "Checking if the hand contains %c%c"
- `+0x43`  "correct"
- `+0x4b`  "INCORRECT"
- `+0x55`  " got %d [%s]\n"
- `+0x68`  "Incorrect value from deck_contains: stopping\n"
- `+0x96`  "test-deck.c"
- `+0xa2`  "c.value == VALUE_KING"
- `+0xb8`  "c.value == VALUE_ACE || c.value == 4"
- `+0xe0`  "c.value == VALUE_ACE || c.value == 2"
- `+0x105`  "Invalid card in shuffle\n"
- `+0x11e`  "x>=0"
- `+0x123`  "total < 120"
- `+0x12f`  "which[i] <= 4"
- `+0x13d`  "pres[which[i]] == 0"
- `+0x151`  "check[which[i]] == 0"
- `+0x166`  "Kc "
- `+0x16a`  "Ah "
- `+0x16e`  "2s "
- `+0x172`  "4h "
- `+0x176`  "As "
- `+0x180`  "internal error recovering hand from freq table\n"
- `+0x1c4`  "Creating a full deck:"
- `+0x1da`  "---------------------"
- `+0x1f0`  "\nShuffling the deck..."
- `+0x207`  "\nMaking a smaller deck..."
- `+0x221`  "Shuffling your smaller hand.."
- `+0x23f`  "and again.."
- `+0x250`  "Doing 48M shuffles and counting hand frequency"
- `+0x27f`  "This may take a minute"
- `+0x296`  "Most common hand: "
- `+0x2b0`  " %f%% of the time (ideal: ~%f%%)\n"
- `+0x2d2`  "Least common hand: "
- `+0x2e8`  "cnum_for_stest"
- `+0x2f8`  "numerize_hand"
- `+0x310`  "reverse_engineer_hand"
- `+0x32e`  "Y@"

## String literals grouped by referencing function

### `add_and_print`

- "Adding the %c%c"
- " results in: "

### `check_contains`

- "Checking if the hand contains %c%c"
- "correct"
- "INCORRECT"
- " got %d [%s]\n"
- "Incorrect value from deck_contains: stopping\n"

### `cnum_for_stest`

- "cnum_for_stest"
- "test-deck.c"
- "c.value == VALUE_KING"
- "c.value == VALUE_ACE || c.value == 4"
- "c.value == VALUE_ACE || c.value == 2"
- "Invalid card in shuffle\n"

### `numerize_hand`

- "numerize_hand"
- "test-deck.c"
- "x>=0"
- "total < 120"

### `reverse_engineer_hand`

- "reverse_engineer_hand"
- "test-deck.c"
- "which[i] <= 4"
- "pres[which[i]] == 0"
- "check[which[i]] == 0"
- "Kc "
- "Ah "
- "2s "
- "4h "
- "As "
- "internal error recovering hand from freq table\n"

### `main`

- "Creating a full deck:"
- "---------------------"
- "\nShuffling the deck..."
- "\nMaking a smaller deck..."
- "Shuffling your smaller hand.."
- "and again.."
- "Doing 48M shuffles and counting hand frequency"
- "This may take a minute"
- "Most common hand: "
- " %f%% of the time (ideal: ~%f%%)\n"
- "Least common hand: "

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/c3prj1_deck/test-deck.o:	file format elf64-x86-64

Disassembly of section .text:

0000000000000000 <add_and_print>:
       0:      	endbr64
       4:      	pushq	%rbp
       5:      	movq	%rsp, %rbp
       8:      	subq	$0x10, %rsp
       c:      	movq	%rdi, -0x8(%rbp)
      10:      	movl	%esi, %ecx
      12:      	movl	%edx, %eax
      14:      	movl	%ecx, %edx
      16:      	movb	%dl, -0xc(%rbp)
      19:      	movb	%al, -0x10(%rbp)
      1c:      	movsbl	-0x10(%rbp), %edx
      20:      	movsbl	-0xc(%rbp), %eax
      24:      	movl	%eax, %esi
      26:      	leaq	(%rip), %rdi            # 0x2d <add_and_print+0x2d>
;   .rodata -> "Adding the %c%c"
      2d:      	movl	$0x0, %eax
      32:      	callq	0x37 <add_and_print+0x37>
;   printf+-4
      37:      	movq	(%rip), %rax            # 0x3e <add_and_print+0x3e>
;   stdout+-4
      3e:      	movq	%rax, %rdi
      41:      	callq	0x46 <add_and_print+0x46>
;   fflush+-4
      46:      	movsbl	-0x10(%rbp), %edx
      4a:      	movsbl	-0xc(%rbp), %eax
      4e:      	movl	%edx, %esi
      50:      	movl	%eax, %edi
      52:      	callq	0x57 <add_and_print+0x57>
;   card_from_letters+-4
      57:      	movq	%rax, %rdx
      5a:      	movq	-0x8(%rbp), %rax
      5e:      	movq	%rdx, %rsi
      61:      	movq	%rax, %rdi
      64:      	callq	0x69 <add_and_print+0x69>
;   add_card_to+-4
      69:      	leaq	(%rip), %rdi            # 0x70 <add_and_print+0x70>
;   .rodata -> " results in: "
      70:      	movl	$0x0, %eax
      75:      	callq	0x7a <add_and_print+0x7a>
;   printf+-4
      7a:      	movq	(%rip), %rax            # 0x81 <add_and_print+0x81>
;   stdout+-4
      81:      	movq	%rax, %rdi
      84:      	callq	0x89 <add_and_print+0x89>
;   fflush+-4
      89:      	movq	-0x8(%rbp), %rax
      8d:      	movq	%rax, %rdi
      90:      	callq	0x95 <add_and_print+0x95>
;   print_hand+-4
      95:      	movl	$0xa, %edi
      9a:      	callq	0x9f <add_and_print+0x9f>
;   putchar+-4
      9f:      	nop
      a0:      	leave
      a1:      	retq

00000000000000a2 <check_contains>:
      a2:      	endbr64
      a6:      	pushq	%rbp
      a7:      	movq	%rsp, %rbp
      aa:      	subq	$0x30, %rsp
      ae:      	movq	%rdi, -0x18(%rbp)
      b2:      	movl	%edx, %eax
      b4:      	movl	%ecx, -0x24(%rbp)
      b7:      	movl	%esi, %edx
      b9:      	movb	%dl, -0x1c(%rbp)
      bc:      	movb	%al, -0x20(%rbp)
      bf:      	movsbl	-0x20(%rbp), %edx
      c3:      	movsbl	-0x1c(%rbp), %eax
      c7:      	movl	%eax, %esi
      c9:      	leaq	(%rip), %rdi            # 0xd0 <check_contains+0x2e>
;   .rodata -> "Checking if the hand contains %c%c"
      d0:      	movl	$0x0, %eax
      d5:      	callq	0xda <check_contains+0x38>
;   printf+-4
      da:      	movq	(%rip), %rax            # 0xe1 <check_contains+0x3f>
;   stdout+-4
      e1:      	movq	%rax, %rdi
      e4:      	callq	0xe9 <check_contains+0x47>
;   fflush+-4
      e9:      	movsbl	-0x20(%rbp), %edx
      ed:      	movsbl	-0x1c(%rbp), %eax
      f1:      	movl	%edx, %esi
      f3:      	movl	%eax, %edi
      f5:      	callq	0xfa <check_contains+0x58>
;   card_from_letters+-4
      fa:      	movq	%rax, %rdx
      fd:      	movq	-0x18(%rbp), %rax
     101:      	movq	%rdx, %rsi
     104:      	movq	%rax, %rdi
     107:      	callq	0x10c <check_contains+0x6a>
;   deck_contains+-4
     10c:      	movl	%eax, -0x4(%rbp)
     10f:      	movl	-0x4(%rbp), %eax
     112:      	cmpl	-0x24(%rbp), %eax
     115:      	jne	0x120 <check_contains+0x7e>
     117:      	leaq	(%rip), %rax            # 0x11e <check_contains+0x7c>
;   .rodata -> "correct"
     11e:      	jmp	0x127 <check_contains+0x85>
     120:      	leaq	(%rip), %rax            # 0x127 <check_contains+0x85>
;   .rodata -> "INCORRECT"
     127:      	movl	-0x4(%rbp), %ecx
     12a:      	movq	%rax, %rdx
     12d:      	movl	%ecx, %esi
     12f:      	leaq	(%rip), %rdi            # 0x136 <check_contains+0x94>
;   .rodata -> " got %d [%s]\n"
     136:      	movl	$0x0, %eax
     13b:      	callq	0x140 <check_contains+0x9e>
;   printf+-4
     140:      	movl	-0x4(%rbp), %eax
     143:      	cmpl	-0x24(%rbp), %eax
     146:      	je	0x172 <check_contains+0xd0>
     148:      	movq	(%rip), %rax            # 0x14f <check_contains+0xad>
;   stderr+-4
     14f:      	movq	%rax, %rcx
     152:      	movl	$0x2d, %edx
     157:      	movl	$0x1, %esi
     15c:      	leaq	(%rip), %rdi            # 0x163 <check_contains+0xc1>
;   .rodata -> "Incorrect value from deck_contains: stopping\n"
     163:      	callq	0x168 <check_contains+0xc6>
;   fwrite+-4
     168:      	movl	$0x1, %edi
     16d:      	callq	0x172 <check_contains+0xd0>
;   exit+-4
     172:      	nop
     173:      	leave
     174:      	retq

0000000000000175 <cnum_for_stest>:
     175:      	endbr64
     179:      	pushq	%rbp
     17a:      	movq	%rsp, %rbp
     17d:      	subq	$0x10, %rsp
     181:      	movq	%rdi, -0x8(%rbp)
     185:      	movl	-0x4(%rbp), %eax
     188:      	cmpl	$0x3, %eax
     18b:      	je	0x1a8 <cnum_for_stest+0x33>
     18d:      	cmpl	$0x3, %eax
     190:      	ja	0x263 <cnum_for_stest+0xee>
     196:      	testl	%eax, %eax
     198:      	je	0x21e <cnum_for_stest+0xa9>
     19e:      	cmpl	$0x1, %eax
     1a1:      	je	0x1d9 <cnum_for_stest+0x64>
     1a3:      	jmp	0x263 <cnum_for_stest+0xee>
     1a8:      	movl	-0x8(%rbp), %eax
     1ab:      	cmpl	$0xd, %eax
     1ae:      	je	0x1cf <cnum_for_stest+0x5a>
     1b0:      	leaq	(%rip), %rcx            # 0x1b7 <cnum_for_stest+0x42>
;   .rodata -> "cnum_for_stest"
     1b7:      	movl	$0x1d, %edx
     1bc:      	leaq	(%rip), %rsi            # 0x1c3 <cnum_for_stest+0x4e>
;   .rodata -> "test-deck.c"
     1c3:      	leaq	(%rip), %rdi            # 0x1ca <cnum_for_stest+0x55>
;   .rodata -> "c.value == VALUE_KING"
     1ca:      	callq	0x1cf <cnum_for_stest+0x5a>
;   __assert_fail+-4
     1cf:      	movl	$0x0, %eax
     1d4:      	jmp	0x288 <cnum_for_stest+0x113>
     1d9:      	movl	-0x8(%rbp), %eax
     1dc:      	cmpl	$0xe, %eax
     1df:      	je	0x208 <cnum_for_stest+0x93>
     1e1:      	movl	-0x8(%rbp), %eax
     1e4:      	cmpl	$0x4, %eax
     1e7:      	je	0x208 <cnum_for_stest+0x93>
     1e9:      	leaq	(%rip), %rcx            # 0x1f0 <cnum_for_stest+0x7b>
;   .rodata -> "cnum_for_stest"
     1f0:      	movl	$0x20, %edx
     1f5:      	leaq	(%rip), %rsi            # 0x1fc <cnum_for_stest+0x87>
;   .rodata -> "test-deck.c"
     1fc:      	leaq	(%rip), %rdi            # 0x203 <cnum_for_stest+0x8e>
;   .rodata -> "c.value == VALUE_ACE || c.value == 4"
     203:      	callq	0x208 <cnum_for_stest+0x93>
;   __assert_fail+-4
     208:      	movl	-0x8(%rbp), %eax
     20b:      	cmpl	$0xe, %eax
     20e:      	jne	0x217 <cnum_for_stest+0xa2>
     210:      	movl	$0x1, %eax
     215:      	jmp	0x288 <cnum_for_stest+0x113>
     217:      	movl	$0x3, %eax
     21c:      	jmp	0x288 <cnum_for_stest+0x113>
     21e:      	movl	-0x8(%rbp), %eax
     221:      	cmpl	$0xe, %eax
     224:      	je	0x24d <cnum_for_stest+0xd8>
     226:      	movl	-0x8(%rbp), %eax
     229:      	cmpl	$0x2, %eax
     22c:      	je	0x24d <cnum_for_stest+0xd8>
     22e:      	leaq	(%rip), %rcx            # 0x235 <cnum_for_stest+0xc0>
;   .rodata -> "cnum_for_stest"
     235:      	movl	$0x26, %edx
     23a:      	leaq	(%rip), %rsi            # 0x241 <cnum_for_stest+0xcc>
;   .rodata -> "test-deck.c"
     241:      	leaq	(%rip), %rdi            # 0x248 <cnum_for_stest+0xd3>
;   .rodata -> "c.value == VALUE_ACE || c.value == 2"
     248:      	callq	0x24d <cnum_for_stest+0xd8>
;   __assert_fail+-4
     24d:      	movl	-0x8(%rbp), %eax
     250:      	cmpl	$0xe, %eax
     253:      	jne	0x25c <cnum_for_stest+0xe7>
     255:      	movl	$0x4, %eax
     25a:      	jmp	0x288 <cnum_for_stest+0x113>
     25c:      	movl	$0x2, %eax
     261:      	jmp	0x288 <cnum_for_stest+0x113>
     263:      	movq	(%rip), %rax            # 0x26a <cnum_for_stest+0xf5>
;   stderr+-4
     26a:      	movq	%rax, %rcx
     26d:      	movl	$0x18, %edx
     272:      	movl	$0x1, %esi
     277:      	leaq	(%rip), %rdi            # 0x27e <cnum_for_stest+0x109>
;   .rodata -> "Invalid card in shuffle\n"
     27e:      	callq	0x283 <cnum_for_stest+0x10e>
;   fwrite+-4
     283:      	callq	0x288 <cnum_for_stest+0x113>
;   abort+-4
     288:      	leave
     289:      	retq

000000000000028a <numerize_hand>:
     28a:      	endbr64
     28e:      	pushq	%rbp
     28f:      	movq	%rsp, %rbp
     292:      	subq	$0x60, %rsp
     296:      	movq	%rdi, -0x58(%rbp)
     29a:      	movq	%fs:0x28, %rax
     2a3:      	movq	%rax, -0x8(%rbp)
     2a7:      	xorl	%eax, %eax
     2a9:      	movl	$0x0, -0x44(%rbp)
     2b0:      	jmp	0x2df <numerize_hand+0x55>
     2b2:      	movq	-0x58(%rbp), %rax
     2b6:      	movq	(%rax), %rax
     2b9:      	movl	-0x44(%rbp), %edx
     2bc:      	movslq	%edx, %rdx
     2bf:      	shlq	$0x3, %rdx
     2c3:      	addq	%rdx, %rax
     2c6:      	movq	(%rax), %rax
     2c9:      	movq	(%rax), %rdi
     2cc:      	callq	0x2d1 <numerize_hand+0x47>
;   cnum_for_stest+-4
     2d1:      	movl	-0x44(%rbp), %edx
     2d4:      	movslq	%edx, %rdx
     2d7:      	movl	%eax, -0x30(%rbp,%rdx,4)
     2db:      	addl	$0x1, -0x44(%rbp)
     2df:      	cmpl	$0x3, -0x44(%rbp)
     2e3:      	jle	0x2b2 <numerize_hand+0x28>
     2e5:      	movl	$0x0, -0x40(%rbp)
     2ec:      	movl	$0x18, -0x20(%rbp)
     2f3:      	movl	$0x6, -0x1c(%rbp)
     2fa:      	movl	$0x2, -0x18(%rbp)
     301:      	movl	$0x1, -0x14(%rbp)
     308:      	movl	$0x0, -0x10(%rbp)
     30f:      	movl	$0x0, -0x3c(%rbp)
     316:      	jmp	0x3b4 <numerize_hand+0x12a>
     31b:      	movl	-0x3c(%rbp), %eax
     31e:      	cltq
     320:      	movl	-0x30(%rbp,%rax,4), %eax
     324:      	movl	%eax, -0x38(%rbp)
     327:      	movl	$0x0, -0x34(%rbp)
     32e:      	jmp	0x34e <numerize_hand+0xc4>
     330:      	movl	-0x34(%rbp), %eax
     333:      	cltq
     335:      	movl	-0x30(%rbp,%rax,4), %edx
     339:      	movl	-0x3c(%rbp), %eax
     33c:      	cltq
     33e:      	movl	-0x30(%rbp,%rax,4), %eax
     342:      	cmpl	%eax, %edx
     344:      	jge	0x34a <numerize_hand+0xc0>
     346:      	subl	$0x1, -0x38(%rbp)
     34a:      	addl	$0x1, -0x34(%rbp)
     34e:      	movl	-0x34(%rbp), %eax
     351:      	cmpl	-0x3c(%rbp), %eax
     354:      	jl	0x330 <numerize_hand+0xa6>
     356:      	cmpl	$0x0, -0x38(%rbp)
     35a:      	jns	0x37b <numerize_hand+0xf1>
     35c:      	leaq	(%rip), %rcx            # 0x363 <numerize_hand+0xd9>
;   .rodata -> "numerize_hand"
     363:      	movl	$0x3e, %edx
     368:      	leaq	(%rip), %rsi            # 0x36f <numerize_hand+0xe5>
;   .rodata -> "test-deck.c"
     36f:      	leaq	(%rip), %rdi            # 0x376 <numerize_hand+0xec>
;   .rodata -> "x>=0"
     376:      	callq	0x37b <numerize_hand+0xf1>
;   __assert_fail+-4
     37b:      	movl	-0x3c(%rbp), %eax
     37e:      	cltq
     380:      	movl	-0x20(%rbp,%rax,4), %eax
     384:      	imull	-0x38(%rbp), %eax
     388:      	addl	%eax, -0x40(%rbp)
     38b:      	cmpl	$0x77, -0x40(%rbp)
     38f:      	jle	0x3b0 <numerize_hand+0x126>
     391:      	leaq	(%rip), %rcx            # 0x398 <numerize_hand+0x10e>
;   .rodata -> "numerize_hand"
     398:      	movl	$0x40, %edx
     39d:      	leaq	(%rip), %rsi            # 0x3a4 <numerize_hand+0x11a>
;   .rodata -> "test-deck.c"
     3a4:      	leaq	(%rip), %rdi            # 0x3ab <numerize_hand+0x121>
;   .rodata -> "total < 120"
     3ab:      	callq	0x3b0 <numerize_hand+0x126>
;   __assert_fail+-4
     3b0:      	addl	$0x1, -0x3c(%rbp)
     3b4:      	cmpl	$0x3, -0x3c(%rbp)
     3b8:      	jle	0x31b <numerize_hand+0x91>
     3be:      	movl	-0x40(%rbp), %eax
     3c1:      	movq	-0x8(%rbp), %rcx
     3c5:      	xorq	%fs:0x28, %rcx
     3ce:      	je	0x3d5 <numerize_hand+0x14b>
     3d0:      	callq	0x3d5 <numerize_hand+0x14b>
;   __stack_chk_fail+-4
     3d5:      	leave
     3d6:      	retq

00000000000003d7 <reverse_engineer_hand>:
     3d7:      	endbr64
     3db:      	pushq	%rbp
     3dc:      	movq	%rsp, %rbp
     3df:      	subq	$0xa0, %rsp
     3e6:      	movq	%rdi, -0x98(%rbp)
     3ed:      	movq	%fs:0x28, %rax
     3f6:      	movq	%rax, -0x8(%rbp)
     3fa:      	xorl	%eax, %eax
     3fc:      	movq	$0x0, -0x80(%rbp)
     404:      	movq	$0x0, -0x78(%rbp)
     40c:      	movl	$0x0, -0x70(%rbp)
     413:      	movl	$0x18, -0x60(%rbp)
     41a:      	movl	$0x6, -0x5c(%rbp)
     421:      	movl	$0x2, -0x58(%rbp)
     428:      	movl	$0x1, -0x54(%rbp)
     42f:      	movl	$0x0, -0x50(%rbp)
     436:      	movl	$0x0, -0x90(%rbp)
     440:      	jmp	0x49a <reverse_engineer_hand+0xc3>
     442:      	movl	-0x90(%rbp), %eax
     448:      	cltq
     44a:      	movl	-0x60(%rbp,%rax,4), %eax
     44e:      	movslq	%eax, %rsi
     451:      	movq	-0x98(%rbp), %rax
     458:      	movl	$0x0, %edx
     45d:      	divq	%rsi
     460:      	movl	%eax, %edx
     462:      	movl	-0x90(%rbp), %eax
     468:      	cltq
     46a:      	movl	%edx, -0x80(%rbp,%rax,4)
     46e:      	movl	-0x90(%rbp), %eax
     474:      	cltq
     476:      	movl	-0x60(%rbp,%rax,4), %eax
     47a:      	movslq	%eax, %rcx
     47d:      	movq	-0x98(%rbp), %rax
     484:      	movl	$0x0, %edx
     489:      	divq	%rcx
     48c:      	movq	%rdx, -0x98(%rbp)
     493:      	addl	$0x1, -0x90(%rbp)
     49a:      	cmpl	$0x3, -0x90(%rbp)
     4a1:      	jle	0x442 <reverse_engineer_hand+0x6b>
     4a3:      	movq	$0x0, -0x40(%rbp)
     4ab:      	movq	$0x0, -0x38(%rbp)
     4b3:      	movl	$0x0, -0x30(%rbp)
     4ba:      	movl	-0x80(%rbp), %eax
     4bd:      	cltq
     4bf:      	movl	$0x1, -0x40(%rbp,%rax,4)
     4c7:      	movl	$0x1, -0x8c(%rbp)
     4d1:      	jmp	0x5a5 <reverse_engineer_hand+0x1ce>
     4d6:      	movl	$0x0, -0x88(%rbp)
     4e0:      	jmp	0x53f <reverse_engineer_hand+0x168>
     4e2:      	movl	-0x8c(%rbp), %eax
     4e8:      	cltq
     4ea:      	movl	-0x80(%rbp,%rax,4), %edx
     4ee:      	movl	-0x88(%rbp), %eax
     4f4:      	cltq
     4f6:      	movl	-0x40(%rbp,%rax,4), %eax
     4fa:      	addl	%eax, %edx
     4fc:      	movl	-0x8c(%rbp), %eax
     502:      	cltq
     504:      	movl	%edx, -0x80(%rbp,%rax,4)
     508:      	movl	-0x8c(%rbp), %eax
     50e:      	cltq
     510:      	movl	-0x80(%rbp,%rax,4), %eax
     514:      	cmpl	$0x4, %eax
     517:      	jle	0x538 <reverse_engineer_hand+0x161>
     519:      	leaq	(%rip), %rcx            # 0x520 <reverse_engineer_hand+0x149>
;   .rodata -> "reverse_engineer_hand"
     520:      	movl	$0x50, %edx
     525:      	leaq	(%rip), %rsi            # 0x52c <reverse_engineer_hand+0x155>
;   .rodata -> "test-deck.c"
     52c:      	leaq	(%rip), %rdi            # 0x533 <reverse_engineer_hand+0x15c>
;   .rodata -> "which[i] <= 4"
     533:      	callq	0x538 <reverse_engineer_hand+0x161>
;   __assert_fail+-4
     538:      	addl	$0x1, -0x88(%rbp)
     53f:      	movl	-0x8c(%rbp), %eax
     545:      	cltq
     547:      	movl	-0x80(%rbp,%rax,4), %eax
     54b:      	cmpl	%eax, -0x88(%rbp)
     551:      	jle	0x4e2 <reverse_engineer_hand+0x10b>
     553:      	movl	-0x8c(%rbp), %eax
     559:      	cltq
     55b:      	movl	-0x80(%rbp,%rax,4), %eax
     55f:      	cltq
     561:      	movl	-0x40(%rbp,%rax,4), %eax
     565:      	testl	%eax, %eax
     567:      	je	0x588 <reverse_engineer_hand+0x1b1>
     569:      	leaq	(%rip), %rcx            # 0x570 <reverse_engineer_hand+0x199>
;   .rodata -> "reverse_engineer_hand"
     570:      	movl	$0x52, %edx
     575:      	leaq	(%rip), %rsi            # 0x57c <reverse_engineer_hand+0x1a5>
;   .rodata -> "test-deck.c"
     57c:      	leaq	(%rip), %rdi            # 0x583 <reverse_engineer_hand+0x1ac>
;   .rodata -> "pres[which[i]] == 0"
     583:      	callq	0x588 <reverse_engineer_hand+0x1b1>
;   __assert_fail+-4
     588:      	movl	-0x8c(%rbp), %eax
     58e:      	cltq
     590:      	movl	-0x80(%rbp,%rax,4), %eax
     594:      	cltq
     596:      	movl	$0x1, -0x40(%rbp,%rax,4)
     59e:      	addl	$0x1, -0x8c(%rbp)
     5a5:      	cmpl	$0x4, -0x8c(%rbp)
     5ac:      	jle	0x4d6 <reverse_engineer_hand+0xff>
     5b2:      	movq	$0x0, -0x20(%rbp)
     5ba:      	movq	$0x0, -0x18(%rbp)
     5c2:      	movl	$0x0, -0x10(%rbp)
     5c9:      	movl	$0x0, -0x84(%rbp)
     5d3:      	jmp	0x6e6 <reverse_engineer_hand+0x30f>
     5d8:      	movl	-0x84(%rbp), %eax
     5de:      	cltq
     5e0:      	movl	-0x80(%rbp,%rax,4), %eax
     5e4:      	cltq
     5e6:      	movl	-0x20(%rbp,%rax,4), %eax
     5ea:      	testl	%eax, %eax
     5ec:      	je	0x60d <reverse_engineer_hand+0x236>
     5ee:      	leaq	(%rip), %rcx            # 0x5f5 <reverse_engineer_hand+0x21e>
;   .rodata -> "reverse_engineer_hand"
     5f5:      	movl	$0x57, %edx
     5fa:      	leaq	(%rip), %rsi            # 0x601 <reverse_engineer_hand+0x22a>
;   .rodata -> "test-deck.c"
     601:      	leaq	(%rip), %rdi            # 0x608 <reverse_engineer_hand+0x231>
;   .rodata -> "check[which[i]] == 0"
     608:      	callq	0x60d <reverse_engineer_hand+0x236>
;   __assert_fail+-4
     60d:      	movl	-0x84(%rbp), %eax
     613:      	cltq
     615:      	movl	-0x80(%rbp,%rax,4), %eax
     619:      	cltq
     61b:      	movl	$0x1, -0x20(%rbp,%rax,4)
     623:      	movl	-0x84(%rbp), %eax
     629:      	cltq
     62b:      	movl	-0x80(%rbp,%rax,4), %eax
     62f:      	cmpl	$0x4, %eax
     632:      	ja	0x6ba <reverse_engineer_hand+0x2e3>
     638:      	movl	%eax, %eax
     63a:      	leaq	(,%rax,4), %rdx
     642:      	leaq	(%rip), %rax            # 0x649 <reverse_engineer_hand+0x272>
;   .rodata+428
     649:      	movl	(%rdx,%rax), %eax
     64c:      	cltq
     64e:      	leaq	(%rip), %rdx            # 0x655 <reverse_engineer_hand+0x27e>
;   .rodata+428
     655:      	addq	%rdx, %rax
     658:      	jmpq	*%rax
     65b:      	leaq	(%rip), %rdi            # 0x662 <reverse_engineer_hand+0x28b>
;   .rodata -> "Kc "
     662:      	movl	$0x0, %eax
     667:      	callq	0x66c <reverse_engineer_hand+0x295>
;   printf+-4
     66c:      	jmp	0x6df <reverse_engineer_hand+0x308>
     66e:      	leaq	(%rip), %rdi            # 0x675 <reverse_engineer_hand+0x29e>
;   .rodata -> "Ah "
     675:      	movl	$0x0, %eax
     67a:      	callq	0x67f <reverse_engineer_hand+0x2a8>
;   printf+-4
     67f:      	jmp	0x6df <reverse_engineer_hand+0x308>
     681:      	leaq	(%rip), %rdi            # 0x688 <reverse_engineer_hand+0x2b1>
;   .rodata -> "2s "
     688:      	movl	$0x0, %eax
     68d:      	callq	0x692 <reverse_engineer_hand+0x2bb>
;   printf+-4
     692:      	jmp	0x6df <reverse_engineer_hand+0x308>
     694:      	leaq	(%rip), %rdi            # 0x69b <reverse_engineer_hand+0x2c4>
;   .rodata -> "4h "
     69b:      	movl	$0x0, %eax
     6a0:      	callq	0x6a5 <reverse_engineer_hand+0x2ce>
;   printf+-4
     6a5:      	jmp	0x6df <reverse_engineer_hand+0x308>
     6a7:      	leaq	(%rip), %rdi            # 0x6ae <reverse_engineer_hand+0x2d7>
;   .rodata -> "As "
     6ae:      	movl	$0x0, %eax
     6b3:      	callq	0x6b8 <reverse_engineer_hand+0x2e1>
;   printf+-4
     6b8:      	jmp	0x6df <reverse_engineer_hand+0x308>
     6ba:      	movq	(%rip), %rax            # 0x6c1 <reverse_engineer_hand+0x2ea>
;   stderr+-4
     6c1:      	movq	%rax, %rcx
     6c4:      	movl	$0x2f, %edx
     6c9:      	movl	$0x1, %esi
     6ce:      	leaq	(%rip), %rdi            # 0x6d5 <reverse_engineer_hand+0x2fe>
;   .rodata -> "internal error recovering hand from freq table\n"
     6d5:      	callq	0x6da <reverse_engineer_hand+0x303>
;   fwrite+-4
     6da:      	callq	0x6df <reverse_engineer_hand+0x308>
;   abort+-4
     6df:      	addl	$0x1, -0x84(%rbp)
     6e6:      	cmpl	$0x4, -0x84(%rbp)
     6ed:      	jle	0x5d8 <reverse_engineer_hand+0x201>
     6f3:      	nop
     6f4:      	movq	-0x8(%rbp), %rax
     6f8:      	xorq	%fs:0x28, %rax
     701:      	je	0x708 <reverse_engineer_hand+0x331>
     703:      	callq	0x708 <reverse_engineer_hand+0x331>
;   __stack_chk_fail+-4
     708:      	leave
     709:      	retq

000000000000070a <test_reh>:
     70a:      	endbr64
     70e:      	pushq	%rbp
     70f:      	movq	%rsp, %rbp
     712:      	movq	%rdi, -0x8(%rbp)
     716:      	nop
     717:      	popq	%rbp
     718:      	retq

0000000000000719 <main>:
     719:      	endbr64
     71d:      	pushq	%rbp
     71e:      	movq	%rsp, %rbp
     721:      	subq	$0x410, %rsp            # imm = 0x410
     728:      	movq	%fs:0x28, %rax
     731:      	movq	%rax, -0x8(%rbp)
     735:      	xorl	%eax, %eax
     737:      	leaq	(%rip), %rdi            # 0x73e <main+0x25>
;   .rodata -> "Creating a full deck:"
     73e:      	callq	0x743 <main+0x2a>
;   puts+-4
     743:      	leaq	(%rip), %rdi            # 0x74a <main+0x31>
;   .rodata -> "---------------------"
     74a:      	callq	0x74f <main+0x36>
;   puts+-4
     74f:      	movq	$0x0, -0x3d8(%rbp)
     75a:      	movq	$0x0, -0x3e0(%rbp)
     765:      	leaq	-0x3e0(%rbp), %rax
     76c:      	movq	%rax, %rdi
     76f:      	callq	0x774 <main+0x5b>
;   make_deck_exclude+-4
     774:      	movq	%rax, -0x3f0(%rbp)
     77b:      	movq	-0x3f0(%rbp), %rax
     782:      	movq	%rax, %rdi
     785:      	callq	0x78a <main+0x71>
;   print_hand+-4
     78a:      	movq	-0x3f0(%rbp), %rax
     791:      	movq	%rax, %rdi
     794:      	callq	0x799 <main+0x80>
;   assert_full_deck+-4
     799:      	leaq	(%rip), %rdi            # 0x7a0 <main+0x87>
;   .rodata -> "\nShuffling the deck..."
     7a0:      	callq	0x7a5 <main+0x8c>
;   puts+-4
     7a5:      	leaq	(%rip), %rdi            # 0x7ac <main+0x93>
;   .rodata -> "---------------------"
     7ac:      	callq	0x7b1 <main+0x98>
;   puts+-4
     7b1:      	movq	-0x3f0(%rbp), %rax
     7b8:      	movq	%rax, %rdi
     7bb:      	callq	0x7c0 <main+0xa7>
;   shuffle+-4
     7c0:      	movq	-0x3f0(%rbp), %rax
     7c7:      	movq	%rax, %rdi
     7ca:      	callq	0x7cf <main+0xb6>
;   print_hand+-4
     7cf:      	movq	-0x3f0(%rbp), %rax
     7d6:      	movq	%rax, %rdi
     7d9:      	callq	0x7de <main+0xc5>
;   assert_full_deck+-4
     7de:      	leaq	(%rip), %rdi            # 0x7e5 <main+0xcc>
;   .rodata -> "\nShuffling the deck..."
     7e5:      	callq	0x7ea <main+0xd1>
;   puts+-4
     7ea:      	leaq	(%rip), %rdi            # 0x7f1 <main+0xd8>
;   .rodata -> "---------------------"
     7f1:      	callq	0x7f6 <main+0xdd>
;   puts+-4
     7f6:      	movq	-0x3f0(%rbp), %rax
     7fd:      	movq	%rax, %rdi
     800:      	callq	0x805 <main+0xec>
;   shuffle+-4
     805:      	movq	-0x3f0(%rbp), %rax
     80c:      	movq	%rax, %rdi
     80f:      	callq	0x814 <main+0xfb>
;   print_hand+-4
     814:      	movq	-0x3f0(%rbp), %rax
     81b:      	movq	%rax, %rdi
     81e:      	callq	0x823 <main+0x10a>
;   assert_full_deck+-4
     823:      	leaq	(%rip), %rdi            # 0x82a <main+0x111>
;   .rodata -> "\nMaking a smaller deck..."
     82a:      	callq	0x82f <main+0x116>
;   puts+-4
     82f:      	movl	$0x10, %edi
     834:      	callq	0x839 <main+0x120>
;   malloc+-4
     839:      	movq	%rax, -0x3e8(%rbp)
     840:      	movq	-0x3e8(%rbp), %rax
     847:      	movq	$0x0, 0x8(%rax)
     84f:      	movq	-0x3e8(%rbp), %rax
     856:      	movq	$0x0, (%rax)
     85d:      	movq	-0x3e8(%rbp), %rax
     864:      	movl	$0x63, %edx
     869:      	movl	$0x4b, %esi
     86e:      	movq	%rax, %rdi
     871:      	callq	0x876 <main+0x15d>
;   add_and_print+-4
     876:      	movq	-0x3e8(%rbp), %rax
     87d:      	movl	$0x68, %edx
     882:      	movl	$0x41, %esi
     887:      	movq	%rax, %rdi
     88a:      	callq	0x88f <main+0x176>
;   add_and_print+-4
     88f:      	movq	-0x3e8(%rbp), %rax
     896:      	movl	$0x73, %edx
     89b:      	movl	$0x32, %esi
     8a0:      	movq	%rax, %rdi
     8a3:      	callq	0x8a8 <main+0x18f>
;   add_and_print+-4
     8a8:      	movq	-0x3e8(%rbp), %rax
     8af:      	movl	$0x68, %edx
     8b4:      	movl	$0x34, %esi
     8b9:      	movq	%rax, %rdi
     8bc:      	callq	0x8c1 <main+0x1a8>
;   add_and_print+-4
     8c1:      	movq	-0x3e8(%rbp), %rax
     8c8:      	movl	$0x73, %edx
     8cd:      	movl	$0x41, %esi
     8d2:      	movq	%rax, %rdi
     8d5:      	callq	0x8da <main+0x1c1>
;   add_and_print+-4
     8da:      	movq	-0x3e8(%rbp), %rax
     8e1:      	movl	$0x1, %ecx
     8e6:      	movl	$0x63, %edx
     8eb:      	movl	$0x4b, %esi
     8f0:      	movq	%rax, %rdi
     8f3:      	callq	0x8f8 <main+0x1df>
;   check_contains+-4
     8f8:      	movq	-0x3e8(%rbp), %rax
     8ff:      	movl	$0x0, %ecx
     904:      	movl	$0x68, %edx
     909:      	movl	$0x4b, %esi
     90e:      	movq	%rax, %rdi
     911:      	callq	0x916 <main+0x1fd>
;   check_contains+-4
     916:      	movq	-0x3e8(%rbp), %rax
     91d:      	movl	$0x0, %ecx
     922:      	movl	$0x63, %edx
     927:      	movl	$0x41, %esi
     92c:      	movq	%rax, %rdi
     92f:      	callq	0x934 <main+0x21b>
;   check_contains+-4
     934:      	movq	-0x3e8(%rbp), %rax
     93b:      	movl	$0x1, %ecx
     940:      	movl	$0x73, %edx
     945:      	movl	$0x41, %esi
     94a:      	movq	%rax, %rdi
     94d:      	callq	0x952 <main+0x239>
;   check_contains+-4
     952:      	movq	-0x3e8(%rbp), %rax
     959:      	movl	$0x0, %ecx
     95e:      	movl	$0x64, %edx
     963:      	movl	$0x33, %esi
     968:      	movq	%rax, %rdi
     96b:      	callq	0x970 <main+0x257>
;   check_contains+-4
     970:      	movq	-0x3e8(%rbp), %rax
     977:      	movl	$0x1, %ecx
     97c:      	movl	$0x73, %edx
     981:      	movl	$0x32, %esi
     986:      	movq	%rax, %rdi
     989:      	callq	0x98e <main+0x275>
;   check_contains+-4
     98e:      	movq	-0x3e8(%rbp), %rax
     995:      	movq	%rax, %rdi
     998:      	callq	0x99d <main+0x284>
;   test_reh+-4
     99d:      	leaq	(%rip), %rdi            # 0x9a4 <main+0x28b>
;   .rodata -> "Shuffling your smaller hand.."
     9a4:      	callq	0x9a9 <main+0x290>
;   puts+-4
     9a9:      	movq	-0x3e8(%rbp), %rax
     9b0:      	movq	%rax, %rdi
     9b3:      	callq	0x9b8 <main+0x29f>
;   shuffle+-4
     9b8:      	movq	-0x3e8(%rbp), %rax
     9bf:      	movq	%rax, %rdi
     9c2:      	callq	0x9c7 <main+0x2ae>
;   print_hand+-4
     9c7:      	movl	$0xa, %edi
     9cc:      	callq	0x9d1 <main+0x2b8>
;   putchar+-4
     9d1:      	movq	-0x3e8(%rbp), %rax
     9d8:      	movq	%rax, %rdi
     9db:      	callq	0x9e0 <main+0x2c7>
;   test_reh+-4
     9e0:      	movq	-0x3e8(%rbp), %rax
     9e7:      	movl	$0x1, %ecx
     9ec:      	movl	$0x63, %edx
     9f1:      	movl	$0x4b, %esi
     9f6:      	movq	%rax, %rdi
     9f9:      	callq	0x9fe <main+0x2e5>
;   check_contains+-4
     9fe:      	movq	-0x3e8(%rbp), %rax
     a05:      	movl	$0x0, %ecx
     a0a:      	movl	$0x68, %edx
     a0f:      	movl	$0x4b, %esi
     a14:      	movq	%rax, %rdi
     a17:      	callq	0xa1c <main+0x303>
;   check_contains+-4
     a1c:      	movq	-0x3e8(%rbp), %rax
     a23:      	movl	$0x0, %ecx
     a28:      	movl	$0x63, %edx
     a2d:      	movl	$0x41, %esi
     a32:      	movq	%rax, %rdi
     a35:      	callq	0xa3a <main+0x321>
;   check_contains+-4
     a3a:      	movq	-0x3e8(%rbp), %rax
     a41:      	movl	$0x1, %ecx
     a46:      	movl	$0x73, %edx
     a4b:      	movl	$0x41, %esi
     a50:      	movq	%rax, %rdi
     a53:      	callq	0xa58 <main+0x33f>
;   check_contains+-4
     a58:      	movq	-0x3e8(%rbp), %rax
     a5f:      	movl	$0x0, %ecx
     a64:      	movl	$0x64, %edx
     a69:      	movl	$0x33, %esi
     a6e:      	movq	%rax, %rdi
     a71:      	callq	0xa76 <main+0x35d>
;   check_contains+-4
     a76:      	movq	-0x3e8(%rbp), %rax
     a7d:      	movl	$0x1, %ecx
     a82:      	movl	$0x73, %edx
     a87:      	movl	$0x32, %esi
     a8c:      	movq	%rax, %rdi
     a8f:      	callq	0xa94 <main+0x37b>
;   check_contains+-4
     a94:      	leaq	(%rip), %rdi            # 0xa9b <main+0x382>
;   .rodata -> "and again.."
     a9b:      	callq	0xaa0 <main+0x387>
;   puts+-4
     aa0:      	movq	-0x3e8(%rbp), %rax
     aa7:      	movq	%rax, %rdi
     aaa:      	callq	0xaaf <main+0x396>
;   shuffle+-4
     aaf:      	movq	-0x3e8(%rbp), %rax
     ab6:      	movq	%rax, %rdi
     ab9:      	callq	0xabe <main+0x3a5>
;   print_hand+-4
     abe:      	movl	$0xa, %edi
     ac3:      	callq	0xac8 <main+0x3af>
;   putchar+-4
     ac8:      	movq	-0x3e8(%rbp), %rax
     acf:      	movq	%rax, %rdi
     ad2:      	callq	0xad7 <main+0x3be>
;   test_reh+-4
     ad7:      	movq	-0x3e8(%rbp), %rax
     ade:      	movl	$0x1, %ecx
     ae3:      	movl	$0x63, %edx
     ae8:      	movl	$0x4b, %esi
     aed:      	movq	%rax, %rdi
     af0:      	callq	0xaf5 <main+0x3dc>
;   check_contains+-4
     af5:      	movq	-0x3e8(%rbp), %rax
     afc:      	movl	$0x0, %ecx
     b01:      	movl	$0x68, %edx
     b06:      	movl	$0x4b, %esi
     b0b:      	movq	%rax, %rdi
     b0e:      	callq	0xb13 <main+0x3fa>
;   check_contains+-4
     b13:      	movq	-0x3e8(%rbp), %rax
     b1a:      	movl	$0x0, %ecx
     b1f:      	movl	$0x63, %edx
     b24:      	movl	$0x41, %esi
     b29:      	movq	%rax, %rdi
     b2c:      	callq	0xb31 <main+0x418>
;   check_contains+-4
     b31:      	movq	-0x3e8(%rbp), %rax
     b38:      	movl	$0x1, %ecx
     b3d:      	movl	$0x73, %edx
     b42:      	movl	$0x41, %esi
     b47:      	movq	%rax, %rdi
     b4a:      	callq	0xb4f <main+0x436>
;   check_contains+-4
     b4f:      	movq	-0x3e8(%rbp), %rax
     b56:      	movl	$0x0, %ecx
     b5b:      	movl	$0x64, %edx
     b60:      	movl	$0x33, %esi
     b65:      	movq	%rax, %rdi
     b68:      	callq	0xb6d <main+0x454>
;   check_contains+-4
     b6d:      	movq	-0x3e8(%rbp), %rax
     b74:      	movl	$0x1, %ecx
     b79:      	movl	$0x73, %edx
     b7e:      	movl	$0x32, %esi
     b83:      	movq	%rax, %rdi
     b86:      	callq	0xb8b <main+0x472>
;   check_contains+-4
     b8b:      	leaq	(%rip), %rdi            # 0xb92 <main+0x479>
;   .rodata -> "Doing 48M shuffles and counting hand frequency"
     b92:      	callq	0xb97 <main+0x47e>
;   puts+-4
     b97:      	leaq	(%rip), %rdi            # 0xb9e <main+0x485>
;   .rodata -> "This may take a minute"
     b9e:      	movl	$0x0, %eax
     ba3:      	callq	0xba8 <main+0x48f>
;   printf+-4
     ba8:      	movq	(%rip), %rax            # 0xbaf <main+0x496>
;   stdout+-4
     baf:      	movq	%rax, %rdi
     bb2:      	callq	0xbb7 <main+0x49e>
;   fflush+-4
     bb7:      	leaq	-0x3d0(%rbp), %rdx
     bbe:      	movl	$0x0, %eax
     bc3:      	movl	$0x78, %ecx
     bc8:      	movq	%rdx, %rdi
     bcb:      	rep		stosq	%rax, %es:(%rdi)
     bce:      	movl	$0x0, -0x40c(%rbp)
     bd8:      	jmp	0xc7f <main+0x566>
     bdd:      	movl	-0x40c(%rbp), %edx
     be3:      	movslq	%edx, %rax
     be6:      	imulq	$0x431bde83, %rax, %rax # imm = 0x431BDE83
     bed:      	shrq	$0x20, %rax
     bf1:      	movl	%eax, %ecx
     bf3:      	sarl	$0x11, %ecx
     bf6:      	movl	%edx, %eax
     bf8:      	sarl	$0x1f, %eax
     bfb:      	subl	%eax, %ecx
     bfd:      	movl	%ecx, %eax
     bff:      	imull	$0x7a120, %eax, %eax    # imm = 0x7A120
     c05:      	subl	%eax, %edx
     c07:      	movl	%edx, %eax
     c09:      	testl	%eax, %eax
     c0b:      	jne	0xc30 <main+0x517>
     c0d:      	movq	(%rip), %rax            # 0xc14 <main+0x4fb>
;   stdout+-4
     c14:      	movq	%rax, %rsi
     c17:      	movl	$0x2e, %edi
     c1c:      	callq	0xc21 <main+0x508>
;   putc+-4
     c21:      	movq	(%rip), %rax            # 0xc28 <main+0x50f>
;   stdout+-4
     c28:      	movq	%rax, %rdi
     c2b:      	callq	0xc30 <main+0x517>
;   fflush+-4
     c30:      	movq	-0x3e8(%rbp), %rax
     c37:      	movq	%rax, %rdi
     c3a:      	callq	0xc3f <main+0x526>
;   shuffle+-4
     c3f:      	movq	-0x3e8(%rbp), %rax
     c46:      	movq	%rax, %rdi
     c49:      	callq	0xc4e <main+0x535>
;   numerize_hand+-4
     c4e:      	movl	%eax, -0x404(%rbp)
     c54:      	movl	-0x404(%rbp), %eax
     c5a:      	cltq
     c5c:      	movq	-0x3d0(%rbp,%rax,8), %rax
     c64:      	leaq	0x1(%rax), %rdx
     c68:      	movl	-0x404(%rbp), %eax
     c6e:      	cltq
     c70:      	movq	%rdx, -0x3d0(%rbp,%rax,8)
     c78:      	addl	$0x1, -0x40c(%rbp)
     c7f:      	cmpl	$0x2faf07f, -0x40c(%rbp) # imm = 0x2FAF07F
     c89:      	jle	0xbdd <main+0x4c4>
     c8f:      	movl	$0xa, %edi
     c94:      	callq	0xc99 <main+0x580>
;   putchar+-4
     c99:      	movq	$0x0, -0x400(%rbp)
     ca4:      	movq	$0x0, -0x3f8(%rbp)
     caf:      	movl	$0x1, -0x408(%rbp)
     cb9:      	jmp	0xd28 <main+0x60f>
     cbb:      	movl	-0x408(%rbp), %eax
     cc1:      	cltq
     cc3:      	movq	-0x3d0(%rbp,%rax,8), %rdx
     ccb:      	movq	-0x400(%rbp), %rax
     cd2:      	movq	-0x3d0(%rbp,%rax,8), %rax
     cda:      	cmpq	%rax, %rdx
     cdd:      	jbe	0xcee <main+0x5d5>
     cdf:      	movl	-0x408(%rbp), %eax
     ce5:      	cltq
     ce7:      	movq	%rax, -0x400(%rbp)
     cee:      	movl	-0x408(%rbp), %eax
     cf4:      	cltq
     cf6:      	movq	-0x3d0(%rbp,%rax,8), %rdx
     cfe:      	movq	-0x3f8(%rbp), %rax
     d05:      	movq	-0x3d0(%rbp,%rax,8), %rax
     d0d:      	cmpq	%rax, %rdx
     d10:      	jae	0xd21 <main+0x608>
     d12:      	movl	-0x408(%rbp), %eax
     d18:      	cltq
     d1a:      	movq	%rax, -0x3f8(%rbp)
     d21:      	addl	$0x1, -0x408(%rbp)
     d28:      	cmpl	$0x77, -0x408(%rbp)
     d2f:      	jle	0xcbb <main+0x5a2>
     d31:      	leaq	(%rip), %rdi            # 0xd38 <main+0x61f>
;   .rodata -> "Most common hand: "
     d38:      	movl	$0x0, %eax
     d3d:      	callq	0xd42 <main+0x629>
;   printf+-4
     d42:      	movq	-0x400(%rbp), %rax
     d49:      	movq	%rax, %rdi
     d4c:      	callq	0xd51 <main+0x638>
;   reverse_engineer_hand+-4
     d51:      	movq	-0x400(%rbp), %rax
     d58:      	movq	-0x3d0(%rbp,%rax,8), %rax
     d60:      	testq	%rax, %rax
     d63:      	js	0xd6c <main+0x653>
     d65:      	cvtsi2sd	%rax, %xmm0
     d6a:      	jmp	0xd81 <main+0x668>
     d6c:      	movq	%rax, %rdx
     d6f:      	shrq	%rdx
     d72:      	andl	$0x1, %eax
     d75:      	orq	%rax, %rdx
     d78:      	cvtsi2sd	%rdx, %xmm0
     d7d:      	addsd	%xmm0, %xmm0
     d81:      	movsd	(%rip), %xmm1           # 0xd89 <main+0x670>
;   .rodata+804
     d89:      	mulsd	%xmm1, %xmm0
     d8d:      	movsd	(%rip), %xmm1           # 0xd95 <main+0x67c>
;   .rodata+812
     d95:      	divsd	%xmm1, %xmm0
     d99:      	movsd	(%rip), %xmm1           # 0xda1 <main+0x688>
;   .rodata+820
     da1:      	leaq	(%rip), %rdi            # 0xda8 <main+0x68f>
;   .rodata -> " %f%% of the time (ideal: ~%f%%)\n"
     da8:      	movl	$0x2, %eax
     dad:      	callq	0xdb2 <main+0x699>
;   printf+-4
     db2:      	leaq	(%rip), %rdi            # 0xdb9 <main+0x6a0>
;   .rodata -> "Least common hand: "
     db9:      	movl	$0x0, %eax
     dbe:      	callq	0xdc3 <main+0x6aa>
;   printf+-4
     dc3:      	movq	-0x3f8(%rbp), %rax
     dca:      	movq	%rax, %rdi
     dcd:      	callq	0xdd2 <main+0x6b9>
;   reverse_engineer_hand+-4
     dd2:      	movq	-0x3f8(%rbp), %rax
     dd9:      	movq	-0x3d0(%rbp,%rax,8), %rax
     de1:      	testq	%rax, %rax
     de4:      	js	0xded <main+0x6d4>
     de6:      	cvtsi2sd	%rax, %xmm0
     deb:      	jmp	0xe02 <main+0x6e9>
     ded:      	movq	%rax, %rdx
     df0:      	shrq	%rdx
     df3:      	andl	$0x1, %eax
     df6:      	orq	%rax, %rdx
     df9:      	cvtsi2sd	%rdx, %xmm0
     dfe:      	addsd	%xmm0, %xmm0
     e02:      	movsd	(%rip), %xmm1           # 0xe0a <main+0x6f1>
;   .rodata+804
     e0a:      	mulsd	%xmm1, %xmm0
     e0e:      	movsd	(%rip), %xmm1           # 0xe16 <main+0x6fd>
;   .rodata+812
     e16:      	divsd	%xmm1, %xmm0
     e1a:      	movsd	(%rip), %xmm1           # 0xe22 <main+0x709>
;   .rodata+820
     e22:      	leaq	(%rip), %rdi            # 0xe29 <main+0x710>
;   .rodata -> " %f%% of the time (ideal: ~%f%%)\n"
     e29:      	movl	$0x2, %eax
     e2e:      	callq	0xe33 <main+0x71a>
;   printf+-4
     e33:      	movq	-0x3e8(%rbp), %rax
     e3a:      	movq	%rax, %rdi
     e3d:      	callq	0xe42 <main+0x729>
;   free_deck+-4
     e42:      	movq	-0x3f0(%rbp), %rax
     e49:      	movq	%rax, %rdi
     e4c:      	callq	0xe51 <main+0x738>
;   free_deck+-4
     e51:      	movl	$0x0, %eax
     e56:      	movq	-0x8(%rbp), %rsi
     e5a:      	xorq	%fs:0x28, %rsi
     e63:      	je	0xe6a <main+0x751>
     e65:      	callq	0xe6a <main+0x751>
;   __stack_chk_fail+-4
     e6a:      	leave
     e6b:      	retq
```
