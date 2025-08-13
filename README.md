# ModernWear - Men's Clothing E-commerce Store

A complete, production-ready e-commerce platform built with modern web technologies.

## 🚀 Features

- **Product Management**: Full CRUD operations for products with images, variants, and inventory
- **Shopping Experience**: Product catalog, cart, and secure checkout
- **User Authentication**: Secure login with Replit Auth
- **Admin Dashboard**: Complete store management interface
- **Order Management**: Track and manage customer orders
- **Responsive Design**: Works perfectly on desktop and mobile
- **Modern UI**: Clean, professional design with dark/light mode

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)
- **UI Components**: Radix UI + Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query + React Context
- **Forms**: React Hook Form + Zod validation

## 📦 Installation

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variables**:
   ```env
   DATABASE_URL=your_postgresql_url
   SESSION_SECRET=your_session_secret
   REPLIT_DOMAINS=your_domain
   REPL_ID=your_app_id
   ```
4. **Set up the database**:
   ```bash
   npm run db:push
   ```
5. **Start development server**:
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Free Options:
- **Vercel**: Best for React apps with serverless functions
- **Railway**: Great for full-stack apps with database
- **Render**: Free tier with PostgreSQL support

### Build for Production:
```bash
npm run build
npm start
```

## 👤 Admin Setup

1. Sign up as the first user
2. Update user to admin in database:
   ```sql
   UPDATE users SET is_admin = true WHERE email = 'your@email.com';
   ```
3. Access admin panel from user menu

## 📁 Project Structure

- `/client` - React frontend application
- `/server` - Express.js backend API
- `/shared` - Shared TypeScript types and schemas
- Database schema defined in `shared/schema.ts`

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret key for session encryption |
| `REPLIT_DOMAINS` | Allowed domains for authentication |
| `REPL_ID` | Application identifier for auth |

## 📝 API Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/auth/user` - Get current user
- Authentication routes handled by Replit Auth

## 🎨 Design System

Built with a modern, minimalist design approach:
- Clean typography and spacing
- Consistent color palette
- Responsive breakpoints
- Accessible UI components
- Professional men's fashion aesthetic

## 📄 License

MIT License - feel free to use this project for your own e-commerce needs!