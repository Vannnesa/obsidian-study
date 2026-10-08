#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "kv.h"

kvarray_t * readKVs(const char * fname) {
  //WRITE ME
  // TODO: open the file, read it line by line, split each line at its FIRST
  //       '=' into a key and a value, grow the array with realloc, and return
  //       the kvarray_t *.  The README suggests pulling the complex steps out
  //       into at least two helper functions.
}

void freeKVs(kvarray_t * pairs) {
  //WRITE ME
  // TODO: freeKVs(readKVs(filename)) must not leak anything.
}

void printKVs(kvarray_t * pairs) {
  //WRITE ME
  // TODO: print "key = '%s' value = '%s'\n" for every pair.
}

char * lookupValue(kvarray_t * pairs, const char * key) {
  //WRITE ME
  // TODO: return the matching value, or NULL when the key is not present.
}
