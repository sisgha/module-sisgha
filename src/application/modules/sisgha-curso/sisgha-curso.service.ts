import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ICursoCreateInput,
  ICursoDeleteInput,
  ICursoFindByIdInput,
  ICursoUpdateInput,
  SisgeaResource,
  SisghaCursoModel,
  ValidationErrorCodeCurso,
} from '@sisgea/spec';
import { get, has, omit } from 'lodash';
import { FindOneOptions, IsNull } from 'typeorm';
import { ValidationFailedException } from '../../../infrastructure/api-app/validation';
import { CursoDbEntity } from '../../../infrastructure/database/entities/curso.db.entity';
import { ModalidadeDbEntity } from '../../../infrastructure/database/entities/modalidade.db.entity';
import { IGenericAction } from '../../../infrastructure/iam/IGenericAction';
import { ActorContext } from '../../../infrastructure/iam/actor-context';
import { SisghaModalidadeService } from '../sisgha-modalidade/sisgha-modalidade.service';

@Injectable()
export class SisghaCursoService {
  constructor(
    // ...

    private sisghaModalidadeService: SisghaModalidadeService,
  ) {}

  // ...

  async cursoFindById(actorContext: ActorContext, dto: ICursoFindByIdInput, options: FindOneOptions<CursoDbEntity> | null = null) {
    const targetCurso = await actorContext.db_run(async ({ cursoRepository }) => {
      return cursoRepository.findOne({
        where: { id: dto.id },
        select: ['id'],
        cache: 20,
      });
    });

    if (!targetCurso) {
      return null;
    }

    const curso = await actorContext.db_run(async ({ cursoRepository }) => {
      return cursoRepository.findOneOrFail({
        where: { id: targetCurso.id },
        select: ['id'],
        ...options,
      });
    });

    return actorContext.readResource(SisgeaResource.CURSO, curso);
  }

  async cursoFindByIdStrict(actorContext: ActorContext, dto: ICursoFindByIdInput, options: FindOneOptions<CursoDbEntity> | null = null) {
    const curso = await this.cursoFindById(actorContext, dto, options);

    if (!curso) {
      throw new NotFoundException();
    }

    return curso;
  }

  async cursoFindByIdStrictSimple<T = Pick<CursoDbEntity, 'id'>>(actorContext: ActorContext, cursoId: SisghaCursoModel['id']): Promise<T> {
    const curso = await this.cursoFindByIdStrict(actorContext, { id: cursoId });
    return <T>curso;
  }

  // ...

  async getCursoStrictGenericField<K extends keyof CursoDbEntity>(
    actorContext: ActorContext,
    cursoId: SisghaCursoModel['id'],
    field: K,
  ): Promise<CursoDbEntity[K]> {
    const curso = await this.cursoFindByIdStrict(actorContext, { id: cursoId }, { select: ['id', field] });

    return <CursoDbEntity[K]>curso[field];
  }

  //

  async getCursoNome(actorContext: ActorContext, cursoId: SisghaCursoModel['id']) {
    return this.getCursoStrictGenericField(actorContext, cursoId, 'nome');
  }

  async getCursoNomeAbreviado(actorContext: ActorContext, cursoId: SisghaCursoModel['id']) {
    return this.getCursoStrictGenericField(actorContext, cursoId, 'nomeAbreviado');
  }

  async getCursoModalidade(actorContext: ActorContext, cursoId: SisghaCursoModel['id']) {
    const curso = await this.cursoFindByIdStrictSimple(actorContext, cursoId);

    const modalidade = await actorContext.db_run(async ({ modalidadeRepository }) => {
      const qb = modalidadeRepository
        .createQueryBuilder('modalidade')
        .select(['modalidade.id'])
        .innerJoin('modalidade.cursos', 'curso')
        .where('curso.id = :cursoId', { cursoId: curso.id });

      const modalidade = await qb.getOneOrFail();

      return modalidade;
    });

    return modalidade;
  }

  async getCursoDateCreated(actorContext: ActorContext, cursoId: SisghaCursoModel['id']) {
    return this.getCursoStrictGenericField(actorContext, cursoId, 'dateCreated');
  }

  async getCursoDateUpdated(actorContext: ActorContext, cursoId: SisghaCursoModel['id']) {
    return this.getCursoStrictGenericField(actorContext, cursoId, 'dateUpdated');
  }

  async getCursoDateDeleted(actorContext: ActorContext, cursoId: SisghaCursoModel['id']) {
    return this.getCursoStrictGenericField(actorContext, cursoId, 'dateDeleted');
  }

  // ...

  async cursoCreate(actorContext: ActorContext, dto: ICursoCreateInput) {
    const fieldsData = omit(dto, ['modalidadeId']);

    const curso = <CursoDbEntity>{
      ...fieldsData,
    };

    if (has(dto, 'modalidadeId')) {
      const modalidadeId = get(dto, 'modalidadeId')!;

      const modalidade = await this.sisghaModalidadeService.modalidadeFindById(
        actorContext,
        {
          id: modalidadeId,
        },
        {
          where: {
            dateDeleted: IsNull(),
          },
        },
      );

      if (!modalidade) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodeCurso.CURSO_MODALIDADE_NOT_FOUND,
            message: 'A modalidade informada não foi encontrada ou não pode ser usada.',
            path: ['modalidadeId'],
          },
        ]);
      }

      curso.modalidade = <ModalidadeDbEntity>{
        id: modalidade.id,
      };
    }

    await actorContext.ensurePermission(SisgeaResource.CURSO, IGenericAction.CREATE, curso);

    const dbCurso = await actorContext.db_run(async ({ cursoRepository }) => {
      await cursoRepository.save(curso);
      return <CursoDbEntity>curso;
    });

    console.log(111111);

    return this.cursoFindByIdStrictSimple(actorContext, dbCurso.id);
  }

  async cursoUpdate(actorContext: ActorContext, dto: ICursoUpdateInput) {
    const curso = await this.cursoFindByIdStrictSimple(actorContext, dto.id);

    const fieldsData = omit(dto, ['id', 'modalidadeId']);

    const updatedCurso = <CursoDbEntity>{
      ...curso,
      ...fieldsData,
    };

    if (has(dto, 'modalidadeId')) {
      const modalidadeId = get(dto, 'modalidadeId')!;

      const modalidade = await this.sisghaModalidadeService.modalidadeFindById(
        actorContext,
        {
          id: modalidadeId,
        },
        {
          where: {
            dateDeleted: IsNull(),
          },
        },
      );

      if (!modalidade) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodeCurso.CURSO_MODALIDADE_NOT_FOUND,
            message: 'A modalidade informada não foi encontrada ou não pode ser usada.',
            path: ['modalidadeId'],
          },
        ]);
      }

      updatedCurso.modalidade = <ModalidadeDbEntity>{
        id: modalidade.id,
      };
    }

    await actorContext.ensurePermission(SisgeaResource.CURSO, IGenericAction.UPDATE, updatedCurso);

    await actorContext.db_run(async ({ cursoRepository }) => {
      await cursoRepository.save(updatedCurso);
      return <CursoDbEntity>updatedCurso;
    });

    return this.cursoFindByIdStrictSimple(actorContext, curso.id);
  }

  async cursoDelete(actorContext: ActorContext, dto: ICursoDeleteInput) {
    const curso = await this.cursoFindByIdStrictSimple(actorContext, dto.id);

    await actorContext.ensurePermission(SisgeaResource.CURSO, IGenericAction.DELETE, curso);

    await actorContext.db_run(async ({ cursoRepository }) => {
      await cursoRepository
        .createQueryBuilder('curso')
        .update()
        .set({
          dateDeleted: new Date(),
        })
        .where('id = :id', { id: curso.id })
        .execute();
    });

    return true;
  }
}
