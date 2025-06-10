// ==============================================================================
// src/app/api/auth/me/route.ts
// This route checks the session cookie to get the current user.
// ==============================================================================
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const session = (await cookies()).get('session')?.value;
  if (!session) {
    return NextResponse.json(null); // No active session
  }
  try {
    const user = JSON.parse(session);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(error); // Invalid session data
  }
}