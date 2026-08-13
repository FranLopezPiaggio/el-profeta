// Tenant resolution — pure logic, no Next.js imports (unit-testable).
// Strategy:
//   1. Subdomain:  tienda1.cervezaelprofeta.com  -> slug 'tienda1'
//   2. Local path: /tienda1                       -> slug 'tienda1'
// Returns null when no tenant slug can be derived.

export type SlugSource = 'subdomain' | 'path' | 'none';

const SLUG_REGEX = /^[a-z0-9-]{2,63}$/;
// Rutas de nivel superior que NO son tenants (root app / admin / api).
const RESERVED_ROUTES = new Set(['products', 'admin', 'api']);

export interface SlugResolution {
  slug: string | null;
  source: SlugSource;
}

export function resolveSlug(
  hostname: string,
  pathname: string,
  appDomain?: string
): SlugResolution {
  const host = hostname.toLowerCase().replace(/\.$/, '');

  // 1) Subdominio — solo si conocemos el dominio apex.
  if (appDomain) {
    const domain = appDomain.toLowerCase().replace(/^\./, '');
    if (host === domain || host === `www.${domain}`) {
      // Apex / www: caemos a resolución por ruta.
    } else if (host.endsWith(`.${domain}`)) {
      const label = host.slice(0, -(domain.length + 1));
      if (SLUG_REGEX.test(label)) return { slug: label, source: 'subdomain' };
      return { slug: null, source: 'none' };
    }
    // Host desconocido (p.ej. custom domain): degrada a ruta.
  }

  // 2) Ruta local de desarrollo: primer segmento del pathname.
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  if (
    firstSegment &&
    !RESERVED_ROUTES.has(firstSegment) &&
    SLUG_REGEX.test(firstSegment)
  ) {
    return { slug: firstSegment, source: 'path' };
  }

  return { slug: null, source: 'none' };
}
