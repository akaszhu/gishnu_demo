# Trade Meds — Clinical Apparel & Medical Essentials

A full-stack direct-to-consumer (D2C) clinical apparel and medical essentials storefront built for doctors, nurses, residents, and medical students across India. Powered by React, TypeScript, Tailwind CSS, Motion, Express, and server-side Gemini AI via the `@google/genai` SDK.

---

## Key Features

### 1. Clinical Merchandising & Product Discovery
- **15-Item Clinical Catalog** spanning Women's & Men's Scrubs (`ecoflex™`, `DRIFT™`, `Classic`), Chief Lab Coats, `6sense` Acoustic Stethoscopes, Ergonomic Recovery Clogs, Underscrubs, and Scrub Caps.
- **Interactive Hero & Clinician Testimonials Carousels** with auto-sliding transitions, directional motion, and reduced-motion accessibility support (`MotionConfig reducedMotion="user"`).
- **Live Colorway Swatch Switching** directly on product cards and product detail pages, updating studio imagery in real time alongside `% OFF` MRP savings badges.
- **Instant Header Search Preview** returning matching products with thumbnails, category labels, and pricing as you type.
- **Shop Filtering & Sorting** across categories, fabric lines, search keywords, price ceiling, and sort orders, plus a **Complete 3-Piece Shift Kit Builder** and **Recently Viewed** shelf.

### 2. Product Detail, Custom Embroidery & Sizing
- Full product drill-down pages with colorway selection, size availability, fabric care specifications, and clinical highlights.
- **Custom Chest Embroidery (+₹199)** with real-time name/designation/font/thread customization on eligible scrubs, lab coats, and ward jackets.
- **Interactive Size Guide Modal** and wishlist persistence.

### 3. Cart, Checkout & Order Lifecycle
- **Slide-Over Cart Drawer** with promo code support (`FLASH12`, `DOC10`, `STUDENT15`), itemized discount totals, and a **Frequently Added for Shifts** quick-upsell strip.
- **Guided 3-Step Checkout** (`Bag → Shipping & Payment → Confirmed`) with **live 6-digit PIN serviceability checks**, sticky thumbnail order summary, multiple payment options (UPI, Cards, NetBanking, 0% EMI, COD), and optional GSTIN Tax Invoice generation.
- **Order Tracking & Institutional Bulk Quotes** (`/track-order`, `/bulk-orders`) plus saved addresses and order history under account profiles.

### 4. Offline Experience Centres
- Store locator covering **8 Experience Centres** across India (Bengaluru, Mumbai, New Delhi, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad) with landmarks, operating hours, contact numbers, and city filtering.

### 5. AI Care Guide & Match Guard
- Dual-tab floating assistant featuring:
  - **Care Guide Chat**: Server-side grounded Gemini assistant (`POST /api/chat`) constrained by **Match Guard** policies (prompt-injection shield, domain-scope boundary, clinical/medical advice disclaimer, and strict catalog-truth grounding).
  - **Kit Matcher**: Interactive Fit, Climate, and Shift questionnaire that recommends tailored outfits and gear with one-click navigation.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, `motion/react`, `lucide-react`
- **Backend**: Express 4, `tsx` (dev) / Node.js, `dotenv`
- **AI Integration**: `@google/genai` (`gemini-4-hydrogen` via server-side `/api/chat` proxy with structured JSON output)

---

## Project Structure

```text
.
├── index.html                  # HTML entry point & OpenGraph metadata
├── metadata.json               # Applet metadata & capabilities
├── package.json                # Dependencies and npm scripts
├── server.ts                   # Express API (/api/health, /api/chat) + Vite SPA middleware
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite + Tailwind v4 configuration
└── src
    ├── App.tsx                 # Top-level view routing & layout shell
    ├── main.tsx                # React root mount
    ├── index.css               # Global Tailwind styles & design tokens
    ├── assets/images/          # Studio apparel, footwear, stethoscope & hero imagery
    ├── context/StoreContext.tsx# Global state (cart, wishlist, orders, promo, recently viewed)
    ├── data/
    │   ├── catalog.ts          # 15 verified products, promo codes & size charts
    │   └── stores.ts           # 8-city offline Experience Centres directory
    ├── types/                  # Shared TypeScript interfaces
    ├── components/
    │   ├── AssistantMatchGuard.tsx
    │   ├── BrandLogo.tsx
    │   ├── CartDrawer.tsx
    │   ├── Footer.tsx
    │   ├── Header.tsx
    │   ├── ProductCard.tsx
    │   ├── ResilientImage.tsx
    │   └── SizeGuideModal.tsx
    └── pages/
        ├── HomePage.tsx
        ├── ShopPage.tsx
        ├── ProductDetailPage.tsx
        ├── CartPage.tsx
        ├── CheckoutPage.tsx
        ├── OrderSuccessPage.tsx
        ├── BulkOrdersPage.tsx
        ├── StoresPage.tsx
        ├── TrackOrderPage.tsx
        └── WishlistAndAccountPages.tsx
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Environment Variables
Create a `.env` file based on `.env.example`:

```bash
GEMINI_API_KEY="your_gemini_api_key"
APP_URL="http://localhost:3000"
```

> `GEMINI_API_KEY` is used exclusively on the Express backend (`server.ts`) and is never exposed to the client bundle.

### Install & Run Locally

```bash
# Install dependencies
npm install

# Start Express + Vite development server on port 3000
npm run dev
```

Open `http://localhost:3000` in your browser.

### Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Runs the Express API and Vite dev server via `tsx server.ts` on port `3000` |
| `npm run build` | Builds the production frontend bundle into `dist/` |
| `npm run start` | Serves the production application with `node server.ts` |
| `npm run lint` | Runs TypeScript type-checking (`tsc --noEmit`) |

---

## API Endpoints

- `GET /api/health` — Returns service health JSON (`{ "status": "ok", "service": "trade-meds-storefront" }`).
- `POST /api/chat` — Grounded Gemini Care Guide & Match Guard endpoint accepting `{ messages, context }` and returning structured `{ guardStatus, guardReason, reply, recommendedProductIds, suggestedActions, followUpPrompts }`.
