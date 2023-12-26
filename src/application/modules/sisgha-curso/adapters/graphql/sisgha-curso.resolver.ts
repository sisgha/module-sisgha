import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActorContext } from '../../../../../infrastructure/iam/actor-context';
import { ResolveActorContext } from '../../../../../infrastructure/iam/authentication/decorators/ResolveActorContext';
import { ValidatedArgs } from '../../../../../infrastructure/zod/decorators';
import { SisghaCursoService } from '../../sisgha-curso.service';
import { CursoCreateInputZod, CursoDeleteInputZod, CursoFindByIdInputZod, CursoUpdateInputZod } from '../../validation';
import { CursoCreateInputType, CursoDeleteInputType, CursoFindByIdInputType, CursoUpdateInputType } from './input-types';
import { SisghaCursoType } from './types';

@Resolver(() => SisghaCursoType)
export class SisghaCursoResolver {
  constructor(private sisghaCursoService: SisghaCursoService) {}

  // START: queries

  @Query(() => SisghaCursoType)
  async cursoFindById(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', CursoFindByIdInputZod)
    dto: CursoFindByIdInputType,
  ) {
    return this.sisghaCursoService.cursoFindByIdStrict(actorContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => SisghaCursoType)
  async cursoCreate(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', CursoCreateInputZod)
    dto: CursoCreateInputType,
  ) {
    return this.sisghaCursoService.cursoCreate(actorContext, dto);
  }

  @Mutation(() => SisghaCursoType)
  async cursoUpdate(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', CursoUpdateInputZod)
    dto: CursoUpdateInputType,
  ) {
    return this.sisghaCursoService.cursoUpdate(actorContext, dto);
  }

  @Mutation(() => Boolean)
  async cursoDelete(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', CursoDeleteInputZod)
    dto: CursoDeleteInputType,
  ) {
    return this.sisghaCursoService.cursoDelete(actorContext, dto);
  }

  // END: mutations

  // START: fields

  @ResolveField('nome', () => String)
  async nome(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: SisghaCursoType,
  ) {
    return this.sisghaCursoService.getCursoNome(actorContext, parent.id);
  }

  @ResolveField('nomeAbreviado', () => String)
  async nomeAbreviado(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: SisghaCursoType,
  ) {
    return this.sisghaCursoService.getCursoNomeAbreviado(actorContext, parent.id);
  }

  @ResolveField('modalidade', () => String)
  async modalidade(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: SisghaCursoType,
  ) {
    return this.sisghaCursoService.getCursoModalidade(actorContext, parent.id);
  }

  @ResolveField('dateCreated', () => Date)
  async dateCreated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: SisghaCursoType,
  ) {
    return this.sisghaCursoService.getCursoDateCreated(actorContext, parent.id);
  }

  @ResolveField('dateUpdated', () => Date)
  async dateUpdated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: SisghaCursoType,
  ) {
    return this.sisghaCursoService.getCursoDateUpdated(actorContext, parent.id);
  }

  @ResolveField('dateDeleted', () => Date, { nullable: true })
  async dateDeleted(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: SisghaCursoType,
  ) {
    return this.sisghaCursoService.getCursoDateDeleted(actorContext, parent.id);
  }

  // END: fields
}
