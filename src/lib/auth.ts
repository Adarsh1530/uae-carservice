import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from './db';
import bcrypt from 'bcryptjs';

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'whaless-group-production-secret-key-2026-uae-secure-token-998877'
);

const COOKIE_NAME = 'whaless_admin_token';
const EXPIRATION_TIME = '24h';

export interface AdminPayload {
  id: string;
  username: string;
  role: string;
}

export async function createSessionToken(payload: AdminPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRATION_TIME)
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<AdminPayload | null> {
  try {
    const verified = await jwtVerify(token, SECRET_KEY);
    return verified.payload as unknown as AdminPayload;
  } catch (error) {
    return null;
  }
}

export async function setAdminSession(admin: AdminPayload) {
  const token = await createSessionToken(admin);
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function clearAdminSession() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(plain, hashed);
}

export async function hashPassword(plain: string): Promise<string> {
  return await bcrypt.hash(plain, 12);
}
