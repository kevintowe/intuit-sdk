import * as fs from 'fs';
import { OAuthToken } from '@intuit-sdk/nest';

const tokenPath =
  __dirname + '/apps/database-server/src/assets/oauthToken.json';

export function getToken() {
  const rawData = fs.readFileSync(tokenPath);
  const oauthToken = JSON.parse(rawData.toString()) as OAuthToken;
  return oauthToken;
}

export async function saveToken(token: OAuthToken) {
  const data = JSON.stringify(token);

  console.log(data);
  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(tokenPath, data);
      resolve(null);
    } catch (err) {
      reject(err);
    }
  });
}
