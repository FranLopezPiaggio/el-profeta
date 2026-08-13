'use client';

import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { loginAction } from '@/app/admin/login/actions';

export default function AdminLoginPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await loginAction(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-brand-bone-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
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
                    <h1 className="font-passion text-4xl sm:text-5xl font-bold text-green-600 tracking-wide">
                        Panel de Control
                    </h1>
                    <p className="font-body text-sm sm:text-base text-gray-700">
                        Acceso exclusivo para la administración de El Profeta
                    </p>
                </div>

                {/* Formulario */}
                <div className="bg-white p-8 sm:p-10 rounded-3xl border border-green-200/10 shadow-sm">
                    {/* Alerta de Error */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-body font-bold text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Campo Email */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block font-body text-xs uppercase tracking-wider font-bold text-gray-800"
                            >
                                Correo Electrónico
                            </label>
                            <div className="relative flex items-center">
                                <Mail className="w-5 h-5 absolute left-3.5 text-gray-400 pointer-events-none" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@elprofeta.com"
                                    className="w-full font-body bg-gray-50 border border-green-200/15 rounded-xl py-3 pl-11 pr-4 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Campo Password */}
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="block font-body text-xs uppercase tracking-wider font-bold text-gray-800"
                            >
                                Contraseña
                            </label>
                            <div className="relative flex items-center">
                                <Lock className="w-5 h-5 absolute left-3.5 text-gray-400 pointer-events-none" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full font-body bg-gray-50 border border-green-200/15 rounded-xl py-3 pl-11 pr-4 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Botón Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full font-body font-bold text-sm bg-green-600 text-gray-50 py-3.5 px-4 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 group shadow-sm cursor-pointer disabled:opacity-50"
                        >
                            <span>{loading ? 'Verificando...' : 'Ingresar al Sistema'}</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </form>
                </div>

                <div className="text-center">
                    <p className="font-body text-xs text-gray-400">
                        El Profeta Cervecería Artesanal &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
}