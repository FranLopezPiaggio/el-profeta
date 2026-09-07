import { z } from 'zod';

const e164PhoneRegex = /^\+[1-9]\d{1,14}$/;

export const CreateLeadInputSchema = z.object({
  tenantSlug: z.string().min(2).max(63).regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(3).max(100),
  email: z.string().trim().email({ message: 'Email inválido' }).optional().nullable().or(z.literal('')),
  phone: z.string().trim().regex(e164PhoneRegex, { message: 'Teléfono E.164' }).optional().nullable(),
  eventType: z.enum(['barril', 'evento', 'contacto']).optional(),
  notes: z.string().trim().max(500).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreateLeadInput = z.infer<typeof CreateLeadInputSchema>;
