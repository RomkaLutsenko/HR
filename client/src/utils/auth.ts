import { JwtPayload } from '@/types/types';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function verifyJWT(token: string): Promise<JwtPayload | null> {
  try {
    console.log('Verifying JWT with secret:', JWT_SECRET ? 'exists' : 'missing');
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log('Decoded JWT:', decoded);
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export function generateJWT(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
