-- ponytail: seed mínimo prod para el-profeta — 1 tenant + 4 categorías + 6 productos
-- Sheet posee stock+precio (tiers globales); acá guardamos descripcion/imagen/abv/ibu fijos.
-- IBU/ABV comentados en cards por pedido del cliente; se dejan en attributes para activar luego sin migrar.

-- 1. Tenant prod
INSERT INTO tenants (id, slug, name, whatsapp_number, brand_colors)
VALUES (
  gen_random_uuid(),
  'el-profeta',
  'el profeta',
  '5491162712793',
  '{"primary":"#0a4a3a","secondary":"#f5e6a3"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET name='el profeta', whatsapp_number='5491162712793';

-- 2. Categorías (idempotente por tenant_id+slug)
INSERT INTO categories (tenant_id, title, slug, description)
SELECT t.id, v.title, v.slug, v.description FROM tenants t, (VALUES
  ('Rubias','rubias','Cervezas rubias doradas'),
  ('Rojas','rojas','Ales rojas'),
  ('Negras','negras','Cervezas oscuras'),
  ('IPAs','ipa','IPAs lupuladas')
) AS v(title, slug, description)
WHERE t.slug='el-profeta'
ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 3. Productos (slug estable = usado por sync; images apunta a /public/products/*; attributes guarda abv/ibu/volume+price_tiers placeholder)
-- Blonde
INSERT INTO products (tenant_id, category_id, title, slug, description, price, stock, sku, is_active, images, attributes)
SELECT t.id, c.id, 'BLONDE', 'blonde', 'Rubia dorada, suave y equilibrada. 473ml.', 3500, 0, 'BLONDE-473',
  true, '[{"id":"blonde-1","url":"/products/blonde-ale.png","order":0}]'::jsonb,
  '{"abv":5,"ibu":20,"volume":"473ml","price_tiers":{"minorista":3500,"six":3250,"doce":3000}}'::jsonb
FROM tenants t JOIN categories c ON c.tenant_id=t.id AND c.slug='rubias' WHERE t.slug='el-profeta'
ON CONFLICT (tenant_id, slug) DO UPDATE SET title='BLONDE', images='[{"id":"blonde-1","url":"/products/blonde-ale.png","order":0}]'::jsonb;

INSERT INTO products (tenant_id, category_id, title, slug, description, price, stock, sku, is_active, images, attributes)
SELECT t.id, c.id, 'HONEY', 'honey', 'Con miel orgánica, dulzor natural. 473ml.', 3500, 0, 'HONEY-473',
  true, '[{"id":"honey-1","url":"/products/honey.png","order":0}]'::jsonb,
  '{"abv":5.5,"ibu":18,"volume":"473ml","price_tiers":{"minorista":3500,"six":3250,"doce":3000}}'::jsonb
FROM tenants t JOIN categories c ON c.tenant_id=t.id AND c.slug='rubias' WHERE t.slug='el-profeta'
ON CONFLICT (tenant_id, slug) DO UPDATE SET title='HONEY', images='[{"id":"honey-1","url":"/products/honey.png","order":0}]'::jsonb;

INSERT INTO products (tenant_id, category_id, title, slug, description, price, stock, sku, is_active, images, attributes)
SELECT t.id, c.id, 'IRISH RED', 'irish-red', 'Irish Red Ale rojiza, notas caramelo. 473ml.', 3500, 0, 'IRISHRED-473',
  true, '[{"id":"irish-1","url":"/products/irish-red.png","order":0}]'::jsonb,
  '{"abv":5.8,"ibu":25,"volume":"473ml","price_tiers":{"minorista":3500,"six":3250,"doce":3000}}'::jsonb
FROM tenants t JOIN categories c ON c.tenant_id=t.id AND c.slug='rojas' WHERE t.slug='el-profeta'
ON CONFLICT (tenant_id, slug) DO UPDATE SET title='IRISH RED', images='[{"id":"irish-1","url":"/products/irish-red.png","order":0}]'::jsonb;

INSERT INTO products (tenant_id, category_id, title, slug, description, price, stock, sku, is_active, images, attributes)
SELECT t.id, c.id, 'STOUT', 'stout', 'Stout oscura, chocolate y café tostado. 473ml.', 3500, 0, 'STOUT-473',
  true, '[{"id":"stout-1","url":"/products/stout.png","order":0}]'::jsonb,
  '{"abv":6.5,"ibu":35,"volume":"473ml","price_tiers":{"minorista":3500,"six":3250,"doce":3000}}'::jsonb
FROM tenants t JOIN categories c ON c.tenant_id=t.id AND c.slug='negras' WHERE t.slug='el-profeta'
ON CONFLICT (tenant_id, slug) DO UPDATE SET title='STOUT', images='[{"id":"stout-1","url":"/products/stout.png","order":0}]'::jsonb;

INSERT INTO products (tenant_id, category_id, title, slug, description, price, stock, sku, is_active, images, attributes)
SELECT t.id, c.id, 'SESSION IPA', 'session-ipa', 'Session IPA ligera, floral y cítrica. 473ml.', 3500, 0, 'SESSIONIPA-473',
  true, '[{"id":"session-1","url":"/products/session-ipa.png","order":0}]'::jsonb,
  '{"abv":4.5,"ibu":40,"volume":"473ml","price_tiers":{"minorista":3500,"six":3250,"doce":3000}}'::jsonb
FROM tenants t JOIN categories c ON c.tenant_id=t.id AND c.slug='ipa' WHERE t.slug='el-profeta'
ON CONFLICT (tenant_id, slug) DO UPDATE SET title='SESSION IPA', images='[{"id":"session-1","url":"/products/session-ipa.png","order":0}]'::jsonb;

INSERT INTO products (tenant_id, category_id, title, slug, description, price, stock, sku, is_active, images, attributes)
SELECT t.id, c.id, 'RED IPA', 'red-ipa', 'Red IPA intensa, citrus y pino. 473ml.', 3500, 0, 'REDIPA-473',
  true, '[{"id":"redipa-1","url":"/products/red-ipa.png","order":0}]'::jsonb,
  '{"abv":7,"ibu":55,"volume":"473ml","price_tiers":{"minorista":3500,"six":3250,"doce":3000}}'::jsonb
FROM tenants t JOIN categories c ON c.tenant_id=t.id AND c.slug='rojas' WHERE t.slug='el-profeta'
ON CONFLICT (tenant_id, slug) DO UPDATE SET title='RED IPA', images='[{"id":"redipa-1","url":"/products/red-ipa.png","order":0}]'::jsonb;
