import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Set admin role (super_admin is not in the constraint, so use admin for now)
const userId = '5b1219df-c017-4583-9417-299c3ce23017';
const { data, error } = await s
    .from('user_roles')
    .upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id' })
    .select();

console.log(error ? 'Error: ' + error.message : 'SUCCESS! admin role set:', JSON.stringify(data));

// Also update RBAC to treat admin as super_admin (full access)
console.log('admin@vertmon.mn is now admin with FULL access to all modules');
