import { DynamicModule, Module, Provider } from '@nestjs/common';

const OAuthClient = require('intuit-oauth');
const NodeQuickbooks = require('node-quickbooks');

// OAuth
import { IntuitOAuthController } from './oauth/oauth.controller';
import { IntuitTokenService } from './oauth/token.service';
import { IntuitApiClientService } from './api-client/intuit-api.service';
import { IntuitConfig, IntuitPersistence } from './types';
import { IntuitWebhookController } from './webhook/webhook.controller';
import { IntuitWebhookService } from './webhook/webhook.service';

@Module({
  controllers: [IntuitOAuthController, IntuitWebhookController],
  providers: [IntuitTokenService, IntuitApiClientService, IntuitWebhookService],
  exports: [],
})
export class IntuitNestModule {
  static register(
    config: IntuitConfig,
    persistenceProvider: Provider<IntuitPersistence>
  ): DynamicModule {
    return {
      module: IntuitNestModule,
      providers: [
        {
          provide: 'IntuitConfig',
          useValue: config,
        },
        {
          provide: 'IntuitOAuthClient',
          useValue: new OAuthClient({
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            environment: config.environment,
            redirectUri: config.redirectUri,
          }),
        },
        persistenceProvider,
        {
          provide: 'IntuitPersistence',
          useExisting: persistenceProvider,
        },
        {
          provide: 'NodeQuickbooks',
          useFactory: async (tokenService: IntuitTokenService) => {
            const token = await tokenService.fetchToken();

            if (!token) {
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
            } else {
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
            }
          },
          inject: [IntuitTokenService],
        },
      ],
    };
  }
}
