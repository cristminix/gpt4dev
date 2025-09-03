# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Svelte-based web application for an AI chat interface built with TypeScript. The main functionality allows users to interact with various AI models and providers through a chat interface.

## Development Commands

- `pnpm i` - Install dependencies
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## Code Architecture

### Main Technologies

- Svelte 5 with TypeScript
- Vite as build tool
- Tailwind CSS v4 for styling
- Preline UI components
- FontAwesome and Bootstrap Icons

### Project Structure

- `src/` - Main source code
  - `App.svelte` - Main application component with routing
  - `main.ts` - Entry point
  - `pages/ChatPage.svelte` - Main chat interface
  - `components/` - Reusable UI components
  - `global/` - Global stores and utilities
- `public/` - Static assets
- `dist/` - Build output

### Key Components

1. **Chat Interface** - Main chat functionality in `src/pages/ChatPage.svelte`
2. **Routing** - Client-side routing handled in `App.svelte`
3. **State Management** - Uses Svelte stores for state management
4. **UI Components** - Preline and custom Svelte components

### Build Configuration

- Vite configuration in `vite.config.ts`
- TypeScript configuration in `tsconfig.json`
- Tailwind configuration in `tailwind.config.js`
- Proxy configuration for API endpoints in Vite config

### Routing

The application uses client-side routing with path-to-regexp for matching routes. Main routes include:

- `/chat/:id` - Chat interface
- `/demo` - Demo page
- `/about` - About page
- `/contact/page/:page` - Contact page

### Chat Features

- Real-time message streaming
- Conversation history management
- Multiple AI model support
- Message regeneration
- Grouped conversations
