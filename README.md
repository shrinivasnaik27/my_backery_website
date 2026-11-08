# SHABARI Sweets & Bakery (ಶಬರಿ ಸ್ವೀಟ್ಸ್ & ಬೇಕರಿ)
**Premium Online Storefront, Menu Exploration & WhatsApp Ordering Platform**  
*Location: Bhatkal, Uttara Kannada, Karnataka, India*

---

## 1. Project Overview

This is a website built for **SHABARI Sweets & Bakery (ಶಬರಿ ಸ್ವೀಟ್ಸ್ & ಬೇಕರಿ)** in Bhatkal, Karnataka. It reflects the storefront branding and visual categories:
- **Cakes & Celebrations**
- **Fresh Pastries & Tarts**
- **Evening Chats & Street Snacks**
- **Ice Cream & Kulfi**
- **Traditional Indian Sweets (Pure Desi Ghee)**
- **Bakery Specialties (Puffs, Rusks, Cookies, Buns)**

Designed with warm cream and elegant beige backgrounds, deep chocolate brown typography, subtle gold accents, and bilingual English + Kannada branding.

---

## 2. Key Features

- **Top Bar Contract**: Clean 3-zone header with single-line wordmark, bilingual Kannada branding, 5 concise navigation links, language selector (English, Kannada, Hindi), and an interactive enquiry cart button.
- **Hero Banner**: "A Little Sweetness, A Lot of Happiness." (ಸ್ವಲ್ಪ ಮಾಧುರ್ಯ, ಅಪಾರ ಸಂತೋಷ), high-resolution confectionery photography, quick trust indicators, and three primary CTAs: *Explore Our Menu*, *Order on WhatsApp*, and *Get Directions*.
- **Category Explorer**: Direct access to all 6 shop categories with bilingual titles and instant category filtering.
- **Interactive Menu Experience**:
  - Live search across English and Kannada names, descriptions, and categories.
  - Price sorting (Low to High, High to Low, Featured).
  - Individual product cards with dietary labels (`100% Eggless`, `Pure Veg`), price in ₹ tabular numerals, and quick-add actions.
  - Product Quick View modal with dynamic portion size calculation (e.g. 250g, 500g, 1kg) and direct WhatsApp enquiry.
- **Cake Enquiry & Customization Builder**:
  - Celebration selector (Birthdays, Anniversaries, Weddings, Festivals, Milestones).
  - Flavour & weight picker (500g to 3kg+ multi-tier).
  - 100% Eggless preference toggle.
  - Real-time custom message on cake preview.
  - Preferred pickup date and time scheduling.
  - Generates pre-formatted WhatsApp enquiry and logs to the admin database.
- **Customer Ordering System & Cart**:
  - Slide-out cart drawer with itemized pricing and quantity incrementers (`-` / `+`).
  - Fulfilment preferences: In-Store Pickup or Local Delivery Enquiry.
  - Generates a formatted WhatsApp message with items, quantities, and estimated totals.
  - Post-order confirmation modal with disclaimer: *"Awaiting Store Confirmation"*.
- **Photo Gallery & Lightbox**:
  - Filter by Storefront, Sweets, Cakes, Pastries, and Chats.
  - High-res lightbox modal with zoom, next/prev controls, and link sharing.
- **Customer Reviews & Google Maps Integration**:
  - Testimonials with verified local tags and source labels.
  - One-click *Review on Google Maps* button.
  - Customer feedback modal that submits for owner approval.
- **Verified Contact & Location**:
  - Store address in English and Kannada with Bhatkal landmark.
  - Interactive Google Maps embed with GPS coordinates (13.9856° N, 74.5539° E).
  - Click-to-call and WhatsApp click-to-chat.
- **Owner Management Console (Admin Dashboard)**:
  - Passcode-protected portal (default: `shabari123` or `bhatkal`).
  - Real-time Product & Pricing management: Add, edit, delete, toggle availability, change prices, and toggle demo sample status.
  - Order Enquiries manager: Update order statuses (*New*, *Contacted*, *Confirmed*, *Ready*, *Completed*) and initiate 1-click WhatsApp customer chat.
  - Cake Enquiries manager: View cake messages, occasions, and pickup dates.
  - Business Settings: Update telephone, WhatsApp, address, opening hours, top announcement banner, and verification flags.
  - Gallery & Reviews moderation: Add new photos and approve reviews.
  - Seed reset: Restore initial demonstration data with one click.
- **SEO & Structured Data**:
  - `Bakery` / `LocalBusiness` Schema.org JSON-LD structured data.
  - Bhatkal local keyword optimization (*"Sweets shop in Bhatkal"*, *"Bakery in Bhatkal"*, *"Cakes in Bhatkal"*).
  - OpenGraph and Twitter cards.

---

## 3. Technology Stack & Folder Structure

```
├── index.html                   # HTML entry point with Schema.org JSON-LD & Google Fonts
├── metadata.json                # App identity and capabilities
├── package.json                 # Dependencies & scripts
├── supabase_schema.sql          # Complete Supabase/PostgreSQL schema with RLS policies
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite build configuration with Tailwind v4
└── src/
    ├── main.tsx                 # React entry point
    ├── App.tsx                  # Root app layout assembling all components
    ├── index.css                # Tailwind CSS v4 custom theme & typography
    ├── types/
    │   └── index.ts             # Domain models (Product, CakeEnquiry, OrderEnquiry, Settings)
    ├── data/
    │   ├── initialData.ts       # Seed delicacies, business settings, FAQs & reviews
    │   └── translations.ts      # Multilingual dictionary (English, Kannada, Hindi)
    ├── context/
    │   └── StoreContext.tsx     # State management, localStorage persistence & WhatsApp links
    ├── assets/
    │   └── images/              # High-fidelity photography for sweets, storefront, cakes, chaat
    └── components/
        ├── Header.tsx           # Sticky navigation with 3-zone contract & language switcher
        ├── Hero.tsx             # Bilingual hero banner with quick trust badges
        ├── CategoriesOverview.tsx # 6 category showcase with jump filters
        ├── MenuSection.tsx      # Filterable & searchable delicacies menu
        ├── ProductCard.tsx      # Food card with dietary tags & quick add
        ├── ProductDetailModal.tsx # Portion weight calculator & modal
        ├── CakesSection.tsx     # Cake varieties & custom builder trigger
        ├── CakeEnquiryModal.tsx # Celebration cake enquiry builder
        ├── CartDrawer.tsx       # Slide-out enquiry cart & checkout form
        ├── OrderConfirmationModal.tsx # Post-submission confirmation modal
        ├── AboutSection.tsx     # Bhatkal identity & freshness commitment
        ├── GallerySection.tsx   # Categorized gallery with hover overlays
        ├── ImageLightboxModal.tsx # Fullscreen lightbox viewer
        ├── ReviewsSection.tsx   # Verified feedback & Google Maps CTA
        ├── ReviewModal.tsx      # Customer feedback submission form
        ├── ContactSection.tsx   # Verified store address, timings & Google Maps embed
        ├── FaqSection.tsx       # Common questions accordion
        ├── Footer.tsx           # Brand wordmark, copyright & owner portal trigger
        ├── FloatingWhatsApp.tsx # Floating WhatsApp & cart pill
        ├── AdminLoginModal.tsx  # Owner passcode modal
        └── AdminDashboard.tsx   # Full owner management console
```

---

## 4. Localhost Run Commands

To run this application locally:

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server (port 3000)
npm run dev

# 3. Build for production
npm run build

# 4. Preview the production build
npm run preview

# 5. Type-check & lint
npm run lint
```

---

## 5. Deployment Instructions

### Option A: Static / CDN Hosting (Vercel, Netlify, Cloudflare Pages)
1. Run `npm run build` to generate the production bundle inside the `dist/` directory.
2. Connect your GitHub repository to Vercel or Netlify.
3. Set the build command to `npm run build` and output directory to `dist`.

### Option B: Google Cloud Run / Containerized Hosting
1. Build with `npm run build`.
2. Deploy the container serving on port 3000.

---

## 6. Remote Supabase Integration Guide

To connect with a remote Supabase backend:
1. Create a project in [Supabase](https://supabase.com).
2. Open the SQL Editor in Supabase and paste the contents of `supabase_schema.sql`.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your `.env` file.
4. All tables (`business_settings`, `products`, `order_enquiries`, `cake_enquiries`, `gallery_items`, `customer_reviews`, `faqs`) are already mapped with complete RLS security policies.

---

## 7. Testing & Verification Checklist

- [x] **Branding & Typography**: English (*SHABARI Sweets & Bakery*) and Kannada (*ಶಬರಿ ಸ್ವೀಟ್ಸ್ & ಬೇಕರಿ*) render correctly with Noto Sans Kannada.
- [x] **Top Bar Contract**: Single-line wordmark, 5 clean navigation links, and primary cart CTA.
- [x] **Demonstration Mode**: Clearly visible banner stating prices/hours are sample entries pending owner verification.
- [x] **Menu Search & Filters**: Instant search by English or Kannada name, category filtering, and price sorting.
- [x] **Portion Calculator**: Portion size selection (250g, 500g, 1kg) dynamically recalculates prices.
- [x] **Celebration Cake Builder**: Occasion, flavour, weight, eggless toggle, message on cake, and pickup date/time.
- [x] **Cart & WhatsApp Checkout**: Generates pre-formatted WhatsApp message with items, quantities, and estimated totals.
- [x] **Owner Dashboard**: Passcode authentication (`shabari123`), live product price editing, availability toggling, enquiry status updates, and business info saving.
- [x] **Google Maps Integration**: Interactive map embed centered on Bhatkal, Karnataka, with direct directions link.
- [x] **Zero Dead Clicks**: All buttons, modal triggers, links, and accordions are functional.
- [x] **Zero Broken Images**: Resilient image fallbacks for all cards and banners.
- [x] **TypeScript & Linting**: 0 errors across `compile_applet` and `lint_applet`.
