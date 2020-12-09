# IntuitSdk

Easily integrate your Nestjs server with Intuit QuickBooks. This library supports

- OAuth2.0
- Intuit REST API
- Webhooks

Under the hood we utilize 2 Intuit sponsored libraries, specifically for OAuth and the Intuit REST API.

## Quick Start

```
$ npm i @intuit-sdk/nestjs
```

```typescript
import { Module } from '@nestjs/common';

import { IntuitNestModule } from '@intuit-sdk/nest';

/**
 * You the developer, must declare 2 objects in order for the IntuitNestModule to function properly.
 *
 * - Config
 * - Persistance Service
 *
 * For brevity these objects are shown in the app.module.ts file, you'll likely
 * want to store them in a separate file and import.
 */

/**
 * Config
 *
 * Store these values in the process or however else you manage your environment.
 *
 * ClientId, ClientSecret and VerifierToken may be found at the Intuit Developer
 * Portal -> https://developer.intuit.com/app/developer/dashboard
 *
 * Make sure you diferentiate between the development and production keys.
 *
 * The path for the oauth redirect route is /intuit/oauth/redirect
 */
export const config: IntuitConfig = {
  clientId: process.env.INTUIT_CLIENT_ID,
  clientSecret: process.env.INTUIT_CLIENT_SECRET,
  verifierToken: process.env.INTUIT_VERIFIER_TOKEN, // used to verify the webhook
  redirectUri: process.env.INTUIT_REDIRECT_URI,
  environment: process.env.INTUIT_ENVIRONMENT as 'sandbox' | 'production',
  frontEndRedirectUri: process.env.INTUIT_FRONT_END_REDIRECT_URI,
  syncModule: true, // conditionally include the sync routes and service, maybe you only utilize these routes on your local machine, idk
};

/**
 * Persistance Service
 *
 * Implement these 4 async functions.
 *
 * - async saveToken(token: OAuthToken)
 * - async getToken(): Promise<OAuthToken>
 * - async create(entityName: string, entity: any)
 * - async update(entityName: string, entity)
 *
 * If your IntuitPersistenceService relies on other services, ensure they are
 * exported from a module with the @Global decorator
 */
@Injectable()
export class IntuitPersistenceService implements IntuitPersistence {
  private tokenPath = 'intuit/authToken';
  constructor(
    @Inject('Firestore') private firestore: admin.firestore.Firestore
  ) {}

  async saveToken(token: OAuthToken) {
    await this.firestore.doc(this.tokenPath).set(token);
  }
  async getToken() {
    try {
      const snapshot = await this.firestore.doc(this.tokenPath).get();
      if (snapshot.exists) {
        const token = snapshot.data() as OAuthToken;
        return token;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async create(entityName: string, entity: any) {
    try {
      await this.firestore.collection(entityName).doc(entity.Id).set(entity);
    } catch (err) {}
  }
  async update(entityName: string, entity: any) {
    try {
      await this.firestore.collection(entityName).doc(entity.Id).update(entity);
    } catch (err) {}
  }
}

@Module({
  imports: [
    SharedModule, // This is a gloabl module and exports `Firestore`
    IntuitNestModule.register(config, IntuitPersistenceService),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

## TODO

- Ensure the oauth redirect is coming from intuit
- OAuth scope should be configurable, either via the module import and/or per request.
- Dependencies of the IntuitPersitance service can be passed in with the IntuitNestModule import, instead of requiring those dependencies be declared in a global module
- Sync operations send back a SyncReport, indicating how many entities were synced and if there were any failures or errors.
