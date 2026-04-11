// Run with: npm run optimize
// Recursively converts any JPG/PNG in assets/uploads/ (and subdirectories)
// that doesn't already have an .avif counterpart.
// Run locally after adding new images, then commit the .avif files.
// Netlify builds will then just copy them — no conversion needed at deploy time.

const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");

const UPLOADS_DIR = path.join(__dirname, "assets", "uploads");
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png"]);
const AVIF_QUALITY = 75;

async function optimizeDir(dir, tasks, counter) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await optimizeDir(fullPath, tasks, counter);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) continue;

    const avifName = entry.name.replace(/\.(jpg|jpeg|png)$/i, ".avif");
    const avifPath = path.join(dir, avifName);

    if (fs.existsSync(avifPath)) {
      counter.skipped++;
      continue;
    }

    tasks.push(
      sharp(fullPath)
        .avif({ quality: AVIF_QUALITY })
        .toFile(avifPath)
        .then(() => {
          const src = fs.statSync(fullPath).size;
          const dest = fs.statSync(avifPath).size;
          const pct = Math.round((1 - dest / src) * 100);
          const rel = path.relative(UPLOADS_DIR, avifPath);
          console.log(`  ${entry.name} → ${rel} (${pct}% smaller)`);
        })
        .catch((err) =>
          console.error(`  Failed: ${entry.name} —`, err.message),
        ),
    );
  }
}

async function optimize() {
  const tasks = [];
  const counter = { skipped: 0 };

  await optimizeDir(UPLOADS_DIR, tasks, counter);

  if (tasks.length === 0) {
    console.log(`All ${counter.skipped} images already optimized. Nothing to do.`);
    return;
  }

  console.log(`Converting ${tasks.length} image(s) to AVIF (quality ${AVIF_QUALITY})...`);
  await Promise.all(tasks);
  console.log(`\nDone. ${counter.skipped} already existed, ${tasks.length} converted.`);
  console.log(`\nNext step: commit the new .avif files to git.`);
}

optimize().catch(console.error);
