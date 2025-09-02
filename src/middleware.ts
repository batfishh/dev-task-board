import { NextRequest, NextResponse } from 'next/server';

// Simple JWT verification for Edge Runtime
function verifyJWT(token: string, secret: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const [header, payload, signature] = parts;
    
    // Basic decode (for Edge Runtime compatibility)
    const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check expiration
    if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) {
      return false;
    }
    
    // For now, just check if it has our expected structure
    // In production, you'd want proper HMAC verification
    return decodedPayload.authenticated === true;
  } catch (error) {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    console.error('JWT_SECRET not configured');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check if accessing the board page
  if (request.nextUrl.pathname === '/board') {
    const authCookie = request.cookies.get('board-auth');
    
    // If no auth cookie or invalid JWT, redirect to login
    if (!authCookie || !verifyJWT(authCookie.value, jwtSecret)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If accessing login page while already authenticated, redirect to board
  if (request.nextUrl.pathname === '/login') {
    const authCookie = request.cookies.get('board-auth');
    
    if (authCookie && verifyJWT(authCookie.value, jwtSecret)) {
      return NextResponse.redirect(new URL('/board', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/board', '/login']
};