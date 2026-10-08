#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "counts.h"

counts_t * createCounts(void) {
  //WRITE ME
  // TODO: allocate a counts_t that represents "nothing counted yet".
}

void addCount(counts_t * c, const char * name) {
  //WRITE ME
  // TODO: increment the count for `name`; `name` is NULL for an unknown name,
  //       which must be counted separately.
}

void printCounts(counts_t * c, FILE * outFile) {
  //WRITE ME
  // TODO: print "name: count" lines in the order the names were first added,
  //       with the unknown count last and never printed when it is zero.
}

void freeCounts(counts_t * c) {
  //WRITE ME
  // TODO: free everything createCounts/addCount allocated.
}
