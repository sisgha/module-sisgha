import { ModalidadeFindByIdInputZod } from './ModalidadeFindByIdInputZod';

export const ModalidadeDeleteInputZod = ModalidadeFindByIdInputZod.pick({
  id: true,
});
