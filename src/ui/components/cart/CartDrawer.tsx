'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Beer } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);

  // Suscripción al Store de Zustand
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getTotalItems
  } = useCartStore();

  // 1. Evitar mismatch de hidratación SSR/Cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Bloquear el scroll del background mientras esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();

  const handleNavigateToCervezas = () => {
    // 1. Cierra el carrito
    closeCart();

    // 2. Busca la sección y hace scroll hasta ella
    const element = document.getElementById('cervezas');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-hidden">

      {/* Backdrop con Blur y Fade-in */}
      <div
        className="fixed inset-0 bg-brand-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">

        {/* Panel Lateral (Slide-over) */}
        <div className="w-screen max-w-md bg-brand-bone-white border-l border-brand-green2/10 shadow-2xl flex flex-col justify-between z-[101]">

          {/* 1. HEADER DEL DRAWER */}
          <div className="p-6 bg-white border-b border-brand-green2/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 text-brand-gold flex items-center justify-center mt-10">
                <Image
                  src="/profeta-carrito-removebg-preview.png"
                  alt="El Profeta Carrito"
                  width={100}
                  height={100}
                  className="-mt-10 z-20"
                />
              </div>
              <div>
                <h2 className="font-passion text-2xl text-brand-green2 leading-none">
                  Tu Carrito
                </h2>
                <p className="font-body text-xs text-brand-black/60 mt-0.5">
                  {totalItems === 0
                    ? 'Está vacío por ahora'
                    : `${totalItems} ${totalItems === 1 ? 'producto seleccionado' : 'productos seleccionados'}`
                  }
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="w-8 h-8 rounded-full bg-brand-bone-white text-brand-black/50 hover:text-brand-black hover:bg-brand-black/5 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. LISTA DE PRODUCTOS (BODY) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-brand-green2/10">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-brand-green2/5 flex items-center justify-center text-brand-green2/30">
                  <Beer className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-passion text-xl text-brand-green2">¡Aún no sumaste cervezas!</p>
                  <p className="font-body text-xs text-brand-black/60 max-w-xs">
                    Explora nuestra selección artesanal y llena tu refrigerador con sabor real.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleNavigateToCervezas}
                  className="font-body text-xs font-bold text-brand-green2 underline hover:text-brand-black transition-colors pt-2 cursor-pointer"
                >
                  Ir a ver cervezas
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-center">

                  {/* Foto de producto */}
                  <div className="relative w-16 h-16 rounded-xl bg-white border border-brand-green2/10 overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info e Interacción */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-passion text-lg text-brand-green2 leading-tight truncate">
                        {item.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-brand-black/30 hover:text-red-600 transition-colors cursor-pointer p-0.5"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.format && (
                      <p className="font-body text-[11px] font-semibold text-brand-black/50">
                        {item.format}
                      </p>
                    )}

                    <div className="flex justify-between items-center pt-1">
                      {/* Controladores de cantidad */}
                      <div className="flex items-center gap-2 bg-white border border-brand-green2/15 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-brand-black/70 hover:bg-brand-bone-white rounded transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-body text-xs font-bold text-brand-black min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-brand-black/70 hover:bg-brand-bone-white rounded transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Precio total por ítem */}
                      <span className="font-body text-sm font-bold text-brand-green2">
                        ${(item.price * item.quantity).toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* 3. FOOTER Y SUB-TOTAL (Solo si hay ítems) */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-brand-green2/10 space-y-4 shadow-lg">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center font-body text-xs text-brand-black/60">
                  <span>Subtotal acumulado</span>
                  <span className="font-bold text-brand-black">${subtotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-passion text-xl text-brand-green2">Total Estimado</span>
                  <span className="font-passion text-2xl text-brand-green2">
                    ${subtotal.toLocaleString('es-AR')}
                  </span>
                </div>
                <p className="font-body text-[10px] text-brand-black/40">
                  *Los costos de envío y promociones activas se calculan en el siguiente paso.
                </p>
              </div>

              {/* Botón a Checkout */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full font-body font-bold text-sm bg-brand-green2 text-brand-bone-white py-3.5 px-4 rounded-xl hover:bg-brand-black transition-colors flex items-center justify-center gap-2 group shadow-sm"
              >
                <span>Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}

        </div>

      </div>
    </div>,
    document.body
  );
}