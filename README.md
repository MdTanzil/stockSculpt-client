# stockSculpt — Client

Frontend for **stockSculpt**, an Inventory Management System where shop owners
manage products, orders and subscriptions from one dashboard, and admins
manage shops and users.

- **Live site:** https://stocksculpt.web.app/
- **API:** https://stock-sculpt-server.vercel.app/api/
  ([stockSculpt-server](https://github.com/MdTanzil/stockSculpt-server))

## Features

- Shop creation and management, with subscription plans (free plan: up to
  3 products)
- Product management — add, edit, delete, stock tracking with low-stock
  warnings
- Order management — create orders, update status, per-shop order lists
- Dashboard with stats (products, orders, revenue, low-stock alerts) and
  recent orders
- Checkout / invoice page with per-order PDF download
- Subscriptions with Stripe checkout (test mode)
- Shop settings page (name, address, logo)
- Admin panel — platform stats, manage shops and users
- About and Services pages
- Firebase Authentication (email/password + Google sign-in)

## Demo account

- **Admin:** admin@admin.com / T123456t@

## Tech stack

React 18 · Vite 5 · React Router 6 · Tailwind CSS + shadcn/ui (Radix) +
daisyUI · Firebase Auth · Axios · TanStack Query · Stripe · jsPDF ·
Framer Motion

## Getting started

```bash
npm install
npm run dev
```

The app talks to the production API by default
(`https://stock-sculpt-server.vercel.app/api/`).

### Environment variables (optional)

| Variable | Purpose |
|---|---|
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for the subscription checkout. A test key is built in as a fallback, so this is only needed to switch to a live key. |

See `.env.example`.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | Lint (ESLint) |
| `npm run preview` | Preview the production build |

## Deployment

Pushes to `main` deploy automatically to Firebase Hosting
(project `stocksculpt`) via the GitHub Actions workflow in
`.github/workflows/deploy.yml`.

## Project structure

```
src/
├── components/   # Shared UI (navbar, cards, forms, shadcn/ui primitives)
├── firebase/     # Firebase config
├── hooks/        # API hooks (axios instances, shop data)
├── layouts/      # Main, dashboard and admin layouts
├── pages/        # Home, About, Services, Subscription, Payment,
│                 # dashboard (products, orders, checkout, settings),
│                 # admin (stats, users, shops)
├── provider/     # Auth provider
├── router/       # Route definitions
└── utility/      # Helpers (image upload, etc.)
```

## Server

The API lives in
[stockSculpt-server](https://github.com/MdTanzil/stockSculpt-server)
(Express + MongoDB, deployed on Vercel).
