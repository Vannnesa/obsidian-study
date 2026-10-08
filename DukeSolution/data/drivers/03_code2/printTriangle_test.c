/*
 * Reconstructed grader driver for 03_code2 -- the "our own main" the original
 * grader linked in after removing the student's main().
 *
 * CONFIDENCE: inferred.  No teacher object for this assignment exists anywhere
 * in the workspace (03_code2/ holds only the student's code2.c, its README,
 * test.sh and grade.txt; re/elf/ has no 03_code2 entry).  The case list, the
 * wording and the report dialect are observed; the driver body is inferred.
 *
 * 1. re/original-grade-txt/03_code2.grade.txt, verbatim:
 *
 *      Checking code2.c for legal syntax
 *      Checking for int printTriangle (int size)
 *      Found on line 3, column 1
 *      Checking for int main(void)
 *      Found on line 25, column 1
 *      Trying to run the code..
 *      Your file matched the expected output
 *      Removing your main() and replacing it with our own to run more tests...
 *      Testing printTriangle(0) ... Correct
 *      Testing printTriangle(1) ... Correct
 *      Testing printTriangle(2) ... Correct
 *      Testing printTriangle(3) ... Correct
 *      Testing printTriangle(4) ... Correct
 *      Testing printTriangle(7) ... Correct
 *      Testing printTriangle(9) ... Correct
 *      Testing printTriangle(12) ... Correct
 *      Testing printTriangle(143) ... Correct
 *      Testing printTriangle(172) ... Correct
 *      Testing printTriangle(931) ... Correct
 *      Testing printTriangle(2469) ... Correct
 *
 *    => one process per size, whose stdout is exactly
 *       "Testing printTriangle(<size>) ... Correct", i.e. the report's
 *       `inline` dialect.
 *
 * 2. 03_code2/README and 03_code2/test.sh: the function to write is
 *    `int printTriangle (int size)`; it prints a triangle of `size` lines
 *    (line i has i+1 stars) and returns the total number of stars printed.
 *    test.sh prepends <stdio.h> and <stdlib.h> to code2.c before compiling,
 *    which is why the original's reported line numbers are two higher than
 *    the file's own; the same two headers are forced on the command line by
 *    build.flags, so the standalone `selfTest` build links too.
 *
 * The driver runs printTriangle with stdout redirected into a temporary file,
 * compares both the returned star count and the printed triangle with the
 * reference, and prints one summary line:
 *
 *      printTriangle(4) returned 10
 *
 * on success, or a diagnostic naming the mismatch on failure (in which case it
 * also exits non-zero).
 *
 * Build note: the config declares `"sources": []` and this driver #includes
 * code2.c, because that file already contains a main().
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#define main providedMain
#include "code2.c"
#undef main

/*
 * Call printTriangle(size) with stdout diverted into a temporary file and
 * return the captured text (malloc'd, NUL-terminated), or NULL on failure.
 * `*returned` receives the function's return value.
 */
static char * capture(int size, int * returned) {
  int saved;
  FILE * tmp;
  char * buf;
  long len;

  fflush(stdout);
  saved = dup(fileno(stdout));
  tmp = tmpfile();
  if (saved < 0 || tmp == NULL) {
    if (saved >= 0) close(saved);
    if (tmp != NULL) fclose(tmp);
    return NULL;
  }
  if (dup2(fileno(tmp), fileno(stdout)) < 0) {
    close(saved);
    fclose(tmp);
    return NULL;
  }

  *returned = printTriangle(size);

  fflush(stdout);
  dup2(saved, fileno(stdout));
  close(saved);

  if (fseek(tmp, 0, SEEK_END) != 0) {
    fclose(tmp);
    return NULL;
  }
  len = ftell(tmp);
  if (len < 0) {
    fclose(tmp);
    return NULL;
  }
  rewind(tmp);
  buf = malloc((size_t)len + 1);
  if (buf == NULL) {
    fclose(tmp);
    return NULL;
  }
  if (len > 0 && fread(buf, 1, (size_t)len, tmp) != (size_t)len) {
    free(buf);
    fclose(tmp);
    return NULL;
  }
  buf[len] = '\0';
  fclose(tmp);
  return buf;
}

/* The triangle the README describes: `size` lines, line i holding i+1 stars. */
static char * expectedTriangle(int size) {
  size_t len = 0;
  size_t p = 0;
  char * buf;

  for (int i = 0; i < size; i++) {
    len += (size_t)(i + 1) + 1;
  }
  buf = malloc(len + 1);
  if (buf == NULL) {
    return NULL;
  }
  for (int i = 0; i < size; i++) {
    for (int j = 0; j <= i; j++) {
      buf[p++] = '*';
    }
    buf[p++] = '\n';
  }
  buf[p] = '\0';
  return buf;
}

int main(int argc, char ** argv) {
  long size;
  int returned = -1;
  int expectedCount;
  char * got;
  char * want;
  int ok;

  if (argc != 2) {
    fprintf(stderr, "usage: %s <size>\n", argv[0]);
    return 2;
  }
  {
    char * end = NULL;
    size = strtol(argv[1], &end, 10);
    if (end == argv[1] || *end != '\0' || size < 0 || size > 100000L) {
      fprintf(stderr, "driver: bad size \"%s\"\n", argv[1]);
      return 2;
    }
  }

  expectedCount = (int)(size * (size + 1) / 2);
  got = capture((int)size, &returned);
  want = expectedTriangle((int)size);
  ok = (got != NULL) && (want != NULL) && (returned == expectedCount)
       && (strcmp(got, want) == 0);

  if (ok) {
    printf("printTriangle(%ld) returned %d\n", size, returned);
  } else if (returned != expectedCount) {
    printf("printTriangle(%ld) returned %d, expected %d\n",
           size, returned, expectedCount);
  } else {
    printf("printTriangle(%ld) printed the wrong triangle\n", size);
  }

  free(got);
  free(want);
  return ok ? 0 : 1;
}
