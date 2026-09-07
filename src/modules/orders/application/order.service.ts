// Orders — Service Layer (Dumb Client, tenant isolation, Result<T,DomainError>).
// Uses supabaseAdmin. Never import in client. Implements IOrderService per CONTRACTS_AND_SCHEMAS.md.
import { supabaseAdmin } from '@/shared/infrastructure/supabase/admin';
import { Result, type DomainError } from '@/shared/domain/result';
import type { OrderEntity, OrderItemEntity, OrderStatus } from '@/shared/domain/db-entities';
import type { CreateOrderInput, UpdateOrderStatusInput } from '../domain/order.schema';
import { OrderRepository } from '../infrastructure/order.repository';

export interface CreateOrderResponse {
  order: OrderEntity;
  items: OrderItemEntity[];
  whatsappUrl: string;
}

export interface IOrderService {
  createOrder(input: CreateOrderInput): Promise<Result<CreateOrderResponse, DomainError>>;
  updateStatus(input: UpdateOrderStatusInput): Promise<Result<OrderEntity, DomainError>>;
}

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['completed', 'cancelled', 'expired'],
  cancelled: ['pending'],
  completed: [],
  expired: [],
};

function toInternalError(): DomainError {
  return { code: 'INTERNAL_SERVER_ERROR', message: 'Error interno del servidor' };
}

function buildWhatsappUrl(
  rawWhatsappNumber: string,
  order: OrderEntity,
  items: OrderItemEntity[]
): string {
  const digits = rawWhatsappNumber.replace(/\D/g, '');
  const lines = [
    `*¡NUEVO PEDIDO EN EL PROFETA!* #${order.order_number}`,
    `Cliente: ${order.customer_name} - ${order.customer_phone}`,
    ``,
    `Items:`,
    ...items.map((i) => `- ${i.product_title} x${i.quantity} - $${Number(i.unit_price).toFixed(2)}`),
    ``,
    `Total: $${Number(order.total_amount).toFixed(2)}`,
  ];
  if (order.notes) lines.push(`Notas: ${order.notes}`);
  const message = lines.join('\n');
  // SECURITY.md: MUST use new URL() to validate
  const url = new URL(`https://wa.me/${digits}?text=${encodeURIComponent(message)}`);
  return url.toString();
}

export class OrderService implements IOrderService {
  private repo = new OrderRepository();

  private async resolveTenant(slug: string): Promise<Result<{ id: string; whatsapp_number: string }, DomainError>> {
    const { data, error } = await supabaseAdmin
      .from('tenants')
      .select('id, whatsapp_number')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      return Result.fail({ code: 'TENANT_NOT_FOUND', message: `Tenant no encontrado: ${slug}` });
    }
    return Result.ok({ id: (data as { id: string }).id, whatsapp_number: (data as { whatsapp_number: string }).whatsapp_number });
  }

  async createOrder(input: CreateOrderInput): Promise<Result<CreateOrderResponse, DomainError>> {
    // 1. Resolve tenant (never trust client tenant_id)
    const tenantRes = await this.resolveTenant(input.tenantSlug);
    if (!tenantRes.success) return Result.fail(tenantRes.error);
    const tenantId = tenantRes.data.id;
    const tenantWhatsapp = tenantRes.data.whatsapp_number;

    // 2. Fetch active products for tenant (server-side price truth)
    const { data: products, error: prodError } = await supabaseAdmin
      .from('products')
      .select('id, title, sku, price, slug')
      .eq('tenant_id', tenantId)
      .eq('is_active', true);

    if (prodError) return Result.fail(toInternalError());

    const productMap = new Map<string, { title: string; sku: string | null; price: number }>();
    const slugToId = new Map<string, string>();
    for (const p of (products as Array<Record<string, unknown>>) ?? []) {
      productMap.set(p.id as string, {
        title: p.title as string,
        sku: (p.sku as string | null) ?? null,
        price: Number(p.price),
      });
      if (p.slug) slugToId.set(p.slug as string, p.id as string);
    }

    // 3. Validate items exist + compute totalAmount (Dumb Client: don't trust client total)
    let totalAmount = 0;
    const resolvedItems: Array<{
      productId: string | null;
      productTitle: string;
      sku: string | null;
      unitPrice: number;
      quantity: number;
    }> = [];

    for (const it of input.items) {
      // ponytail: slug fallback for carts storing slug ids ("blonde") — map slug->uuid before lookup
      const resolvedId = productMap.has(it.productId) ? it.productId : (slugToId.get(it.productId) ?? it.productId);
      const prod = productMap.get(resolvedId);
      if (!prod) {
        return Result.fail({ code: 'PRODUCT_NOT_FOUND', message: `Producto no encontrado: ${it.productId}` });
      }
      const unitPrice = Number(prod.price);
      totalAmount += unitPrice * it.quantity;
      resolvedItems.push({
        productId: resolvedId,
        productTitle: prod.title,
        sku: prod.sku,
        unitPrice,
        quantity: it.quantity,
      });
    }

    // 4. Idempotency: if key exists return existing order (no duplicate)
    const existing = await this.repo.findByIdempotencyKey(tenantId, input.idempotencyKey);
    if (existing) {
      const { data: existingItems } = await supabaseAdmin
        .from('order_items')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('order_id', existing.id);

      const items: OrderItemEntity[] = ((existingItems as unknown as Record<string, unknown>[]) ?? []).map((r) => ({
        id: r.id as string,
        tenant_id: r.tenant_id as string,
        order_id: r.order_id as string,
        product_id: (r.product_id as string | null) ?? null,
        product_title: r.product_title as string,
        sku: (r.sku as string | null) ?? null,
        unit_price: Number(r.unit_price),
        quantity: r.quantity as number,
        created_at: r.created_at as string,
        updated_at: r.updated_at as string,
      }));

      const whatsappUrl = buildWhatsappUrl(tenantWhatsapp, existing, items);
      return Result.ok({ order: existing, items, whatsappUrl });
    }

    // 5. Create order + items (repo sequential without RPC)
    const created = await this.repo.createOrder(tenantId, {
      idempotencyKey: input.idempotencyKey,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      totalAmount,
      notes: input.notes ?? null,
      items: resolvedItems,
    });

    if (!created.success) {
      // Handle race idempotency conflict: fetch existing
      if (created.error.code === 'IDEMPOTENCY_CONFLICT') {
        const dup = await this.repo.findByIdempotencyKey(tenantId, input.idempotencyKey);
        if (dup) {
          const { data: dupItems } = await supabaseAdmin
            .from('order_items')
            .select('*')
            .eq('tenant_id', tenantId)
            .eq('order_id', dup.id);
          const items: OrderItemEntity[] = ((dupItems as unknown as Record<string, unknown>[]) ?? []).map((r) => ({
            id: r.id as string,
            tenant_id: r.tenant_id as string,
            order_id: r.order_id as string,
            product_id: (r.product_id as string | null) ?? null,
            product_title: r.product_title as string,
            sku: (r.sku as string | null) ?? null,
            unit_price: Number(r.unit_price),
            quantity: r.quantity as number,
            created_at: r.created_at as string,
            updated_at: r.updated_at as string,
          }));
          return Result.ok({ order: dup, items, whatsappUrl: buildWhatsappUrl(tenantWhatsapp, dup, items) });
        }
      }
      return Result.fail(created.error);
    }

    const whatsappUrl = buildWhatsappUrl(tenantWhatsapp, created.data.order, created.data.items);
    return Result.ok({ order: created.data.order, items: created.data.items, whatsappUrl });
  }

  async updateStatus(input: UpdateOrderStatusInput): Promise<Result<OrderEntity, DomainError>> {
    const tenantId = input.tenantId;
    const orderId = input.orderId;
    const nextStatus = input.nextStatus as OrderStatus;

    // Fetch current order
    const currentRes = await this.repo.findById(tenantId, orderId);
    if (!currentRes.success) return Result.fail(currentRes.error);
    const current = currentRes.data;

    // Validate transition
    const allowed = ALLOWED_TRANSITIONS[current.status] ?? [];
    if (current.status === nextStatus) return Result.ok(current);
    if (!allowed.includes(nextStatus)) {
      return Result.fail({
        code: 'INVALID_STATE_TRANSITION',
        message: `Transición no permitida: ${current.status} -> ${nextStatus}`,
      });
    }

    // pending -> completed: decrement stock (allow negative, do not block per spec)
    if (current.status === 'pending' && nextStatus === 'completed') {
      // ponytail: sequential stock updates without transaction/RPC, allow negative stock per spec; use rpc if contention
      const { data: items } = await supabaseAdmin
        .from('order_items')
        .select('product_id, quantity')
        .eq('tenant_id', tenantId)
        .eq('order_id', orderId);

      const rows = (items as Array<{ product_id: string | null; quantity: number }>) ?? [];
      const productIds = rows.filter((r) => r.product_id).map((r) => r.product_id as string);

      if (productIds.length > 0) {
        const { data: prods } = await supabaseAdmin
          .from('products')
          .select('id, stock')
          .eq('tenant_id', tenantId)
          .in('id', productIds);

        const stockMap = new Map<string, number>();
        for (const p of (prods as Array<{ id: string; stock: number }>) ?? []) {
          stockMap.set(p.id, Number(p.stock));
        }

        for (const it of rows) {
          if (!it.product_id) continue;
          const currentStock = stockMap.get(it.product_id);
          if (currentStock === undefined) continue;
          const newStock = currentStock - it.quantity;
          // do not block on insufficient stock — just decrement (warn via dashboard)
          await supabaseAdmin
            .from('products')
            .update({ stock: newStock })
            .eq('tenant_id', tenantId)
            .eq('id', it.product_id);
        }
      }
    }

    return this.repo.updateStatus(tenantId, orderId, nextStatus);
  }
}
