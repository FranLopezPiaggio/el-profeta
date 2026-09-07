// Orders — Server Actions (tenant via header slug, zod at boundary, Result)
'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/shared/infrastructure/supabase/admin';
import { Result, type DomainError } from '@/shared/domain/result';
import { CreateOrderInputSchema, UpdateOrderStatusInputSchema } from '../domain/order.schema';
import { OrderService, type CreateOrderResponse } from './order.service';
import type { OrderEntity } from '@/shared/domain/db-entities';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function createOrderAction(rawInput: unknown): Promise<Result<CreateOrderResponse, DomainError>> {
  const headerSlug = (await headers()).get('x-tenant-slug');
  const fallbackSlug = (rawInput as Record<string, unknown> | null)?.tenantSlug as string | undefined;
  const tenantSlug = headerSlug || fallbackSlug || 'el-profeta';

  // Clone input and inject resolved tenantSlug
  const inputWithSlug: Record<string, unknown> = { ...(rawInput as Record<string, unknown>), tenantSlug };

  // ponytail: slug->uuid resolution for cart ids that are slugs (e.g. "blonde"), consider storing uuid in cart if DB grows
  const items = (inputWithSlug['items'] as Array<{ productId: string; quantity: number }> | undefined) ?? [];
  const nonUuidSlugs = items.filter((it) => !UUID_RE.test(it.productId)).map((it) => it.productId);

  if (nonUuidSlugs.length > 0) {
    try {
      const { data: tenant } = await supabaseAdmin.from('tenants').select('id').eq('slug', tenantSlug).maybeSingle();
      const tenantId = (tenant as { id: string } | null)?.id;
      if (tenantId) {
        const { data: products } = await supabaseAdmin
          .from('products')
          .select('id, slug')
          .eq('tenant_id', tenantId)
          .in('slug', nonUuidSlugs);
        const slugToId = new Map<string, string>();
        for (const p of (products as Array<{ id: string; slug: string }>) ?? []) slugToId.set(p.slug, p.id);
        for (const it of items) {
          const mapped = slugToId.get(it.productId);
          if (mapped) it.productId = mapped;
        }
      }
    } catch {
      // best-effort: fall through to validation which will surface PRODUCT_NOT_FOUND
    }
  }

  const parsed = CreateOrderInputSchema.safeParse(inputWithSlug);
  if (!parsed.success) {
    return Result.fail({
      code: 'VALIDATION_ERROR',
      message: parsed.error.issues.map((i) => i.message).join('; ') || 'Datos de orden inválidos',
      details: { issues: parsed.error.issues },
    });
  }

  // ponytail: client-generated idempotency UUID, consider server-generated if replay abuse
  const service = new OrderService();
  const result = await service.createOrder(parsed.data);
  if (result.success) revalidatePath('/admin/dashboard');
  return result;
}

export async function updateOrderStatusAction(rawInput: unknown): Promise<Result<OrderEntity, DomainError>> {
  const tenantId = (await headers()).get('x-tenant-id');
  if (!tenantId) {
    return Result.fail({ code: 'TENANT_NOT_FOUND', message: 'No se pudo resolver el tenant de la petición.' });
  }

  const raw = rawInput as Record<string, unknown>;
  const candidate = {
    orderId: raw.orderId ?? raw.id,
    tenantId, // SECURITY.md: never trust client tenantId, use header
    nextStatus: raw.nextStatus ?? raw.status,
  };

  const parsed = UpdateOrderStatusInputSchema.safeParse(candidate);
  if (!parsed.success) {
    return Result.fail({
      code: 'VALIDATION_ERROR',
      message: parsed.error.issues.map((i) => i.message).join('; ') || 'Datos inválidos',
      details: { issues: parsed.error.issues },
    });
  }

  const service = new OrderService();
  const result = await service.updateStatus(parsed.data);
  if (result.success) revalidatePath('/admin/dashboard');
  return result;
}
