import { z } from 'zod';

// Regex para formato de teléfono internacional E.164 (+5491112345678)
const e164PhoneRegex = /^\+[1-9]\d{1,14}$/;

// Regex para nombres válidos (letras, espacios y tildes únicamente)
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

// -----------------------------------------------------------------
// A. DTO de Entrada: Item individual del Carrito enviado por el Cliente
// -----------------------------------------------------------------
// ponytail: accepts slug|uuid, resolves server-side to UUID; tighten to uuid only when storefront migrates to Supabase ids
export const CartItemInputSchema = z.object({
  productId: z.string().min(1, { message: 'ID de producto requerido' }).max(100),
  quantity: z
    .number()
    .int({ message: 'La cantidad debe ser un número entero' })
    .positive({ message: 'La cantidad debe ser mayor a 0' })
    .max(99, { message: 'No se pueden solicitar más de 99 unidades por ítem' }),
});

export type CartItemInput = z.infer<typeof CartItemInputSchema>;

// -----------------------------------------------------------------
// B. DTO de Entrada: Checkout Payload enviado a Server Action
// -----------------------------------------------------------------
export const CreateOrderInputSchema = z.object({
  tenantSlug: z
    .string()
    .min(2)
    .max(63)
    .regex(/^[a-z0-9-]+$/, { message: 'Slug de tienda inválido' }),
  idempotencyKey: z
    .string()
    .uuid({ message: 'La clave de idempotencia debe ser un UUIDv4/v7 válido' }),
  customerName: z
    .string()
    .trim()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre no puede exceder 100 caracteres' })
    .regex(nameRegex, { message: 'El nombre solo puede contener letras' }),
  customerPhone: z
    .string()
    .trim()
    .regex(e164PhoneRegex, {
      message: 'El teléfono debe incluir código de país (ej: +5491112345678)',
    }),
  notes: z
    .string()
    .trim()
    .max(500, { message: 'Las notas no pueden exceder 500 caracteres' })
    .optional(),
  items: z
    .array(CartItemInputSchema)
    .min(1, { message: 'El carrito no puede estar vacío' })
    .max(50, { message: 'No se pueden incluir más de 50 ítems por orden' }),
});

export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>;

// -----------------------------------------------------------------
// C. DTO de Entrada: Cambio de Estado en Admin Panel
// -----------------------------------------------------------------
export const UpdateOrderStatusInputSchema = z.object({
  orderId: z.string().uuid({ message: 'ID de orden inválido' }),
  tenantId: z.string().uuid({ message: 'ID de tenant inválido' }),
  nextStatus: z.enum(['pending', 'completed', 'cancelled', 'expired'], {
    message: 'Estado de orden no permitido',
  }),
});

export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusInputSchema>;
