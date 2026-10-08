/*
 * Reconstructed grader driver for 18_reverse_str -- the "our own main" the
 * original grader linked in after removing the student's main().
 *
 * CONFIDENCE: inferred.  No teacher object survives for this assignment
 * (re/elf/ has no 18_reverse_str entry; the directory holds only the student's
 * reverse.c, its Makefile, the linked binary, grade.txt and the teacher's
 * reverse_ans.txt).  Everything here is reasoned from observed artifacts:
 *
 * 1. re/original-grade-txt/18_reverse_str.grade.txt, verbatim:
 *
 *      Attempting to compile  reverse.c
 *      Your file matched the expected output
 *      Your output matched what we expected
 *      Removing your main() and replacing it with our own to run more tests...
 *      #################################################
 *      testcase2:
 *      nullptr#################################################
 *      testcase3:
 *      Your file matched the expected output
 *      #################################################
 *      testcase4:
 *      Your file matched the expected output
 *      #################################################
 *      testcase5:
 *      Your file matched the expected output
 *
 *    => the driver was invoked once per case.  testcase2's output is the seven
 *       bytes "nullptr" with no trailing newline (the "####" separator of
 *       testcase3 follows on the same line), i.e. the driver reports a NULL
 *       argument by printing "nullptr" -- a call that must not dereference the
 *       pointer.  testcase3..5 each printed the grader's usual success line,
 *       which in this case can only have come from the driver itself (the
 *       grader had nothing to compare but the driver's stdout), so the driver
 *       prints "Your file matched the expected output" when the string it
 *       reversed came back correct.  The failure wording is inferred, and
 *       mirrors src/strategies/file-compare.ts.  testcase1 ran the student's
 *       own program; the config's `selfTest` reproduces that half and case
 *       "main" below re-runs the provided main through this driver.
 *
 * 2. 18_reverse_str/README (the student-facing contract):
 *
 *      void reverse(char * str);
 *      "This function should reverse the string passed into it ... this
 *       function's return type is "void"---it modifies the string passed into
 *       it in place."
 *    and 18_reverse_str/reverse_ans.txt, the teacher's stored copy of the
 *    provided main's output (byte-identical to 18_reverse_str/answer.txt).
 *    `--verify main:18_reverse_str/reverse_ans.txt` in
 *    tools/re/gen_expected.py confirmed case "main" reproduces that file byte
 *    for byte.
 *
 * Usage (one case per process, exactly as the original did):
 *
 *      ./reverse main    the provided main, renamed but intact
 *      ./reverse null    reverse(NULL) must not crash
 *      ./reverse empty   reverse("")
 *      ./reverse odd     reverse("123")        (odd length)
 *      ./reverse long    the longest provided string (91 characters)
 *
 * Exit status is 0 when the case is correct and 1 when it is not.
 *
 * Build note: the config declares `"sources": []` and this driver #includes
 * the student's reverse.c, because that file already contains a main().  The
 * include is how the original's "removing your main()" step is expressed in C:
 * the provided main() is renamed, never deleted, so case "main" can still run
 * it, and `selfTest` (which compiles the file standalone) keeps working.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define main providedMain
#include "reverse.c"
#undef main

/* ------------------------------------------------------------------------ *
 * case "main": the provided main, exactly as the student left it.  The
 * expected output is the teacher's reverse_ans.txt.
 * ------------------------------------------------------------------------ */

static int caseMain(void) {
  return providedMain();
}

/* ------------------------------------------------------------------------ *
 * case "null": the pointer half of the contract.  Printing "nullptr" (no
 * newline, as the original did) proves the call returned instead of dying.
 * ------------------------------------------------------------------------ */

static int caseNull(void) {
  reverse(NULL);
  printf("nullptr");
  return 0;
}

/* ------------------------------------------------------------------------ *
 * case <name>: reverse a case-specific string on the heap and compare it with
 * the reversal computed here.  The trailing NUL must survive too.
 * ------------------------------------------------------------------------ */

static int caseString(const char * input) {
  size_t n = strlen(input);
  char * buf = malloc(n + 1);
  int ok = 1;

  if (buf == NULL) {
    fprintf(stderr, "driver: out of memory for %lu bytes\n", (unsigned long)n + 1);
    return 2;
  }
  memcpy(buf, input, n + 1);

  reverse(buf);

  for (size_t i = 0; i < n; i++) {
    if (buf[i] != input[n - 1 - i]) {
      ok = 0;
      break;
    }
  }
  if (buf[n] != '\0') {
    ok = 0;
  }

  printf("Your file %s the expected output\n", ok ? "matched" : "did not match");
  free(buf);
  return ok ? 0 : 1;
}

int main(int argc, char ** argv) {
  if (argc != 2) {
    fprintf(stderr, "usage: %s main|null|empty|odd|long\n", argv[0]);
    return 2;
  }
  if (strcmp(argv[1], "main") == 0) {
    return caseMain();
  }
  if (strcmp(argv[1], "null") == 0) {
    return caseNull();
  }
  if (strcmp(argv[1], "empty") == 0) {
    return caseString("");
  }
  if (strcmp(argv[1], "odd") == 0) {
    return caseString("123");
  }
  if (strcmp(argv[1], "long") == 0) {
    return caseString("Executor Selendis! Unleash the full power of your forces! There may be no tomorrow!");
  }
  fprintf(stderr, "driver: unknown case \"%s\"\n", argv[1]);
  return 2;
}
