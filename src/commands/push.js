const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const ora = require("ora");
const glob = require("glob");
const { isAuthenticated } = require("../utils/token");
const { pushProject } = require("../utils/api");
const archiver = require("archiver");

/**
 * Push local files to a RockoAI project
 * @param {Object} options - Command options
 * @param {string} options.project - Project ID or name to push to
 */
const pushZip = async (options) => {
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
    spinner.text = `Creating zip file for project ${chalk.cyan(projectId)}...`;

    // Get all files from current directory
    const currentDir = process.cwd();

    // Create a list of files to ignore (removed node_modules to include them)
    const ignorePatterns = ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/.build/**", "**/.git/**", "**/.DS_Store/**"];

    // Get all files recursively, ignoring certain patterns
    const filePaths = glob.sync("**/*", {
      cwd: currentDir,
      ignore: ignorePatterns,
      dot: true,
      nodir: true,
    });

    spinner.text = `Found ${filePaths.length} files. Creating zip archive...`;

    // Create a zip file
    const zipBuffer = await createZipFile(currentDir, filePaths, spinner);

    spinner.text = `Uploading zip file to project ${chalk.cyan(projectId)}...`;

    // Push zip file to the server
    await pushProject(projectId, {
      zipFile: {
        buffer: zipBuffer,
        filename: `${projectId}-${Date.now()}.zip`,
      },
    });

    spinner.succeed(`Successfully pushed project to ${chalk.cyan(projectId)}`);
    console.log(`  - ${chalk.green(filePaths.length)} files archived and uploaded`);
  } catch (error) {
    spinner.fail(`Failed to push project: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Create a zip file from the specified files
 * @param {string} currentDir - Current working directory
 * @param {string[]} filePaths - Array of file paths to include
 * @param {Object} spinner - Spinner instance for progress updates
 * @returns {Promise<Buffer>} - Zip file buffer
 */
const createZipFile = (currentDir, filePaths, spinner) => {
  return new Promise((resolve, reject) => {
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level
    });

    const buffers = [];

    // Collect data from the archive
    archive.on("data", (chunk) => {
      buffers.push(chunk);
    });

    // Archive finalized
    archive.on("end", () => {
      const zipBuffer = Buffer.concat(buffers);
      resolve(zipBuffer);
    });

    // Handle errors
    archive.on("error", (err) => {
      reject(err);
    });

    let filesAdded = 0;
    const totalFiles = filePaths.length;

    // Add files to archive
    for (const filePath of filePaths) {
      const fullPath = path.join(currentDir, filePath);

      try {
        const stats = fs.statSync(fullPath);

        if (stats.isFile()) {
          archive.file(fullPath, { name: filePath });
          filesAdded++;

          // Update spinner every 100 files
          if (filesAdded % 100 === 0 || filesAdded === totalFiles) {
            spinner.text = `Creating zip archive... (${filesAdded}/${totalFiles} files)`;
          }
        }
      } catch (err) {
        console.warn(`Warning: Could not add file ${filePath}: ${err.message}`);
      }
    }

    // Finalize the archive
    archive.finalize();
  });
};

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
  pushZip,
};
