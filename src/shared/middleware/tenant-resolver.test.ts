import { describe, it, expect } from 'vitest';
import { resolveSlug } from './tenant-resolver';

const DOMAIN = 'cervezaelprofeta.com';

describe('resolveSlug — subdomain', () => {
  it('extracts slug from subdomain', () => {
    expect(resolveSlug('tienda1.cervezaelprofeta.com', '/', DOMAIN)).toEqual({
      slug: 'tienda1',
      source: 'subdomain',
    });
  });

  it('treats apex and www as not a subdomain', () => {
    expect(resolveSlug('cervezaelprofeta.com', '/', DOMAIN).source).not.toBe('subdomain');
    expect(resolveSlug('www.cervezaelprofeta.com', '/', DOMAIN).source).not.toBe('subdomain');
  });

  it('rejects invalid subdomain labels', () => {
    expect(resolveSlug('Foo_Bar.cervezaelprofeta.com', '/', DOMAIN).slug).toBeNull();
  });
});

describe('resolveSlug — local path', () => {
  it('extracts slug from first path segment', () => {
    expect(resolveSlug('localhost', '/tienda1', undefined)).toEqual({
      slug: 'tienda1',
      source: 'path',
    });
  });

  it('extracts slug from deeper paths', () => {
    expect(resolveSlug('localhost', '/tienda1/cervezas', undefined).slug).toBe('tienda1');
  });

  it('ignores reserved top-level routes', () => {
    for (const route of ['products', 'admin', 'api']) {
      expect(resolveSlug('localhost', `/${route}`, undefined).slug).toBeNull();
    }
  });

  it('returns no slug for root path', () => {
    expect(resolveSlug('localhost', '/', undefined)).toEqual({ slug: null, source: 'none' });
  });

  it('rejects invalid path slugs', () => {
    expect(resolveSlug('localhost', '/Foo_Bar', undefined).slug).toBeNull();
  });
});
