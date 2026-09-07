// Leads — Repository (Supabase, tenant-isolated).
// Uses supabaseAdmin to bypass RLS. Never import in client.
import { supabaseAdmin } from '@/shared/infrastructure/supabase/admin';
import { Result, type DomainError } from '@/shared/domain/result';
import type { LeadEntity } from '@/shared/domain/db-entities';

type CreateLeadData = {
  name: string;
  email?: string | null;
  phone?: string | null;
  eventType?: string | null;
  notes?: string | null;
  metadata?: Record<string, unknown>;
  status?: string;
};

function mapLeadRow(row: Record<string, unknown>): LeadEntity {
  return {
    id: row.id as string,
    tenant_id: row.tenant_id as string,
    name: row.name as string,
    email: (row.email as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    event_type: (row.event_type as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    status: row.status as LeadEntity['status'],
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function toInternalError(): DomainError {
  return { code: 'INTERNAL_SERVER_ERROR', message: 'Error interno del servidor' };
}

export class LeadRepository {
  async createLead(
    tenantId: string,
    data: CreateLeadData
  ): Promise<Result<LeadEntity, DomainError>> {
    try {
      const { data: row, error } = await supabaseAdmin
        .from('leads')
        .insert({
          tenant_id: tenantId,
          name: data.name,
          email: data.email ?? null,
          phone: data.phone ?? null,
          event_type: data.eventType ?? null,
          notes: data.notes ?? null,
          metadata: data.metadata ?? {},
          status: 'new',
        })
        .select('*')
        .single();

      if (error) return Result.fail(toInternalError());
      if (!row) return Result.fail(toInternalError());

      return Result.ok(mapLeadRow(row as unknown as Record<string, unknown>));
    } catch {
      return Result.fail(toInternalError());
    }
  }

  async findById(tenantId: string, leadId: string): Promise<Result<LeadEntity, DomainError>> {
    try {
      const { data, error } = await supabaseAdmin
        .from('leads')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('id', leadId)
        .maybeSingle();

      if (error) return Result.fail(toInternalError());
      if (!data) return Result.fail({ code: 'INTERNAL_SERVER_ERROR', message: 'Lead no encontrado' });

      return Result.ok(mapLeadRow(data as unknown as Record<string, unknown>));
    } catch {
      return Result.fail(toInternalError());
    }
  }
}
