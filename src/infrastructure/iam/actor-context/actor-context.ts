import { ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { GenericCanRequest } from '@sisgea/autorizacao-client';
import { IRequestUser } from '@sisgea/sso-nest-client';
import { get } from 'lodash';
import { DataSource } from 'typeorm';
import { IAuthenticatedEntityType } from '../../../domain/iam/authentication';
import { DatabaseContext } from '../../datbase-context/database-context';
import { SISGEAAutorizacaoConnectContainerService } from '../../sisgea-autorizacao-connect-container/sisgea-autorizacao-connect-container.service';
import { IGenericAction } from '../IGenericAction';
import { Actor, ActorUser } from '../authentication';

export class ActorContext {
  constructor(
    // ...
    public readonly dataSource: DataSource,
    public readonly sisgeaAutorizacaoClientService: SISGEAAutorizacaoConnectContainerService,
    public readonly actor: Actor,
  ) {}

  // ...

  static forSystem(dataSource: DataSource, sisgeaAutorizacaoClientService: SISGEAAutorizacaoConnectContainerService) {
    return new ActorContext(dataSource, sisgeaAutorizacaoClientService, Actor.forInternalSystem());
  }

  static forUser(dataSource: DataSource, sisgeaAutorizacaoClientService: SISGEAAutorizacaoConnectContainerService, userId: string) {
    return new ActorContext(dataSource, sisgeaAutorizacaoClientService, ActorUser.forUser(userId));
  }

  static forRequestUser(
    dataSource: DataSource,
    sisgeaAutorizacaoClientService: SISGEAAutorizacaoConnectContainerService,
    requestUser: IRequestUser | null,
  ) {
    const actor = ActorUser.forRequestUser(requestUser);
    return new ActorContext(dataSource, sisgeaAutorizacaoClientService, actor);
  }

  // ...

  async db_run<T>(callback: (payload: DatabaseContext) => Promise<T>): Promise<T> {
    const { dataSource, actor } = this;

    try {
      const result = await dataSource.transaction(async (entityManager) => {
        const queryRunner = entityManager.queryRunner;

        if (!queryRunner) {
          throw new InternalServerErrorException();
        }

        switch (actor.type) {
          case IAuthenticatedEntityType.INTERNAL_SYSTEM: {
            break;
          }

          case IAuthenticatedEntityType.USUARIO: {
            const user = (<ActorUser>actor).userRef;

            if (user) {
              await queryRunner.query(`set local "request.auth.user.id" to ${user.id};`);
            }

            break;
          }

          case IAuthenticatedEntityType.ANONONYMOUS:
          default: {
            break;
          }
        }

        return callback(new DatabaseContext(entityManager));
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  //

  async can(resource: string, action: string, data: any, field: string | string[] | null = null) {
    const resourceIdJson = JSON.stringify(get(data, 'id', null));

    const genericCan: GenericCanRequest = {
      action,
      resource,
      resourceIdJson,
    };

    //

    return this.sisgeaAutorizacaoClientService.checkActorCan(this.actor, genericCan);
  }

  async readResource(resource: string, data: any) {
    await this.ensurePermission(resource, IGenericAction.READ, data);

    return data;
  }

  async ensurePermission(resource: string, action: string, data: any, field: string | string[] | null = null) {
    const isAllowed = await this.can(resource, action, data, field);

    if (!isAllowed) {
      throw new ForbiddenException(`The actor is not allowed to perform the action '${action}' on resource '${resource}'.`);
    }

    return true;
  }
}
