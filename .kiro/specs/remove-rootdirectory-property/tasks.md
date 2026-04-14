# Implementation Plan

- [-] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - rootDirectory Present in vercel.json
  - **CRITICAL**: This test MUST FAIL on unfixed code — failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior — it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to the concrete failing case: `vercel.json` contains `rootDirectory`
  - Test that parsing `vercel.json` and checking `"rootDirectory" in config` returns `false` (from Bug Condition in design: `isBugCondition(config)` returns true when `rootDirectory` is present)
  - Run test on UNFIXED code — expect FAILURE (this confirms the bug exists)
  - Document counterexamples found (e.g., `vercel.json` = `{"rootDirectory": "nailtech"}` → `rootDirectory` key is present, bug condition holds)
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - No Other Keys Removed
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: current `vercel.json` contains only `rootDirectory` — no other keys present
  - Write property-based test: for all valid `vercel.json` configs without `rootDirectory`, the fixed file preserves all other keys unchanged
  - Verify test passes on UNFIXED code (baseline: no other keys exist to be removed)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2_

- [ ] 3. Fix: remove rootDirectory from vercel.json

  - [ ] 3.1 Implement the fix
    - Remove the `"rootDirectory": "nailtech"` key-value pair from `vercel.json`
    - Result: `vercel.json` becomes `{}` (empty object), which is valid and uses Vercel defaults
    - _Bug_Condition: isBugCondition(config) where `"rootDirectory" IN keys(config)`_
    - _Expected_Behavior: fixed vercel.json does NOT contain `rootDirectory`; Vercel accepts config_
    - _Preservation: all other valid keys in vercel.json (currently none) remain unchanged_
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [ ] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - rootDirectory Absent After Fix
    - **IMPORTANT**: Re-run the SAME test from task 1 — do NOT write a new test
    - The test from task 1 asserts `rootDirectory` is absent; it should now pass
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2_

  - [ ] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - No Other Keys Removed
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [ ] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
