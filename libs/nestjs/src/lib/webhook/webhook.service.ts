import { Inject, Injectable } from '@nestjs/common';

import { IntuitApiClientService } from '../api-client';
import { IntuitPersistence, IntuitWebhookNotification } from '../types';
import { databaseName, prepEntityName } from '../utils';

@Injectable()
export class IntuitWebhookService {
  constructor(
    private apiClient: IntuitApiClientService,
    @Inject('IntuitPersistence') private persistence: IntuitPersistence
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
    await this.persistence.create<any>(
      prepEntityName(databaseName(notification.name)),
      await this.apiClient.read(notification.name, notification.id)
    );
  }

  private async update(notification: IntuitWebhookNotification) {
    await this.persistence.update<any>(
      prepEntityName(databaseName(notification.name)),
      await this.apiClient.read(notification.name, notification.id)
    );
  }

  private async delete(notification: IntuitWebhookNotification) {}

  private async void(notification: IntuitWebhookNotification) {}

  private async merge(notification: IntuitWebhookNotification) {}

  private async emailed(notification: IntuitWebhookNotification) {}
}
