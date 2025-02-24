---
sidebar_position: 4
---
# CLI Commands

Goose provides a command-line interface (CLI) with several commands for managing sessions, configurations and extensions. Below is a list of the available commands and their  descriptions:

## Commands

### help

Used to display the help menu

**Usage:**
```bash
goose --help
```

---

### configure [options]

Configure Goose settings - providers, extensions, etc.

**Usage:**
```bash
goose configure
```

---

### session [options]

- Start a session and give it a name

    **Options:**

    **`-n, --name <name>`**

    **Usage:**

    ```bash
    goose session --name <name>
    ```

- Resume a previous session

    **Options:**

    **`-r, --resume`**

    **Usage:**

    ```bash
    goose session --resume --name <name>
    ```

- Start a session with the specified extension

     **Options:**

     **`--with-extension <command>`**

     **Usage:**

    ```bash
    goose session --with-extension <command>
    ```

    Can also include environment variables (e.g., `'GITHUB_TOKEN={your_token} npx -y @modelcontextprotocol/server-github'`)

- Start a session with the specified [built-in extension](/docs/getting-started/using-extensions#built-in-extensions) enabled (e.g. 'developer')

    **Options:**

    **`--with-builtin <id>`**

     **Usage:**

    ```bash
    goose session --with-builtin <id>
    ```

---

### info [options]
Shows Goose information, where goose will load `config.yaml`, store data and logs.

- **`-v, --verbose`**: Show verbose information including config.yaml

**Usage:**
```bash
goose info
```

---

### version

Used to check the current Goose version you have installed

**Usage:**
```bash
goose --version
```

---

### mcp

Run an enabled MCP server specified by `<name>` (e.g. 'Google Drive')

**Usage:**
```bash
goose mcp <name>
```

---

### run [options]

Execute commands from an instruction file or stdin

**Options:**

- **`-i, --instructions <FILE>`**: Path to instruction file containing commands
- **`-t, --text <TEXT>`**: Input text to provide to Goose directly
- **`-n, --name <NAME>`**: Name for this run session (e.g., 'daily-tasks')
- **`-r, --resume`**: Resume from a previous run

**Usage:**

```bash
goose run --instructions plan.md
```

---

### agents

Used to show the available implementations of the agent loop itself

**Usage:**

```bash
goose agents
```