import { Field, ID, InputType } from '@nestjs/graphql';
import { IModalidadeFindByIdInput } from '@sisgea/spec';

@InputType('ModalidadeFindByIdInput')
export class ModalidadeFindByIdInputType implements IModalidadeFindByIdInput {
  @Field(() => ID)
  id!: string;
}
