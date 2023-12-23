import { Injectable, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { UsuarioCanRequest, SISGEAAutorizacaoConnect, GenericCanRequest } from '@sisgea/autorizacao-client';
import { Channel, createChannel, waitForChannelReady } from 'nice-grpc';
import { EnvironmentConfigService } from '../environment-config';
import { ActorUser } from '../iam/authentication';
import { IAuthenticatedEntityType, IActor } from '../../domain';

const onPromiseError = () => Promise.reject(new ServiceUnavailableException());

@Injectable()
export class SISGEAAutorizacaoConnectContainerService {
  #channel: Channel | null = null;

  constructor(private configService: EnvironmentConfigService) {}

  async setupChannel() {
    if (this.#channel === null) {
      const url = this.configService.getSISGEAAutorizacaoGRPCServer();

      if (url !== null) {
        this.#channel = createChannel(url);
        await waitForChannelReady(this.#channel, new Date(Date.now() + 100000));
      } else {
        throw new InternalServerErrorException();
      }
    }

    return this.#channel;
  }

  async getSISGEAAutorizacaoConnect() {
    const channel = await this.setupChannel();
    return new SISGEAAutorizacaoConnect(channel);
  }

  async getCheckServiceClient() {
    const sisgeaAutorizacaoConnect = await this.getSISGEAAutorizacaoConnect();

    await sisgeaAutorizacaoConnect.connect().catch(onPromiseError);

    const checkServiceClient = sisgeaAutorizacaoConnect.getCheckServiceClient();

    return checkServiceClient;
  }

  async checkInternalSystemCan(canRequest: GenericCanRequest) {
    const checkServiceClient = await this.getCheckServiceClient();
    const { can } = await checkServiceClient.internalSystemCan(canRequest).catch(onPromiseError);
    return can;
  }

  async checkAnonymousCan(canRequest: GenericCanRequest) {
    const checkServiceClient = await this.getCheckServiceClient();
    const { can } = await checkServiceClient.anonymousCan(canRequest).catch(onPromiseError);
    return can;
  }

  async checkUsuarioCan(canRequest: UsuarioCanRequest) {
    const checkServiceClient = await this.getCheckServiceClient();
    const { can } = await checkServiceClient.usuarioCan(canRequest).catch(onPromiseError);
    return can;
  }

  async checkActorCan(actor: IActor, canRequest: GenericCanRequest) {
    if (actor instanceof ActorUser) {
      const usuarioId = actor.userRef.id;

      return this.checkUsuarioCan({
        ...canRequest,
        usuarioId,
      });
    }

    switch (actor.type) {
      case IAuthenticatedEntityType.INTERNAL_SYSTEM: {
        return this.checkInternalSystemCan(canRequest);
      }

      case IAuthenticatedEntityType.ANONONYMOUS: {
        return this.checkAnonymousCan(canRequest);
      }

      default: {
        return false;
      }
    }
  }
}
