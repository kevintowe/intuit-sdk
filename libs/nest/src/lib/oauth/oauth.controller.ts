import { Controller, Get, Inject, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
const OAuthClient = require('intuit-oauth');

import { IntuitConfig, IntuitPersistence } from '../types';
import { buildToken } from '../utils';

@Controller('intuit/oauth')
export class IntuitOAuthController {
  constructor(
    @Inject('IntuitOAuthClient') private oauthClient: any,
    @Inject('IntuitPersistence') private intuitPersistence: IntuitPersistence,
    @Inject('IntuitConfig') private config: IntuitConfig,
    @Inject('NodeQuickbooks') private nodeQuickbooks: any
  ) {}

  @Get('authorize')
  authorize(@Res() res: Response) {
    const authUri = this.oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.Accounting],
      state: null,
    });
    res.redirect(authUri);
  }

  @Get('redirect')
  redirect(@Req() req: Request, @Res() res: Response) {
    const parseRedirect = req.url;

    // TODO, validate the request is from Intuit

    try {
      this.oauthClient
        .createToken(parseRedirect)
        .then(async (authResponse: any) => {
          const token = buildToken(authResponse);

          this.nodeQuickbooks.token = token.access_token;
          this.nodeQuickbooks.realmId = token.realmId;
          this.nodeQuickbooks.refreshToken = token.refresh_token;
          try {
            await this.intuitPersistence.saveToken(token);
            res.redirect(this.config.frontEndRedirectUri);
          } catch (err) {}
        });
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
