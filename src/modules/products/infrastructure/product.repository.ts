// Products module — Repository (Supabase, read-only).
// Mandatory tenant isolation: EVERY query filters by tenant_id (+ is_active).
// Maps snake_case DB rows -> camelCase domain entities.
import type { SupabaseClient } from '@supabase/supabase-js';
import { Result, type DomainError } from '@/shared/domain/result';
import type { ProductEntity } from '@/shared/domain/db-entities';
import type { Product } from '../domain/product.entity';

export class ProductRepository {
  constructor(private readonly client: SupabaseClient | null) {}

  async getActiveByTenant(tenantId: string): Promise<Result<Product[], DomainError>> {
    if (!this.client) {
      return Result.fail({ code: 'INTERNAL_SERVER_ERROR', message: 'Supabase no configurado' });
    }

    try {
      const { data, error } = await this.client
        .from('products')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', true);

      if (error) {
        return Result.fail({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      }

      return Result.ok((data ?? []).map(mapProductRow));
    } catch (err) {
      return Result.fail({
        code: 'INTERNAL_SERVER_ERROR',
        message: err instanceof Error ? err.message : 'Error desconocido',
      });
    }
  }

  async getActiveBySlug(
    tenantId: string,
    slug: string
  ): Promise<Result<Product, DomainError>> {
    if (!this.client) {
      return Result.fail({ code: 'INTERNAL_SERVER_ERROR', message: 'Supabase no configurado' });
    }

    try {
      const { data, error } = await this.client
        .from('products')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        return Result.fail({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      }
      if (!data) {
        return Result.fail({ code: 'PRODUCT_NOT_FOUND', message: 'Producto no encontrado' });
      }

      return Result.ok(mapProductRow(data));
    } catch (err) {
      return Result.fail({
        code: 'INTERNAL_SERVER_ERROR',
        message: err instanceof Error ? err.message : 'Error desconocido',
      });
    }
  }
}

function mapProductRow(row: ProductEntity): Product {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    categoryId: row.category_id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    // PostgREST devuelve DECIMAL como string; normalizamos a number.
    price: Number(row.price),
    stock: row.stock,
    sku: row.sku,
    isActive: row.is_active,
    images: row.images,
    attributes: row.attributes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
