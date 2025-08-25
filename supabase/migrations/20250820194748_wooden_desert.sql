/*
  # Create leads table for landing page

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `phone` (text, required)
      - `email` (text, optional)
      - `gclid` (text, optional)
      - `gbraid` (text, optional)
      - `fbclid` (text, optional)
      - `utm_source` (text, optional)
      - `utm_medium` (text, optional)
      - `utm_campaign` (text, optional)
      - `utm_content` (text, optional)
      - `utm_term` (text, optional)
      - `page_url` (text, optional)
      - `fbc` (text, optional)
      - `fbp` (text, optional)
      - `user_agent` (text, optional)
      - `user_ip` (text, optional)
      - `google_session_attribute` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `leads` table
    - Add policy for public insert access
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  email text,
  gclid text,
  gbraid text,
  fbclid text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  page_url text,
  fbc text,
  fbp text,
  user_agent text,
  user_ip text,
  google_session_attribute text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read"
  ON leads
  FOR SELECT
  TO anon
  USING (true);