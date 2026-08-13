// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { resolveSlug } from '@/shared/middleware/tenant-resolver';
import { createMiddlewareClient } from '@/shared/infrastructure/supabase/server';

export async function middleware(request: NextRequest) {
  // 1. Resolver el Tenant desde subdominio/ruta
  const { slug, source } = resolveSlug(
    request.nextUrl.hostname,
    request.nextUrl.pathname,
    process.env.NEXT_PUBLIC_APP_DOMAIN
  );

  const supabaseContext = createMiddlewareClient(request);
  if (!supabaseContext) return NextResponse.next();

  const { client: supabase, response } = supabaseContext;

  // 2. Inyectar Headers de Tenant si existe
  let tenantId: string | null = null;
  if (slug) {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (tenant?.id) {
      tenantId = tenant.id;
      response.headers.set('x-tenant-id', tenant.id);
      response.headers.set('x-tenant-slug', slug);
    } else if (source === 'subdomain') {
      return new NextResponse('Tenant not found', { status: 404 });
    }
  }

  // 3. Proteger la zona /admin
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/admin/login';

  if (isAdminRoute) {
    // Validar el JWT de forma segura
    const { data: { user } } = await supabase.auth.getUser();

    // Caso A: Usuario no autenticado intentando acceder a /admin (excepto /admin/login)
    if (!user && !isLoginRoute) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Caso B: Usuario autenticado intentando acceder a /admin/login
    if (user && isLoginRoute) {
      const dashboardUrl = new URL('/admin/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // Caso C: Usuario autenticado en ruta protegida de /admin
    if (user && !isLoginRoute) {
      // Verificar rol 'admin' en la tabla tenant_users
      let query = supabase
        .from('tenant_users')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin');

      // Si hay contexto de tenant, filtramos por él
      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data: tenantUser } = await query.maybeSingle();

      // Si no es admin registrado en tenant_users, denegar acceso
      if (!tenantUser) {
        const homeUrl = new URL('/', request.url);
        return NextResponse.redirect(homeUrl);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};