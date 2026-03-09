/**
 * Run all Supabase migrations via exec_sql RPC function
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const migrationsDir = join(__dirname, '..', 'supabase', 'migrations');
const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

console.log(`📦 Running ${files.length} migrations...\n`);

let success = 0, failed = 0;
const errors = [];

for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), 'utf-8').trim();
    if (!sql) continue;

    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
        // "already exists" is OK — migration already applied
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
            console.log(`⏭️  ${file} (already applied)`);
            success++;
        } else {
            console.log(`❌ ${file}: ${error.message.substring(0, 100)}`);
            errors.push({ file, msg: error.message.substring(0, 120) });
            failed++;
        }
    } else {
        console.log(`✅ ${file}`);
        success++;
    }
}

console.log(`\n📊 Done: ${success} ✅, ${failed} ❌`);
if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(e => console.log(`  ${e.file}: ${e.msg}`));
}
