import { Controller, Get, Inject, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { buildToken } from '../utils';
const OAuthClient = require('intuit-oauth');
import { IntuitTokenService } from './token.service';

@Controller('intuit/oauth')
export class IntuitOAuthController {
  constructor(
    @Inject('IntuitOAuthClient') private oauthClient: any,
    @Inject('IntuitApiClient') private apiClient: any,
    private tokenService: IntuitTokenService
  ) {}

  @Get('authorize')
  authorize(@Res() res: Response) {
    const authUri = this.oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.Accounting],
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
          this.apiClient.token = token.access_token;
          this.apiClient.realmId = token.realmId;
          this.apiClient.refreshToken = token.refresh_token;
          try {
            await this.tokenService.persistToken(token);
            res.redirect('https://google.com');
          } catch (err) {}
        });
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
