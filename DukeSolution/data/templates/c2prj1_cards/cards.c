#include <stdio.h>
#include <assert.h>
#include <stdlib.h>
#include "cards.h"

void assert_card_valid(card_t c) {
  //WRITE ME
}

const char * ranking_to_string(hand_ranking_t r) {
  //WRITE ME
  return "";
}

char value_letter(card_t c) {
  //WRITE ME
  return '?';
}

char suit_letter(card_t c) {
  //WRITE ME
  return '?';
}

void print_card(card_t c) {
  //WRITE ME
}

card_t card_from_letters(char value_let, char suit_let) {
  //WRITE ME
  card_t temp;
  temp.value = 0;
  temp.suit = 0;
  return temp;
}

card_t card_from_num(unsigned c) {
  //WRITE ME
  card_t temp;
  temp.value = 0;
  temp.suit = 0;
  return temp;
}
