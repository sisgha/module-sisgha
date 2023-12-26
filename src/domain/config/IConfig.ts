import { ISisgeaNestAuthConnectConfig } from '@sisgea/nest-auth-connect';
import { IConfigDatabase } from './IConfigDatabase';
import { IConfigMessageBroker } from './IConfigMessageBroker';
import { IConfigRuntime } from './IConfigRuntime';
import { IConfigSISGEAAutorizacao } from './IConfigSISGEAAutorizacao';
import { IConfigTypeORM } from './IConfigTypeORM';
import { IConfigTypeORMDataSources } from './IConfigTypeORMDataSources';

export interface IConfig
  extends IConfigRuntime,
    IConfigDatabase,
    IConfigTypeORM,
    IConfigTypeORMDataSources,
    ISisgeaNestAuthConnectConfig,
    IConfigMessageBroker,
    IConfigSISGEAAutorizacao {}
