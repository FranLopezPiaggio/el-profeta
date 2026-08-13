-- ==========================================
-- 0. EXTENSIONES Y FUNCIONES DE AUDITORÍA
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- TYPE: Estados inmutables de la orden
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'completed', 'cancelled', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==========================================
-- 1. TENANTS (Tiendas / Inquilinos)
-- ==========================================
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY, -- Generado como UUIDv7 en la capa de aplicación
    slug VARCHAR(63) UNIQUE NOT NULL,
    custom_domain VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    whatsapp_number VARCHAR(50) NOT NULL,
    brand_colors JSONB DEFAULT '{"primary": "#000000", "secondary": "#ffffff"}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

DROP TRIGGER IF EXISTS update_tenants_updated_at ON tenants;
CREATE TRIGGER update_tenants_updated_at 
BEFORE UPDATE ON tenants 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 2. TENANT_USERS (Membresías / AuthN)
-- ==========================================
CREATE TABLE IF NOT EXISTS tenant_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'admin' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_per_tenant UNIQUE (tenant_id, user_id)
);

DROP TRIGGER IF EXISTS update_tenant_users_updated_at ON tenant_users;
CREATE TRIGGER update_tenant_users_updated_at 
BEFORE UPDATE ON tenant_users 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 3. CATEGORIES
-- ==========================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_category_slug_per_tenant UNIQUE (tenant_id, slug)
);

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at 
BEFORE UPDATE ON categories 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 4. PRODUCTS (Catálogo Plano V0)
-- ==========================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock INT NOT NULL DEFAULT 0,
    sku VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    images JSONB DEFAULT '[]'::jsonb NOT NULL,
    attributes JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_product_slug_per_tenant UNIQUE (tenant_id, slug),
    CONSTRAINT unique_product_sku_per_tenant UNIQUE (tenant_id, sku)
);

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON products 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 5. ORDERS (Órdenes de Compra)
-- ==========================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_number SERIAL,
    idempotency_key VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status order_status DEFAULT 'pending' NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_idempotency_per_tenant UNIQUE (tenant_id, idempotency_key)
);

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
BEFORE UPDATE ON orders 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 6. ORDER_ITEMS (Snapshots Relacionales)
-- ==========================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_title VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

DROP TRIGGER IF EXISTS update_order_items_updated_at ON order_items;
CREATE TRIGGER update_order_items_updated_at 
BEFORE UPDATE ON order_items 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 7. HABILITAR ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 8. POLÍTICAS RLS (Lectura Pública + Privada Admin)
-- ==========================================

-- TENANTS: El middleware necesita leer el tenant por slug (Público)
DROP POLICY IF EXISTS "Lectura pública de tenants" ON tenants;
CREATE POLICY "Lectura pública de tenants" ON tenants
FOR SELECT TO anon, authenticated USING (true);

-- TENANT_USERS: Cada usuario autenticado puede consultar su propio rol
DROP POLICY IF EXISTS "Permitir a usuarios leer sus propios registros en tenant_users" ON tenant_users;
CREATE POLICY "Permitir a usuarios leer sus propios registros en tenant_users" ON tenant_users
FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- CATEGORIES: Lectura pública del catálogo
DROP POLICY IF EXISTS "Lectura pública de categorías" ON categories;
CREATE POLICY "Lectura pública de categorías" ON categories
FOR SELECT TO anon, authenticated USING (true);

-- PRODUCTS: Lectura pública de productos activos
DROP POLICY IF EXISTS "Lectura pública de productos activos" ON products;
CREATE POLICY "Lectura pública de productos activos" ON products
FOR SELECT TO anon, authenticated USING (is_active = true);


-- Habilitar a los administradores lectura total de sus productos (incluso inactivos) y gestión (ALL = SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Gestión total de productos para Admins" ON products
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM tenant_users 
    WHERE tenant_users.user_id = auth.uid() 
      AND tenant_users.tenant_id = products.tenant_id 
      AND tenant_users.role = 'admin'
  )
);

-- Habilitar a los administradores acceso total a las órdenes de su tenant
CREATE POLICY "Gestión total de ordenes para Admins" ON orders
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM tenant_users 
    WHERE tenant_users.user_id = auth.uid() 
      AND tenant_users.tenant_id = orders.tenant_id 
      AND tenant_users.role = 'admin'
  )
);