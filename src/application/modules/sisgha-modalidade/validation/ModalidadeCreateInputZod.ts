import { z } from 'zod';

export const ModalidadeCreateInputZod = z.object({
  slug: z.string().trim().min(1),

  nome: z.string().trim().min(1),
});
