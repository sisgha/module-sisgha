import { Field, ID, InputType } from '@nestjs/graphql';
import { IModalidadeUpdateInput } from '@sisgea/spec';

@InputType('ModalidadeUpdateInput')
export class ModalidadeUpdateInputType implements IModalidadeUpdateInput {
  @Field(() => ID)
  id!: string;

  // ...

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  nome?: string;

  // ...
}
