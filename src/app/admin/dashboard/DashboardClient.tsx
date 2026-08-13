'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useTransition } from 'react';
import {
    ShoppingBag,
    Users,
    Package,
    Boxes,
    TrendingUp,
    Search,
    Bell,
    ChevronRight,
    Filter,
    ArrowLeft,
    LogOut
} from 'lucide-react';
import { logoutAction } from '@/app/admin/login/actions';

type TabType = 'orders' | 'leads' | 'catalog' | 'stock';

interface DashboardClientProps {
    userEmail: string;
}

export function DashboardClient({ userEmail }: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState<TabType>('orders');
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await logoutAction();
        });
    };

    return (
        <div className="min-h-screen w-full bg-brand-bone-white flex font-body text-brand-black">

            {/* 1. SIDEBAR NAVIGATION */}
            <aside className="w-64 bg-white border-r border-brand-green2/10 flex flex-col justify-between hidden md:flex shrink-0">
                <div className="p-6 space-y-8">

                    {/* Logo / Identidad */}
                    <div className="flex items-center gap-3">
                        <div className="w-20 h-20 flex items-center justify-center text-brand-gold">
                            <Image
                                src="/logo-removebg-preview.png"
                                alt="El Profeta Logo"
                                width={120}
                                height={120}
                                className="-mt-20 z-20"
                            />
                        </div>
                        <div>
                            <h2 className="font-passion text-2xl font-bold text-brand-green2 leading-none">
                                El Profeta
                            </h2>
                            <p className="text-[11px] font-bold tracking-wider text-brand-black/40 uppercase mt-0.5">
                                Admin Panel
                            </p>
                        </div>
                    </div>

                    {/* Menú NAVEGACIÓN */}
                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${activeTab === 'orders'
                                ? 'bg-brand-green2 text-brand-bone-white'
                                : 'text-brand-black/70 hover:bg-brand-bone-white hover:text-brand-black'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-4 h-4" />
                                <span>Órdenes</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === 'orders' ? 'inline' : 'hidden'}`} />
                        </button>

                        <button
                            onClick={() => setActiveTab('leads')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${activeTab === 'leads'
                                ? 'bg-brand-green2 text-brand-bone-white'
                                : 'text-brand-black/70 hover:bg-brand-bone-white hover:text-brand-black'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Users className="w-4 h-4" />
                                <span>Leads & Eventos</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === 'leads' ? 'inline' : 'hidden'}`} />
                        </button>

                        <button
                            onClick={() => setActiveTab('catalog')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${activeTab === 'catalog'
                                ? 'bg-brand-green2 text-brand-bone-white'
                                : 'text-brand-black/70 hover:bg-brand-bone-white hover:text-brand-black'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Package className="w-4 h-4" />
                                <span>Catálogo</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === 'catalog' ? 'inline' : 'hidden'}`} />
                        </button>

                        <button
                            onClick={() => setActiveTab('stock')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${activeTab === 'stock'
                                ? 'bg-brand-green2 text-brand-bone-white'
                                : 'text-brand-black/70 hover:bg-brand-bone-white hover:text-brand-black'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Boxes className="w-4 h-4" />
                                <span>Stock / Barriles</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === 'stock' ? 'inline' : 'hidden'}`} />
                        </button>
                    </nav>
                </div>

                {/* User Footer & Logout Button */}
                <div className="p-4 m-4 rounded-2xl bg-brand-bone-white/60 border border-brand-green2/10 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-brand-green2/10 text-brand-green2 flex items-center justify-center font-bold text-xs shrink-0">
                            AD
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-brand-black truncate">Admin Profeta</p>
                            <p className="text-[10px] text-brand-black/50 truncate">{userEmail}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={isPending}
                        title="Cerrar sesión"
                        className="text-brand-black/40 hover:text-brand-black transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <LogOut className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </aside>

            {/* 2. MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <div className="p-4 bg-white border-b border-brand-green2/10 md:hidden">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 font-body text-xs font-bold text-brand-black/60 hover:text-brand-black transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Volver a la tienda</span>
                    </Link>
                </div>

                {/* TOP BAR */}
                <header className="h-20 bg-white border-b border-brand-green2/10 px-6 lg:px-10 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <h1 className="font-passion text-3xl text-brand-green2 tracking-wide">
                            {activeTab === 'orders' && 'Gestión de Órdenes'}
                            {activeTab === 'leads' && 'Consultas y Alquileres'}
                            {activeTab === 'catalog' && 'Catálogo de Productos'}
                            {activeTab === 'stock' && 'Control de Stock y Barriles'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-black/30" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="bg-brand-bone-white border border-brand-green2/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-brand-green2"
                            />
                        </div>

                        <button className="w-10 h-10 rounded-xl bg-brand-bone-white border border-brand-green2/10 flex items-center justify-center text-brand-black/70 hover:text-brand-black transition-colors relative cursor-pointer">
                            <Bell className="w-4 h-4" />
                            <span className="w-2 h-2 rounded-full bg-brand-gold absolute top-2.5 right-2.5"></span>
                        </button>
                    </div>
                </header>

                {/* CONTAINER */}
                <div className="p-6 lg:p-10 space-y-8 max-w-7xl w-full mx-auto">
                    {/* METRICS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="bg-white p-6 rounded-2xl border border-brand-green2/10 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-brand-black/60">
                                <span className="text-xs font-bold uppercase tracking-wider">Ventas del Mes</span>
                                <TrendingUp className="w-4 h-4 text-brand-green2" />
                            </div>
                            <p className="font-passion text-3xl text-brand-green2">$1.240.000</p>
                            <p className="text-[11px] text-brand-black/50 font-medium">+12% respecto al mes anterior</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-brand-green2/10 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-brand-black/60">
                                <span className="text-xs font-bold uppercase tracking-wider">Órdenes Activas</span>
                                <ShoppingBag className="w-4 h-4 text-brand-green2" />
                            </div>
                            <p className="font-passion text-3xl text-brand-green2">18</p>
                            <p className="text-[11px] text-brand-black/50 font-medium">5 pendientes de despacho</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-brand-green2/10 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-brand-black/60">
                                <span className="text-xs font-bold uppercase tracking-wider">Solicitudes Eventos</span>
                                <Users className="w-4 h-4 text-brand-green2" />
                            </div>
                            <p className="font-passion text-3xl text-brand-green2">7</p>
                            <p className="text-[11px] text-brand-black/50 font-medium">3 alquileres de barril nuevos</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-brand-green2/10 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-brand-black/60">
                                <span className="text-xs font-bold uppercase tracking-wider">Barriles Disponibles</span>
                                <Boxes className="w-4 h-4 text-brand-green2" />
                            </div>
                            <p className="font-passion text-3xl text-brand-green2">42 / 50</p>
                            <p className="text-[11px] text-brand-black/50 font-medium">Stock saludable de IPA y Blonde</p>
                        </div>
                    </div>

                    {/* VISTAS DINÁMICAS */}
                    <div className="bg-white rounded-3xl border border-brand-green2/10 p-6 lg:p-8 shadow-sm space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-green2/10 pb-6">
                            <div>
                                <h2 className="font-passion text-2xl text-brand-green2">
                                    {activeTab === 'orders' && 'Registro Reciente de Pedidos'}
                                    {activeTab === 'leads' && 'Leads y Alquiler de Barriles'}
                                    {activeTab === 'catalog' && 'Estilos y Presentaciones'}
                                    {activeTab === 'stock' && 'Inventario de Planta'}
                                </h2>
                                <p className="text-xs text-brand-black/60">Visualiza y gestiona la información en tiempo real</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 border border-brand-green2/15 rounded-xl px-4 py-2 text-xs font-bold text-brand-black hover:bg-brand-bone-white transition-colors cursor-pointer">
                                    <Filter className="w-3.5 h-3.5" />
                                    <span>Filtrar</span>
                                </button>
                                <button className="bg-brand-green2 text-brand-bone-white rounded-xl px-4 py-2 text-xs font-bold hover:bg-brand-black transition-colors cursor-pointer">
                                    + Nuevo Registro
                                </button>
                            </div>
                        </div>

                        {activeTab === 'orders' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm font-body">
                                    <thead>
                                        <tr className="border-b border-brand-green2/10 text-xs font-bold uppercase tracking-wider text-brand-black/50">
                                            <th className="pb-3">ID Órden</th>
                                            <th className="pb-3">Cliente</th>
                                            <th className="pb-3">Productos</th>
                                            <th className="pb-3">Total</th>
                                            <th className="pb-3">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-green2/5">
                                        <tr>
                                            <td className="py-4 font-bold text-brand-black">#ORD-9082</td>
                                            <td className="py-4">Martín Gómez</td>
                                            <td className="py-4 text-brand-black/70">Pack 6x Blonde Ale</td>
                                            <td className="py-4 font-bold text-brand-green2">$18.500</td>
                                            <td className="py-4">
                                                <span className="bg-brand-green2/10 text-brand-green2 text-[10px] font-bold px-2.5 py-1 rounded-md">
                                                    Completado
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-4 font-bold text-brand-black">#ORD-9083</td>
                                            <td className="py-4">Laura Rossi</td>
                                            <td className="py-4 text-brand-black/70">1x Barril 50L Stout</td>
                                            <td className="py-4 font-bold text-brand-green2">$95.000</td>
                                            <td className="py-4">
                                                <span className="bg-brand-gold/20 text-brand-black text-[10px] font-bold px-2.5 py-1 rounded-md">
                                                    Pendiente Despacho
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'leads' && (
                            <div className="py-8 text-center space-y-2">
                                <Users className="w-10 h-10 mx-auto text-brand-green2/30" />
                                <p className="font-bold text-sm text-brand-black">Vista de Consultas de Eventos y Alquileres</p>
                                <p className="text-xs text-brand-black/50">Aquí aparecerán los mensajes enviados desde el modal de contacto.</p>
                            </div>
                        )}

                        {activeTab === 'catalog' && (
                            <div className="py-8 text-center space-y-2">
                                <Package className="w-10 h-10 mx-auto text-brand-green2/30" />
                                <p className="font-bold text-sm text-brand-black">Catálogo de Cervezas y Formatos</p>
                                <p className="text-xs text-brand-black/50">Administra precios, descripciones y fotos del menú.</p>
                            </div>
                        )}

                        {activeTab === 'stock' && (
                            <div className="py-8 text-center space-y-2">
                                <Boxes className="w-10 h-10 mx-auto text-brand-green2/30" />
                                <p className="font-bold text-sm text-brand-black">Control de Stock y Barriles</p>
                                <p className="text-xs text-brand-black/50">Gestión de litros disponibles por lote y retorno de barriles.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}