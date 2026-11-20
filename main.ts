// gta6-meme-x-01 entry runner (Node 22, standard library only).
//
// The real entry is the public X post named in POST.json: a GTA 6 meme
// whose picture carries the make.fun ghost and whose text carries the
// bounty link and our play code. This program's single job is to hand
// that address to the grader by copying POST.json into the output
// directory, and to fail loudly when the file is missing or malformed.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const sourcePath = join(botDir, "POST.json");
const targetPath = join(outputDir, "POST.json");

function fail(message: string): never {
  console.error(`gta6-meme-x-01: ${message}`);
  process.exit(1);
}

if (!existsSync(sourcePath)) {
  fail(`POST.json not found in ${botDir}`);
}

let parsed: { url?: unknown };
try {
  parsed = JSON.parse(readFileSync(sourcePath, "utf8"));
} catch (err) {
  fail(`POST.json is not valid JSON: ${(err as Error).message}`);
}

if (typeof parsed!.url !== "string" || !parsed!.url.startsWith("https://x.com/")) {
  fail("POST.json must carry an https://x.com/ post url");
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(sourcePath, targetPath);

// One line on stdout so a local run shows exactly what was handed in.
console.log(`handed in ${parsed!.url}`);
