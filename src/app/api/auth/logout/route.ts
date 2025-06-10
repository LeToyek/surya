// ==============================================================================
// src/app/api/auth/logout/route.ts
// ==============================================================================
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Clear the session cookie
  (await cookies()).set('session', '', { maxAge: -1, path: '/' });
  return NextResponse.json({ message: 'Logged out successfully' });
}
