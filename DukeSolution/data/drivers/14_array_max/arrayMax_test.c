/*
 * Reconstructed grader driver for 14_array_max -- the "our own main" the
 * original grader linked in after removing the student's main().
 *
 * CONFIDENCE: inferred.  No teacher-supplied object for this assignment
 * survives anywhere in the workspace (14_array_max/ holds only the student's
 * arrayMax.c, the Makefile, the binary and grade.txt; re/elf/ has no
 * 14_array_max entry), so nothing here is recovered from ELF.  Everything
 * below is reasoned from two observed artifacts:
 *
 * 1. re/original-grade-txt/14_array_max.grade.txt, verbatim:
 *
 *      Attempting to compile arrayMax.c
 *      #################################################
 *      testcase1:
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
 *    => the original driver was invoked once per array size (0, 1, 100, 5000)
 *       and printed "array size:%d was Correct" itself; the grader only turned
 *       that per-testcase output into a pass/fail verdict.  testcase1 ran the
 *       student's own program; the config's `selfTest` reproduces that half and
 *       case "main" below re-runs the same provided main through this driver.
 *
 * 2. 14_array_max/README (the student-facing contract):
 *
 *      int * arrayMax(int * array, int n);
 *      "...returns a pointer to the largest element in the array passed in
 *       (whose length is n).  If the array has no elements (n is 0), this
 *       function should return NULL."
 *      "We have provided a main function ... You should get 99, -3, 425,
 *       NULL, and NULL for the 5 test provided."
 *
 * Usage (one case per process, exactly as the original did):
 *
 *      ./arrayMax main          the provided main, renamed but intact
 *      ./arrayMax 0|1|100|5000  one array size, checked in-driver
 *
 * Exit status is 0 when the case is correct and 1 when it is not, so a wrong
 * answer fails on both the output comparison and the exit status.
 *
 * Build note: the config declares `"sources": []` and this driver #includes
 * the student's arrayMax.c, because that file already contains a main().  The
 * include is how the original's "removing your main()" step is expressed in C:
 * the provided main() is renamed, never deleted, so case "main" can still run
 * it.  It also keeps `selfTest` (which compiles the file standalone) working,
 * which a -Dmain=... compile flag would not.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define main providedMain
#include "arrayMax.c"
#undef main

/* ------------------------------------------------------------------------ *
 * case "main": the provided main, exactly as the student left it.  A student
 * who modified or deleted it fails here (and, for a modification, in the
 * config's selfTest as well).
 * ------------------------------------------------------------------------ */

static int caseMain(void) {
  return providedMain();
}

/* ------------------------------------------------------------------------ *
 * case "<n>": one array size, with the reference answer computed here.
 * The values come from a fixed seed, so the case is reproducible and the
 * largest element is not simply the first or the last one.
 * ------------------------------------------------------------------------ */

static unsigned long rng;

static void seed(void) {
  rng = 20240305UL;                     /* the original run's date */
}

static int nextValue(void) {
  rng = (rng * 1103515245UL + 12345UL) & 0x7fffffffUL;
  return (int)(rng % 2000003UL) - 1000000;
}

static int caseSize(int n) {
  int dummy = 0;
  int * array = &dummy;
  int ok;

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

  if (n == 0) {
    /* "If the array has no elements (n is 0), this function should return
       NULL."  A live pointer is passed on purpose: an implementation that
       forgets the n == 0 case must not be rescued by a NULL array. */
    ok = (arrayMax(array, 0) == NULL);
  } else {
    int max = array[0];
    for (int i = 1; i < n; i++) {
      if (array[i] > max) {
        max = array[i];
      }
    }
    int * p = arrayMax(array, n);
    /* Any pointer to an element holding the maximum is correct. */
    ok = (p != NULL) && (*p == max) && (p >= array) && (p < array + n);
  }

  if (n > 0) {
    free(array);
  }

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
