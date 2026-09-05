export interface CartItem {
    id: string;
    name: string;
    style: string;
    price: number;
    priceMin?: number;
    priceSix?: number;
    priceDoce?: number;
    image: string;
    quantity: number;
    format?: string;
}

export interface CartStore {
    items: CartItem[];
    isOpen: boolean;

    // Acciones de estado
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;

    // Acciones de ítems
    addItem: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;

    // Selectores / Métodos derivados
    getTotalItems: () => number;
    getSubtotal: () => number;
}