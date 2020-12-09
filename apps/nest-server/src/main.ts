/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
console.log('Hello World');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = 3333;
  await app.listen(port, () => {
    console.log('listening at : localhost:' + port);
  });
}

bootstrap();
