import crypto from 'node:crypto';
const fernet = require('fernet');

export class FernetService {
  /**
   * Generates a new 32-byte Fernet secret key and returns it.
   */
  public generateSecret(): string {
    return crypto.randomBytes(32).toString('base64');
  }

  /**
   * Encrypts a message using a Fernet secret key.
   */
  public createToken(secretKey: string, message: string): string {
    const secret = new fernet.Secret(secretKey);
    const token = new fernet.Token({
      secret: secret,
      time: new Date()
    });
    return token.encode(message);
  }

  /**
   * Decrypts a Fernet token string using a secret key.
   * Throws an error if decryption fails.
   */
  public decodeToken(secretKey: string, tokenString: string): string {
    const secret = new fernet.Secret(secretKey);
    const token = new fernet.Token({
      secret: secret,
      token: tokenString,
      ttl: 0 // 0 means token does not expire
    });
    return token.decode();
  }
}
