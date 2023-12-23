import { Injectable, NotFoundException } from '@nestjs/common';
import { get, has, omit } from 'lodash';
import { FindOneOptions } from 'typeorm';
import {
  IAppResourceKey,
  IModalidadeCheckSlugAvailabilityInput,
  IModalidadeCreateInput,
  IModalidadeDeleteInput,
  IModalidadeFindByIdInput,
  IModalidadeUpdateInput,
} from '../../../domain';
import { SisghaModalidadeModel } from '../../../domain/models/sisgha-modalidade.model';
import { ActorContext } from '../../../infrastructure/iam/actor-context';
import { ModalidadeDbEntity } from '../../../infrastructure/database/entities/modalidade.db.entity';
import { ValidationFailedException } from '../../../infrastructure/api-app/validation';

import { ValidationErrorCodeModalidade } from '../../../domain/dtos/modalidade/ValidationErrorCodeModalidade';
import { IGenericAction } from '../../../infrastructure/iam/IGenericAction';

@Injectable()
export class SisghaModalidadeService {
  constructor() {} // ...

  // ...

  async modalidadeFindById(
    actorContext: ActorContext,
    dto: IModalidadeFindByIdInput,
    options: FindOneOptions<ModalidadeDbEntity> | null = null,
  ) {
    const targetModalidade = await actorContext.db_run(async ({ modalidadeRepository }) => {
      return modalidadeRepository.findOne({
        cache: 20,
        ...options,
        where: { id: dto.id, ...options?.where },
        select: ['id'],
      });
    });

    if (!targetModalidade) {
      return null;
    }

    const modalidade = await actorContext.db_run(async ({ modalidadeRepository }) => {
      return modalidadeRepository.findOneOrFail({
        ...options,
        where: { id: targetModalidade.id },
        select: ['id', ...(options && Array.isArray(options.select) ? options.select : [])],
      });
    });

    return actorContext.readResource(IAppResourceKey.MODALIDADE, modalidade);
  }

  async modalidadeFindByIdStrict(
    actorContext: ActorContext,
    dto: IModalidadeFindByIdInput,
    options: FindOneOptions<ModalidadeDbEntity> | null = null,
  ) {
    const modalidade = await this.modalidadeFindById(actorContext, dto, options);

    if (!modalidade) {
      throw new NotFoundException();
    }

    return modalidade;
  }

  async modalidadeFindByIdStrictSimple<T = Pick<ModalidadeDbEntity, 'id'>>(
    actorContext: ActorContext,
    modalidadeId: SisghaModalidadeModel['id'],
  ): Promise<T> {
    const modalidade = await this.modalidadeFindByIdStrict(actorContext, { id: modalidadeId });
    return <T>modalidade;
  }

  //

  async modalidadeCheckSlugAvailability(actorContext: ActorContext, dto: IModalidadeCheckSlugAvailabilityInput) {
    const isSlugBeingUsedByOtherModalidade = await actorContext.db_run(async ({ modalidadeRepository }) => {
      const qb = modalidadeRepository.createQueryBuilder('modalidade');

      qb.select('modalidade.id');

      qb.where('modalidade.slug = :slug', { slug: dto.slug });

      if (dto.modalidadeId) {
        qb.andWhere('modalidade.id != :modalidadeId', { modalidadeId: dto.modalidadeId });
      }

      const count = await qb.getCount();

      return count === 0;
    });

    return isSlugBeingUsedByOtherModalidade;
  }

  // ...

  async getModalidadeStrictGenericField<K extends keyof ModalidadeDbEntity>(
    actorContext: ActorContext,
    modalidadeId: SisghaModalidadeModel['id'],
    field: K,
  ): Promise<ModalidadeDbEntity[K]> {
    const modalidade = await this.modalidadeFindByIdStrict(actorContext, { id: modalidadeId }, { select: ['id', field] });

    return <ModalidadeDbEntity[K]>modalidade[field];
  }

  //

  async getModalidadeSlug(actorContext: ActorContext, modalidadeId: SisghaModalidadeModel['id']) {
    return this.getModalidadeStrictGenericField(actorContext, modalidadeId, 'slug');
  }

  async getModalidadeNome(actorContext: ActorContext, modalidadeId: SisghaModalidadeModel['id']) {
    return this.getModalidadeStrictGenericField(actorContext, modalidadeId, 'nome');
  }

  async getModalidadeDateCreated(actorContext: ActorContext, modalidadeId: SisghaModalidadeModel['id']) {
    return this.getModalidadeStrictGenericField(actorContext, modalidadeId, 'dateCreated');
  }

  async getModalidadeDateUpdated(actorContext: ActorContext, modalidadeId: SisghaModalidadeModel['id']) {
    return this.getModalidadeStrictGenericField(actorContext, modalidadeId, 'dateUpdated');
  }

  async getModalidadeDateDeleted(actorContext: ActorContext, modalidadeId: SisghaModalidadeModel['id']) {
    return this.getModalidadeStrictGenericField(actorContext, modalidadeId, 'dateDeleted');
  }

  // ...

  async modalidadeCreate(actorContext: ActorContext, dto: IModalidadeCreateInput) {
    const fieldsData = omit(dto, []);

    if (has(fieldsData, 'slug')) {
      const slug = get(fieldsData, 'slug')!;

      const isSlugAvailable = await this.modalidadeCheckSlugAvailability(actorContext, { slug: slug, modalidadeId: null });

      if (!isSlugAvailable) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodeModalidade.MODALIDADE_SLUG_ALREADY_IN_USE,
            message: 'Já existe uma modalidade com o mesmo slug.',
            path: ['slug'],
          },
        ]);
      }
    }

    const modalidade = <ModalidadeDbEntity>{
      ...fieldsData,
    };

    await actorContext.ensurePermission(IAppResourceKey.MODALIDADE, IGenericAction.CREATE, modalidade);

    const dbModalidade = await actorContext.db_run(async ({ modalidadeRepository }) => {
      await modalidadeRepository.save(modalidade);
      return <ModalidadeDbEntity>modalidade;
    });

    return this.modalidadeFindByIdStrictSimple(actorContext, dbModalidade.id);
  }

  async modalidadeUpdate(actorContext: ActorContext, dto: IModalidadeUpdateInput) {
    const modalidade = await this.modalidadeFindByIdStrictSimple(actorContext, dto.id);

    const fieldsData = omit(dto, ['id']);

    if (has(fieldsData, 'slug')) {
      const slug = get(fieldsData, 'slug')!;

      const isSlugAvailable = await this.modalidadeCheckSlugAvailability(actorContext, {
        slug: slug,
        modalidadeId: modalidade.id,
      });

      if (!isSlugAvailable) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodeModalidade.MODALIDADE_SLUG_ALREADY_IN_USE,
            message: 'Já existe uma modalidade com o mesmo slug.',
            path: ['slug'],
          },
        ]);
      }
    }

    const updatedModalidade = <ModalidadeDbEntity>{
      ...modalidade,
      ...fieldsData,
    };

    await actorContext.ensurePermission(IAppResourceKey.MODALIDADE, IGenericAction.UPDATE, updatedModalidade);

    await actorContext.db_run(async ({ modalidadeRepository }) => {
      await modalidadeRepository.save(updatedModalidade);
      return <ModalidadeDbEntity>updatedModalidade;
    });

    return this.modalidadeFindByIdStrictSimple(actorContext, modalidade.id);
  }

  async modalidadeDelete(actorContext: ActorContext, dto: IModalidadeDeleteInput) {
    const modalidade = await this.modalidadeFindByIdStrictSimple(actorContext, dto.id);

    await actorContext.ensurePermission(IAppResourceKey.MODALIDADE, IGenericAction.DELETE, modalidade);

    await actorContext.db_run(async ({ modalidadeRepository }) => {
      await modalidadeRepository
        .createQueryBuilder('modalidade')
        .update()
        .set({
          dateDeleted: new Date(),
        })
        .where('id = :id', { id: modalidade.id })
        .execute();
    });

    return true;
  }
}
