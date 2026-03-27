-- Migration: Update calendar_blocks to support date ranges
-- This migration converts the single block_date column to start_date/end_date range

-- Step 1: Add new columns for date range support
ALTER TABLE calendar_blocks 
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS block_type TEXT DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS booking_request_id UUID REFERENCES booking_requests(id) ON DELETE SET NULL;

-- Step 2: Migrate existing data (single dates become same-day ranges)
UPDATE calendar_blocks 
SET start_date = block_date, end_date = block_date
WHERE start_date IS NULL AND block_date IS NOT NULL;

-- Step 3: Make start_date and end_date required for new entries
-- Note: We keep block_date for backward compatibility but will deprecate it

-- Step 4: Add index for efficient date range queries
CREATE INDEX IF NOT EXISTS idx_calendar_blocks_date_range 
ON calendar_blocks(start_date, end_date);

-- Step 5: Add check constraint for valid date ranges
ALTER TABLE calendar_blocks 
ADD CONSTRAINT valid_date_range CHECK (start_date <= end_date);

-- Step 6: Create helper function to check if dates overlap with blocked ranges
CREATE OR REPLACE FUNCTION dates_overlap_blocked(
  check_start DATE,
  check_end DATE
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM calendar_blocks
    WHERE start_date <= check_end AND end_date >= check_start
  );
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create view for easy querying of all blocked dates
CREATE OR REPLACE VIEW blocked_dates_expanded AS
SELECT 
  cb.id,
  cb.reason,
  cb.block_type,
  cb.notes,
  cb.booking_request_id,
  cb.created_at,
  generate_series(cb.start_date, cb.end_date, '1 day'::interval)::date as blocked_date
FROM calendar_blocks cb
WHERE cb.start_date IS NOT NULL AND cb.end_date IS NOT NULL;
