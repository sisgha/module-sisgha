import { Provider } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { SISGEAAutorizacaoConnectContainerService } from '../../../sisgea-autorizacao-connect-container/sisgea-autorizacao-connect-container.service';
import { ActorContext } from '../actor-context';

export const ACTOR_CONTEXT_SYSTEM = Symbol();

export const actorContextSystemProvider: Provider = {
  provide: ACTOR_CONTEXT_SYSTEM,

  useFactory: async (
    //
    databaseService: DatabaseService,
    sisgeaAutorizacaoClientService: SISGEAAutorizacaoConnectContainerService,
  ) => {
    const dataSource = await databaseService.getAppDataSource();
    return ActorContext.forSystem(dataSource, sisgeaAutorizacaoClientService);
  },

  inject: [
    //
    DatabaseService,
    SISGEAAutorizacaoConnectContainerService,
  ],
};
