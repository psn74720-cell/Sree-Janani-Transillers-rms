import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  full_name: string;
  role: 'owner' | 'employee';
  created_at: string;
}

export interface ProductionRecord {
  id: string;
  product_type: 'ready_mix_concrete' | 'clc_brick' | 'platform_block';
  quantity: number;
  unit: string;
  production_date: string;
  batch_number: string;
  quality_grade: string;
  notes: string;
  created_by: string;
  created_at: string;
}

export interface SalesRecord {
  id: string;
  product_type: 'ready_mix_concrete' | 'clc_brick' | 'platform_block';
  quantity: number;
  unit: string;
  customer_name: string;
  customer_contact: string;
  sale_date: string;
  unit_price: number;
  total_amount: number;
  payment_status: 'paid' | 'pending' | 'partial';
  notes: string;
  created_by: string;
  created_at: string;
}
