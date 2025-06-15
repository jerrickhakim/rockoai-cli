# RockoAI CLI

A command-line interface for interacting with the RockoAI platform.

## Installation

You can install the CLI globally:

```bash
npm install -g rockoai-cli
```

Or run it directly:

```bash
npx rockoai-cli
```

## Usage

### Authentication

Before using any commands, you need to authenticate:

```bash
rockoai login
```

```bash
rockoai logout
```

This will open a browser window where you can log in to your RockoAI account. After successful login, the CLI will receive and store an authentication token.

### Commands

#### Pull a Project

Pull a project from RockoAI directly into your current directory:

```bash
rockoai pull -p <project-name>
```

This will download all project files into your current working directory.

#### Push a Project

Push files from your current directory to a RockoAI project:

```bash
rockoai push -p <project-id>
```

This will upload all files from your current directory to the specified project.

## Development

To set up the development environment:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the CLI:
   ```bash
   npm start
   ```

### Local Installation for Testing

To install the CLI locally for testing:

```bash
npm link
```

Then you can use the `rockoai` command from anywhere in your terminal.

## License

ISC

1. If the directory is empty
   we can pull the files

2. If the directy is not only, check if .rockoai.json PROJECT_ID is equal to the project id
   If so, pass

3. If not, create a folder with the project name and put there
# rockoai-cli
