/*
  # Create orders table for cookie orders

  1. New Tables
    - `orders`
      - `id` (uuid, primary key) - Unique identifier for each order
      - `name` (text, required) - Customer name
      - `email` (text, required) - Customer email address
      - `phone` (text, optional) - Customer phone number
      - `quantity` (text, optional) - Desired quantity
      - `flavor` (text, required) - Selected cookie flavor
      - `notes` (text, optional) - Special requests or notes
      - `created_at` (timestamptz) - Order submission timestamp

  2. Security
    - Enable RLS on `orders` table
    - Add policy for public insert access (allowing customers to submit orders)
    - Add policy for authenticated read access (for admin review)

  3. Notes
    - Table stores customer order requests submitted through the contact form
    - No authentication required for customers to submit orders
    - Future admin access can be configured as needed
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  quantity text,
  flavor text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (true);