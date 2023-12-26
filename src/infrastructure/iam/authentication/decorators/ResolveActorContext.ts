import { Injectable, PipeTransform } from '@nestjs/common';
import { IRequestUser } from '@sisgea/nest-auth-connect';
import { SisgeaRequestUserGql } from '@sisgea/nest-auth-connect/dist/modules/sisgea-nest-auth-protect/gql';
import { DatabaseService } from '../../../database/database.service';
import { SISGEAAutorizacaoConnectContainerService } from '../../../sisgea-autorizacao-connect-container/sisgea-autorizacao-connect-container.service';
import { ActorContext } from '../../actor-context';

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

export const ResolveActorContext = (options?: any) => SisgeaRequestUserGql(options, ResolveActorContextPipe);
