'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    ArrowLeft,
    LogOut,
    RefreshCcw,
    Wallet,
    Beer,
    Receipt,
} from 'lucide-react';
import { logoutAction } from '@/app/admin/login/actions';
import { updateOrderStatusAction, deleteOrderAction } from './actions';

// ============================================================
// TIPOS — datos del Sheet (SSOT del cliente) y del canal web
// ============================================================

import type { SheetData } from '@/lib/sheet';

export interface GastosData {
    gastos: { idFila: string; item: string; monto: number; obs: string; fecha: string }[];
}

export interface OrderRow {
    id: string;
    orderNumber: number;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
    items: { title: string; quantity: number; price: number }[];
}

export interface LeadRow {
    id: string;
    name: string;
    email: string;
    phone: string;
    eventType: string;
    status: string;
    createdAt: string;
}

export interface ProductRow {
    id: string;
    title: string;
    price: number;
    stock: number;
    isActive: boolean;
}

export interface CatalogHybridRow {
    estilo: string;
    stock: number;
    priceMinorista: number;
    priceMayorista: number;
    priceSix: number;
    priceDoce: number;
    description: string | null;
    image: string | null;
    isActive: boolean;
}

interface DashboardClientProps {
    userEmail: string;
    sheet: SheetData | null;
    gastosData: GastosData | null;
    orders: OrderRow[];
    leads: LeadRow[];
    products: ProductRow[];
    catalogHybrid: CatalogHybridRow[];
    pendingCount: number;
}

type TabType = 'orders' | 'leads' | 'catalog' | 'stock' | 'clientes' | 'barriles' | 'gastos';

const TABS: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'orders', label: 'Órdenes Web', icon: ShoppingBag },
    { id: 'leads', label: 'Leads & Eventos', icon: Users },
    { id: 'catalog', label: 'Catálogo Web', icon: Package },
    { id: 'stock', label: 'Stock', icon: Boxes },
    { id: 'clientes', label: 'Clientes', icon: Wallet },
    { id: 'barriles', label: 'Barriles', icon: Beer },
    { id: 'gastos', label: 'Gastos', icon: Receipt },
];

const TAB_TITLES: Record<TabType, string> = {
    orders: 'Órdenes del Canal Web',
    leads: 'Consultas y Alquileres',
    catalog: 'Catálogo de Productos',
    stock: 'Stock General y por Usuario',
    clientes: 'Cuenta Corriente de Clientes',
    barriles: 'Barriles Disponibles',
    gastos: 'Gastos del Ciclo',
};

const ORDER_STATUS: Record<string, { label: string; cls: string }> = {
    pending: { label: 'Pendiente', cls: 'bg-brand-gold/20 text-brand-black' },
    completed: { label: 'Completada', cls: 'bg-brand-green2/10 text-brand-green2' },
    cancelled: { label: 'Cancelada', cls: 'bg-red-100 text-red-700' },
    expired: { label: 'Vencida', cls: 'bg-brand-black/10 text-brand-black/60' },
};

const LEAD_STATUS: Record<string, string> = {
    new: 'Nueva',
    contacted: 'Contactada',
    qualified: 'Calificada',
    closed: 'Cerrada',
    cancelled: 'Cancelada',
};

const fmt = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const fmtDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '-';

// ============================================================
// HELPERS DE RENDER
// ============================================================

function DataTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-body">
                <thead>
                    <tr className="border-b border-brand-green2/10 text-xs font-bold uppercase tracking-wider text-brand-black/50">
                        {headers.map((h) => (
                            <th key={h} className="pb-3">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-brand-green2/5">{children}</tbody>
            </table>
        </div>
    );
}

function Empty({ title, sub }: { title: string; sub?: string }) {
    return (
        <div className="py-8 text-center space-y-2">
            <p className="font-bold text-sm text-brand-black">{title}</p>
            {sub && <p className="text-xs text-brand-black/50">{sub}</p>}
        </div>
    );
}

// ============================================================
// DASHBOARD
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ORDER_STATUS_UNUSED = ORDER_STATUS;
export function DashboardClient({ userEmail, sheet, gastosData, orders, leads, products: _products, catalogHybrid, pendingCount }: DashboardClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('stock');
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await logoutAction();
        });
    };

    const handleRefresh = () => {
        startTransition(async () => {
            await fetch('/api/revalidate', { method: 'POST' });
            router.refresh();
        });
    };

    // Métricas reales del Sheet
    const deudaTotal = (sheet?.clientes || []).reduce((a, c) => a + (Number(c.deuda) || 0), 0);
    const clientesCount = sheet?.clientes?.length || 0;
    const gastosTotal = (gastosData?.gastos || []).reduce((a, g) => a + (Number(g.monto) || 0), 0);

    const stockGeneral = sheet?.stockGeneral || {};
    const usuarios = sheet?.usuarios || {};

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
                        {TABS.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${activeTab === id
                                    ? 'bg-brand-green2 text-brand-bone-white'
                                    : 'text-brand-black/70 hover:bg-brand-bone-white hover:text-brand-black'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="w-4 h-4" />
                                    <span>{label}</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === id ? 'inline' : 'hidden'}`} />
                            </button>
                        ))}
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
                            {TAB_TITLES[activeTab]}
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
                    {/* METRICS — reales, del Sheet y del canal web */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="bg-white p-6 rounded-2xl border border-brand-green2/10 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-brand-black/60">
                                <span className="text-xs font-bold uppercase tracking-wider">Ventas del Ciclo</span>
                                <TrendingUp className="w-4 h-4 text-brand-green2" />
                            </div>
                            <p className="font-passion text-3xl text-brand-green2">
                                {sheet ? fmt.format(sheet.totalIngresadoSheet || 0) : '—'}
                            </p>
                            <p className="text-[11px] text-brand-black/50 font-medium">
                                {sheet ? `${fmt.format(sheet.efectivoSheet || 0)} efectivo · ${fmt.format(sheet.transferenciaSheet || 0)} transf.` : 'Sin datos del Sheet'}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-brand-green2/10 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-brand-black/60">
                                <span className="text-xs font-bold uppercase tracking-wider">Para Profeta</span>
                                <Wallet className="w-4 h-4 text-brand-green2" />
                            </div>
                            <p className="font-passion text-3xl text-brand-green2">
                                {sheet ? fmt.format(sheet.paraProfetaSheet || 0) : '—'}
                            </p>
                            <p className="text-[11px] text-brand-black/50 font-medium">Acumulado del ciclo</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-brand-green2/10 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-brand-black/60">
                                <span className="text-xs font-bold uppercase tracking-wider">Deuda Clientes</span>
                                <Users className="w-4 h-4 text-brand-green2" />
                            </div>
                            <p className="font-passion text-3xl text-brand-green2">
                                {sheet ? fmt.format(deudaTotal) : '—'}
                            </p>
                            <p className="text-[11px] text-brand-black/50 font-medium">{clientesCount} clientes en cuenta corriente</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-brand-green2/10 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-brand-black/60">
                                <span className="text-xs font-bold uppercase tracking-wider">Órdenes Web Pendientes</span>
                                <ShoppingBag className="w-4 h-4 text-brand-green2" />
                            </div>
                            <p className="font-passion text-3xl text-brand-green2">{pendingCount}</p>
                            <p className="text-[11px] text-brand-black/50 font-medium">Canal web · cierre de venta en el Sheet</p>
                        </div>
                    </div>

                    {/* VISTAS DINÁMICAS */}
                    <div className="bg-white rounded-3xl border border-brand-green2/10 p-6 lg:p-8 shadow-sm space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-green2/10 pb-6">
                            <div>
                                <h2 className="font-passion text-2xl text-brand-green2">{TAB_TITLES[activeTab]}</h2>
                                <p className="text-xs text-brand-black/60">
                                    {activeTab === 'orders' || activeTab === 'leads'
                                        ? 'Datos del canal web (Supabase)'
                                        : activeTab === 'catalog'
                                            ? 'Catálogo espejo del Sheet (precio/stock deducidos) + Supabase si existe'
                                            : 'Datos en vivo del Sheet del cliente'}
                                </p>
                            </div>

                            <button
                                onClick={handleRefresh}
                                disabled={isPending}
                                className="flex items-center gap-2 border border-brand-green2/15 rounded-xl px-4 py-2 text-xs font-bold text-brand-black hover:bg-brand-bone-white transition-colors cursor-pointer disabled:opacity-50"
                            >
                                <RefreshCcw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} />
                                <span>Sincronizar con Sheet</span>
                            </button>
                        </div>

                        {/* ---------- STOCK (Sheet) ---------- */}
                        {activeTab === 'stock' && (
                            sheet ? (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-black/50 mb-3">Stock General por Estilo</h3>
                                        <DataTable headers={['Estilo', 'Unidades']}>
                                            {Object.entries(stockGeneral).map(([estilo, cant]) => (
                                                <tr key={estilo}>
                                                    <td className="py-3 font-semibold">{estilo}</td>
                                                    <td className={`py-3 font-bold ${Number(cant) <= 0 ? 'text-red-600' : 'text-brand-green2'}`}>{cant}</td>
                                                </tr>
                                            ))}
                                        </DataTable>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-black/50 mb-3">Stock por Usuario</h3>
                                        {/* ponytail: matriz completa usuario × estilo; si se vuelve ancha, paginar por usuario */}
                                        <DataTable headers={['Usuario', ...Object.keys(stockGeneral), 'Total Sin Etiqueta']}>
                                            {Object.entries(usuarios).map(([usuario, s]) => {
                                                const totalSin = Object.values(s.stockSinEtiqueta || {}).reduce((a, b) => a + (Number(b) || 0), 0);
                                                return (
                                                    <tr key={usuario}>
                                                        <td className="py-3 font-semibold">{usuario}</td>
                                                        {Object.keys(stockGeneral).map((estilo) => (
                                                            <td key={estilo} className="py-3 text-center">{Number(s.stock?.[estilo]) || 0}</td>
                                                        ))}
                                                        <td className="py-3 text-center font-bold">{totalSin}</td>
                                                    </tr>
                                                );
                                            })}
                                        </DataTable>
                                    </div>
                                </div>
                            ) : (
                                <Empty
                                    title="No se pudieron leer los datos del Sheet"
                                    sub="Verificá que el Apps Script esté publicado y accesible."
                                />
                            )
                        )}

                        {/* ---------- CLIENTES (Sheet) ---------- */}
                        {activeTab === 'clientes' && (
                            sheet && sheet.clientes?.length ? (
                                <DataTable headers={['Nombre', 'Deuda', 'Pagado']}>
                                    {sheet.clientes.map((c) => (
                                        <tr key={c.nombre}>
                                            <td className="py-3 font-semibold">{c.nombre}</td>
                                            <td className={`py-3 font-bold ${c.deuda > 0 ? 'text-red-600' : 'text-brand-green2'}`}>{fmt.format(c.deuda)}</td>
                                            <td className="py-3">{fmt.format(c.pagado)}</td>
                                        </tr>
                                    ))}
                                </DataTable>
                            ) : (
                                <Empty
                                    title={sheet ? 'Sin clientes en cuenta corriente' : 'No se pudieron leer los datos del Sheet'}
                                />
                            )
                        )}

                        {/* ---------- BARRILES (Sheet) ---------- */}
                        {activeTab === 'barriles' && (
                            sheet && sheet.barrilesDisponibles?.length ? (
                                <DataTable headers={['Tipo', 'Tamaño', 'Serie']}>
                                    {sheet.barrilesDisponibles.map((b) => (
                                        <tr key={b.id}>
                                            <td className="py-3 font-semibold">{b.tipo}</td>
                                            <td className="py-3">{b.tamano}</td>
                                            <td className="py-3">{b.serie}</td>
                                        </tr>
                                    ))}
                                </DataTable>
                            ) : (
                                <Empty
                                    title={sheet ? 'Sin barriles disponibles' : 'No se pudieron leer los datos del Sheet'}
                                />
                            )
                        )}

                        {/* ---------- GASTOS (Sheet) ---------- */}
                        {activeTab === 'gastos' && (
                            gastosData?.gastos?.length ? (
                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-brand-black/60 uppercase tracking-wider">
                                        Total del ciclo: <span className="text-red-600">{fmt.format(gastosTotal)}</span>
                                    </p>
                                    <DataTable headers={['Item', 'Monto', 'Obs', 'Fecha']}>
                                        {gastosData.gastos.map((g) => (
                                            <tr key={g.idFila}>
                                                <td className="py-3 font-semibold">{g.item}</td>
                                                <td className="py-3 font-bold text-red-600">{fmt.format(Number(g.monto) || 0)}</td>
                                                <td className="py-3 text-brand-black/70">{g.obs}</td>
                                                <td className="py-3">{g.fecha}</td>
                                            </tr>
                                        ))}
                                    </DataTable>
                                </div>
                            ) : (
                                <Empty
                                    title={gastosData ? 'Sin gastos registrados' : 'No se pudieron leer los gastos del Sheet'}
                                />
                            )
                        )}

                        {/* ---------- ÓRDENES WEB (Supabase) — SSOT web, único editable: estado ---------- */}
                        {activeTab === 'orders' && (
                            orders.length ? (
                                <DataTable headers={['#', 'Cliente', 'Productos', 'Total', 'Estado', 'Fecha', '']}>
                                    {orders.map((o) => {
                                        return (
                                            <tr key={o.id}>
                                                <td className="py-4 font-bold">#{o.orderNumber}</td>
                                                <td className="py-4">{o.customerName}</td>
                                                <td className="py-4 text-brand-black/70">
                                                    {o.items.map((i) => `${i.quantity}× ${i.title}`).join(', ') || '—'}
                                                </td>
                                                <td className="py-4 font-bold text-brand-green2">{fmt.format(o.total)}</td>
                                                <td className="py-4">
                                                    <select
                                                        defaultValue={o.status}
                                                        disabled={isPending}
                                                        onChange={(e) => {
                                                            const next = e.target.value as 'pending' | 'completed' | 'cancelled' | 'expired';
                                                            startTransition(async () => { await updateOrderStatusAction(o.id, next); router.refresh(); });
                                                        }}
                                                        className="text-[11px] font-bold rounded-md border border-brand-green2/15 px-2 py-1 bg-white"
                                                    >
                                                        <option value="pending">Pendiente</option>
                                                        <option value="completed">Completada</option>
                                                        <option value="cancelled">Cancelada</option>
                                                        <option value="expired">Vencida</option>
                                                    </select>
                                                </td>
                                                <td className="py-4 text-brand-black/60">{fmtDate(o.createdAt)}</td>
                                                <td className="py-4">
                                                    <button
                                                        onClick={() => {
                                                            if (!confirm('¿Borrar orden #' + o.orderNumber + '?')) return;
                                                            startTransition(async () => { await deleteOrderAction(o.id); router.refresh(); });
                                                        }}
                                                        disabled={isPending}
                                                        className="text-[11px] font-bold text-red-600 hover:underline disabled:opacity-50"
                                                    >
                                                        Borrar
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </DataTable>
                            ) : (
                                <Empty title="Sin órdenes web todavía" sub="Las órdenes del canal web aparecerán acá." />
                            )
                        )}

                        {/* ---------- LEADS (Supabase) ---------- */}
                        {activeTab === 'leads' && (
                            leads.length ? (
                                <DataTable headers={['Nombre', 'Contacto', 'Evento', 'Estado', 'Fecha']}>
                                    {leads.map((l) => (
                                        <tr key={l.id}>
                                            <td className="py-4 font-semibold">{l.name}</td>
                                            <td className="py-4 text-brand-black/70">{l.email || l.phone || '—'}</td>
                                            <td className="py-4">{l.eventType || '—'}</td>
                                            <td className="py-4">{LEAD_STATUS[l.status] || l.status}</td>
                                            <td className="py-4 text-brand-black/60">{fmtDate(l.createdAt)}</td>
                                        </tr>
                                    ))}
                                </DataTable>
                            ) : (
                                <Empty title="Sin consultas todavía" sub="Los mensajes del formulario de contacto aparecerán acá." />
                            )
                        )}

                        {/* ---------- CATÁLOGO HÍBRIDO (Sheet SSOT stock+precio, App enriquece) ---------- */}
                        {activeTab === 'catalog' && (
                            // ponytail: 6 estilos fijos del Sheet; sin Supabase cae a placeholder
                            catalogHybrid.length ? (
                                <DataTable headers={['Estilo', 'Stock', 'Minorista', 'Mayorista', 'SixPack', 'DocePack', 'Estado']}>
                                    {catalogHybrid.map((c) => (
                                        <tr key={c.estilo}>
                                            <td className="py-3 font-semibold">{c.estilo}</td>
                                            <td className={`py-3 font-bold ${c.stock <= 0 ? 'text-red-600' : ''}`}>{c.stock}</td>
                                            <td className="py-3">{fmt.format(c.priceMinorista)}</td>
                                            <td className="py-3">{fmt.format(c.priceMayorista)}</td>
                                            <td className="py-3">{fmt.format(c.priceSix)}</td>
                                            <td className="py-3">{fmt.format(c.priceDoce)}</td>
                                            <td className="py-3">
                                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${c.isActive ? 'bg-brand-green2/10 text-brand-green2' : 'bg-brand-black/10 text-brand-black/60'}`}>
                                                    {c.isActive ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </DataTable>
                            ) : (
                                <Empty title={sheet ? 'Sin estilos en stockGeneral' : 'No se pudo leer el Sheet para catálogo'} />
                            )
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
