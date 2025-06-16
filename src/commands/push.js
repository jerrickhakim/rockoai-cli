const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const ora = require("ora");
const glob = require("glob");
const { isAuthenticated } = require("../utils/token");
const { pushProject } = require("../utils/api");

/**
 * Push local files to a RockoAI project
 * @param {Object} options - Command options
 * @param {string} options.project - Project ID or name to push to
 */
const push = async (options) => {
  const spinner = ora("Preparing to push project...").start();

  try {
    // Check if authenticated
    if (!isAuthenticated()) {
      spinner.fail("Not authenticated. Please run `rockoai login` first.");
      process.exit(1);
    }

    // Check if project name is provided
    if (!options.project) {
      spinner.fail("Project ID is required. Use -p or --project to specify a project ID.");
      process.exit(1);
    }

    const projectId = options.project;
    spinner.text = `Collecting files to push to project ${chalk.cyan(projectId)}...`;

    // Get all files from current directory
    const currentDir = process.cwd();
    const files = {};
    let fileCount = 0;
    let folderCount = 0;

    // Create a list of files to ignore
    const ignorePatterns = ["node_modules/**", ".git/**", "dist/**", "build/**", "*.log", ".DS_Store"];

    // Get all files recursively, ignoring certain patterns
    const filePaths = glob.sync("**/*", {
      cwd: currentDir,
      ignore: ignorePatterns,
      dot: false,
      nodir: true,
    });

    // Process files
    for (const filePath of filePaths) {
      const fullPath = path.join(currentDir, filePath);
      const stats = fs.statSync(fullPath);

      // Skip directories (they'll be created automatically)
      if (stats.isDirectory()) {
        folderCount++;
        continue;
      }

      // Determine if file is binary
      let content;
      let isBinary = false;

      try {
        // Try to read as text first
        content = fs.readFileSync(fullPath, "utf8");
      } catch (e) {
        // If it fails, treat as binary
        const buffer = fs.readFileSync(fullPath);
        content = buffer.toString("base64");
        isBinary = true;
      }

      // Add file to collection
      files[filePath] = {
        name: path.basename(filePath),
        type: "file",
        content: content,
        path: filePath,
        isBinary: isBinary,
        lastModified: stats.mtimeMs,
        contentLength: stats.size,
        contentType: isBinary ? "binary" : "text",
      };

      fileCount++;
    }

    // Find directories
    const dirPaths = glob
      .sync("**/*", {
        cwd: currentDir,
        ignore: ignorePatterns,
        dot: false,
        nodir: false,
      })
      .filter((filePath) => {
        const fullPath = path.join(currentDir, filePath);
        return fs.statSync(fullPath).isDirectory();
      });

    // Add directories to the files object
    for (const dirPath of dirPaths) {
      if (dirPath === "") continue; // Skip the root directory

      files[dirPath] = {
        name: path.basename(dirPath),
        type: "folder",
        path: dirPath,
        lastModified: fs.statSync(path.join(currentDir, dirPath)).mtimeMs,
      };

      folderCount++;
    }

    spinner.text = `Pushing ${fileCount} files and ${folderCount} folders to project ${chalk.cyan(projectId)}...`;

    // Push files to the server
    await pushProject(projectId, { files });

    spinner.succeed(`Successfully pushed to project ${chalk.cyan(projectId)}`);
    console.log(`  - ${chalk.green(fileCount)} files uploaded`);
    console.log(`  - ${chalk.green(folderCount)} folders processed`);
  } catch (error) {
    spinner.fail(`Failed to push project: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  push,
};
