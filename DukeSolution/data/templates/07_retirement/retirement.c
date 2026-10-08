#include <stdlib.h>
#include <stdio.h>

/* Step 2 of the README: a struct _retire_info with an int "months", a double
   "contribution" and a double "rate_of_return", plus a typedef making
   "retire_info" another name for it.  The names and types are spelled out
   here so the file compiles while you work. */
struct _retire_info {
  int months;
  double contribution;
  double rate_of_return;
};
typedef struct _retire_info retire_info;

// TODO: print the balance at the start of every month while working, then
//       every month while retired, in the format
//           "Age %3d month %2d you have $%.2lf\n"
//       (the first two conversions are the saver's age in years and months),
//       updating the balance each month by the rate of return and the monthly
//       contribution or spending.  Hint: the README suggests abstracting the
//       repeated part out into a helper function.
void retirement (int startAge, double initial, retire_info working, retire_info retired){
  (void)startAge;
  (void)initial;
  (void)working;
  (void)retired;
}

int main (void) {
  // TODO: fill in the working and retired retire_info values from step 4 of
  //       the README (489 months at $1000/month with a 4.5% annual rate, then
  //       384 months at -$4000/month with a 1% annual rate) and call
  //       retirement(327, 21345, working, retired).
  return EXIT_SUCCESS;
}
