/*
 * Reconstructed grader driver for `c3prj2_eval` -- the `test-eval` program.
 *
 * Recovered from `re/elf/c3prj2_eval__test-eval.o.md`: the teacher's test
 * object survived in the assignment directory, with full strings, DWARF and
 * relocation-annotated disassembly, so every line of text below is the
 * original's, in the original's order, and the control flow mirrors the
 * disassembly of `describe_hand` and `main`.
 *
 *     main()                     @ 0x463, 803 bytes
 *     describe_hand(deck_t *)    @ 0x0,   1123 bytes
 *
 * Observed behaviour that is reproduced here exactly:
 *
 *   * `argc == 1` reads stdin, otherwise argv[1] is opened for reading and a
 *     failure prints `Could not open %s\n` on stderr and returns 1.
 *   * each input line is `hand1 ; hand2`; a line without `;` prints
 *     `Invalid input line: %s (no ; to split hands)\n` on stderr and is skipped;
 *     leading whitespace is skipped first and an all-whitespace line ends the
 *     run (the original `jmp`s to the getline test).
 *   * both hands are parsed, qsorted with the student's `card_ptr_comp`, then
 *     described; they are freed and re-parsed for `compare_hands`, which sorts
 *     them itself.  That re-parse is why a broken `card_from_letters` shows up
 *     twice per line.
 *   * `describe_hand` prints, in order: the hand, ` - No flush` or
 *     ` - Flush in suit %c`, one ` - Straight flush at index %zu` /
 *     ` - Straight at index %zu` line per index found, the largest match count,
 *     the secondary pair, `evaluate_hand`'s ranking and the five cards used.
 *     A hand longer than 8 cards prints `Warning: had has %zu cards (may behave
 *     oddly)\n` (sic -- the original's typo), and a duplicated card prints
 *     `Duplicated card in hand` + the card + ` at index %zu and %zu\n` on
 *     stderr and exits 1.
 *   * the comparison block prints `Comparison : `, `--------------`, then
 *     `Hand 1 wins!` / `Tie` / `Hand 2 wins!` and `============================`.
 *
 * The teacher's `input.o` (the source of `hand_from_string`) was not preserved;
 * the parser below is written from the strings and DWARF of
 * `re/elf/c2prj1_cards__input.o.md`, which is the same function at the same
 * course step.  It supports the plain `As`/`0d` card tokens these test cases
 * use; a `?n` future card is rejected loudly rather than dereferencing the NULL
 * `future_cards_t` the original passes.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <assert.h>
#include "cards.h"
#include "deck.h"
#include "eval.h"

/*
 * eval.h only declares evaluate_hand/compare_hands/get_match_counts: the
 * original test-eval.c relied on implicit declarations for the rest (gcc 9
 * merely warns), which clang rejects. The signatures are the ones in eval.c
 * and the README.
 */
int card_ptr_comp(const void *vp1, const void *vp2);
suit_t flush_suit(deck_t *hand);
unsigned get_largest_element(unsigned *arr, size_t n);
size_t get_match_index(unsigned *match_counts, size_t n, unsigned n_of_akind);
ssize_t find_secondary_pair(deck_t *hand, unsigned *match_counts, size_t match_idx);
int is_straight_at(deck_t *hand, size_t index, suit_t fs);

/* ---- hand_from_string (see header comment) ------------------------------ */

static deck_t *hand_from_string(const char *str) {
  if (str == NULL) {
    fprintf(stderr, "hand_from_string: NULL string\n");
    exit(EXIT_FAILURE);
  }
  deck_t *hand = malloc(sizeof(deck_t));
  if (hand == NULL) {
    fprintf(stderr, "out of memory\n");
    exit(EXIT_FAILURE);
  }
  hand->cards = NULL;
  hand->n_cards = 0;

  const char *where = str;
  while (*where != '\0') {
    while (isspace((unsigned char)*where)) {
      where++;
    }
    if (*where == '\0') {
      break;
    }
    if (*where == '?') {
      fprintf(stderr,
              "Future random cards (%s) not supported in this mode\n", where);
      exit(EXIT_FAILURE);
    }
    if (where[1] == '\0' || isspace((unsigned char)where[1])) {
      fprintf(stderr, "A card must be two letters (value and suit), got \"%s\"\n",
              where);
      exit(EXIT_FAILURE);
    }
    card_t c = card_from_letters(where[0], where[1]);
    add_card_to(hand, c);
    where += 2;
  }

  if (hand->n_cards < 5) {
    fprintf(stderr, "A hand must have at  least 5 cards (this one has %zu)\n",
            hand->n_cards);
    exit(EXIT_FAILURE);
  }
  return hand;
}

/* ---- describe_hand ------------------------------------------------------ */

static void describe_hand(deck_t *hand) {
  print_hand(hand);
  putchar('\n');

  if (hand->n_cards > 8) {
    printf("Warning: had has %zu cards (may behave oddly)\n", hand->n_cards);
  }

  /* Duplicated cards are fatal: the original reports both indices. */
  for (size_t i = 0; i < hand->n_cards; i++) {
    for (size_t j = i + 1; j < hand->n_cards; j++) {
      if (hand->cards[i]->value == hand->cards[j]->value &&
          hand->cards[i]->suit == hand->cards[j]->suit) {
        fwrite("Duplicated card in hand", 1, 23, stderr);
        print_card(*hand->cards[i]);
        printf(" at index %zu and %zu\n", i, j);
        exit(EXIT_FAILURE);
      }
    }
  }

  suit_t fs = flush_suit(hand);
  if (fs == NUM_SUITS) {
    puts(" - No flush");
  } else {
    card_t probe;
    probe.value = 10;
    probe.suit = fs;
    printf(" - Flush in suit %c\n", suit_letter(probe));
  }

  for (size_t i = 0; i <= hand->n_cards - 5; i++) {
    if (fs != NUM_SUITS && is_straight_at(hand, i, fs)) {
      printf(" - Straight flush at index %zu\n", i);
    } else if (is_straight_at(hand, i, NUM_SUITS)) {
      printf(" - Straight at index %zu\n", i);
    }
  }

  unsigned *match_counts = get_match_counts(hand);
  unsigned n_of_a_kind = get_largest_element(match_counts, hand->n_cards);
  assert(n_of_a_kind <= 4);
  size_t match_idx = get_match_index(match_counts, hand->n_cards, n_of_a_kind);
  ssize_t other_pair_idx = find_secondary_pair(hand, match_counts, match_idx);
  free(match_counts);

  printf(" - The most of a kind is %d of a kind (at index %zu / value %c)\n",
         n_of_a_kind, match_idx, value_letter(*hand->cards[match_idx]));

  if (other_pair_idx >= 0) {
    printf(" - Secondary pair at index %zd (value %c)\n", other_pair_idx,
           value_letter(*hand->cards[other_pair_idx]));
  } else {
    puts(" - No secondary pair");
  }

  hand_eval_t eval = evaluate_hand(hand);
  printf(" - evaluate_hand's ranking: %s\n", ranking_to_string(eval.ranking));
  printf(" - 5 cards used for hand: ");
  deck_t best;
  best.cards = eval.cards;
  best.n_cards = 5;
  print_hand(&best);
  putchar('\n');
}

/* ---- main --------------------------------------------------------------- */

int main(int argc, char **argv) {
  FILE *f;
  if (argc == 1) {
    f = stdin;
  } else {
    f = fopen(argv[1], "r");
    if (f == NULL) {
      fprintf(stderr, "Could not open %s\n", argv[1]);
      return 1;
    }
  }

  char *line = NULL;
  size_t sz = 0;
  while (getline(&line, &sz, f) > 0) {
    char *where = line;
    while (isspace((unsigned char)*where) && *where != '\0') {
      where++;
    }
    if (*where == '\0') {
      continue;
    }

    char *semi = strchr(where, ';');
    if (semi == NULL) {
      fprintf(stderr, "Invalid input line: %s (no ; to split hands)\n", where);
      continue;
    }
    *semi = '\0';
    semi++;

    deck_t *hand1 = hand_from_string(where);
    deck_t *hand2 = hand_from_string(semi);
    qsort(hand1->cards, hand1->n_cards, sizeof(card_t *), card_ptr_comp);
    qsort(hand2->cards, hand2->n_cards, sizeof(card_t *), card_ptr_comp);

    puts("Hand 1:");
    puts("--------");
    describe_hand(hand1);
    puts("Hand 2:");
    puts("--------");
    describe_hand(hand2);
    free_deck(hand1);
    free_deck(hand2);

    hand1 = hand_from_string(where);
    hand2 = hand_from_string(semi);
    int cmp = compare_hands(hand1, hand2);

    puts("Comparison : ");
    puts("--------------");
    if (cmp > 0) {
      puts("Hand 1 wins!");
    } else if (cmp == 0) {
      puts("Tie");
    } else {
      puts("Hand 2 wins!");
    }
    free_deck(hand1);
    free_deck(hand2);
    puts("============================");
  }

  free(line);
  if (f != stdin) {
    fclose(f);
  }
  return 0;
}
