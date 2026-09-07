// Leads — Service Layer (tenant via slug, Result<T,DomainError>, no trust client tenant_id).
import { supabaseAdmin } from '@/shared/infrastructure/supabase/admin';
import { Result, type DomainError } from '@/shared/domain/result';
import type { LeadEntity } from '@/shared/domain/db-entities';
import type { CreateLeadInput } from '../domain/lead.schema';
import { LeadRepository } from '../infrastructure/lead.repository';

export class LeadService {
  private repo = new LeadRepository();

  private async resolveTenantId(slug: string): Promise<Result<string, DomainError>> {
    const { data, error } = await supabaseAdmin.from('tenants').select('id').eq('slug', slug).maybeSingle();
    if (error || !data) {
      return Result.fail({ code: 'TENANT_NOT_FOUND', message: `Tenant no encontrado: ${slug}` });
    }
    return Result.ok((data as { id: string }).id);
  }

  async createLead(input: CreateLeadInput): Promise<Result<LeadEntity, DomainError>> {
    const tenantRes = await this.resolveTenantId(input.tenantSlug);
    if (!tenantRes.success) return Result.fail(tenantRes.error);
    const tenantId = tenantRes.data;

    // email nullable per requirement — '' => null
    const email = input.email && input.email.trim() !== '' ? input.email.trim() : null;
    const phone = input.phone?.trim() ? input.phone.trim() : null;

    // ponytail: no extra validation here, zod already at action boundary
    return this.repo.createLead(tenantId, {
      name: input.name.trim(),
      email,
      phone,
      eventType: input.eventType ?? null,
      notes: input.notes?.trim() ? input.notes.trim() : null,
      metadata: input.metadata ?? {},
    });
  }
}
