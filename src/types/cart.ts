export interface CartItem {
    id: string;
    name: string;
    style: string; // Ej: "IPA", "Blonde", "Stout"
    price: number;
    image: string;
    quantity: number;
    format?: string; // Ej: "Lata 473ml", "Botella 500ml", "Pack x6"
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