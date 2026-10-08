/*
 * Grader driver for 32_kvs - the teacher's own kv_test.c, which the README
 * tells the student to use ("Once you complete these functions, test them
 * using the main in kv_test.c before proceeding to the next problem").
 *
 * PROVENANCE: the code below is copied from 32_kvs/kv_test.c and is
 * independently corroborated by the teacher object 32_kvs/kv_test.o (see
 * re/elf/32_kvs__kv_test.o.md):
 *   - the object defines exactly one function, `main` (STT_FUNC, 238 bytes),
 *     and imports only readKVs, printKVs, lookupValue, freeKVs, printf, puts;
 *   - its .rodata holds "test.txt", "Printing all keys\n", the five lookup keys
 *     "banana", "grapes", "cantaloupe", "lettuce", "orange" and the format
 *     "lookupValue('%s')=%s\n" - i.e. the same data and the same output text;
 *   - its DWARF puts `main(void)` at line 7, which is where it sits below.
 *
 * One difference is worth recording: the object imports `puts` and its .rodata
 * holds "Printing all keys\n" (one newline), so the teacher's original emitted
 * the blank line with a separate `puts("")` call, while the committed source
 * below writes it with printf("Printing all keys\n\n"). The bytes printed are
 * identical either way, and the copy below is the one that actually exists in
 * the workspace.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "kv.h"

#define NUM_LOOKUPS 5
int main(void) {
  kvarray_t * array = readKVs("test.txt");
  printf("Printing all keys\n\n");
  printKVs(array);
  char *tests[NUM_LOOKUPS] = {"banana", "grapes", "cantaloupe", "lettuce", "orange"};
  for (int i = 0; i < NUM_LOOKUPS; i++) {
    printf("lookupValue('%s')=%s\n", tests[i], lookupValue(array,tests[i]));
  }
  freeKVs(array);
  return EXIT_SUCCESS;
}
