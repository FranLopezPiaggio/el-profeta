// Products module — public catalog view.
// Client component bound to the read Server Action. Receives ONLY camelCase
// entities wrapped in Result<T, DomainError> (never raw DB rows).
'use client';

import { useEffect, useState } from 'react';
import type { Product } from '../domain/product.entity';
import { getCatalogAction } from '../application/product.actions';

type ViewState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; products: Product[] };

export function ProductList() {
  const [state, setState] = useState<ViewState>({ status: 'loading' });

  useEffect(() => {
    getCatalogAction().then((result) => {
      if (result.success) {
        setState({ status: 'ready', products: result.data });
      } else {
        setState({ status: 'error', message: result.error.message });
      }
    });
  }, []);

  if (state.status === 'loading') {
    return <p className="text-stone-500">Cargando productos…</p>;
  }

  if (state.status === 'error') {
    return <p className="text-stone-500">No se pudo cargar el catálogo.</p>;
  }

  if (state.products.length === 0) {
    return <p className="text-stone-500">No hay productos activos todavía.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {state.products.map((product) => (
        <li key={product.id} className="rounded-lg border border-stone-200 p-4">
          <h3 className="font-semibold text-stone-800">{product.title}</h3>
          {product.description && (
            <p className="mt-1 text-sm text-stone-500">{product.description}</p>
          )}
          <p className="mt-2 font-bold text-stone-800">
            ${product.price.toFixed(2)}
          </p>
        </li>
      ))}
    </ul>
  );
}
