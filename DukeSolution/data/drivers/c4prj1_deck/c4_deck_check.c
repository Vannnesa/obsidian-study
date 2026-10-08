/*
 * Reconstructed grader driver for `c4prj1_deck` -- the deck/eval functions that
 * need malloc/realloc/free.
 *
 * The 2024 grader's own test object did not survive anywhere in the workspace
 * (the `test-deck.o` in the directory is the *student's* own test-deck.c, as
 * re/elf/c4prj1_deck__test-deck.o.md shows: it prints `testDeck length is now
 * %zu`, `%d ` and `\nFreeing memory...`, i.e. exactly c4prj1_deck/test-deck.c).
 * The checklist below is taken verbatim from
 * re/original-grade-txt/c4prj1_deck.grade.txt, which names each function the
 * grader exercised:
 *
 *     Testing free_deck(deck_t *)
 *     Testing add_card_to(deck_t *, card_t)
 *     Testing add_empty_card(deck_t *)
 *     Testing make_deck_exclude(deck_t *)
 *     Testing build_remaining_deck(deck_t **, size_t)   (with 1..6 hands)
 *     Testing get_match_count(deck_t *)                 (the original's typo)
 *
 * Every requirement asserted here is quoted from `c4prj1_deck/README`:
 *   - add_card_to "will involve reallocing the array of cards in that deck";
 *   - add_empty_card adds "a card whose value and suit are both 0, and return a
 *     pointer to it in the deck";
 *   - make_deck_exclude creates "a deck that is full EXCEPT for all the cards
 *     that appear in excluded_cards" (the README's Kh/Qs example gives 50);
 *   - build_remaining_deck "builds the deck of cards that remain after those
 *     cards have been removed from a full deck" (the README's two-hand example
 *     with four unknown cards gives 48);
 *   - free_deck frees "all the memory allocated by make_excluded_deck";
 *   - get_match_counts returns the hand's example `2 2 2 2 1 3 3 3`.
 *
 * `card_from_num`'s mapping is explicitly the student's choice (c2prj1_cards
 * README), so every check is expressed through the student's own card_from_num
 * and is therefore independent of that choice.
 *
 * The driver is linked with the memory checker, so a free_deck that does not
 * actually free is caught as leaked allocations rather than passing silently.
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <string.h>
#include "cards.h"
#include "deck.h"
#include "eval.h"

/* eval.h declares get_match_counts; the Course-3 helpers live in eval.c. */
unsigned *get_match_counts(deck_t *hand);

static int failures = 0;

static void fail(const char *msg) {
  printf("%s\n", msg);
  failures++;
}

static void failf(const char *fmt, ...) {
  va_list ap;
  va_start(ap, fmt);
  vprintf(fmt, ap);
  va_end(ap);
  printf("\n");
  failures++;
}

static void check_match_case(const char *const *cards, size_t n,
                             const unsigned *want, const char *name);

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

/* ---- 1. free_deck ------------------------------------------------------- */

static void check_free_deck(void) {
  /* An empty deck: cards is NULL, so free_deck must tolerate free(NULL). */
  deck_t *empty = new_deck();
  free_deck(empty);

  /* A deck built one card at a time. */
  deck_t *small = new_deck();
  add_card_to(small, card_of("As"));
  add_card_to(small, card_of("Kh"));
  add_card_to(small, card_of("0d"));
  add_card_to(small, card_of("2c"));
  add_card_to(small, card_of("9s"));
  free_deck(small);

  /* A full 52-card deck, which is the size make_deck_exclude returns. */
  deck_t *full = new_deck();
  for (unsigned i = 0; i < 52; i++) {
    add_card_to(full, card_from_num(i));
  }
  free_deck(full);

  /* Several decks in a row, so a free_deck that only frees the struct is
     caught as a leak by the memory checker rather than passing silently. */
  for (int i = 0; i < 8; i++) {
    deck_t *d = new_deck();
    for (int j = 0; j < 13; j++) {
      add_card_to(d, card_from_num((unsigned)(i * 3 + j)));
    }
    free_deck(d);
  }
}

/* ---- 2. add_card_to ------------------------------------------------------ */

static void check_add_card_to(void) {
  deck_t *d = new_deck();
  if (d->n_cards != 0) fail("a fresh deck should have no cards");

  static const char *cards[] = {"As", "As", "Kh", "0d", "2c", "9s", "Jh", "Qc"};
  int n = (int)(sizeof(cards) / sizeof(cards[0]));
  for (int i = 0; i < n; i++) {
    card_t c = card_of(cards[i]);
    add_card_to(d, c);
    if (d->n_cards != (size_t)(i + 1)) {
      failf("after adding %d card(s) n_cards is %zu; expected %d", i + 1,
            d->n_cards, i + 1);
      free_deck(d);
      return;
    }
  }
  for (int i = 0; i < n; i++) {
    card_t want = card_of(cards[i]);
    card_t *got = d->cards[i];
    if (got == NULL) {
      failf("cards[%d] is NULL", i);
      continue;
    }
    if (got->value != want.value || got->suit != want.suit) {
      failf("cards[%d] is value %u suit %d; expected value %u suit %d", i,
            got->value, (int)got->suit, want.value, (int)want.suit);
    }
  }

  /* Growing past the first reallocation: all 52 values one card at a time. */
  deck_t *big = new_deck();
  for (unsigned i = 0; i < 52; i++) {
    add_card_to(big, card_from_num(i));
  }
  if (big->n_cards != 52) {
    failf("a deck with 52 add_card_to calls has %zu cards", big->n_cards);
  } else {
    for (unsigned i = 0; i < 52; i++) {
      card_t want = card_from_num(i);
      if (big->cards[i]->value != want.value ||
          big->cards[i]->suit != want.suit) {
        failf("card %u changed value/suit after the array was reallocated", i);
        break;
      }
    }
  }
  free_deck(d);
  free_deck(big);
}

/* ---- 3. add_empty_card --------------------------------------------------- */

static void check_add_empty_card(void) {
  deck_t *d = new_deck();
  add_card_to(d, card_of("As"));
  add_card_to(d, card_of("Kh"));
  add_card_to(d, card_of("Qd"));

  card_t *empty = add_empty_card(d);
  if (empty == NULL) {
    fail("add_empty_card returned NULL");
    free_deck(d);
    return;
  }
  if (d->n_cards != 4) {
    failf("add_empty_card left n_cards at %zu; expected 4", d->n_cards);
  }
  if (empty->value != 0 || empty->suit != 0) {
    failf("add_empty_card made value %u suit %d; expected 0/0", empty->value,
          (int)empty->suit);
  }
  if (d->n_cards == 4 && empty != d->cards[3]) {
    fail("add_empty_card did not return a pointer into the deck's array "
         "(future cards are filled in through it)");
  }
  /* Writing through the returned pointer must change the card in the deck:
     that is what future_cards_from_deck relies on. */
  if (d->n_cards == 4) {
    empty->value = VALUE_ACE;
    empty->suit = SPADES;
    if (d->cards[3]->value != VALUE_ACE || d->cards[3]->suit != SPADES) {
      fail("writing through add_empty_card's pointer did not update the deck");
    }
  }

  /* Two placeholders in a row, and a placeholder as the very first card. */
  card_t *first = add_empty_card(d);
  card_t *second = add_empty_card(d);
  if (first == NULL || second == NULL || first == second) {
    fail("two add_empty_card calls did not return two distinct placeholders");
  }
  if (d->n_cards != 6) {
    failf("after two more placeholders n_cards is %zu; expected 6", d->n_cards);
  }
  free_deck(d);
}

/* ---- shared helper: is `c` in `d`? -------------------------------------- */

static int contains_card(deck_t *d, card_t c) {
  for (size_t i = 0; i < d->n_cards; i++) {
    if (d->cards[i] != NULL && d->cards[i]->value == c.value &&
        d->cards[i]->suit == c.suit) {
      return 1;
    }
  }
  return 0;
}

/* ---- 4. make_deck_exclude ------------------------------------------------ */

static void check_make_deck_exclude(void) {
  /* Nothing excluded: the full deck. */
  deck_t *nothing = new_deck();
  deck_t *full = make_deck_exclude(nothing);
  if (full == NULL) {
    fail("make_deck_exclude(NULL-like deck) returned NULL");
  } else {
    if (full->n_cards != 52) {
      failf("excluding nothing left %zu cards; expected 52", full->n_cards);
    }
    for (unsigned i = 0; i < 52; i++) {
      card_t c = card_from_num(i);
      if (!contains_card(full, c)) {
        failf("excluding nothing dropped one of the 52 cards (card_from_num(%u))",
              i);
        break;
      }
    }
    free_deck(full);
  }

  /* The README's example: excluding Kh and Qs leaves 50 cards. */
  deck_t *excluded = new_deck();
  add_card_to(excluded, card_of("Kh"));
  add_card_to(excluded, card_of("Qs"));
  deck_t *rest = make_deck_exclude(excluded);
  if (rest == NULL) {
    fail("make_deck_exclude returned NULL");
  } else {
    if (rest->n_cards != 50) {
      failf("excluding Kh and Qs left %zu cards; expected 50", rest->n_cards);
    }
    if (contains_card(rest, card_of("Kh")) || contains_card(rest, card_of("Qs"))) {
      fail("make_deck_exclude kept a card it was told to exclude");
    }
    if (!contains_card(rest, card_of("As"))) {
      fail("make_deck_exclude dropped a card it was not told to exclude");
    }
    for (unsigned i = 0; i < 52; i++) {
      card_t c = card_from_num(i);
      int should_be_there = !(c.value == VALUE_KING && c.suit == HEARTS) &&
                            !(c.value == VALUE_QUEEN && c.suit == SPADES);
      if (contains_card(rest, c) != should_be_there) {
        failf("make_deck_exclude is wrong about card_from_num(%u)", i);
        break;
      }
    }
    free_deck(rest);
  }

  /* Excluding the whole deck leaves nothing. */
  deck_t *all = new_deck();
  for (unsigned i = 0; i < 52; i++) {
    add_card_to(all, card_from_num(i));
  }
  deck_t *none = make_deck_exclude(all);
  if (none == NULL) {
    fail("make_deck_exclude(full deck) returned NULL");
  } else {
    if (none->n_cards != 0) {
      failf("excluding all 52 cards left %zu cards", none->n_cards);
    }
    free_deck(none);
  }

  free_deck(nothing);
  free_deck(excluded);
  free_deck(all);
}

/* ---- 5. build_remaining_deck -------------------------------------------- */

/* The README's two-hand example: Kh Qs ?0..?4 and As Ac ?0..?4 -> 48 cards. */
static void check_remaining_example(void) {
  deck_t *hand1 = new_deck();
  add_card_to(hand1, card_of("Kh"));
  add_card_to(hand1, card_of("Qs"));
  for (int i = 0; i < 5; i++) {
    add_empty_card(hand1);
  }
  deck_t *hand2 = new_deck();
  add_card_to(hand2, card_of("As"));
  add_card_to(hand2, card_of("Ac"));
  for (int i = 0; i < 5; i++) {
    add_empty_card(hand2);
  }
  deck_t *hands[2] = {hand1, hand2};
  deck_t *rest = build_remaining_deck(hands, 2);
  if (rest == NULL) {
    fail("build_remaining_deck returned NULL");
  } else {
    if (rest->n_cards != 48) {
      failf("the README's two-hand example left %zu cards; expected 48 (the "
            "four unknown cards must not be treated as real cards)",
            rest->n_cards);
    }
    if (contains_card(rest, card_of("Kh")) || contains_card(rest, card_of("Qs")) ||
        contains_card(rest, card_of("As")) || contains_card(rest, card_of("Ac"))) {
      fail("build_remaining_deck kept a card that is in a hand");
    }
    free_deck(rest);
  }
  free_deck(hand1);
  free_deck(hand2);
}

/* n hands of distinct known cards, plus placeholders in every hand. */
static void check_remaining_n_hands(size_t n_hands) {
  deck_t **hands = malloc(n_hands * sizeof(deck_t *));
  if (hands == NULL) {
    fail("out of memory");
    return;
  }
  unsigned next_num = 0;
  unsigned used[52];
  size_t n_used = 0;
  int bad = 0;

  for (size_t h = 0; h < n_hands; h++) {
    hands[h] = new_deck();
    for (int k = 0; k < 5; k++) {
      if (next_num >= 52) {
        bad = 1;
        break;
      }
      card_t c = card_from_num(next_num++);
      add_card_to(hands[h], c);
      used[n_used++] = next_num - 1;
    }
    add_empty_card(hands[h]); /* every hand also carries a ? card */
    add_empty_card(hands[h]);
  }
  if (!bad) {
    deck_t *rest = build_remaining_deck(hands, n_hands);
    if (rest == NULL) {
      failf("build_remaining_deck(%zu hands) returned NULL", n_hands);
    } else {
      size_t expected = 52 - n_used;
      if (rest->n_cards != expected) {
        failf("build_remaining_deck with %zu hands left %zu cards; expected %zu",
              n_hands, rest->n_cards, expected);
      }
      for (size_t i = 0; i < n_used; i++) {
        card_t c = card_from_num(used[i]);
        if (contains_card(rest, c)) {
          failf("build_remaining_deck with %zu hands kept a card that is in a "
                "hand",
                n_hands);
          break;
        }
      }
      free_deck(rest);
    }
  }
  for (size_t h = 0; h < n_hands; h++) {
    free_deck(hands[h]);
  }
  free(hands);
}

static void check_build_remaining_deck(void) {
  check_remaining_example();
  for (size_t n = 1; n <= 6; n++) {
    check_remaining_n_hands(n);
  }
}

/* ---- 6. get_match_counts ------------------------------------------------- */

static void check_get_match_counts(void) {
  /* The README's example: Ks Kh Qs Qh 0s 9d 9c 9h -> 2 2 2 2 1 3 3 3 */
  {
    static const char *hand[] = {"Ks", "Kh", "Qs", "Qh", "0s", "9d", "9c", "9h"};
    static const unsigned want[] = {2, 2, 2, 2, 1, 3, 3, 3};
    check_match_case(hand, 8, want, "the README's Ks Kh Qs Qh 0s 9d 9c 9h");
  }
  {
    static const char *hand[] = {"As"};
    static const unsigned want[] = {1};
    check_match_case(hand, 1, want, "a one-card hand");
  }
  {
    static const char *hand[] = {"7s", "7h", "7d", "7c"};
    static const unsigned want[] = {4, 4, 4, 4};
    check_match_case(hand, 4, want, "four of a kind");
  }
  {
    static const char *hand[] = {"As", "Kh", "Qd", "Jc", "9s"};
    static const unsigned want[] = {1, 1, 1, 1, 1};
    check_match_case(hand, 5, want, "five different values");
  }
  {
    static const char *hand[] = {"As", "Ac", "Kh", "Kd", "9s", "9h", "9d"};
    static const unsigned want[] = {2, 2, 2, 2, 3, 3, 3};
    check_match_case(hand, 7, want, "two pairs and three of a kind");
  }
}

static void check_match_case(const char *const *cards, size_t n,
                             const unsigned *want, const char *name) {
  deck_t *hand = new_deck();
  for (size_t i = 0; i < n; i++) {
    add_card_to(hand, card_of(cards[i]));
  }
  unsigned *got = get_match_counts(hand);
  if (got == NULL) {
    failf("get_match_counts returned NULL for %s", name);
    free_deck(hand);
    return;
  }
  for (size_t i = 0; i < n; i++) {
    if (got[i] != want[i]) {
      failf("get_match_counts is wrong for %s: index %zu is %u, expected %u",
            name, i, got[i], want[i]);
      break;
    }
  }
  free(got);
  free_deck(hand);
}

/* ---- entry point -------------------------------------------------------- */

int main(int argc, char **argv) {
  if (argc < 2) {
    printf("no check name given\n");
    return 1;
  }
  const char *which = argv[1];

  if (strcmp(which, "free_deck") == 0) {
    check_free_deck();
  } else if (strcmp(which, "add_card_to") == 0) {
    check_add_card_to();
  } else if (strcmp(which, "add_empty_card") == 0) {
    check_add_empty_card();
  } else if (strcmp(which, "make_deck_exclude") == 0) {
    check_make_deck_exclude();
  } else if (strcmp(which, "build_remaining_deck") == 0) {
    check_build_remaining_deck();
  } else if (strcmp(which, "get_match_counts") == 0) {
    check_get_match_counts();
  } else {
    printf("unknown check \"%s\"\n", which);
    return 1;
  }

  if (failures > 0) {
    printf("%d problem(s) found\n", failures);
    return 1;
  }
  return 0;
}
