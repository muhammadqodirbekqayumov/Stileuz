-- Add Smart Features support to Products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS recommended_fit text DEFAULT 'regular', -- 'slim', 'regular', 'oversize'
ADD COLUMN IF NOT EXISTS sizing_chart jsonb DEFAULT '{}'::jsonb, -- e.g. {"M": {"chest": 100, "length": 70}}
ADD COLUMN IF NOT EXISTS related_outfit_ids uuid[] DEFAULT '{}'; -- Array of product IDs that match this item

-- Create User Measurements table for Size Recommender
CREATE TABLE IF NOT EXISTS user_measurements (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  height_cm integer,
  weight_kg integer,
  chest_cm integer,
  waist_cm integer,
  hips_cm integer,
  body_shape text, -- 'athletic', 'regular', 'round'
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for user_measurements
ALTER TABLE user_measurements ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view and update their own measurements
DROP POLICY IF EXISTS "Users can view own measurements" ON user_measurements;
CREATE POLICY "Users can view own measurements" 
ON user_measurements FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own measurements" ON user_measurements;
CREATE POLICY "Users can update own measurements" 
ON user_measurements FOR ALL 
USING (auth.uid() = user_id);
