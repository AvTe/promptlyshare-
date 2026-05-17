# Promptopia - AI Agent Instructions

This document provides essential context and instructions for AI agents working in this repository.

## Project Overview
Promptopia is a Next.js (App Router) open-source AI prompting tool to discover, create, and share prompts.

## Tech Stack & Architecture
- **Framework**: Next.js 14 using the **App Router** (`app/` directory).
- **Styling**: Tailwind CSS (`tailwind.config.js`).
- **Database**: MongoDB with Mongoose (`utils/database.js`, `models/`).
- **Authentication**: NextAuth.js (`app/api/auth/[...nextauth]/route.js`).

## Agent Guidelines

### General Code Conventions
- Use the **Next.js App Router** conventions (e.g., `page.jsx`, `layout.jsx`, `loading.jsx`).
- Place all backend API endpoints within the `app/api/` directory using `route.js` files.
- Prefer React functional components with hooks.
- Handle database connections securely in server-side operations using the `utils/database.js` connection helper.
- Follow existing Tailwind CSS utility classes for styling adjustments.

### Common Commands
- **Run dev server**: `npm run dev`
- **Build for production**: `npm run build`
- **Lint the project**: `npm run lint`

### Reference Documentation
For detailed feature information, see the [README.md](README.md).
