import { createClient } from '@/shared/infrastructure/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardClient } from './DashboardClient';

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // 1. Validar la sesión desde el servidor
    const { data: { user }, error } = await supabase.auth.getUser();

    // 2. Si no hay usuario autenticado, redirigir al login
    if (error || !user) {
        redirect('/admin/login');
    }

    // 3. Renderizar el cliente pasando la información del usuario
    return <DashboardClient userEmail={user.email || 'admin@elprofeta.com'} />;
}