/*
 * Reconstructed grader driver for 05_squares.
 *
 * The original course shipped `squares_test.o`, an x86-64 Linux ELF object
 * that cannot be linked on macOS/arm64. This file was recovered from that
 * object by reverse engineering and reproduces its observable behaviour:
 *
 *   - `getInt` parses one non-negative int, with the original's exact
 *     diagnostics on stderr and exit status 1;
 *   - `main` requires exactly four arguments, otherwise it writes the usage
 *     line to stderr and returns 1;
 *   - arguments are read left to right as size1, x_offset, y_offset, size2
 *     and forwarded to the student's `squares`.
 *
 * Evidence: re/elf/05_squares__squares_test.o.md
 *   symbols   : getInt (237 bytes), main (184 bytes), undefined `squares`
 *   strings   : the three getInt diagnostics and the usage line, byte for byte
 *   disasm    : `cmpl $0x5, argc`, `fwrite(usage, 1, 48, stderr)`, return 1,
 *               four `getInt` calls in reverse argument order, then `squares`
 */

#include <limits.h>
#include <stdio.h>
#include <stdlib.h>

void squares(int size1, int x_offset, int y_offset, int size2);

int getInt(char * str) {
  char * endptr;
  long val = strtol(str, &endptr, 10);
  if (*endptr != '\0') {
    fprintf(stderr, "'%s' does not seem to be (enitrely) a number\n", str);
    exit(1);
  }
  if (val > INT_MAX) {
    fprintf(stderr, "%s is too big of a number!\n", str);
    exit(1);
  }
  if (val < 0) {
    fprintf(stderr, "%s is negative.  Please use only numbers >=0\n", str);
    exit(1);
  }
  return (int)val;
}

int main(int argc, char ** argv) {
  if (argc != 5) {
    fprintf(stderr, "Usage ./squares size1 x_offset, y_offset, size2\n");
    return 1;
  }
  squares(getInt(argv[1]), getInt(argv[2]), getInt(argv[3]), getInt(argv[4]));
  return 0;
}
