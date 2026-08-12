// app/checkout/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Beer, ShieldCheck, Send, Trash2, MapPin, Phone, Mail, User, MessageSquare } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function CheckoutPage() {
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Suscripción al carrito de Zustand
    const { items, getSubtotal, removeItem, clearCart } = useCartStore();

    // Campos del Formulario de Envío
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');

    // Evitar mismatches de hidratación SSR
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const subtotal = getSubtotal();

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        setIsSubmitting(true);

        try {
            // 1. Generar un Order ID único de muestra (Ej: ORD-8492)
            const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

            // 2. Aquí llamarías a tu Server Action o API Route para persistir la orden en tu DB
            // await createOrderInDb({ orderId, fullName, email, phone, address, notes, items, subtotal });
            console.log('Guardando en DB...', { orderId, fullName, email, phone, address, notes, items, subtotal });

            // 3. Construir el mensaje formateado para WhatsApp
            let waMessage = `*¡NUEVO PEDIDO EN EL PROFETA!* 🍺\n`;
            waMessage += `*Orden ID:* #${orderId}\n\n`;
            waMessage += `👤 *Cliente:* ${fullName}\n`;
            waMessage += `📱 *Teléfono:* ${phone}\n`;
            waMessage += `✉️ *Email:* ${email}\n`;
            waMessage += `📍 *Dirección de Entrega:* ${address}\n\n`;

            waMessage += `📦 *DETALLE DEL PEDIDO:*\n`;
            items.forEach((item) => {
                waMessage += `• ${item.quantity}x ${item.name} (${item.format || 'Lata'}) - $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
            });

            waMessage += `\n💰 *Total a abonar:* $${subtotal.toLocaleString('es-AR')}\n`;

            if (notes.trim()) {
                waMessage += `💬 *Notas/Aclaraciones:* ${notes}\n`;
            }

            waMessage += `\n_Aguardamos tu confirmación para coordinar el pago y la entrega._`;

            // 4. Vaciar el carrito
            clearCart();

            // 5. Abrir WhatsApp con el pedido armado
            const whatsappNumber = '5491112345678'; // Reemplazar con el número oficial de la cervecería
            const encodedUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
            window.location.href = encodedUrl;

        } catch (error) {
            console.error('Error procesando la orden:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bone-white font-body text-brand-black flex flex-col">

            {/* HEADER DE CHECKOUT MINIMALISTA */}
            <header className="h-20 bg-white border-b border-brand-green2/10 px-4 sm:px-8 flex items-center justify-between shrink-0">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 font-body text-xs font-bold text-brand-black/60 hover:text-brand-black transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver a la tienda</span>
                </Link>

                <div className="flex items-center gap-2">
                    <div className="w-20 h-20 text-brand-gold flex items-center justify-center mt-10">
                        <Image
                            src="/logo-removebg-preview.png"
                            alt="El Profeta Logo"
                            width={100}
                            height={100}
                            className="-mt-10 z-20"
                        />
                    </div>
                    <span className="font-passion text-xl text-brand-green2">El Profeta</span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-brand-green2/80 bg-brand-green2/5 px-3 py-1.5 rounded-full">
                    <ShieldCheck className="w-4 h-4 text-brand-green2" />
                    <span className="hidden sm:inline">Pedido Directo & Seguro</span>
                </div>
            </header>

            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-10 my-auto">

                {items.length === 0 ? (
                    /* Estado Carrito Vacío */
                    <div className="bg-white rounded-3xl border border-brand-green2/10 p-12 text-center max-w-lg mx-auto space-y-4 my-12 shadow-sm">
                        <div className="w-16 h-16 rounded-full bg-brand-green2/5 flex items-center justify-center mx-auto text-brand-green2/40">
                            <Beer className="w-8 h-8" />
                        </div>
                        <h1 className="font-passion text-3xl text-brand-green2">No hay productos en tu pedido</h1>
                        <p className="text-xs text-brand-black/60">
                            Parece que aún no has seleccionado ninguna cerveza para tu compra.
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-brand-green2 text-brand-bone-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-brand-black transition-colors pt-3"
                        >
                            Ir al Menú de Cervezas
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* LADO IZQUIERDO: RESUMEN DE LA ORDEN (5 Cols) */}
                        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-brand-green2/10 shadow-sm space-y-6">
                            <div>
                                <h2 className="font-passion text-2xl text-brand-green2">Resumen de la Orden</h2>
                                <p className="text-xs text-brand-black/60">Verifica tus productos antes de continuar</p>
                            </div>

                            {/* Lista de Productos */}
                            <div className="divide-y divide-brand-green2/10 max-h-[380px] overflow-y-auto pr-1">
                                {items.map((item) => (
                                    <div key={item.id} className="py-4 first:pt-0 flex gap-4 items-center">
                                        <div className="relative w-14 h-14 rounded-xl bg-brand-bone-white border border-brand-green2/10 overflow-hidden shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                sizes="56px"
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-passion text-base text-brand-green2 leading-tight truncate">
                                                {item.name}
                                            </h3>
                                            <p className="text-[11px] font-bold text-brand-black/50">
                                                {item.quantity} x ${item.price.toLocaleString('es-AR')} {item.format && `(${item.format})`}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-bold text-sm text-brand-green2">
                                                ${(item.price * item.quantity).toLocaleString('es-AR')}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="text-brand-black/30 hover:text-red-600 transition-colors text-[10px] underline cursor-pointer"
                                            >
                                                Quitar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totales */}
                            <div className="border-t border-brand-green2/10 pt-4 space-y-2">
                                <div className="flex justify-between items-center text-xs text-brand-black/60">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-brand-black">${subtotal.toLocaleString('es-AR')}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-brand-black/60">
                                    <span>Envío</span>
                                    <span className="font-bold text-brand-green2">A coordinar por WhatsApp</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-brand-green2/10">
                                    <span className="font-passion text-xl text-brand-green2">Total a Pagar</span>
                                    <span className="font-passion text-2xl text-brand-green2">
                                        ${subtotal.toLocaleString('es-AR')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* LADO DERECHO: FORMULARIO DE ENVÍO Y DATOS (7 Cols) */}
                        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-brand-green2/10 shadow-sm space-y-6">
                            <div>
                                <h2 className="font-passion text-2xl text-brand-green2">Datos para la Entrega</h2>
                                <p className="text-xs text-brand-black/60">Completa tus datos para registrar el pedido</p>
                            </div>

                            <form onSubmit={handleCreateOrder} className="space-y-4">

                                {/* Nombre Completo */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-black/70">
                                        Nombre y Apellido *
                                    </label>
                                    <div className="relative flex items-center">
                                        <User className="w-4 h-4 absolute left-3.5 text-brand-black/30 pointer-events-none" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Ej: Juan Pérez"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full bg-brand-bone-white border border-brand-green2/15 rounded-xl py-2.5 pl-10 pr-3 text-xs text-brand-black placeholder:text-brand-black/30 focus:outline-none focus:border-brand-green2"
                                        />
                                    </div>
                                </div>

                                {/* Grid 2 Columnas: Email & Teléfono */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-black/70">
                                            Correo Electrónico *
                                        </label>
                                        <div className="relative flex items-center">
                                            <Mail className="w-4 h-4 absolute left-3.5 text-brand-black/30 pointer-events-none" />
                                            <input
                                                type="email"
                                                required
                                                placeholder="juan@ejemplo.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-brand-bone-white border border-brand-green2/15 rounded-xl py-2.5 pl-10 pr-3 text-xs text-brand-black placeholder:text-brand-black/30 focus:outline-none focus:border-brand-green2"
                                            />
                                        </div>
                                    </div>

                                    {/* Celular / WhatsApp */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-black/70">
                                            Teléfono / WhatsApp *
                                        </label>
                                        <div className="relative flex items-center">
                                            <Phone className="w-4 h-4 absolute left-3.5 text-brand-black/30 pointer-events-none" />
                                            <input
                                                type="tel"
                                                required
                                                placeholder="11 1234 5678"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full bg-brand-bone-white border border-brand-green2/15 rounded-xl py-2.5 pl-10 pr-3 text-xs text-brand-black placeholder:text-brand-black/30 focus:outline-none focus:border-brand-green2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Dirección de Entrega */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-black/70">
                                        Dirección de Entrega Completa *
                                    </label>
                                    <div className="relative flex items-center">
                                        <MapPin className="w-4 h-4 absolute left-3.5 text-brand-black/30 pointer-events-none" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Calle 123, Piso 4 Dep B, Barrio / Ciudad"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full bg-brand-bone-white border border-brand-green2/15 rounded-xl py-2.5 pl-10 pr-3 text-xs text-brand-black placeholder:text-brand-black/30 focus:outline-none focus:border-brand-green2"
                                        />
                                    </div>
                                </div>

                                {/* Comentarios o Aclaraciones */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-black/70">
                                        Aclaraciones sobre la entrega (Opcional)
                                    </label>
                                    <div className="relative flex items-start">
                                        <MessageSquare className="w-4 h-4 absolute left-3.5 top-3 text-brand-black/30 pointer-events-none" />
                                        <textarea
                                            rows={2}
                                            placeholder="Ej: Timbre no funciona, entregar preferentemente después de las 18hs..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="w-full bg-brand-bone-white border border-brand-green2/15 rounded-xl py-2.5 pl-10 pr-3 text-xs text-brand-black placeholder:text-brand-black/30 focus:outline-none focus:border-brand-green2 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Botón de Enviar Pedido */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full font-body font-bold text-sm bg-brand-green2 text-brand-bone-white py-4 px-6 rounded-xl hover:bg-brand-black transition-colors flex items-center justify-center gap-2 group shadow-sm cursor-pointer disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        <span>{isSubmitting ? 'Procesando Pedido...' : 'Confirmar y Enviar por WhatsApp'}</span>
                                    </button>
                                    <p className="text-[11px] text-center text-brand-black/50 mt-2">
                                        Serás redirigido a WhatsApp con el detalle de tu orden cargado automáticamente.
                                    </p>
                                </div>

                            </form>
                        </div>

                    </div>
                )}

            </main>

        </div>
    );
}