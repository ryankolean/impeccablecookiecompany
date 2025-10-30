/*
  # Update orders table for multiple flavors and communication preferences

  1. Changes to `orders` table
    - Add `flavors` (text array) - Replaces single flavor with multiple selections
    - Add `preferred_communication` (text) - Customer's preferred contact method (email, call_phone, text_phone)
    - Remove old `flavor` column (data preserved by migrating to new column)

  2. Migration Strategy
    - Create new `flavors` column as text array
    - Migrate existing `flavor` data to `flavors` array
    - Drop old `flavor` column
    - Add `preferred_communication` column with default value

  3. Security
    - Existing RLS policies remain unchanged
    - Public insert and authenticated read access maintained

  4. Notes
    - Multiple flavor selections now supported via checkbox interface
    - Communication preference allows customers to specify contact method
    - Quantity field will be constrained by form dropdown (1, 2, 3, 4, 5, 6, 6+, 12, 24, Bulk Order)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'flavors'
  ) THEN
    ALTER TABLE orders ADD COLUMN flavors text[] DEFAULT ARRAY[]::text[];
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'flavor'
  ) THEN
    UPDATE orders SET flavors = ARRAY[flavor] WHERE flavor IS NOT NULL;
    ALTER TABLE orders DROP COLUMN flavor;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'preferred_communication'
  ) THEN
    ALTER TABLE orders ADD COLUMN preferred_communication text DEFAULT 'email';
  END IF;
END $$;