/*
 * 15_tests_subseq -- test-subseq.c
 *
 * Write your tests for
 *
 *     size_t maxSeq(int * array, size_t n);
 *
 * here.  maxSeq returns the length of the longest strictly increasing
 * *contiguous* subsequence of `array` (0 when n is 0).
 *
 * Contract, from the assignment README and from the provided run_all.sh:
 *
 *   - exit with EXIT_SUCCESS when every test passes;
 *   - exit with EXIT_FAILURE as soon as one test fails.
 *
 * run_all.sh links this file against each implementation in turn and checks
 * that the correct one is accepted and that every broken one is rejected.  A
 * test that prints something before failing makes the failure readable, e.g.
 *
 *     if (maxSeq(array, n) != expected) {
 *       printf("Failure on ...\n");
 *       exit(EXIT_FAILURE);
 *     }
 *
 * HINT (README): vary not just the values in the array but the size as well --
 * and think about how the values change over time.
 */

#include <stdio.h>
#include <stdlib.h>

/* Write the prototype of maxSeq here, after the #includes and before any
 * other code you write: the implementation is linked in separately. */
size_t maxSeq(int *array, size_t n);

int main(void) {
  /* TODO: build a set of arrays and sizes that pins down maxSeq's behaviour,
   * call maxSeq on each one, and exit(EXIT_FAILURE) on the first mismatch. */

  return EXIT_SUCCESS;
}
