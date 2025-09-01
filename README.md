# ALX Polling App

A modern polling application built with Next.js, Supabase, and TypeScript.

## Features

- User authentication with Supabase
- Create and manage polls
- Vote on polls
- Real-time updates
- Modern UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```

4. Set up Supabase:
   - Create a new Supabase project
   - Go to Settings > API to get your project URL and anon key
   - Enable Email authentication in Authentication > Settings
   - Set up your database schema (see Database Setup below)

5. Run the development server:
   ```bash
   npm run dev
   ```

### Database Setup

The app uses Supabase for authentication and data storage. You'll need to set up the following tables in your Supabase database:

```sql
-- Create polls table
CREATE TABLE polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create poll_options table
CREATE TABLE poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all active polls" ON polls
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create polls" ON polls
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view poll options" ON poll_options
  FOR SELECT USING (true);

CREATE POLICY "Users can create poll options" ON poll_options
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view votes" ON votes
  FOR SELECT USING (true);

CREATE POLICY "Users can vote once per poll" ON votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Authentication

The app uses Supabase authentication with the following features:

- Email/password registration and login
- Protected routes with middleware
- User context throughout the app
- Automatic session management

## Project Structure

```
├── app/
│   ├── auth/           # Authentication pages
│   ├── polls/          # Poll-related pages
│   ├── providers/      # Context providers
│   └── components/     # App-specific components
├── components/         # Reusable UI components
├── lib/               # Utility functions and configurations
└── middleware.ts      # Route protection middleware
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT
