# ELF RE report: `08_testing/isPrime-broken3`

- size: 8663 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_EXEC
- producer: `GCC: (Ubuntu 4.8.4-2ubuntu1~14.04.3) 4.8.4`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `isPrime.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `crtstuff.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `crtstuff.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `completed.6973` | STT_OBJECT | STB_LOCAL | .bss | 0x601050 | 1 |
| `__bss_start` | STT_NOTYPE | STB_GLOBAL | .bss | 0x601050 | 0 |
| `_end` | STT_NOTYPE | STB_GLOBAL | .bss | 0x601058 | 0 |
| `data_start` | STT_NOTYPE | STB_WEAK | .data | 0x601040 | 0 |
| `__data_start` | STT_NOTYPE | STB_GLOBAL | .data | 0x601040 | 0 |
| `__dso_handle` | STT_OBJECT | STB_GLOBAL | .data | 0x601048 | 0 |
| `_edata` | STT_NOTYPE | STB_GLOBAL | .data | 0x601050 | 0 |
| `__TMC_END__` | STT_OBJECT | STB_GLOBAL | .data | 0x601050 | 0 |
| `_DYNAMIC` | STT_OBJECT | STB_LOCAL | .dynamic | 0x600e28 | 0 |
| `__FRAME_END__` | STT_OBJECT | STB_LOCAL | .eh_frame | 0x400960 | 0 |
| `_fini` | STT_FUNC | STB_GLOBAL | .fini | 0x400794 | 0 |
| `__do_global_dtors_aux_fini_array_entry` | STT_OBJECT | STB_LOCAL | .fini_array | 0x600e18 | 0 |
| `_GLOBAL_OFFSET_TABLE_` | STT_OBJECT | STB_LOCAL | .got.plt | 0x601000 | 0 |
| `_init` | STT_FUNC | STB_GLOBAL | .init | 0x400478 | 0 |
| `__frame_dummy_init_array_entry` | STT_OBJECT | STB_LOCAL | .init_array | 0x600e10 | 0 |
| `__init_array_start` | STT_NOTYPE | STB_LOCAL | .init_array | 0x600e10 | 0 |
| `__init_array_end` | STT_NOTYPE | STB_LOCAL | .init_array | 0x600e18 | 0 |
| `__JCR_LIST__` | STT_OBJECT | STB_LOCAL | .jcr | 0x600e20 | 0 |
| `__JCR_END__` | STT_OBJECT | STB_LOCAL | .jcr | 0x600e20 | 0 |
| `_IO_stdin_used` | STT_OBJECT | STB_GLOBAL | .rodata | 0x4007a0 | 4 |
| `main` | STT_FUNC | STB_GLOBAL | .text | 0x400500 | 215 |
| `_start` | STT_FUNC | STB_GLOBAL | .text | 0x4005d7 | 0 |
| `deregister_tm_clones` | STT_FUNC | STB_LOCAL | .text | 0x400610 | 0 |
| `register_tm_clones` | STT_FUNC | STB_LOCAL | .text | 0x400640 | 0 |
| `__do_global_dtors_aux` | STT_FUNC | STB_LOCAL | .text | 0x400680 | 0 |
| `frame_dummy` | STT_FUNC | STB_LOCAL | .text | 0x4006a0 | 0 |
| `isPrime` | STT_FUNC | STB_GLOBAL | .text | 0x4006d0 | 67 |
| `__libc_csu_init` | STT_FUNC | STB_GLOBAL | .text | 0x400720 | 101 |
| `__libc_csu_fini` | STT_FUNC | STB_GLOBAL | .text | 0x400790 | 2 |

## Undefined (imported) symbols

```
_ITM_deregisterTMCloneTable
puts@@GLIBC_2.2.5
__libc_start_main@@GLIBC_2.2.5
__gmon_start__
strtol@@GLIBC_2.2.5
__printf_chk@@GLIBC_2.3.4
_Jv_RegisterClasses
_ITM_registerTMCloneTable
```

## String literals in .rodata

- `+0x8`  "Please provide exactly one number to test for primailty"
- `+0x40`  "%s is not prime\n"
- `+0x51`  "%ld is prime\n"
- `+0x5f`  "%ld is not prime\n"

## String literals grouped by referencing function

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/08_testing/isPrime-broken3:	file format elf64-x86-64

Disassembly of section .init:

0000000000400478 <_init>:
  400478:      	subq	$0x8, %rsp
  40047c:      	movq	0x200b75(%rip), %rax    # 0x600ff8 <strtol@@GLIBC_2.2.5+0x600ff8>
  400483:      	testq	%rax, %rax
  400486:      	je	0x40048d <_init+0x15>
  400488:      	callq	0x4004d0 <__gmon_start__@plt>
  40048d:      	addq	$0x8, %rsp
  400491:      	retq

Disassembly of section .plt:

00000000004004a0 <.plt>:
  4004a0:      	pushq	0x200b62(%rip)          # 0x601008 <_GLOBAL_OFFSET_TABLE_+0x8>
  4004a6:      	jmpq	*0x200b64(%rip)         # 0x601010 <_GLOBAL_OFFSET_TABLE_+0x10>
  4004ac:      	nopl	(%rax)

00000000004004b0 <puts@plt>:
  4004b0:      	jmpq	*0x200b62(%rip)         # 0x601018 <_GLOBAL_OFFSET_TABLE_+0x18>
  4004b6:      	pushq	$0x0
  4004bb:      	jmp	0x4004a0 <.plt>

00000000004004c0 <__libc_start_main@plt>:
  4004c0:      	jmpq	*0x200b5a(%rip)         # 0x601020 <_GLOBAL_OFFSET_TABLE_+0x20>
  4004c6:      	pushq	$0x1
  4004cb:      	jmp	0x4004a0 <.plt>

00000000004004d0 <__gmon_start__@plt>:
  4004d0:      	jmpq	*0x200b52(%rip)         # 0x601028 <_GLOBAL_OFFSET_TABLE_+0x28>
  4004d6:      	pushq	$0x2
  4004db:      	jmp	0x4004a0 <.plt>

00000000004004e0 <strtol@plt>:
  4004e0:      	jmpq	*0x200b4a(%rip)         # 0x601030 <_GLOBAL_OFFSET_TABLE_+0x30>
  4004e6:      	pushq	$0x3
  4004eb:      	jmp	0x4004a0 <.plt>

00000000004004f0 <__printf_chk@plt>:
  4004f0:      	jmpq	*0x200b42(%rip)         # 0x601038 <_GLOBAL_OFFSET_TABLE_+0x38>
  4004f6:      	pushq	$0x4
  4004fb:      	jmp	0x4004a0 <.plt>

Disassembly of section .text:

0000000000400500 <main>:
  400500:      	pushq	%rbx
  400501:      	subq	$0x10, %rsp
  400505:      	cmpl	$0x2, %edi
  400508:      	je	0x40051f <main+0x1f>
  40050a:      	movl	$0x4007a8, %edi         # imm = 0x4007A8
  40050f:      	callq	0x4004b0 <puts@plt>
  400514:      	movl	$0x1, %eax
  400519:      	addq	$0x10, %rsp
  40051d:      	popq	%rbx
  40051e:      	retq
  40051f:      	movq	0x8(%rsi), %rdi
  400523:      	xorl	%edx, %edx
  400525:      	movq	%rsi, %rbx
  400528:      	movq	%rsp, %rsi
  40052b:      	movq	$0x0, (%rsp)
  400533:      	callq	0x4004e0 <strtol@plt>
  400538:      	movq	0x8(%rbx), %rdx
  40053c:      	movq	%rax, %rdi
  40053f:      	movq	(%rsp), %rax
  400543:      	cmpq	%rax, %rdx
  400546:      	je	0x4005bc <main+0xbc>
  400548:      	cmpb	$0x0, (%rax)
  40054b:      	jne	0x4005bc <main+0xbc>
  40054d:      	cmpq	$0x1, %rdi
  400551:      	jle	0x4005a1 <main+0xa1>
  400553:      	cmpq	$0x2, %rdi
  400557:      	je	0x400586 <main+0x86>
  400559:      	testb	$0x1, %dil
  40055d:      	je	0x4005a1 <main+0xa1>
  40055f:      	movl	$0x2, %ecx
  400564:      	jmp	0x40057d <main+0x7d>
  400566:      	nopw	%cs:(%rax,%rax)
  400570:      	movq	%rdi, %rax
  400573:      	cqto
  400575:      	idivq	%rcx
  400578:      	testq	%rdx, %rdx
  40057b:      	je	0x4005a1 <main+0xa1>
  40057d:      	addq	$0x1, %rcx
  400581:      	cmpq	%rdi, %rcx
  400584:      	jne	0x400570 <main+0x70>
  400586:      	movq	%rdi, %rdx
  400589:      	movl	$0x4007f1, %esi         # imm = 0x4007F1
  40058e:      	movl	$0x1, %edi
  400593:      	xorl	%eax, %eax
  400595:      	callq	0x4004f0 <__printf_chk@plt>
  40059a:      	xorl	%eax, %eax
  40059c:      	jmp	0x400519 <main+0x19>
  4005a1:      	movq	%rdi, %rdx
  4005a4:      	movl	$0x4007ff, %esi         # imm = 0x4007FF
  4005a9:      	movl	$0x1, %edi
  4005ae:      	xorl	%eax, %eax
  4005b0:      	callq	0x4004f0 <__printf_chk@plt>
  4005b5:      	xorl	%eax, %eax
  4005b7:      	jmp	0x400519 <main+0x19>
  4005bc:      	movl	$0x4007e0, %esi         # imm = 0x4007E0
  4005c1:      	movl	$0x1, %edi
  4005c6:      	xorl	%eax, %eax
  4005c8:      	callq	0x4004f0 <__printf_chk@plt>
  4005cd:      	movl	$0x1, %eax
  4005d2:      	jmp	0x400519 <main+0x19>

00000000004005d7 <_start>:
  4005d7:      	xorl	%ebp, %ebp
  4005d9:      	movq	%rdx, %r9
  4005dc:      	popq	%rsi
  4005dd:      	movq	%rsp, %rdx
  4005e0:      	andq	$-0x10, %rsp
  4005e4:      	pushq	%rax
  4005e5:      	pushq	%rsp
  4005e6:      	movq	$0x400790, %r8          # imm = 0x400790
  4005ed:      	movq	$0x400720, %rcx         # imm = 0x400720
  4005f4:      	movq	$0x400500, %rdi         # imm = 0x400500
  4005fb:      	callq	0x4004c0 <__libc_start_main@plt>
  400600:      	hlt
  400601:      	nopw	%cs:(%rax,%rax)
  40060b:      	nopl	(%rax,%rax)

0000000000400610 <deregister_tm_clones>:
  400610:      	movl	$0x601057, %eax         # imm = 0x601057
  400615:      	pushq	%rbp
  400616:      	subq	$0x601050, %rax         # imm = 0x601050
  40061c:      	cmpq	$0xe, %rax
  400620:      	movq	%rsp, %rbp
  400623:      	ja	0x400627 <deregister_tm_clones+0x17>
  400625:      	popq	%rbp
  400626:      	retq
  400627:      	movl	$0x0, %eax
  40062c:      	testq	%rax, %rax
  40062f:      	je	0x400625 <deregister_tm_clones+0x15>
  400631:      	popq	%rbp
  400632:      	movl	$0x601050, %edi         # imm = 0x601050
  400637:      	jmpq	*%rax
  400639:      	nopl	(%rax)

0000000000400640 <register_tm_clones>:
  400640:      	movl	$0x601050, %eax         # imm = 0x601050
  400645:      	pushq	%rbp
  400646:      	subq	$0x601050, %rax         # imm = 0x601050
  40064c:      	sarq	$0x3, %rax
  400650:      	movq	%rsp, %rbp
  400653:      	movq	%rax, %rdx
  400656:      	shrq	$0x3f, %rdx
  40065a:      	addq	%rdx, %rax
  40065d:      	sarq	%rax
  400660:      	jne	0x400664 <register_tm_clones+0x24>
  400662:      	popq	%rbp
  400663:      	retq
  400664:      	movl	$0x0, %edx
  400669:      	testq	%rdx, %rdx
  40066c:      	je	0x400662 <register_tm_clones+0x22>
  40066e:      	popq	%rbp
  40066f:      	movq	%rax, %rsi
  400672:      	movl	$0x601050, %edi         # imm = 0x601050
  400677:      	jmpq	*%rdx
  400679:      	nopl	(%rax)

0000000000400680 <__do_global_dtors_aux>:
  400680:      	cmpb	$0x0, 0x2009c9(%rip)    # 0x601050 <completed.6973>
  400687:      	jne	0x40069a <__do_global_dtors_aux+0x1a>
  400689:      	pushq	%rbp
  40068a:      	movq	%rsp, %rbp
  40068d:      	callq	0x400610 <deregister_tm_clones>
  400692:      	popq	%rbp
  400693:      	movb	$0x1, 0x2009b6(%rip)    # 0x601050 <completed.6973>
  40069a:      	rep		retq
  40069c:      	nopl	(%rax)

00000000004006a0 <frame_dummy>:
  4006a0:      	cmpq	$0x0, 0x200778(%rip)    # 0x600e20 <__JCR_LIST__>
  4006a8:      	je	0x4006c8 <frame_dummy+0x28>
  4006aa:      	movl	$0x0, %eax
  4006af:      	testq	%rax, %rax
  4006b2:      	je	0x4006c8 <frame_dummy+0x28>
  4006b4:      	pushq	%rbp
  4006b5:      	movl	$0x600e20, %edi         # imm = 0x600E20
  4006ba:      	movq	%rsp, %rbp
  4006bd:      	callq	*%rax
  4006bf:      	popq	%rbp
  4006c0:      	jmp	0x400640 <register_tm_clones>
  4006c5:      	nopl	(%rax)
  4006c8:      	jmp	0x400640 <register_tm_clones>
  4006cd:      	nopl	(%rax)

00000000004006d0 <isPrime>:
  4006d0:      	cmpq	$0x1, %rdi
  4006d4:      	jle	0x400710 <isPrime+0x40>
  4006d6:      	cmpq	$0x2, %rdi
  4006da:      	je	0x400706 <isPrime+0x36>
  4006dc:      	testb	$0x1, %dil
  4006e0:      	je	0x400710 <isPrime+0x40>
  4006e2:      	movl	$0x2, %ecx
  4006e7:      	jmp	0x4006fd <isPrime+0x2d>
  4006e9:      	nopl	(%rax)
  4006f0:      	movq	%rdi, %rax
  4006f3:      	cqto
  4006f5:      	idivq	%rcx
  4006f8:      	testq	%rdx, %rdx
  4006fb:      	je	0x400710 <isPrime+0x40>
  4006fd:      	addq	$0x1, %rcx
  400701:      	cmpq	%rdi, %rcx
  400704:      	jne	0x4006f0 <isPrime+0x20>
  400706:      	movl	$0x1, %eax
  40070b:      	retq
  40070c:      	nopl	(%rax)
  400710:      	xorl	%eax, %eax
  400712:      	retq
  400713:      	nopw	%cs:(%rax,%rax)
  40071d:      	nopl	(%rax)

0000000000400720 <__libc_csu_init>:
  400720:      	pushq	%r15
  400722:      	movl	%edi, %r15d
  400725:      	pushq	%r14
  400727:      	movq	%rsi, %r14
  40072a:      	pushq	%r13
  40072c:      	movq	%rdx, %r13
  40072f:      	pushq	%r12
  400731:      	leaq	0x2006d8(%rip), %r12    # 0x600e10 <__init_array_start>
  400738:      	pushq	%rbp
  400739:      	leaq	0x2006d8(%rip), %rbp    # 0x600e18 <__do_global_dtors_aux_fini_array_entry>
  400740:      	pushq	%rbx
  400741:      	subq	%r12, %rbp
  400744:      	xorl	%ebx, %ebx
  400746:      	sarq	$0x3, %rbp
  40074a:      	subq	$0x8, %rsp
  40074e:      	callq	0x400478 <_init>
  400753:      	testq	%rbp, %rbp
  400756:      	je	0x400776 <__libc_csu_init+0x56>
  400758:      	nopl	(%rax,%rax)
  400760:      	movq	%r13, %rdx
  400763:      	movq	%r14, %rsi
  400766:      	movl	%r15d, %edi
  400769:      	callq	*(%r12,%rbx,8)
  40076d:      	addq	$0x1, %rbx
  400771:      	cmpq	%rbp, %rbx
  400774:      	jne	0x400760 <__libc_csu_init+0x40>
  400776:      	addq	$0x8, %rsp
  40077a:      	popq	%rbx
  40077b:      	popq	%rbp
  40077c:      	popq	%r12
  40077e:      	popq	%r13
  400780:      	popq	%r14
  400782:      	popq	%r15
  400784:      	retq
  400785:      	nopw	%cs:(%rax,%rax)

0000000000400790 <__libc_csu_fini>:
  400790:      	rep		retq

Disassembly of section .fini:

0000000000400794 <_fini>:
  400794:      	subq	$0x8, %rsp
  400798:      	addq	$0x8, %rsp
  40079c:      	retq
```
