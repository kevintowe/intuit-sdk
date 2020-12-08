import { Inject, Injectable } from '@nestjs/common';

import { IntuitPersistence, OAuthToken } from '../types';
import { buildToken } from '../utils';

@Injectable()
export class TestService {}

@Injectable()
export class IntuitTokenService {
  constructor(
    @Inject('IntuitPersistence') private persistence: IntuitPersistence,
    @Inject('IntuitOAuthClient') private oauthClient: any
  ) {}

  /**
   * verifies token validity and refreshes if necessary
   */
  async fetchToken() {
    const token = await this.persistence.getToken();

    if (!token) return null;
    console.log(`The Intuit OAuth Token is: ${this.isValidToken(token)}`);

    if (this.isValidToken(token)) return token;
    else return this.refreshToken(token);
  }

  /**
   * refresh -> persist --> and then return the new token.
   */
  private async refreshToken(oldToken: OAuthToken) {
    this.oauthClient.setToken(oldToken);
    return this.oauthClient
      .refreshUsingToken(oldToken.refresh_token)
      .then(async (authResponse: any) => {
        const newToken = buildToken(authResponse);
        this.oauthClient.setToken(newToken);
        try {
          await this.persistence.saveToken(newToken);
          return newToken;
        } catch (err) {
          console.log(err);
        }
      }) as OAuthToken;
  }

  /**
   * TODO, let the intuit oauth library handle this
   */
  private isValidToken(token: OAuthToken) {
    const expiration = token.createdAt + token.expires_in * 1000;
    return expiration > Date.now() ? true : false;
  }
}