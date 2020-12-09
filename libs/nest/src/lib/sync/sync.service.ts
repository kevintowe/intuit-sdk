import { Inject, Injectable } from '@nestjs/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { IntuitApiClientService } from '../api-client/intuit-api.service';

import { IntuitEntity, IntuitPersistence, IntuitSyncReport } from '../types';
import { databaseName } from '../utils';

@Injectable()
export class IntuitSyncService {
  constructor(
    @Inject('IntuitPersistence') private intuitPersistance: IntuitPersistence,
    private apiClient: IntuitApiClientService
  ) {}

  syncEntity(entity: IntuitEntity): Observable<IntuitSyncReport> {
    const limit = 100;
    let offset = 0;
    let status: 'active' | 'last' | 'done' = 'active';
    const dbReadyName = databaseName(entity);

    const source = new BehaviorSubject<IntuitSyncReport>({
      success: null,
      name: null,
      count: 0,
      pass: 0,
    });

    new Promise(async (resolve, reject) => {
      while (status !== 'done') {
        const entities = await this.apiClient.query(entity, offset, limit);

        if (!entities) {
          resolve(null);
          return;
        }

        entities.forEach(async (item) => {
          try {
            await this.intuitPersistance.create(dbReadyName, item);

            source.next({
              success: null,
              name: source.value.name,
              count: source.value.count + 1,
              pass: source.value.pass + 1,
            });
          } catch (err) {}
        });
        if (status === 'last') status = 'done';
        else if (entities.length !== limit && status === 'active') {
          status = 'last';
        }
        offset = offset + limit;
      }
    }).then(() => {
      source.complete();
    });

    return source.asObservable().pipe();
  }
}
