#include <stdio.h>
#include <stdlib.h>
#include <string.h>


//This function is used to figure out the ordering
//of the strings in qsort.  You do not need
//to modify it.
int stringOrder(const void * vp1, const void * vp2) {
  const char * const * p1 = vp1;
  const char * const * p2 = vp2;
  return strcmp(*p1, *p2);
}
//This function will sort and print data (whose length is count).
void sortData(char ** data, size_t count) {
  qsort(data, count, sizeof(char *), stringOrder);
}

int main(int argc, char ** argv) {
  // TODO: write the part of the program the README asks for:
  //
  //   - argc == 1: read the lines from stdin with getline, sort them with
  //     sortData, print them, free everything, exit successfully.
  //   - argc > 1: treat every argument as an input file, open it, read all of
  //     its lines with getline, sort them, print them, free the memory and
  //     close the file.  On any error print a message and exit with
  //     EXIT_FAILURE; if all files are processed, indicate success.
  //
  // There is no restriction on the length of a line, and the program must
  // valgrind cleanly (no leaks).  The README suggests writing 3 more functions
  // besides the two provided above.
  return EXIT_SUCCESS;
}
