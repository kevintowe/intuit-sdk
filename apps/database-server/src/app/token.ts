import * as fs from 'fs';
import { OAuthToken } from '@intuit-sdk/nest';

export function getToken() {
  const rawData = fs.readFileSync('./oauthToken.json');
  const oauthToken = JSON.parse(rawData.toString()) as OAuthToken;
  console.log(oauthToken);
  if (oauthToken) {
    console.log(oauthToken);
    return oauthToken;
  } else {
    console.log('hmmmm did not work');
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
