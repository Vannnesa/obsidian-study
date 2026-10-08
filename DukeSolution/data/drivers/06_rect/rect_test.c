/*
 * Reconstructed grader driver for 06_rect.
 *
 * The 2024 grader's report reads (re/original-grade-txt/06_rect.grade.txt):
 *
 *   Attempting to compile rectangle.c
 *   Tring to run rectangle
 *   Your file matched the expected output
 *   removing your main() and replacing it with out own to run more tests...
 *   #################################################
 *   testcase1:
 *   testcase1 passed
 *   #################################################
 *   testcase2:
 *   testcase2 passed
 *
 * That is: the grader first built the student's program with the provided
 * Makefile target `rectangle`, ran it, and compared its stdout with
 * rectangle_ans.txt ("Your file matched the expected output"); then it rebuilt
 * with the student's main() replaced by its own and ran two further checks.
 *
 * PROVENANCE: there is no teacher object for this assignment (the workspace has
 * no rectangle_test.o), so the *body* of the extra checks below is INFERRED
 * from the README's stated corner cases. What is observed is the driver's
 * shape: it replaces main(), and it runs exactly two extra checks. The
 * mechanism used here - renaming the provided main() instead of deleting it -
 * is the C-source equivalent of the grader's "removing your main()".
 *
 * Build note: the config declares `"sources": []` and this driver #includes the
 * student's rectangle.c, because the student's file already contains a main().
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* The provided main() is renamed, never removed, so that mode "main" can still
   run it exactly as the original grader did before the "removing your main()"
   step. */
#define main providedMain
#include "rectangle.c"
#undef main

/* Print a rectangle the same way the provided printRectangle() does, so the
   reference output is directly comparable with rectangle_ans.txt. */
static void show(const char * label, rectangle r) {
  rectangle c = canonicalize(r);
  if (c.width == 0 && c.height == 0) {
    printf("%s is <empty>\n", label);
  } else {
    printf("%s is (%d,%d) to (%d,%d)\n", label, c.x, c.y, c.x + c.width, c.y + c.height);
  }
}

static void canonicalizeCase(int x, int y, int w, int h) {
  rectangle r;
  r.x = x;
  r.y = y;
  r.width = w;
  r.height = h;
  char label[128];
  snprintf(label, sizeof(label), "canonicalize(%d,%d,%d,%d)", x, y, w, h);
  show(label, canonicalize(r));
}

/* README step 3: width/height must become non-negative and x/y must follow. */
static int testCanonicalize(void) {
  canonicalizeCase(3, 2, -2, 4);    /* the README's worked example */
  canonicalizeCase(3, 2, 2, -4);
  canonicalizeCase(-3, -2, -2, -4);
  canonicalizeCase(5, 6, 7, 8);     /* already canonical: unchanged */
  return EXIT_SUCCESS;
}

static void intersectionCase(int x1, int y1, int w1, int h1,
                             int x2, int y2, int w2, int h2) {
  rectangle r1;
  rectangle r2;
  r1.x = x1; r1.y = y1; r1.width = w1; r1.height = h1;
  r2.x = x2; r2.y = y2; r2.width = w2; r2.height = h2;
  char label[192];
  snprintf(label, sizeof(label), "intersection((%d,%d,%d,%d),(%d,%d,%d,%d))",
           x1, y1, w1, h1, x2, y2, w2, h2);
  show(label, intersection(r1, r2));
}

/* README step 4: the "no intersection" corner case (both width and height 0)
   and the shared-edge case (exactly one of them 0). */
static int testIntersection(void) {
  intersectionCase(0, 0, 1, 1, -1, 1, 3, 2);   /* README's shared edge */
  intersectionCase(0, 0, 4, 4, 1, 1, 2, 2);    /* containment */
  intersectionCase(0, 0, 1, 1, 2, 2, 1, 1);    /* no intersection */
  intersectionCase(4, 5, -5, -7, 2, 3, 5, 6);  /* non-canonical operands */
  return EXIT_SUCCESS;
}

int main(int argc, char ** argv) {
  if (argc < 2 || strcmp(argv[1], "main") == 0) {
    /* "Tring to run rectangle" - the student's own program, unchanged. */
    return providedMain();
  }
  if (strcmp(argv[1], "test1") == 0) {
    return testCanonicalize();
  }
  if (strcmp(argv[1], "test2") == 0) {
    return testIntersection();
  }
  fprintf(stderr, "unknown testcase: %s\n", argv[1]);
  return EXIT_FAILURE;
}
