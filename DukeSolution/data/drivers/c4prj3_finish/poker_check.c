/*
 * Reconstructed grader driver for `c4prj3_finish` -- the Monte Carlo poker
 * simulation.
 *
 * The 2024 grader built the student's program with `make poker OTHERFLAGS=-O3`
 * and then ran a series of simulations, checking each hand's win rate against
 * its own answer key:
 *
 *     Running a simulation with 20000 draws for 2 hands...
 *         Hand 0 was close enough to our answer
 *         Hand 1 was close enough to our answer
 *         Test case passed!
 *
 * The student's program is `main.c`, and it is the whole deliverable, so this
 * driver wraps it (the build renames it to `student_main` with
 * `-Dmain=student_main`) and does what the 2024 grader did around it:
 *
 *   1. redirect the program's stdout to a temporary file, so its random
 *      percentages never leak into a byte-compared fixture;
 *   2. run it with `argv[1] <trials>`;
 *   3. parse every `Hand <i> won <wins>/<trials> times (<pct>%)` line -- both
 *      the README's `%u / %u` spelling and the recorded solution's `%u/%u`
 *      spelling -- and check that
 *        * every hand 0..n-1 appears exactly once,
 *        * the denominator equals the requested number of trials,
 *        * the percentage agrees with wins/trials,
 *        * the percentage is within TOLERANCE points of the expected value
 *          passed on the command line (from provided-tests/answers.txt),
 *        * a ties line is printed;
 *   4. print only deterministic lines, so the expected-output fixture is
 *      stable: `Hand <i> was close enough to our answer` (the original's
 *      wording) and `Test case passed!`.
 *
 * The actual measured percentages go to stderr, which is never compared.
 *
 * Usage: `poker_check <inputfile> <trials> <expected%> [<expected%> ...]`
 *
 * Why a tolerance: the 2024 answers are the true probabilities rounded to the
 * nearest percent, and a simulation of N draws has a standard error of at most
 * 0.5/sqrt(N) (0.35 points at 20000 draws). 3 points is about 8 standard
 * errors at the smallest N used here, so a correct program is never failed,
 * while a wrong evaluator -- the failure this assignment is really about --
 * is far outside it.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#undef main
int student_main(int argc, char **argv);

#define TOLERANCE 3.0
#define MAX_HANDS 16

static int failures = 0;
static char *captured = NULL;

/* Run the student's program with stdout redirected to an in-memory buffer. */
static int run_captured(int argc, char **argv, char *out, size_t out_size) {
  fflush(stdout);
  fflush(stderr);

  char tmpl[] = "/tmp/poker-capture-XXXXXX";
  int fd = mkstemp(tmpl);
  if (fd < 0) {
    fprintf(stderr, "could not create a capture file\n");
    return -1;
  }
  /* Keep the path so the file can be removed afterwards. */
  int saved = dup(fileno(stdout));
  if (saved < 0) {
    close(fd);
    return -1;
  }
  dup2(fd, fileno(stdout));

  int rc = student_main(argc, argv);
  fflush(stdout);
  dup2(saved, fileno(stdout));
  close(saved);

  lseek(fd, 0, SEEK_SET);
  ssize_t n = read(fd, out, out_size - 1);
  if (n < 0) n = 0;
  out[n] = '\0';
  close(fd);
  unlink(tmpl);
  return rc;
}

/* Parse `Hand <i> won <w>[/ ]<t> times (<pct>%)`; returns 1 on success. */
static int parse_hand_line(const char *line, int *index, unsigned *wins,
                           unsigned *trials, double *pct) {
  const char *p = line;
  while (*p == ' ' || *p == '\t') p++;
  if (strncmp(p, "Hand ", 5) != 0) return 0;
  if (sscanf(p, "Hand %d won %u / %u times (%lf%%)", index, wins, trials, pct) == 4) {
    return 1;
  }
  if (sscanf(p, "Hand %d won %u/%u times (%lf%%)", index, wins, trials, pct) == 4) {
    return 1;
  }
  return 0;
}

int main(int argc, char **argv) {
  if (argc < 4) {
    printf("usage: poker_check <inputfile> <trials> <expected%%> [...]\n");
    return 1;
  }
  const char *input = argv[1];
  /* trials == 0 means "let the program use its documented default (10000)". */
  int default_trials = strtoul(argv[2], NULL, 10) == 0;
  unsigned trials = default_trials ? 10000u : (unsigned)strtoul(argv[2], NULL, 10);
  int n_expected = argc - 3;
  if (n_expected > MAX_HANDS) {
    printf("too many hands\n");
    return 1;
  }
  double expected[MAX_HANDS];
  for (int i = 0; i < n_expected; i++) {
    expected[i] = strtod(argv[3 + i], NULL);
  }

  /* Feed the student's main exactly the arguments the assignment documents:
     the input file and (optionally) the number of trials. */
  char trials_text[32];
  snprintf(trials_text, sizeof(trials_text), "%u", trials);
  int child_argc = default_trials ? 2 : 3;
  char *child_argv[4];
  child_argv[0] = argv[0];
  child_argv[1] = (char *)input;
  child_argv[2] = trials_text;
  child_argv[3] = NULL;

  if (default_trials) {
    printf("Running a simulation with the default number of draws for %d hand%s"
           " (expecting %u trials)...\n",
           n_expected, n_expected == 1 ? "" : "s", trials);
  } else {
    printf("Running a simulation with %u draws for %d hand%s...\n", trials,
           n_expected, n_expected == 1 ? "" : "s");
  }

  captured = malloc(1 << 20);
  if (captured == NULL) {
    printf("out of memory\n");
    return 1;
  }
  int rc = run_captured(child_argc, child_argv, captured, 1 << 20);
  if (rc != 0) {
    printf("Your program exited with status %d\n", rc);
    fprintf(stderr, "program output was:\n%s\n", captured);
    free(captured);
    return 1;
  }

  int seen[MAX_HANDS];
  double seen_pct[MAX_HANDS];
  unsigned seen_wins[MAX_HANDS];
  for (int i = 0; i < MAX_HANDS; i++) {
    seen[i] = 0;
    seen_pct[i] = 0.0;
    seen_wins[i] = 0;
  }
  int ties_line = 0;

  char *save = NULL;
  for (char *line = strtok_r(captured, "\n", &save); line != NULL;
       line = strtok_r(NULL, "\n", &save)) {
    if (strstr(line, "ties") != NULL || strstr(line, "Ties") != NULL) {
      ties_line = 1;
    }
    int index = -1;
    unsigned wins = 0, t = 0;
    double pct = 0.0;
    if (!parse_hand_line(line, &index, &wins, &t, &pct)) continue;
    if (index < 0 || index >= MAX_HANDS) {
      printf("Your program reported a result for hand %d, which is out of "
             "range\n",
             index);
      failures++;
      continue;
    }
    if (seen[index]) {
      printf("Your program reported hand %d more than once\n", index);
      failures++;
      continue;
    }
    if (t != trials) {
      printf("Hand %d was simulated %u times; %u draws were requested\n", index,
             t, trials);
      failures++;
    }
    double from_counts = t == 0 ? 0.0 : 100.0 * (double)wins / (double)t;
    if (pct < from_counts - 0.01 || pct > from_counts + 0.01) {
      printf("Hand %d printed %.2f%% but %u of %u trials is %.2f%%\n", index,
             pct, wins, t, from_counts);
      failures++;
    }
    seen[index] = 1;
    seen_pct[index] = pct;
    seen_wins[index] = wins;
  }

  for (int i = 0; i < n_expected; i++) {
    if (!seen[i]) {
      printf("Your program did not report a result for hand %d\n", i);
      failures++;
      continue;
    }
    fprintf(stderr, "  hand %d: %.2f%% (%u wins), expected %.0f%%\n", i,
            seen_pct[i], seen_wins[i], expected[i]);
    if (seen_pct[i] < expected[i] - TOLERANCE ||
        seen_pct[i] > expected[i] + TOLERANCE) {
      printf("Hand %d won %.2f%% of the time; we expected about %.0f%%\n", i,
             seen_pct[i], expected[i]);
      failures++;
    }
  }
  if (!ties_line) {
    printf("Your program did not report the number of ties\n");
    failures++;
  }

  if (failures > 0) {
    printf("Test case failed!\n");
    free(captured);
    return 1;
  }

  for (int i = 0; i < n_expected; i++) {
    printf("Hand %d was close enough to our answer\n", i);
  }
  printf("Test case passed!\n");
  free(captured);
  return 0;
}
