import { Module } from '@nestjs/common';
import { MessageBrokerModule } from '../message-broker/message-broker.module';
import { DBEventsService } from './db-events.service';
import { DBPubSubContainerService } from './db-pub-sub-container.service';

@Module({
  imports: [
    //
    MessageBrokerModule,
  ],
  providers: [
    //
    DBEventsService,
    DBPubSubContainerService,
  ],
  exports: [
    //
    DBEventsService,
    DBPubSubContainerService,
  ],
})
export class DBEventsModule {}
