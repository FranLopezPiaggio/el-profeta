export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    createdAt: Date;
    slug: string;
    description?: string;
    mainImageUrl?: string;
    categoryName?: string;
    variants: ProductVariant[];
}

export interface CreateProductInput {
    name: string;
    price: number;
    stock: number;
}

export interface ProductVariant {
    id: string;
    sku: string;
    price: number;
    stock: number;
    isAvailable: boolean;
    attributes?: Record<string, unknown>;
}

export interface Category {
    id: string;
    name: string;
}