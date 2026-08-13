// DB Entity interfaces — canonical snake_case row shapes per DATABASE.md.
// Repositories MUST transform these rows into camelCase domain entities
// before passing them to the Service Layer.

export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'expired';

export interface BrandColors {
  primary: string;
  secondary: string;
}

export interface TenantEntity {
  id: string; // UUIDv7
  slug: string;
  custom_domain: string | null;
  name: string;
  whatsapp_number: string;
  brand_colors: BrandColors;
  created_at: string;
  updated_at: string;
}

export interface TenantUserEntity {
  id: string;
  tenant_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'staff';
  created_at: string;
  updated_at: string;
}

export interface CategoryEntity {
  id: string;
  tenant_id: string;
  title: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductEntity {
  id: string;
  tenant_id: string;
  category_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  sku: string | null;
  is_active: boolean;
  images: Array<{ id: string; url: string; order: number }>;
  attributes: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface OrderEntity {
  id: string;
  tenant_id: string;
  order_number: number;
  idempotency_key: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemEntity {
  id: string;
  tenant_id: string;
  order_id: string;
  product_id: string | null;
  product_title: string;
  sku: string | null;
  unit_price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}
