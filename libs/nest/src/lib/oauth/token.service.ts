import { Inject, Injectable } from '@nestjs/common';

import { IntuitPersistence, OAuthToken } from '../types';
import { buildToken } from '../utils';
import { IntuitOAuthClient, NodeQuickbooksClient } from '../tokens';

@Injectable()
export class IntuitTokenService {
  constructor(
    @Inject('IntuitPersistence') private persistence: IntuitPersistence,
    @Inject(IntuitOAuthClient) private oauthClient: any // @Inject(NodeQuickbooksClient) private nodeQuickbooks: any
  ) {}

  /**
   * verifies token validity and refreshes if necessary
   */
  async fetchToken() {
    console.log('About to fetch the token');
    try {
      const token = await this.persistence.getToken();
      console.log(`The token is ${token}`);
      if (!token) return null;

      this.oauthClient.setToken(token);
      console.log(
        `The Intuit OAuth Token is: ${this.oauthClient.isAccessTokenValid()}`
      );
      if (this.oauthClient.isAccessTokenValid()) return token;
      else return this.refreshToken(token);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * refresh -> persist --> and then return the new token.
   */
  private async refreshToken(oldToken: OAuthToken) {
    console.log('About to refresh the token');
    return this.oauthClient
      .refreshUsingToken(oldToken.refresh_token)
      .then(async (authResponse: any) => {
        const newToken = buildToken(authResponse);
        // this.oauthClient.setToken(newToken);
        // this.nodeQuickbooks.token = newToken.access_token;
        // this.nodeQuickbooks.realmId = newToken.realmId;
        // this.nodeQuickbooks.refreshToken = newToken.refresh_token;
        try {
          await this.persistence.saveToken(newToken);
          console.log('Token successfully refreshed');

          return newToken;
        } catch (err) {
          console.log(err);
        }
      }) as OAuthToken;
  }
}
