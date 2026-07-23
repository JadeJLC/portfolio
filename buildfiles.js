const fs = require("fs");
const path = require("path");

// Image directories to scan
const targetDirectories = [
  path.join(__dirname, "screenshot_writer"),
  path.join(__dirname, "screenshots_dev"),
];

// Target JSON output path
const outputFile = path.join(__dirname, "locales", "screenshots.json");

const screenshotsMap = {};

targetDirectories.forEach((dirPath) => {
  if (fs.existsSync(dirPath)) {
    // Read each project folder (e.g., 'write_01', 'dev_01')
    const folders = fs.readdirSync(dirPath);

    folders.forEach((folderName) => {
      const folderPath = path.join(dirPath, folderName);

      if (fs.statSync(folderPath).isDirectory()) {
        // Read all image files inside the project folder
        const files = fs.readdirSync(folderPath);

        const images = files
          .filter((file) => /\.(png|jpe?g|webp|svg)$/i.test(file))
          .map((file) => `./${path.basename(dirPath)}/${folderName}/${file}`);

        // Store using project ID (e.g., "write_01": ["./screenshot_writer/write_01/Kadkam.png", ...])
        screenshotsMap[folderName] = images;
      }
    });
  }
});

// Ensure 'locales' directory exists
const localesDir = path.dirname(outputFile);
if (!fs.existsSync(localesDir)) {
  fs.mkdirSync(localesDir, { recursive: true });
}

// Write the mapping to screenshots.json
fs.writeFileSync(outputFile, JSON.stringify(screenshotsMap, null, 2));

console.log(" Successfully created locales/screenshots.json!");
