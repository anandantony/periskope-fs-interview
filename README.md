# WhatsApp Group Management Interface

A WhatsApp group management interface built with Next.js 13+, Tailwind CSS, Supabase, and TypeScript. This project replicates a WhatsApp group management system with a modern, responsive UI.

## Overview

This application provides a clean interface for managing WhatsApp groups associated with a phone number. It features a sidebar navigation, scrollable groups table, and a detailed side panel for group information.

### Features

- **Sidebar Navigation** - Clean navigation UI with search functionality
- **Groups Table** - Scrollable table with clickable rows showing WhatsApp groups
- **Side Panel** - Detailed view of selected group information
- **Responsive Design** - Works seamlessly on different screen sizes
- **Modern UI** - Built with shadcn/ui components and Tailwind CSS

### Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account (for database setup)
- Git for version control

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd periskope-fs-interview
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Configure your Supabase credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Database Setup

1. Create a new Supabase project
2. Run the following SQL in the Supabase SQL Editor:

```sql
CREATE TABLE whatsapp_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  phone_number VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Insert sample data
INSERT INTO whatsapp_groups (name, description, member_count, phone_number) VALUES
('Family Group', 'Close family members chat', 12, '+1234567890'),
('Work Team', 'Project team discussions', 8, '+1234567890'),
('Friends Circle', 'School and college friends', 25, '+1234567890'),
('Book Club', 'Monthly book discussions', 6, '+1234567890'),
('Fitness Group', 'Workout motivation and tips', 15, '+1234567890');
```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Sidebar.tsx       # Sidebar navigation
│   ├── GroupsTable.tsx   # Groups table component
│   └── SidePanel.tsx     # Side panel component
├── lib/                  # Utility libraries
│   ├── utils.ts          # Utility functions
│   └── supabase.ts       # Supabase client configuration
├── types/                # TypeScript type definitions
│   └── index.ts          # Main types
└── .env.example          # Environment variables template
```

## Usage

1. **View Groups**: The main table displays all WhatsApp groups
2. **Select Group**: Click on any row to view detailed information
3. **Navigate**: Use the sidebar for navigation (UI only)
4. **Search**: Use the search bar in the sidebar to filter groups

## Deployment

### Vercel Deployment

1. Push your code to a public GitHub repository
2. Connect your GitHub account to Vercel
3. Import the project and configure environment variables
4. Deploy automatically

### Environment Variables for Production

Add these in your Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Development

### Adding New Features

1. Create components in the `components/` directory
2. Add types in `types/index.ts`
3. Update the main page in `app/page.tsx`
4. Follow the existing code patterns and styling

### Code Style

- Use TypeScript for all components
- Follow the existing component structure
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states where appropriate

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [Supabase Documentation](https://supabase.com/docs) - open source Firebase alternative
- [shadcn/ui](https://ui.shadcn.com/) - beautifully designed components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for demonstration purposes as part of a technical assessment.
