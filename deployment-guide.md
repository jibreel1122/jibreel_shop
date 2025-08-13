# ModernWear E-commerce - Free Deployment Guide

## Your Complete Full-Stack Men's Clothing Store

This is a production-ready e-commerce platform with:
- 🛒 Shopping cart & checkout
- 👤 User authentication (Replit Auth)
- 🏪 Admin dashboard for store management
- 💰 Complete order management system
- 📱 Mobile-responsive design

## Project Structure

```
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/           # App pages (Landing, Catalog, Admin, etc.)
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utilities
│   └── index.html
├── server/                   # Express.js backend
│   ├── db.ts               # Database connection
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Database operations
│   ├── replitAuth.ts       # Authentication
│   └── index.ts            # Server entry point
├── shared/
│   └── schema.ts           # Database schema (Drizzle ORM)
└── package.json            # Dependencies
```

## Free Deployment Options

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Add environment variables:
   - `DATABASE_URL` (from Neon/PlanetScale)
   - `SESSION_SECRET` (random string)
   - `REPLIT_DOMAINS` (your domain)
   - `REPL_ID` (your app ID)

### Option 2: Railway
1. Connect GitHub repository
2. Deploy with PostgreSQL addon
3. Set environment variables

### Option 3: Render + Neon
1. Deploy to Render (free tier)
2. Use Neon for PostgreSQL (free tier)

## Database Setup
Your app uses PostgreSQL with these tables:
- `users` - User accounts with admin flags
- `products` - Product catalog
- `orders` - Order management
- `discounts` - Discount codes
- `sessions` - Authentication sessions

## Environment Variables Needed
```
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key
REPLIT_DOMAINS=yourdomain.com
REPL_ID=your-app-id
ISSUER_URL=https://replit.com/oidc
```

## Admin Access
The first user to sign up can be made admin by updating the database:
```sql
UPDATE users SET is_admin = true WHERE email = 'your@email.com';
```

## Features Included
- Product catalog with categories, sizes, colors
- Shopping cart with persistent storage
- Secure checkout process
- User dashboard with order history
- Admin panel with full CRUD operations
- Responsive design for all devices
- Dark/light mode support