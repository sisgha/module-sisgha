import { Field, ID, InputType } from '@nestjs/graphql';
import { IModalidadeFindByIdInput } from '../../../../../../domain';

@InputType('ModalidadeFindByIdInput')
export class ModalidadeFindByIdInputType implements IModalidadeFindByIdInput {
  @Field(() => ID)
  id!: string;
}
