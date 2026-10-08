/*
 * Reconstructed grader driver for 19_bits_arr -- the "our own main" the
 * original grader linked in after removing the student's main().
 *
 * CONFIDENCE: inferred.  No teacher object survives for this assignment
 * (re/elf/ has no 19_bits_arr entry; the directory holds only the student's
 * numToBits.c, its Makefile, the linked binary and grade.txt).  Everything
 * here is reasoned from observed artifacts:
 *
 * 1. re/original-grade-txt/19_bits_arr.grade.txt, verbatim:
 *
 *      Attempting to compile numToBits.c
 *      Your file matched the expected output
 *      Your output matched what we expected
 *      Removing your main() and replacing it with our own to run more tests...
 *      #################################################
 *      testcase2:
 *      array size:0 was Correct
 *      #################################################
 *      testcase3:
 *      array size:1 was Correct
 *      #################################################
 *      testcase4:
 *      array size:100 was Correct
 *      #################################################
 *      testcase5:
 *      array size:5000 was Correct
 *
 *    => the driver was invoked once per array size (0, 1, 100, 5000) and
 *       printed "array size:%d was Correct" itself.  testcase1 ran the
 *       student's own program; the config's `selfTest` reproduces that half and
 *       case "main" below re-runs the provided main through this driver.
 *
 * 2. 19_bits_arr/bits_ans.txt -- the teacher's stored copy of the program's
 *    output (byte-identical to 19_bits_arr/answer.txt), i.e. exactly what the
 *    provided main prints.  `--verify main:19_bits_arr/bits_ans.txt` in
 *    tools/re/gen_expected.py confirmed case "main" reproduces that file byte
 *    for byte, which validates both halves of this reconstruction: the two
 *    doTest tables *and* the "Invalid call to numToBits! nBits is 223,
 *    nNums is 7" line produced by numToBits(array1, 7, bits, 7*32-1).
 *
 * 3. 19_bits_arr/README (the student-facing contract): bits[0] is bit 31 of
 *    nums[0], bits[1] is bit 30 of nums[0], and so on; a call that cannot fit
 *    (nNums * 32 > nBits) must print "Invalid call to numToBits! nBits is %d,
 *    nNums is %d\n" and return without touching bits.
 *
 * Usage (one case per process, exactly as the original did):
 *
 *      ./numToBits main          the provided main, renamed but intact
 *      ./numToBits 0|1|100|5000  one array size, checked in-driver
 *
 * Exit status is 0 when the case is correct and 1 when it is not.
 *
 * Build note: the config declares `"sources": []` and this driver #includes
 * the student's numToBits.c, because that file already contains a main().  The
 * include is how the original's "removing your main()" step is expressed in C:
 * the provided main() is renamed, never deleted, so case "main" can still run
 * it, and `selfTest` (which compiles the file standalone) keeps working.
 */

#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define main providedMain
#include "numToBits.c"
#undef main

/* ------------------------------------------------------------------------ *
 * case "main": the provided main, exactly as the student left it.  The
 * expected output is the teacher's bits_ans.txt, so this is the byte-exact
 * check that no line of the provided main changed.
 * ------------------------------------------------------------------------ */

static int caseMain(void) {
  return providedMain();
}

/* ------------------------------------------------------------------------ *
 * case "<n>": nNums = n, nBits = n * 32 -- exactly enough room, so a valid
 * call must produce no output at all.  The bits are compared against the
 * README's ordering, computed here from the numbers themselves.
 * ------------------------------------------------------------------------ */

static unsigned long rng;
static int rngIndex;

static void seed(void) {
  rng = 20240311UL;                     /* the original run's date */
  rngIndex = 0;
}

static uint32_t nextValue(void) {
  rng = (rng * 1103515245UL + 12345UL) & 0xffffffffUL;
  uint32_t v = (uint32_t)rng;
  /* Make sure the most significant bit is exercised too. */
  if (rngIndex++ % 3 == 0) {
    v |= 0x80000000UL;
  }
  return v;
}

static int caseSize(int n) {
  uint32_t * nums = NULL;
  int * bits = NULL;
  int ok = 1;

  /* malloc(0) is avoided; nBits is 0 for n == 0 and nothing may be written. */
  bits = malloc(sizeof(*bits) * (size_t)(n > 0 ? n * 32 : 1));
  if (n > 0) {
    nums = malloc(sizeof(*nums) * (size_t)n);
  }
  if (bits == NULL || (n > 0 && nums == NULL)) {
    fprintf(stderr, "driver: out of memory for %d numbers\n", n);
    free(bits);
    free(nums);
    return 2;
  }

  for (int i = 0; i < (n > 0 ? n * 32 : 1); i++) {
    bits[i] = -1;                        /* poison: unwritten bits stay wrong */
  }
  seed();
  for (int i = 0; i < n; i++) {
    nums[i] = nextValue();
  }

  numToBits(nums, n, bits, n * 32);

  for (int i = 0; i < n && ok; i++) {
    for (int j = 0; j < 32; j++) {
      int expected = (int)((nums[i] >> (31 - j)) & 1u);
      if (bits[i * 32 + j] != expected) {
        ok = 0;
        break;
      }
    }
  }

  free(bits);
  free(nums);
  printf("array size:%d was %s\n", n, ok ? "Correct" : "Incorrect");
  return ok ? 0 : 1;
}

int main(int argc, char ** argv) {
  if (argc != 2) {
    fprintf(stderr, "usage: %s main|<array size>\n", argv[0]);
    return 2;
  }
  if (strcmp(argv[1], "main") == 0) {
    return caseMain();
  }
  {
    char * end = NULL;
    long n = strtol(argv[1], &end, 10);
    if (end == argv[1] || *end != '\0' || n < 0 || n > 1000000L) {
      fprintf(stderr, "driver: bad array size \"%s\"\n", argv[1]);
      return 2;
    }
    return caseSize((int)n);
  }
}
