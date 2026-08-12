// src/ui/components/cart/AddToCartTrigger.tsx
'use client';

import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import { CartItem } from '@/types/cart';

interface AddToCartTriggerProps {
    product: Omit<CartItem, 'quantity'>;
    quantity?: number;
    children: React.ReactNode;
    className?: string;
}

export function AddToCartTrigger({
    product,
    quantity = 1,
    children,
    className = ''
}: AddToCartTriggerProps) {
    const addItem = useCartStore((state) => state.addItem);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, quantity);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`cursor-pointer ${className}`}
        >
            {children}
        </button>
    );
}