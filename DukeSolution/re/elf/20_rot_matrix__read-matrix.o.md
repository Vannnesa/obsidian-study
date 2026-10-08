# ELF RE report: `20_rot_matrix/read-matrix.o`

- size: 3592 bytes
- machine: EM_X86_64 (EM_X86_64=62), type: ET_REL
- producer: `GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0`

## Defined symbols

| symbol | type | bind | section | addr | size |
|---|---|---|---|---|---|
| `read-matrix.c` | STT_FILE | STB_LOCAL |  | 0x0 | 0 |
| `readLine` | STT_FUNC | STB_GLOBAL | .text | 0x0 | 200 |
| `main` | STT_FUNC | STB_GLOBAL | .text | 0xc8 | 492 |

## Undefined (imported) symbols

```
_GLOBAL_OFFSET_TABLE_
fgetc
stderr
fwrite
exit
fprintf
fopen
fclose
rotate
putchar
__stack_chk_fail
```

## String literals in .rodata

- `+0x0`  "Invalid input: line is too short\n"
- `+0x28`  "Invalid input: unexpected EOF\n"
- `+0x48`  "Invalid input: Line is too long\n"
- `+0x69`  "Usage: rotateMatrix input\n"
- `+0x86`  "Could not open %s\n"
- `+0xa0`  "Invalid input: file is too long (read %d instead of EOF)\n"

## String literals grouped by referencing function

### `readLine`

- "Invalid input: line is too short\n"
- "Invalid input: unexpected EOF\n"
- "Invalid input: Line is too long\n"

### `main`

- "Usage: rotateMatrix input\n"
- "r"
- "Could not open %s\n"
- "Invalid input: file is too long (read %d instead of EOF)\n"

## DWARF

### Line table

## Disassembly

```asm

/Users/chendezhenga/Obsidian/Study_副本/DukeSolution/20_rot_matrix/read-matrix.o:	file format elf64-x86-64

Disassembly of section .text:

0000000000000000 <readLine>:
       0:      	endbr64
       4:      	pushq	%rbp
       5:      	movq	%rsp, %rbp
       8:      	subq	$0x20, %rsp
       c:      	movq	%rdi, -0x18(%rbp)
      10:      	movq	%rsi, -0x20(%rbp)
      14:      	movq	$0x0, -0x8(%rbp)
      1c:      	jmp	0x72 <readLine+0x72>
      1e:      	movq	-0x18(%rbp), %rax
      22:      	movq	%rax, %rdi
      25:      	callq	0x2a <readLine+0x2a>
;   fgetc+-4
      2a:      	movl	%eax, -0xc(%rbp)
      2d:      	cmpl	$0xa, -0xc(%rbp)
      31:      	jne	0x5d <readLine+0x5d>
      33:      	movq	(%rip), %rax            # 0x3a <readLine+0x3a>
;   stderr+-4
      3a:      	movq	%rax, %rcx
      3d:      	movl	$0x21, %edx
      42:      	movl	$0x1, %esi
      47:      	leaq	(%rip), %rdi            # 0x4e <readLine+0x4e>
;   .rodata -> "Invalid input: line is too short\n"
      4e:      	callq	0x53 <readLine+0x53>
;   fwrite+-4
      53:      	movl	$0x1, %edi
      58:      	callq	0x5d <readLine+0x5d>
;   exit+-4
      5d:      	movq	-0x20(%rbp), %rdx
      61:      	movq	-0x8(%rbp), %rax
      65:      	addq	%rdx, %rax
      68:      	movl	-0xc(%rbp), %edx
      6b:      	movb	%dl, (%rax)
      6d:      	addq	$0x1, -0x8(%rbp)
      72:      	cmpq	$0x9, -0x8(%rbp)
      77:      	jbe	0x1e <readLine+0x1e>
      79:      	movq	-0x18(%rbp), %rax
      7d:      	movq	%rax, %rdi
      80:      	callq	0x85 <readLine+0x85>
;   fgetc+-4
      85:      	movl	%eax, -0xc(%rbp)
      88:      	cmpl	$0xa, -0xc(%rbp)
      8c:      	je	0xc5 <readLine+0xc5>
      8e:      	cmpl	$-0x1, -0xc(%rbp)
      92:      	jne	0x9d <readLine+0x9d>
      94:      	leaq	(%rip), %rax            # 0x9b <readLine+0x9b>
;   .rodata -> "Invalid input: unexpected EOF\n"
      9b:      	jmp	0xa4 <readLine+0xa4>
      9d:      	leaq	(%rip), %rax            # 0xa4 <readLine+0xa4>
;   .rodata -> "Invalid input: Line is too long\n"
      a4:      	movq	(%rip), %rdx            # 0xab <readLine+0xab>
;   stderr+-4
      ab:      	movq	%rax, %rsi
      ae:      	movq	%rdx, %rdi
      b1:      	movl	$0x0, %eax
      b6:      	callq	0xbb <readLine+0xbb>
;   fprintf+-4
      bb:      	movl	$0x1, %edi
      c0:      	callq	0xc5 <readLine+0xc5>
;   exit+-4
      c5:      	nop
      c6:      	leave
      c7:      	retq

00000000000000c8 <main>:
      c8:      	endbr64
      cc:      	pushq	%rbp
      cd:      	movq	%rsp, %rbp
      d0:      	subq	$0xb0, %rsp
      d7:      	movl	%edi, -0xa4(%rbp)
      dd:      	movq	%rsi, -0xb0(%rbp)
      e4:      	movq	%fs:0x28, %rax
      ed:      	movq	%rax, -0x8(%rbp)
      f1:      	xorl	%eax, %eax
      f3:      	cmpl	$0x2, -0xa4(%rbp)
      fa:      	je	0x126 <main+0x5e>
      fc:      	movq	(%rip), %rax            # 0x103 <main+0x3b>
;   stderr+-4
     103:      	movq	%rax, %rcx
     106:      	movl	$0x1a, %edx
     10b:      	movl	$0x1, %esi
     110:      	leaq	(%rip), %rdi            # 0x117 <main+0x4f>
;   .rodata -> "Usage: rotateMatrix input\n"
     117:      	callq	0x11c <main+0x54>
;   fwrite+-4
     11c:      	movl	$0x1, %eax
     121:      	jmp	0x29e <main+0x1d6>
     126:      	movq	-0xb0(%rbp), %rax
     12d:      	addq	$0x8, %rax
     131:      	movq	(%rax), %rax
     134:      	leaq	(%rip), %rsi            # 0x13b <main+0x73>
;   .rodata -> "r"
     13b:      	movq	%rax, %rdi
     13e:      	callq	0x143 <main+0x7b>
;   fopen+-4
     143:      	movq	%rax, -0x78(%rbp)
     147:      	cmpq	$0x0, -0x78(%rbp)
     14c:      	jne	0x181 <main+0xb9>
     14e:      	movq	-0xb0(%rbp), %rax
     155:      	addq	$0x8, %rax
     159:      	movq	(%rax), %rdx
     15c:      	movq	(%rip), %rax            # 0x163 <main+0x9b>
;   stderr+-4
     163:      	leaq	(%rip), %rsi            # 0x16a <main+0xa2>
;   .rodata -> "Could not open %s\n"
     16a:      	movq	%rax, %rdi
     16d:      	movl	$0x0, %eax
     172:      	callq	0x177 <main+0xaf>
;   fprintf+-4
     177:      	movl	$0x1, %eax
     17c:      	jmp	0x29e <main+0x1d6>
     181:      	movq	$0x0, -0x90(%rbp)
     18c:      	jmp	0x1c1 <main+0xf9>
     18e:      	leaq	-0x70(%rbp), %rcx
     192:      	movq	-0x90(%rbp), %rdx
     199:      	movq	%rdx, %rax
     19c:      	shlq	$0x2, %rax
     1a0:      	addq	%rdx, %rax
     1a3:      	addq	%rax, %rax
     1a6:      	leaq	(%rcx,%rax), %rdx
     1aa:      	movq	-0x78(%rbp), %rax
     1ae:      	movq	%rdx, %rsi
     1b1:      	movq	%rax, %rdi
     1b4:      	callq	0x1b9 <main+0xf1>
;   readLine+-4
     1b9:      	addq	$0x1, -0x90(%rbp)
     1c1:      	cmpq	$0x9, -0x90(%rbp)
     1c9:      	jbe	0x18e <main+0xc6>
     1cb:      	movq	-0x78(%rbp), %rax
     1cf:      	movq	%rax, %rdi
     1d2:      	callq	0x1d7 <main+0x10f>
;   fgetc+-4
     1d7:      	movl	%eax, -0x94(%rbp)
     1dd:      	cmpl	$-0x1, -0x94(%rbp)
     1e4:      	je	0x211 <main+0x149>
     1e6:      	movq	(%rip), %rax            # 0x1ed <main+0x125>
;   stderr+-4
     1ed:      	movl	-0x94(%rbp), %edx
     1f3:      	leaq	(%rip), %rsi            # 0x1fa <main+0x132>
;   .rodata -> "Invalid input: file is too long (read %d instead of EOF)\n"
     1fa:      	movq	%rax, %rdi
     1fd:      	movl	$0x0, %eax
     202:      	callq	0x207 <main+0x13f>
;   fprintf+-4
     207:      	movl	$0x1, %eax
     20c:      	jmp	0x29e <main+0x1d6>
     211:      	movq	-0x78(%rbp), %rax
     215:      	movq	%rax, %rdi
     218:      	callq	0x21d <main+0x155>
;   fclose+-4
     21d:      	leaq	-0x70(%rbp), %rax
     221:      	movq	%rax, %rdi
     224:      	callq	0x229 <main+0x161>
;   rotate+-4
     229:      	movq	$0x0, -0x88(%rbp)
     234:      	jmp	0x28f <main+0x1c7>
     236:      	movq	$0x0, -0x80(%rbp)
     23e:      	jmp	0x276 <main+0x1ae>
     240:      	movq	-0x88(%rbp), %rdx
     247:      	movq	%rdx, %rax
     24a:      	shlq	$0x2, %rax
     24e:      	addq	%rdx, %rax
     251:      	addq	%rax, %rax
     254:      	leaq	(%rbp,%rax), %rdx
     259:      	movq	-0x80(%rbp), %rax
     25d:      	addq	%rdx, %rax
     260:      	subq	$0x70, %rax
     264:      	movzbl	(%rax), %eax
     267:      	movsbl	%al, %eax
     26a:      	movl	%eax, %edi
     26c:      	callq	0x271 <main+0x1a9>
;   putchar+-4
     271:      	addq	$0x1, -0x80(%rbp)
     276:      	cmpq	$0x9, -0x80(%rbp)
     27b:      	jbe	0x240 <main+0x178>
     27d:      	movl	$0xa, %edi
     282:      	callq	0x287 <main+0x1bf>
;   putchar+-4
     287:      	addq	$0x1, -0x88(%rbp)
     28f:      	cmpq	$0x9, -0x88(%rbp)
     297:      	jbe	0x236 <main+0x16e>
     299:      	movl	$0x0, %eax
     29e:      	movq	-0x8(%rbp), %rcx
     2a2:      	xorq	%fs:0x28, %rcx
     2ab:      	je	0x2b2 <main+0x1ea>
     2ad:      	callq	0x2b2 <main+0x1ea>
;   __stack_chk_fail+-4
     2b2:      	leave
     2b3:      	retq
```
