/*
 * Reconstructed grader driver for `c2prj1_cards`.
 *
 * The original 2024 grader compiled the student's `cards.c` and linked it with
 * its own (now lost) test object, then printed a per-function checklist:
 *
 *     Compiling cards.c
 *     Testing card_from_letters
 *     Passed
 *     Testing value_letter and suit_letter
 *     Passed
 *     Testing print_card
 *     Passed
 *     Testing card_from_num
 *     Passed
 *     Testing ranking_to_string
 *     ranking_to_string(STRAIGHT_FLUSH) resulted in STRAIGHT_FLUSH  (Correct)
 *     ...
 *     Testing assert_card_valid
 *     Passed
 *
 * No teacher `.o` for this assignment survived, so the checks below are
 * reconstructed from `c2prj1_cards/README` (which specifies every function's
 * contract) and from that grade.txt checklist.  Each check is selected by
 * argv[1] so the config can report one `Testing ...` line per function.
 *
 * Contract with the grading tool: print nothing and exit 0 when the check
 * passes; print a diagnosis and exit 1 when it does not.
 *
 * Provenance: README requirements + grade.txt checklist = observed; the test
 * data (all 52 value/suit combinations) is derived from cards.h.
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <string.h>
#include <assert.h>
#include <unistd.h>
#include <sys/wait.h>
#include <signal.h>
#include "cards.h"

static int failures = 0;

static void fail(const char *fmt, ...) {
  va_list ap;
  va_start(ap, fmt);
  vfprintf(stdout, fmt, ap);
  va_end(ap);
  fputc('\n', stdout);
  failures++;
}

/* ---- shared tables ------------------------------------------------------ */

static const char VALUES[13] = {'2', '3', '4', '5', '6', '7', '8', '9', '0',
                                'J', 'Q', 'K', 'A'};
static const unsigned VALUE_NUMS[13] = {2, 3, 4, 5, 6, 7, 8, 9, 10,
                                        VALUE_JACK, VALUE_QUEEN, VALUE_KING,
                                        VALUE_ACE};
static const char SUITS[4] = {'s', 'h', 'd', 'c'};
static const suit_t SUIT_NUMS[4] = {SPADES, HEARTS, DIAMONDS, CLUBS};

static card_t make_card(unsigned value, suit_t suit) {
  card_t c;
  c.value = value;
  c.suit = suit;
  return c;
}

/* ---- 1. card_from_letters ----------------------------------------------- */

static void check_card_from_letters(void) {
  for (int v = 0; v < 13; v++) {
    for (int s = 0; s < 4; s++) {
      card_t c = card_from_letters(VALUES[v], SUITS[s]);
      if (c.value != VALUE_NUMS[v] || c.suit != SUIT_NUMS[s]) {
        fail("card_from_letters('%c','%c') gave value %u suit %d; expected %u/%d",
             VALUES[v], SUITS[s], c.value, (int)c.suit, VALUE_NUMS[v],
             (int)SUIT_NUMS[s]);
      }
    }
  }
}

/* ---- 2. value_letter / suit_letter -------------------------------------- */

static void check_letters(void) {
  for (int v = 0; v < 13; v++) {
    for (int s = 0; s < 4; s++) {
      card_t c = make_card(VALUE_NUMS[v], SUIT_NUMS[s]);
      char got_v = value_letter(c);
      char got_s = suit_letter(c);
      if (got_v != VALUES[v]) {
        fail("value_letter(value %u) gave '%c'; expected '%c'", VALUE_NUMS[v],
             got_v, VALUES[v]);
      }
      if (got_s != SUITS[s]) {
        fail("suit_letter(suit %d) gave '%c'; expected '%c'", (int)SUIT_NUMS[s],
             got_s, SUITS[s]);
      }
    }
  }
}

/* ---- 3. print_card ------------------------------------------------------ */

/* Run `print_card(c)` with stdout temporarily redirected to a file. */
static void capture_print_card(card_t c, char out[4]) {
  FILE *tmp = tmpfile();
  if (tmp == NULL) {
    fail("could not create a temporary file for the print_card check");
    out[0] = '\0';
    return;
  }
  fflush(stdout);
  int saved = dup(fileno(stdout));
  dup2(fileno(tmp), fileno(stdout));

  print_card(c);
  fflush(stdout);

  dup2(saved, fileno(stdout));
  close(saved);

  rewind(tmp);
  size_t n = fread(out, 1, 3, tmp);
  out[n] = '\0';
  fclose(tmp);
}

static void check_print_card(void) {
  for (int v = 0; v < 13; v++) {
    for (int s = 0; s < 4; s++) {
      char want[3];
      char got[4];
      card_t c = make_card(VALUE_NUMS[v], SUIT_NUMS[s]);
      want[0] = VALUES[v];
      want[1] = SUITS[s];
      want[2] = '\0';
      capture_print_card(c, got);
      if (strcmp(got, want) != 0) {
        fail("print_card(value %u, suit %d) printed \"%s\"; expected \"%s\"",
             VALUE_NUMS[v], (int)SUIT_NUMS[s], got, want);
      }
    }
  }
}

/* ---- 4. card_from_num --------------------------------------------------- */

static void check_card_from_num(void) {
  unsigned seen_value[52];
  suit_t seen_suit[52];
  int n_seen = 0;

  for (unsigned i = 0; i < 52; i++) {
    card_t c = card_from_num(i);
    if (c.value < 2 || c.value > VALUE_ACE) {
      fail("card_from_num(%u) produced value %u, which is not between 2 and %d",
           i, c.value, VALUE_ACE);
      continue;
    }
    if (c.suit < SPADES || c.suit > CLUBS) {
      fail("card_from_num(%u) produced suit %d, which is not a valid suit", i,
           (int)c.suit);
      continue;
    }
    int duplicate = 0;
    for (int j = 0; j < n_seen; j++) {
      if (seen_value[j] == c.value && seen_suit[j] == c.suit) {
        fail("card_from_num(%u) repeats the card produced by an earlier input "
             "(value %u, suit %d)",
             i, c.value, (int)c.suit);
        duplicate = 1;
        break;
      }
    }
    if (!duplicate) {
      seen_value[n_seen] = c.value;
      seen_suit[n_seen] = c.suit;
      n_seen++;
    }
  }
  if (n_seen != 52 && failures == 0) {
    fail("card_from_num produced only %d distinct cards for inputs 0..51",
         n_seen);
  }
}

/* ---- 5. ranking_to_string ----------------------------------------------- */

static const char *RANKING_NAMES[9] = {
    "STRAIGHT_FLUSH", "FOUR_OF_A_KIND", "FULL_HOUSE",    "FLUSH",
    "STRAIGHT",       "THREE_OF_A_KIND", "TWO_PAIR",     "PAIR",
    "NOTHING"};

static void check_ranking_to_string(void) {
  for (int r = 0; r < 9; r++) {
    const char *got = ranking_to_string((hand_ranking_t)r);
    if (got == NULL || strcmp(got, RANKING_NAMES[r]) != 0) {
      fail("ranking_to_string(%s) resulted in %s; expected %s",
           RANKING_NAMES[r], got == NULL ? "(null)" : got, RANKING_NAMES[r]);
    }
  }
}

/* ---- 6. assert_card_valid ----------------------------------------------- */

/* Returns 1 when assert_card_valid(c) aborts the process. */
static int aborts_on(card_t c) {
  fflush(stdout);
  fflush(stderr);
  pid_t pid = fork();
  if (pid == 0) {
    /* Keep the child quiet: assert() writes to stderr. */
    FILE *devnull = freopen("/dev/null", "w", stderr);
    (void)devnull;
    assert_card_valid(c);
    _exit(0); /* reached only when the assert did not fire */
  }
  if (pid < 0) return -1;
  int status = 0;
  waitpid(pid, &status, 0);
  if (WIFSIGNALED(status)) return 1;
  return 0;
}

static void check_assert_card_valid(void) {
  /* Every valid card must be accepted. */
  for (int v = 0; v < 13; v++) {
    for (int s = 0; s < 4; s++) {
      if (aborts_on(make_card(VALUE_NUMS[v], SUIT_NUMS[s])) != 0) {
        fail("assert_card_valid rejected the valid card %c%c", VALUES[v],
             SUITS[s]);
      }
    }
  }
  /* Every out-of-range value or suit must fail an assert. */
  struct {
    unsigned value;
    suit_t suit;
    const char *what;
  } bad[] = {
      {0, SPADES, "value 0"},
      {1, SPADES, "value 1"},
      {VALUE_ACE + 1, SPADES, "value 15"},
      {VALUE_ACE, NUM_SUITS, "suit NUM_SUITS"},
      {2, (suit_t)7, "suit 7"},
  };
  for (size_t i = 0; i < sizeof(bad) / sizeof(bad[0]); i++) {
    int r = aborts_on(make_card(bad[i].value, bad[i].suit));
    if (r == 0) {
      fail("assert_card_valid did not fail an assert for %s", bad[i].what);
    } else if (r < 0) {
      fail("could not fork() to test assert_card_valid");
      return;
    }
  }
}

/* ---- entry point -------------------------------------------------------- */

int main(int argc, char **argv) {
  if (argc < 2) {
    fprintf(stdout, "no check name given\n");
    return 1;
  }
  const char *which = argv[1];

  if (strcmp(which, "card_from_letters") == 0) {
    check_card_from_letters();
  } else if (strcmp(which, "letters") == 0) {
    check_letters();
  } else if (strcmp(which, "print_card") == 0) {
    check_print_card();
  } else if (strcmp(which, "card_from_num") == 0) {
    check_card_from_num();
  } else if (strcmp(which, "ranking_to_string") == 0) {
    check_ranking_to_string();
  } else if (strcmp(which, "assert_card_valid") == 0) {
    check_assert_card_valid();
  } else {
    fprintf(stdout, "unknown check \"%s\"\n", which);
    return 1;
  }

  if (failures > 0) {
    fprintf(stdout, "%d problem(s) found\n", failures);
    return 1;
  }
  return 0;
}
