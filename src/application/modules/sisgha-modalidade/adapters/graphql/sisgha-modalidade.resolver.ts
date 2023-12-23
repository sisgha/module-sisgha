import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActorContext } from '../../../../../infrastructure/iam/actor-context';
import { ResolveActorContext } from '../../../../../infrastructure/iam/authentication/decorators/ResolveActorContext';
import { ValidatedArgs } from '../../../../../infrastructure/zod/decorators';
import { SisghaModalidadeService } from '../../sisgha-modalidade.service';
import {
  ModalidadeCheckSlugAvailabilityInputZod,
  ModalidadeCreateInputZod,
  ModalidadeDeleteInputZod,
  ModalidadeFindByIdInputZod,
  ModalidadeUpdateInputZod,
} from '../../validation';
import {
  ModalidadeCheckSlugAvailabilityInputType,
  ModalidadeCreateInputType,
  ModalidadeDeleteInputType,
  ModalidadeFindByIdInputType,
  ModalidadeUpdateInputType,
} from './input-types';
import { SisghaModalidadeType } from './types';

@Resolver(() => SisghaModalidadeType)
export class SisghaModalidadeResolver {
  constructor(
    //
    private sisghaModalidadeService: SisghaModalidadeService,
  ) {}

  // START: queries

  @Query(() => SisghaModalidadeType)
  async modalidadeFindById(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', ModalidadeFindByIdInputZod)
    dto: ModalidadeFindByIdInputType,
  ) {
    return this.sisghaModalidadeService.modalidadeFindByIdStrict(actorContext, dto);
  }

  //

  @Query(() => Boolean)
  async modalidadeCheckSlugAvailability(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', ModalidadeCheckSlugAvailabilityInputZod)
    dto: ModalidadeCheckSlugAvailabilityInputType,
  ) {
    return this.sisghaModalidadeService.modalidadeCheckSlugAvailability(actorContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => SisghaModalidadeType)
  async modalidadeCreate(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', ModalidadeCreateInputZod)
    dto: ModalidadeCreateInputType,
  ) {
    return this.sisghaModalidadeService.modalidadeCreate(actorContext, dto);
  }

  @Mutation(() => SisghaModalidadeType)
  async modalidadeUpdate(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', ModalidadeUpdateInputZod)
    dto: ModalidadeUpdateInputType,
  ) {
    return this.sisghaModalidadeService.modalidadeUpdate(actorContext, dto);
  }

  @Mutation(() => Boolean)
  async modalidadeDelete(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', ModalidadeDeleteInputZod)
    dto: ModalidadeDeleteInputType,
  ) {
    return this.sisghaModalidadeService.modalidadeDelete(actorContext, dto);
  }

  // END: mutations

  // START: fields graphql-resolvers

  @ResolveField('slug', () => String)
  async slug(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: SisghaModalidadeType,
  ) {
    return this.sisghaModalidadeService.getModalidadeSlug(actorContext, parent.id);
  }

  @ResolveField('nome', () => String)
  async nome(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: SisghaModalidadeType,
  ) {
    return this.sisghaModalidadeService.getModalidadeNome(actorContext, parent.id);
  }

  @ResolveField('dateCreated', () => Date)
  async dateCreated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: SisghaModalidadeType,
  ) {
    return this.sisghaModalidadeService.getModalidadeDateCreated(actorContext, parent.id);
  }

  @ResolveField('dateUpdated', () => Date)
  async dateUpdated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: SisghaModalidadeType,
  ) {
    return this.sisghaModalidadeService.getModalidadeDateUpdated(actorContext, parent.id);
  }

  @ResolveField('dateDeleted', () => Date, { nullable: true })
  async dateDeleted(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: SisghaModalidadeType,
  ) {
    return this.sisghaModalidadeService.getModalidadeDateDeleted(actorContext, parent.id);
  }

  // END: fields graphql-resolvers
}
