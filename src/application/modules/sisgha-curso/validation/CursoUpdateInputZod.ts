import { z } from 'zod';
import { CursoCreateInputZod } from './CursoCreateInputZod';
import { CursoFindByIdInputZod } from './CursoFindByIdInputZod';

export const CursoUpdateInputZod = z
  .object({})
  .merge(CursoFindByIdInputZod)
  .merge(
    CursoCreateInputZod.pick({
      nome: true,
      nomeAbreviado: true,
      modalidadeId: true,
    }).partial(),
  );
