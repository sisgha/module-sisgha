import { z } from 'zod';
import { UuidZod } from '../../../../infrastructure/zod/zod-literals/UuidZod';

export const CursoFindByIdInputZod = z.object({
  id: UuidZod,
});
