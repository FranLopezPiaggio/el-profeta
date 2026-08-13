// Shared Kernel: Result type & Domain Error taxonomy.
// Pure types — MUST NOT import from shared/infrastructure (no circular deps).

export type DomainErrorCode =
  | 'TENANT_NOT_FOUND'
  | 'PRODUCT_NOT_FOUND'
  | 'INSUFFICIENT_STOCK'
  | 'INVALID_STATE_TRANSITION'
  | 'IDEMPOTENCY_CONFLICT'
  | 'UNAUTHORIZED_TENANT_ACCESS'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_SERVER_ERROR';

export interface DomainError {
  code: DomainErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export type Result<T, E = DomainError> =
  | { success: true; data: T }
  | { success: false; error: E };

export const Result = {
  ok: <T>(data: T): Result<T, never> => ({ success: true, data }),
  fail: <E>(error: E): Result<never, E> => ({ success: false, error }),
};
