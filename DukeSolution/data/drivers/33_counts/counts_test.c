/*
 * Grader driver for 33_counts - the teacher's own counts_test.c, which the
 * README describes ("We have provided a main in countsTestc which creates a
 * counts_t ... adds some names ... prints the result to stdout ... then frees
 * the memory").
 *
 * PROVENANCE: the code below is copied from 33_counts/counts_test.c and is
 * independently corroborated by the teacher object 33_counts/counts_test.o (see
 * re/elf/33_counts__counts_test.o.md):
 *   - the object defines exactly one function, `main` (STT_FUNC, 267 bytes),
 *     and imports only createCounts, addCount, printCounts, freeCounts, stdout;
 *   - its .rodata holds exactly the seven non-NULL names used below - "apple",
 *     "banana", "frog", "sword", "bear", "zebra", "knight" - and no other
 *     string, which is what a driver that only calls printCounts(testCounts,
 *     stdout) looks like (the two NULL entries need no literal);
 *   - its DWARF puts `main(void)` at line 7, which is where it sits below.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "counts.h"

#define NUM_TESTS 12
int main(void) {
  char * testData[NUM_TESTS] = {"apple", "banana", NULL,"apple",
				"frog","sword","bear",NULL,
				"frog","apple", "zebra", "knight"};
  counts_t * testCounts= createCounts();
  for(int i =0; i < NUM_TESTS; i++) {
    addCount(testCounts,testData[i]);
  }
  printCounts(testCounts, stdout);
  freeCounts(testCounts);
  return EXIT_SUCCESS;
}
