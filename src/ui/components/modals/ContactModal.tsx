// ui/components/modals/ContactModal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, Beer, PartyPopper, MessageSquare, Send, Calendar, MapPin, Phone, Mail, User } from 'lucide-react';

type ServiceType = 'contacto' | 'evento' | 'barril';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    whatsappNumber?: string;
}

export function ContactModal({ isOpen, onClose, whatsappNumber = '5491112345678' }: ContactModalProps) {
    const [mounted, setMounted] = useState(false);
    const [serviceType, setServiceType] = useState<ServiceType>('barril');

    // Asegura que el componente solo se renderice en el DOM del cliente
    useEffect(() => {
        setMounted(true);
    }, []);

    // Bloquear el scroll del fondo cuando el modal esté abierto
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

    // Campos del formulario
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [beerStyle, setBeerStyle] = useState('IPA');
    const [liters, setLiters] = useState('50L');
    const [message, setMessage] = useState('');

    if (!isOpen || !mounted) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let waText = `*NUEVA CONSULTA - EL PROFETA*\n\n`;
        waText += `📌 *Tipo:* ${serviceType === 'barril' ? 'Alquiler de Barril 🍺' : serviceType === 'evento' ? 'Evento Social/Corp 🎉' : 'Consulta General 💬'
            }\n`;
        waText += `👤 *Nombre:* ${fullName}\n`;
        waText += `📱 *Celular:* ${phone}\n`;
        waText += `✉️ *Email:* ${email}\n`;
        waText += `📍 *Dirección/Zona:* ${address}\n`;

        if (serviceType === 'barril') {
            waText += `🍺 *Estilo deseado:* ${beerStyle}\n`;
            waText += `🛢️ *Capacidad:* ${liters}\n`;
            if (eventDate) waText += `📅 *Fecha del evento:* ${eventDate}\n`;
        } else if (serviceType === 'evento') {
            if (eventDate) waText += `📅 *Fecha estimada:* ${eventDate}\n`;
        }

        if (message.trim()) {
            waText += `\n💬 *Mensaje/Notas:* ${message}\n`;
        }

        const encodedMessage = encodeURIComponent(waText);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
        onClose();
    };

    // Usamos createPortal para "teletransportar" el modal al final de document.body
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop con desenfoque de pantalla completa */}
            <div
                className="fixed inset-0 bg-brand-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Contenedor Modal Centrado */}
            <div className="relative w-full max-w-xl bg-brand-bone-white rounded-3xl border border-brand-green2/15 shadow-2xl overflow-hidden z-[101] my-auto">

                {/* Header */}
                <div className="bg-white px-6 py-5 border-b border-brand-green2/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-20 h-20 text-brand-gold flex items-center justify-center shadow-sm">
                            <Image
                                src="/logo-removebg-preview.png"
                                alt="El Profeta Logo"
                                width={120}
                                height={120}
                                className="-mt-10 z-20"
                            />
                        </div>
                        <div>
                            <h2 className="font-passion text-2xl text-brand-green2 leading-none">
                                Hablá con El Profeta
                            </h2>
                            <p className="font-body text-xs text-brand-black/60 mt-0.5">
                                Alquiler de barriles, eventos y consultas directas
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-brand-bone-white text-brand-black/50 hover:text-brand-black hover:bg-brand-black/5 flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">

                    {/* Selector / Toggle */}
                    <div className="space-y-2">
                        <label className="block font-body text-xs font-bold uppercase tracking-wider text-brand-black/70">
                            ¿Qué estás buscando?
                        </label>
                        <div className="grid grid-cols-3 gap-2 bg-white p-1.5 rounded-2xl border border-brand-green2/10">

                            <button
                                type="button"
                                onClick={() => setServiceType('barril')}
                                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-body text-xs font-bold transition-all cursor-pointer ${serviceType === 'barril'
                                    ? 'bg-brand-green2 text-brand-bone-white shadow-sm'
                                    : 'text-brand-black/70 hover:bg-brand-bone-white'
                                    }`}
                            >
                                <Beer className="w-4 h-4" />
                                <span>Barril</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setServiceType('evento')}
                                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-body text-xs font-bold transition-all cursor-pointer ${serviceType === 'evento'
                                    ? 'bg-brand-green2 text-brand-bone-white shadow-sm'
                                    : 'text-brand-black/70 hover:bg-brand-bone-white'
                                    }`}
                            >
                                <PartyPopper className="w-4 h-4" />
                                <span>Evento</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setServiceType('contacto')}
                                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-body text-xs font-bold transition-all cursor-pointer ${serviceType === 'contacto'
                                    ? 'bg-brand-green2 text-brand-bone-white shadow-sm'
                                    : 'text-brand-black/70 hover:bg-brand-bone-white'
                                    }`}
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span>Contacto</span>
                            </button>

                        </div>
                    </div>

                    {/* Datos Personales */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block font-body text-xs font-bold text-brand-black/70">Nombre y Apellido *</label>
                            <div className="relative flex items-center">
                                <User className="w-4 h-4 absolute left-3.5 text-brand-black/30 pointer-events-none" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Juan Pérez"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full font-body bg-white border border-brand-green2/15 rounded-xl py-2.5 pl-10 pr-3 text-xs text-brand-black placeholder:text-brand-black/30 focus:outline-none focus:border-brand-green2"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block font-body text-xs font-bold text-brand-black/70">Celular (WhatsApp) *</label>
                            <div className="relative flex items-center">
                                <Phone className="w-4 h-4 absolute left-3.5 text-brand-black/30 pointer-events-none" />
                                <input
                                    type="tel"
                                    required
                                    placeholder="11 1234 5678"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full font-body bg-white border border-brand-green2/15 rounded-xl py-2.5 pl-10 pr-3 text-xs text-brand-black placeholder:text-brand-black/30 focus:outline-none focus:border-brand-green2"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block font-body text-xs font-bold text-brand-black/70">Correo Electrónico *</label>
                            <div className="relative flex items-center">
                                <Mail className="w-4 h-4 absolute left-3.5 text-brand-black/30 pointer-events-none" />
                                <input
                                    type="email"
                                    required
                                    placeholder="juan@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full font-body bg-white border border-brand-green2/15 rounded-xl py-2.5 pl-10 pr-3 text-xs text-brand-black placeholder:text-brand-black/30 focus:outline-none focus:border-brand-green2"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block font-body text-xs font-bold text-brand-black/70">Dirección o Zona *</label>
                            <div className="relative flex items-center">
                                <MapPin className="w-4 h-4 absolute left-3.5 text-brand-black/30 pointer-events-none" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Av. Corrientes 1234, CABA"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full font-body bg-white border border-brand-green2/15 rounded-xl py-2.5 pl-10 pr-3 text-xs text-brand-black placeholder:text-brand-black/30 focus:outline-none focus:border-brand-green2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Opciones Barril / Evento */}
                    {(serviceType === 'barril' || serviceType === 'evento') && (
                        <div className="p-4 bg-white rounded-2xl border border-brand-green2/10 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block font-body text-xs font-bold text-brand-black/70">Fecha Estimada</label>
                                    <div className="relative flex items-center">
                                        <Calendar className="w-4 h-4 absolute left-3.5 text-brand-black/30 pointer-events-none" />
                                        <input
                                            type="date"
                                            value={eventDate}
                                            onChange={(e) => setEventDate(e.target.value)}
                                            className="w-full font-body bg-brand-bone-white border border-brand-green2/15 rounded-xl py-2 pl-10 pr-3 text-xs text-brand-black focus:outline-none focus:border-brand-green2"
                                        />
                                    </div>
                                </div>

                                {serviceType === 'barril' && (
                                    <>
                                        <div className="space-y-1.5">
                                            <label className="block font-body text-xs font-bold text-brand-black/70">Estilo Cerveza</label>
                                            <select
                                                value={beerStyle}
                                                onChange={(e) => setBeerStyle(e.target.value)}
                                                className="w-full font-body bg-brand-bone-white border border-brand-green2/15 rounded-xl py-2 px-3 text-xs text-brand-black focus:outline-none focus:border-brand-green2"
                                            >
                                                <option value="IPA">IPA (Lupulada)</option>
                                                <option value="Blonde">Blonde Ale (Suave/Dorada)</option>
                                                <option value="Stout">Stout (Tostada/Negra)</option>
                                                <option value="A Asesorar">Necesito Asesoramiento</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5 sm:col-span-2">
                                            <label className="block font-body text-xs font-bold text-brand-black/70">Capacidad del Barril</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['20L', '30L', '50L'].map((size) => (
                                                    <button
                                                        key={size}
                                                        type="button"
                                                        onClick={() => setLiters(size)}
                                                        className={`py-1.5 border rounded-lg text-xs font-bold transition-colors cursor-pointer ${liters === size
                                                            ? 'bg-brand-green2 text-brand-bone-white border-brand-green2'
                                                            : 'bg-brand-bone-white text-brand-black border-brand-green2/15'
                                                            }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Mensaje */}
                    <div className="space-y-1.5">
                        <label className="block font-body text-xs font-bold text-brand-black/70">
                            Detalles adicionales / Mensaje
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Escribe aquí cualquier consulta o detalle particular..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full font-body bg-white border border-brand-green2/15 rounded-xl p-3 text-xs text-brand-black placeholder:text-brand-black/30 focus:outline-none focus:border-brand-green2 resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full font-body font-bold text-sm bg-brand-green2 text-brand-bone-white py-3.5 px-4 rounded-xl hover:bg-brand-black transition-colors flex items-center justify-center gap-2 group shadow-sm cursor-pointer"
                    >
                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        <span>Enviar Consulta por WhatsApp</span>
                    </button>

                </form>

            </div>
        </div>,
        document.body
    );
}