/*
 * Reconstructed grader driver for `c3prj1_deck`.
 *
 * re/original-grade-txt/c3prj1_deck.grade.txt splits the grading in two:
 *
 *     Checking the output of all the functions other than shuffle
 *     Your file matched the expected output
 *      - Those functions seem to work!
 *     Checking your shuffle results with a 6 card hand...
 *       Least common hand: 0.131800%
 *       Most  common hand: 0.146250%
 *       Perfectly even is: 0.138888%
 *      Excellent!
 *
 * The first half compared a *deterministic* program's output with a stored
 * file; the second half measured the shuffle's hand-frequency distribution.
 * The grader's own object did not survive (`test-deck.o` in the directory is
 * the teacher-provided sample program -- re/elf/c3prj1_deck__test-deck.o.md
 * shows it doing 48M shuffles and printing "Doing 48M shuffles and counting
 * hand frequency" -- not this two-part report), so this driver is INFERRED from
 * the assignment README and the report above:
 *
 *   `nonshuffle`  print_hand / deck_contains / assert_full_deck, deterministically.
 *                 The printed report is compared byte-for-byte with a fixture,
 *                 which is what "Your file matched the expected output" means.
 *   `shuffle`     shuffles a 6-card hand many times and checks (a) the multiset
 *                 of cards is preserved and (b) the distribution over the 720
 *                 orderings is statistically uniform.
 *
 * The shuffle half CANNOT reproduce the original's numbers: they are a random
 * measurement (Least/Most common hand) and no stored expectation exists for
 * them.  It is graded as an assertion instead -- a real test of the same
 * property, with the measured chi-square written to stderr for the record --
 * and never as a comparison against a fabricated "expected" percentage.  The
 * README's own tolerance ("0.818% to 0.848% ... good enough" for a 5-card hand)
 * is the same idea; a chi-square test is used here because min/max over 720
 * buckets is noisy at any affordable sample size.
 *
 * Everything the driver builds uses `card_from_letters`, never `card_from_num`,
 * except the full-deck check, where `assert_full_deck` is *defined* in terms of
 * card_from_num and a 52-card deck is required.
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <string.h>
#include <math.h>
#include "cards.h"
#include "deck.h"

/* deck.h declares the Course-3 functions; the Course-4 ones are not needed. */

static int failures = 0;

static void failf(const char *fmt, ...) {
  va_list ap;
  va_start(ap, fmt);
  vprintf(fmt, ap);
  va_end(ap);
  printf("\n");
  failures++;
}

static deck_t *new_deck(void) {
  deck_t *d = malloc(sizeof(deck_t));
  if (d == NULL) {
    printf("out of memory\n");
    exit(EXIT_FAILURE);
  }
  d->cards = NULL;
  d->n_cards = 0;
  return d;
}

static card_t card_of(const char *letters) {
  return card_from_letters(letters[0], letters[1]);
}

static void add_all(deck_t *d, const char *const *names, size_t n) {
  for (size_t i = 0; i < n; i++) {
    add_card_to(d, card_of(names[i]));
  }
}

/* ---- deterministic half ------------------------------------------------- */

static void report_contains(deck_t *d, const char *name, int expect) {
  card_t c = card_of(name);
  int got = deck_contains(d, c);
  if ((got != 0) != (expect != 0)) {
    failf("deck_contains(%s) = %d, expected %d", name, got, expect);
  }
  printf("deck_contains(%s) = %d\n", name, got);
}

static void check_nonshuffle(void) {
  /* print_hand of a 7 card hand, then of an empty hand. */
  static const char *hand[] = {"As", "Ks", "Qs", "Js", "0s", "9s", "8s"};
  deck_t *d = new_deck();
  add_all(d, hand, 7);
  printf("hand of %zu cards: ", d->n_cards);
  print_hand(d);
  printf("\n");

  deck_t *empty = new_deck();
  printf("empty hand of %zu cards: ", empty->n_cards);
  print_hand(empty);
  printf("\n");

  deck_t *one = new_deck();
  add_all(one, hand, 1);
  printf("one card hand: ");
  print_hand(one);
  printf("\n");

  /* deck_contains at the first, middle and last position, and for cards that
     are absent but share a value or a suit with a card that is present. */
  report_contains(d, "As", 1);
  report_contains(d, "0s", 1);
  report_contains(d, "8s", 1);
  report_contains(d, "Ah", 0);
  report_contains(d, "Ac", 0);
  report_contains(d, "2s", 0);
  report_contains(d, "2h", 0);
  report_contains(empty, "As", 0);
  report_contains(one, "As", 1);
  report_contains(one, "Ks", 0);

  /* A full deck built with card_from_num must satisfy assert_full_deck. */
  deck_t *full = new_deck();
  for (unsigned i = 0; i < 52; i++) {
    add_card_to(full, card_from_num(i));
  }
  if (full->n_cards != 52) {
    failf("a deck of all 52 card_from_num values has %zu cards", full->n_cards);
  }
  assert_full_deck(full);
  printf("assert_full_deck on a 52 card deck: ok\n");

  free_deck(d);
  free_deck(empty);
  free_deck(one);
  free_deck(full);
}

/* ---- shuffle half ------------------------------------------------------- */

#define HAND_SIZE 6
#define PERMUTATIONS 720 /* 6! */
/* 800 samples per ordering: enough for a chi-square test with real power
   while keeping the case well under a second. */
#define SAMPLES (PERMUTATIONS * 800)

/* Rank of the current arrangement among all 6! orderings (0..719). */
static int permutation_index(deck_t *d) {
  static const int FACT[7] = {1, 1, 2, 6, 24, 120, 720};
  int n = (int)d->n_cards;
  int index = 0;
  for (int i = 0; i < n; i++) {
    int smaller = 0;
    for (int j = i + 1; j < n; j++) {
      int vi = (int)d->cards[i]->value, vj = (int)d->cards[j]->value;
      int si = (int)d->cards[i]->suit, sj = (int)d->cards[j]->suit;
      if (vj < vi || (vj == vi && sj < si)) smaller++;
    }
    index += smaller * FACT[n - 1 - i];
  }
  return index;
}

static int same_card(card_t a, card_t b) {
  return a.value == b.value && a.suit == b.suit;
}

static void check_shuffle(void) {
  static const char *hand[HAND_SIZE] = {"Kc", "Ah", "2s", "4h", "As", "9d"};
  deck_t *d = new_deck();
  add_all(d, hand, HAND_SIZE);

  card_t original[HAND_SIZE];
  for (size_t i = 0; i < HAND_SIZE; i++) {
    original[i] = card_of(hand[i]);
  }

  unsigned long counts[PERMUTATIONS];
  for (int i = 0; i < PERMUTATIONS; i++) counts[i] = 0;

  for (long iter = 0; iter < SAMPLES; iter++) {
    shuffle(d);
    if (d->n_cards != HAND_SIZE) {
      failf("shuffle changed n_cards to %zu", d->n_cards);
      break;
    }
    /* (a) the shuffle must be a permutation of the same six cards. */
    if (iter < 1000 || iter % 100000 == 0) {
      int seen[HAND_SIZE];
      for (int i = 0; i < HAND_SIZE; i++) seen[i] = 0;
      int ok = 1;
      for (size_t i = 0; i < HAND_SIZE && ok; i++) {
        int found = 0;
        for (int j = 0; j < HAND_SIZE; j++) {
          if (!seen[j] && same_card(*d->cards[i], original[j])) {
            seen[j] = 1;
            found = 1;
            break;
          }
        }
        if (!found) ok = 0;
      }
      if (!ok) {
        failf("after shuffling, the hand is no longer a permutation of the "
              "original six cards");
        break;
      }
    }
    int idx = permutation_index(d);
    if (idx < 0 || idx >= PERMUTATIONS) {
      failf("could not identify the shuffled ordering (index %d)", idx);
      break;
    }
    counts[idx]++;
  }

  /* (b) chi-square against a uniform distribution over the 720 orderings. */
  double expected = (double)SAMPLES / PERMUTATIONS;
  double chi2 = 0.0;
  unsigned long least = (unsigned long)-1, most = 0;
  for (int i = 0; i < PERMUTATIONS; i++) {
    double diff = (double)counts[i] - expected;
    chi2 += diff * diff / expected;
    if (counts[i] < least) least = counts[i];
    if (counts[i] > most) most = counts[i];
  }
  /* 719 degrees of freedom: mean 719, sd 38.  8 sd of headroom keeps a correct
     shuffle safe while still failing anything meaningfully non-uniform. */
  double limit = PERMUTATIONS - 1 + 8.0 * sqrt(2.0 * (PERMUTATIONS - 1));
  fprintf(stderr,
          "shuffle: %d samples, 720 orderings, least %lu (%.6f%%), most %lu "
          "(%.6f%%), perfectly even %.6f%%, chi-square %.1f (limit %.1f)\n",
          SAMPLES, least, 100.0 * (double)least / SAMPLES, most,
          100.0 * (double)most / SAMPLES, 100.0 / PERMUTATIONS, chi2, limit);

  if (chi2 > limit) {
    failf("the shuffle is not uniform: chi-square %.1f over 719 degrees of "
          "freedom (anything above %.1f is too far from even)",
          chi2, limit);
  }

  /* A hand that is dealt identically twice in a row is not proof of a bug
     (that is a 1-in-720 coincidence), but a shuffle that never moves anything
     is: the loop above would have put every sample in one bucket, which the
     chi-square test catches. */

  free_deck(d);
}

/* ---- entry point -------------------------------------------------------- */

int main(int argc, char **argv) {
  if (argc < 2) {
    printf("no check name given\n");
    return 1;
  }
  if (strcmp(argv[1], "nonshuffle") == 0) {
    check_nonshuffle();
  } else if (strcmp(argv[1], "shuffle") == 0) {
    check_shuffle();
  } else {
    printf("unknown check \"%s\"\n", argv[1]);
    return 1;
  }
  if (failures > 0) {
    printf("%d problem(s) found\n", failures);
    return 1;
  }
  return 0;
}
