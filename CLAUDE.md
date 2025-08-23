# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Goose extends the capabilities of high-performing LLMs through a small collection of tools.
It allows users to instruct Goose, via a CLI or UI interface, to automatically solve problems.
The goal is not just to tell how something can be done, but to actually do it for the user.

### Key Features

- **Extension System**: Adds capabilities through plugins/extensions
- **Tool Usage**: Provides a generalizable approach to adding new capabilities
- **Error Surfacing**: Comprehensive error handling that surfaces errors to the model

## Architecture

### Core Components

- **Exchange**: Core execution logic for generation and tool calling
- **Extensions**: Collection of tools along with state and prompting they require
- **Profile**: Configuration for models and extensions
- **Notifier**: Interface for logging and status updates

### Implementation Patterns

- **Trait-based design**: Heavy use of traits with dependency injection
- **Error handling**: Uses `anyhow` and `thiserror` for comprehensive error handling
- **Async runtime**: Leverages Tokio with `async-trait`
- **Extension system**: Modular approach to adding capabilities

## Build/Test/Lint Commands

- Build: `cargo build` or `just release-binary`
- Run: `./target/debug/goose session` or `cargo run -p goose-cli -- session`
- Test all: `cargo test`
- Test package: `cargo test -p <package>`
- Test single test: `cargo test -p <package> <test_name>`
- Lint: `cargo clippy -- -D warnings`
- Format: `cargo fmt --check`
- UI: `just run-ui` (build and start UI)
- UI tests: `cd ui/desktop && npm run lint:check`

## Development Environment

### Prerequisites
- Rust/Cargo: For backend development
- Node/npm: For UI development (if working on the app)
- Just: Command runner used for common tasks

### Environment Variables
- `GOOSE_PROVIDER`: Change provider without redoing configuration
- Provider-specific keys: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, etc.
- For tracing: `LANGFUSE_INIT_PROJECT_PUBLIC_KEY`, `LANGFUSE_INIT_PROJECT_SECRET_KEY`

## Code Style

- Follow standard Rust formatting via `cargo fmt`
- Use Clippy with warnings as errors (`-D warnings`)
- Use conventional commits format (e.g., "feat:", "fix:", "chore:")
- Prefer extension system for modularity
- Strive for comprehensive error handling that surfaces errors to the model
- For file search/navigation, leverage `ripgrep` via shell commands
- For file edits, prefer the replace operation over whole file overwrites when possible

## A2A (Agent-to-Agent) System

The A2A system allows multiple Goose agents to collaborate and communicate with each other.
Key components:
- Agent discovery mechanism
- JSON-RPC based messaging protocol
- Task-based collaboration model
- Server and client libraries for agent implementation

## Testing

When writing tests:
- Unit tests should be co-located with the code they test
- Integration tests should be in the tests/ directory
- Mock dependencies using trait implementations
- Consider both success and error paths
- Test edge cases, especially for streaming and async operations