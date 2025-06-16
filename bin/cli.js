#!/usr/bin/env node

const { program } = require("commander");
const { login, logout } = require("../src/commands/auth");
const { pull } = require("../src/commands/pull");
const { push } = require("../src/commands/push");

// Set up the CLI program
program.name("rockoai").description("RockoAI CLI - Interact with the RockoAI platform").version("1.0.0");

// Login command
program.command("login").description("Authenticate with RockoAI").action(login);

// Logout command
program.command("logout").description("Logout from RockoAI").action(logout);

// Pull command
program.command("pull").description("Pull a project from RockoAI").option("-p, --project <project>", "Project name to pull").action(pull);

// Push command
program.command("push").description("Push project to RockoAI").option("-p, --project <project>", "Project ID to push to").action(push);

// Parse command line arguments
program.parse(process.argv);
