// Leads — Server Actions (tenant via header slug, zod at boundary, Result)
'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { Result, type DomainError } from '@/shared/domain/result';
import type { LeadEntity } from '@/shared/domain/db-entities';
import { CreateLeadInputSchema } from '../domain/lead.schema';
import { LeadService } from './lead.service';

export async function createLeadAction(rawInput: unknown): Promise<Result<LeadEntity, DomainError>> {
  const headerSlug = (await headers()).get('x-tenant-slug');
  const fallbackSlug = (rawInput as Record<string, unknown> | null)?.tenantSlug as string | undefined;
  const tenantSlug = headerSlug || fallbackSlug || 'el-profeta';

  const inputWithSlug = { ...(rawInput as Record<string, unknown>), tenantSlug };

  const parsed = CreateLeadInputSchema.safeParse(inputWithSlug);
  if (!parsed.success) {
    return Result.fail({
      code: 'VALIDATION_ERROR',
      message: parsed.error.issues.map((i) => i.message).join('; ') || 'Datos de lead inválidos',
      details: { issues: parsed.error.issues },
    });
  }

  const service = new LeadService();
  const result = await service.createLead(parsed.data);
  if (result.success) revalidatePath('/admin/dashboard');
  return result;
}
