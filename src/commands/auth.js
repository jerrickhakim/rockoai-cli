const express = require("express");
const open = require("open");
const chalk = require("chalk");
const ora = require("ora");
const { saveToken, removeToken, isAuthenticated } = require("../utils/token");

/**
 * Login to RockoAI
 */
const login = async () => {
  const spinner = ora("Starting authentication...").start();

  try {
    // Check if already authenticated
    if (isAuthenticated()) {
      spinner.succeed("Already authenticated!");
      console.log(chalk.green("You are already logged in to RockoAI."));
      return;
    }

    // Create a temporary server to receive the callback
    const app = express();
    const port = 48735;
    let server;

    // Set up the callback route
    app.get("/callback", (req, res) => {
      const { token, error } = req.query;

      if (error) {
        res.send(`
          <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h1 style="color: #e74c3c;">Authentication Failed</h1>
              <p>Error: ${error}</p>
              <p>You can close this window and try again.</p>
            </body>
          </html>
        `);
        spinner.fail(`Authentication failed: ${error}`);
        server.close();
        process.exit(1);
      } else if (token) {
        res.send(`
          <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h1 style="color: #27ae60;">Authentication Successful!</h1>
              <p>You have successfully logged in to RockoAI.</p>
              <p>You can now close this window and return to your terminal.</p>
            </body>
          </html>
        `);

        // Save the token
        saveToken(token)
          .then(() => {
            spinner.succeed("Successfully authenticated!");
            console.log(chalk.green("You are now logged in to RockoAI."));
            server.close();
          })
          .catch((saveError) => {
            spinner.fail(`Failed to save authentication token: ${saveError.message}`);
            server.close();
            process.exit(1);
          });
      } else {
        res.send(`
          <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h1 style="color: #e74c3c;">Authentication Error</h1>
              <p>No token received. Please try again.</p>
              <p>You can close this window.</p>
            </body>
          </html>
        `);
        spinner.fail("Authentication failed: No token received");
        server.close();
        process.exit(1);
      }
    });

    // Start the server
    server = app.listen(port, () => {
      const authUrl = `http://localhost:3000/cli`;
      //   const authUrl = `https://app.rockoai.com/cli`;

      spinner.text = "Opening browser for authentication...";

      // Open the authentication URL in the user's browser
      open(authUrl).catch((openError) => {
        spinner.fail("Failed to open browser automatically");
        console.log(chalk.yellow("\nPlease manually open the following URL in your browser:"));
        console.log(chalk.cyan(authUrl));
      });

      spinner.text = "Waiting for authentication...";
      console.log(chalk.gray("\nWaiting for you to complete authentication in your browser..."));
    });

    // Set a timeout for the authentication process
    setTimeout(() => {
      if (server && server.listening) {
        spinner.fail("Authentication timeout");
        console.log(chalk.red("Authentication timed out. Please try again."));
        server.close();
        process.exit(1);
      }
    }, 300000); // 5 minutes timeout
  } catch (error) {
    spinner.fail(`Authentication failed: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Logout from RockoAI
 */
const logout = async () => {
  const spinner = ora("Logging out...").start();

  try {
    if (!isAuthenticated()) {
      spinner.succeed("Already logged out!");
      console.log(chalk.yellow("You are not currently logged in."));
      return;
    }

    await removeToken();
    spinner.succeed("Successfully logged out!");
    console.log(chalk.green("You have been logged out of RockoAI."));
  } catch (error) {
    spinner.fail(`Logout failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  login,
  logout,
};
