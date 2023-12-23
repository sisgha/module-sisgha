import { PgPubSub } from '@imqueue/pg-pubsub';
import { Injectable } from '@nestjs/common';
import { EnvironmentConfigService } from '../environment-config';

@Injectable()
export class DBPubSubContainerService {
  constructor(
    //
    private environmentConfigService: EnvironmentConfigService,
  ) {}

  async createPubSubInstance() {
    return DBPubSubContainerService.createPubSubInstance(this.environmentConfigService);
  }

  static async createPubSubInstance(environmentConfigService: EnvironmentConfigService) {
    const url = environmentConfigService.getDBUrl() ?? null;

    if (url) {
      const pubSub = new PgPubSub({ connectionString: url, singleListener: true });

      pubSub.on('listen', (channel) => console.info(`[db pub sub] Listening to ${channel}...`));

      pubSub.on('connect', async () => {
        console.info('[db pub sub] Database connected!');
      });

      pubSub.on('end', () => console.warn('[db pub sub] Connection closed!'));

      return pubSub;
    } else {
      throw new TypeError('Please provide database connection URL.');
    }
  }
}
