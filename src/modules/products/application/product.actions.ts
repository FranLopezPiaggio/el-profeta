// Products module — Server Actions (read).
// Tenant context comes ONLY from the x-tenant-id header injected by middleware
// (SECURITY.md: never trust tenant_id from client payload).
'use server';

import { headers } from 'next/headers';
import { Result, type DomainError } from '@/shared/domain/result';
import type { Product } from '../domain/product.entity';
import { ProductService } from './product.service';
import { ProductRepository } from '../infrastructure/product.repository';
import { createClient } from '@/shared/infrastructure/supabase/server';

async function makeService() {
  const client = await createClient();
  if (!client) return null;
  return new ProductService(new ProductRepository(client));
}

export async function getCatalogAction(): Promise<Result<Product[], DomainError>> {
  const tenantId = (await headers()).get('x-tenant-id');
  if (!tenantId) {
    return Result.fail({
      code: 'TENANT_NOT_FOUND',
      message: 'No se pudo resolver el tenant de la petición.',
    });
  }

  const service = await makeService();
  if (!service) {
    return Result.fail({ code: 'INTERNAL_SERVER_ERROR', message: 'Supabase no configurado' });
  }

  return service.getCatalog(tenantId);
}

export async function getProductBySlugAction(
  slug: string
): Promise<Result<Product, DomainError>> {
  const tenantId = (await headers()).get('x-tenant-id');
  if (!tenantId) {
    return Result.fail({
      code: 'TENANT_NOT_FOUND',
      message: 'No se pudo resolver el tenant de la petición.',
    });
  }

  const service = await makeService();
  if (!service) {
    return Result.fail({ code: 'INTERNAL_SERVER_ERROR', message: 'Supabase no configurado' });
  }

  return service.getBySlug(tenantId, slug);
}
