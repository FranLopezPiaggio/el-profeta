// Orders — Repository (Supabase, tenant-isolated).
// Uses supabaseAdmin to bypass RLS for anon checkout. Never import in client.
import { supabaseAdmin } from '@/shared/infrastructure/supabase/admin';
import { Result, type DomainError } from '@/shared/domain/result';
import type { OrderEntity, OrderItemEntity, OrderStatus } from '@/shared/domain/db-entities';

type CreateOrderData = {
  idempotencyKey: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  notes?: string | null;
  items: Array<{
    productId: string | null;
    productTitle: string;
    sku: string | null;
    unitPrice: number;
    quantity: number;
  }>;
};

function mapOrderRow(row: Record<string, unknown>): OrderEntity {
  return {
    id: row.id as string,
    tenant_id: row.tenant_id as string,
    order_number: row.order_number as number,
    idempotency_key: row.idempotency_key as string,
    customer_name: row.customer_name as string,
    customer_phone: row.customer_phone as string,
    total_amount: Number(row.total_amount),
    status: row.status as OrderStatus,
    notes: (row.notes as string | null) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function mapOrderItemRow(row: Record<string, unknown>): OrderItemEntity {
  return {
    id: row.id as string,
    tenant_id: row.tenant_id as string,
    order_id: row.order_id as string,
    product_id: (row.product_id as string | null) ?? null,
    product_title: row.product_title as string,
    sku: (row.sku as string | null) ?? null,
    unit_price: Number(row.unit_price),
    quantity: row.quantity as number,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function toInternalError(): DomainError {
  return { code: 'INTERNAL_SERVER_ERROR', message: 'Error interno del servidor' };
}

export class OrderRepository {
  async findByIdempotencyKey(tenantId: string, idempotencyKey: string): Promise<OrderEntity | null> {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('idempotency_key', idempotencyKey)
      .maybeSingle();

    if (error || !data) return null;
    return mapOrderRow(data as unknown as Record<string, unknown>);
  }

  // ponytail: sequential inserts without pg RPC, use rpc/transaction if partial-write observed
  async createOrder(
    tenantId: string,
    data: CreateOrderData
  ): Promise<Result<{ order: OrderEntity; items: OrderItemEntity[] }, DomainError>> {
    try {
      const { data: orderRow, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          tenant_id: tenantId,
          idempotency_key: data.idempotencyKey,
          customer_name: data.customerName,
          customer_phone: data.customerPhone,
          total_amount: data.totalAmount,
          notes: data.notes ?? null,
          status: 'pending',
        })
        .select('*')
        .single();

      if (orderError) {
        if ((orderError as { code?: string }).code === '23505') {
          return Result.fail({ code: 'IDEMPOTENCY_CONFLICT', message: 'Orden duplicada' });
        }
        return Result.fail(toInternalError());
      }

      const order = mapOrderRow(orderRow as unknown as Record<string, unknown>);

      if (data.items.length === 0) {
        return Result.ok({ order, items: [] });
      }

      const itemsToInsert = data.items.map((it) => ({
        tenant_id: tenantId,
        order_id: order.id,
        product_id: it.productId ?? null,
        product_title: it.productTitle,
        sku: it.sku ?? null,
        unit_price: it.unitPrice,
        quantity: it.quantity,
      }));

      const { data: itemsRows, error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(itemsToInsert)
        .select('*');

      if (itemsError) {
        return Result.fail(toInternalError());
      }

      const items = (itemsRows as unknown as Record<string, unknown>[]).map(mapOrderItemRow);
      return Result.ok({ order, items });
    } catch {
      return Result.fail(toInternalError());
    }
  }

  async findById(tenantId: string, orderId: string): Promise<Result<OrderEntity, DomainError>> {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('id', orderId)
        .maybeSingle();

      if (error) return Result.fail(toInternalError());
      if (!data) return Result.fail({ code: 'INTERNAL_SERVER_ERROR', message: 'Orden no encontrada' });

      return Result.ok(mapOrderRow(data as unknown as Record<string, unknown>));
    } catch {
      return Result.fail(toInternalError());
    }
  }

  async updateStatus(
    tenantId: string,
    orderId: string,
    status: OrderStatus
  ): Promise<Result<OrderEntity, DomainError>> {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .update({ status })
        .eq('tenant_id', tenantId)
        .eq('id', orderId)
        .select('*')
        .single();

      if (error) return Result.fail(toInternalError());
      if (!data) return Result.fail({ code: 'INTERNAL_SERVER_ERROR', message: 'Orden no encontrada' });

      return Result.ok(mapOrderRow(data as unknown as Record<string, unknown>));
    } catch {
      return Result.fail(toInternalError());
    }
  }
}
