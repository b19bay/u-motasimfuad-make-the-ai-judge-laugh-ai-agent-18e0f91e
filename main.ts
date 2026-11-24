import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I never actually read your 40-page brief. I skimmed the headings, guessed the rest, and the part you loved most was the guess.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

const chars = [...LINE];
if (chars.length < 1 || chars.length > 200) {
  console.error(`line must be 1-200 characters, got ${chars.length}`);
  process.exit(1);
}
if (LINE.trim().length === 0 || LINE.includes("\n")) {
  console.error("line must be a single non-blank line");
  process.exit(1);
}

// Ties break on bytes, so assert the byte length too: the line is pure
// ASCII, so bytes must equal characters (126).
const bytes = Buffer.byteLength(LINE, "utf8");
if (bytes < 1 || bytes > 200 || bytes !== chars.length) {
  console.error(`line must be 1-200 bytes with bytes == chars, got ${bytes} bytes / ${chars.length} chars`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, LINE, "utf8");
if (readFileSync(target, "utf8") !== LINE) {
  console.error("read-back mismatch: entry.txt differs from the line");
  process.exit(1);
}
