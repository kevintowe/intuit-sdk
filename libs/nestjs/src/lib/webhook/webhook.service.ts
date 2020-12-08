import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { IntuitApiClientService } from '../api-client/api-client.service';
import { IntuitWebhookNotification } from '../intuit-types';
import { databaseName, prepEntityName } from '../util';
import { IntuitWebhookController } from './webhook.controller';

@Injectable()
export class WebhookService {
  constructor(
    @Inject('IntuitApiClient') private apiClient: any,
    @Inject('Firestore') private firestore: admin.firestore.Firestore,
    private apiClientService: IntuitApiClientService
  ) {}

  async handleWebhookNotification(notification: IntuitWebhookNotification) {
    console.log(notification);
    switch (notification.operation) {
      case 'Create':
        await this.create(notification);
        break;

      case 'Update':
        await this.update(notification);
        break;

      case 'Void':
        await this.void(notification);
        break;

      case 'Merge':
        await this.merge(notification);
        break;

      case 'Emailed':
        await this.emailed(notification);
        break;

      case 'Delete':
        await this.delete(notification);
        break;

      default:
        break;
    }
  }

  private async create(notification: IntuitWebhookNotification) {
    await this.ref(notification).set(
      await this.apiClientService.read(notification.name, notification.id)
    );
  }

  private async update(notification: IntuitWebhookNotification) {
    await this.ref(notification).set(
      await this.apiClientService.read(notification.name, notification.id)
    );
  }

  private async delete(notification: IntuitWebhookNotification) {}

  private async void(notification: IntuitWebhookNotification) {}

  private async merge(notification: IntuitWebhookNotification) {}

  private async emailed(notification: IntuitWebhookNotification) {}

  private ref(notification: IntuitWebhookNotification) {
    return this.firestore.doc(
      `${prepEntityName(databaseName(notification.name))}/${notification.id}`
    );
  }
}
