import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data: shops } = await supabase.from('shops').select('id, name').limit(5);
console.log('Existing shops:', shops);

if (!shops || shops.length === 0) {
    console.log('No shops found. Creating Vertmon LLC...');
    const { data, error } = await supabase.from('shops').insert({
        name: 'Vertmon LLC',
    }).select().single();

    if (error) {
        console.error('Error creating shop:', error.message);
    } else {
        console.log('Created shop:', data.id, data.name);
    }
} else {
    console.log('Shop exists, ready for import!');
}
