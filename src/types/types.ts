export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
}

export interface Tenant {
  id: string;
  slug: string;
  customDomain?: string;
  name: string;
  brandColors: {
    primary: string;
    secondary: string;
  };
}

export interface ProductVariant {
  id: string;
  tenantId: string;
  productId: string;
  title: string;
  sku?: string;
  price: number;
  stock: number;
  attributes: Record<string, unknown>;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  order: number;
}

export interface Product {
  id: string;
  tenantId: string;
  categoryId?: string;
  categoryName?: string;
  slug: string;
  description?: string;
  isActive: boolean;
  generalImage: ProductImage[];
  variants: ProductVariant[];
  sku: string;
  name: string;
  category?: Category;  //=> category.id
  // image: string[];
  mainImage: string;
  gallery: string[];
  price: number;
  createdAt: string;
  updatedAt: string;
}
