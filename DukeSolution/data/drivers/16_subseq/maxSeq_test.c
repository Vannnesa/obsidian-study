/*
 * Reconstructed grader driver for 16_subseq -- "our test main", the main the
 * original grader linked the student's maxSeq.o against.
 *
 * CONFIDENCE: inferred.  No teacher object survives for this assignment:
 * re/elf/16_subseq__maxSeq.o.{md,json} is the student's *own* maxSeq.c
 * compiled by the course Makefile (defined symbol `maxSeq`, imported `puts`),
 * not a grader driver, and 16_subseq/ holds no other object.  Everything here
 * is reasoned from two observed artifacts:
 *
 * 1. re/original-grade-txt/16_subseq.grade.txt, verbatim:
 *
 *      Attempting to compile maxSeq.c
 *      Linking your object file with our test main
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
 *       printed "array size:%d was Correct" itself.  Note there is no
 *       testcase1: maxSeq.c defines no main, so the original's "run your own
 *       main" step was skipped and the remaining cases kept their numbering.
 *       The config therefore sets no `selfTest`.
 *
 * 2. 16_subseq/README (the student-facing contract):
 *
 *      size_t maxSeq(int * array, size_t n);
 *      "returns the length of the maximum increasing contiguous subsequence
 *       in the array ... the series consisting of one element is considered
 *       an increasing sequence of length 1."
 *
 * Usage: ./maxSeq 0|1|100|5000
 *
 * Exit status is 0 when the case is correct and 1 when it is not, so a wrong
 * answer fails on both the output comparison and the exit status.
 *
 * Build note: the config declares `"sources": []` and this driver #includes
 * the student's maxSeq.c.  maxSeq.c has no main() of its own, but the rename
 * below keeps a main() a student may have left there for their own testing
 * from colliding with this driver's.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define main providedMain
#include "maxSeq.c"
#undef main

/* ------------------------------------------------------------------------ *
 * The reference answer, written independently of the student's code:
 * the longest run of strictly increasing neighbours (0 for an empty array).
 * ------------------------------------------------------------------------ */

static size_t referenceMaxSeq(const int * array, size_t n) {
  size_t best = 0;
  size_t run = 0;
  for (size_t i = 0; i < n; i++) {
    if (i > 0 && array[i] > array[i - 1]) {
      run++;
    } else {
      run = 1;
    }
    if (run > best) {
      best = run;
    }
  }
  return best;
}

/* Small values on purpose: they make long, short and repeated runs common,
   so the "maximum" part of the contract is exercised at every size. */
static unsigned long rng;

static void seed(void) {
  rng = 20240307UL;                     /* the original run's date */
}

static int nextValue(void) {
  rng = (rng * 1103515245UL + 12345UL) & 0x7fffffffUL;
  return (int)(rng % 10UL);
}

static int caseSize(int n) {
  int dummy = 0;
  int * array = &dummy;
  size_t expected;
  size_t got;

  if (n > 0) {
    array = malloc(sizeof(*array) * (size_t)n);
    if (array == NULL) {
      fprintf(stderr, "driver: out of memory for %d elements\n", n);
      return 2;
    }
    seed();
    for (int i = 0; i < n; i++) {
      array[i] = nextValue();
    }
  }

  expected = referenceMaxSeq(array, (size_t)n);
  got = maxSeq(array, (size_t)n);

  if (n > 0) {
    free(array);
  }

  printf("array size:%d was %s\n", n, (got == expected) ? "Correct" : "Incorrect");
  return (got == expected) ? 0 : 1;
}

int main(int argc, char ** argv) {
  if (argc != 2) {
    fprintf(stderr, "usage: %s <array size>\n", argv[0]);
    return 2;
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
