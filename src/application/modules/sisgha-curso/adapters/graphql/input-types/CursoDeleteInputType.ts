import { Field, ID, InputType } from '@nestjs/graphql';
import { ICursoDeleteInput } from '@sisgea/spec';

@InputType('CursoDeleteInput')
export class CursoDeleteInputType implements ICursoDeleteInput {
  @Field(() => ID)
  id!: string;
}
