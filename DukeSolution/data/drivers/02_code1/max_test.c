/*
 * Reconstructed grader driver for 02_code1 -- the "our own main" the original
 * grader linked in after removing the student's main().
 *
 * CONFIDENCE: inferred.  No teacher object for this assignment exists anywhere
 * in the workspace (02_code1/ holds only the student's code1.c, its README,
 * test.sh and grade.txt; re/elf/ has no 02_code1 entry).  The case list, the
 * wording and the report dialect are observed; the driver body is inferred.
 *
 * 1. re/original-grade-txt/02_code1.grade.txt, verbatim:
 *
 *      Checking code1.c for legal syntax
 *      Checking for int max (int num1, int num2)
 *      Found on line 3, column 1
 *      Checking for int main(void)
 *      Found on line 10, column 1
 *      Trying to run the code..
 *      Your file matched the expected output
 *      Removing your main() and replacing it with our own to run more tests...
 *      Testing max(-999, -2147483648) ... Correct
 *      Testing max(-999, 123) ... Correct
 *      ... 64 lines in all ...
 *      Testing max(2147483647, 123123123) ... Correct
 *
 *    => one process per (x, y) pair, whose stdout is exactly
 *       "Testing max(<x>, <y>) ... Correct", i.e. the report's `inline`
 *       dialect.  The x values are -999, -87, 0, 1, 240, 345, 999999,
 *       2147483647 and the y values are -2147483648, 123, 567, 891, 0, 1,
 *       -999, 123123123, in that order, giving the 8 x 8 = 64 cases the
 *       original printed.
 *
 * 2. 02_code1/README and 02_code1/test.sh: the function to write is
 *    `int max (int num1, int num2)`; the README says "In max, the algorithm is
 *    written as comments", and test.sh prepends <stdio.h> and <stdlib.h> to
 *    code1.c before compiling it, which is why the original's reported line
 *    numbers are two higher than the file's own.
 *
 * The driver prints the student's answer as "max(x, y) is <result>" so the
 * stored expected output records the value for every case, and it exits
 * non-zero when that answer is not the larger of the two arguments.
 *
 * Build note: the config declares `"sources": []` and this driver #includes
 * code1.c.  <stdio.h> is included first because the student's file has no
 * includes of its own -- exactly what test.sh does by concatenating a two-line
 * header in front of code1.c.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* test.sh prepends these two headers; the driver keeps that behaviour. */
#define main providedMain
#include "code1.c"
#undef main

int main(int argc, char ** argv) {
  if (argc != 3) {
    fprintf(stderr, "usage: %s <num1> <num2>\n", argv[0]);
    return 2;
  }
  {
    char * end = NULL;
    long x = strtol(argv[1], &end, 10);
    if (end == argv[1] || *end != '\0') {
      fprintf(stderr, "driver: bad num1 \"%s\"\n", argv[1]);
      return 2;
    }
    long y = strtol(argv[2], &end, 10);
    if (end == argv[2] || *end != '\0') {
      fprintf(stderr, "driver: bad num2 \"%s\"\n", argv[2]);
      return 2;
    }
    {
      int expected = (x > y) ? (int)x : (int)y;   /* the grader's own answer */
      int got = max((int)x, (int)y);
      printf("max(%ld, %ld) is %d\n", x, y, got);
      return (got == expected) ? 0 : 1;
    }
  }
}
