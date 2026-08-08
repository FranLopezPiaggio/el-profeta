'use client';

import { useState } from 'react';
import { createProductAction } from '@/ui/actions/product.actions';

export function ProductForm() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const data = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
    };

    const result = await createProductAction(data);

    if (!result.success) {
      setError(result.error);
    } else {
      alert('Producto creado exitosamente!');
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4 max-w-md">
      {error && <p className="text-red-500">{error}</p>}

      <input name="name" placeholder="Nombre del producto" required className="border p-2" />
      <input name="price" type="number" placeholder="Precio" required className="border p-2" />
      <input name="stock" type="number" placeholder="Stock" required className="border p-2" />

      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Crear Producto
      </button>
    </form>
  );
}