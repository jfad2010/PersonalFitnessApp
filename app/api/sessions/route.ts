import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sessions = await prisma.session.findMany({
    orderBy: { performedAt: 'desc' },
    include: { exercises: { include: { sets: true } } },
  });
  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Very light validation. In prod, validate with zod.
  const { name, notes, exercises } = body ?? {};
  if (!name || !Array.isArray(exercises)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // For now, use a single default user profile row (first one). In production, connect to auth user.
  let user = await prisma.userProfile.findFirst();
  if (!user) user = await prisma.userProfile.create({ data: {} });

  const session = await prisma.session.create({
    data: {
      name,
      notes,
      userId: user.id,
      exercises: {
        create: exercises.map((e: any) => ({
          name: e.name || 'Exercise',
          muscleGroup: e.muscleGroup,
          tempo: e.tempo,
          restSec: e.restSec ?? null,
          sets: {
            create: (e.sets || []).map((s: any, idx: number) => ({
              setNumber: idx + 1,
              weight: s.weight ?? null,
              reps: s.reps ?? null,
              rpe: s.rpe ?? null,
              isWarmup: !!s.isWarmup,
            }))
          }
        }))
      }
    },
    include: { exercises: { include: { sets: true } } }
  });

  return NextResponse.json(session, { status: 201 });
}
