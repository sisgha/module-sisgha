import { z } from 'zod';
import { ModalidadeCreateInputZod } from './ModalidadeCreateInputZod';
import { ModalidadeFindByIdInputZod } from './ModalidadeFindByIdInputZod';

export const ModalidadeUpdateInputZod = z
  .object({})
  .merge(ModalidadeFindByIdInputZod)
  .merge(
    ModalidadeCreateInputZod.pick({
      slug: true,
      nome: true,
    }).partial(),
  );
