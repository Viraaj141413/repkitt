# AI App Builder - Project Overview

## Overview

This is a full-stack AI-powered app builder that allows users to generate applications through natural language prompts. The system creates web applications, mobile apps, games, and other projects using an intelligent code generation engine. Built with React, TypeScript, Express.js, and PostgreSQL, it features a complete user management system with file-based activity tracking.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration for Replit
- **UI Library**: Radix UI components with Tailwind CSS
- **State Management**: React Query for server state, React hooks for local state
- **Routing**: React Router for navigation
- **Styling**: Tailwind CSS with shadcn/ui component system

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Session Management**: Express sessions with PostgreSQL store
- **Authentication**: Custom VIRAAJDATA authentication controller
- **File System**: Custom file-based user activity tracking

### Database Architecture
- **Primary Database**: PostgreSQL with Neon serverless connection
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Tables**: Users, projects, project files with full relational structure
- **Session Storage**: PostgreSQL-backed session store for persistence

## Key Components

### VIRAAJDATA Controller
- Custom authentication and user tracking system
- File-based activity logging to `users.txt`
- Device fingerprinting and session management
- Comprehensive user analytics and tracking

### AI Code Generation Engine
- Local code generation system with pattern matching
- Multi-project type support (web apps, games, calculators, etc.)
- Live file streaming during generation
- Technology-aware file structure creation

### IDE Interface
- Split-panel layout with file explorer, code editor, and preview
- Real-time file editing and preview capabilities
- Chat interface for AI interactions
- Project management with file operations

### File Management System
- Multi-file project support with language detection
- File explorer with folder structure
- Code editor with syntax highlighting
- Live preview generation for web projects

## Data Flow

1. **User Authentication**: VIRAAJDATA controller handles login/registration with device tracking
2. **Project Creation**: AI processes natural language prompts to generate project structure
3. **File Generation**: Code generation engine creates files with appropriate content and structure
4. **Real-time Updates**: File changes are reflected immediately in the editor and preview
5. **Activity Logging**: All user actions are logged to users.txt for tracking and analytics

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for Neon database
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **express-session**: Session management with PostgreSQL storage
- **@radix-ui/react-***: Comprehensive UI component library
- **@tanstack/react-query**: Server state management and caching

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production builds
- **vite**: Development server and build tool
- **tailwindcss**: Utility-first CSS framework

### AI and Utilities
- **@anthropic-ai/sdk**: AI integration capabilities
- **nanoid**: Unique ID generation
- **react-hook-form**: Form handling and validation

## Deployment Strategy

### Development Environment
- Replit-optimized with custom Vite configuration
- Hot module replacement for React components
- Automatic database connection with environment variables
- Multi-port configuration for development services

### Production Build
- Vite-based frontend build to `dist/public`
- ESBuild-powered backend compilation
- Node.js production server with Express
- PostgreSQL database with connection pooling

### Replit Configuration
- Autoscale deployment target
- PostgreSQL 16 module integration
- Node.js 20 runtime environment
- Automated build and start scripts

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```