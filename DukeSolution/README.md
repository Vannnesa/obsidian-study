# git-homework

杜克大学 Coursera 专项课程《Introductory C Programming》的本地评分工具的Bun+TypeScript复刻。

[English](README_en.md) | 中文

## 安装

需要 [Bun](https://bun.sh) 和一个 C 编译器。(不能使用MSVC)

```bash
git clone https://github.com/Vannnesa/DukeSolution ~/DukeSolution
cd ~/DukeSolution
bun src/index.ts install
```


`bun src/index.ts install` 可以跳过。但是不能被安装到PATH中随处调用，只能在DukeSolution里运行`bun grade init path/to/your/dir`来初始化。

## 使用

```console
$ cd ~
$ grade init
Workspace ready: /Users/you/duke-homework

Your first assignment is 00_hello/:
  README
  hello.txt

$ cd ~/duke-homework/00_hello
$ grade
Your file did not match the expected output
Your file is 0 bytes; the expected file is 6 bytes
Expected:
hello

Got:

Overall Grade: FAILED
```

感谢同名的DukeSolution提供了完美作业案例，基于此，我给写出的代码与标准范例对比，自动生成diff.txt 并且生成下一个作业文件夹。

```
Overall Grade: PASSED
Your code is in answer/user_code/; the reference is in answer/reference/.
Read answer/diff.txt to see how your solution differs.

Your next assignment is ready: 01_apple/
```

`grade init` 默认在当前目录建工作区。如果你正好在~没传任何目录参数，它会生成一个 `~/duke-homework`文件夹，以防文件散落在~目录里。

### 命令

```
grade                 给当前作业评分
grade init [目录]     建工作区并发第一个作业
grade status          哪些做完了、当前在哪、哪些还没解锁
grade list            列出全部作业和各自的评分方式
grade new <作业号>    把某个作业复制进工作区
grade check           校验所有配置
grade install         把 grade 装进 PATH
grade uninstall       卸载
grade doctor          检查运行需要的东西齐不齐
```

`grade` 在作业目录里、工作区根目录、或者它们下面任意一层子目录里都能跑。进度存在工作区的 `.grade/state.json`，`grade status` 读的就是它。

### 通过和失败

通过时会在作业目录里生成 `grade.txt`，建一个 `answer/` 文件夹（里面是你的代码、标准答案、以及两者的逐行对比），再把下一个作业放到旁边。

失败时只写 `grade.txt`，里面指明哪个用例没过，把期望输出和你实际的输出并排显示。不会解锁任何东西。

退出码：`0` 通过，`1` 失败，`3`:未知错误，`2`:用法或配置有问题。

## 检查

绝大多数作业会被编译、运行，然后把程序输出和预先存好的期望输出逐字节比对。你的源代码不参与比对，所以实现方式不同没关系，只要行为一致就能过。

只有三个作业比对文件内容：`00_hello`、`01_apple`、`10_gdb`。它们要交的都是内容固定的数据文件，比对字节本来就是全部要求。

有五个作业在这里评不了，会返回 `NOT GRADED`。它们要把学生写的代码跟一堆故意写错的程序做对比，而那些程序当年放在评分机的 `/usr/local/l2p` 目录里，没能保留下来。工具会直说，不会瞎猜。细节写在 `REVERSE_ENGINEERING.md`。

## 跨平台兼容性

支持macOS 和 Linux 。Windows 需要有一个兼容 gcc 的编译器，MSVC 的 `cl` 不行，因为作业是按 gcc 的参数写的。

内存检查类的作业跑在 AddressSanitizer 上。Linux 上还会跑 valgrind，那是原版课程用的工具。macOS 上既没有 valgrind 也没有 LeakSanitizer，所以工具改用苹果的 `leaks` 做检查


出问题先跑这个：

```console
$ grade doctor
  ok    package          /Users/you/DukeSolution
  ok    bun              /opt/homebrew/bin/bun
  ok    C compiler       /usr/bin/cc
  ok    grade on PATH    /opt/homebrew/bin/grade
  ok    leak checker     /usr/bin/leaks (ASan + leaks)
  ok    line endings     .gitattributes present (no EOL conversion)
```

## 目录结构

```
data/configs/     每个作业一个 JSON，说明怎么评分
data/templates/   每个作业开始时的样子
data/drivers/     逆向重建的测试驱动，C 源码
data/reference/   只有源码的标准答案
src/              工具本身
re/               反推过程的证据
tools/            反推和验证脚本
upstream/         原始的那 42 个已完成作业（不进 git，体积大）
```

## 开发

```bash
bun test tests/          # 62 个单元和端到端测试
bun run check            # 校验所有配置
bunx tsc --noEmit        # 类型检查

./tools/check.sh         # 以上全部，外加语料完整性检查
./tools/check.sh --full  # 把 42 个作业重新评一遍，跟 2024 年的结果对比
./tools/demo.sh 05_squares
```

## 许可

MIT，见 `LICENSE`。

`data/` 和 `upstream/` 下的作业说明、模板和标准答案来自杜克大学的 Coursera 课程，收录于此仅供学习使用。
