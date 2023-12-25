import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { SisghaModalidadeModel } from '@sisgea/spec';

@ObjectType('Modalidade')
@Directive('@key(fields: "id")')
export class SisghaModalidadeType implements SisghaModalidadeModel {
  @Field(() => ID)
  id!: string;

  // ...

  @Field(() => String)
  slug!: string;

  @Field(() => String)
  nome!: string;

  // ...

  @Field(() => Date)
  dateCreated!: Date;

  @Field(() => Date)
  dateUpdated!: Date;

  @Field(() => Date, { nullable: true })
  dateDeleted!: Date | null;

  //

  cursos!: SisghaCursoModel[];
}
