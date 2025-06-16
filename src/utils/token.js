const fs = require("fs-extra");
const path = require("path");
const os = require("os");

// Path to store the authentication token
const TOKEN_DIR = path.join(os.homedir(), ".rockoai");
const TOKEN_FILE = path.join(TOKEN_DIR, "token");

/**
 * Save authentication token to file
 * @param {string} token - Authentication token
 */
const saveToken = async (token) => {
  try {
    await fs.ensureDir(TOKEN_DIR);
    await fs.writeFile(TOKEN_FILE, token, "utf8");
  } catch (error) {
    throw new Error(`Failed to save authentication token: ${error.message}`);
  }
};

/**
 * Get authentication token from file
 * @returns {string|null} - Token if exists, null otherwise
 */
const getToken = () => {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      return fs.readFileSync(TOKEN_FILE, "utf8").trim();
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Remove authentication token
 */
const removeToken = async () => {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      await fs.remove(TOKEN_FILE);
    }
  } catch (error) {
    throw new Error(`Failed to remove authentication token: ${error.message}`);
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if authenticated, false otherwise
 */
const isAuthenticated = () => {
  const token = getToken();
  return token !== null && token.length > 0;
};

module.exports = {
  saveToken,
  getToken,
  removeToken,
  isAuthenticated,
};
