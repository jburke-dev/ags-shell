# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a custom AGS (Aylur's Gtk Shell) shell for Linux built with TypeScript/TSX and Nix. AGS is a framework for building desktop widgets/components using GTK4 and JavaScript/TypeScript with React-like JSX syntax.

## Development Environment

This project uses Nix flakes for dependency management and development environment setup.

### Setup

```bash
# Enter development shell (if using direnv, this happens automatically)
nix develop

# Or use direnv
direnv allow
```

### TypeScript Configuration

```bash
# Generate TypeScript types and tsconfig
ags types -u -d .
```

### Running the Shell

```bash
# Run in development mode
ags run app.ts

# Or with hot reload
ags run --watch app.ts
```

### Building

```bash
# Build the final package
nix build

# The result will be in ./result/bin/ags-shell
```

## Architecture

### Entry Point

- `app.tsx` - Main application entry point that initializes the app with styles and creates StatusBar instances for each monitor

### Project Structure

- `windows/` - Top-level window components (e.g., StatusBar)
- `widgets/` - Reusable widget components (e.g., Clock, Workspaces)
- `styles.scss` - Global styles

### Key Framework Concepts

**JSX with AGS GTK4:**

- JSX elements map to GTK4 widgets (e.g., `<box>`, `<button>`, `<label>`)
- Use lowercase for GTK widgets
- Import specific GTK widgets from `"ags/gtk4"` when needed (e.g., `Gtk.Calendar`)

**Reactive State:**

- `createBinding()` creates reactive bindings to GObject properties
- `createPoll()` creates polling-based reactive values
- Use `.as()` to transform bound values

**Window Setup:**

- Windows need `gdkmonitor` prop to specify which monitor to display on
- `anchor` prop controls positioning (TOP, LEFT, RIGHT, BOTTOM)
- `exclusivity` controls whether other windows can overlap (EXCLUSIVE, NORMAL, etc.)

**GObject Introspection:**

- Import GI libraries with `gi://` protocol (e.g., `gi://GLib?version=2.0`)
- AstalHyprland is used for workspace management

### Adding New Components

1. Create widget in `widgets/` for reusable components
2. Create window in `windows/` for top-level window components
3. Import and use in `app.tsx` or other components
4. Style in `styles.scss` using class names
