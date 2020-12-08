import { Module } from '@nestjs/common';

// controllers
import { IntuitOAuthController } from './oauth/oauth.controller';

// services
import { IntuitTokenService } from './oauth/token.service';

@Module({
  controllers: [IntuitOAuthController],
  providers: [IntuitTokenService],
  exports: [],
})
export class IntuitModule {}
