import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  let user = await prisma.userProfile.findFirst();
  if (!user) user = await prisma.userProfile.create({ data: {} });
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  let user = await prisma.userProfile.findFirst();
  if (!user) user = await prisma.userProfile.create({ data: {} });
  const updated = await prisma.userProfile.update({
    where: { id: user.id },
    data: {
      name: body.name,
      age: body.age,
      sex: body.sex,
      heightCm: body.heightCm,
      weightKg: body.weightKg,
      goals: body.goals ? JSON.stringify(body.goals) : undefined,
      activityLevel: body.activityLevel,
    }
  });
  return NextResponse.json(updated);
}
