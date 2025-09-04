-- Create the polls table
CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Create the poll_options table
CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  text TEXT NOT NULL,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL
);

-- Create the votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE NOT NULL,
  UNIQUE (user_id, poll_id)
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies for polls table
CREATE POLICY "Allow authenticated users to create polls" ON polls
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Allow all users to view polls" ON polls
  FOR SELECT
  TO public
  USING (true);

-- Create policies for poll_options table
CREATE POLICY "Allow all users to view poll options" ON poll_options
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow poll creator to add options" ON poll_options
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT created_by FROM polls WHERE id = poll_id) = auth.uid()
  );

-- Create policies for votes table
CREATE POLICY "Allow authenticated users to vote" ON votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow all users to view votes" ON votes
  FOR SELECT
  TO public
  USING (true);
