# ELF RE report: `c2prj1_cards/main.o`

- size: 5264 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `main.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `__PRETTY_FUNCTION__.3052` | STT_OBJECT | STB_LOCAL | .rodata | 0xfd | 5 |
| `CHECK_GRADER_ENV` | STT_FUNC | STB_LOCAL | .text | 0x0 | 127 |
| `main` | STT_FUNC | STB_GLOBAL | .text | 0x7f | 1444 |

## Undefined (imported) symbols

```
_GLOBAL_OFFSET_TABLE_
getenv
atoi
stderr
fprintf
abort
fwrite
__assert_fail
fopen
read_input
fclose
build_remaining_deck
putchar
stdout
fflush
shuffle
future_cards_from_deck
compare_hands
printf
free
free_deck
__stack_chk_fail
```

## String literals in .rodata

- `+0x0`  "PokerProjectStep"
- `+0x18`  "Oops, you seem to be using our code for a step you were supposed to do! (%d,%d,%d,%d)\n"
- `+0x70`  "Usage: poker inputfile [trials]\n"
- `+0x91`  "main.c"
- `+0x98`  "num_trials != 0"
- `+0xaa`  "Could not open %s\n"
- `+0xc0`  "Hand %zu won %u / %u times (%.2f%%)\n"
- `+0xe5`  "And there were %u ties\n"
- `+0xfd`  "main"
- `+0x10e`  "Y@"

## String literals grouped by referencing function

### `CHECK_GRADER_ENV`

- "PokerProjectStep"
- "Oops, you seem to be using our code for a step you were supposed to do! (%d,%d,%d,%d)\n"

### `main`

- "Usage: poker inputfile [trials]\n"
- "main"
- "main.c"
- "num_trials != 0"
- "r"
- "Could not open %s\n"
- "Hand %zu won %u / %u times (%.2f%%)\n"
- "And there were %u ties\n"

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/c2prj1_cards/main.o:	file format elf64-x86-64

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

000000000000007f <main>:
      7f:      	endbr64
      83:      	pushq	%rbp
      84:      	movq	%rsp, %rbp
      87:      	pushq	%r15
      89:      	pushq	%r14
      8b:      	pushq	%r13
      8d:      	pushq	%r12
      8f:      	pushq	%rbx
      90:      	subq	$0xa8, %rsp
      97:      	movl	%edi, -0xc4(%rbp)
      9d:      	movq	%rsi, -0xd0(%rbp)
      a4:      	movq	%fs:0x28, %rax
      ad:      	movq	%rax, -0x38(%rbp)
      b1:      	xorl	%eax, %eax
      b3:      	movq	%rsp, %rax
      b6:      	movq	%rax, %rbx
      b9:      	movl	$0x3, %esi
      be:      	movl	$0x4, %edi
      c3:      	callq	0x0 <CHECK_GRADER_ENV>
      c8:      	movl	$0x2710, -0xb8(%rbp)    # imm = 0x2710
      d2:      	movq	$0x0, -0x50(%rbp)
      da:      	movq	$0x0, -0x48(%rbp)
      e2:      	cmpl	$0x2, -0xc4(%rbp)
      e9:      	je	0x11e <main+0x9f>
      eb:      	cmpl	$0x3, -0xc4(%rbp)
      f2:      	je	0x11e <main+0x9f>
      f4:      	movq	(%rip), %rax            # 0xfb <main+0x7c>
;   stderr+-4
      fb:      	movq	%rax, %rcx
      fe:      	movl	$0x20, %edx
     103:      	movl	$0x1, %esi
     108:      	leaq	(%rip), %rdi            # 0x10f <main+0x90>
;   .rodata -> "Usage: poker inputfile [trials]\n"
     10f:      	callq	0x114 <main+0x95>
;   fwrite+-4
     114:      	movl	$0x1, %eax
     119:      	jmp	0x5fd <main+0x57e>
     11e:      	cmpl	$0x3, -0xc4(%rbp)
     125:      	jne	0x16b <main+0xec>
     127:      	movq	-0xd0(%rbp), %rax
     12e:      	addq	$0x10, %rax
     132:      	movq	(%rax), %rax
     135:      	movq	%rax, %rdi
     138:      	callq	0x13d <main+0xbe>
;   atoi+-4
     13d:      	movl	%eax, -0xb8(%rbp)
     143:      	cmpl	$0x0, -0xb8(%rbp)
     14a:      	jne	0x16b <main+0xec>
     14c:      	leaq	(%rip), %rcx            # 0x153 <main+0xd4>
;   .rodata -> "main"
     153:      	movl	$0x17, %edx
     158:      	leaq	(%rip), %rsi            # 0x15f <main+0xe0>
;   .rodata -> "main.c"
     15f:      	leaq	(%rip), %rdi            # 0x166 <main+0xe7>
;   .rodata -> "num_trials != 0"
     166:      	callq	0x16b <main+0xec>
;   __assert_fail+-4
     16b:      	movq	-0xd0(%rbp), %rax
     172:      	addq	$0x8, %rax
     176:      	movq	(%rax), %rax
     179:      	leaq	(%rip), %rsi            # 0x180 <main+0x101>
;   .rodata -> "r"
     180:      	movq	%rax, %rdi
     183:      	callq	0x188 <main+0x109>
;   fopen+-4
     188:      	movq	%rax, -0x78(%rbp)
     18c:      	cmpq	$0x0, -0x78(%rbp)
     191:      	jne	0x1c6 <main+0x147>
     193:      	movq	-0xd0(%rbp), %rax
     19a:      	addq	$0x8, %rax
     19e:      	movq	(%rax), %rdx
     1a1:      	movq	(%rip), %rax            # 0x1a8 <main+0x129>
;   stderr+-4
     1a8:      	leaq	(%rip), %rsi            # 0x1af <main+0x130>
;   .rodata -> "Could not open %s\n"
     1af:      	movq	%rax, %rdi
     1b2:      	movl	$0x0, %eax
     1b7:      	callq	0x1bc <main+0x13d>
;   fprintf+-4
     1bc:      	movl	$0x1, %eax
     1c1:      	jmp	0x5fd <main+0x57e>
     1c6:      	movq	$0x0, -0xb0(%rbp)
     1d1:      	leaq	-0x50(%rbp), %rdx
     1d5:      	leaq	-0xb0(%rbp), %rcx
     1dc:      	movq	-0x78(%rbp), %rax
     1e0:      	movq	%rcx, %rsi
     1e3:      	movq	%rax, %rdi
     1e6:      	callq	0x1eb <main+0x16c>
;   read_input+-4
     1eb:      	movq	%rax, -0x70(%rbp)
     1ef:      	movq	-0x78(%rbp), %rax
     1f3:      	movq	%rax, %rdi
     1f6:      	callq	0x1fb <main+0x17c>
;   fclose+-4
     1fb:      	movq	-0xb0(%rbp), %rdx
     202:      	movq	-0x70(%rbp), %rax
     206:      	movq	%rdx, %rsi
     209:      	movq	%rax, %rdi
     20c:      	callq	0x211 <main+0x192>
;   build_remaining_deck+-4
     211:      	movq	%rax, -0x68(%rbp)
     215:      	movq	-0xb0(%rbp), %rax
     21c:      	addq	$0x1, %rax
     220:      	movq	%rax, %rdx
     223:      	subq	$0x1, %rdx
     227:      	movq	%rdx, -0x60(%rbp)
     22b:      	movq	%rax, %r14
     22e:      	movl	$0x0, %r15d
     234:      	movq	%rax, %r12
     237:      	movl	$0x0, %r13d
     23d:      	leaq	(,%rax,4), %rdx
     245:      	movl	$0x10, %eax
     24a:      	subq	$0x1, %rax
     24e:      	addq	%rdx, %rax
     251:      	movl	$0x10, %ecx
     256:      	movl	$0x0, %edx
     25b:      	divq	%rcx
     25e:      	imulq	$0x10, %rax, %rax
     262:      	movq	%rax, %rdx
     265:      	andq	$-0x1000, %rdx          # imm = 0xF000
     26c:      	movq	%rsp, %rsi
     26f:      	subq	%rdx, %rsi
     272:      	movq	%rsi, %rdx
     275:      	cmpq	%rdx, %rsp
     278:      	je	0x28c <main+0x20d>
     27a:      	subq	$0x1000, %rsp           # imm = 0x1000
     281:      	orq	$0x0, 0xff8(%rsp)
     28a:      	jmp	0x275 <main+0x1f6>
     28c:      	movq	%rax, %rdx
     28f:      	andl	$0xfff, %edx            # imm = 0xFFF
     295:      	subq	%rdx, %rsp
     298:      	movq	%rax, %rdx
     29b:      	andl	$0xfff, %edx            # imm = 0xFFF
     2a1:      	testq	%rdx, %rdx
     2a4:      	je	0x2b6 <main+0x237>
     2a6:      	andl	$0xfff, %eax            # imm = 0xFFF
     2ab:      	subq	$0x8, %rax
     2af:      	addq	%rsp, %rax
     2b2:      	orq	$0x0, (%rax)
     2b6:      	movq	%rsp, %rax
     2b9:      	addq	$0x3, %rax
     2bd:      	shrq	$0x2, %rax
     2c1:      	shlq	$0x2, %rax
     2c5:      	movq	%rax, -0x58(%rbp)
     2c9:      	movq	$0x0, -0xa8(%rbp)
     2d4:      	jmp	0x2f0 <main+0x271>
     2d6:      	movq	-0x58(%rbp), %rax
     2da:      	movq	-0xa8(%rbp), %rdx
     2e1:      	movl	$0x0, (%rax,%rdx,4)
     2e8:      	addq	$0x1, -0xa8(%rbp)
     2f0:      	movq	-0xb0(%rbp), %rax
     2f7:      	addq	$0x1, %rax
     2fb:      	cmpq	%rax, -0xa8(%rbp)
     302:      	jb	0x2d6 <main+0x257>
     304:      	movl	$0x0, -0xbc(%rbp)
     30e:      	jmp	0x47a <main+0x3fb>
     313:      	movl	-0xbc(%rbp), %edx
     319:      	movl	%edx, %eax
     31b:      	shrl	$0x4, %eax
     31e:      	movl	%eax, %eax
     320:      	imulq	$0xa7c5ac5, %rax, %rax  # imm = 0xA7C5AC5
     327:      	shrq	$0x20, %rax
     32b:      	shrl	$0x7, %eax
     32e:      	imull	$0xc350, %eax, %eax     # imm = 0xC350
     334:      	subl	%eax, %edx
     336:      	movl	%edx, %eax
     338:      	cmpl	$0xc34f, %eax           # imm = 0xC34F
     33d:      	jne	0x358 <main+0x2d9>
     33f:      	movl	$0x2e, %edi
     344:      	callq	0x349 <main+0x2ca>
;   putchar+-4
     349:      	movq	(%rip), %rax            # 0x350 <main+0x2d1>
;   stdout+-4
     350:      	movq	%rax, %rdi
     353:      	callq	0x358 <main+0x2d9>
;   fflush+-4
     358:      	movq	-0x68(%rbp), %rax
     35c:      	movq	%rax, %rdi
     35f:      	callq	0x364 <main+0x2e5>
;   shuffle+-4
     364:      	leaq	-0x50(%rbp), %rdx
     368:      	movq	-0x68(%rbp), %rax
     36c:      	movq	%rdx, %rsi
     36f:      	movq	%rax, %rdi
     372:      	callq	0x377 <main+0x2f8>
;   future_cards_from_deck+-4
     377:      	movl	$0x0, -0xc0(%rbp)
     381:      	movq	$0x0, -0xa0(%rbp)
     38c:      	movq	$0x1, -0x98(%rbp)
     397:      	jmp	0x41d <main+0x39e>
     39c:      	movq	-0x98(%rbp), %rax
     3a3:      	leaq	(,%rax,8), %rdx
     3ab:      	movq	-0x70(%rbp), %rax
     3af:      	addq	%rdx, %rax
     3b2:      	movq	(%rax), %rdx
     3b5:      	movq	-0xa0(%rbp), %rax
     3bc:      	leaq	(,%rax,8), %rcx
     3c4:      	movq	-0x70(%rbp), %rax
     3c8:      	addq	%rcx, %rax
     3cb:      	movq	(%rax), %rax
     3ce:      	movq	%rdx, %rsi
     3d1:      	movq	%rax, %rdi
     3d4:      	callq	0x3d9 <main+0x35a>
;   compare_hands+-4
     3d9:      	movl	%eax, -0xb4(%rbp)
     3df:      	cmpl	$0x0, -0xb4(%rbp)
     3e6:      	jne	0x3f4 <main+0x375>
     3e8:      	movl	$0x1, -0xc0(%rbp)
     3f2:      	jmp	0x415 <main+0x396>
     3f4:      	cmpl	$0x0, -0xb4(%rbp)
     3fb:      	jns	0x415 <main+0x396>
     3fd:      	movq	-0x98(%rbp), %rax
     404:      	movq	%rax, -0xa0(%rbp)
     40b:      	movl	$0x0, -0xc0(%rbp)
     415:      	addq	$0x1, -0x98(%rbp)
     41d:      	movq	-0xb0(%rbp), %rax
     424:      	cmpq	%rax, -0x98(%rbp)
     42b:      	jb	0x39c <main+0x31d>
     431:      	cmpl	$0x0, -0xc0(%rbp)
     438:      	je	0x454 <main+0x3d5>
     43a:      	movq	-0xb0(%rbp), %rax
     441:      	movq	-0x58(%rbp), %rdx
     445:      	movl	(%rdx,%rax,4), %edx
     448:      	leal	0x1(%rdx), %ecx
     44b:      	movq	-0x58(%rbp), %rdx
     44f:      	movl	%ecx, (%rdx,%rax,4)
     452:      	jmp	0x473 <main+0x3f4>
     454:      	movq	-0x58(%rbp), %rax
     458:      	movq	-0xa0(%rbp), %rdx
     45f:      	movl	(%rax,%rdx,4), %eax
     462:      	leal	0x1(%rax), %ecx
     465:      	movq	-0x58(%rbp), %rax
     469:      	movq	-0xa0(%rbp), %rdx
     470:      	movl	%ecx, (%rax,%rdx,4)
     473:      	addl	$0x1, -0xbc(%rbp)
     47a:      	movl	-0xb8(%rbp), %eax
     480:      	cmpl	%eax, -0xbc(%rbp)
     486:      	jb	0x313 <main+0x294>
     48c:      	movl	$0xa, %edi
     491:      	callq	0x496 <main+0x417>
;   putchar+-4
     496:      	movq	$0x0, -0x90(%rbp)
     4a1:      	jmp	0x526 <main+0x4a7>
     4a6:      	movq	-0x58(%rbp), %rax
     4aa:      	movq	-0x90(%rbp), %rdx
     4b1:      	movl	(%rax,%rdx,4), %eax
     4b4:      	movl	%eax, %eax
     4b6:      	testq	%rax, %rax
     4b9:      	js	0x4c2 <main+0x443>
     4bb:      	cvtsi2sd	%rax, %xmm0
     4c0:      	jmp	0x4d7 <main+0x458>
     4c2:      	movq	%rax, %rdx
     4c5:      	shrq	%rdx
     4c8:      	andl	$0x1, %eax
     4cb:      	orq	%rax, %rdx
     4ce:      	cvtsi2sd	%rdx, %xmm0
     4d3:      	addsd	%xmm0, %xmm0
     4d7:      	movsd	(%rip), %xmm1           # 0x4df <main+0x460>
;   .rodata+260
     4df:      	mulsd	%xmm1, %xmm0
     4e3:      	cvtsi2sdl	-0xb8(%rbp), %xmm1
     4eb:      	divsd	%xmm1, %xmm0
     4ef:      	movq	-0x58(%rbp), %rax
     4f3:      	movq	-0x90(%rbp), %rdx
     4fa:      	movl	(%rax,%rdx,4), %edx
     4fd:      	movl	-0xb8(%rbp), %ecx
     503:      	movq	-0x90(%rbp), %rax
     50a:      	movq	%rax, %rsi
     50d:      	leaq	(%rip), %rdi            # 0x514 <main+0x495>
;   .rodata -> "Hand %zu won %u / %u times (%.2f%%)\n"
     514:      	movl	$0x1, %eax
     519:      	callq	0x51e <main+0x49f>
;   printf+-4
     51e:      	addq	$0x1, -0x90(%rbp)
     526:      	movq	-0xb0(%rbp), %rax
     52d:      	cmpq	%rax, -0x90(%rbp)
     534:      	jb	0x4a6 <main+0x427>
     53a:      	movq	-0xb0(%rbp), %rdx
     541:      	movq	-0x58(%rbp), %rax
     545:      	movl	(%rax,%rdx,4), %eax
     548:      	movl	%eax, %esi
     54a:      	leaq	(%rip), %rdi            # 0x551 <main+0x4d2>
;   .rodata -> "And there were %u ties\n"
     551:      	movl	$0x0, %eax
     556:      	callq	0x55b <main+0x4dc>
;   printf+-4
     55b:      	movq	$0x0, -0x88(%rbp)
     566:      	jmp	0x58d <main+0x50e>
     568:      	movq	-0x50(%rbp), %rax
     56c:      	movq	-0x88(%rbp), %rdx
     573:      	shlq	$0x4, %rdx
     577:      	addq	%rdx, %rax
     57a:      	movq	(%rax), %rax
     57d:      	movq	%rax, %rdi
     580:      	callq	0x585 <main+0x506>
;   free+-4
     585:      	addq	$0x1, -0x88(%rbp)
     58d:      	movq	-0x48(%rbp), %rax
     591:      	cmpq	%rax, -0x88(%rbp)
     598:      	jb	0x568 <main+0x4e9>
     59a:      	movq	-0x50(%rbp), %rax
     59e:      	movq	%rax, %rdi
     5a1:      	callq	0x5a6 <main+0x527>
;   free+-4
     5a6:      	movq	-0x68(%rbp), %rax
     5aa:      	movq	%rax, %rdi
     5ad:      	callq	0x5b2 <main+0x533>
;   free_deck+-4
     5b2:      	movq	$0x0, -0x80(%rbp)
     5ba:      	jmp	0x5df <main+0x560>
     5bc:      	movq	-0x80(%rbp), %rax
     5c0:      	leaq	(,%rax,8), %rdx
     5c8:      	movq	-0x70(%rbp), %rax
     5cc:      	addq	%rdx, %rax
     5cf:      	movq	(%rax), %rax
     5d2:      	movq	%rax, %rdi
     5d5:      	callq	0x5da <main+0x55b>
;   free_deck+-4
     5da:      	addq	$0x1, -0x80(%rbp)
     5df:      	movq	-0xb0(%rbp), %rax
     5e6:      	cmpq	%rax, -0x80(%rbp)
     5ea:      	jb	0x5bc <main+0x53d>
     5ec:      	movq	-0x70(%rbp), %rax
     5f0:      	movq	%rax, %rdi
     5f3:      	callq	0x5f8 <main+0x579>
;   free+-4
     5f8:      	movl	$0x0, %eax
     5fd:      	movq	%rbx, %rsp
     600:      	movq	-0x38(%rbp), %rbx
     604:      	xorq	%fs:0x28, %rbx
     60d:      	je	0x614 <main+0x595>
     60f:      	callq	0x614 <main+0x595>
;   __stack_chk_fail+-4
     614:      	leaq	-0x28(%rbp), %rsp
     618:      	popq	%rbx
     619:      	popq	%r12
     61b:      	popq	%r13
     61d:      	popq	%r14
     61f:      	popq	%r15
     621:      	popq	%rbp
     622:      	retq
```
