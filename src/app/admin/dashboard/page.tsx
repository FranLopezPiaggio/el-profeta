import { createClient } from '@/shared/infrastructure/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardClient, type GastosData, type OrderRow, type LeadRow, type ProductRow } from './DashboardClient';
import { getSheetCached, type SheetData } from '@/lib/sheet';

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
        getSheetCached<SheetData>(),
        // ponytail: leerGastos por GET ?accion=leerGastos (acción ya existente en Code.gs).
        // Si el dispatcher no la soporta por GET, devuelve error → tab vacío, sin romper nada.
        getSheetCached<GastosData>('leerGastos'),
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

    // ponytail: catálogo híbrido — deducido del Sheet (SSOT stock+precio), enriquecido con Supabase si existe
    // Sin migración: si products no tiene fila para el estilo, cae a placeholder (descripción/abv/imagen)
    const cfg = (sheet?.configuracion || {}) as Record<string, number>;
    const catalogHybrid = Object.entries(sheet?.stockGeneral || {}).map(([estilo, stock]) => {
        const isLup = estilo.includes('IPA');
        const prod = products.find((p) => p.title.toLowerCase() === estilo.toLowerCase());
        return {
            estilo,
            stock: Number(stock) || 0,
            priceMinorista: Number(cfg.precioMinorista) || 3500,
            priceMayorista: Number(isLup ? cfg.precioMayoristaLupulada : cfg.precioMayoristaNormal) || 2400,
            priceSix: Number(cfg.precioSixPack) || 3250,
            priceDoce: Number(cfg.precioDocePack) || 3000,
            // enrichment (nullable)
            description: null as string | null,
            image: null as string | null,
            isActive: prod ? prod.isActive : true,
        };
    });

    // 4. Renderizar el cliente
    return (
        <DashboardClient
            userEmail={user.email || 'admin@elprofeta.com'}
            sheet={sheet}
            gastosData={gastosData}
            orders={orders}
            leads={leads}
            products={products}
            catalogHybrid={catalogHybrid}
            pendingCount={pendingCount}
        />
    );
}
