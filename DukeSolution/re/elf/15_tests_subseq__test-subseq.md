# ELF RE report: `15_tests_subseq/test-subseq`

- size: 16728 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_DYN
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0 GCC: (Ubuntu 5.4.0-6ubuntu1~16.04.4) 5.4.0 20160609`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `crtstuff.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `test-subseq.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `subseq.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `crtstuff.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `completed.8060` | STT_OBJECT | STB_LOCAL | .bss | 0x4010 | 1 |
| `__bss_start` | STT_NOTYPE | STB_GLOBAL | .bss | 0x4010 | 0 |
| `_end` | STT_NOTYPE | STB_GLOBAL | .bss | 0x4018 | 0 |
| `data_start` | STT_NOTYPE | STB_WEAK | .data | 0x4000 | 0 |
| `__data_start` | STT_NOTYPE | STB_GLOBAL | .data | 0x4000 | 0 |
| `__dso_handle` | STT_OBJECT | STB_GLOBAL | .data | 0x4008 | 0 |
| `_edata` | STT_NOTYPE | STB_GLOBAL | .data | 0x4010 | 0 |
| `__TMC_END__` | STT_OBJECT | STB_GLOBAL | .data | 0x4010 | 0 |
| `_DYNAMIC` | STT_OBJECT | STB_LOCAL | .dynamic | 0x3db8 | 0 |
| `__FRAME_END__` | STT_OBJECT | STB_LOCAL | .eh_frame | 0x224c | 0 |
| `__GNU_EH_FRAME_HDR` | STT_NOTYPE | STB_LOCAL | .eh_frame_hdr | 0x20d4 | 0 |
| `_fini` | STT_FUNC | STB_GLOBAL | .fini | 0x17e8 | 0 |
| `__do_global_dtors_aux_fini_array_entry` | STT_OBJECT | STB_LOCAL | .fini_array | 0x3db0 | 0 |
| `_GLOBAL_OFFSET_TABLE_` | STT_OBJECT | STB_LOCAL | .got | 0x3fa8 | 0 |
| `_init` | STT_FUNC | STB_LOCAL | .init | 0x1000 | 0 |
| `__frame_dummy_init_array_entry` | STT_OBJECT | STB_LOCAL | .init_array | 0x3da8 | 0 |
| `__init_array_start` | STT_NOTYPE | STB_LOCAL | .init_array | 0x3da8 | 0 |
| `__init_array_end` | STT_NOTYPE | STB_LOCAL | .init_array | 0x3db0 | 0 |
| `_IO_stdin_used` | STT_OBJECT | STB_GLOBAL | .rodata | 0x2000 | 4 |
| `_start` | STT_FUNC | STB_GLOBAL | .text | 0x1070 | 47 |
| `deregister_tm_clones` | STT_FUNC | STB_LOCAL | .text | 0x10a0 | 0 |
| `register_tm_clones` | STT_FUNC | STB_LOCAL | .text | 0x10d0 | 0 |
| `__do_global_dtors_aux` | STT_FUNC | STB_LOCAL | .text | 0x1110 | 0 |
| `frame_dummy` | STT_FUNC | STB_LOCAL | .text | 0x1150 | 0 |
| `main` | STT_FUNC | STB_GLOBAL | .text | 0x1159 | 1353 |
| `subseq_at` | STT_FUNC | STB_GLOBAL | .text | 0x16a2 | 101 |
| `maxSeq` | STT_FUNC | STB_GLOBAL | .text | 0x1707 | 100 |
| `__libc_csu_init` | STT_FUNC | STB_GLOBAL | .text | 0x1770 | 101 |
| `__libc_csu_fini` | STT_FUNC | STB_GLOBAL | .text | 0x17e0 | 5 |

## Undefined (imported) symbols

```
_ITM_deregisterTMCloneTable
puts@@GLIBC_2.2.5
__stack_chk_fail@@GLIBC_2.4
__libc_start_main@@GLIBC_2.2.5
__gmon_start__
exit@@GLIBC_2.2.5
_ITM_registerTMCloneTable
__cxa_finalize@@GLIBC_2.2.5
```

## String literals in .rodata

- `+0x4`  "Failure on array0"
- `+0x16`  "Failure on array1"
- `+0x28`  "Failure on array2 con n=0"
- `+0x42`  "Failure on array2"
- `+0x54`  "Failure on array3"
- `+0x66`  "Failure on array4"
- `+0x78`  "Failure on array5"
- `+0x8a`  "Failure on array6"
- `+0x9c`  "Failure on array7"
- `+0xae`  "Failure on array8"
- `+0xc0`  "Failure on array9"

## String literals grouped by referencing function

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/15_tests_subseq/test-subseq:	file format elf64-x86-64

Disassembly of section .init:

0000000000001000 <_init>:
    1000:      	endbr64
    1004:      	subq	$0x8, %rsp
    1008:      	movq	0x2fd9(%rip), %rax      # 0x3fe8 <_GLOBAL_OFFSET_TABLE_+0x40>
    100f:      	testq	%rax, %rax
    1012:      	je	0x1016 <_init+0x16>
    1014:      	callq	*%rax
    1016:      	addq	$0x8, %rsp
    101a:      	retq

Disassembly of section .plt:

0000000000001020 <.plt>:
    1020:      	pushq	0x2f8a(%rip)            # 0x3fb0 <_GLOBAL_OFFSET_TABLE_+0x8>
    1026:      	jmpq	*0x2f8c(%rip)           # 0x3fb8 <_GLOBAL_OFFSET_TABLE_+0x10>
    102c:      	nopl	(%rax)

0000000000001030 <puts@plt>:
    1030:      	jmpq	*0x2f8a(%rip)           # 0x3fc0 <_GLOBAL_OFFSET_TABLE_+0x18>
    1036:      	pushq	$0x0
    103b:      	jmp	0x1020 <.plt>

0000000000001040 <__stack_chk_fail@plt>:
    1040:      	jmpq	*0x2f82(%rip)           # 0x3fc8 <_GLOBAL_OFFSET_TABLE_+0x20>
    1046:      	pushq	$0x1
    104b:      	jmp	0x1020 <.plt>

0000000000001050 <exit@plt>:
    1050:      	jmpq	*0x2f7a(%rip)           # 0x3fd0 <_GLOBAL_OFFSET_TABLE_+0x28>
    1056:      	pushq	$0x2
    105b:      	jmp	0x1020 <.plt>

Disassembly of section .plt.got:

0000000000001060 <__cxa_finalize@plt>:
    1060:      	jmpq	*0x2f92(%rip)           # 0x3ff8 <_GLOBAL_OFFSET_TABLE_+0x50>
    1066:      	nop

Disassembly of section .text:

0000000000001070 <_start>:
    1070:      	endbr64
    1074:      	xorl	%ebp, %ebp
    1076:      	movq	%rdx, %r9
    1079:      	popq	%rsi
    107a:      	movq	%rsp, %rdx
    107d:      	andq	$-0x10, %rsp
    1081:      	pushq	%rax
    1082:      	pushq	%rsp
    1083:      	leaq	0x756(%rip), %r8        # 0x17e0 <__libc_csu_fini>
    108a:      	leaq	0x6df(%rip), %rcx       # 0x1770 <__libc_csu_init>
    1091:      	leaq	0xc1(%rip), %rdi        # 0x1159 <main>
    1098:      	callq	*0x2f42(%rip)           # 0x3fe0 <_GLOBAL_OFFSET_TABLE_+0x38>
    109e:      	hlt
    109f:      	nop

00000000000010a0 <deregister_tm_clones>:
    10a0:      	leaq	0x2f69(%rip), %rdi      # 0x4010 <completed.8060>
    10a7:      	leaq	0x2f62(%rip), %rax      # 0x4010 <completed.8060>
    10ae:      	cmpq	%rdi, %rax
    10b1:      	je	0x10c8 <deregister_tm_clones+0x28>
    10b3:      	movq	0x2f1e(%rip), %rax      # 0x3fd8 <_GLOBAL_OFFSET_TABLE_+0x30>
    10ba:      	testq	%rax, %rax
    10bd:      	je	0x10c8 <deregister_tm_clones+0x28>
    10bf:      	jmpq	*%rax
    10c1:      	nopl	(%rax)
    10c8:      	retq
    10c9:      	nopl	(%rax)

00000000000010d0 <register_tm_clones>:
    10d0:      	leaq	0x2f39(%rip), %rdi      # 0x4010 <completed.8060>
    10d7:      	leaq	0x2f32(%rip), %rsi      # 0x4010 <completed.8060>
    10de:      	subq	%rdi, %rsi
    10e1:      	movq	%rsi, %rax
    10e4:      	shrq	$0x3f, %rsi
    10e8:      	sarq	$0x3, %rax
    10ec:      	addq	%rax, %rsi
    10ef:      	sarq	%rsi
    10f2:      	je	0x1108 <register_tm_clones+0x38>
    10f4:      	movq	0x2ef5(%rip), %rax      # 0x3ff0 <_GLOBAL_OFFSET_TABLE_+0x48>
    10fb:      	testq	%rax, %rax
    10fe:      	je	0x1108 <register_tm_clones+0x38>
    1100:      	jmpq	*%rax
    1102:      	nopw	(%rax,%rax)
    1108:      	retq
    1109:      	nopl	(%rax)

0000000000001110 <__do_global_dtors_aux>:
    1110:      	endbr64
    1114:      	cmpb	$0x0, 0x2ef5(%rip)      # 0x4010 <completed.8060>
    111b:      	jne	0x1148 <__do_global_dtors_aux+0x38>
    111d:      	pushq	%rbp
    111e:      	cmpq	$0x0, 0x2ed2(%rip)      # 0x3ff8 <_GLOBAL_OFFSET_TABLE_+0x50>
    1126:      	movq	%rsp, %rbp
    1129:      	je	0x1137 <__do_global_dtors_aux+0x27>
    112b:      	movq	0x2ed6(%rip), %rdi      # 0x4008 <__dso_handle>
    1132:      	callq	0x1060 <__cxa_finalize@plt>
    1137:      	callq	0x10a0 <deregister_tm_clones>
    113c:      	movb	$0x1, 0x2ecd(%rip)      # 0x4010 <completed.8060>
    1143:      	popq	%rbp
    1144:      	retq
    1145:      	nopl	(%rax)
    1148:      	retq
    1149:      	nopl	(%rax)

0000000000001150 <frame_dummy>:
    1150:      	endbr64
    1154:      	jmp	0x10d0 <register_tm_clones>

0000000000001159 <main>:
    1159:      	endbr64
    115d:      	pushq	%rbp
    115e:      	movq	%rsp, %rbp
    1161:      	subq	$0x1a0, %rsp            # imm = 0x1A0
    1168:      	movq	%fs:0x28, %rax
    1171:      	movq	%rax, -0x8(%rbp)
    1175:      	xorl	%eax, %eax
    1177:      	movl	$0x2, -0x194(%rbp)
    1181:      	movl	$0x0, -0x18c(%rbp)
    118b:      	movl	$0x0, -0x188(%rbp)
    1195:      	movl	$0x0, -0x184(%rbp)
    119f:      	movl	$0x0, -0x190(%rbp)
    11a9:      	movl	$0x1, -0x180(%rbp)
    11b3:      	movl	$0x2, -0x17c(%rbp)
    11bd:      	movl	$0x3, -0x178(%rbp)
    11c7:      	movl	$0x1, -0x174(%rbp)
    11d1:      	movl	$0x2, -0x170(%rbp)
    11db:      	movl	$0x3, -0x16c(%rbp)
    11e5:      	movl	$0x1, -0x168(%rbp)
    11ef:      	movl	$0x2, -0x164(%rbp)
    11f9:      	movl	$0x3, -0x160(%rbp)
    1203:      	movl	$0x1, -0x15c(%rbp)
    120d:      	movl	$0x1, -0x150(%rbp)
    1217:      	movl	$0x2, -0x14c(%rbp)
    1221:      	movl	$0x1, -0x148(%rbp)
    122b:      	movl	$0x3, -0x144(%rbp)
    1235:      	movl	$0x5, -0x140(%rbp)
    123f:      	movl	$0x7, -0x13c(%rbp)
    1249:      	movl	$0x2, -0x138(%rbp)
    1253:      	movl	$0x4, -0x134(%rbp)
    125d:      	movl	$0x6, -0x130(%rbp)
    1267:      	movl	$0x9, -0x12c(%rbp)
    1271:      	movl	$0x1, -0x120(%rbp)
    127b:      	movl	$0x3, -0x11c(%rbp)
    1285:      	movl	$0x6, -0x118(%rbp)
    128f:      	movl	$0x8, -0x114(%rbp)
    1299:      	movl	$0x1, -0x110(%rbp)
    12a3:      	movl	$0x2, -0x10c(%rbp)
    12ad:      	movl	$0x4, -0x108(%rbp)
    12b7:      	movl	$0x1, -0x104(%rbp)
    12c1:      	movl	$0x63, -0x100(%rbp)
    12cb:      	movl	$0x0, -0xfc(%rbp)
    12d5:      	movl	$0x1, -0xf0(%rbp)
    12df:      	movl	$0x3, -0xec(%rbp)
    12e9:      	movl	$0x6, -0xe8(%rbp)
    12f3:      	movl	$0x8, -0xe4(%rbp)
    12fd:      	movl	$0x3, -0xe0(%rbp)
    1307:      	movl	$0x2, -0xdc(%rbp)
    1311:      	movl	$0x3, -0xd8(%rbp)
    131b:      	movl	$0x4, -0xd4(%rbp)
    1325:      	movl	$0xa, -0xd0(%rbp)
    132f:      	movl	$0x63, -0xcc(%rbp)
    1339:      	movq	$0x0, -0xc0(%rbp)
    1344:      	movq	$0x0, -0xb8(%rbp)
    134f:      	movq	$0x0, -0xb0(%rbp)
    135a:      	movq	$0x0, -0xa8(%rbp)
    1365:      	movq	$0x0, -0xa0(%rbp)
    1370:      	movl	$0xa, -0x90(%rbp)
    137a:      	movl	$0x9, -0x8c(%rbp)
    1384:      	movl	$0x8, -0x88(%rbp)
    138e:      	movl	$0x7, -0x84(%rbp)
    1398:      	movl	$0x6, -0x80(%rbp)
    139f:      	movl	$0x5, -0x7c(%rbp)
    13a6:      	movl	$0x4, -0x78(%rbp)
    13ad:      	movl	$0x3, -0x74(%rbp)
    13b4:      	movl	$0x2, -0x70(%rbp)
    13bb:      	movl	$0x1, -0x6c(%rbp)
    13c2:      	movl	$0xfffffffd, -0x60(%rbp) # imm = 0xFFFFFFFD
    13c9:      	movl	$0xfffffffe, -0x5c(%rbp) # imm = 0xFFFFFFFE
    13d0:      	movl	$0xffffffff, -0x58(%rbp) # imm = 0xFFFFFFFF
    13d7:      	movl	$0x0, -0x54(%rbp)
    13de:      	movl	$0x1, -0x50(%rbp)
    13e5:      	movl	$0x2, -0x4c(%rbp)
    13ec:      	movl	$0x3, -0x48(%rbp)
    13f3:      	movl	$0x0, -0x44(%rbp)
    13fa:      	movl	$0x0, -0x40(%rbp)
    1401:      	movl	$0x0, -0x3c(%rbp)
    1408:      	movl	$0x0, -0x30(%rbp)
    140f:      	movl	$0x1, -0x2c(%rbp)
    1416:      	movl	$0x2, -0x28(%rbp)
    141d:      	movl	$0xfffffffd, -0x24(%rbp) # imm = 0xFFFFFFFD
    1424:      	movl	$0xfffffffc, -0x20(%rbp) # imm = 0xFFFFFFFC
    142b:      	movl	$0xfffffffb, -0x1c(%rbp) # imm = 0xFFFFFFFB
    1432:      	movl	$0x0, -0x18(%rbp)
    1439:      	movl	$0x0, -0x14(%rbp)
    1440:      	movl	$0x0, -0x10(%rbp)
    1447:      	movl	$0x0, -0xc(%rbp)
    144e:      	leaq	-0x194(%rbp), %rax
    1455:      	movl	$0x1, %esi
    145a:      	movq	%rax, %rdi
    145d:      	callq	0x1707 <maxSeq>
    1462:      	cmpq	$0x1, %rax
    1466:      	je	0x147e <main+0x325>
    1468:      	leaq	0xb95(%rip), %rdi       # 0x2004 <_IO_stdin_used+0x4>
    146f:      	callq	0x1030 <puts@plt>
    1474:      	movl	$0x1, %edi
    1479:      	callq	0x1050 <exit@plt>
    147e:      	leaq	-0x18c(%rbp), %rax
    1485:      	movl	$0x3, %esi
    148a:      	movq	%rax, %rdi
    148d:      	callq	0x1707 <maxSeq>
    1492:      	cmpq	$0x1, %rax
    1496:      	je	0x14ae <main+0x355>
    1498:      	leaq	0xb77(%rip), %rdi       # 0x2016 <_IO_stdin_used+0x16>
    149f:      	callq	0x1030 <puts@plt>
    14a4:      	movl	$0x1, %edi
    14a9:      	callq	0x1050 <exit@plt>
    14ae:      	leaq	-0x190(%rbp), %rax
    14b5:      	movl	$0x0, %esi
    14ba:      	movq	%rax, %rdi
    14bd:      	callq	0x1707 <maxSeq>
    14c2:      	testq	%rax, %rax
    14c5:      	je	0x14dd <main+0x384>
    14c7:      	leaq	0xb5a(%rip), %rdi       # 0x2028 <_IO_stdin_used+0x28>
    14ce:      	callq	0x1030 <puts@plt>
    14d3:      	movl	$0x1, %edi
    14d8:      	callq	0x1050 <exit@plt>
    14dd:      	leaq	-0x190(%rbp), %rax
    14e4:      	movl	$0x1, %esi
    14e9:      	movq	%rax, %rdi
    14ec:      	callq	0x1707 <maxSeq>
    14f1:      	cmpq	$0x1, %rax
    14f5:      	je	0x150d <main+0x3b4>
    14f7:      	leaq	0xb44(%rip), %rdi       # 0x2042 <_IO_stdin_used+0x42>
    14fe:      	callq	0x1030 <puts@plt>
    1503:      	movl	$0x1, %edi
    1508:      	callq	0x1050 <exit@plt>
    150d:      	leaq	-0x180(%rbp), %rax
    1514:      	movl	$0xa, %esi
    1519:      	movq	%rax, %rdi
    151c:      	callq	0x1707 <maxSeq>
    1521:      	cmpq	$0x3, %rax
    1525:      	je	0x153d <main+0x3e4>
    1527:      	leaq	0xb26(%rip), %rdi       # 0x2054 <_IO_stdin_used+0x54>
    152e:      	callq	0x1030 <puts@plt>
    1533:      	movl	$0x1, %edi
    1538:      	callq	0x1050 <exit@plt>
    153d:      	leaq	-0x150(%rbp), %rax
    1544:      	movl	$0xa, %esi
    1549:      	movq	%rax, %rdi
    154c:      	callq	0x1707 <maxSeq>
    1551:      	cmpq	$0x4, %rax
    1555:      	je	0x156d <main+0x414>
    1557:      	leaq	0xb08(%rip), %rdi       # 0x2066 <_IO_stdin_used+0x66>
    155e:      	callq	0x1030 <puts@plt>
    1563:      	movl	$0x1, %edi
    1568:      	callq	0x1050 <exit@plt>
    156d:      	leaq	-0x120(%rbp), %rax
    1574:      	movl	$0xa, %esi
    1579:      	movq	%rax, %rdi
    157c:      	callq	0x1707 <maxSeq>
    1581:      	cmpq	$0x4, %rax
    1585:      	je	0x159d <main+0x444>
    1587:      	leaq	0xaea(%rip), %rdi       # 0x2078 <_IO_stdin_used+0x78>
    158e:      	callq	0x1030 <puts@plt>
    1593:      	movl	$0x1, %edi
    1598:      	callq	0x1050 <exit@plt>
    159d:      	leaq	-0xf0(%rbp), %rax
    15a4:      	movl	$0xa, %esi
    15a9:      	movq	%rax, %rdi
    15ac:      	callq	0x1707 <maxSeq>
    15b1:      	cmpq	$0x5, %rax
    15b5:      	je	0x15cd <main+0x474>
    15b7:      	leaq	0xacc(%rip), %rdi       # 0x208a <_IO_stdin_used+0x8a>
    15be:      	callq	0x1030 <puts@plt>
    15c3:      	movl	$0x1, %edi
    15c8:      	callq	0x1050 <exit@plt>
    15cd:      	leaq	-0xc0(%rbp), %rax
    15d4:      	movl	$0xa, %esi
    15d9:      	movq	%rax, %rdi
    15dc:      	callq	0x1707 <maxSeq>
    15e1:      	cmpq	$0x1, %rax
    15e5:      	je	0x15fd <main+0x4a4>
    15e7:      	leaq	0xaae(%rip), %rdi       # 0x209c <_IO_stdin_used+0x9c>
    15ee:      	callq	0x1030 <puts@plt>
    15f3:      	movl	$0x1, %edi
    15f8:      	callq	0x1050 <exit@plt>
    15fd:      	leaq	-0x90(%rbp), %rax
    1604:      	movl	$0xa, %esi
    1609:      	movq	%rax, %rdi
    160c:      	callq	0x1707 <maxSeq>
    1611:      	cmpq	$0x1, %rax
    1615:      	je	0x162d <main+0x4d4>
    1617:      	leaq	0xa90(%rip), %rdi       # 0x20ae <_IO_stdin_used+0xae>
    161e:      	callq	0x1030 <puts@plt>
    1623:      	movl	$0x1, %edi
    1628:      	callq	0x1050 <exit@plt>
    162d:      	leaq	-0x60(%rbp), %rax
    1631:      	movl	$0xa, %esi
    1636:      	movq	%rax, %rdi
    1639:      	callq	0x1707 <maxSeq>
    163e:      	cmpq	$0x7, %rax
    1642:      	je	0x165a <main+0x501>
    1644:      	leaq	0xa75(%rip), %rdi       # 0x20c0 <_IO_stdin_used+0xc0>
    164b:      	callq	0x1030 <puts@plt>
    1650:      	movl	$0x1, %edi
    1655:      	callq	0x1050 <exit@plt>
    165a:      	leaq	-0x30(%rbp), %rax
    165e:      	movl	$0xa, %esi
    1663:      	movq	%rax, %rdi
    1666:      	callq	0x1707 <maxSeq>
    166b:      	cmpq	$0x3, %rax
    166f:      	je	0x1687 <main+0x52e>
    1671:      	leaq	0xa48(%rip), %rdi       # 0x20c0 <_IO_stdin_used+0xc0>
    1678:      	callq	0x1030 <puts@plt>
    167d:      	movl	$0x1, %edi
    1682:      	callq	0x1050 <exit@plt>
    1687:      	movl	$0x0, %eax
    168c:      	movq	-0x8(%rbp), %rdx
    1690:      	xorq	%fs:0x28, %rdx
    1699:      	je	0x16a0 <main+0x547>
    169b:      	callq	0x1040 <__stack_chk_fail@plt>
    16a0:      	leave
    16a1:      	retq

00000000000016a2 <subseq_at>:
    16a2:      	pushq	%rbp
    16a3:      	movq	%rsp, %rbp
    16a6:      	movq	%rdi, -0x18(%rbp)
    16aa:      	movq	%rsi, -0x20(%rbp)
    16ae:      	movq	%rdx, -0x28(%rbp)
    16b2:      	movq	-0x20(%rbp), %rax
    16b6:      	addq	$0x1, %rax
    16ba:      	movq	%rax, -0x8(%rbp)
    16be:      	jmp	0x16c5 <subseq_at+0x23>
    16c0:      	addq	$0x1, -0x8(%rbp)
    16c5:      	movq	-0x8(%rbp), %rax
    16c9:      	cmpq	-0x28(%rbp), %rax
    16cd:      	jae	0x16fd <subseq_at+0x5b>
    16cf:      	movq	-0x8(%rbp), %rax
    16d3:      	leaq	(,%rax,4), %rdx
    16db:      	movq	-0x18(%rbp), %rax
    16df:      	addq	%rdx, %rax
    16e2:      	movl	(%rax), %edx
    16e4:      	movq	-0x8(%rbp), %rax
    16e8:      	shlq	$0x2, %rax
    16ec:      	leaq	-0x4(%rax), %rcx
    16f0:      	movq	-0x18(%rbp), %rax
    16f4:      	addq	%rcx, %rax
    16f7:      	movl	(%rax), %eax
    16f9:      	cmpl	%eax, %edx
    16fb:      	jg	0x16c0 <subseq_at+0x1e>
    16fd:      	movq	-0x8(%rbp), %rax
    1701:      	subq	-0x20(%rbp), %rax
    1705:      	popq	%rbp
    1706:      	retq

0000000000001707 <maxSeq>:
    1707:      	pushq	%rbp
    1708:      	movq	%rsp, %rbp
    170b:      	subq	$0x30, %rsp
    170f:      	movq	%rdi, -0x28(%rbp)
    1713:      	movq	%rsi, -0x30(%rbp)
    1717:      	movq	$0x0, -0x18(%rbp)
    171f:      	movq	$0x0, -0x10(%rbp)
    1727:      	jmp	0x175b <maxSeq+0x54>
    1729:      	movq	-0x30(%rbp), %rdx
    172d:      	movq	-0x10(%rbp), %rcx
    1731:      	movq	-0x28(%rbp), %rax
    1735:      	movq	%rcx, %rsi
    1738:      	movq	%rax, %rdi
    173b:      	callq	0x16a2 <subseq_at>
    1740:      	movq	%rax, -0x8(%rbp)
    1744:      	movq	-0x8(%rbp), %rax
    1748:      	cmpq	-0x18(%rbp), %rax
    174c:      	jbe	0x1756 <maxSeq+0x4f>
    174e:      	movq	-0x8(%rbp), %rax
    1752:      	movq	%rax, -0x18(%rbp)
    1756:      	addq	$0x1, -0x10(%rbp)
    175b:      	movq	-0x10(%rbp), %rax
    175f:      	cmpq	-0x30(%rbp), %rax
    1763:      	jb	0x1729 <maxSeq+0x22>
    1765:      	movq	-0x18(%rbp), %rax
    1769:      	leave
    176a:      	retq
    176b:      	nopl	(%rax,%rax)

0000000000001770 <__libc_csu_init>:
    1770:      	endbr64
    1774:      	pushq	%r15
    1776:      	leaq	0x262b(%rip), %r15      # 0x3da8 <__init_array_start>
    177d:      	pushq	%r14
    177f:      	movq	%rdx, %r14
    1782:      	pushq	%r13
    1784:      	movq	%rsi, %r13
    1787:      	pushq	%r12
    1789:      	movl	%edi, %r12d
    178c:      	pushq	%rbp
    178d:      	leaq	0x261c(%rip), %rbp      # 0x3db0 <__do_global_dtors_aux_fini_array_entry>
    1794:      	pushq	%rbx
    1795:      	subq	%r15, %rbp
    1798:      	subq	$0x8, %rsp
    179c:      	callq	0x1000 <_init>
    17a1:      	sarq	$0x3, %rbp
    17a5:      	je	0x17c6 <__libc_csu_init+0x56>
    17a7:      	xorl	%ebx, %ebx
    17a9:      	nopl	(%rax)
    17b0:      	movq	%r14, %rdx
    17b3:      	movq	%r13, %rsi
    17b6:      	movl	%r12d, %edi
    17b9:      	callq	*(%r15,%rbx,8)
    17bd:      	addq	$0x1, %rbx
    17c1:      	cmpq	%rbx, %rbp
    17c4:      	jne	0x17b0 <__libc_csu_init+0x40>
    17c6:      	addq	$0x8, %rsp
    17ca:      	popq	%rbx
    17cb:      	popq	%rbp
    17cc:      	popq	%r12
    17ce:      	popq	%r13
    17d0:      	popq	%r14
    17d2:      	popq	%r15
    17d4:      	retq
    17d5:      	nopw	%cs:(%rax,%rax)

00000000000017e0 <__libc_csu_fini>:
    17e0:      	endbr64
    17e4:      	retq

Disassembly of section .fini:

00000000000017e8 <_fini>:
    17e8:      	endbr64
    17ec:      	subq	$0x8, %rsp
    17f0:      	addq	$0x8, %rsp
    17f4:      	retq
```
