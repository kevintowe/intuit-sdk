import { DynamicModule, Module, Provider } from '@nestjs/common';

const OAuthClient = require('intuit-oauth');
const NodeQuickbooks = require('node-quickbooks');

// OAuth
import { IntuitOAuthController } from './oauth';
import { IntuitTokenService, TestService } from './oauth/token.service';
// Webhook
import { IntuitWebhookController, IntuitWebhookService } from './webhook';
// Api Client
import { IntuitApiClientService } from './api-client';

// utils
import { IntuitConfig, IntuitPersistence } from './types';

@Module({
  controllers: [IntuitOAuthController],
  providers: [IntuitTokenService],
})
export class IntuitModule {
  static register(
    intuitConfig: IntuitConfig
    // persistenceService: Provider<IntuitPersistence>
  ): DynamicModule {
    return {
      module: IntuitModule,
      /**
       *  custom providers
       */
      providers: [
        {
          provide: 'IntuitConfig',
          useValue: intuitConfig,
        },
        {
          provide: 'IntuitOAuthClient',
          useFactory: (config: IntuitConfig) => {
            return new OAuthClient({
              clientId: config.clientId,
              clientSecret: config.clientSecret,
              environment: config.environment,
              redirectUri: config.redirectUri,
            });
          },
          inject: ['IntuitConfig'],
        },
        // persistenceService,
        {
          provide: 'IntuitPersistence',
          useValue: null,
          // useExisting: persistenceService,
        },

        // {
        //   provide: 'NodeQuickbooks',
        //   useFactory: async (tokenService: IntuitTokenService) => {
        //     const token = await tokenService.fetchToken();

        //     if (!token) {
        //       return new NodeQuickbooks(
        //         intuitConfig.clientId,
        //         intuitConfig.clientSecret,
        //         null,
        //         false, // no token secret for oauth2.0
        //         null,
        //         intuitConfig.environment === 'sandbox' ? true : false,
        //         false, // enable debugging
        //         null,
        //         '2.0',
        //         null
        //       );
        //     } else {
        //       return new NodeQuickbooks(
        //         intuitConfig.clientId,
        //         intuitConfig.clientSecret,
        //         token.access_token || null,
        //         false, // no token secret for oauth2.0
        //         token.realmId || null,
        //         intuitConfig.environment === 'sandbox' ? true : false,
        //         false,
        //         null,
        //         '2.0',
        //         token.refresh_token || null
        //       );
        //     }
        //   },
        //   inject: [IntuitTokenService],
        // },
      ],
    };
  }
}
