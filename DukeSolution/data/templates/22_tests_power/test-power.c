/*
 * 22_tests_power -- test-power.c
 *
 * Write your tests for
 *
 *     unsigned power(unsigned x, unsigned y);
 *
 * here.  The implementation is linked in separately, so write the prototype
 * after the #includes and before any other code you write.
 *
 * Contract, from the assignment README and from the provided run_all.sh:
 *
 *   - exit with EXIT_SUCCESS when every test passes;
 *   - exit with EXIT_FAILURE as soon as one test fails, e.g.
 *
 *         exit(EXIT_FAILURE);
 *
 * The README suggests a helper such as
 *
 *     void run_check(unsigned x, unsigned y, unsigned expected_ans)
 *
 * which calls power, compares the result with expected_ans and, when they
 * differ, prints a message and exits with EXIT_FAILURE.  You need to supply
 * the expected answers yourself -- there is no direct way to invoke the
 * correct implementation.
 */

#include <stdio.h>
#include <stdlib.h>

/* Write the prototype of power here. */
unsigned power(unsigned x, unsigned y);

int main(void) {
  /* TODO: check power on a range of bases and exponents, including the
   * corner cases 0 and 1 and the wrap-around behaviour of unsigned
   * arithmetic.  Exit with EXIT_FAILURE on the first mismatch. */

  return EXIT_SUCCESS;
}
