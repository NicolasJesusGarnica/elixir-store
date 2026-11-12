---
name: customize-opencode
description: Guide and best practices for customizing OpenCode and AI coding assistants. Covers AGENTS.md rules, skills creation, configuration files (opencode.jsonc), custom tools, slash commands, themes, and prompt engineering directives.
---

# Customize OpenCode & Agent Customization

## Overview
This skill provides comprehensive patterns and instructions for configuring and extending OpenCode and AI agent environments (Antigravity, Claude Code, Cursor, OpenCode).

## 1. Project Rules (`AGENTS.md` / `GEMINI.md`)
- Place `AGENTS.md` or `GEMINI.md` at the project root to define architectural patterns, testing mandates, linting rules, and forbidden patterns.
- Keep rules concise, deterministic, and actionable.

## 2. Agent Skills Architecture
Skills are modular capabilities discovered automatically by agents:
```text
.agents/skills/<skill-name>/
├── SKILL.md          # Required: Frontmatter (name, description) + instructions
├── references/       # Optional: Technical specs, API references
└── scripts/          # Optional: Helper utilities
```

## 3. Configuration & Themes
- Global config: `~/.config/opencode/opencode.jsonc` or `~/.gemini/config/config.json`
- Define model preferences, system prompts, provider fallbacks, and token budgeting.

## 4. Custom Slash Commands & Workflows
- Define repeatable team workflows (/audit, /refactor, /review) for consistent output quality.
