import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    console.log('Login attempt received');
    
    if (!password) {
      console.log('No password provided');
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const correctPassword = process.env.BOARD_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!correctPassword || !jwtSecret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (password === correctPassword) {
      console.log('Password correct, generating JWT');
      // Create JWT token
      const token = jwt.sign(
        { authenticated: true, timestamp: Date.now() },
        jwtSecret,
        { expiresIn: '24h' }
      );
      
      console.log('JWT generated, setting cookie');
      // Create response with secure JWT cookie
      const response = NextResponse.json({ success: true });
      
      response.cookies.set('board-auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      });
      
      console.log('Login successful');
      return response;
    } else {
      console.log('Invalid password');
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}