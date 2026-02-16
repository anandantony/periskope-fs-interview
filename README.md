# WhatsApp Group Management Interface

## Live Demo

[![View Live Demo](https://img.shields.io/badge/View%20Live%20Demo-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://periskope-fs-interview.vercel.app/)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fanandantony%2Fperiskope-fs-interview)

Experience the application in action! The live demo is hosted using Vercel.

A compact Next.js + Supabase example app for viewing and managing WhatsApp-style group metadata. It demonstrates:

- Server-rendered initial page load (SSR)
- Smooth client-side updates (search/filter/pagination) via Next.js route handlers
- Normalized phone numbers (`phone_numbers`) with `whatsapp_groups.phone_id` foreign key
- A small, responsive UI built with Tailwind CSS and shadcn/ui components

Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- shadcn/ui (Radix + Tailwind)
- Supabase (Postgres) with migrations and seed scripts

Getting started

Prerequisites

- Node.js 18+
- Supabase account (for cloud DB)
- Git

Installation

```bash
git clone <repository-url>
cd periskope-fs-interview
npm install
```

Environment

```bash
cp .env.example .env.local
```

Then edit `.env.local` and set:

```bash
SUPABASE_URL=your-supabase-url
SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` is sensitive. Do not expose it in the browser.
- No auth is implemented (assignment scope); API routes are public.

Database setup

The repository includes migrations under `supabase/migrations` and seeder scripts in `scripts/`.

Common workflows

```bash
# push migrations to Supabase (uses the Supabase CLI connection configured in package.json scripts)
npm run db:push

# seed a small sample dataset (upserts phone numbers then inserts groups)
npm run db:seed

# generate a larger dataset file
npm run db:generate-large

# seed the large dataset (writes and executes SQL produced by generator)
npm run db:seed-large
```

Notes about the schema

- Phone numbers are normalized into a `phone_numbers` table and referenced by `whatsapp_groups.phone_id`.
- The seeder will upsert phone numbers (so re-running is safe) and then insert groups referencing the phone ids.

Example SQL (normalized schema)

```sql
-- Phone numbers
CREATE TABLE phone_numbers (
  id SERIAL PRIMARY KEY,
  number VARCHAR(32) NOT NULL UNIQUE,
  status VARCHAR(32) DEFAULT 'active',
  account_holder VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups referencing phone id
CREATE TABLE whatsapp_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  phone_id INTEGER REFERENCES phone_numbers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Example inserts
INSERT INTO phone_numbers (number, status, account_holder) VALUES
  ('+91 98765 43210', 'active', 'Internal Team A'),
  ('+91 91234 56789', 'active', 'Internal Team B');

INSERT INTO whatsapp_groups (name, description, member_count, phone_id) VALUES
('Family Group', 'Close family members chat', 12, 1),
('Work Team', 'Project team discussions', 8, 1),
('Friends Circle', 'School and college friends', 25, 2);
```

Running the app

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000) to view the UI.

Key scripts

- `npm run db:push` — push migrations to Supabase
- `npm run db:seed` — run small seeder (upserts `phone_numbers`, inserts groups)
- `npm run db:generate-large` — generate a large SQL file under `supabase/` for bulk testing
- `npm run db:seed-large` — load the generated large dataset into Supabase
- `npm run lint` — run ESLint
- `npm run lint:fix` — auto-fix ESLint issues
- `npm run format` — format the repo with Prettier
- `npm run format:check` — check formatting with Prettier

Project structure

```bash
├── app/                    # Next.js app directory (App Router)
│   └── api/                # Route handlers used for client-side data fetching
├── components/             # React components (TopNav, GroupsTable, Sidebar, SidePanel)
├── components/ui/          # shadcn/ui wrappers (Select, Button, Card, etc.)
├── lib/                    # Utilities, hooks, and server-only Supabase access
├── supabase/               # Migrations and SQL seed files
├── scripts/                # Seed/generator scripts
├── types/                  # TypeScript type definitions
└── .env.example            # Env template
```

Usage highlights

- Browse groups and filter by phone number via the top selector (includes an "All phone numbers" option)
- Pagination, search, and filters update the table without a full page reload
- URL query params reflect the current state so refresh/share/back-forward work
- Seed scripts provide both small and large datasets for testing

URL state

The main page uses these query params:

- `phone` (always present): a phone number or `all`
- `q`: search term
- `project`: project filter
- `labels`: JSON stringified array of labels
- `page`, `pageSize`: pagination

Deployment (Vercel)

> Use the deploy button at the top to get started quickly

1. Push the repository to GitHub
2. Connect the repo in Vercel
3. Configure environment variables in the Vercel dashboard (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_DEFAULT_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
4. Deploy — Vercel will automatically build the Next.js app

Developer notes

- SSR: `app/page.tsx` reads `searchParams` and fetches initial data using server functions in `lib/server/whatsapp-groups.ts`.
- Client fetching: interactive updates call route handlers under `app/api/*`, and `useWhatsAppGroups` fetches from `/api/whatsapp-groups`.
- Seed scripts use `dotenv` for local env values when run from your machine
- The `TopNav` component receives phone numbers via props and provides an "All phone numbers" option.

License
This repository is a take-home demo and is provided for assessment purposes.
