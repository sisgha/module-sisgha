import { z } from 'zod';

const msg = 'Deve ser um uuid válido.';

export const UuidZod = z.string().uuid(msg);
