int max (int num1, int num2) {
  //check if num1 is greater than num2
    //if so, your answer is num1
    //otherwise, your answer is num2
  // TODO: translate the three comment lines above into code.  There is
  //       deliberately no code here yet; ./test.sh will tell you whether the
  //       syntax is legal once you have written it.
}

int main(void) {
  printf("max(42, -69) is %d\n", max(42, -69));
  printf("max(33, 0) is %d\n", max(33, 0));
  printf("max(0x123456, 123456) is %d\n", max(0x123456, 123456));
  //compute the max of 0x451215AF and 0x913591AF and print it out as a decimal number
  // TODO: add one more print statement, in the same style as the three above,
  //       that prints the max of those two hexadecimal numbers.
  return 0;
}
