/*
 * Grader driver for 29_outname - the teacher's own outname_test.c, which the
 * README tells the student to use ("You can make and test with the main
 * function found in outname_test.c").
 *
 * PROVENANCE: the code below is copied verbatim from 29_outname/outname_test.c,
 * and it is independently corroborated by the teacher object
 * 29_outname/outname_test.o (see re/elf/29_outname__outname_test.o.md):
 *   - the object defines exactly one function, `main` (STT_FUNC, 174 bytes),
 *     and imports only computeOutputFileName, printf, free and __stack_chk_fail;
 *   - its .rodata holds exactly "input.txt", "anotherTestFileName.txt",
 *     "somethingelse" and "'%s' => '%s'\n";
 *   - its DWARF says `main(void)` is at line 7 with the local `testNames` at
 *     line 8, which is exactly where they sit in the source below;
 *   - the disassembly is a three-iteration loop (cmpl $0x2 ... jle) that calls
 *     computeOutputFileName, printf's the pair, then free()s the result.
 */

#include "outname.h"
#include <stdio.h>
#include <stdlib.h>


#define NUM_TESTS 3
int main(void) {
  char * testNames[NUM_TESTS] = {"input.txt",
				 "anotherTestFileName.txt",
				 "somethingelse"};
  
  for (int i = 0; i < NUM_TESTS; i++) {
    char * outName = computeOutputFileName(testNames[i]);
    printf("'%s' => '%s'\n", testNames[i], outName);
    free(outName);
  }
  return EXIT_SUCCESS;
}
