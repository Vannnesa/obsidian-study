/*
 * Reconstructed grader driver for `c4prj2_input` -- read_input, the future-card
 * helpers, and the decks they build.
 *
 * The 2024 grader linked "input.o, future.o deck.o, cards.o, and our tester"
 * (re/original-grade-txt/c4prj2_input.grade.txt) and compared the tester's
 * stdout against stored output for four input files:
 *
 *     Testing with input file with   o 1 hand                        o No unknown/future cards
 *                                    o Many hands                   o No unknown/future cards
 *                                    o Many hands                   o 1 unknown/future cards per hand
 *                                    o Many hands                   o Many unknown/future cards per hand
 *
 * The tester itself is lost: c4prj2_input/main.o is the *student's* own main.c
 * (re/elf/c4prj2_input__main.o.md lists exactly its strings: "Here are the
 * input hands:", "Here's the remaining deck:", "\n Here are the filler in
 * hands:", "\n Here are the resulting hands:"), and no other object in the
 * workspace has those four "Testing with input file" strings. So this driver is
 * INFERRED, and it is modelled on that recovered main.c: same section headers,
 * same use of read_input / build_remaining_deck / future_cards_from_deck.
 *
 * Two deliberate differences, both to keep the fixture honest:
 *
 *   1. the remaining deck is printed *sorted by value and suit* and with its
 *      size, because `card_from_num`'s mapping is explicitly the student's own
 *      choice (c2prj1_cards README) and an unsorted dump would pin the fixture
 *      to the reference's mapping;
 *   2. the future cards are filled from a fixed probe deck built with
 *      `card_from_letters` rather than from the unshuffled remaining deck, so
 *      which card lands on `?0` depends only on `future_cards_from_deck`'s
 *      documented contract ("draw cards from the deck and assign their values
 *      and suits to the placeholders") and not on card_from_num either.
 *
 * Usage: `input_check [inputfile]`; with no argument it reads stdin, which is
 * how the "1 hand / no unknown cards" case is supplied without adding files to
 * the assignment directory.
 *
 * The driver frees everything it owns, so its own bookkeeping cannot mask a
 * student leak or cause a false one.
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <string.h>
#include "cards.h"
#include "deck.h"
#include "future.h"
#include "input.h"

static int failures = 0;

static void failf(const char *fmt, ...) {
  va_list ap;
  va_start(ap, fmt);
  vprintf(fmt, ap);
  va_end(ap);
  printf("\n");
  failures++;
}

static int card_cmp_values(const void *a, const void *b) {
  const card_t *x = *(const card_t *const *)a;
  const card_t *y = *(const card_t *const *)b;
  if (x->value != y->value) return x->value < y->value ? 1 : -1;
  if (x->suit != y->suit) return (int)x->suit - (int)y->suit;
  return 0;
}

/* A card_t for the i-th probe card, built without card_from_num. */
static card_t probe_card(size_t i) {
  static const char values[13] = {'A', 'K', 'Q', 'J', '0', '9', '8',
                                  '7', '6', '5', '4', '3', '2'};
  static const char suits[4] = {'s', 'h', 'd', 'c'};
  return card_from_letters(values[i % 13], suits[(i / 13) % 4]);
}

static void print_cards(const card_t *const *cards, size_t n) {
  for (size_t i = 0; i < n; i++) {
    print_card(*cards[i]);
    printf(" ");
  }
  printf("\n");
}

int main(int argc, char **argv) {
  FILE *f;
  if (argc < 2 || strcmp(argv[1], "-") == 0) {
    f = stdin;
  } else {
    f = fopen(argv[1], "r");
    if (f == NULL) {
      printf("Could not open %s\n", argv[1]);
      return 1;
    }
  }

  future_cards_t *fc = malloc(sizeof(future_cards_t));
  if (fc == NULL) {
    printf("out of memory\n");
    return 1;
  }
  fc->decks = NULL;
  fc->n_decks = 0;

  size_t n_hands = 0;
  deck_t **hands = read_input(f, &n_hands, fc);
  if (hands == NULL && n_hands != 0) {
    failf("read_input returned NULL for %zu hands", n_hands);
  }

  printf("Here are the input hands:\n");
  for (size_t i = 0; i < n_hands; i++) {
    if (hands[i] == NULL) {
      failf("hand %zu is NULL", i);
      continue;
    }
    print_hand(hands[i]);
    printf("\n");
  }
  printf("%zu hands read\n", n_hands);

  /* The remaining deck: size, then the cards in a canonical order that does
     not depend on the student's card_from_num mapping. */
  deck_t *remaining = build_remaining_deck(hands, n_hands);
  printf("Here's the remaining deck:\n");
  if (remaining == NULL) {
    failf("build_remaining_deck returned NULL");
  } else {
    card_t **sorted = malloc(remaining->n_cards * sizeof(card_t *));
    if (sorted == NULL && remaining->n_cards > 0) {
      failf("out of memory");
    } else {
      for (size_t i = 0; i < remaining->n_cards; i++) {
        sorted[i] = remaining->cards[i];
      }
      qsort(sorted, remaining->n_cards, sizeof(card_t *), card_cmp_values);
      printf("%zu cards\n", remaining->n_cards);
      print_cards((const card_t *const *)sorted, remaining->n_cards);
      free(sorted);
    }
  }

  /* Fill the ?n placeholders from a deterministic probe deck. */
  size_t n_future = fc->n_decks;
  deck_t probe;
  probe.cards = NULL;
  probe.n_cards = 0;
  if (n_future > 52) {
    failf("the input asks for %zu future cards, which is more than a deck",
          n_future);
  } else {
    for (size_t i = 0; i < n_future; i++) {
      add_card_to(&probe, probe_card(i));
    }
    future_cards_from_deck(&probe, fc);
  }

  printf("And here are the resulting hands:\n");
  for (size_t i = 0; i < n_hands; i++) {
    if (hands[i] == NULL) continue;
    print_hand(hands[i]);
    printf("\n");
  }

  /* Tidy up: deck.c owns card_t/deck_t, the driver owns the fc bookkeeping. */
  if (remaining != NULL) free_deck(remaining);
  for (size_t i = 0; i < n_hands; i++) {
    if (hands[i] != NULL) free_deck(hands[i]);
  }
  free(hands);
  for (size_t i = 0; i < fc->n_decks; i++) {
    free(fc->decks[i].cards);
  }
  free(fc->decks);
  free(fc);
  /* `probe` lives on the stack, so free_deck() would free a non-heap
     pointer; release the pieces add_card_to allocated instead. */
  for (size_t i = 0; i < probe.n_cards; i++) {
    free(probe.cards[i]);
  }
  free(probe.cards);
  if (f != stdin) fclose(f);

  if (failures > 0) {
    printf("%d problem(s) found\n", failures);
    return 1;
  }
  return 0;
}
