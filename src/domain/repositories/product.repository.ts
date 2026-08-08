import { Product } from "../entities/product.entity";

export interface IProductRepository {
    /**
     * Obtiene la lista de todos los productos del catálogo con sus variantes.
     */
    getCatalog(): Promise<Product[]>;

    /**
     * Obtiene un producto individual por su slug amigable.
     */
    getBySlug(slug: string): Promise<Product | null>;
}