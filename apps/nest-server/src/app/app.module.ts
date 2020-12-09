import { Injectable, Module } from '@nestjs/common';
import * as http from 'http';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import {
  IntuitConfig,
  IntuitNestModule,
  IntuitPersistence,
  OAuthToken,
} from '@intuit-sdk/nest';
import { environment } from '../environments/environment';
import { runInNewContext } from 'vm';

const config: IntuitConfig = {
  clientId: environment.clientId,
  clientSecret: environment.clientSecret,
  verifierToken: environment.verifierToken,
  redirectUri: environment.redirectUri,
  environment: 'sandbox',
  frontEndRedirectUri: 'https://google.com',
  syncModule: true,
};

@Injectable()
class IntuitPersistenceService implements IntuitPersistence {
  host = 'localhost';
  port = '2000';

  async saveToken(token: OAuthToken) {
    const data = JSON.stringify(token);

    const options: http.RequestOptions = {
      host: this.host,
      port: this.port,
      path: '/oauth-token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = http.request(options, (response) => {
      response.on('data', (d) => {
        process.stdout.write(d);
      });
    });

    req.on('error', (error) => {
      console.log(error);
    });

    req.write(data);
    req.end(() => {
      console.log('Request Ended');
    });
  }

  async getToken() {
    return new Promise<OAuthToken>((resolve, reject) => {
      const options: http.RequestOptions = {
        host: this.host,
        port: this.port,
        path: '/oauth-token',
        method: 'GET',
      };

      const req = http.request(options, (response) => {
        response.on('data', (d) => {
          resolve(JSON.parse(d.toString()));
        });
      });

      req.on('error', (error) => {
        console.log(error);
        reject(error);
      });

      req.end(() => {});
    });
  }
  async create<T>(entityName: string, entity: T) {}
  async update<T>(entityName: string, entity: T) {}
}

@Module({
  imports: [IntuitNestModule.register(config, IntuitPersistenceService)],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'DatabaseConfig',
      useValue: { host: 'localhost.com', port: '2000' },
    },
  ],
})
export class AppModule {}
