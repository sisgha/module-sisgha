import { z } from 'zod';
import { ModalidadeFindByIdInputZod } from '../../sisgha-modalidade/validation';

export const CursoCreateInputZod = z.object({
  nome: z.string().trim().min(1),
  nomeAbreviado: z.string().trim().min(1),

  modalidadeId: ModalidadeFindByIdInputZod.shape.id,
});
