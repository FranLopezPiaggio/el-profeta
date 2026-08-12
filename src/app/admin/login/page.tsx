'use client';

import React, { useState } from 'react';
import { Lock, Mail, Beer, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí irá la lógica de autenticación (ej: Supabase, NextAuth, etc.)
        console.log('Logging in:', { email, password });
    };

    return (
        <div className="min-h-screen w-full bg-brand-bone-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">

            {/* Contenedor Principal */}
            <div className="w-full max-w-md space-y-8">
                {/* Botón Volver a Home */}
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 font-body text-xs font-bold text-brand-black/60 hover:text-brand-black transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Volver a la tienda</span>
                    </Link>
                </div>

                {/* Header / Identidad */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-20 h-20 text-brand-bone-white shadow-sm mb-2">
                        <Image
                            src="/logo-removebg-preview.png"
                            alt="El Profeta Logo"
                            width={120}
                            height={120}
                            className="-mt-10 z-20"
                        />
                    </div>
                    <h1 className="font-passion text-4xl sm:text-5xl font-bold text-brand-green2 tracking-wide">
                        Panel de Control
                    </h1>
                    <p className="font-body text-sm sm:text-base text-brand-black/70">
                        Acceso exclusivo para la administración de El Profeta
                    </p>
                </div>

                {/* Formulario */}
                <div className="bg-white p-8 sm:p-10 rounded-3xl border border-brand-green2/10 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Campo Email */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block font-body text-xs uppercase tracking-wider font-bold text-brand-black/80"
                            >
                                Correo Electrónico
                            </label>
                            <div className="relative flex items-center">
                                <Mail className="w-5 h-5 absolute left-3.5 text-brand-black/40 pointer-events-none" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@elprofeta.com"
                                    className="w-full font-body bg-brand-bone-white/50 border border-brand-green2/15 rounded-xl py-3 pl-11 pr-4 text-brand-black text-sm placeholder:text-brand-black/30 focus:outline-none focus:border-brand-green2 focus:ring-1 focus:ring-brand-green2 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Campo Password */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label
                                    htmlFor="password"
                                    className="block font-body text-xs uppercase tracking-wider font-bold text-brand-black/80"
                                >
                                    Contraseña
                                </label>
                            </div>
                            <div className="relative flex items-center">
                                <Lock className="w-5 h-5 absolute left-3.5 text-brand-black/40 pointer-events-none" />
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full font-body bg-brand-bone-white/50 border border-brand-green2/15 rounded-xl py-3 pl-11 pr-4 text-brand-black text-sm placeholder:text-brand-black/30 focus:outline-none focus:border-brand-green2 focus:ring-1 focus:ring-brand-green2 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Botón Submit */}
                        <button
                            type="submit"
                            className="w-full font-body font-bold text-sm bg-brand-green2 text-brand-bone-white py-3.5 px-4 rounded-xl hover:bg-brand-black transition-colors flex items-center justify-center gap-2 group shadow-sm cursor-pointer"
                        >
                            <span>Ingresar al Sistema</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </form>
                </div>

                {/* Footer simple */}
                <div className="text-center">
                    <p className="font-body text-xs text-brand-black/40">
                        El Profeta Cervecería Artesanal &copy; {new Date().getFullYear()}
                    </p>
                </div>

            </div>
        </div>
    );
}