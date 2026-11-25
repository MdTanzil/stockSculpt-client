# stockSculpt — Client

Frontend for **stockSculpt**, an Inventory Management System where shop owners
manage products, orders and subscriptions from one dashboard, and admins
manage shops and users.

- **Live site:** https://stocksculpt.web.app/
- **API:** https://stock-sculpt-server.vercel.app/api/
  ([stockSculpt-server](https://github.com/MdTanzil/stockSculpt-server))
- **Demo account** (shown on the login page, with a one-click
  "Login as Demo User" button): `demo@stocksculpt.app` / `Demo1234`.
  It owns a separate "Demo Shop" with sample products, orders,
  suppliers and purchase orders, so visitors can try every feature.
  The demo data is shared — anyone signed in as the demo user can
  change it.

## Features

- Shop creation and management, with subscription plans (free plan: up to
  3 products)
- Product management — add, edit, delete, stock tracking with low-stock
  warnings, plus search, category and low-stock filters. A product can
  have a discount price (below the regular price) — POS, orders and
  reports then use the discount price, and receipts and invoices show
  the customer "You saved" total. Many products at once: the Import CSV
  button downloads a template and imports a filled-in file, validating
  each row (bad rows are listed with their line number, good rows are
  still imported) and respecting the plan's product limit
- Order management — create orders, update status, per-shop order lists,
  inline status change from the orders table, plus search by order number
  or product name and a status filter. Creating an order checks stock
  and decrements it (the picker shows what is on hand); cancelling an
  order gives the stock back, and deleting one does too
- Activity log — an append-only record of who changed what in the shop
  (products, orders, POS sales, suppliers, purchase orders, staff, shop
  settings and plan changes), with before → after details, on the
  Activity page with area, action and date filters
- Supplier management — supplier records with contact details
- Purchase orders — order stock from suppliers (draft → ordered →
  received / canceled); receiving a purchase order adds its quantities
  to product stock automatically
- Reports — KPI summary, sales by product / category / month, best
  sellers and slow movers, and inventory valuation, with a date-range
  filter and CSV + PDF export for every table
- Per-shop staff roles — the owner invites staff by email from the Staff
  page (Manager / Staff / Viewer); the dashboard hides create, edit and
  delete actions a role is not allowed to use (viewers are read-only,
  staff cannot delete, only the owner manages staff and shop settings).
  Staff members need an account first — no invitation email is sent yet
- Point of sale — a register screen: search products by name or barcode,
  tap to add them to a sale, or scan a barcode (type it, use a USB
  scanner, or the camera — the camera keeps running so items can be
  scanned one after another) to add the product straight to the cart;
  cart quantities can be typed in as well as stepped. Choose cash or
  card (recorded only, no payment is processed), complete the sale to
  decrement stock and create a completed order, then print a
  supershop-style thermal receipt (narrow, 80mm — the success screen
  shows a preview and a Print receipt button that prints only the
  receipt) or download the full receipt as a PDF. POS orders are marked
  with a POS chip in the orders table. Staff and above can sell;
  viewers cannot
- Invoices — the Checkout page lists orders with a PDF download and a
  Print button (opens the invoice in a new tab for printing from the
  browser's PDF viewer). Invoices and POS receipts show who prepared
  the order ("Prepared by") when the server recorded it — orders made
  before that field existed show no name. Both carry a shop-style
  note ("Goods once sold cannot be returned or exchanged. Please
  check your items before leaving the shop.")
- Dashboard layout — the dashboard is an app shell: the navbar, sidebar
  and footer stay fixed while only the content area scrolls, so long
  pages never slide underneath the navbar
- Barcode scanning — the Scan page finds a product by barcode: use the
  phone/laptop camera (html5-qrcode), type or paste the code, or use a
  USB barcode scanner (it types the code). Found products show price and
  stock with a quick stock adjuster; an unknown code offers a quick-add
  form that creates the product with that barcode. Products have an
  optional barcode field (unique per shop, set in the product form).
  Any team member can look up; only staff and above can adjust stock
  or add products
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
- Subscriptions — plans live in the database and are managed by the
  admin (Manage Plans page), so prices change without a code deploy.
  The subscription page shows monthly/yearly billing (yearly is 2 months
  free) and the current plan; checkout is a real Stripe payment page
  (test mode) with an order summary, separate card number / expiry / CVC
  fields and Stripe's official test cards with copy buttons
  (4242… succeeds, 4000…9995 declines, 4000…3155 asks for 3D Secure).
  A successful payment activates the premium plan on the shop.
  Payments need `STRIPE_SECRET_KEY` on the server — without it the
  payment page shows a "not set up yet" notice.
- Shop settings page (name, address, logo)
- Admin panel — platform stats, manage shops, users and plans (admin
  role required; other users are redirected to their dashboard); admins
  can set any shop to any plan from Manage Shops (Free / Starter /
  Company / Enterprise), picking the period it runs for (Monthly,
  Yearly, or an exact end date — the plan's expiry shows in Manage
  Shops, Settings, and on the subscription page), and create/edit/
  deactivate plans from Manage Plans. The subscription page is public
  — anyone can view the plans; signing in is only forced when buying
  (the payment page sends logged-out buyers to /login and back to the
  checkout afterwards, keeping the chosen plan). A paid plan that
  reaches its end date gets a 5-day grace period with a renewal notice on the dashboard
  and subscription page; if the shop still hasn't paid, the subscription
  cancels itself and the shop drops to the Free plan. The Free plan
  covers the core (products up to its limit, orders, dashboard,
  invoices); point of sale, barcode scanning, reports, suppliers,
  purchase orders and staff roles are paid features — free shops see
  them with a lock in the sidebar and land on an upgrade wall when they
  open one, and the server rejects the calls. A shop over its product
  limit (e.g. after a downgrade) keeps all its products and can still
  sell them; it just cannot add new ones until it is back under the
  limit or upgrades.
- About and Services pages
- Firebase Authentication (email/password + Google sign-in)

## Demo account

- **Demo user:** `demo@stocksculpt.app` / `Demo1234` — shown on the login
  page with a one-click "Login as Demo User" button. It owns a separate
  "Demo Shop" with sample products, orders, suppliers and purchase
  orders, so visitors can explore every feature without signing up.

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
