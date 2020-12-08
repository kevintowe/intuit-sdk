import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

import { WebhookService } from './webhook.service';
import { IntuitWebhookNotification } from '../intuit-types';

@Controller('intuit/webhook')
export class IntuitWebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post()
  webhook(@Req() req: Request, @Res() res: Response) {
    const webhookPayload = JSON.stringify(req.body);
    const signature = req.get('intuit-signature');

    const fields = ['realmId', 'name', 'id', 'operation', 'lastUpdated'];

    // if signature is empty return 401
    if (!signature) return res.status(401).send('FORBIDDEN');

    // if payload is empty, don't do anything
    if (!webhookPayload) return res.status(200).send('success');

    // Validate the payload with the intuit-signature hash
    const hash = crypto
      .createHmac('sha256', process.env.INTUIT_VERIFIER_TOKEN)
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
