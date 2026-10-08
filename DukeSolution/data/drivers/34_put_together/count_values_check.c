/*
 * Reconstructed grader driver for `34_put_together` (count_values).
 *
 * The original grader ran `make count_values`, then for each case ran the
 * student's own program and compared the `.counts` files it wrote with the
 * teacher's `.ans` files.  re/original-grade-txt/34_put_together.grade.txt
 * records the exact line sequence:
 *
 *     Attempting to compile:
 *     rm -f  outname.o  counts.o  main.o  kv.o count_values *~
 *     gcc -c -Wall -Werror -std=gnu99 -pedantic -ggdb3 outname.c
 *     ...
 *     #################################################
 *     testcase1:
 *     testcase1 passed, your program successfully indicated a failure
 *       - Valgrind was clean (no errors, no memory leaks)
 *     valgrind was clean
 *     ...
 *     testcase2:
 *     Your file matched the expected output
 *     Comparing file list1a.txt.counts with answer
 *     Your output is correct
 *     Comparing file list1b.txt.counts with answer
 *     Your file matched the expected output
 *     Your output is correct
 *
 * The 2024 grader's own driver object is not in the workspace, but `main.c`
 * *is* the student's program, so this driver does not need to reimplement any
 * of it: it wraps the student's `main` (renamed to `student_main` by the
 * `-Dmain=student_main` flag) and checks what the program left on disk.  That
 * is exactly what the original did, and it keeps error checking
 * ("your program successfully indicated a failure") under test too.
 *
 * Per case, for every list file X named on the command line:
 *
 *   1. X.counts is deleted *before* the student's main runs, so a stale file
 *      from an earlier run cannot be mistaken for this run's output;
 *   2. after it returns, X.counts is compared with X.ans, which the assignment
 *      README names as the answer file ("The correct contents can be found in
 *      list1a.txt.ans").
 *
 * The comparison ignores whitespace runs.  That tolerance is not a guess: the
 * recorded solution prints `<unknown>: 2` while the provided answer files say
 * `<unknown> : 2`, and the 2024 grader accepted precisely that difference
 * (`c2prj1_cards` and `33_counts` show the same thing -- 33_counts.grade.txt
 * passed its output check against the README's `<unknown> : 1` format while
 * printing `<unknown>: 1`).
 *
 * The "matched"/"Comparing"/"output is correct" lines are printed in the order
 * 34_put_together.grade.txt shows, which is M,C,Y for the first file and C,M,Y
 * for the rest.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

/* The build compiles every source with -Dmain=student_main so that this file
   can supply the real entry point. */
#undef main
int student_main(int argc, char **argv);

static int failures = 0;

/* Read a whole file; returns NULL when it cannot be opened. */
static char *slurp(const char *path) {
  FILE *f = fopen(path, "r");
  if (f == NULL) return NULL;
  size_t cap = 4096, len = 0;
  char *buf = malloc(cap);
  if (buf == NULL) {
    fclose(f);
    return NULL;
  }
  size_t n;
  while ((n = fread(buf + len, 1, cap - len - 1, f)) > 0) {
    len += n;
    if (len + 1 >= cap) {
      cap *= 2;
      char *bigger = realloc(buf, cap);
      if (bigger == NULL) {
        free(buf);
        fclose(f);
        return NULL;
      }
      buf = bigger;
    }
  }
  buf[len] = '\0';
  fclose(f);
  return buf;
}

/*
 * Compare two files line by line, ignoring every whitespace character inside a
 * line.  That is the tolerance the 2024 grader had: the recorded solution
 * writes `<unknown>: 2` where the provided answer says `<unknown> : 2`, and the
 * same difference was accepted in 33_counts.  Line count and every other
 * character must still match exactly, so a wrong count, a wrong value or a
 * reordered file is still a failure.
 */
static char *strip_whitespace(char *line) {
  char *out = line;
  char *in = line;
  while (*in != '\0') {
    if (*in != ' ' && *in != '\t' && *in != '\r' && *in != '\n' &&
        *in != '\f' && *in != '\v') {
      *out++ = *in;
    }
    in++;
  }
  *out = '\0';
  return line;
}

static int same_ignoring_whitespace(const char *path_a, const char *path_b) {
  FILE *fa = fopen(path_a, "r");
  FILE *fb = fopen(path_b, "r");
  if (fa == NULL || fb == NULL) {
    if (fa != NULL) fclose(fa);
    if (fb != NULL) fclose(fb);
    return 0;
  }
  char la[8192];
  char lb[8192];
  int same = 1;
  for (;;) {
    char *ra = fgets(la, (int)sizeof(la), fa);
    char *rb = fgets(lb, (int)sizeof(lb), fb);
    if (ra == NULL || rb == NULL) {
      if (ra != rb) same = 0; /* one file has more lines than the other */
      break;
    }
    if (strcmp(strip_whitespace(la), strip_whitespace(lb)) != 0) {
      same = 0;
      break;
    }
  }
  fclose(fa);
  fclose(fb);
  return same;
}

/* Print both files, so a failure says exactly what differed. */
static void show_difference(const char *counts, const char *answer) {
  char *a = slurp(counts);
  char *b = slurp(answer);
  printf("Your output did not match the answer file %s\n", answer);
  if (a == NULL) {
    printf("  %s was not created\n", counts);
  } else if (b == NULL) {
    printf("  could not read %s\n", answer);
  } else {
    printf("  %s contains:\n%s", counts, a);
    printf("  %s contains:\n%s", answer, b);
  }
  free(a);
  free(b);
}

int main(int argc, char **argv) {
  /* 1. remove the outputs this run is supposed to create. */
  for (int i = 2; i < argc; i++) {
    size_t n = strlen(argv[i]) + strlen(".counts") + 1;
    char *out = malloc(n);
    if (out == NULL) return 1;
    snprintf(out, n, "%s.counts", argv[i]);
    unlink(out);
    free(out);
  }

  /* 2. run the student's program with the very same arguments. */
  int rc = student_main(argc, argv);
  if (rc != 0) {
    printf("Your program exited with status %d instead of creating the "
           "output files\n",
           rc);
    return 1;
  }

  /* 3. compare every output file with its answer file.  The order of the
     "matched" / "Comparing" / "output is correct" lines reproduces
     34_put_together.grade.txt: M,C,Y for the first file and C,M,Y afterwards. */
  for (int i = 2; i < argc; i++) {
    size_t nc = strlen(argv[i]) + strlen(".counts") + 1;
    size_t na = strlen(argv[i]) + strlen(".ans") + 1;
    char *counts = malloc(nc);
    char *answer = malloc(na);
    if (counts == NULL || answer == NULL) {
      free(counts);
      free(answer);
      return 1;
    }
    snprintf(counts, nc, "%s.counts", argv[i]);
    snprintf(answer, na, "%s.ans", argv[i]);

    FILE *probe = fopen(counts, "r");
    int created = probe != NULL;
    if (created) fclose(probe);
    int matched = created && same_ignoring_whitespace(counts, answer);

    if (i == 2 && matched) {
      printf("Your file matched the expected output\n");
    }
    printf("Comparing file %s with answer\n", counts);
    if (i > 2 && matched) {
      printf("Your file matched the expected output\n");
    }
    if (matched) {
      printf("Your output is correct\n");
    } else if (!created) {
      printf("Your program did not create %s\n", counts);
      failures++;
    } else {
      show_difference(counts, answer);
      failures++;
    }
    free(counts);
    free(answer);
  }

  if (argc < 3) {
    printf("no list files were given on the command line\n");
    failures++;
  }
  return failures == 0 ? 0 : 1;
}
