import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '../../../../../common/lib/prisma';

export async function POST(req: {
  json: () =>
    | PromiseLike<{ email: any; password: any; name: any }>
    | { email: any; password: any; name: any };
}) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const role = await prisma.role.findUniqueOrThrow({
      where:{ name: 'DEFAULT'}
    })
    if (!role) {
      return NextResponse.json({ error: 'Something went wrong' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role_id: role?.uuid },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
