import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export function verifyJWT(token: string): boolean {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET not configured');
      return false;
    }
    
    const decoded = jwt.verify(token, jwtSecret) as { authenticated: boolean };
    return decoded.authenticated === true;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return false;
  }
}

export function getJWTFromRequest(request: NextRequest): string | null {
  // Try to get JWT from cookie first
  const cookieToken = request.cookies.get('board-auth')?.value;
  if (cookieToken) {
    return cookieToken;
  }
  
  // Try to get JWT from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

export function validateRequest(request: NextRequest): boolean {
  const token = getJWTFromRequest(request);
  if (!token) {
    return false;
  }
  
  return verifyJWT(token);
}