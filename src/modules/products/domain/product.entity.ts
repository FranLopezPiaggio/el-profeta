// Products module — Domain entity (camelCase, DB-transformed).
// Pure types. No external dependencies.

export interface ProductImage {
  id: string;
  url: string;
  order: number;
}

export interface Product {
  id: string;
  tenantId: string;
  categoryId: string | null;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  sku: string | null;
  isActive: boolean;
  images: ProductImage[];
  attributes: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
