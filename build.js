const fs = require("fs-extra");
const path = require("path");
const matter = require("gray-matter");

const DIST_DIR = path.join(__dirname, "dist");

// 1. Clean up the dist directory
fs.emptyDirSync(DIST_DIR);
console.log("Cleaned dist directory.");

// 2. Copy all necessary static files and folders
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
  "package.json",
  "package-lock.json",
  "photography.html",
  "README.md",
  "settings-manager.js",
  "styles.html",
  "videography.html",
  "websites.html",
  "assets",
  "_data",
  "admin",
  "node_modules/three", // Copy the entire three.js library
  "node_modules/gsap",   // Copy the entire gsap library
];

filesToCopy.forEach((item) => {
  const sourcePath = path.join(__dirname, item);
  const destPath = path.join(DIST_DIR, item);
  if (fs.existsSync(sourcePath)) {
    fs.copySync(sourcePath, destPath);
    console.log(`Copied ${item} to dist.`);
  }
});

// 3. Generate content JSON from Markdown files
function generateContentJson(directory, outputFileName) {
  const contentDir = path.join(__dirname, directory);

  if (!fs.existsSync(contentDir)) {
    console.log(
      `Directory ${directory} not found. Creating empty ${outputFileName}.`,
    );
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

// Generate JSON files inside the dist directory
generateContentJson("_photography", "_photography.json");
generateContentJson("_videography", "_videography.json");

console.log("
Build process completed successfully!");
