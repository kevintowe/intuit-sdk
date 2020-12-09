import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

import { IntuitWebhookService } from './webhook.service';
import { IntuitConfig, IntuitWebhookNotification } from '../types';

@Controller('intuit/webhook')
export class IntuitWebhookController {
  constructor(
    private webhookService: IntuitWebhookService,
    @Inject('IntuitConfig') private config: IntuitConfig
  ) {}

  @Post()
  webhook(@Req() req: Request, @Res() res: Response) {
    const webhookPayload = JSON.stringify(req.body);
    const signature = req.get('intuit-signature');

    // if signature is empty return 401
    if (!signature) return res.status(401).send('FORBIDDEN');

    // if payload is empty, don't do anything
    if (!webhookPayload) return res.status(200).send('SUCCESS');

    // Validate the payload with the intuit-signature hash
    const hash = crypto
      .createHmac('sha256', this.config.verifierToken)
      .update(webhookPayload)
      .digest('base64');

    if (signature !== hash) return res.status(401).send('FORBIDDEN');

    for (let i = 0; i < req.body.eventNotifications.length; i++) {
      const entities = req.body.eventNotifications[i].dataChangeEvent.entities;
      const realmId = req.body.eventNotifications[i].realmId;
      for (let j = 0; j < entities.length; j++) {
        const notification: IntuitWebhookNotification = {
          realmId: realmId,
          name: entities[i].name,
          id: entities[i].id,
          operation: entities[i].operation,
          lastUpdated: entities[i].lastUpdated,
        };
        // console.log(notification);
        this.webhookService.handleWebhookNotification(notification);
      }
    }
    return res.status(200).send('SUCCESS');
  }
}
