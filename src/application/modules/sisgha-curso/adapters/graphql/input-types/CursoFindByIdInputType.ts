import { Field, ID, InputType } from '@nestjs/graphql';
import { ICursoFindByIdInput } from '@sisgea/spec';

@InputType('CursoFindByIdInput')
export class CursoFindByIdInputType implements ICursoFindByIdInput {
  @Field(() => ID)
  id!: string;
}
