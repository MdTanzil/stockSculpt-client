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
  warnings, plus search, category and low-stock filters
- Order management — create orders, update status, per-shop order lists,
  inline status change from the orders table, plus search by order number
  or product name and a status filter
- Supplier management — supplier records with contact details
- Purchase orders — order stock from suppliers (draft → ordered →
  received / canceled); receiving a purchase order adds its quantities
  to product stock automatically
- Reports — KPI summary, sales by product / category / month, best
  sellers and slow movers, and inventory valuation, with a date-range
  filter and CSV + PDF export for every table
- Professional data tables across the dashboard and admin panel —
  status badges, right-aligned totals, and summary footers
- Dashboard with stats (products, orders, revenue, low-stock alerts) and
  recent orders
- Dark mode — sun/moon toggle in the navbar, remembered across visits
- Revenue chart on the dashboard — monthly revenue from completed orders
  for the last 6 months
- Stock level bars in the products table, colored by stock level (red at
  5 or fewer, amber at 20 or fewer)
- Low-stock alert banner on the dashboard listing products that need
  restocking, with a shortcut to the products page
- Checkout / invoice page with professional per-order PDF invoices
  (branded header, itemized table, totals)
- Subscriptions with Stripe checkout (test mode)
- Shop settings page (name, address, logo)
- Admin panel — platform stats, manage shops and users (admin role
  required; other users are redirected to their dashboard); admins can
  change any shop's subscription plan (Free / Premium) from Manage Shops
- About and Services pages
- Firebase Authentication (email/password + Google sign-in)

## Demo account

- **Admin:** admin@admin.com / T123456t@

## Tech stack

React 18 · Vite 5 · React Router 6 · Material UI (MUI 9) + Tailwind CSS
(layout utilities) · Firebase Auth · Axios · TanStack Query · Stripe ·
jsPDF · Framer Motion

The design system is MUI: theme in `src/theme.js` (primary `#2c3e50`,
Poppins font, light mode), applied via `ThemeProvider` + `CssBaseline` in
`src/main.jsx`. The old shadcn/ui primitives under `src/components/ui/` are
no longer imported (dead files left in place — the snapshot push cannot
delete files) and daisyUI was removed.

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
├── components/   # Shared UI (navbar, cards, forms; old shadcn/ui
│                 # primitives under ui/ are unused since the MUI move)
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
