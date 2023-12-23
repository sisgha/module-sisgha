import { z } from 'zod';
import { UuidZod } from '../../../../infrastructure/zod/zod-literals/UuidZod';

export const ModalidadeFindByIdInputZod = z.object({
  id: UuidZod,
});
