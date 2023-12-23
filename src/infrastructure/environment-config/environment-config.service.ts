import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISISGEANestSSOConfigKeyCloakCredentials, ISISGEANestSSOConfigOIDCClientCredentials } from '@sisgea/sso-nest-client';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import { IConfig } from '../../domain';

@Injectable()
export class EnvironmentConfigService implements IConfig {
  constructor(
    // ...
    private configService: ConfigService,
  ) {}

  getSISGEAAutorizacaoGRPCServer(): string | null {
    const url = this.configService.get<string | string>('SISGEA_AUTORIZACAO_GRPC_SERVER') ?? null;
    return url;
  }

  getRuntimePort(): number {
    const configPort = this.configService.get<number | string>('PORT') ?? null;

    if (configPort !== null) {
      const configPortAsNumber = parseInt(String(configPort));

      if (!Number.isNaN(configPortAsNumber)) {
        return configPortAsNumber;
      }
    }

    return 3471;
  }

  getRuntimeNodeEnv(): string {
    const runtimeNodeEnv = (this.configService.get<string>('NODE_ENV') ?? 'production').trim().toLocaleLowerCase();

    return runtimeNodeEnv;
  }

  getRuntimeIsProduction(): boolean {
    return this.getRuntimeNodeEnv() === 'production';
  }

  getRuntimeIsDevelopment(): boolean {
    return !this.getRuntimeIsProduction();
  }

  getTypeORMBasePath(): string {
    return join(__dirname, '..', 'database');
  }

  getTypeORMPathEntities(): string {
    return join(this.getTypeORMBasePath(), 'entities');
  }

  getTypeORMPathMigrations(): string {
    return join(this.getTypeORMBasePath(), 'migrations');
  }

  getTypeORMPathSeeds(): string {
    return join(this.getTypeORMBasePath(), 'seeds');
  }

  getTypeORMPathSubscribers(): string {
    return join(this.getTypeORMBasePath(), 'subscribers');
  }

  // ...

  getDBDatabase(): string | undefined {
    return this.configService.get<string>('DB_DATABASE');
  }

  getDBHost(): string | undefined {
    return this.configService.get<string>('DB_HOST');
  }

  getDBPassword(): string | undefined {
    return this.configService.get<string>('DB_PASSWORD');
  }

  getDBPort(): string | undefined {
    return this.configService.get<string>('DB_PORT');
  }

  getDBSchema(): string | undefined {
    return this.configService.get<string>('DB_SCHEMA');
  }

  getDBUsername(): string | undefined {
    return this.configService.get<string>('DB_USERNAME');
  }

  getDBConnection(): string | undefined {
    return this.configService.get<string>('DB_CONNECTION');
  }

  getDBUrl(): string | undefined {
    return this.configService.get<string>('DATABASE_URL');
  }

  getDBUseSSL(): string | undefined {
    return this.configService.get<string>('DATABASE_USE_SSL');
  }

  getTypeORMLogging(): string | undefined {
    return this.configService.get<string>('TYPEORM_LOGGING');
  }

  getTypeORMSharedDataSourceOptions(): Partial<DataSourceOptions> {
    const sharedEnvConfig = {};

    const DB_CONNECTION = this.getDBConnection();

    if (DB_CONNECTION !== undefined) {
      const DB_HOST = this.getDBHost();
      const DB_PORT = this.getDBPort();
      const DB_USERNAME = this.getDBUsername();
      const DB_PASSWORD = this.getDBPassword();
      const DB_DATABASE = this.getDBDatabase();
      const DB_SCHEMA = this.getDBSchema();

      const TYPEORM_LOGGING = this.getTypeORMLogging();

      const DATABASE_URL = this.getDBUrl();
      const DATABASE_USE_SSL = this.getDBUseSSL();

      Object.assign(sharedEnvConfig, {
        type: DB_CONNECTION,

        host: DB_HOST,
        port: DB_PORT && parseInt(DB_PORT),

        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        schema: DB_SCHEMA,

        synchronize: false,

        logging: TYPEORM_LOGGING,
      } as Partial<DataSourceOptions>);

      if (DATABASE_URL) {
        Object.assign(sharedEnvConfig, {
          url: DATABASE_URL,
        });
      }

      if (DATABASE_USE_SSL !== 'false') {
        Object.assign(sharedEnvConfig, {
          options: {
            validateConnection: false,
            trustServerCertificate: true,
          },

          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
        });
      }
    }

    return {
      ...sharedEnvConfig,
    };
  }

  getTypeORMAppDataSourceOptions(): DataSourceOptions {
    const options = {
      ...this.getTypeORMSharedDataSourceOptions(),
      entities: [`${this.getTypeORMPathEntities()}/**/*{.ts,.js}`],
      subscribers: [`${this.getTypeORMPathSubscribers()}/**/*{.ts,.js}`],
    };

    return options as DataSourceOptions;
  }

  getTypeORMMigrationDataSourceOptions(): DataSourceOptions {
    const options = {
      ...this.getTypeORMSharedDataSourceOptions(),
      migrations: [`${this.getTypeORMPathMigrations()}/**/*{.ts,.js}`],
      migrationsTableName: 'app_migration_db',
    };

    return options as DataSourceOptions;
  }

  getTypeORMSeedDataSourceOptions(): DataSourceOptions {
    const options = {
      ...this.getTypeORMSharedDataSourceOptions(),
      entities: [`${this.getTypeORMPathEntities()}/**/*{.ts,.js}`],
      migrations: [`${this.getTypeORMPathSeeds()}/**/*{.ts,.js}`],
      migrationsTableName: 'app_migration_seed',
    };

    return options as DataSourceOptions;
  }

  //

  getOIDCClientClientId(): string | undefined {
    return this.configService.get<string>('OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_ID');
  }

  getOIDCClientClientSecret(): string | undefined {
    return this.configService.get<string>('OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_SECRET');
  }

  getOIDCClientIssuer(): string | undefined {
    return this.configService.get<string>('OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER');
  }

  getOIDCClientCredentials(): ISISGEANestSSOConfigOIDCClientCredentials {
    const issuer = this.getOIDCClientIssuer();
    const clientId = this.getOIDCClientClientId();
    const clientSecret = this.getOIDCClientClientSecret();

    if (issuer === undefined || clientId === undefined || clientSecret === undefined) {
      throw new Error('Please provide correct OAUTH2_CLIENT credentials.');
    }

    return {
      issuer,
      clientId,
      clientSecret,
    };
  }

  //

  getKeyCloakConfigCredentials(): ISISGEANestSSOConfigKeyCloakCredentials {
    throw new Error('getKeyCloakConfigCredentials: not implemented.');
  }

  //

  getMessageBrokerConnectionURL(): string | undefined {
    return this.configService.get<string>('MESSAGE_BROKER_CONNECTION_URL');
  }

  //
}
