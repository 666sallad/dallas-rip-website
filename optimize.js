// Run with: npm run optimize
// Converts any JPG/PNG in assets/uploads/ that doesn't already have an .avif
// counterpart. Run this locally after adding new images, then commit the .avif files.
// Netlify builds will then just copy them — no conversion needed at deploy time.

const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");

const UPLOADS_DIR = path.join(__dirname, "assets", "uploads");
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png"]);
const AVIF_QUALITY = 75;

async function optimize() {
  const entries = fs.readdirSync(UPLOADS_DIR, { withFileTypes: true });
  const tasks = [];
  let skipped = 0;

  for (const entry of entries) {
    if (entry.isDirectory()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) continue;

    const srcPath = path.join(UPLOADS_DIR, entry.name);
    const avifName = entry.name.replace(/\.(jpg|jpeg|png)$/i, ".avif");
    const avifPath = path.join(UPLOADS_DIR, avifName);

    if (fs.existsSync(avifPath)) {
      skipped++;
      continue;
    }

    tasks.push(
      sharp(srcPath)
        .avif({ quality: AVIF_QUALITY })
        .toFile(avifPath)
        .then(() => {
          const src = fs.statSync(srcPath).size;
          const dest = fs.statSync(avifPath).size;
          const pct = Math.round((1 - dest / src) * 100);
          console.log(`  ${entry.name} → ${avifName} (${pct}% smaller)`);
        })
        .catch((err) =>
          console.error(`  Failed: ${entry.name} —`, err.message),
        ),
    );
  }

  if (tasks.length === 0) {
    console.log(`All ${skipped} images already optimized. Nothing to do.`);
    return;
  }

  console.log(`Converting ${tasks.length} image(s) to AVIF (quality ${AVIF_QUALITY})...`);
  await Promise.all(tasks);
  console.log(`\nDone. ${skipped} already existed, ${tasks.length} converted.`);
  console.log(`\nNext step: commit the new .avif files to git.`);
}

optimize().catch(console.error);
