# ELF RE report: `22_tests_power/test-power`

- size: 16720 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_DYN
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0 GCC: (Ubuntu 5.4.0-6ubuntu1~16.04.4) 5.4.0 20160609`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `crtstuff.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `test-power.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `power.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
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
| `__FRAME_END__` | STT_OBJECT | STB_LOCAL | .eh_frame | 0x21ac | 0 |
| `__GNU_EH_FRAME_HDR` | STT_NOTYPE | STB_LOCAL | .eh_frame_hdr | 0x2028 | 0 |
| `_fini` | STT_FUNC | STB_GLOBAL | .fini | 0x1398 | 0 |
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
| `main` | STT_FUNC | STB_GLOBAL | .text | 0x1159 | 321 |
| `ph` | STT_FUNC | STB_GLOBAL | .text | 0x129a | 95 |
| `power` | STT_FUNC | STB_GLOBAL | .text | 0x12f9 | 36 |
| `__libc_csu_init` | STT_FUNC | STB_GLOBAL | .text | 0x1320 | 101 |
| `__libc_csu_fini` | STT_FUNC | STB_GLOBAL | .text | 0x1390 | 5 |

## Undefined (imported) symbols

```
_ITM_deregisterTMCloneTable
__stack_chk_fail@@GLIBC_2.4
printf@@GLIBC_2.2.5
__libc_start_main@@GLIBC_2.2.5
__gmon_start__
exit@@GLIBC_2.2.5
_ITM_registerTMCloneTable
__cxa_finalize@@GLIBC_2.2.5
```

## String literals in .rodata

- `+0x8`  "%d elevado a %d en power da %d\n"

## String literals grouped by referencing function

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/22_tests_power/test-power:	file format elf64-x86-64

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

0000000000001030 <__stack_chk_fail@plt>:
    1030:      	jmpq	*0x2f8a(%rip)           # 0x3fc0 <_GLOBAL_OFFSET_TABLE_+0x18>
    1036:      	pushq	$0x0
    103b:      	jmp	0x1020 <.plt>

0000000000001040 <printf@plt>:
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
    1083:      	leaq	0x306(%rip), %r8        # 0x1390 <__libc_csu_fini>
    108a:      	leaq	0x28f(%rip), %rcx       # 0x1320 <__libc_csu_init>
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
    1161:      	pushq	%rbx
    1162:      	subq	$0x78, %rsp
    1166:      	movq	%fs:0x28, %rax
    116f:      	movq	%rax, -0x18(%rbp)
    1173:      	xorl	%eax, %eax
    1175:      	movl	$0x0, -0x70(%rbp)
    117c:      	movl	$0x1, -0x6c(%rbp)
    1183:      	movl	$0x2, -0x68(%rbp)
    118a:      	movl	$0x3, -0x64(%rbp)
    1191:      	movl	$0x0, -0x60(%rbp)
    1198:      	movl	$0xfffffffe, -0x5c(%rbp) # imm = 0xFFFFFFFE
    119f:      	movl	$0x0, -0x50(%rbp)
    11a6:      	movl	$0x1, -0x4c(%rbp)
    11ad:      	movl	$0x2, -0x48(%rbp)
    11b4:      	movl	$0x3, -0x44(%rbp)
    11bb:      	movl	$0x4, -0x40(%rbp)
    11c2:      	movl	$0x3, -0x3c(%rbp)
    11c9:      	movl	$0x1, -0x30(%rbp)
    11d0:      	movl	$0x1, -0x2c(%rbp)
    11d7:      	movl	$0x4, -0x28(%rbp)
    11de:      	movl	$0x1b, -0x24(%rbp)
    11e5:      	movl	$0x0, -0x20(%rbp)
    11ec:      	movl	$0xfffffff8, -0x1c(%rbp) # imm = 0xFFFFFFF8
    11f3:      	movl	$0x0, -0x74(%rbp)
    11fa:      	jmp	0x1274 <main+0x11b>
    11fc:      	movl	-0x74(%rbp), %eax
    11ff:      	cltq
    1201:      	movl	-0x30(%rbp,%rax,4), %ebx
    1205:      	movl	-0x74(%rbp), %eax
    1208:      	cltq
    120a:      	movl	-0x50(%rbp,%rax,4), %edx
    120e:      	movl	-0x74(%rbp), %eax
    1211:      	cltq
    1213:      	movl	-0x70(%rbp,%rax,4), %eax
    1217:      	movl	%edx, %esi
    1219:      	movl	%eax, %edi
    121b:      	callq	0x12f9 <power>
    1220:      	cmpl	%eax, %ebx
    1222:      	je	0x1270 <main+0x117>
    1224:      	movl	-0x74(%rbp), %eax
    1227:      	cltq
    1229:      	movl	-0x50(%rbp,%rax,4), %edx
    122d:      	movl	-0x74(%rbp), %eax
    1230:      	cltq
    1232:      	movl	-0x70(%rbp,%rax,4), %eax
    1236:      	movl	%edx, %esi
    1238:      	movl	%eax, %edi
    123a:      	callq	0x12f9 <power>
    123f:      	movl	%eax, %ecx
    1241:      	movl	-0x74(%rbp), %eax
    1244:      	cltq
    1246:      	movl	-0x50(%rbp,%rax,4), %edx
    124a:      	movl	-0x74(%rbp), %eax
    124d:      	cltq
    124f:      	movl	-0x70(%rbp,%rax,4), %eax
    1253:      	movl	%eax, %esi
    1255:      	leaq	0xdac(%rip), %rdi       # 0x2008 <_IO_stdin_used+0x8>
    125c:      	movl	$0x0, %eax
    1261:      	callq	0x1040 <printf@plt>
    1266:      	movl	$0x1, %edi
    126b:      	callq	0x1050 <exit@plt>
    1270:      	addl	$0x1, -0x74(%rbp)
    1274:      	cmpl	$0x5, -0x74(%rbp)
    1278:      	jle	0x11fc <main+0xa3>
    127a:      	movl	$0x0, %eax
    127f:      	movq	-0x18(%rbp), %rbx
    1283:      	xorq	%fs:0x28, %rbx
    128c:      	je	0x1293 <main+0x13a>
    128e:      	callq	0x1030 <__stack_chk_fail@plt>
    1293:      	addq	$0x78, %rsp
    1297:      	popq	%rbx
    1298:      	popq	%rbp
    1299:      	retq

000000000000129a <ph>:
    129a:      	pushq	%rbp
    129b:      	movq	%rsp, %rbp
    129e:      	subq	$0x10, %rsp
    12a2:      	movl	%edi, -0x4(%rbp)
    12a5:      	movl	%esi, -0x8(%rbp)
    12a8:      	movl	%edx, -0xc(%rbp)
    12ab:      	cmpl	$0x0, -0x8(%rbp)
    12af:      	jne	0x12b6 <ph+0x1c>
    12b1:      	movl	-0xc(%rbp), %eax
    12b4:      	jmp	0x12f7 <ph+0x5d>
    12b6:      	movl	-0x8(%rbp), %eax
    12b9:      	andl	$0x1, %eax
    12bc:      	testl	%eax, %eax
    12be:      	je	0x12dd <ph+0x43>
    12c0:      	movl	-0xc(%rbp), %eax
    12c3:      	imull	-0x4(%rbp), %eax
    12c7:      	movl	%eax, %edx
    12c9:      	movl	-0x8(%rbp), %eax
    12cc:      	leal	-0x1(%rax), %ecx
    12cf:      	movl	-0x4(%rbp), %eax
    12d2:      	movl	%ecx, %esi
    12d4:      	movl	%eax, %edi
    12d6:      	callq	0x129a <ph>
    12db:      	jmp	0x12f7 <ph+0x5d>
    12dd:      	movl	-0x8(%rbp), %eax
    12e0:      	shrl	%eax
    12e2:      	movl	%eax, %ecx
    12e4:      	movl	-0x4(%rbp), %eax
    12e7:      	imull	-0x4(%rbp), %eax
    12eb:      	movl	-0xc(%rbp), %edx
    12ee:      	movl	%ecx, %esi
    12f0:      	movl	%eax, %edi
    12f2:      	callq	0x129a <ph>
    12f7:      	leave
    12f8:      	retq

00000000000012f9 <power>:
    12f9:      	pushq	%rbp
    12fa:      	movq	%rsp, %rbp
    12fd:      	subq	$0x10, %rsp
    1301:      	movl	%edi, -0x4(%rbp)
    1304:      	movl	%esi, -0x8(%rbp)
    1307:      	movl	-0x8(%rbp), %ecx
    130a:      	movl	-0x4(%rbp), %eax
    130d:      	movl	$0x1, %edx
    1312:      	movl	%ecx, %esi
    1314:      	movl	%eax, %edi
    1316:      	callq	0x129a <ph>
    131b:      	leave
    131c:      	retq
    131d:      	nopl	(%rax)

0000000000001320 <__libc_csu_init>:
    1320:      	endbr64
    1324:      	pushq	%r15
    1326:      	leaq	0x2a7b(%rip), %r15      # 0x3da8 <__init_array_start>
    132d:      	pushq	%r14
    132f:      	movq	%rdx, %r14
    1332:      	pushq	%r13
    1334:      	movq	%rsi, %r13
    1337:      	pushq	%r12
    1339:      	movl	%edi, %r12d
    133c:      	pushq	%rbp
    133d:      	leaq	0x2a6c(%rip), %rbp      # 0x3db0 <__do_global_dtors_aux_fini_array_entry>
    1344:      	pushq	%rbx
    1345:      	subq	%r15, %rbp
    1348:      	subq	$0x8, %rsp
    134c:      	callq	0x1000 <_init>
    1351:      	sarq	$0x3, %rbp
    1355:      	je	0x1376 <__libc_csu_init+0x56>
    1357:      	xorl	%ebx, %ebx
    1359:      	nopl	(%rax)
    1360:      	movq	%r14, %rdx
    1363:      	movq	%r13, %rsi
    1366:      	movl	%r12d, %edi
    1369:      	callq	*(%r15,%rbx,8)
    136d:      	addq	$0x1, %rbx
    1371:      	cmpq	%rbx, %rbp
    1374:      	jne	0x1360 <__libc_csu_init+0x40>
    1376:      	addq	$0x8, %rsp
    137a:      	popq	%rbx
    137b:      	popq	%rbp
    137c:      	popq	%r12
    137e:      	popq	%r13
    1380:      	popq	%r14
    1382:      	popq	%r15
    1384:      	retq
    1385:      	nopw	%cs:(%rax,%rax)

0000000000001390 <__libc_csu_fini>:
    1390:      	endbr64
    1394:      	retq

Disassembly of section .fini:

0000000000001398 <_fini>:
    1398:      	endbr64
    139c:      	subq	$0x8, %rsp
    13a0:      	addq	$0x8, %rsp
    13a4:      	retq
```
