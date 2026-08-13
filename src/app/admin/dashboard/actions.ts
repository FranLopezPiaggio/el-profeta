'use server';

import { createClient } from '@/shared/infrastructure/supabase/server';
import { revalidatePath } from 'next/cache';

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