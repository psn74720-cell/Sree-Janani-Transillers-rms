/*
  # RMS Ready Mix Concrete & CLC Brick Production System Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `role` (text, either 'owner' or 'employee')
      - `created_at` (timestamptz)
    
    - `production_records`
      - `id` (uuid, primary key)
      - `product_type` (text, 'ready_mix_concrete' or 'clc_brick')
      - `quantity` (numeric)
      - `unit` (text, e.g., 'cubic_meters', 'pieces')
      - `production_date` (date)
      - `batch_number` (text)
      - `quality_grade` (text)
      - `notes` (text)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamptz)
    
    - `sales_records`
      - `id` (uuid, primary key)
      - `product_type` (text)
      - `quantity` (numeric)
      - `unit` (text)
      - `customer_name` (text)
      - `customer_contact` (text)
      - `sale_date` (date)
      - `unit_price` (numeric)
      - `total_amount` (numeric)
      - `payment_status` (text, 'paid', 'pending', 'partial')
      - `notes` (text)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Profiles: Users can read all profiles, but only update their own
    - Production Records: All authenticated users can read and create; only owners can update/delete
    - Sales Records: All authenticated users can read and create; only owners can update/delete
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('owner', 'employee')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create production_records table
CREATE TABLE IF NOT EXISTS production_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_type text NOT NULL CHECK (product_type IN ('ready_mix_concrete', 'clc_brick', 'platform_block')),
  quantity numeric NOT NULL CHECK (quantity > 0),
  unit text NOT NULL,
  production_date date NOT NULL DEFAULT CURRENT_DATE,
  batch_number text NOT NULL,
  quality_grade text DEFAULT '',
  notes text DEFAULT '',
  created_by uuid NOT NULL REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE production_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view production records"
  ON production_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create production records"
  ON production_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Only owners can update production records"
  ON production_records FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'owner'
    )
  );

CREATE POLICY "Only owners can delete production records"
  ON production_records FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'owner'
    )
  );

-- Create sales_records table
CREATE TABLE IF NOT EXISTS sales_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_type text NOT NULL CHECK (product_type IN ('ready_mix_concrete', 'clc_brick', 'platform_block')),
  quantity numeric NOT NULL CHECK (quantity > 0),
  unit text NOT NULL,
  customer_name text NOT NULL,
  customer_contact text DEFAULT '',
  sale_date date NOT NULL DEFAULT CURRENT_DATE,
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending', 'partial')),
  notes text DEFAULT '',
  created_by uuid NOT NULL REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sales_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view sales records"
  ON sales_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create sales records"
  ON sales_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Only owners can update sales records"
  ON sales_records FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'owner'
    )
  );

CREATE POLICY "Only owners can delete sales records"
  ON sales_records FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'owner'
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_production_records_created_by ON production_records(created_by);
CREATE INDEX IF NOT EXISTS idx_production_records_production_date ON production_records(production_date DESC);
CREATE INDEX IF NOT EXISTS idx_sales_records_created_by ON sales_records(created_by);
CREATE INDEX IF NOT EXISTS idx_sales_records_sale_date ON sales_records(sale_date DESC);