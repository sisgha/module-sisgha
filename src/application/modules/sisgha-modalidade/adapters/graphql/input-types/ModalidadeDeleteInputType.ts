import { Field, ID, InputType } from '@nestjs/graphql';
import { IModalidadeDeleteInput } from '@sisgea/spec';

@InputType('ModalidadeDeleteInput')
export class ModalidadeDeleteInputType implements IModalidadeDeleteInput {
  @Field(() => ID)
  id!: string;
}
