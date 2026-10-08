/*
 * drivers/22_tests_power/power_recovered.c
 *
 * The *correct* implementation of
 *
 *     unsigned power(unsigned x, unsigned y);
 *
 * recovered from the teacher's object file that is linked into
 * `22_tests_power/test-power`.
 *
 * REFERENCE ONLY -- no config uses this file.  `configs/22_tests_power.json`
 * is `type: unsupported`, because the eleven *broken* objects the student's
 * harness has to catch are gone and `22_tests_power` contains no implementation
 * source at all; checking only the accept-the-correct half would report PASSED
 * for a harness that catches nothing.  This file is kept so that the recovered
 * implementation survives and can be linked as the "correct" subject if the
 * broken objects are ever restored.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * 22_tests_power/README points at `/usr/local/l2p/power/`, which held
 * `power.o` (correct) and eleven broken objects.  That directory does not exist
 * in this workspace and no copy of the objects survived, so the subjects cannot
 * be linked.  `22_tests_power/test-power` did survive: the student's harness
 * linked against the teacher's `power.o` (the ELF producer string names
 * `GCC 9.3.0` for test-power.c and `GCC 5.4.0` for the object, and the object's
 * STT_FILE symbol is `power.c`).  Disassembling that binary recovers the
 * teacher's implementation; see `re/elf/22_tests_power__test-power.md`.
 *
 * RECOVERED CODE (addresses from the report)
 * -----------------------------------------
 *   129a <ph>:     if (y == 0) return acc;
 *                  if (y & 1) return ph(x, y - 1, acc * x);
 *                  return ph(x * x, y >> 1, acc);
 *   12f9 <power>:  return ph(x, y, 1);
 * (`imull` at 12c3/12e7 is 32-bit unsigned arithmetic, so the wrap-around the
 * student's own test relies on -- power(-2, 3) == 4294967288 -- is preserved.)
 *
 * VALIDATION
 * ----------
 * Linked with the student's `test-power.c` this exits 0 and prints nothing --
 * exactly what the original 2024 grader recorded for the correct implementation.
 */

static unsigned ph(unsigned x, unsigned y, unsigned acc) {
  if (y == 0) return acc;
  if (y & 1) return ph(x, y - 1, acc * x);
  return ph(x * x, y >> 1, acc);
}

unsigned power(unsigned x, unsigned y) {
  return ph(x, y, 1);
}
