import { DynamicModule, Module, Provider } from '@nestjs/common';

const OAuthClient = require('intuit-oauth');
const NodeQuickbooks = require('node-quickbooks');

// OAuth
import { IntuitOAuthController } from './oauth/oauth.controller';
import { IntuitTokenService } from './oauth/token.service';
// Intuit API
import { IntuitApiClientService } from './api-client/intuit-api.service';
// Webhook
import { IntuitWebhookController } from './webhook/webhook.controller';
import { IntuitWebhookService } from './webhook/webhook.service';
// Sync
import { IntuitSyncController } from './sync/sync.controller';
import { IntuitSyncService } from './sync/sync.service';
// Utils
import { IntuitConfig, IntuitPersistence } from './types';
import { IntuitOAuthClient, NodeQuickbooksClient } from './tokens';

/**
 * Intuit OAuth Provider
 */
const intuitOAuthProvider: Provider = {
  provide: IntuitOAuthClient,
  useFactory: (config: IntuitConfig) => {
    const _client = new OAuthClient({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      environment: config.environment,
      redirectUri: config.redirectUri,
    });
    // console.log(_client);
    return _client;
  },
  inject: ['IntuitConfig'],
};
/**
 * Node Quickbooks Provider
 */
const nodeQuickbooksProvider: Provider = {
  provide: NodeQuickbooksClient,
  useFactory: async (
    tokenService: IntuitTokenService,
    config: IntuitConfig
  ) => {
    console.log('Do we even run');
    try {
      const token = await tokenService.fetchToken();
      console.log(`The token is: ${token}`);
      return new NodeQuickbooks(
        config.clientId,
        config.clientSecret,
        token.access_token || null,
        false, // no token secret for oauth2.0
        token.realmId || null,
        config.environment === 'sandbox' ? true : false,
        false,
        null,
        '2.0',
        token.refresh_token || null
      );
    } catch (err) {
      console.log(`The error is: ${err}`);
      return new NodeQuickbooks(
        config.clientId,
        config.clientSecret,
        null,
        false, // no token secret for oauth2.0
        null,
        config.environment === 'sandbox' ? true : false,
        false, // enable debugging
        null,
        '2.0',
        null
      );
    }
  },
  inject: [IntuitTokenService, 'IntuitConfig'],
};

@Module({
  controllers: [IntuitOAuthController, IntuitWebhookController],
  providers: [IntuitTokenService, IntuitApiClientService, IntuitWebhookService],
})
export class IntuitNestModule {
  static register(
    config: IntuitConfig,
    persistenceProvider: Provider<IntuitPersistence>
  ): DynamicModule {
    return {
      module: IntuitNestModule,
      controllers: [config.syncModule ? IntuitSyncController : null],
      providers: [
        {
          provide: 'IntuitConfig',
          useValue: config,
        },
        intuitOAuthProvider,
        nodeQuickbooksProvider,
        persistenceProvider,
        {
          provide: 'IntuitPersistence',
          useExisting: persistenceProvider,
        },
        config.syncModule ? IntuitSyncService : null,
      ],
    };
  }
}
