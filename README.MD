# Database Manager

A modern, web-based database management system designed to provide an enhanced user experience for database administration and development workflows.

## Overview

Database Manager is a full-stack application that addresses the usability and feature limitations commonly found in traditional database management systems. The project was born from the frequent need to create database schemas for both real-world projects and personal development, where existing tools often presented unnecessarily complex interfaces and lacked essential features for efficient schema design.

**Technology Stack:**
- **Frontend:** React 19, TypeScript, Vite, TailwindCSS, Monaco Editor
- **Backend:** PHP 8.0+, PDO, AltoRouter
- **Database:** MySQL/MariaDB (with architecture for multi-database support)
- **UI Components:** Radix UI, Lucide Icons, shadcn/ui components

## Key Features

### Currently Implemented

- **Multi-Connection Management:** Create, store, and switch between multiple database connections with encrypted password storage
- **Database Operations:** Browse databases, switch between schemas, and view database structures
- **Table Management:** Create, drop, rename, and truncate tables with comprehensive column configuration
- **Advanced SQL Editor:** Monaco-based editor with syntax highlighting for writing and executing SQL queries
- **Query Execution:** Real-time query execution with formatted result visualization and performance metrics
- **Schema Explorer:** Interactive sidebar navigation for databases, tables, and columns
- **Column Inspector:** Detailed column information including data types, constraints, and metadata
- **Query File Management:** Multiple query tabs with unsaved changes tracking
- **Connection Security:** Encrypted password storage using secure encryption methods

### Planned Features

The following features are mentioned in the project vision but not yet implemented:

- **Role-Based Access Control (RBAC):** User authentication and permission management system
- **Team Collaboration:** Query sharing and collaborative schema management
- **Query History & Favorites:** Comprehensive query management with versioning
- **Export Functionality:** Multi-format data export capabilities
- **Enhanced Schema Designer:** Visual database schema design and relationship mapping

## Project Status

⚠️ **Development Status:** This project is currently under active development and incomplete. Development was paused due to academic commitments and other priorities. The core database connection and query execution features are functional, but several planned features (particularly user management and collaboration tools) are still in the design phase.

I plan to continue improving this project when time permits, with a focus on:
1. Implementing role-based access control
2. Adding user authentication and session management
3. Enhancing the visual schema designer
4. Improving query autocomplete and IntelliSense features
5. Adding comprehensive testing coverage

## Architecture

The application follows a clean separation of concerns:

```
database-manager/
├── frontend/          # React + TypeScript SPA
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── features/     # Feature-specific components
│   │   ├── services/     # API client services
│   │   ├── hooks/        # Custom React hooks
│   │   └── types/        # TypeScript type definitions
│   └── ...
├── backend/           # PHP REST API
│   ├── classes/         # Core classes (Database, Snitch logger)
│   ├── routes/          # API route handlers
│   ├── functions/       # Helper functions
│   ├── configs/         # Configuration files
│   └── data/            # Connection storage
└── README.MD
```

## Development Highlights

- **Security-First Design:** Encrypted connection credentials, prepared statements for SQL injection prevention
- **Modern UI/UX:** Clean, responsive interface built with modern design principles
- **Developer Experience:** Monaco editor integration for professional-grade SQL editing
- **Extensible Architecture:** Modular design allowing for easy feature additions
- **Type Safety:** Full TypeScript implementation on the frontend

## Acknowledgments

This project represents my efforts to create a more intuitive and feature-rich database management tool, combining my backend development expertise with modern frontend technologies. While still under development, it demonstrates proficiency in full-stack development, API design, database operations, and modern web application architecture.

---

*Note: This is a work-in-progress portfolio project. The codebase reflects experimentation and learning, with ongoing refactoring and improvements planned.*
