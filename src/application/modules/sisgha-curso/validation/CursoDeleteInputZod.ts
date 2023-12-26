import { CursoFindByIdInputZod } from './CursoFindByIdInputZod';

export const CursoDeleteInputZod = CursoFindByIdInputZod.pick({
  id: true,
});
