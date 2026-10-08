/*
 * Reconstructed grader driver for 20_rot_matrix.
 *
 * The teacher's object file 20_rot_matrix/read-matrix.o is Linux x86-64 ELF and
 * cannot be linked on macOS/arm64, so it is reconstructed here as C from
 * re/elf/20_rot_matrix__read-matrix.o.md. Everything below is traceable to that
 * report:
 *
 *   defined symbols : readLine (STT_FUNC, 200 bytes), main (STT_FUNC, 492 bytes)
 *   undefined       : fgetc, stderr, fwrite, exit, fprintf, fopen, fclose,
 *                     rotate, putchar, __stack_chk_fail
 *   .rodata         : "Invalid input: line is too short\n"        (+0x0, 33 bytes)
 *                     "Invalid input: unexpected EOF\n"           (+0x28)
 *                     "Invalid input: Line is too long\n"         (+0x48)
 *                     "Usage: rotateMatrix input\n"               (+0x69, 26 bytes)
 *                     "Could not open %s\n"                       (+0x86)
 *                     "Invalid input: file is too long (read %d instead of EOF)\n"
 *
 * readLine(FILE * f, char * buf):
 *   the first 10 characters are read one at a time; a '\n' among them is
 *   "line is too short" (fwrite of the 33-byte literal to stderr + exit(1));
 *   the 11th character must be '\n', otherwise "unexpected EOF" (EOF) or
 *   "Line is too long", reported with fprintf(stderr, msg) + exit(1).
 *
 * main(argc, argv):
 *   argc != 2 -> "Usage: rotateMatrix input\n" on stderr, return 1;
 *   fopen(argv[1], "r"), NULL -> "Could not open %s\n" with argv[1], return 1;
 *   10 calls readLine(f, matrix[i]) with `char matrix[10][10]` (the i*10 scale
 *   in the disassembly is the row stride of char[10][10]);
 *   then fgetc must be EOF, otherwise
 *   "Invalid input: file is too long (read %d instead of EOF)\n" with the
 *   character just read, return 1;
 *   fclose, call the student's rotate(matrix), then print all 100 characters
 *   with putchar, a '\n' after every row, return 0.
 *
 * VALIDATION: the reconstructed driver reproduces 20_rot_matrix/sample.out
 * byte-for-byte from 20_rot_matrix/sample.txt (an independent teacher-provided
 * fixture pair).
 */

#include <stdio.h>
#include <stdlib.h>

/* Provided by the student's rotate.c. */
void rotate(char matrix[10][10]);

void readLine(FILE * f, char * buf) {
  int c;
  int i = 0;
  while (i <= 9) {
    c = fgetc(f);
    if (c == '\n') {
      fprintf(stderr, "Invalid input: line is too short\n");
      exit(EXIT_FAILURE);
    }
    buf[i] = c;
    i++;
  }
  c = fgetc(f);
  if (c != '\n') {
    if (c == EOF) {
      fprintf(stderr, "Invalid input: unexpected EOF\n");
    } else {
      fprintf(stderr, "Invalid input: Line is too long\n");
    }
    exit(EXIT_FAILURE);
  }
}

int main(int argc, char ** argv) {
  if (argc != 2) {
    fprintf(stderr, "Usage: rotateMatrix input\n");
    return EXIT_FAILURE;
  }
  FILE * f = fopen(argv[1], "r");
  if (f == NULL) {
    fprintf(stderr, "Could not open %s\n", argv[1]);
    return EXIT_FAILURE;
  }
  char matrix[10][10];
  for (int i = 0; i <= 9; i++) {
    readLine(f, matrix[i]);
  }
  int c = fgetc(f);
  if (c != EOF) {
    fprintf(stderr, "Invalid input: file is too long (read %d instead of EOF)\n", c);
    return EXIT_FAILURE;
  }
  fclose(f);
  rotate(matrix);
  for (int i = 0; i <= 9; i++) {
    for (int j = 0; j <= 9; j++) {
      putchar(matrix[i][j]);
    }
    putchar('\n');
  }
  return EXIT_SUCCESS;
}
