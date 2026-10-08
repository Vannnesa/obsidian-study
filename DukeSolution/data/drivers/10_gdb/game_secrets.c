/*
 * game_secrets.c -- the two functions 10_gdb/game.c declares but does not define.
 *
 * Provenance (see configs/10_gdb.json for the full argument):
 *
 *   getSecretNumber  recovered from the shipped Linux x86-64 `game` binary,
 *                    which is unstripped and carries debug_info:
 *                        movl $0x1badf00d, %eax
 *                        retq
 *   getOtherSN       recovered from the same binary:
 *                        subq $8, %rsp ; xorl %eax,%eax ; callq srand@plt
 *                        addq $8, %rsp ; jmp random@plt
 *                    i.e. `srand(which); return random();`
 *
 * `random()` here is glibc's, not the host library's. The shipped binary was
 * built on Ubuntu 14.04 with gcc 4.8.4 (see re/elf/10_gdb__game.md -- the
 * workspace's other, student-produced objects are gcc 9.3.0), and glibc's
 * random() is the additive-feedback generator TYPE_3 in every version since:
 * a 31-entry state, separation 3, and ten times the degree -- 310 values --
 * discarded after seeding. macOS uses the same trinomial but a different
 * seeding, and therefore produces a different `total`, so the generator is
 * reimplemented below (after glibc stdlib/random_r.c) to make the recovered
 * behaviour portable.
 *
 * Validation, both against 10_gdb/input.txt -- the submission the 2024 grader
 * passed:
 *   - linking this file with 10_gdb/game.c and running it with that file on
 *     stdin prints the winning transcript the README quotes;
 *   - the XOR loop in game.c's main over getOtherSN(0 .. 5678) yields
 *     938257400, which is that file's second line (the first line, 464384013,
 *     is 0x1badf00d from the disassembly above).
 *
 * This file is evidence, not the grader: configs/10_gdb.json grades input.txt
 * by byte comparison, which is what the 2024 report shape shows the original
 * grader doing. It is the driver to use if that check is ever turned into a
 * behavioural one (`build.driver` + `tests[].stdinFile: "input.txt"`).
 */
#include <stdint.h>

#define GLIBC_DEG 31
#define GLIBC_SEP 3

static int32_t state[GLIBC_DEG];
static int fptr, rptr;

static int glibc_random(void) {
  uint32_t val = (uint32_t)state[fptr] + (uint32_t)state[rptr];
  int32_t result = (int32_t)(val >> 1);
  state[fptr] = (int32_t)val;
  fptr++;
  if (fptr >= GLIBC_DEG) {
    fptr = 0;
    rptr++;
  } else {
    rptr++;
    if (rptr >= GLIBC_DEG) rptr = 0;
  }
  return result;
}

static void glibc_srandom(unsigned int seed) {
  if (seed == 0) seed = 1; /* glibc: a zero seed is replaced by 1 */
  state[0] = (int32_t)seed;
  int32_t word = (int32_t)seed;
  for (int i = 1; i < GLIBC_DEG; i++) {
    long hi = word / 127773;
    long lo = word % 127773;
    word = (int32_t)(16807 * lo - 2836 * hi);
    if (word < 0) word += 2147483647;
    state[i] = word;
  }
  fptr = GLIBC_SEP;
  rptr = 0;
  for (int k = GLIBC_DEG * 10; --k >= 0;) (void)glibc_random();
}

int getSecretNumber(void) {
  return 0x1badf00d; /* 464384013 */
}

int getOtherSN(int which) {
  glibc_srandom((unsigned int)which);
  return glibc_random();
}
