const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

function generateContentJson(directory, outputFileName) {
  const contentDir = path.join(__dirname, directory);

  if (!fs.existsSync(contentDir)) {
    console.log(
      `Directory ${directory} not found. Creating empty ${outputFileName}.`,
    );
    fs.writeFileSync(path.join(__dirname, outputFileName), "[]");
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
    path.join(__dirname, outputFileName),
    JSON.stringify(content, null, 2),
  );
  console.log(
    `Successfully generated ${outputFileName} with ${content.length} items.`,
  );
}

// Generate for both of your collections
generateContentJson("_photography", "_photography.json");
generateContentJson("_videography", "_videography.json");
