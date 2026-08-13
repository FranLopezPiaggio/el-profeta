// Products module — Application service.
// Exposes read queries returning Result<T, DomainError> (never throws).
import { Result, type DomainError } from '@/shared/domain/result';
import type { Product } from '../domain/product.entity';
import { ProductRepository } from '../infrastructure/product.repository';

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async getCatalog(tenantId: string): Promise<Result<Product[], DomainError>> {
    return this.repository.getActiveByTenant(tenantId);
  }

  async getBySlug(tenantId: string, slug: string): Promise<Result<Product, DomainError>> {
    return this.repository.getActiveBySlug(tenantId, slug);
  }
}
