import { createClient } from '@/shared/infrastructure/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardClient, type SheetData, type GastosData, type OrderRow, type LeadRow, type ProductRow } from './DashboardClient';

// ponytail: URL pública del Apps Script del cliente (la misma que usa elprofetacontrolstock/config.js).
// Es un GET sin auth. Si algún día le ponemos auth, mover a .env.
const SHEET_URL = 'https://script.google.com/macros/s/AKfycby7ZfA_-VqqYL0cG-we3cUmP1kaKTY_4D3l5VjfjqIg2jFwbwy8vx1W5r_jsmT9Si-QrA/exec';

async function fetchSheet<T>(accion?: string): Promise<T | null> {
    try {
        const url = `${SHEET_URL}?${accion ? `accion=${accion}&` : ''}v=${Date.now()}`;
        // ponytail: Apps Script tarda ~8s (cold) — 30s de techo; si crece, espejar a Supabase
        const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(30000) });
        if (!res.ok) return null;
        const text = (await res.text()).replace(/^\uFEFF/, '').trim();
        const json = JSON.parse(text);
        return json?.error ? null : (json as T);
    } catch {
        return null;
    }
}

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // 1. Validar la sesión desde el servidor
    const { data: { user }, error } = await supabase.auth.getUser();

    // 2. Si no hay usuario autenticado, redirigir al login
    if (error || !user) {
        redirect('/admin/login');
    }

    // 3. Sheet del cliente (SSOT) + canal web (Supabase), en paralelo
    const [sheet, gastosData, ordersRes, pendingRes, leadsRes, productsRes] = await Promise.all([
        fetchSheet<SheetData>(),
        // ponytail: leerGastos por GET ?accion=leerGastos (acción ya existente en Code.gs).
        // Si el dispatcher no la soporta por GET, devuelve error → tab vacío, sin romper nada.
        fetchSheet<GastosData>('leerGastos'),
        supabase
            .from('orders')
            .select('id, order_number, customer_name, total_amount, status, created_at, order_items(product_title, quantity, unit_price)')
            .order('created_at', { ascending: false })
            .limit(50),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase
            .from('leads')
            .select('id, name, email, phone, event_type, status, created_at')
            .order('created_at', { ascending: false })
            .limit(50),
        supabase
            .from('products')
            .select('id, title, price, stock, is_active')
            .order('title'),
    ]);

    const orders: OrderRow[] = (ordersRes.data || []).map((o) => ({
        id: o.id,
        orderNumber: o.order_number,
        customerName: o.customer_name,
        total: Number(o.total_amount) || 0,
        status: o.status,
        createdAt: o.created_at,
        items: (o.order_items || []).map((i) => ({
            title: i.product_title,
            quantity: i.quantity,
            price: Number(i.unit_price) || 0,
        })),
    }));

    const leads: LeadRow[] = (leadsRes.data || []).map((l) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        eventType: l.event_type,
        status: l.status,
        createdAt: l.created_at,
    }));

    const products: ProductRow[] = (productsRes.data || []).map((p) => ({
        id: p.id,
        title: p.title,
        price: Number(p.price) || 0,
        stock: p.stock ?? 0,
        isActive: p.is_active ?? false,
    }));

    const pendingCount = pendingRes.count ?? 0;

    // 4. Renderizar el cliente
    return (
        <DashboardClient
            userEmail={user.email || 'admin@elprofeta.com'}
            sheet={sheet}
            gastosData={gastosData}
            orders={orders}
            leads={leads}
            products={products}
            pendingCount={pendingCount}
        />
    );
}
