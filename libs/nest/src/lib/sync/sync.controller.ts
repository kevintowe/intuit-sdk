import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { finalize } from 'rxjs/operators';

import { IntuitSyncService } from './sync.service';

@Controller('intuit/sync')
export class IntuitSyncController {
  constructor(private syncService: IntuitSyncService) {}

  @Get('invoices')
  invoices(@Res() res: Response) {
    const sub = this.syncService
      .syncEntity('Invoice')
      .pipe(
        finalize(() => {
          res.status(200).send('Success');
        })
      )
      .subscribe();
  }

  @Get('customers')
  customers(@Res() res: Response) {
    this.syncService
      .syncEntity('Customer')
      .pipe(
        finalize(() => {
          res.status(200).send('Success');
        })
      )
      .subscribe();
  }

  @Get('estimates')
  estimates(@Res() res: Response) {
    this.syncService
      .syncEntity('Estimate')
      .pipe(
        finalize(() => {
          res.status(200).send('Success');
        })
      )
      .subscribe();
  }

  @Get('accounts')
  accounts(@Res() res: Response) {
    this.syncService
      .syncEntity('Account')
      .pipe(
        finalize(() => {
          res.status(200).send('Success');
        })
      )
      .subscribe();
  }

  @Get('payments')
  payments(@Res() res: Response) {
    this.syncService
      .syncEntity('Payment')
      .pipe(
        finalize(() => {
          res.status(200).send('Success');
        })
      )
      .subscribe();
  }

  @Get('bills')
  bills(@Res() res: Response) {
    this.syncService
      .syncEntity('Bill')
      .pipe(
        finalize(() => {
          res.status(200).send('Success');
        })
      )
      .subscribe();
  }
}
