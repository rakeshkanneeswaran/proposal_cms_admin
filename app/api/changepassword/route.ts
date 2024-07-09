import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
const prisma = new PrismaClient();





export async function POST(req: NextRequest, res: NextResponse) {

  const session = await getServerSession();
  if (!session?.user?.name) {
    return NextResponse.json({ messgae: "Your are not authentication" }, { status: 401 })
  }
  const body = await req.json();
  console.log(body.username, body.password);
  const username = body.username;
  const password = body.password;

  if (!username || !password) {
    return NextResponse.json({ messgae: "Username and password are required.", status: 400 })

  }
  try {
    await prisma.admin.update({
      where: { username },
      data: { password }
    });

    return NextResponse.json({
      message: 'Password updated successfully.',
      status: 200
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({
      message: 'Internal server error.',
      status: 500
    });
  }

}

