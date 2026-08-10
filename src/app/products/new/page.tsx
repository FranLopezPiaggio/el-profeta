import { ProductForm } from "@/ui/components/common/product-form";

export default function NewProductPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Nuevo Producto</h1>
      <ProductForm />
    </main>
  );
}