import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export interface Brand {
    id: string;
    name: string;
    type: 'telegram' | 'website' | 'instagram';
    source_url: string;
    logo_url?: string;
    is_active: boolean;
}

export interface Product {
    id: string;
    brand_id: string;
    title: string;
    price: string;
    image_url: string;
    original_url: string;
    category: 'upper_body' | 'lower_body' | 'dresses' | 'shoes' | 'accessory';
    metadata?: any;
}
