import { DynamicModule, Module, Provider } from '@nestjs/common';

const OAuthClient = require('intuit-oauth');
const NodeQuickbooks = require('node-quickbooks');

// OAuth
import { IntuitOAuthController } from './oauth/oauth.controller';
import { IntuitTokenService } from './oauth/token.service';
import { IntuitConfig, IntuitPersistence } from './types';

@Module({
  controllers: [IntuitOAuthController],
  providers: [IntuitTokenService],
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
      ],
    };
  }
}
