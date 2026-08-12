// // src/ui/actions/product.actions.ts
// 'use server';

// import { CreateProductUseCase } from "@/domain/use-cases/create-product";
// import { CreateProductInput } from "@/domain/entities/product.entity";

// export async function createProductAction(data: CreateProductInput) {
//     try {
//         const useCase = new CreateProductUseCase();
//         const product = useCase.execute(data);

//         // Aquí más adelante llamaremos a la capa de persistencia (ej. DB)

//         return { success: true, data: product };
//     } catch (error: any) {
//         return { success: false, error: error.message };
//     }
// }