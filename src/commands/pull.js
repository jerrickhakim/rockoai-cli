const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const ora = require("ora");
const { isAuthenticated } = require("../utils/token");
const { pullProject } = require("../utils/api");

/**
 * Pull a project from RockoAI
 * @param {Object} options - Command options
 * @param {string} options.project - Project name to pull
 */
const pull = async (options) => {
  const spinner = ora("Preparing to pull project...").start();

  try {
    // Check if authenticated
    if (!isAuthenticated()) {
      spinner.fail("Not authenticated. Please run `rockoai login` first.");
      process.exit(1);
    }

    // Check if project name is provided
    if (!options.project) {
      spinner.fail("Project name is required. Use -p or --project to specify a project name.");
      process.exit(1);
    }

    const projectName = options.project;
    const currentDir = process.cwd();

    spinner.text = `Fetching project ${chalk.cyan(projectName)}...`;

    // Pull project data from API
    const projectData = await pullProject(projectName);

    if (!projectData || !projectData.files) {
      spinner.fail("No project data received or project not found.");
      process.exit(1);
    }

    const { files, name } = projectData;
    const fileEntries = Object.entries(files);

    if (fileEntries.length === 0) {
      spinner.warn(`Project ${chalk.cyan(projectName)} appears to be empty.`);
      return;
    }

    // Check if current directory is empty
    const currentDirContents = await fs.readdir(currentDir);
    const isCurrentDirEmpty = currentDirContents.length === 0;

    let targetDir = currentDir;

    // If directory is not empty, check for .rockoai.json
    if (!isCurrentDirEmpty) {
      const rockoaiConfigPath = path.join(currentDir, ".rockoai.json");
      let shouldCreateSubdir = true;

      if (await fs.pathExists(rockoaiConfigPath)) {
        try {
          const config = await fs.readJson(rockoaiConfigPath);
          if (config.PROJECT_ID === projectName) {
            // Same project, safe to pull into current directory
            shouldCreateSubdir = false;
          }
        } catch (error) {
          // Invalid config file, create subdirectory
        }
      }

      if (shouldCreateSubdir) {
        targetDir = path.join(currentDir, name);
        await fs.ensureDir(targetDir);
        console.log(chalk.yellow(`\nPulling into subdirectory: ${chalk.cyan(projectName)}`));
      }
    }

    spinner.text = `Writing files to ${path.relative(process.cwd(), targetDir) || "."}...`;

    let fileCount = 0;
    let folderCount = 0;

    // Process each file/folder
    for (const [filePath, fileData] of fileEntries) {
      const fullPath = path.join(targetDir, filePath);

      if (fileData.type === "folder") {
        // Create directory
        await fs.ensureDir(fullPath);
        folderCount++;
      } else if (fileData.type === "file") {
        // Ensure parent directory exists
        await fs.ensureDir(path.dirname(fullPath));

        // Write file content
        if (fileData.isBinary) {
          // Handle binary files
          const buffer = Buffer.from(fileData.content, "base64");
          await fs.writeFile(fullPath, buffer);
        } else {
          // Handle text files
          await fs.writeFile(fullPath, fileData.content, "utf8");
        }

        // Set file modification time if available
        if (fileData.lastModified) {
          const mtime = new Date(fileData.lastModified);
          await fs.utimes(fullPath, mtime, mtime);
        }

        fileCount++;
      }
    }

    // Create .rockoai.json file to track the project
    const rockoaiConfig = {
      PROJECT_ID: projectName,
      PULLED_AT: new Date().toISOString(),
    };
    await fs.writeJson(path.join(targetDir, ".rockoai.json"), rockoaiConfig, { spaces: 2 });

    spinner.succeed(`Successfully pulled project ${chalk.cyan(projectName)}`);
    console.log(`  - ${chalk.green(fileCount)} files downloaded`);
    console.log(`  - ${chalk.green(folderCount)} folders created`);

    if (targetDir !== currentDir) {
      console.log(`  - Files saved to: ${chalk.cyan(path.relative(currentDir, targetDir))}`);
    }
  } catch (error) {
    spinner.fail(`Failed to pull project: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  pull,
};
