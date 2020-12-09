import * as fs from 'fs';
import { OAuthToken } from '@intuit-sdk/nest';

export function getToken() {
  try {
    if (fs.existsSync('./oauthToken.json')) {
      const rawData = fs.readFileSync('./oauthToken.json');
      const oauthToken = JSON.parse(rawData.toString()) as OAuthToken;
      return oauthToken;
    }
  } catch (err) {
    return null;
  }
}

export async function saveToken(token: OAuthToken) {
  const data = JSON.stringify(token);

  console.log(data);
  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync('./oauthToken.json', data);
      resolve(null);
    } catch (err) {
      reject(err);
    }
  });
}
