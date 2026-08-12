// src/ui/components/cart/CartButton.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export function CartButton() {
    const [mounted, setMounted] = useState(false);
    const openCart = useCartStore((state) => state.openCart);
    const totalItems = useCartStore((state) => state.getTotalItems());

    // Evita mismatch de hidratación SSR en el badge de cantidad
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <button
            type="button"
            onClick={openCart}
            aria-label="Abrir Carrito"
            className="relative p-2 text-stone-900 hover:text-brand-green transition-colors cursor-pointer"
        >
            <ShoppingCart className="w-6 h-6" />

            {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-black font-body text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-bone-white shadow-sm animate-in zoom-in-50 duration-200">
                    {totalItems > 99 ? '99+' : totalItems}
                </span>
            )}
        </button>
    );
}