import {z} from 'zod';
import {timetzRegex} from "../../helpers/timetz";

export const TimeTZZod = z.string().refine((value) => timetzRegex.test(value), {
  message: 'Invalid timetz value',
});
