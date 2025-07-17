# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (auto-finds available port starting from 3000)
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code linting

## Project Architecture

### Core Framework & Structure
- **Next.js 15** with App Router using TypeScript
- **Internationalization**: next-intl with English (`en`) and Vietnamese (`vi`) support
- **Styling**: Tailwind CSS with Material-UI components
- **Authentication**: NextAuth.js with Google OAuth and credentials-based login
- **State Management**: React Context (Currency, Authentication sessions)

### Key Architectural Patterns

#### Routing & Internationalization
- All routes are prefixed with locale: `/[locale]/page-name`
- Locale routing handled by `src/i18n/routing.ts` and middleware
- Middleware (`src/middleware.ts`) manages locale detection, authentication, and redirects
- Translation files in `messages/en.json` and `messages/vi.json`

#### Authentication Flow
- NextAuth.js configuration in `src/auth.ts`
- Supports Google OAuth and credential-based login
- Custom authentication service in `src/auth.service.ts`
- Session management integrated with backend API via JWT tokens
- Custom error handling for authentication states

#### API Communication
- Centralized API utilities in `utils/api.ts`
- `sendRequest<T>()` for JSON requests with generic typing
- `sendRequestFile<T>()` for file uploads (FormData)
- All API calls include proper error handling and status code management
- Backend integration via `process.env.NEXT_PUBLIC_SERVER`

#### Component Architecture
- **Feature-based organization**: Components grouped by feature (Auth, Cart, Courses, etc.)
- **Shared components**: Common UI elements in `src/components/common/`
- **Layout components**: Navigation, toasts, and providers in layout structure
- **Form handling**: React Hook Form with Zod validation schemas

### Data Flow & Types

#### Entity Types
- Comprehensive TypeScript interfaces in `types/entities.d.ts`
- Core entities: `ICourse`, `IUser`, `ICategory`, `IEnrollment`, `IOrder`
- Course content structure: `ISection` containing `ILecture` arrays
- Payment integration: `OrderStatus`, `PaymentMethod` enums

#### Server Actions
- Course management actions in `src/actions/coursesAction.ts`
- CRUD operations with proper error handling and cache revalidation
- File upload handling for thumbnails and lecture videos
- Content management for course sections and lectures

#### Validation & Forms
- Zod schemas in `src/lib/validationSchemas.ts`
- Comprehensive form validation for authentication, course creation, profiles
- File upload validation with size and type constraints
- Type inference for form data throughout the application

### Key Features

#### Course Management
- Multi-step course creation with sections and lectures
- Video upload and processing for course content
- Thumbnail management via Cloudinary integration
- Course categorization and filtering

#### E-commerce Integration
- Shopping cart with persistent state
- Multiple payment methods (VNPAY, PayPal)
- Currency conversion (VND/USD) with exchange rate API
- Order management and transaction tracking

#### User Experience
- Responsive design with mobile-first approach
- Toast notifications via centralized service (`src/services/toast.ts`)
- Loading states and error boundaries
- Accessibility considerations with proper ARIA labels

### Environment & Configuration

#### Required Environment Variables
- `NEXT_PUBLIC_SERVER` - Backend API URL
- Authentication provider secrets (Google OAuth)
- Database and external service configurations

#### Development Setup
- The application auto-detects available ports during development
- Cloudinary integration for image/video storage
- Material-UI theme configuration in `src/app/[locale]/theme.ts`

### Common Development Tasks

#### Adding New Features
1. Create feature-specific components in appropriate directories
2. Add necessary validation schemas in `src/lib/validationSchemas.ts`
3. Implement server actions if backend integration is required
4. Add internationalization strings to both `messages/en.json` and `messages/vi.json`
5. Update TypeScript types in `types/entities.d.ts` if needed

#### Working with Forms
- Use React Hook Form with Zod resolvers
- Import validation schemas from `src/lib/validationSchemas.ts`
- Implement proper error handling with toast notifications
- Follow existing form patterns in authentication components

#### API Integration
- Use `sendRequest` or `sendRequestFile` from `utils/api.ts`
- Implement proper error handling for API responses
- Add loading states and user feedback
- Follow existing patterns in `src/actions/` directory

### Code Quality & Standards
- ESLint configuration with Next.js recommended rules
- TypeScript strict mode enabled
- Consistent component structure and naming conventions
- Comprehensive error handling throughout the application