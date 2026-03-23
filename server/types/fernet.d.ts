declare module 'fernet' {
  export class Secret {
    constructor(secret64: string);
  }
  export class Token {
    constructor(opts: { secret?: Secret; token?: string; time?: Date; ttl?: number; iv?: Array<number> });
    encode(message: string): string;
    decode(): string;
  }
}
