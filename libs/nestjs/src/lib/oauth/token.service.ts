import { Injectable } from '@nestjs/common';
import { OAuthToken } from '../types';

@Injectable()
export class IntuitTokenService {
  constructor() {}

  async persistToken(token: OAuthToken) {}
}
