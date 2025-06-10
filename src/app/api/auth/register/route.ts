// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust path if needed
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Return the user without the password
    const userDTO = {
        id: user.id,
        name: user.name,
        email: user.email,
        };

    return NextResponse.json(userDTO, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}