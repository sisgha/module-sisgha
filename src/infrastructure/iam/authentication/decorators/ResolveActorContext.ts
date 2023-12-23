import { Injectable, PipeTransform } from '@nestjs/common';
import { IRequestUser } from '@sisgea/sso-nest-client';
import { RequestUserSSOGql } from '@sisgea/sso-nest-client/dist/application/gql';
import { ActorContext } from '../../actor-context';
import { DatabaseService } from '../../../database/database.service';
import { SISGEAAutorizacaoConnectContainerService } from '../../../sisgea-autorizacao-connect-container/sisgea-autorizacao-connect-container.service';

@Injectable()
export class ResolveActorContextPipe implements PipeTransform {
  constructor(
    //
    private databaseService: DatabaseService,
    private sisgeaAutorizacaoClientService: SISGEAAutorizacaoConnectContainerService,
  ) {}

  async transform(requestUser: IRequestUser | null /* _metadata: ArgumentMetadata */) {
    const dataSource = await this.databaseService.getAppDataSource();
    return ActorContext.forRequestUser(dataSource, this.sisgeaAutorizacaoClientService, requestUser);
  }
}

export const ResolveActorContext = (options?: any) => RequestUserSSOGql(options, ResolveActorContextPipe);
