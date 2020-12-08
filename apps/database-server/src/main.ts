import { OAuthToken } from '@intuit-sdk/nest';
import * as express from 'express';
import { saveToken, getToken } from './app/token';

const app = express();
const port = 2000;

app.use(express.json());

/**
 * OAuth Routes
 */
app.get('/oauth-token', (req, res) => {
  try {
    res.json(getToken()).end();
  } catch (err) {
    res.status(500).send(err);
  }
});
app.post('/oauth-token', async (req, res) => {
  try {
    const token = req.body as OAuthToken;
    await saveToken(token);

    res.status(200).end();
  } catch (err) {
    res.status(500).end();
  }
});

/**
 * Intuit Entity Routes
 */
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
