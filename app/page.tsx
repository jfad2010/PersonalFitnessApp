import { prisma } from '@/lib/prisma';
import SessionForm from '@/components/SessionForm';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const sessions = await prisma.session.findMany({
    orderBy: { performedAt: 'desc' },
    take: 10,
    include: { exercises: { include: { sets: true } } }
  });

  return (
    <div className="space-y-4">
      <SessionForm />
      <div>
        <h2 className="text-2xl font-semibold">Recent Sessions</h2>
        <div className="space-y-2">
          {sessions.map(s => (
            <div key={s.id} className="border rounded p-3">
              <div className="font-semibold">{s.name} • {new Date(s.performedAt).toLocaleDateString()}</div>
              <div>{s.notes}</div>
              <ul>
                {s.exercises.map(e => (
                  <li key={e.id}>
                    <strong>{e.name}</strong>:{" "}
                    {e.sets.map(st => `${st.reps || 0}x${st.weight || 0}kg`).join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
