import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const maxDuration = 60;

async function buildContext() {
  const user = await prisma.userProfile.findFirst();
  const recentSessions = await prisma.session.findMany({
    orderBy: { performedAt: 'desc' },
    take: 10,
    include: { exercises: { include: { sets: true } } }
  });
  return { user, recentSessions };
}

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const { user, recentSessions } = await buildContext();

  const sys = `You are an elite strength & conditioning coach.
Use evidence-based guidance (hypertrophy, strength, progressive overload, RPE, deloads).
Output structured, concise coaching with bullets and weekly plan suggestions.
Consider user's goals, metrics, and recent sessions.
Flag form risks if seen (e.g., too close to failure too often, no deloads, junk volume).
`;

  const userProfile = user ? JSON.stringify(user) : '{}';
  const sessions = JSON.stringify(recentSessions);

  // OpenAI call: kept minimal to avoid SDK/version differences.
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ output: "Set OPENAI_API_KEY to enable AI coaching." });
  }

  const body = {
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: sys },
      { role: "user", content: `User profile: ${userProfile}
Recent sessions: ${sessions}
Prompt: ${prompt}` }
    ]
  };

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const text = await resp.text();
    return NextResponse.json({ output: `OpenAI error: ${text}` }, { status: 500 });
  }

  const data = await resp.json();
  const output = data?.choices?.[0]?.message?.content || "No output";
  return NextResponse.json({ output });
}
