
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an educational platform frontend built with Next.js 15, featuring:
- Multi-language support (English/Vietnamese) with next-intl
- Course management and video learning with Mux player
- Authentication via NextAuth with Google OAuth and credentials
- Payment integration with PayPal
- Real-time video communication with Agora RTC
- Material-UI design system with Tailwind CSS

## Common Development Commands

```bash
# Development
npm run dev          # Start development server

# Build and Deployment  
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Project Architecture

### Core Technologies
- **Next.js 15** with App Router and RSC
- **TypeScript** for type safety
- **NextAuth v5** for authentication
- **next-intl** for internationalization
- **Material-UI v6** + Tailwind CSS for styling
- **React Hook Form** + Zod for form validation
- **Mux Player** for video streaming

### Key Directory Structure
```
src/
├── app/[locale]/           # Localized pages (en/vi)
├── components/             # Reusable UI components
├── actions/               # Server actions for data mutations
├── auth.ts               # NextAuth configuration
├── middleware.ts         # Locale routing & auth middleware
├── context/              # React contexts (Currency)
├── services/             # Client-side services
└── utils/                # Shared utilities
```

### Authentication Flow
- NextAuth v5 handles session management
- Supports Google OAuth and email/password
- Middleware handles auth redirects and locale routing
- Session data includes user info and access tokens

### Internationalization
- Route-based localization: `/en/...` and `/vi/...`
- Translation files in `messages/` directory
- Middleware handles automatic locale detection/routing
- `next-intl` provides navigation utilities

### API Integration
- Server actions in `src/actions/` for data mutations
- `utils/api.ts` contains request utilities
- Environment variable `NEXT_PUBLIC_SERVER` for backend URL
- Uses revalidateTag for cache invalidation

### State Management
- React Context for global state (Currency)
- Server state via Next.js caching and revalidation
- Form state with React Hook Form
- Session state via NextAuth

## Development Guidelines

### Authentication
- Use `auth()` from `src/auth.ts` for server-side session checks
- Access user data via session: `session.user.access_token`
- Protected routes defined in middleware.ts

### Internationalization  
- Import navigation utilities from `src/i18n/routing.ts`
- Use `useTranslations()` hook for client components
- Add translations to both `messages/en.json` and `messages/vi.json`

### API Calls
- Use server actions for mutations (in `src/actions/`)
- Server actions automatically handle revalidation
- Use `sendRequest` utility for custom API calls
- Include Authorization header with access token when needed

### Styling
- Material-UI components for complex UI elements
- Tailwind for utility classes and layout
- Custom theme defined in `src/app/[locale]/theme.ts`
- Responsive design with mobile-first approach

### Forms
- React Hook Form for form state management
- Zod schemas for validation (see `lib/validationSchemas.ts`)
- Server-side validation in server actions

### Video Integration
- Mux Player React for video playback
- Course content structured with sections and lectures
- Video upload via server actions to backend

You are an expert in JavaScript, React, Node.js, Next.js App Router, Material-UI, next-intl, NextAuth, and Tailwind CSS.
    