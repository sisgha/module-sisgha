import { Field, ID, InputType } from '@nestjs/graphql';
import { ICursoUpdateInput } from '@sisgea/spec';

@InputType('CursoUpdateInput')
export class CursoUpdateInputType implements ICursoUpdateInput {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: true })
  nome?: string;

  @Field(() => String, { nullable: true })
  nomeAbreviado?: string;

  @Field(() => ID, { nullable: true })
  modalidadeId?: string;
}
