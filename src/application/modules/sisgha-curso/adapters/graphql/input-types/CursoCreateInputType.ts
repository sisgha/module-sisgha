import { Field, ID, InputType } from '@nestjs/graphql';
import { ICursoCreateInput } from '@sisgea/spec';

@InputType('CursoCreateInput')
export class CursoCreateInputType implements ICursoCreateInput {
  @Field(() => String)
  nome!: string;

  @Field(() => String)
  nomeAbreviado!: string;

  @Field(() => ID)
  modalidadeId!: string;
}
