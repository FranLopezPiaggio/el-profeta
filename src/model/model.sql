-- 1. TENANTS (Las tiendas de tus clientes)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(63) UNIQUE NOT NULL, -- Para subdominios: tiendita.tusaas.com
  custom_domain VARCHAR(255) UNIQUE, -- Para dominios propios: tiendita.com
  name VARCHAR(255) NOT NULL,
  brand_colors JSONB DEFAULT '{"primary": "#000000", "secondary": "#ffffff"}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TENANT_USERS (Membresías: Quién administra qué tienda)
CREATE TABLE tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- Vinculado a auth.users de Supabase
  role VARCHAR(20) DEFAULT 'admin', -- 'owner', 'admin', 'staff'
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

-- 3. CATEGORIES (Categorías del catálogo)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, slug)
);

-- 4. PRODUCTS (Catálogo de productos padre)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  general_image JSONB DEFAULT '[]'::jsonb, -- Array: [{"id": "uuid", "url": "https://...", "order": 0}]
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, slug)
);

-- 5. PRODUCTS_VARIANT (Variantes físicas vendibles)
CREATE TABLE products_variant (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  sku VARCHAR(100),
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  stock INT NOT NULL DEFAULT 0,
  attributes JSONB DEFAULT '{}'::jsonb, -- Ej: {"formato": "Lata 473ml", "abv": "6.5%"}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, sku)
);

-- 6. ORDERS (Órdenes de compra)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL, -- Crítico para canal WhatsApp
  status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'PAID', 'CANCELLED'
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. ORDER_ITEMS (Detalle de cada orden con snapshots)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES products_variant(id) ON DELETE SET NULL,
  product_title VARCHAR(255) NOT NULL, -- Snapshot
  variant_title VARCHAR(255) NOT NULL, -- Snapshot
  unit_price DECIMAL(10,2) NOT NULL,   -- Snapshot
  quantity INT NOT NULL DEFAULT 1
);