import { createClient } from '@supabase/supabase-js';

// ATENCIÓN: Solo importar y ejecutar en Server Actions o API Routes.
// NUNCA importar este archivo en componentes cliente ("use client").
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
);