-- ============================================
-- VERTMON HUB - COMPLETE DATABASE SETUP
-- Run this FIRST in a new Supabase project
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. SHOPS (Дэлгүүрүүд / Construction Companies)
-- ============================================
CREATE TABLE IF NOT EXISTS shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,  -- Supabase auth user
    name TEXT NOT NULL,
    description TEXT,
    facebook_page_id TEXT UNIQUE,
    facebook_page_name TEXT,
    facebook_access_token TEXT,
    instagram_account_id TEXT,
    instagram_access_token TEXT,
    owner_name TEXT,
    phone TEXT,
    
    -- Subscription & Billing
    plan_id UUID,
    subscription_plan TEXT DEFAULT 'trial',
    subscription_status TEXT DEFAULT 'active',
    trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    
    -- AI Settings
    ai_instructions TEXT,
    ai_emotion TEXT DEFAULT 'friendly',
    custom_knowledge TEXT,
    
    -- Bank Info
    bank_name TEXT,
    account_number TEXT,
    account_name TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    setup_completed BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shops_user_id ON shops(user_id);
CREATE INDEX IF NOT EXISTS idx_shops_facebook_page_id ON shops(facebook_page_id);

-- ============================================
-- 2. CUSTOMERS (Хэрэглэгчид)
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    facebook_id TEXT,
    instagram_id TEXT,
    name TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    is_vip BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    last_message_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(shop_id, facebook_id)
);

CREATE INDEX IF NOT EXISTS idx_customers_shop ON customers(shop_id);
CREATE INDEX IF NOT EXISTS idx_customers_facebook ON customers(facebook_id);
CREATE INDEX IF NOT EXISTS idx_customers_instagram ON customers(instagram_id);

-- ============================================
-- 3. PRODUCTS (Бүтээгдэхүүн - Legacy, keep for compatibility)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL DEFAULT 0,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    category TEXT,
    sku TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_shop ON products(shop_id);

-- ============================================
-- 4. ORDER STATUS ENUM
-- ============================================
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'pending', 'confirmed', 'processing', 
        'shipped', 'delivered', 'cancelled'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 5. ORDERS (Захиалгууд - Legacy)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    status order_status DEFAULT 'pending',
    total_amount DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    delivery_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_shop ON orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);

-- ============================================
-- 6. ORDER ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL
);

-- ============================================
-- 7. CHAT HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    platform TEXT DEFAULT 'messenger',
    message TEXT,
    response TEXT,
    intent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_shop ON chat_history(shop_id);
CREATE INDEX IF NOT EXISTS idx_chat_customer ON chat_history(customer_id);

-- ============================================
-- 8. AI MEMORY
-- ============================================
CREATE TABLE IF NOT EXISTS ai_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    memory_key TEXT NOT NULL,
    memory_value JSONB NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(shop_id, customer_id, memory_key)
);

-- ============================================
-- 9. ADMINS
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. PLANS (Subscription Plans)
-- ============================================
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    price_monthly INTEGER DEFAULT 0,
    price_yearly INTEGER DEFAULT 0,
    max_products INTEGER DEFAULT 50,
    max_messages INTEGER DEFAULT 500,
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default plans
INSERT INTO plans (name, slug, price_monthly, max_products, max_messages, features) VALUES
    ('Trial', 'trial', 0, 20, 100, '["basic_ai", "messenger"]'),
    ('Starter', 'starter', 149000, 100, 1000, '["basic_ai", "messenger", "instagram", "email_support"]'),
    ('Pro', 'pro', 299000, 500, 5000, '["advanced_ai", "messenger", "instagram", "priority_support", "analytics"]'),
    ('Ultimate', 'ultimate', 599000, -1, -1, '["premium_ai", "all_channels", "dedicated_support", "custom_integrations"]')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PROPERTY-RELATED TABLES (REAL ESTATE)
-- ============================================

-- Property type enum
DO $$ BEGIN
    CREATE TYPE property_type AS ENUM ('apartment', 'house', 'office', 'land', 'commercial');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Property status enum
DO $$ BEGIN
    CREATE TYPE property_status AS ENUM ('available', 'reserved', 'sold', 'rented');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Lead status enum
DO $$ BEGIN
    CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'viewing_scheduled', 'offered', 'negotiating', 'closed_won', 'closed_lost');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 11. PROPERTIES (Real Estate)
-- ============================================
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type property_type NOT NULL DEFAULT 'apartment',
    
    -- Pricing
    price DECIMAL(15, 2) NOT NULL DEFAULT 0,
    price_per_sqm DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'MNT',
    
    -- Specifications
    size_sqm DECIMAL(10, 2),
    rooms INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    floor VARCHAR(20),
    year_built INTEGER,
    
    -- Location
    address TEXT,
    district VARCHAR(100),
    city VARCHAR(100) DEFAULT 'Ulaanbaatar',
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    
    -- Status
    status property_status NOT NULL DEFAULT 'available',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    -- Media
    images TEXT[] DEFAULT '{}',
    video_url TEXT,
    virtual_tour_url TEXT,
    
    -- Features
    features JSONB DEFAULT '[]',
    amenities JSONB DEFAULT '[]',
    
    -- Meta
    views_count INTEGER DEFAULT 0,
    inquiries_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_properties_shop_id ON properties(shop_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);

-- ============================================
-- 12. LEADS (Real Estate CRM)
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    
    -- Lead Info
    status lead_status NOT NULL DEFAULT 'new',
    source VARCHAR(50) DEFAULT 'messenger',
    
    -- Customer Info
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    
    -- Requirements
    budget_min DECIMAL(15, 2),
    budget_max DECIMAL(15, 2),
    preferred_type property_type,
    preferred_district VARCHAR(100),
    preferred_rooms INTEGER,
    
    -- CRM Integration
    hubspot_deal_id VARCHAR(100),
    hubspot_contact_id VARCHAR(100),
    
    -- Activity
    last_contact_at TIMESTAMPTZ,
    next_followup_at TIMESTAMPTZ,
    viewing_scheduled_at TIMESTAMPTZ,
    
    -- Notes
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_shop_id ON leads(shop_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_customer_id ON leads(customer_id);

-- ============================================
-- 13. PROPERTY VIEWINGS
-- ============================================
CREATE TABLE IF NOT EXISTS property_viewings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled',
    customer_feedback TEXT,
    agent_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS shops_updated_at ON shops;
CREATE TRIGGER shops_updated_at BEFORE UPDATE ON shops FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS properties_updated_at ON properties;
CREATE TRIGGER properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS leads_updated_at ON leads;
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'Vertmon Hub database setup completed successfully! ✅' as result;
