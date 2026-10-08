# ELF RE report: `10_gdb/game`

- size: 39117 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_EXEC
- producer: `GCC: (Ubuntu 4.8.4-2ubuntu1~14.04.3) 4.8.4`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `crtstuff.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `game.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `secret.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `crtstuff.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `stdin@@GLIBC_2.2.5` | STT_OBJECT | STB_GLOBAL | .bss | 0x601068 | 8 |
| `__bss_start` | STT_NOTYPE | STB_GLOBAL | .bss | 0x601068 | 0 |
| `completed.6973` | STT_OBJECT | STB_LOCAL | .bss | 0x601070 | 1 |
| `_end` | STT_NOTYPE | STB_GLOBAL | .bss | 0x601078 | 0 |
| `data_start` | STT_NOTYPE | STB_WEAK | .data | 0x601058 | 0 |
| `__data_start` | STT_NOTYPE | STB_GLOBAL | .data | 0x601058 | 0 |
| `__dso_handle` | STT_OBJECT | STB_GLOBAL | .data | 0x601060 | 0 |
| `_edata` | STT_NOTYPE | STB_GLOBAL | .data | 0x601068 | 0 |
| `__TMC_END__` | STT_OBJECT | STB_GLOBAL | .data | 0x601068 | 0 |
| `_DYNAMIC` | STT_OBJECT | STB_LOCAL | .dynamic | 0x600e28 | 0 |
| `__FRAME_END__` | STT_OBJECT | STB_LOCAL | .eh_frame | 0x400bd8 | 0 |
| `_fini` | STT_FUNC | STB_GLOBAL | .fini | 0x400934 | 0 |
| `__do_global_dtors_aux_fini_array_entry` | STT_OBJECT | STB_LOCAL | .fini_array | 0x600e18 | 0 |
| `_GLOBAL_OFFSET_TABLE_` | STT_OBJECT | STB_LOCAL | .got.plt | 0x601000 | 0 |
| `_init` | STT_FUNC | STB_GLOBAL | .init | 0x400560 | 0 |
| `__frame_dummy_init_array_entry` | STT_OBJECT | STB_LOCAL | .init_array | 0x600e10 | 0 |
| `__init_array_start` | STT_NOTYPE | STB_LOCAL | .init_array | 0x600e10 | 0 |
| `__init_array_end` | STT_NOTYPE | STB_LOCAL | .init_array | 0x600e18 | 0 |
| `__JCR_LIST__` | STT_OBJECT | STB_LOCAL | .jcr | 0x600e20 | 0 |
| `__JCR_END__` | STT_OBJECT | STB_LOCAL | .jcr | 0x600e20 | 0 |
| `_IO_stdin_used` | STT_OBJECT | STB_GLOBAL | .rodata | 0x400940 | 4 |
| `_start` | STT_FUNC | STB_GLOBAL | .text | 0x400610 | 0 |
| `deregister_tm_clones` | STT_FUNC | STB_LOCAL | .text | 0x400640 | 0 |
| `register_tm_clones` | STT_FUNC | STB_LOCAL | .text | 0x400670 | 0 |
| `__do_global_dtors_aux` | STT_FUNC | STB_LOCAL | .text | 0x4006b0 | 0 |
| `frame_dummy` | STT_FUNC | STB_LOCAL | .text | 0x4006d0 | 0 |
| `main` | STT_FUNC | STB_GLOBAL | .text | 0x4006fd | 402 |
| `getSecretNumber` | STT_FUNC | STB_GLOBAL | .text | 0x400890 | 6 |
| `getOtherSN` | STT_FUNC | STB_GLOBAL | .text | 0x4008a0 | 22 |
| `__libc_csu_init` | STT_FUNC | STB_GLOBAL | .text | 0x4008c0 | 101 |
| `__libc_csu_fini` | STT_FUNC | STB_GLOBAL | .text | 0x400930 | 2 |

## Undefined (imported) symbols

```
_ITM_deregisterTMCloneTable
puts@@GLIBC_2.2.5
__stack_chk_fail@@GLIBC_2.4
__libc_start_main@@GLIBC_2.2.5
srand@@GLIBC_2.2.5
fgets@@GLIBC_2.2.5
__gmon_start__
random@@GLIBC_2.2.5
_Jv_RegisterClasses
atoi@@GLIBC_2.2.5
_ITM_registerTMCloneTable
```

## String literals in .rodata

- `+0x8`  "I'm thinking of a number..."
- `+0x24`  "What number do you guess?"
- `+0x40`  "Oh no, you are giving up?  You lose..."
- `+0x68`  "I'm sorry, that is not right.  You lose"
- `+0x90`  "Correct! You win round1!"
- `+0xb0`  "Ok, time for round 2. I have another secret number."
- `+0xe4`  "Your guess:"
- `+0xf0`  "You win round 2 also!"
- `+0x108`  "Sorry, you did not win the second round"

## String literals grouped by referencing function

## DWARF

### CU `game.c`

- comp_dir: `/home/drew/assignments/23_debugging`
- producer: `GNU C 4.8.4 -mtune=generic -march=x86-64 -ggdb3 -std=gnu99 -fstack-protector`

#### Functions

- `main(void)`  @ line 8
    - local `guessesMade` (type ref 102) @ line 9
    - local `yourGuess` (type ref 102) @ line 10
    - local `buffer` (type ref 804) @ line 11
    - local `myNumber` (type ref 102) @ line 12
    - local `total` (type ref 102) @ line 27

#### Globals

- `stdin` (type ref 606)

### Types

- **typedef `size_t`** (size None)
- **typedef `__off_t`** (size None)
- **typedef `__off64_t`** (size None)
- **structure_type `_IO_FILE`** (size 216)
    - `_flags` type=102 off=0 val=None
    - `_IO_read_ptr` type=147 off=8 val=None
    - `_IO_read_end` type=147 off=16 val=None
    - `_IO_read_base` type=147 off=24 val=None
    - `_IO_write_base` type=147 off=32 val=None
    - `_IO_write_ptr` type=147 off=40 val=None
    - `_IO_write_end` type=147 off=48 val=None
    - `_IO_buf_base` type=147 off=56 val=None
    - `_IO_buf_end` type=147 off=64 val=None
    - `_IO_save_base` type=147 off=72 val=None
    - `_IO_backup_base` type=147 off=80 val=None
    - `_IO_save_end` type=147 off=88 val=None
    - `_markers` type=600 off=96 val=None
    - `_chain` type=606 off=104 val=None
    - `_fileno` type=102 off=112 val=None
    - `_flags2` type=102 off=116 val=None
    - `_old_offset` type=116 off=120 val=None
    - `_cur_column` type=74 off=128 val=None
    - `_vtable_offset` type=88 off=130 val=None
    - `_shortbuf` type=612 off=131 val=None
    - `_lock` type=628 off=136 val=None
    - `_offset` type=127 off=144 val=None
    - `__pad1` type=145 off=152 val=None
    - `__pad2` type=145 off=160 val=None
    - `__pad3` type=145 off=168 val=None
    - `__pad4` type=145 off=176 val=None
    - `__pad5` type=49 off=184 val=None
    - `_mode` type=102 off=192 val=None
    - `_unused2` type=634 off=196 val=None
- **typedef `_IO_lock_t`** (size None)
- **structure_type `_IO_marker`** (size 24)
    - `_next` type=600 off=0 val=None
    - `_sbuf` type=606 off=8 val=None
    - `_pos` type=102 off=16 val=None

### Line table

#### `game.c`

files: ['game.c', 'stddef.h', 'types.h', 'libio.h', 'stdio.h', 'stdc-predef.h', 'features.h', 'cdefs.h', 'wordsize.h', 'stubs.h', 'stubs-64.h', 'typesizes.h', '_G_config.h', 'wchar.h', 'stdarg.h', 'stdio_lim.h', 'sys_errlist.h', 'stdlib.h', 'waitflags.h', 'waitstatus.h', 'endian.h', 'endian.h', 'byteswap.h', 'byteswap-16.h', 'types.h', 'time.h', 'select.h', 'select.h', 'sigset.h', 'time.h', 'sysmacros.h', 'pthreadtypes.h', 'alloca.h', 'stdlib-float.h', 'time.h']

lines with code: 8, 9, 12, 14, 15, 16, 17, 18, 20, 21, 22, 23, 25, 27, 28, 29, 31, 32, 33, 34, 35, 37, 38, 39, 40, 42, 43, 44

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/10_gdb/game:	file format elf64-x86-64

Disassembly of section .init:

0000000000400560 <_init>:
  400560:      	subq	$0x8, %rsp
  400564:      	movq	0x200a8d(%rip), %rax    # 0x600ff8 <srand@@GLIBC_2.2.5+0x600ff8>
  40056b:      	testq	%rax, %rax
  40056e:      	je	0x400575 <_init+0x15>
  400570:      	callq	0x4005e0 <__gmon_start__@plt>
  400575:      	addq	$0x8, %rsp
  400579:      	retq

Disassembly of section .plt:

0000000000400580 <.plt>:
  400580:      	pushq	0x200a82(%rip)          # 0x601008 <_GLOBAL_OFFSET_TABLE_+0x8>
  400586:      	jmpq	*0x200a84(%rip)         # 0x601010 <_GLOBAL_OFFSET_TABLE_+0x10>
  40058c:      	nopl	(%rax)

0000000000400590 <puts@plt>:
  400590:      	jmpq	*0x200a82(%rip)         # 0x601018 <_GLOBAL_OFFSET_TABLE_+0x18>
  400596:      	pushq	$0x0
  40059b:      	jmp	0x400580 <.plt>

00000000004005a0 <__stack_chk_fail@plt>:
  4005a0:      	jmpq	*0x200a7a(%rip)         # 0x601020 <_GLOBAL_OFFSET_TABLE_+0x20>
  4005a6:      	pushq	$0x1
  4005ab:      	jmp	0x400580 <.plt>

00000000004005b0 <__libc_start_main@plt>:
  4005b0:      	jmpq	*0x200a72(%rip)         # 0x601028 <_GLOBAL_OFFSET_TABLE_+0x28>
  4005b6:      	pushq	$0x2
  4005bb:      	jmp	0x400580 <.plt>

00000000004005c0 <srand@plt>:
  4005c0:      	jmpq	*0x200a6a(%rip)         # 0x601030 <_GLOBAL_OFFSET_TABLE_+0x30>
  4005c6:      	pushq	$0x3
  4005cb:      	jmp	0x400580 <.plt>

00000000004005d0 <fgets@plt>:
  4005d0:      	jmpq	*0x200a62(%rip)         # 0x601038 <_GLOBAL_OFFSET_TABLE_+0x38>
  4005d6:      	pushq	$0x4
  4005db:      	jmp	0x400580 <.plt>

00000000004005e0 <__gmon_start__@plt>:
  4005e0:      	jmpq	*0x200a5a(%rip)         # 0x601040 <_GLOBAL_OFFSET_TABLE_+0x40>
  4005e6:      	pushq	$0x5
  4005eb:      	jmp	0x400580 <.plt>

00000000004005f0 <random@plt>:
  4005f0:      	jmpq	*0x200a52(%rip)         # 0x601048 <_GLOBAL_OFFSET_TABLE_+0x48>
  4005f6:      	pushq	$0x6
  4005fb:      	jmp	0x400580 <.plt>

0000000000400600 <atoi@plt>:
  400600:      	jmpq	*0x200a4a(%rip)         # 0x601050 <_GLOBAL_OFFSET_TABLE_+0x50>
  400606:      	pushq	$0x7
  40060b:      	jmp	0x400580 <.plt>

Disassembly of section .text:

0000000000400610 <_start>:
  400610:      	xorl	%ebp, %ebp
  400612:      	movq	%rdx, %r9
  400615:      	popq	%rsi
  400616:      	movq	%rsp, %rdx
  400619:      	andq	$-0x10, %rsp
  40061d:      	pushq	%rax
  40061e:      	pushq	%rsp
  40061f:      	movq	$0x400930, %r8          # imm = 0x400930
  400626:      	movq	$0x4008c0, %rcx         # imm = 0x4008C0
  40062d:      	movq	$0x4006fd, %rdi         # imm = 0x4006FD
  400634:      	callq	0x4005b0 <__libc_start_main@plt>
  400639:      	hlt
  40063a:      	nopw	(%rax,%rax)

0000000000400640 <deregister_tm_clones>:
  400640:      	movl	$0x60106f, %eax         # imm = 0x60106F
  400645:      	pushq	%rbp
  400646:      	subq	$0x601068, %rax         # imm = 0x601068
  40064c:      	cmpq	$0xe, %rax
  400650:      	movq	%rsp, %rbp
  400653:      	ja	0x400657 <deregister_tm_clones+0x17>
  400655:      	popq	%rbp
  400656:      	retq
  400657:      	movl	$0x0, %eax
  40065c:      	testq	%rax, %rax
  40065f:      	je	0x400655 <deregister_tm_clones+0x15>
  400661:      	popq	%rbp
  400662:      	movl	$0x601068, %edi         # imm = 0x601068
  400667:      	jmpq	*%rax
  400669:      	nopl	(%rax)

0000000000400670 <register_tm_clones>:
  400670:      	movl	$0x601068, %eax         # imm = 0x601068
  400675:      	pushq	%rbp
  400676:      	subq	$0x601068, %rax         # imm = 0x601068
  40067c:      	sarq	$0x3, %rax
  400680:      	movq	%rsp, %rbp
  400683:      	movq	%rax, %rdx
  400686:      	shrq	$0x3f, %rdx
  40068a:      	addq	%rdx, %rax
  40068d:      	sarq	%rax
  400690:      	jne	0x400694 <register_tm_clones+0x24>
  400692:      	popq	%rbp
  400693:      	retq
  400694:      	movl	$0x0, %edx
  400699:      	testq	%rdx, %rdx
  40069c:      	je	0x400692 <register_tm_clones+0x22>
  40069e:      	popq	%rbp
  40069f:      	movq	%rax, %rsi
  4006a2:      	movl	$0x601068, %edi         # imm = 0x601068
  4006a7:      	jmpq	*%rdx
  4006a9:      	nopl	(%rax)

00000000004006b0 <__do_global_dtors_aux>:
  4006b0:      	cmpb	$0x0, 0x2009b9(%rip)    # 0x601070 <completed.6973>
  4006b7:      	jne	0x4006ca <__do_global_dtors_aux+0x1a>
  4006b9:      	pushq	%rbp
  4006ba:      	movq	%rsp, %rbp
  4006bd:      	callq	0x400640 <deregister_tm_clones>
  4006c2:      	popq	%rbp
  4006c3:      	movb	$0x1, 0x2009a6(%rip)    # 0x601070 <completed.6973>
  4006ca:      	rep		retq
  4006cc:      	nopl	(%rax)

00000000004006d0 <frame_dummy>:
  4006d0:      	cmpq	$0x0, 0x200748(%rip)    # 0x600e20 <__JCR_LIST__>
  4006d8:      	je	0x4006f8 <frame_dummy+0x28>
  4006da:      	movl	$0x0, %eax
  4006df:      	testq	%rax, %rax
  4006e2:      	je	0x4006f8 <frame_dummy+0x28>
  4006e4:      	pushq	%rbp
  4006e5:      	movl	$0x600e20, %edi         # imm = 0x600E20
  4006ea:      	movq	%rsp, %rbp
  4006ed:      	callq	*%rax
  4006ef:      	popq	%rbp
  4006f0:      	jmp	0x400670 <register_tm_clones>
  4006f5:      	nopl	(%rax)
  4006f8:      	jmp	0x400670 <register_tm_clones>

00000000004006fd <main>:
  4006fd:      	pushq	%rbp
  4006fe:      	movq	%rsp, %rbp
  400701:      	subq	$0x430, %rsp            # imm = 0x430
  400708:      	movq	%fs:0x28, %rax
  400711:      	movq	%rax, -0x8(%rbp)
  400715:      	xorl	%eax, %eax
  400717:      	movl	$0x0, -0x41c(%rbp)
  400721:      	callq	0x400890 <getSecretNumber>
  400726:      	movl	%eax, -0x418(%rbp)
  40072c:      	movl	$0x400948, %edi         # imm = 0x400948
  400731:      	callq	0x400590 <puts@plt>
  400736:      	movl	$0x400964, %edi         # imm = 0x400964
  40073b:      	callq	0x400590 <puts@plt>
  400740:      	movq	0x200921(%rip), %rdx    # 0x601068 <stdin@@GLIBC_2.2.5>
  400747:      	leaq	-0x410(%rbp), %rax
  40074e:      	movl	$0x400, %esi            # imm = 0x400
  400753:      	movq	%rax, %rdi
  400756:      	callq	0x4005d0 <fgets@plt>
  40075b:      	testq	%rax, %rax
  40075e:      	jne	0x400774 <main+0x77>
  400760:      	movl	$0x400980, %edi         # imm = 0x400980
  400765:      	callq	0x400590 <puts@plt>
  40076a:      	movl	$0x1, %eax
  40076f:      	jmp	0x400879 <main+0x17c>
  400774:      	leaq	-0x410(%rbp), %rax
  40077b:      	movq	%rax, %rdi
  40077e:      	callq	0x400600 <atoi@plt>
  400783:      	movl	%eax, -0x414(%rbp)
  400789:      	movl	-0x414(%rbp), %eax
  40078f:      	cmpl	-0x418(%rbp), %eax
  400795:      	je	0x4007ab <main+0xae>
  400797:      	movl	$0x4009a8, %edi         # imm = 0x4009A8
  40079c:      	callq	0x400590 <puts@plt>
  4007a1:      	movl	$0x1, %eax
  4007a6:      	jmp	0x400879 <main+0x17c>
  4007ab:      	movl	$0x4009d0, %edi         # imm = 0x4009D0
  4007b0:      	callq	0x400590 <puts@plt>
  4007b5:      	movl	$0x0, -0x424(%rbp)
  4007bf:      	movl	$0x0, -0x420(%rbp)
  4007c9:      	jmp	0x4007e5 <main+0xe8>
  4007cb:      	movl	-0x420(%rbp), %eax
  4007d1:      	movl	%eax, %edi
  4007d3:      	callq	0x4008a0 <getOtherSN>
  4007d8:      	xorl	%eax, -0x424(%rbp)
  4007de:      	addl	$0x1, -0x420(%rbp)
  4007e5:      	cmpl	$0x162e, -0x420(%rbp)   # imm = 0x162E
  4007ef:      	jle	0x4007cb <main+0xce>
  4007f1:      	movl	$0x4009f0, %edi         # imm = 0x4009F0
  4007f6:      	callq	0x400590 <puts@plt>
  4007fb:      	movl	$0x400a24, %edi         # imm = 0x400A24
  400800:      	callq	0x400590 <puts@plt>
  400805:      	movq	0x20085c(%rip), %rdx    # 0x601068 <stdin@@GLIBC_2.2.5>
  40080c:      	leaq	-0x410(%rbp), %rax
  400813:      	movl	$0x400, %esi            # imm = 0x400
  400818:      	movq	%rax, %rdi
  40081b:      	callq	0x4005d0 <fgets@plt>
  400820:      	testq	%rax, %rax
  400823:      	jne	0x400836 <main+0x139>
  400825:      	movl	$0x400980, %edi         # imm = 0x400980
  40082a:      	callq	0x400590 <puts@plt>
  40082f:      	movl	$0x1, %eax
  400834:      	jmp	0x400879 <main+0x17c>
  400836:      	leaq	-0x410(%rbp), %rax
  40083d:      	movq	%rax, %rdi
  400840:      	callq	0x400600 <atoi@plt>
  400845:      	movl	%eax, -0x414(%rbp)
  40084b:      	movl	-0x414(%rbp), %eax
  400851:      	cmpl	-0x424(%rbp), %eax
  400857:      	jne	0x40086a <main+0x16d>
  400859:      	movl	$0x400a30, %edi         # imm = 0x400A30
  40085e:      	callq	0x400590 <puts@plt>
  400863:      	movl	$0x0, %eax
  400868:      	jmp	0x400879 <main+0x17c>
  40086a:      	movl	$0x400a48, %edi         # imm = 0x400A48
  40086f:      	callq	0x400590 <puts@plt>
  400874:      	movl	$0x1, %eax
  400879:      	movq	-0x8(%rbp), %rcx
  40087d:      	xorq	%fs:0x28, %rcx
  400886:      	je	0x40088d <main+0x190>
  400888:      	callq	0x4005a0 <__stack_chk_fail@plt>
  40088d:      	leave
  40088e:      	retq
  40088f:      	nop

0000000000400890 <getSecretNumber>:
  400890:      	movl	$0x1badf00d, %eax       # imm = 0x1BADF00D
  400895:      	retq
  400896:      	nopw	%cs:(%rax,%rax)

00000000004008a0 <getOtherSN>:
  4008a0:      	subq	$0x8, %rsp
  4008a4:      	xorl	%eax, %eax
  4008a6:      	callq	0x4005c0 <srand@plt>
  4008ab:      	xorl	%eax, %eax
  4008ad:      	addq	$0x8, %rsp
  4008b1:      	jmp	0x4005f0 <random@plt>
  4008b6:      	nopw	%cs:(%rax,%rax)

00000000004008c0 <__libc_csu_init>:
  4008c0:      	pushq	%r15
  4008c2:      	movl	%edi, %r15d
  4008c5:      	pushq	%r14
  4008c7:      	movq	%rsi, %r14
  4008ca:      	pushq	%r13
  4008cc:      	movq	%rdx, %r13
  4008cf:      	pushq	%r12
  4008d1:      	leaq	0x200538(%rip), %r12    # 0x600e10 <__init_array_start>
  4008d8:      	pushq	%rbp
  4008d9:      	leaq	0x200538(%rip), %rbp    # 0x600e18 <__do_global_dtors_aux_fini_array_entry>
  4008e0:      	pushq	%rbx
  4008e1:      	subq	%r12, %rbp
  4008e4:      	xorl	%ebx, %ebx
  4008e6:      	sarq	$0x3, %rbp
  4008ea:      	subq	$0x8, %rsp
  4008ee:      	callq	0x400560 <_init>
  4008f3:      	testq	%rbp, %rbp
  4008f6:      	je	0x400916 <__libc_csu_init+0x56>
  4008f8:      	nopl	(%rax,%rax)
  400900:      	movq	%r13, %rdx
  400903:      	movq	%r14, %rsi
  400906:      	movl	%r15d, %edi
  400909:      	callq	*(%r12,%rbx,8)
  40090d:      	addq	$0x1, %rbx
  400911:      	cmpq	%rbp, %rbx
  400914:      	jne	0x400900 <__libc_csu_init+0x40>
  400916:      	addq	$0x8, %rsp
  40091a:      	popq	%rbx
  40091b:      	popq	%rbp
  40091c:      	popq	%r12
  40091e:      	popq	%r13
  400920:      	popq	%r14
  400922:      	popq	%r15
  400924:      	retq
  400925:      	nopw	%cs:(%rax,%rax)

0000000000400930 <__libc_csu_fini>:
  400930:      	rep		retq

Disassembly of section .fini:

0000000000400934 <_fini>:
  400934:      	subq	$0x8, %rsp
  400938:      	addq	$0x8, %rsp
  40093c:      	retq
```
