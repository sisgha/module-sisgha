import { PgPubSub } from '@imqueue/pg-pubsub';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { DBEventDbEntity } from '../database/entities/db_event.db.entity';
import { MessageBrokerService } from '../message-broker/message-broker.service';
import { DBPubSubContainerService } from './db-pub-sub-container.service';

@Injectable()
export class DBEventsService implements OnApplicationBootstrap {
  #pubSub: PgPubSub | null = null;

  #syncLock = false;
  #lastSync: Date | null = null;
  #syncTickTimeout: NodeJS.Timeout | null = null;

  constructor(
    //
    private databaseService: DatabaseService,
    private messageBrokerService: MessageBrokerService,
    private dbPubSubContainerService: DBPubSubContainerService,
  ) {}

  onApplicationBootstrap() {
    this.setup();
  }

  async setup() {
    this.#pubSub = await this.dbPubSubContainerService.createPubSubInstance();

    const CHANNEL = 'dbEvent';
    this.#pubSub.channels.on(CHANNEL, () => void this.performSync());

    this.#pubSub.on('connect', async () => {
      await this.#pubSub!.listen(CHANNEL);
    });

    this.#pubSub.connect().catch((err) => console.error('[db pub sub] Connection error:', err));

    this.performTick();
  }

  async performTick() {
    if (this.#syncTickTimeout !== null) {
      clearTimeout(this.#syncTickTimeout);
      this.#syncTickTimeout = null;
    }

    if (this.#lastSync === null || Date.now() - this.#lastSync.getTime() > 30 * 1000) {
      await this.performSync();
    }

    this.#syncTickTimeout = setTimeout(() => this.performTick(), 30000);
  }

  async performSync() {
    if (this.#syncLock) {
      return;
    }

    this.#syncLock = true;

    try {
      const databaseContext = await this.databaseService.getDatabaseContextApp();
      const dbEventsRepository = databaseContext.dbEventRepository;

      const getDbEventIdIterable = async function* () {
        let count = 0;

        do {
          const dbEvents = await dbEventsRepository //
            .createQueryBuilder('db_event')
            .select(['db_event.id'])
            .limit(20)
            .getMany();

          for (const dbEvent of dbEvents) {
            yield dbEvent.id;
          }

          count = await databaseContext.dbEventRepository.createQueryBuilder('db_event').select(['db_event.id']).getCount();
        } while (count > 0);
      };

      const dbEventIdIterable = getDbEventIdIterable();

      for await (const dbEventId of dbEventIdIterable) {
        const handled = await this.handleDbEvent(dbEventId);

        if (!handled) {
          console.warn(`could not deliver db event (id: ${dbEventId}) => forcing tick end.`);
          break;
        }
      }
    } finally {
      this.#syncLock = false;
      this.#lastSync = new Date();
    }
  }

  async handleDbEvent(dbEventId: DBEventDbEntity['id']) {
    const databaseContext = await this.databaseService.getDatabaseContextApp();
    const dbEventRepository = databaseContext.dbEventRepository;

    const dbEvent = await dbEventRepository //
      .createQueryBuilder('db_event')
      .select('db_event')
      .where('db_event.id = :id', { id: dbEventId })
      .getOne();

    if (dbEvent) {
      const wasDelivered = await this.messageBrokerService.publishDbEvent(dbEvent);

      if (wasDelivered) {
        await dbEventRepository //
          .createQueryBuilder()
          .delete()
          .from(DBEventDbEntity)
          .where('id = :id', { id: dbEvent.id })
          .execute();

        return true;
      }
    }

    return false;
  }
}
