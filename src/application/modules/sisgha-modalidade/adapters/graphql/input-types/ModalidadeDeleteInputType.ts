import { Field, ID, InputType } from '@nestjs/graphql';
import { IModalidadeDeleteInput } from '../../../../../../domain';

@InputType('ModalidadeDeleteInput')
export class ModalidadeDeleteInputType implements IModalidadeDeleteInput {
  @Field(() => ID)
  id!: string;
}
