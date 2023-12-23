import { Module } from '@nestjs/common';
import { MessageBrokerService } from './message-broker.service';
import { MessageBrokerContainerService } from './message-broker-container.service';

@Module({
  providers: [
    //
    MessageBrokerService,
    MessageBrokerContainerService,
  ],
  exports: [
    //
    MessageBrokerService,
    MessageBrokerContainerService,
  ],
})
export class MessageBrokerModule {}
