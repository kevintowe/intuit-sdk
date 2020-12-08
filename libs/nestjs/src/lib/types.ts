export interface OAuthToken {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  x_refresh_token_expires_in: number;
  id_token: string;
  createdAt: number;
  realmId: string;
}
