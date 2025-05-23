import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '../../../../../common/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, first_name, last_name, role } = body;

    if (!email || !password || !first_name || !last_name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const backendRes = await fetch(`http://localhost:4000/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.toLowerCase(),
        password: hashedPassword,
        first_name,
        last_name,
        role,
      }),
    });

    if (!backendRes.ok) {
      const errorBody = await backendRes.json();
      return NextResponse.json({ error: errorBody.message ?? 'Backend user creation failed' }, { status: backendRes.status });
    }

    const newUser = await backendRes.json();

    return NextResponse.json(
      { user: newUser, message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
