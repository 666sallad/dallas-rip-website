const fs = require("fs-extra");
const path = require("path");
const matter = require("gray-matter");
const sharp = require("sharp");

const DIST_DIR = path.join(__dirname, "dist");
const LIBS_DIR = path.join(DIST_DIR, "libs");
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png"]);

// 1. Clean up the dist directory
fs.emptyDirSync(DIST_DIR);
console.log("Cleaned dist directory.");
fs.mkdirSync(LIBS_DIR);
console.log("Created libs directory.");

// 2. Copy all necessary static files and folders (assets copied separately below)
const filesToCopy = [
  "about.html",
  "advertising.html",
  "background.js",
  "canvas.js",
  "contact.html",
  "footer.js",
  "global.css",
  "header.js",
  "index.html",
  "loader.js",
  "photography.html",
  "settings-manager.js",
  "styles.html",
  "videography.html",
  "websites.html",
  "_data",
  "admin",
];

filesToCopy.forEach((item) => {
  const sourcePath = path.join(__dirname, item);
  const destPath = path.join(DIST_DIR, item);
  if (fs.existsSync(sourcePath)) {
    fs.copySync(sourcePath, destPath);
    console.log(`Copied ${item} to dist.`);
  }
});

// 3. Copy specific library files
// gsap/index.js is an ES module that imports from ./gsap-core.js and ./CSSPlugin.js,
// so we must copy all three files to dist/libs/ to keep relative imports working.
const libsToCopy = {
  "three.module.js": "node_modules/three/build/three.module.js",
  "gsap.js": "node_modules/gsap/index.js",
  "gsap-core.js": "node_modules/gsap/gsap-core.js",
  "CSSPlugin.js": "node_modules/gsap/CSSPlugin.js",
};

for (const [key, value] of Object.entries(libsToCopy)) {
  const sourcePath = path.join(__dirname, value);
  const destPath = path.join(LIBS_DIR, key);
  if (fs.existsSync(sourcePath)) {
    fs.copySync(sourcePath, destPath);
    console.log(`Copied ${key} to dist/libs.`);
  }
}

// 4. Generate content JSON from Markdown files
function generateContentJson(directory, outputFileName) {
  const contentDir = path.join(__dirname, directory);

  if (!fs.existsSync(contentDir)) {
    fs.writeFileSync(path.join(DIST_DIR, outputFileName), "[]");
    return;
  }

  const files = fs.readdirSync(contentDir);
  const content = files
    .map((file) => {
      if (path.extname(file) !== ".md") return null;
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);

      // Rewrite image paths from .jpg/.jpeg/.png → .avif so the live site
      // serves the optimized AVIF files generated during the build.
      if (data.image) {
        data.image = data.image.replace(/\.(jpg|jpeg|png)$/i, ".avif");
      }

      return data;
    })
    .filter(Boolean);

  fs.writeFileSync(
    path.join(DIST_DIR, outputFileName),
    JSON.stringify(content, null, 2),
  );
  console.log(
    `Successfully generated ${outputFileName} in dist with ${content.length} items.`,
  );
}

generateContentJson("_photography", "_photography.json");
generateContentJson("_videography", "_videography.json");

// 5. Convert images to AVIF and copy all other assets
// Source JPGs/PNGs in assets/ are preserved; only AVIF ends up in dist/.
async function copyAssetsWithAvif(srcDir, destDir) {
  fs.ensureDirSync(destDir);
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  const tasks = [];

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);

    if (entry.isDirectory()) {
      tasks.push(copyAssetsWithAvif(srcPath, path.join(destDir, entry.name)));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTS.has(ext)) {
        const destName = entry.name.replace(/\.(jpg|jpeg|png)$/i, ".avif");
        const destPath = path.join(destDir, destName);
        tasks.push(
          sharp(srcPath)
            .avif({ quality: 75 })
            .toFile(destPath)
            .then(() => console.log(`  ${entry.name} → ${destName}`))
            .catch((err) =>
              console.error(`  Failed to convert ${entry.name}:`, err.message),
            ),
        );
      } else {
        fs.copySync(srcPath, path.join(destDir, entry.name));
      }
    }
  }

  await Promise.all(tasks);
}

console.log("\nConverting images to AVIF (quality 75)...");
copyAssetsWithAvif(
  path.join(__dirname, "assets"),
  path.join(DIST_DIR, "assets"),
).then(() => {
  console.log("\nBuild process completed successfully!");
});
