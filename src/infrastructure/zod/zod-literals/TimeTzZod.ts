import { z } from 'zod';
import { timetzRegex } from '../../helpers/timetz';

export const TimeTzZod = z.string().refine((value) => timetzRegex.test(value), {
  message: 'Invalid timetz value',
});
