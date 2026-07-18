const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const dbPath = path.join(ROOT, "packs", "ttb-bestiary.db");
const outDir = path.join(ROOT, "packs", "ttb-bestiary");

console.log("Compiling bestiary...");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const content = fs.readFileSync(dbPath, "utf-8");
const lines = content.trim().split("\n");

let count = 0;
for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const entry = JSON.parse(line);
    const id = entry._id;
    const filename = path.join(outDir, `${id}.json`);
    fs.writeFileSync(filename, JSON.stringify(entry, null, 2));
    count++;
    console.log(`  ? ${id}`);
  } catch (e) {
    console.error(`  ? ${e.message}`);
  }
}

console.log(`\n? Compiled ${count} entries to ${outDir}`);
