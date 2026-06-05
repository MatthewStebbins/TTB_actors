/**
 * Compiles NDJSON .db source files into Foundry V12+ LevelDB compendium packs.
 * Run: node scripts/compile-packs.mjs
 *
 * Foundry V12+ removed NeDB .db support. Packs must use LevelDB directories.
 * Key format: !items!<_id>  (or !actors!, !scenes!, etc. per document type)
 */

import { ClassicLevel } from "classic-level";
import { readFileSync, mkdirSync, rmSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const PACKS = [
  { src: "packs/ttb-weapons.db",          out: "packs/ttb-weapons",          docType: "Item" },
  { src: "packs/ttb-armor.db",            out: "packs/ttb-armor",            docType: "Item" },
  { src: "packs/ttb-gear.db",             out: "packs/ttb-gear",             docType: "Item" },
  { src: "packs/ttb-general-talents.db",  out: "packs/ttb-general-talents",  docType: "Item" },
  { src: "packs/ttb-pursuit-talents.db",  out: "packs/ttb-pursuit-talents",  docType: "Item" },
  { src: "packs/ttb-spells.db",           out: "packs/ttb-spells",           docType: "Item" },
];

for (const { src, out, docType } of PACKS) {
  const srcPath = resolve(ROOT, src);
  const outPath = resolve(ROOT, out);

  const lines = readFileSync(srcPath, "utf8").split("\n").filter(l => l.trim());
  console.log(`\n[${src}] → [${out}/]  (${lines.length} documents)`);

  // Remove existing LevelDB directory if present
  if (existsSync(outPath)) rmSync(outPath, { recursive: true });
  mkdirSync(outPath, { recursive: true });

  const db = new ClassicLevel(outPath, { keyEncoding: "utf8", valueEncoding: "utf8" });
  await db.open();

  const prefix = `!${docType.toLowerCase()}s!`;
  const batch = db.batch();

  let ok = 0, fail = 0;
  for (const line of lines) {
    try {
      const doc = JSON.parse(line);
      batch.put(prefix + doc._id, JSON.stringify(doc));
      ok++;
    } catch (e) {
      console.error(`  PARSE ERROR: ${e.message}`);
      fail++;
    }
  }

  await batch.write();
  await db.close();
  console.log(`  ✓ ${ok} written${fail ? `, ${fail} failed` : ""}`);
}

console.log("\n✅ All packs compiled to LevelDB format.");
