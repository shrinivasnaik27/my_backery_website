-- ==============================================================================
-- SHABARI SWEETS & BAKERY (ಶಬರಿ ಸ್ವೀಟ್ಸ್ & ಬೇಕರಿ - ಭಟ್ಕಳ)
-- PRODUCTION SUPABASE / POSTGRESQL DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BUSINESS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS business_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'SHABARI Sweets & Bakery',
    name_kannada TEXT NOT NULL DEFAULT 'ಶಬರಿ ಸ್ವೀಟ್ಸ್ & ಬೇಕರಿ',
    tagline TEXT NOT NULL DEFAULT 'A Little Sweetness, A Lot of Happiness.',
    tagline_kannada TEXT NOT NULL DEFAULT 'ಸ್ವಲ್ಪ ಮಾಧುರ್ಯ, ಅಪಾರ ಸಂತೋಷ.',
    phone TEXT NOT NULL DEFAULT '+91 94480 00000',
    whatsapp TEXT NOT NULL DEFAULT '+919448000000',
    email TEXT DEFAULT 'shabarisweets.bhatkal@gmail.com',
    address TEXT NOT NULL DEFAULT 'Main Road, Bhatkal, Uttara Kannada, Karnataka - 581320',
    address_kannada TEXT NOT NULL DEFAULT 'ಮುಖ್ಯ ರಸ್ತೆ, ಭಟ್ಕಳ, ಉತ್ತರ ಕನ್ನಡ, ಕರ್ನಾಟಕ - 581320',
    landmark TEXT DEFAULT 'Near City Market Circle, Bhatkal',
    google_maps_url TEXT,
    is_demo_mode BOOLEAN DEFAULT TRUE,
    announcement_enabled BOOLEAN DEFAULT TRUE,
    announcement_text TEXT DEFAULT 'Festive Sweet Boxes & Fresh Celebration Cakes Available!',
    announcement_text_kannada TEXT DEFAULT 'ಹಬ್ಬದ ಸಿಹಿ ತಿಂಡಿ ಬಾಕ್ಸ್‌ಗಳು ಮತ್ತು ಸಂಭ್ರಮದ ಕೇಕ್ ಲಭ್ಯವಿದೆ!',
    phone_verified BOOLEAN DEFAULT FALSE,
    whatsapp_verified BOOLEAN DEFAULT FALSE,
    address_verified BOOLEAN DEFAULT FALSE,
    hours_verified BOOLEAN DEFAULT FALSE,
    pricing_verified BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. PRODUCT CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS product_categories (
    id TEXT PRIMARY KEY, -- 'sweets', 'cakes', 'pastries', 'chats', 'ice-cream', 'bakery'
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    name_kannada TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id TEXT REFERENCES product_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_kannada TEXT NOT NULL,
    description TEXT,
    description_kannada TEXT,
    price NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'per kg',
    image_url TEXT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_demonstration BOOLEAN DEFAULT TRUE,
    dietary_type TEXT CHECK (dietary_type IN ('veg', 'eggless', 'contains-egg')) DEFAULT 'veg',
    portion_options JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. CUSTOMER ORDER ENQUIRIES TABLE (Online & Counter Orders & Parcel Pipeline)
CREATE TABLE IF NOT EXISTS order_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_ref TEXT NOT NULL UNIQUE,
    token_number TEXT,
    order_type TEXT DEFAULT 'online-whatsapp',
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    pickup_preference TEXT DEFAULT 'store-pickup',
    delivery_address TEXT,
    special_instructions TEXT,
    items JSONB NOT NULL,
    estimated_total NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'received', -- 'received', 'making_parcel', 'parcel_ready', 'handed_over', 'cancelled'
    parcel_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. CAKE CELEBRATION ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS cake_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enquiry_ref TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    occasion TEXT NOT NULL,
    flavor TEXT NOT NULL,
    weight_kg TEXT NOT NULL,
    is_eggless BOOLEAN DEFAULT TRUE,
    message_on_cake TEXT,
    pickup_date DATE NOT NULL,
    pickup_time TEXT NOT NULL,
    notes TEXT,
    estimated_price NUMERIC(10, 2),
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 6. GALLERY SHOWCASE TABLE
CREATE TABLE IF NOT EXISTS gallery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('storefront', 'sweets', 'cakes', 'pastries', 'chats', 'bakery')),
    image_url TEXT NOT NULL,
    caption TEXT,
    is_official_photo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 7. CUSTOMER REVIEWS TABLE
CREATE TABLE IF NOT EXISTS customer_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_name TEXT NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    comment TEXT NOT NULL,
    source TEXT DEFAULT 'Direct Customer',
    is_verified BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 8. FAQS TABLE
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    question_kannada TEXT,
    answer TEXT NOT NULL,
    answer_kannada TEXT,
    category TEXT DEFAULT 'General',
    display_order INTEGER DEFAULT 0
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cake_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to allow safe re-running
DROP POLICY IF EXISTS "Public read business settings" ON business_settings;
DROP POLICY IF EXISTS "Public read categories" ON product_categories;
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Public read gallery" ON gallery_items;
DROP POLICY IF EXISTS "Public read faqs" ON faqs;
DROP POLICY IF EXISTS "Public read reviews" ON customer_reviews;
DROP POLICY IF EXISTS "Public full access order enquiries" ON order_enquiries;
DROP POLICY IF EXISTS "Public full access cake enquiries" ON cake_enquiries;
DROP POLICY IF EXISTS "Public insert reviews" ON customer_reviews;
DROP POLICY IF EXISTS "Admin full access business settings" ON business_settings;
DROP POLICY IF EXISTS "Admin full access products" ON products;
DROP POLICY IF EXISTS "Admin full access orders" ON order_enquiries;
DROP POLICY IF EXISTS "Admin full access cakes" ON cake_enquiries;
DROP POLICY IF EXISTS "Admin full access gallery" ON gallery_items;
DROP POLICY IF EXISTS "Admin full access reviews" ON customer_reviews;

-- Public can read products, categories, business settings, gallery, FAQs, and reviews
CREATE POLICY "Public read business settings" ON business_settings FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON customer_reviews FOR SELECT USING (true);

-- Store operations: Customers and Staff can insert & update orders/parcels via web app
CREATE POLICY "Public full access order enquiries" ON order_enquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access cake enquiries" ON cake_enquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public insert reviews" ON customer_reviews FOR INSERT WITH CHECK (true);

-- Authenticated Admin has full access to all tables
CREATE POLICY "Admin full access business settings" ON business_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access products" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access orders" ON order_enquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access cakes" ON cake_enquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access gallery" ON gallery_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access reviews" ON customer_reviews FOR ALL TO authenticated USING (true);

-- Initial Categories Seed
INSERT INTO product_categories (id, slug, name, name_kannada, description, display_order)
VALUES
    ('sweets', 'sweets', 'Indian Sweets', 'ಭಾರತೀಯ ಸಿಹಿ ತಿಂಡಿಗಳು', 'Pure ghee and authentic dry fruit sweets freshly made in Bhatkal', 1),
    ('cakes', 'cakes', 'Celebration Cakes', 'ಸಂಭ್ರಮದ ಕೇಕ್', 'Customizable birthday and occasion cakes', 2),
    ('pastries', 'pastries', 'Pastries', 'ಪೇಸ್ಟ್ರಿಗಳು', 'Layered sponge slices and fresh cream pastries', 3),
    ('chats', 'chats', 'Chats & Snacks', 'ಚಾಟ್ಸ್ ಮತ್ತು ತಿಂಡಿಗಳು', 'Crispy, tangy, and savory street food favorites', 4),
    ('ice-cream', 'ice-cream', 'Ice Cream', 'ಐಸ್ ಕ್ರೀಮ್', 'Creamy scoops, cones, and sundaes', 5),
    ('bakery', 'bakery', 'Bakery Specialities', 'ಬೇಕರಿ ವಿಶೇಷತೆಗಳು', 'Freshly baked breads, puffs, cookies, and rusks', 6)
ON CONFLICT (id) DO NOTHING;
