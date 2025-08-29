/*
  # Add name field to leads table

  1. Changes
    - Add `name` column to `leads` table
    - Set as TEXT type and NOT NULL
    - Add default value for existing records

  2. Security
    - No changes to RLS policies needed
*/

-- Add name column to leads table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'name'
  ) THEN
    ALTER TABLE leads ADD COLUMN name TEXT NOT NULL DEFAULT '';
  END IF;
END $$;