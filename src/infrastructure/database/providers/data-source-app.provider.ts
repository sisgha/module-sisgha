import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { APP_DATA_SOURCE_TOKEN } from '../tokens/APP_DATA_SOURCE_TOKEN';
import { EnvironmentConfigService } from '../../environment-config/environment-config.service';

export const dataSourceAppProvider: Provider = {
  provide: APP_DATA_SOURCE_TOKEN,

  useFactory: async (environmentConfigService: EnvironmentConfigService) => {
    const options = environmentConfigService.getTypeORMAppDataSourceOptions();

    const dataSource = new DataSource(options);

    console.log('[INFO] app data source created.');

    console.log('[INFO] initializing app data source...');

    const initializePromise = dataSource.initialize();

    initializePromise
      .then(() => {
        console.log('[INFO] app data source initialized.');
      })
      .catch(() => {
        console.log('[INFO] app data source can not be initialized.');
      });

    return initializePromise;
  },

  inject: [EnvironmentConfigService],
};
