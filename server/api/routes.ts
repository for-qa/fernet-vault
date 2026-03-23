import { Router } from 'express';
import { FernetService } from '../core/services/fernetService';

const router = Router();
const fernetService = new FernetService();

const SECRET_KEY_ENV_NAME_REGEX = /^[A-Z0-9_]+_ENCRYPTION_KEY$/;

const getAvailableSecretKeyEnvNames = (): string[] => {
  // Values come from `dotenv.config()` in `server/server.ts`.
  // Filter to "secret key env vars" (e.g. APP_DEV_ENCRYPTION_KEY, AUTH_DEV_ENCRYPTION_KEY).
  return Object.keys(process.env)
    .filter((k) => SECRET_KEY_ENV_NAME_REGEX.test(k))
    .filter((k) => !!process.env[k]?.trim())
    .sort();
};

const isAvailableSecretKeyEnvName = (value: string): boolean => {
  if (!SECRET_KEY_ENV_NAME_REGEX.test(value)) return false;
  return !!process.env[value]?.trim();
};

const resolveSecret = (secret: unknown, secretKeyEnv: unknown): { secret: string; source: 'env' | 'manual' } | null => {
  const envName = typeof secretKeyEnv === 'string' ? secretKeyEnv.trim() : '';
  if (envName) {
    if (!isAvailableSecretKeyEnvName(envName)) return null;
    const resolved = process.env[envName]?.trim();
    if (!resolved) return null;
    return { secret: resolved, source: 'env' };
  }

  const manual = typeof secret === 'string' ? secret.trim() : '';
  if (!manual) return null;
  return { secret: manual, source: 'manual' };
};

router.get('/secret/options', (req, res) => {
  const options = getAvailableSecretKeyEnvNames();

  res.json({ options });
});

router.post('/secret/generate', (req, res) => {
  try {
    const secret = fernetService.generateSecret();
    res.json({ secret });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/token/create', (req, res) => {
  try {
    const { secret, secretKeyEnv, message } = req.body;
    const resolved = resolveSecret(secret, secretKeyEnv);
    if (!resolved || !message) {
      return res.status(400).json({ error: 'secret (or secretKeyEnv) and message are required' });
    }
    const token = fernetService.createToken(resolved.secret, message);
    res.json({ token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/token/decode', (req, res) => {
  try {
    const { secret, secretKeyEnv, token } = req.body;
    const resolved = resolveSecret(secret, secretKeyEnv);
    if (!resolved || !token) {
      return res.status(400).json({ error: 'secret (or secretKeyEnv) and token are required' });
    }
    const decodedMessage = fernetService.decodeToken(resolved.secret, token);
    res.json({ decodedMessage });
  } catch (error: any) {
    res.status(400).json({ error: 'Error decoding token: ' + error.message });
  }
});

export default router;
