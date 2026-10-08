# ELF RE report: `08_testing/isPrime-broken2`

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
| `__FRAME_END__` | STT_OBJECT | STB_LOCAL | .eh_frame | 0x400990 | 0 |
| `_fini` | STT_FUNC | STB_GLOBAL | .fini | 0x4007a4 | 0 |
| `__do_global_dtors_aux_fini_array_entry` | STT_OBJECT | STB_LOCAL | .fini_array | 0x600e18 | 0 |
| `_GLOBAL_OFFSET_TABLE_` | STT_OBJECT | STB_LOCAL | .got.plt | 0x601000 | 0 |
| `_init` | STT_FUNC | STB_GLOBAL | .init | 0x400478 | 0 |
| `__frame_dummy_init_array_entry` | STT_OBJECT | STB_LOCAL | .init_array | 0x600e10 | 0 |
| `__init_array_start` | STT_NOTYPE | STB_LOCAL | .init_array | 0x600e10 | 0 |
| `__init_array_end` | STT_NOTYPE | STB_LOCAL | .init_array | 0x600e18 | 0 |
| `__JCR_LIST__` | STT_OBJECT | STB_LOCAL | .jcr | 0x600e20 | 0 |
| `__JCR_END__` | STT_OBJECT | STB_LOCAL | .jcr | 0x600e20 | 0 |
| `_IO_stdin_used` | STT_OBJECT | STB_GLOBAL | .rodata | 0x4007b0 | 4 |
| `main` | STT_FUNC | STB_GLOBAL | .text | 0x400500 | 234 |
| `_start` | STT_FUNC | STB_GLOBAL | .text | 0x4005ea | 0 |
| `deregister_tm_clones` | STT_FUNC | STB_LOCAL | .text | 0x400620 | 0 |
| `register_tm_clones` | STT_FUNC | STB_LOCAL | .text | 0x400650 | 0 |
| `__do_global_dtors_aux` | STT_FUNC | STB_LOCAL | .text | 0x400690 | 0 |
| `frame_dummy` | STT_FUNC | STB_LOCAL | .text | 0x4006b0 | 0 |
| `isPrime` | STT_FUNC | STB_GLOBAL | .text | 0x4006e0 | 67 |
| `__libc_csu_init` | STT_FUNC | STB_GLOBAL | .text | 0x400730 | 101 |
| `__libc_csu_fini` | STT_FUNC | STB_GLOBAL | .text | 0x4007a0 | 2 |

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
- `+0x40`  "Ooops, %s does not seem to be a number!\n"
- `+0x70`  "%ld is prime\n"
- `+0x7e`  "%ld is not prime\n"

## String literals grouped by referencing function

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/08_testing/isPrime-broken2:	file format elf64-x86-64

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
  40050a:      	movl	$0x4007b8, %edi         # imm = 0x4007B8
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
  400546:      	je	0x4005ac <main+0xac>
  400548:      	cmpb	$0x0, (%rax)
  40054b:      	jne	0x4005ac <main+0xac>
  40054d:      	cmpq	$0x1, %rdi
  400551:      	jle	0x400591 <main+0x91>
  400553:      	cmpq	$0x2, %rdi
  400557:      	je	0x4005cb <main+0xcb>
  400559:      	testb	$0x1, %dil
  40055d:      	je	0x4005e6 <main+0xe6>
  400563:      	movl	$0x2, %ecx
  400568:      	jmp	0x40057d <main+0x7d>
  40056a:      	nopw	(%rax,%rax)
  400570:      	movq	%rdi, %rax
  400573:      	cqto
  400575:      	idivq	%rcx
  400578:      	testq	%rdx, %rdx
  40057b:      	je	0x4005e6 <main+0xe6>
  40057d:      	addq	$0x1, %rcx
  400581:      	cmpq	%rdi, %rcx
  400584:      	jne	0x400570 <main+0x70>
  400586:      	movl	$0x1, %eax
  40058b:      	cmpq	$0x64, %rdi
  40058f:      	jle	0x4005c7 <main+0xc7>
  400591:      	movq	%rdi, %rdx
  400594:      	movl	$0x40082e, %esi         # imm = 0x40082E
  400599:      	movl	$0x1, %edi
  40059e:      	xorl	%eax, %eax
  4005a0:      	callq	0x4004f0 <__printf_chk@plt>
  4005a5:      	xorl	%eax, %eax
  4005a7:      	jmp	0x400519 <main+0x19>
  4005ac:      	movl	$0x4007f0, %esi         # imm = 0x4007F0
  4005b1:      	movl	$0x1, %edi
  4005b6:      	xorl	%eax, %eax
  4005b8:      	callq	0x4004f0 <__printf_chk@plt>
  4005bd:      	movl	$0x1, %eax
  4005c2:      	jmp	0x400519 <main+0x19>
  4005c7:      	testl	%eax, %eax
  4005c9:      	je	0x400591 <main+0x91>
  4005cb:      	movq	%rdi, %rdx
  4005ce:      	movl	$0x400820, %esi         # imm = 0x400820
  4005d3:      	movl	$0x1, %edi
  4005d8:      	xorl	%eax, %eax
  4005da:      	callq	0x4004f0 <__printf_chk@plt>
  4005df:      	xorl	%eax, %eax
  4005e1:      	jmp	0x400519 <main+0x19>
  4005e6:      	xorl	%eax, %eax
  4005e8:      	jmp	0x40058b <main+0x8b>

00000000004005ea <_start>:
  4005ea:      	xorl	%ebp, %ebp
  4005ec:      	movq	%rdx, %r9
  4005ef:      	popq	%rsi
  4005f0:      	movq	%rsp, %rdx
  4005f3:      	andq	$-0x10, %rsp
  4005f7:      	pushq	%rax
  4005f8:      	pushq	%rsp
  4005f9:      	movq	$0x4007a0, %r8          # imm = 0x4007A0
  400600:      	movq	$0x400730, %rcx         # imm = 0x400730
  400607:      	movq	$0x400500, %rdi         # imm = 0x400500
  40060e:      	callq	0x4004c0 <__libc_start_main@plt>
  400613:      	hlt
  400614:      	nopw	%cs:(%rax,%rax)
  40061e:      	nop

0000000000400620 <deregister_tm_clones>:
  400620:      	movl	$0x601057, %eax         # imm = 0x601057
  400625:      	pushq	%rbp
  400626:      	subq	$0x601050, %rax         # imm = 0x601050
  40062c:      	cmpq	$0xe, %rax
  400630:      	movq	%rsp, %rbp
  400633:      	ja	0x400637 <deregister_tm_clones+0x17>
  400635:      	popq	%rbp
  400636:      	retq
  400637:      	movl	$0x0, %eax
  40063c:      	testq	%rax, %rax
  40063f:      	je	0x400635 <deregister_tm_clones+0x15>
  400641:      	popq	%rbp
  400642:      	movl	$0x601050, %edi         # imm = 0x601050
  400647:      	jmpq	*%rax
  400649:      	nopl	(%rax)

0000000000400650 <register_tm_clones>:
  400650:      	movl	$0x601050, %eax         # imm = 0x601050
  400655:      	pushq	%rbp
  400656:      	subq	$0x601050, %rax         # imm = 0x601050
  40065c:      	sarq	$0x3, %rax
  400660:      	movq	%rsp, %rbp
  400663:      	movq	%rax, %rdx
  400666:      	shrq	$0x3f, %rdx
  40066a:      	addq	%rdx, %rax
  40066d:      	sarq	%rax
  400670:      	jne	0x400674 <register_tm_clones+0x24>
  400672:      	popq	%rbp
  400673:      	retq
  400674:      	movl	$0x0, %edx
  400679:      	testq	%rdx, %rdx
  40067c:      	je	0x400672 <register_tm_clones+0x22>
  40067e:      	popq	%rbp
  40067f:      	movq	%rax, %rsi
  400682:      	movl	$0x601050, %edi         # imm = 0x601050
  400687:      	jmpq	*%rdx
  400689:      	nopl	(%rax)

0000000000400690 <__do_global_dtors_aux>:
  400690:      	cmpb	$0x0, 0x2009b9(%rip)    # 0x601050 <completed.6973>
  400697:      	jne	0x4006aa <__do_global_dtors_aux+0x1a>
  400699:      	pushq	%rbp
  40069a:      	movq	%rsp, %rbp
  40069d:      	callq	0x400620 <deregister_tm_clones>
  4006a2:      	popq	%rbp
  4006a3:      	movb	$0x1, 0x2009a6(%rip)    # 0x601050 <completed.6973>
  4006aa:      	rep		retq
  4006ac:      	nopl	(%rax)

00000000004006b0 <frame_dummy>:
  4006b0:      	cmpq	$0x0, 0x200768(%rip)    # 0x600e20 <__JCR_LIST__>
  4006b8:      	je	0x4006d8 <frame_dummy+0x28>
  4006ba:      	movl	$0x0, %eax
  4006bf:      	testq	%rax, %rax
  4006c2:      	je	0x4006d8 <frame_dummy+0x28>
  4006c4:      	pushq	%rbp
  4006c5:      	movl	$0x600e20, %edi         # imm = 0x600E20
  4006ca:      	movq	%rsp, %rbp
  4006cd:      	callq	*%rax
  4006cf:      	popq	%rbp
  4006d0:      	jmp	0x400650 <register_tm_clones>
  4006d5:      	nopl	(%rax)
  4006d8:      	jmp	0x400650 <register_tm_clones>
  4006dd:      	nopl	(%rax)

00000000004006e0 <isPrime>:
  4006e0:      	cmpq	$0x1, %rdi
  4006e4:      	jle	0x400720 <isPrime+0x40>
  4006e6:      	cmpq	$0x2, %rdi
  4006ea:      	je	0x400716 <isPrime+0x36>
  4006ec:      	testb	$0x1, %dil
  4006f0:      	je	0x400720 <isPrime+0x40>
  4006f2:      	movl	$0x2, %ecx
  4006f7:      	jmp	0x40070d <isPrime+0x2d>
  4006f9:      	nopl	(%rax)
  400700:      	movq	%rdi, %rax
  400703:      	cqto
  400705:      	idivq	%rcx
  400708:      	testq	%rdx, %rdx
  40070b:      	je	0x400720 <isPrime+0x40>
  40070d:      	addq	$0x1, %rcx
  400711:      	cmpq	%rdi, %rcx
  400714:      	jne	0x400700 <isPrime+0x20>
  400716:      	movl	$0x1, %eax
  40071b:      	retq
  40071c:      	nopl	(%rax)
  400720:      	xorl	%eax, %eax
  400722:      	retq
  400723:      	nopw	%cs:(%rax,%rax)
  40072d:      	nopl	(%rax)

0000000000400730 <__libc_csu_init>:
  400730:      	pushq	%r15
  400732:      	movl	%edi, %r15d
  400735:      	pushq	%r14
  400737:      	movq	%rsi, %r14
  40073a:      	pushq	%r13
  40073c:      	movq	%rdx, %r13
  40073f:      	pushq	%r12
  400741:      	leaq	0x2006c8(%rip), %r12    # 0x600e10 <__init_array_start>
  400748:      	pushq	%rbp
  400749:      	leaq	0x2006c8(%rip), %rbp    # 0x600e18 <__do_global_dtors_aux_fini_array_entry>
  400750:      	pushq	%rbx
  400751:      	subq	%r12, %rbp
  400754:      	xorl	%ebx, %ebx
  400756:      	sarq	$0x3, %rbp
  40075a:      	subq	$0x8, %rsp
  40075e:      	callq	0x400478 <_init>
  400763:      	testq	%rbp, %rbp
  400766:      	je	0x400786 <__libc_csu_init+0x56>
  400768:      	nopl	(%rax,%rax)
  400770:      	movq	%r13, %rdx
  400773:      	movq	%r14, %rsi
  400776:      	movl	%r15d, %edi
  400779:      	callq	*(%r12,%rbx,8)
  40077d:      	addq	$0x1, %rbx
  400781:      	cmpq	%rbp, %rbx
  400784:      	jne	0x400770 <__libc_csu_init+0x40>
  400786:      	addq	$0x8, %rsp
  40078a:      	popq	%rbx
  40078b:      	popq	%rbp
  40078c:      	popq	%r12
  40078e:      	popq	%r13
  400790:      	popq	%r14
  400792:      	popq	%r15
  400794:      	retq
  400795:      	nopw	%cs:(%rax,%rax)

00000000004007a0 <__libc_csu_fini>:
  4007a0:      	rep		retq

Disassembly of section .fini:

00000000004007a4 <_fini>:
  4007a4:      	subq	$0x8, %rsp
  4007a8:      	addq	$0x8, %rsp
  4007ac:      	retq
```
