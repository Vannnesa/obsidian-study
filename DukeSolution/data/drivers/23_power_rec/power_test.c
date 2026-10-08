/*
 * Reconstructed grader driver for 23_power_rec -- "our main", the main the
 * original grader compiled power.o with.
 *
 * CONFIDENCE: inferred.  23_power_rec/test-power.o IS present, but it is not
 * the grader's main: re/elf/23_power_rec__test-power.o.md and its .rodata show
 * it is a compilation of 22_tests_power/test-power.c (format string
 * "%d elevado a %d en power da %d", the six int constants
 * a[] = {0,1,2,3,0,-2}, b[] = {0,1,2,3,4,3}, res[] = {1,1,4,27,0,-8}), i.e.
 * the student's own harness from the previous assignment, which the README
 * tells them to symlink in.  No grader object exists anywhere in the
 * workspace.  Everything below is reasoned from observed artifacts:
 *
 * 1. re/original-grade-txt/23_power_rec.grade.txt, verbatim:
 *
 *      Attempting to compile power.c
 *      Attempting to compile power.o with our main
 *      Checking for unsigned power (unsigned x, unsigned y)
 *      Found on line 4, column 1
 *      Checking for no iteration (do, while, for)
 *      Checking that power is recursive
 *      0^0 was Correct
 *      0^1 was Correct
 *      0^2 was Correct
 *      0^6 was Correct
 *      0^8 was Correct
 *      0^11 was Correct
 *      1^0 was Correct
 *      ... 36 lines in all ...
 *      12^11 was Correct
 *
 *    => 36 cases, x over 0,1,4,5,9,12 and y over 0,1,2,6,8,11 (x-major), one
 *       "x^y was Correct" line each.  The wording is the case message the tool
 *       is configured with, not driver output: the driver exits 0/1.
 *
 * 2. 23_power_rec/README (the student-facing contract):
 *
 *      unsigned power(unsigned x, unsigned y);
 *      "Note that while 0 to the 0 is undefined in mathematics, we specify
 *       that 0 to the 0 shall be 1 for this function." / "You MUST use
 *       recursion (no iteration)."
 *
 * The reference answer is computed here with ordinary unsigned arithmetic, so
 * it wraps modulo 2^32 exactly like the recursive definition does.
 *
 * Usage: ./power <x> <y>
 *
 * Exit status is 0 when the answer is correct and 1 when it is not.
 *
 * Build note: the config declares `"sources": []` and this driver #includes
 * power.c.  power.c has no main(), but the rename below keeps a main() a
 * student may have added for their own testing from colliding with this one.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define main providedMain
#include "power.c"
#undef main

/* x to the y with unsigned wraparound: the same value the recursive
   definition produces, computed without recursion. */
static unsigned referencePower(unsigned x, unsigned y) {
  unsigned result = 1;
  while (y > 0) {
    result *= x;
    y--;
  }
  return result;
}

int main(int argc, char ** argv) {
  unsigned long x;
  unsigned long y;

  if (argc != 3) {
    fprintf(stderr, "usage: %s <x> <y>\n", argv[0]);
    return 2;
  }
  {
    char * end = NULL;
    x = strtoul(argv[1], &end, 10);
    if (end == argv[1] || *end != '\0' || x > 4294967295UL) {
      fprintf(stderr, "driver: bad x \"%s\"\n", argv[1]);
      return 2;
    }
    y = strtoul(argv[2], &end, 10);
    if (end == argv[2] || *end != '\0' || y > 4294967295UL) {
      fprintf(stderr, "driver: bad y \"%s\"\n", argv[2]);
      return 2;
    }
  }
  {
    unsigned expected = referencePower((unsigned)x, (unsigned)y);
    unsigned got = power((unsigned)x, (unsigned)y);
    printf("%lu^%lu was %s\n", x, y, (got == expected) ? "Correct" : "Incorrect");
    return (got == expected) ? 0 : 1;
  }
}
