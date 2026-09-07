'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/shared/infrastructure/supabase/server';
import { supabaseAdmin } from '@/shared/infrastructure/supabase/admin';
import { getSheetCached, type SheetData } from '@/lib/sheet';
// ponytail: sync via server action reading Sheet, move to Edge Function + pg_cron when sync needs to run unattended

// Actualizar Estado de Órden
export async function updateOrderStatusAction(orderId: string, status: 'pending' | 'completed' | 'cancelled' | 'expired') {
    const supabase = await createClient();

    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/dashboard');
}

// Actualizar Stock de Producto
export async function updateProductStockAction(productId: string, stock: number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('products')
        .update({ stock })
        .eq('id', productId);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/dashboard');
}

// Actualizar Estado de Lead
export async function updateLeadStatusAction(leadId: string, status: 'new' | 'contacted' | 'qualified' | 'closed' | 'cancelled') {
    const supabase = await createClient();

    const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/dashboard');
}

export async function deleteOrderAction(orderId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    if (error) throw new Error(error.message);
    revalidatePath('/admin/dashboard');
}

export async function syncStockFromSheetAction(): Promise<{ success: boolean; updated: number; failed: number; message: string }> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, updated: 0, failed: 0, message: 'No autorizado' };
    }

    // Tenant resolution: header first, fallback to slug lookup
    let tenantId: string | null = null;
    try {
        const hdrs = await headers();
        const headerTenantId = hdrs.get('x-tenant-id');
        if (headerTenantId) tenantId = headerTenantId;
    } catch {
        // headers() may throw outside request context — fallback to query
    }
    if (!tenantId) {
        const { data: tenant } = await supabaseAdmin.from('tenants').select('id').eq('slug', 'el-profeta').maybeSingle();
        tenantId = (tenant as { id: string } | null)?.id ?? null;
    }
    if (!tenantId) {
        return { success: false, updated: 0, failed: 0, message: 'Tenant no encontrado' };
    }

    const sheet = (await (getSheetCached as unknown as (a?: string) => Promise<SheetData | null>)()) as SheetData | null;
    if (!sheet?.stockGeneral) {
        return { success: false, updated: 0, failed: 0, message: 'No se pudo leer el Sheet' };
    }

    const cfg = (sheet.configuracion || {}) as Record<string, number>;
    const priceMin = Number(cfg.precioMinorista) || 3500;
    const priceMay = Number(cfg.precioMayoristaNormal) || 2500;
    const priceSix = Number(cfg.precioSixPack) || 3250;
    const priceDoce = Number(cfg.precioDocePack) || 3000;

    let updated = 0;
    let failed = 0;

    for (const [estilo, stock] of Object.entries(sheet.stockGeneral)) {
        if (estilo === 'LATAS SIN ETIQUETA') continue;
        const slug = estilo.toLowerCase().replace(/\s+/g, '-');
        const cantidad = Number(stock) || 0;
        const { error } = await supabaseAdmin
            .from('products')
            .update({
                stock: cantidad,
                price: priceMin,
                price_min: priceMin,
                price_may: priceMay,
                price_six: priceSix,
                price_doce: priceDoce,
            })
            .eq('tenant_id', tenantId)
            .eq('slug', slug);
        if (error) failed++;
        else updated++;
    }

    revalidatePath('/admin/dashboard');
    const message = failed === 0 ? `Sincronizados ${updated} productos` : `Sincronizados ${updated}, fallaron ${failed}`;
    return { success: failed === 0, updated, failed, message };
}