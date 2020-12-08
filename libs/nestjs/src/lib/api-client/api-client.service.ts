import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class IntuitApiClientService {
  // constructor(@Inject('NodeQuickbooks') private nodeQuickbooks: any) {}

  async read(entity: string, id: string) {
    // return new Promise((resolve, reject) => {
    //   console.log(entity);
    //   try {
    //     this.nodeQuickbooks[`get${entity}`](id, (err, data) => {
    //       if (err) reject(err);
    //       else resolve(data);
    //     });
    //   } catch (err) {
    //     resolve(err);
    //   }
    // });
  }

  async create(entityName: string, entity: any) {
    // return new Promise((resolve, reject) => {
    //   try {
    //     this.nodeQuickbooks[`create${entityName}`](
    //       entity,
    //       (err, createdEntity) => {
    //         if (err) reject(err);
    //         else resolve(createdEntity);
    //       }
    //     );
    //   } catch (err) {}
    // });
  }

  async update(entityName: string, entity: any) {
    // return new Promise((resolve, reject) => {
    //   try {
    //     this.nodeQuickbooks[`update${entityName}`](
    //       entity,
    //       (err, updatedEntity) => {
    //         if (err) reject(err);
    //         else resolve(updatedEntity);
    //       }
    //     );
    //   } catch (err) {}
    // });
  }

  async delete() {}

  async query() {}

  async reports() {}
}
