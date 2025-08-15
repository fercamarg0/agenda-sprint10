const fs = require("fs").promises;
const path = "prisma/schema.prisma";

async function removeComments() {
  try {
    const data = await fs.readFile(path, "utf8");
    const lines = data.split("\n");
    const newLines = [];

    for (const line of lines) {
      // Remove end-of-line comments
      const cleanedLine = line.replace(/\s*\/\/.*$/, "");

      // Ignore lines that are only comments
      if (
        cleanedLine.trim().startsWith("//") ||
        cleanedLine.trim().startsWith("///")
      ) {
        continue;
      }

      newLines.push(cleanedLine);
    }

    // Join the lines and filter out any empty lines that might result from the process
    const newData = newLines.join("\n").replace(/^\s*[\r\n]/gm, "");

    await fs.writeFile(path, newData, "utf8");
    console.log("Comments removed successfully.");
  } catch (err) {
    console.error("Error processing file:", err);
  }
}

removeComments();
