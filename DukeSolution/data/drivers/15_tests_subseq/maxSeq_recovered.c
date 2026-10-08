/*
 * drivers/15_tests_subseq/maxSeq_recovered.c
 *
 * The *correct* implementation of
 *
 *     size_t maxSeq(int *array, size_t n);
 *
 * recovered from the teacher's object file that is linked into
 * `15_tests_subseq/test-subseq`.
 *
 * REFERENCE ONLY -- no config uses this file.  `configs/15_tests_subseq.json`
 * is `type: unsupported`, because the eleven *broken* objects the student's
 * harness has to catch are gone; checking only the accept-the-correct half
 * would report PASSED for a harness that catches nothing.  This file is kept so
 * that the recovered implementation survives and can be linked as the "correct"
 * subject if the broken objects are ever restored.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * 15_tests_subseq/README points at `/usr/local/l2p/subseq/`, which held one
 * correct and eleven broken object files.  That directory does not exist in
 * this workspace and no copy of the objects survived, so the subjects cannot be
 * linked.  What *did* survive is `15_tests_subseq/test-subseq`: the student's
 * harness linked against one of the teacher's objects (the ELF producer string
 * names two toolchains, `GCC 9.3.0` for test-subseq.c and `GCC 5.4.0` for the
 * object, while `15_tests_subseq/maxSeq.o` was built by the student's own
 * GCC 9.3.0).  Disassembling that binary recovers the teacher's implementation
 * byte-for-byte; see `re/elf/15_tests_subseq__test-subseq.md`.
 *
 * RECOVERED CODE (addresses from the report)
 * -----------------------------------------
 *   16a2 <subseq_at>:  i = start + 1;
 *                      while (i < n && array[i] > array[i - 1]) i++;
 *                      return i - start;
 *   1707 <maxSeq>:     best = 0;
 *                      for (i = 0; i < n; i++) { len = subseq_at(array, i, n);
 *                                                if (len > best) best = len; }
 *                      return best;
 * (`cmpq`/`jbe` at 1748 make the comparison unsigned, i.e. `size_t`.)
 *
 * VALIDATION
 * ----------
 * Linked with the student's `test-subseq.c` this exits 0 and prints nothing --
 * exactly what the original 2024 grader recorded for the correct implementation
 * ("**Testing correct implementation **" with no failure output).
 */

#include <stddef.h>

static size_t subseq_at(int *array, size_t start, size_t n) {
  size_t i = start + 1;
  while (i < n && array[i] > array[i - 1]) {
    i++;
  }
  return i - start;
}

size_t maxSeq(int *array, size_t n) {
  size_t best = 0;
  for (size_t i = 0; i < n; i++) {
    size_t len = subseq_at(array, i, n);
    if (len > best) best = len;
  }
  return best;
}
