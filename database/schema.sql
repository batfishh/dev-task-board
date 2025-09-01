-- Create the boards table to store board states
CREATE TABLE IF NOT EXISTS boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) DEFAULT 'main' NOT NULL,
  board_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on name (so we can have one main board)
CREATE UNIQUE INDEX IF NOT EXISTS boards_name_idx ON boards(name);

-- Enable RLS (Row Level Security) - optional but recommended
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (you can make this more restrictive later)
CREATE POLICY "Allow all operations on boards" ON boards
FOR ALL 
TO public
USING (true)
WITH CHECK (true);

-- Create an update trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_boards_updated_at 
  BEFORE UPDATE ON boards 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();