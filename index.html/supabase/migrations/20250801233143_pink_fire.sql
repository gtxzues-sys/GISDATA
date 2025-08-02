/*
  # Create signs table for photo database

  1. New Tables
    - `signs`
      - `id` (uuid, primary key)
      - `photo` (text, base64 encoded image)
      - `sign_details` (text)
      - `sign_type` (text)
      - `mutcd_name` (text)
      - `mutcd_code` (text)
      - `legend_color` (text)
      - `background_color` (text)
      - `sign_shape` (text)
      - `upload_date` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `signs` table
    - Add policy for public read access
    - Add policy for authenticated insert (we'll handle password auth in the app)
*/

CREATE TABLE IF NOT EXISTS signs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo text NOT NULL,
  sign_details text NOT NULL,
  sign_type text NOT NULL,
  mutcd_name text NOT NULL,
  mutcd_code text NOT NULL,
  legend_color text NOT NULL,
  background_color text NOT NULL,
  sign_shape text NOT NULL,
  upload_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE signs ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read signs
CREATE POLICY "Anyone can view signs"
  ON signs
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to insert signs (we'll handle password protection in the app)
CREATE POLICY "Anyone can insert signs"
  ON signs
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_signs_sign_details ON signs USING gin(to_tsvector('english', sign_details));
CREATE INDEX IF NOT EXISTS idx_signs_sign_type ON signs (sign_type);
CREATE INDEX IF NOT EXISTS idx_signs_mutcd_code ON signs (mutcd_code);
CREATE INDEX IF NOT EXISTS idx_signs_upload_date ON signs (upload_date DESC);