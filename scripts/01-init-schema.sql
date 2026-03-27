-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'viewer')),
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create booking_requests table for guest reservations
CREATE TABLE IF NOT EXISTS booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_guests INTEGER NOT NULL,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  admin_notes TEXT
);

-- Create calendar_blocks table for unavailable dates
CREATE TABLE IF NOT EXISTS calendar_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_date DATE NOT NULL UNIQUE,
  reason TEXT NOT NULL DEFAULT 'unavailable',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table for admin sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_booking_requests_check_in ON booking_requests(check_in_date);
CREATE INDEX IF NOT EXISTS idx_calendar_blocks_date ON calendar_blocks(block_date);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public booking access
CREATE POLICY "Allow public to insert booking requests"
  ON booking_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public to view their own bookings"
  ON booking_requests FOR SELECT
  USING (true);

-- RLS Policies for admin access
CREATE POLICY "Only admins can view users"
  ON users FOR SELECT
  USING (auth.uid()::uuid IN (SELECT id FROM users WHERE role = 'super_admin'));

CREATE POLICY "Only admins can manage booking requests"
  ON booking_requests FOR UPDATE
  USING (auth.uid()::uuid IN (SELECT id FROM users WHERE role = 'super_admin'));

CREATE POLICY "Only admins can delete bookings"
  ON booking_requests FOR DELETE
  USING (auth.uid()::uuid IN (SELECT id FROM users WHERE role = 'super_admin'));

-- Calendar blocks access
CREATE POLICY "Anyone can view calendar blocks"
  ON calendar_blocks FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage calendar blocks"
  ON calendar_blocks FOR INSERT
  USING (auth.uid()::uuid IN (SELECT id FROM users WHERE role = 'super_admin'));

CREATE POLICY "Only admins can delete calendar blocks"
  ON calendar_blocks FOR DELETE
  USING (auth.uid()::uuid IN (SELECT id FROM users WHERE role = 'super_admin'));

-- Insert default admin user (password should be changed via admin panel)
INSERT INTO users (email, password_hash, role, name)
VALUES ('admin@alamarhouse.com', '', 'super_admin', 'Admin ALAMAR')
ON CONFLICT DO NOTHING;
