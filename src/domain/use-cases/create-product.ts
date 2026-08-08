import { Product, CreateProductInput } from "../entities/product.entity";

export class CreateProductUseCase {
    // Las reglas de negocio van aquí (ej. validaciones de negocio)
    execute(input: CreateProductInput): Product {
        if (input.price <= 0) {
            throw new Error("El precio debe ser mayor a 0");
        }

        if (input.stock < 0) {
            throw new Error("El stock no puede ser negativo");
        }

        const newProduct: Product = {
            id: crypto.randomUUID(), // O generado por persistencia
            ...input,
            createdAt: new Date(),
        };

        return newProduct;
    }
}