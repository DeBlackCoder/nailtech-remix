# Remove rootDirectory Property Bugfix Design

## Overview

`vercel.json` at the repository root contains `{"rootDirectory": "nailtech"}`. Vercel rejects this configuration with the error `"Invalid request: should NOT have additional property 'rootDirectory'."` because `rootDirectory` is not a valid property in a `vercel.json` file — it is a Vercel Dashboard project setting only. The Next.js project files (`package.json`, `app/`, etc.) already live at the repository root, so the property is both unsupported and incorrect. The fix is to remove the `rootDirectory` property from `vercel.json`.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug — `vercel.json` contains the `rootDirectory` property
- **Property (P)**: The desired behavior when the bug condition is absent — Vercel accepts the configuration and deploys successfully
- **Preservation**: Any remaining valid Vercel configuration in `vercel.json` and the deployed application behavior must remain unchanged
- **vercel.json**: The Vercel configuration file at the repository root that controls deployment settings
- **rootDirectory**: A Vercel Dashboard-only project setting that cannot appear in `vercel.json`; its presence causes Vercel to reject the deployment

## Bug Details

### Bug Condition

The bug manifests when Vercel reads `vercel.json` and finds the `rootDirectory` property. Vercel's schema validation rejects any `vercel.json` that contains this property, regardless of its value, because it is not part of the `vercel.json` schema.

**Formal Specification:**
```
FUNCTION isBugCondition(config)
  INPUT: config — parsed contents of vercel.json
  OUTPUT: boolean

  RETURN "rootDirectory" IN keys(config)
END FUNCTION
```

### Examples

- `vercel.json` = `{"rootDirectory": "nailtech"}` → Vercel rejects deployment with schema validation error (bug present)
- `vercel.json` = `{}` → Vercel accepts configuration and proceeds with deployment (bug absent)
- `vercel.json` = `{"framework": "nextjs"}` → Vercel accepts configuration (bug absent, other properties unaffected)
- `vercel.json` does not exist → Vercel uses defaults and deploys successfully (bug absent)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Any other valid Vercel configuration properties present in `vercel.json` must continue to be applied
- The deployed Next.js application must continue to serve correctly after the fix
- The `nailtech/` directory (empty) at the repository root is unaffected by this change

**Scope:**
All Vercel configuration that does NOT involve the `rootDirectory` property should be completely unaffected by this fix. This includes:
- Any `headers`, `redirects`, `rewrites`, or `env` settings (none currently present, but must remain safe to add)
- The Next.js build and runtime behavior
- All application routes and static assets served from the repository root

## Hypothesized Root Cause

Based on the bug description, the most likely cause is:

1. **Misconfigured vercel.json**: The `rootDirectory` property was added to `vercel.json` under the mistaken assumption that it is a valid file-level configuration key. In reality, `rootDirectory` is a Vercel Dashboard project setting and is not part of the `vercel.json` schema. Vercel's API enforces strict schema validation and rejects any deployment where `vercel.json` contains unrecognised properties.

2. **Project name confusion**: The project is named `nailtech` in `package.json` and an empty `nailtech/` directory exists at the root, which may have led to the belief that the Next.js source lives inside `nailtech/`. In fact, all source files (`app/`, `public/`, `package.json`, etc.) are at the repository root.

## Correctness Properties

Property 1: Bug Condition - rootDirectory Removal Allows Deployment

_For any_ `vercel.json` where the bug condition holds (isBugCondition returns true — the file contains the `rootDirectory` property), the fixed `vercel.json` SHALL NOT contain the `rootDirectory` property, causing Vercel to accept the configuration and proceed with deployment without a schema validation error.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation - Remaining Configuration Unchanged

_For any_ `vercel.json` content where the bug condition does NOT hold (isBugCondition returns false — no `rootDirectory` property present), the fixed `vercel.json` SHALL produce the same Vercel deployment behavior as a configuration without the property, preserving all other valid settings and the deployed application's runtime behavior.

**Validates: Requirements 3.1, 3.2**

## Fix Implementation

### Changes Required

**File**: `vercel.json`

**Specific Changes**:
1. **Remove `rootDirectory` property**: Delete the `"rootDirectory": "nailtech"` key-value pair from `vercel.json`.
   - After the fix, `vercel.json` will be `{}` (an empty object), which is valid and tells Vercel to use all defaults.
   - Alternatively, the file can be deleted entirely since it contains no other configuration — either approach resolves the bug.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, confirm the bug condition is present in the current file, then verify the fix removes it and that no other configuration is lost.

### Exploratory Bug Condition Checking

**Goal**: Surface the bug by confirming `vercel.json` currently contains `rootDirectory` and that this causes a Vercel schema validation failure.

**Test Plan**: Inspect `vercel.json` and assert that `rootDirectory` is present. Optionally, run `vercel deploy --prebuilt` or use the Vercel CLI's `--dry-run` to observe the rejection error on the unfixed file.

**Test Cases**:
1. **Schema Presence Test**: Parse `vercel.json` and assert `"rootDirectory" in config` returns `true` (will pass on unfixed file, confirming bug condition)
2. **Deployment Rejection Test**: Attempt a Vercel deployment with the unfixed `vercel.json` and assert the error message contains `"should NOT have additional property 'rootDirectory'"` (will fail/error on unfixed code, confirming bug)

**Expected Counterexamples**:
- `vercel.json` contains `rootDirectory` key → deployment is rejected
- Possible causes: property added manually, copied from incorrect documentation, or confused with Dashboard settings

### Fix Checking

**Goal**: Verify that after the fix, `vercel.json` does not contain `rootDirectory` and Vercel accepts the configuration.

**Pseudocode:**
```
FOR ALL config WHERE isBugCondition(config) DO
  fixedConfig := removeProperty(config, "rootDirectory")
  ASSERT NOT ("rootDirectory" IN keys(fixedConfig))
  ASSERT vercelAcceptsConfig(fixedConfig)
END FOR
```

### Preservation Checking

**Goal**: Verify that no other valid configuration is removed and the deployed application continues to work correctly.

**Pseudocode:**
```
FOR ALL config WHERE NOT isBugCondition(config) DO
  ASSERT fixedVercelJson(config) = originalVercelJson(config)
END FOR
```

**Testing Approach**: Because `vercel.json` currently contains only the one invalid property, preservation checking is straightforward — the fixed file should be an empty object `{}` with no other keys removed. A simple structural diff confirms this.

**Test Cases**:
1. **No Other Keys Removed**: Assert that all keys in the fixed `vercel.json` (excluding `rootDirectory`) match the original — currently none, so the fixed file is `{}`
2. **Application Serves Correctly**: After deploying the fixed configuration, verify the Next.js application responds correctly on the Vercel deployment URL
3. **Valid JSON Preserved**: Assert the fixed `vercel.json` is valid JSON and passes Vercel schema validation

### Unit Tests

- Parse `vercel.json` and assert `rootDirectory` key is absent after fix
- Assert the fixed file is valid JSON
- Assert no other properties were inadvertently removed

### Property-Based Tests

- Generate arbitrary valid `vercel.json` configurations (without `rootDirectory`) and verify they are accepted by Vercel schema validation unchanged
- Generate configurations with `rootDirectory` present and verify the fix removes exactly that key and no others

### Integration Tests

- Deploy the fixed configuration to Vercel and verify the deployment succeeds without schema errors
- Verify the deployed Next.js application serves the expected pages after the fix
- Verify that re-adding `rootDirectory` to `vercel.json` reproduces the original error (regression guard)
