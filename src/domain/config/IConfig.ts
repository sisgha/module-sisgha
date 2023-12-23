import { ISISGEANestSSOConfig } from '@sisgea/sso-nest-client';
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
    ISISGEANestSSOConfig,
    IConfigMessageBroker,
    IConfigSISGEAAutorizacao {}
