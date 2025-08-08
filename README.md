# GymTrack AI (Starter)

Track gym sessions (exercises, sets, reps, RPE) and get tailored feedback and weekly plans via an AI coach.

## Stack
- Next.js 14 (App Router) + TypeScript
- Prisma ORM + SQLite (switchable to Postgres)
- Minimal CSS (you can add Tailwind/shadcn/ui)
- REST route handlers for sessions, profile, and AI coach
- OpenAI Chat Completions for coaching

## Quickstart

```bash
pnpm i
cp .env.example .env.local
pnpm prisma:migrate
pnpm dev
```

Open http://localhost:3000

## OpenAI
Set `OPENAI_API_KEY` in `.env.local`. The AI route uses `gpt-4.1-mini` by default—swap models as desired.

## DB
Default is SQLite (local). To use Postgres (Supabase/Azure Flexible Server/Neon), set `DATABASE_URL` accordingly and update `datasource` in `prisma/schema.prisma`.
If using Neon with connection pooling, also set `DIRECT_URL` for migrations.

## Auth
This starter uses a single default user row. Swap in NextAuth/Azure AD when ready and link `UserProfile` by auth user id/email.

## Roadmap
- Auth (NextAuth/Azure Entra)
- Weekly/Block programming generator (periodization)
- Progression rules (double-progression, % of 1RM, RIR targets)
- Video form check upload
- Analytics: e1RM, volume by muscle group, PR tracking
- Push notifications & reminders
- Coach memory of prior cycles
```

## API

- `GET /api/sessions`
- `POST /api/sessions` body: `{ name, notes?, exercises: [{ name, muscleGroup?, restSec?, tempo?, sets: [{ weight?, reps?, rpe?, isWarmup? }] }] }`
- `GET /api/profile`
- `PUT /api/profile` body: `{ name?, age?, sex?, heightCm?, weightKg?, goals?, activityLevel? }`
- `POST /api/ai/coach` body: `{ prompt }`
```

## License
MIT
