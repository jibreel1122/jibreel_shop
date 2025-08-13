# Overview

ModernWear is a full-stack men's clothing e-commerce platform built with a modern tech stack. The application features a complete shopping experience with product catalog, shopping cart, checkout process, user authentication, and admin dashboard. The project follows a minimalist design approach with a focus on premium men's fashion.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with route protection for authenticated pages
- **State Management**: React Context for cart state, TanStack Query for server state management
- **UI Components**: Radix UI primitives with custom styling using Tailwind CSS and shadcn/ui design system
- **Form Handling**: React Hook Form with Zod schema validation
- **Styling**: Tailwind CSS with CSS variables for theming and dark mode support

## Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with type-safe database operations
- **API Design**: RESTful endpoints with proper error handling and validation
- **Development**: Vite middleware integration for hot module replacement

## Authentication & Authorization
- **Provider**: Replit Auth with OpenID Connect (OIDC) integration
- **Session Management**: Express session with PostgreSQL session store
- **Route Protection**: Middleware-based authentication checks for protected routes
- **User Roles**: Admin role support for dashboard access

## Database Design
- **Primary Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Core Tables**:
  - `users`: User profiles with admin flags
  - `products`: Product catalog with images, variants, and inventory
  - `orders`: Order management with status tracking
  - `discounts`: Discount codes and promotions
  - `sessions`: Session storage for authentication

## Application Structure
- **Monorepo Layout**: Client and server code in separate directories with shared schema
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Code Organization**: Feature-based component structure with reusable UI components
- **Path Aliases**: Configured aliases for clean imports (@, @shared, @assets)

## Data Flow
- **Client-Server Communication**: REST API with JSON payloads and proper error handling
- **State Synchronization**: TanStack Query for caching and synchronization of server state
- **Cart Persistence**: Local storage with React Context for cart state management
- **Real-time Updates**: Query invalidation for data consistency

# External Dependencies

## Core Infrastructure
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit Auth service with OIDC
- **Build & Development**: Vite for fast development and optimized builds

## UI & Styling
- **Component Library**: Radix UI for accessible, unstyled UI primitives
- **Design System**: shadcn/ui component variants and patterns
- **CSS Framework**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React for consistent iconography

## Development Tools
- **Type Safety**: Zod for runtime schema validation
- **Form Management**: React Hook Form for performant form handling
- **Date Handling**: date-fns for date manipulation
- **Development**: tsx for TypeScript execution, esbuild for production builds

## Production Considerations
- **Deployment**: Configured for Vercel deployment with build optimization
- **Environment**: Environment variable configuration for database and auth
- **Security**: CORS configuration, session security, and input validation
- **Performance**: Code splitting, image optimization, and caching strategies