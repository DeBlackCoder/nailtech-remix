/**
 * Property 1: Bug Condition — rootDirectory Present in vercel.json
 *
 * CRITICAL: This test MUST FAIL on unfixed code.
 * Failure confirms the bug exists (isBugCondition returns true).
 * After the fix is applied, this test MUST PASS.
 *
 * Bug Condition: "rootDirectory" IN keys(vercel.json)
 * Expected Behavior: "rootDirectory" NOT IN keys(vercel.json)
 */

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const vercelJsonPath = path.resolve(process.cwd(), "vercel.json");

// --- helpers ---

function isBugCondition(config) {
  return "rootDirectory" in config;
}

// --- test ---

const raw = fs.readFileSync(vercelJsonPath, "utf8");
const config = JSON.parse(raw);

// Scoped PBT: concrete failing case — the current vercel.json
const bugPresent = isBugCondition(config);

console.log("vercel.json contents:", config);
console.log("isBugCondition:", bugPresent);

if (bugPresent) {
  console.log(
    'Counterexample found: vercel.json contains "rootDirectory" =',
    config.rootDirectory
  );
  console.log(
    'Deployment would be rejected with: "Invalid request: should NOT have additional property \'rootDirectory\'."'
  );
}

// Assert the bug condition does NOT hold (will FAIL on unfixed code)
assert.equal(
  bugPresent,
  false,
  `Bug condition holds: vercel.json contains "rootDirectory": "${config.rootDirectory}". ` +
    `Remove this property to fix the deployment error.`
);

console.log('PASS: "rootDirectory" is absent from vercel.json.');
