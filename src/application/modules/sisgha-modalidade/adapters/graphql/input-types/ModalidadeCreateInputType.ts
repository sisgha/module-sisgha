import { Field, InputType } from '@nestjs/graphql';
import { IModalidadeCreateInput } from '@sisgea/spec';

@InputType('ModalidadeCreateInput')
export class ModalidadeCreateInputType implements IModalidadeCreateInput {
  @Field()
  slug!: string;

  @Field()
  nome!: string;
}
