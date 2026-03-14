const PASSWORD_PREFIX = "pbkdf2";
const ITERATIONS = 120_000;
const KEY_LENGTH = 32;

const textEncoder = new TextEncoder();

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function derivePasswordKey(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> {
  const normalizedSalt = Uint8Array.from(salt);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: normalizedSalt,
      iterations,
    },
    keyMaterial,
    KEY_LENGTH * 8,
  );

  return new Uint8Array(derivedBits);
}

function constantTimeEquals(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;

  for (let index = 0; index < a.length; index += 1) {
    result |= (a[index] ?? 0) ^ (b[index] ?? 0);
  }

  return result === 0;
}

export function isHashedPassword(value: string | null | undefined): boolean {
  return Boolean(value?.startsWith(`${PASSWORD_PREFIX}$`));
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derivedKey = await derivePasswordKey(password, salt, ITERATIONS);

  return `${PASSWORD_PREFIX}$${ITERATIONS}$${bytesToBase64(salt)}$${bytesToBase64(derivedKey)}`;
}

export async function verifyPassword(
  password: string,
  storedPassword: string | null | undefined,
): Promise<boolean> {
  if (!storedPassword) {
    return false;
  }

  if (!isHashedPassword(storedPassword)) {
    return storedPassword === password;
  }

  const [, iterationsString, saltValue, storedKeyValue] =
    storedPassword.split("$");

  if (!iterationsString || !saltValue || !storedKeyValue) {
    return false;
  }

  const iterations = Number(iterationsString);
  if (!Number.isFinite(iterations) || iterations <= 0) {
    return false;
  }

  const salt = base64ToBytes(saltValue);
  const storedKey = base64ToBytes(storedKeyValue);
  const derivedKey = await derivePasswordKey(password, salt, iterations);

  return constantTimeEquals(storedKey, derivedKey);
}
