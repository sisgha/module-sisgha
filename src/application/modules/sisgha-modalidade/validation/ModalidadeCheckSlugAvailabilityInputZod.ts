import { z } from 'zod';
import { ModalidadeCreateInputZod } from './ModalidadeCreateInputZod';
import { ModalidadeFindByIdInputZod } from './ModalidadeFindByIdInputZod';

export const ModalidadeCheckSlugAvailabilityInputZod = z.object({
  slug: ModalidadeCreateInputZod.shape.slug,

  modalidadeId: ModalidadeFindByIdInputZod.shape.id.nullable().default(null),
});
