import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { SisgeaNestAuthConnectModule } from '@sisgea/nest-auth-connect';
import { AuthenticatedGqlGuard } from '@sisgea/nest-auth-connect/dist/modules/sisgea-nest-auth-protect/gql';
import { GqlExceptionFilter } from '../infrastructure/api-app/filters/GqlExceptionFilter';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { DBEventsModule } from '../infrastructure/db-events/db-events.module';
import { EnvironmentConfigModule } from '../infrastructure/environment-config';
import { ActorContextModule } from '../infrastructure/iam/actor-context';
import { MessageBrokerModule } from '../infrastructure/message-broker/message-broker.module';
import { SISGEAAutorizacaoConnectContainerModule } from '../infrastructure/sisgea-autorizacao-connect-container/sisgea-autorizacao-connect-container.module';
import { SisgeaNestAuthConnectConfigModule } from '../infrastructure/sisgea-nest-auth-connect-config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SisghaCursoModule } from './modules/sisgha-curso/sisgha-curso.module';
import { SisghaModalidadeModule } from './modules/sisgha-modalidade/sisgha-modalidade.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),

    ScheduleModule.forRoot(),

    EnvironmentConfigModule,

    //

    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,

      autoSchemaFile: true,

      introspection: true,

      cache: new InMemoryLRUCache({
        // ~100MiB
        maxSize: Math.pow(2, 20) * 100,
        // 5 minutes (in milliseconds)
        ttl: 5 * 60 * 1000,
      }),
    }),

    //

    SisgeaNestAuthConnectConfigModule,
    SisgeaNestAuthConnectModule,

    //

    SISGEAAutorizacaoConnectContainerModule,

    //

    DatabaseModule,
    //

    MessageBrokerModule,
    DBEventsModule,

    //

    ActorContextModule,

    //

    SisghaModalidadeModule,
    SisghaCursoModule,
  ],

  controllers: [
    //
    AppController,
  ],
  providers: [
    //
    {
      provide: APP_GUARD,
      useClass: AuthenticatedGqlGuard,
    },

    {
      provide: APP_FILTER,
      useClass: GqlExceptionFilter,
    },

    AppService,
  ],
})
export class AppModule {}
