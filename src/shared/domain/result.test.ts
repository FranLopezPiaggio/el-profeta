import { describe, it, expect } from 'vitest';
import { Result, type DomainError } from './result';

describe('Result', () => {
  it('ok() builds a success result carrying data', () => {
    const r = Result.ok(42);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBe(42);
  });

  it('fail() builds a failure result carrying the error', () => {
    const err: DomainError = { code: 'TENANT_NOT_FOUND', message: 'nope' };
    const r = Result.fail(err);
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error).toEqual(err);
  });

  it('narrows the union via the success flag', () => {
    const ok: Result<string, DomainError> = Result.ok('ok');
    const fail: Result<string, DomainError> = Result.fail({
      code: 'PRODUCT_NOT_FOUND',
      message: 'gone',
    });
    expect(ok.success ? ok.data : ok.error).toBe('ok');
    expect(fail.success ? fail.data : fail.error).toEqual({
      code: 'PRODUCT_NOT_FOUND',
      message: 'gone',
    });
  });
});
