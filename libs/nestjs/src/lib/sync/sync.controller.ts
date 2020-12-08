// import { Controller, Get, Res } from '@nestjs/common';
// import { Response } from 'express';
// import { finalize, map } from 'rxjs/operators';

// import { IntuitSyncService } from './sync.service';

// @Controller('intuit/sync')
// export class IntuitSyncController {
//   constructor(private syncService: IntuitSyncService) {}

//   @Get('invoices')
//   invoices(@Res() res: Response) {
//     const sub = this.syncService
//       .syncEntity('Invoices', 'Invoice')
//       .pipe(
//         finalize(() => {
//           res.status(200).send('Success');
//         })
//       )
//       .subscribe();
//   }

//   @Get('customers')
//   customers(@Res() res: Response) {
//     this.syncService
//       .syncEntity('Customers', 'Customer')
//       .pipe(
//         finalize(() => {
//           res.status(200).send('Success');
//         })
//       )
//       .subscribe();
//   }

//   @Get('estimates')
//   estimates(@Res() res: Response) {
//     this.syncService
//       .syncEntity('Estimates', 'Estimate')
//       .pipe(
//         finalize(() => {
//           res.status(200).send('Success');
//         })
//       )
//       .subscribe();
//   }
// }
