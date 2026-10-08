# ELF RE report: `c2prj1_cards/input.o`

- size: 5504 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `input.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `__PRETTY_FUNCTION__.3050` | STT_OBJECT | STB_LOCAL | .rodata | 0x200 | 17 |
| `CHECK_GRADER_ENV` | STT_FUNC | STB_LOCAL | .text | 0x0 | 127 |
| `hand_from_string` | STT_FUNC | STB_GLOBAL | .text | 0x7f | 950 |
| `read_input` | STT_FUNC | STB_GLOBAL | .text | 0x435 | 254 |

## Undefined (imported) symbols

```
_GLOBAL_OFFSET_TABLE_
getenv
atoi
stderr
fprintf
abort
malloc
__ctype_b_loc
exit
strtoul
fwrite
__assert_fail
add_empty_card
add_future_card
card_from_letters
add_card_to
__stack_chk_fail
realloc
getline
free
```

## String literals in .rodata

- `+0x0`  "PokerProjectStep"
- `+0x18`  "Oops, you seem to be using our code for a step you were supposed to do! (%d,%d,%d,%d)\n"
- `+0x70`  "Future random cards (%s) not supported in this mode\n"
- `+0xa8`  "This hand seems to have ?%lu twice.  That isn't allowed\n"
- `+0xe8`  "You seem to be playing with an unusual deck of cards! You expect more than 52 random future cards..\n"
- `+0x14d`  "input.c"
- `+0x155`  "where > str"
- `+0x168`  "*where == '\\0' || isspace(*where)"
- `+0x190`  "A hand must have at  least 5 cards (this one has %zu)\n"
- `+0x1c8`  "A hand must have at most 9 cards (this one has %zu)\n"
- `+0x200`  "hand_from_string"

## String literals grouped by referencing function

### `CHECK_GRADER_ENV`

- "PokerProjectStep"
- "Oops, you seem to be using our code for a step you were supposed to do! (%d,%d,%d,%d)\n"

### `hand_from_string`

- "Future random cards (%s) not supported in this mode\n"
- "This hand seems to have ?%lu twice.  That isn't allowed\n"
- "You seem to be playing with an unusual deck of cards! You expect more than 52 random future cards..\n"
- "hand_from_string"
- "input.c"
- "where > str"
- "*where == '\\0' || isspace(*where)"
- "A hand must have at  least 5 cards (this one has %zu)\n"
- "A hand must have at most 9 cards (this one has %zu)\n"

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/c2prj1_cards/input.o:	file format elf64-x86-64

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

000000000000007f <hand_from_string>:
      7f:      	endbr64
      83:      	pushq	%rbp
      84:      	movq	%rsp, %rbp
      87:      	subq	$0x250, %rsp            # imm = 0x250
      8e:      	movq	%rdi, -0x248(%rbp)
      95:      	movq	%rsi, -0x250(%rbp)
      9c:      	movq	%fs:0x28, %rax
      a5:      	movq	%rax, -0x8(%rbp)
      a9:      	xorl	%eax, %eax
      ab:      	movl	$0x2, %esi
      b0:      	movl	$0x4, %edi
      b5:      	callq	0x0 <CHECK_GRADER_ENV>
      ba:      	movl	$0x10, %edi
      bf:      	callq	0xc4 <hand_from_string+0x45>
;   malloc+-4
      c4:      	movq	%rax, -0x230(%rbp)
      cb:      	movq	-0x230(%rbp), %rax
      d2:      	movq	$0x0, (%rax)
      d9:      	movq	-0x230(%rbp), %rax
      e0:      	movq	$0x0, 0x8(%rax)
      e8:      	movq	$0x0, -0x240(%rbp)
      f3:      	jmp	0x384 <hand_from_string+0x305>
      f8:      	callq	0xfd <hand_from_string+0x7e>
;   __ctype_b_loc+-4
      fd:      	movq	(%rax), %rdx
     100:      	movq	-0x248(%rbp), %rax
     107:      	movzbl	(%rax), %eax
     10a:      	movsbq	%al, %rax
     10e:      	addq	%rax, %rax
     111:      	addq	%rdx, %rax
     114:      	movzwl	(%rax), %eax
     117:      	movzwl	%ax, %eax
     11a:      	andl	$0x2000, %eax           # imm = 0x2000
     11f:      	testl	%eax, %eax
     121:      	jne	0x37c <hand_from_string+0x2fd>
     127:      	movq	-0x248(%rbp), %rax
     12e:      	movzbl	(%rax), %eax
     131:      	cmpb	$0x3f, %al
     133:      	jne	0x32b <hand_from_string+0x2ac>
     139:      	cmpq	$0x0, -0x250(%rbp)
     141:      	jne	0x16f <hand_from_string+0xf0>
     143:      	movq	(%rip), %rax            # 0x14a <hand_from_string+0xcb>
;   stderr+-4
     14a:      	movq	-0x248(%rbp), %rdx
     151:      	leaq	(%rip), %rsi            # 0x158 <hand_from_string+0xd9>
;   .rodata -> "Future random cards (%s) not supported in this mode\n"
     158:      	movq	%rax, %rdi
     15b:      	movl	$0x0, %eax
     160:      	callq	0x165 <hand_from_string+0xe6>
;   fprintf+-4
     165:      	movl	$0x1, %edi
     16a:      	callq	0x16f <hand_from_string+0xf0>
;   exit+-4
     16f:      	addq	$0x1, -0x248(%rbp)
     177:      	leaq	-0x218(%rbp), %rcx
     17e:      	movq	-0x248(%rbp), %rax
     185:      	movl	$0x0, %edx
     18a:      	movq	%rcx, %rsi
     18d:      	movq	%rax, %rdi
     190:      	callq	0x195 <hand_from_string+0x116>
;   strtoul+-4
     195:      	movq	%rax, -0x228(%rbp)
     19c:      	movq	$0x0, -0x238(%rbp)
     1a7:      	jmp	0x24a <hand_from_string+0x1cb>
     1ac:      	movq	-0x238(%rbp), %rax
     1b3:      	movq	-0x210(%rbp,%rax,8), %rax
     1bb:      	cmpq	%rax, -0x228(%rbp)
     1c2:      	jne	0x1f0 <hand_from_string+0x171>
     1c4:      	movq	(%rip), %rax            # 0x1cb <hand_from_string+0x14c>
;   stderr+-4
     1cb:      	movq	-0x228(%rbp), %rdx
     1d2:      	leaq	(%rip), %rsi            # 0x1d9 <hand_from_string+0x15a>
;   .rodata -> "This hand seems to have ?%lu twice.  That isn't allowed\n"
     1d9:      	movq	%rax, %rdi
     1dc:      	movl	$0x0, %eax
     1e1:      	callq	0x1e6 <hand_from_string+0x167>
;   fprintf+-4
     1e6:      	movl	$0x1, %edi
     1eb:      	callq	0x1f0 <hand_from_string+0x171>
;   exit+-4
     1f0:      	cmpq	$0x33, -0x240(%rbp)
     1f8:      	jbe	0x224 <hand_from_string+0x1a5>
     1fa:      	movq	(%rip), %rax            # 0x201 <hand_from_string+0x182>
;   stderr+-4
     201:      	movq	%rax, %rcx
     204:      	movl	$0x64, %edx
     209:      	movl	$0x1, %esi
     20e:      	leaq	(%rip), %rdi            # 0x215 <hand_from_string+0x196>
;   .rodata -> "You seem to be playing with an unusual deck of cards! You expect more than 52 random future cards..\n"
     215:      	callq	0x21a <hand_from_string+0x19b>
;   fwrite+-4
     21a:      	movl	$0x1, %edi
     21f:      	callq	0x224 <hand_from_string+0x1a5>
;   exit+-4
     224:      	movq	-0x240(%rbp), %rax
     22b:      	movq	-0x228(%rbp), %rdx
     232:      	movq	%rdx, -0x210(%rbp,%rax,8)
     23a:      	addq	$0x1, -0x240(%rbp)
     242:      	addq	$0x1, -0x238(%rbp)
     24a:      	movq	-0x238(%rbp), %rax
     251:      	cmpq	-0x240(%rbp), %rax
     258:      	jb	0x1ac <hand_from_string+0x12d>
     25e:      	movq	-0x218(%rbp), %rax
     265:      	cmpq	%rax, -0x248(%rbp)
     26c:      	jb	0x28d <hand_from_string+0x20e>
     26e:      	leaq	(%rip), %rcx            # 0x275 <hand_from_string+0x1f6>
;   .rodata -> "hand_from_string"
     275:      	movl	$0x29, %edx
     27a:      	leaq	(%rip), %rsi            # 0x281 <hand_from_string+0x202>
;   .rodata -> "input.c"
     281:      	leaq	(%rip), %rdi            # 0x288 <hand_from_string+0x209>
;   .rodata -> "where > str"
     288:      	callq	0x28d <hand_from_string+0x20e>
;   __assert_fail+-4
     28d:      	movq	-0x218(%rbp), %rax
     294:      	movzbl	(%rax), %eax
     297:      	testb	%al, %al
     299:      	je	0x2e5 <hand_from_string+0x266>
     29b:      	callq	0x2a0 <hand_from_string+0x221>
;   __ctype_b_loc+-4
     2a0:      	movq	(%rax), %rdx
     2a3:      	movq	-0x218(%rbp), %rax
     2aa:      	movzbl	(%rax), %eax
     2ad:      	movsbq	%al, %rax
     2b1:      	addq	%rax, %rax
     2b4:      	addq	%rdx, %rax
     2b7:      	movzwl	(%rax), %eax
     2ba:      	movzwl	%ax, %eax
     2bd:      	andl	$0x2000, %eax           # imm = 0x2000
     2c2:      	testl	%eax, %eax
     2c4:      	jne	0x2e5 <hand_from_string+0x266>
     2c6:      	leaq	(%rip), %rcx            # 0x2cd <hand_from_string+0x24e>
;   .rodata -> "hand_from_string"
     2cd:      	movl	$0x2a, %edx
     2d2:      	leaq	(%rip), %rsi            # 0x2d9 <hand_from_string+0x25a>
;   .rodata -> "input.c"
     2d9:      	leaq	(%rip), %rdi            # 0x2e0 <hand_from_string+0x261>
;   .rodata -> "*where == '\\0' || isspace(*where)"
     2e0:      	callq	0x2e5 <hand_from_string+0x266>
;   __assert_fail+-4
     2e5:      	movq	-0x230(%rbp), %rax
     2ec:      	movq	%rax, %rdi
     2ef:      	callq	0x2f4 <hand_from_string+0x275>
;   add_empty_card+-4
     2f4:      	movq	%rax, -0x220(%rbp)
     2fb:      	movq	-0x220(%rbp), %rdx
     302:      	movq	-0x228(%rbp), %rcx
     309:      	movq	-0x250(%rbp), %rax
     310:      	movq	%rcx, %rsi
     313:      	movq	%rax, %rdi
     316:      	callq	0x31b <hand_from_string+0x29c>
;   add_future_card+-4
     31b:      	movq	-0x218(%rbp), %rax
     322:      	movq	%rax, -0x248(%rbp)
     329:      	jmp	0x384 <hand_from_string+0x305>
     32b:      	movq	-0x248(%rbp), %rax
     332:      	addq	$0x1, %rax
     336:      	movzbl	(%rax), %eax
     339:      	movsbl	%al, %edx
     33c:      	movq	-0x248(%rbp), %rax
     343:      	movzbl	(%rax), %eax
     346:      	movsbl	%al, %eax
     349:      	movl	%edx, %esi
     34b:      	movl	%eax, %edi
     34d:      	callq	0x352 <hand_from_string+0x2d3>
;   card_from_letters+-4
     352:      	movq	%rax, -0x218(%rbp)
     359:      	movq	-0x218(%rbp), %rdx
     360:      	movq	-0x230(%rbp), %rax
     367:      	movq	%rdx, %rsi
     36a:      	movq	%rax, %rdi
     36d:      	callq	0x372 <hand_from_string+0x2f3>
;   add_card_to+-4
     372:      	addq	$0x2, -0x248(%rbp)
     37a:      	jmp	0x384 <hand_from_string+0x305>
     37c:      	addq	$0x1, -0x248(%rbp)
     384:      	movq	-0x248(%rbp), %rax
     38b:      	movzbl	(%rax), %eax
     38e:      	testb	%al, %al
     390:      	jne	0xf8 <hand_from_string+0x79>
     396:      	movq	-0x230(%rbp), %rax
     39d:      	movq	0x8(%rax), %rax
     3a1:      	cmpq	$0x4, %rax
     3a5:      	ja	0x3d7 <hand_from_string+0x358>
     3a7:      	movq	-0x230(%rbp), %rax
     3ae:      	movq	0x8(%rax), %rdx
     3b2:      	movq	(%rip), %rax            # 0x3b9 <hand_from_string+0x33a>
;   stderr+-4
     3b9:      	leaq	(%rip), %rsi            # 0x3c0 <hand_from_string+0x341>
;   .rodata -> "A hand must have at  least 5 cards (this one has %zu)\n"
     3c0:      	movq	%rax, %rdi
     3c3:      	movl	$0x0, %eax
     3c8:      	callq	0x3cd <hand_from_string+0x34e>
;   fprintf+-4
     3cd:      	movl	$0x1, %edi
     3d2:      	callq	0x3d7 <hand_from_string+0x358>
;   exit+-4
     3d7:      	movq	-0x230(%rbp), %rax
     3de:      	movq	0x8(%rax), %rax
     3e2:      	cmpq	$0x9, %rax
     3e6:      	jbe	0x418 <hand_from_string+0x399>
     3e8:      	movq	-0x230(%rbp), %rax
     3ef:      	movq	0x8(%rax), %rdx
     3f3:      	movq	(%rip), %rax            # 0x3fa <hand_from_string+0x37b>
;   stderr+-4
     3fa:      	leaq	(%rip), %rsi            # 0x401 <hand_from_string+0x382>
;   .rodata -> "A hand must have at most 9 cards (this one has %zu)\n"
     401:      	movq	%rax, %rdi
     404:      	movl	$0x0, %eax
     409:      	callq	0x40e <hand_from_string+0x38f>
;   fprintf+-4
     40e:      	movl	$0x1, %edi
     413:      	callq	0x418 <hand_from_string+0x399>
;   exit+-4
     418:      	movq	-0x230(%rbp), %rax
     41f:      	movq	-0x8(%rbp), %rcx
     423:      	xorq	%fs:0x28, %rcx
     42c:      	je	0x433 <hand_from_string+0x3b4>
     42e:      	callq	0x433 <hand_from_string+0x3b4>
;   __stack_chk_fail+-4
     433:      	leave
     434:      	retq

0000000000000435 <read_input>:
     435:      	endbr64
     439:      	pushq	%rbp
     43a:      	movq	%rsp, %rbp
     43d:      	subq	$0x50, %rsp
     441:      	movq	%rdi, -0x38(%rbp)
     445:      	movq	%rsi, -0x40(%rbp)
     449:      	movq	%rdx, -0x48(%rbp)
     44d:      	movq	%fs:0x28, %rax
     456:      	movq	%rax, -0x8(%rbp)
     45a:      	xorl	%eax, %eax
     45c:      	movl	$0x2, %esi
     461:      	movl	$0x4, %edi
     466:      	callq	0x0 <CHECK_GRADER_ENV>
     46b:      	movq	$0x0, -0x20(%rbp)
     473:      	movq	$0x0, -0x18(%rbp)
     47b:      	movq	$0x0, -0x30(%rbp)
     483:      	movq	$0x0, -0x28(%rbp)
     48b:      	jmp	0x4e6 <read_input+0xb1>
     48d:      	movq	-0x28(%rbp), %rax
     491:      	movq	-0x48(%rbp), %rdx
     495:      	movq	%rdx, %rsi
     498:      	movq	%rax, %rdi
     49b:      	callq	0x4a0 <read_input+0x6b>
;   hand_from_string+-4
     4a0:      	movq	%rax, -0x10(%rbp)
     4a4:      	movq	-0x20(%rbp), %rax
     4a8:      	addq	$0x1, %rax
     4ac:      	leaq	(,%rax,8), %rdx
     4b4:      	movq	-0x18(%rbp), %rax
     4b8:      	movq	%rdx, %rsi
     4bb:      	movq	%rax, %rdi
     4be:      	callq	0x4c3 <read_input+0x8e>
;   realloc+-4
     4c3:      	movq	%rax, -0x18(%rbp)
     4c7:      	movq	-0x20(%rbp), %rax
     4cb:      	leaq	(,%rax,8), %rdx
     4d3:      	movq	-0x18(%rbp), %rax
     4d7:      	addq	%rax, %rdx
     4da:      	movq	-0x10(%rbp), %rax
     4de:      	movq	%rax, (%rdx)
     4e1:      	addq	$0x1, -0x20(%rbp)
     4e6:      	movq	-0x38(%rbp), %rdx
     4ea:      	leaq	-0x30(%rbp), %rcx
     4ee:      	leaq	-0x28(%rbp), %rax
     4f2:      	movq	%rcx, %rsi
     4f5:      	movq	%rax, %rdi
     4f8:      	callq	0x4fd <read_input+0xc8>
;   getline+-4
     4fd:      	testq	%rax, %rax
     500:      	jg	0x48d <read_input+0x58>
     502:      	movq	-0x28(%rbp), %rax
     506:      	movq	%rax, %rdi
     509:      	callq	0x50e <read_input+0xd9>
;   free+-4
     50e:      	movq	-0x40(%rbp), %rax
     512:      	movq	-0x20(%rbp), %rdx
     516:      	movq	%rdx, (%rax)
     519:      	movq	-0x18(%rbp), %rax
     51d:      	movq	-0x8(%rbp), %rcx
     521:      	xorq	%fs:0x28, %rcx
     52a:      	je	0x531 <read_input+0xfc>
     52c:      	callq	0x531 <read_input+0xfc>
;   __stack_chk_fail+-4
     531:      	leave
     532:      	retq
```
