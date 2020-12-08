import { OAuthToken } from './types';

export function buildToken(authResponse: any) {
  const token: OAuthToken = {
    token_type: authResponse.token.token_type,
    access_token: authResponse.token.access_token,
    expires_in: authResponse.token.expires_in,
    refresh_token: authResponse.token.refresh_token,
    x_refresh_token_expires_in: authResponse.token.x_refresh_token_expires_in,
    id_token: authResponse.token.id_token,
    createdAt: Date.now(),
    realmId: authResponse.token.realmId,
  };
  return token;
}
