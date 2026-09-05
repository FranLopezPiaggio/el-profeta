import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartStore } from '@/types/cart';

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            // Control del Modal / Drawer
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            // Agregar Ítem (incrementa la cantidad si ya existe)
            addItem: (product, quantity = 1) => {
                const currentItems = get().items;
                const existingItemIndex = currentItems.findIndex((item) => item.id === product.id);

                if (existingItemIndex > -1) {
                    const updatedItems = [...currentItems];
                    updatedItems[existingItemIndex].quantity += quantity;
                    set({ items: updatedItems, isOpen: true });
                } else {
                    set({
                        items: [...currentItems, { ...product, quantity }],
                        isOpen: true, // Abre automáticamente el carrito al agregar un producto
                    });
                }
            },

            // Eliminar Ítem
            removeItem: (id: string) => {
                set({
                    items: get().items.filter((item) => item.id !== id),
                });
            },

            // Actualizar Cantidad Directa
            updateQuantity: (id: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }

                set({
                    items: get().items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                });
            },

            // Limpiar Carrito
            clearCart: () => set({ items: [] }),

            // Métodos de Cálculo — ponytail: tier global (1-5 minorista, 6-11 six, 12+ doce); upgrade a price_tiers por producto si Sheet lo agrega
            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce((total, item) => {
                    const q = item.quantity;
                    const unit = q >= 12 ? (item.priceDoce ?? item.price) : q >= 6 ? (item.priceSix ?? item.price) : (item.priceMin ?? item.price);
                    return total + unit * q;
                }, 0);
            },
        }),
        {
            name: 'el-profeta-cart', // Clave en localStorage
            storage: createJSONStorage(() => localStorage),
            // Solo persistimos la lista de ítems, ignoramos el estado visual 'isOpen' al recargar
            partialize: (state) => ({ items: state.items }),
        }
    )
);