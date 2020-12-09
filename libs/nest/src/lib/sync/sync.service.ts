import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { BehaviorSubject, Observable } from 'rxjs';

import { PluralEntities, SingularEntities, EntitySyncReport } from '../types';
import { prepEntityName } from '../utils';

@Injectable()
export class IntuitSyncService {
  constructor(
    @Inject('Firestore') private firestore: admin.firestore.Firestore,
    @Inject('IntuitApiClient') private apiClient: any
  ) {}

  syncEntity(
    entityPlural: PluralEntities,
    entitySingular: SingularEntities
  ): Observable<EntitySyncReport> {
    let limit = 100;
    let offset = 0;
    let status: 'active' | 'last' | 'done' = 'active';
    const lowerCaseEntityName = prepEntityName(entityPlural);
    const stats = {
      entityName: entitySingular,
      entityCount: 0,
      pass: () => {
        return (stats.passCount = stats.passCount + 1);
      },
      passCount: 0,
      self() {
        return {};
      },
    };

    const source = new BehaviorSubject<EntitySyncReport>({
      name: null,
      count: 0,
      pass: 0,
    });

    new Promise(async (resolve, reject) => {
      while (status !== 'done') {
        const entities = await this.queryQuickbooksEntity(
          entityPlural,
          entitySingular,
          offset,
          limit
        );

        if (!entities) {
          resolve(null);
          return;
        }

        entities.forEach(async (entity) => {
          try {
            await this.firestore
              .collection(lowerCaseEntityName)
              .doc(entity.Id)
              .set(entity);

            source.next({
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
    }).then((status) => {
      source.complete();
    });

    return source.asObservable().pipe();
  }

  private async queryQuickbooksEntity(
    entityPlural: PluralEntities,
    entitySingular: SingularEntities,
    offset: number,
    limit: number
  ) {
    return new Promise<any[]>((resolve, reject) => {
      return this.apiClient[`find${entityPlural}`](
        { offset, limit },
        (err, data) => {
          if (err) reject(err);
          const entities = data.QueryResponse[entitySingular];
          resolve(entities);
        }
      );
    });
  }
}
