// ==============================================================================
// src/app/api/auth/login/route.ts
// NOTE: For a real app, use a proper session library like next-auth or iron-session
// to create and manage secure, httpOnly session cookies (JWTs).
// This example uses a basic cookie for demonstration.
// ==============================================================================
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const userDTO = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // Include role if needed
        };
    // Set a simple session cookie (INSECURE for production)
    (await cookies()).set('session', JSON.stringify(userDTO), {
      httpOnly: true, // Important for security
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return NextResponse.json(userDTO);
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
