import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { SisghaCursoModel } from '@sisgea/spec';
import { SisghaModalidadeType } from '../../../../sisgha-modalidade/adapters/graphql/types';

@ObjectType('Curso')
@Directive('@key(fields: "id")')
export class SisghaCursoType implements SisghaCursoModel {
  @Field(() => ID)
  id!: string;

  // ...

  @Field(() => String)
  nome!: string;

  @Field(() => String)
  nomeAbreviado!: string;

  // ...

  @Field(() => Date)
  dateCreated!: Date;

  @Field(() => Date)
  dateUpdated!: Date;

  @Field(() => Date, { nullable: true })
  dateDeleted!: Date | null;

  // ...

  @Field(() => SisghaModalidadeType, { nullable: false })
  modalidade!: SisghaModalidadeType;
}
