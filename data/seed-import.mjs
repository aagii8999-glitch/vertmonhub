/**
 * Seed Properties from scraped data → Supabase
 * 
 * Usage: node data/seed-import.mjs
 * 
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY env vars
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Read seed data
const seedData = JSON.parse(readFileSync(join(__dirname, 'seed-properties.json'), 'utf-8'));

async function main() {
    // Get the shop_id (first shop or specific)
    const { data: shops } = await supabase.from('shops').select('id, name').limit(1);
    if (!shops || shops.length === 0) {
        console.error('❌ No shop found. Create a shop first.');
        process.exit(1);
    }
    const shopId = shops[0].id;
    console.log(`📦 Using shop: ${shops[0].name} (${shopId})`);

    let inserted = 0;
    let skipped = 0;

    for (const project of seedData.projects) {
        console.log(`\n🏗️  Processing: ${project.name}`);

        // If project has individual units, create each
        if (project.units && project.units.length > 0) {
            for (const unit of project.units) {
                const propertyName = `${project.name} - ${unit.code}`;

                // Check if already exists
                const { data: existing } = await supabase
                    .from('properties')
                    .select('id')
                    .eq('shop_id', shopId)
                    .eq('name', propertyName)
                    .limit(1);

                if (existing && existing.length > 0) {
                    console.log(`  ⏭️  Skipping ${propertyName} (exists)`);
                    skipped++;
                    continue;
                }

                const { error } = await supabase.from('properties').insert({
                    shop_id: shopId,
                    name: propertyName,
                    description: `${project.description}\n\nЗагвар: ${unit.code}\nДавхар: ${unit.floors_available}\nХарууц: ${unit.view_direction}${unit.type === 'duplex' ? '\nТөрөл: Duplex' : ''}`,
                    type: 'apartment',
                    price: 0, // Price not publicly available
                    size_sqm: unit.size_sqm,
                    rooms: unit.rooms,
                    floor: unit.floors_available,
                    address: project.address || null,
                    district: project.district,
                    city: project.city || 'Улаанбаатар',
                    status: unit.status || 'available',
                    is_active: true,
                    is_featured: unit.size_sqm > 250,
                    features: [
                        `Загвар: ${unit.code}`,
                        `Харууц: ${unit.view_direction}`,
                        ...(project.smart_home ? [`Smart Home: ${project.smart_home}`] : []),
                    ],
                    amenities: project.amenities || [],
                    images: [],
                    video_url: null,
                    virtual_tour_url: null,
                    currency: 'MNT',
                    views_count: 0,
                    inquiries_count: 0,
                });

                if (error) {
                    console.error(`  ❌ Error inserting ${propertyName}:`, error.message);
                } else {
                    console.log(`  ✅ Inserted: ${propertyName} (${unit.rooms} өрөө, ${unit.size_sqm}м²)`);
                    inserted++;
                }
            }
        }

        // If project has blocks (like Mandala Garden), create project-level entries
        if (project.blocks) {
            for (const block of project.blocks) {
                const propertyName = `${project.name} - ${block.name}`;

                const { data: existing } = await supabase
                    .from('properties')
                    .select('id')
                    .eq('shop_id', shopId)
                    .eq('name', propertyName)
                    .limit(1);

                if (existing && existing.length > 0) {
                    console.log(`  ⏭️  Skipping ${propertyName} (exists)`);
                    skipped++;
                    continue;
                }

                const { error } = await supabase.from('properties').insert({
                    shop_id: shopId,
                    name: propertyName,
                    description: `${project.description}\n\n${block.description}`,
                    type: 'apartment',
                    price: 0,
                    address: project.address || null,
                    district: project.district,
                    city: project.city || 'Улаанбаатар',
                    status: 'available',
                    is_active: true,
                    is_featured: false,
                    features: [],
                    amenities: project.amenities || [],
                    images: [],
                    currency: 'MNT',
                    views_count: 0,
                    inquiries_count: 0,
                });

                if (error) {
                    console.error(`  ❌ Error inserting ${propertyName}:`, error.message);
                } else {
                    console.log(`  ✅ Inserted: ${propertyName}`);
                    inserted++;
                }
            }
        }

        // If no units or blocks, create project-level entry
        if (!project.units && !project.blocks) {
            const { data: existing } = await supabase
                .from('properties')
                .select('id')
                .eq('shop_id', shopId)
                .eq('name', project.name)
                .limit(1);

            if (existing && existing.length > 0) {
                console.log(`  ⏭️  Skipping ${project.name} (exists)`);
                skipped++;
                continue;
            }

            const { error } = await supabase.from('properties').insert({
                shop_id: shopId,
                name: project.name,
                description: project.description,
                type: project.type || 'apartment',
                price: 0,
                district: project.district,
                city: project.city || 'Улаанбаатар',
                status: 'available',
                is_active: true,
                features: [],
                amenities: [],
                images: [],
                currency: 'MNT',
                views_count: 0,
                inquiries_count: 0,
            });

            if (error) {
                console.error(`  ❌ Error:`, error.message);
            } else {
                console.log(`  ✅ Inserted: ${project.name}`);
                inserted++;
            }
        }
    }

    console.log(`\n📊 Done! Inserted: ${inserted}, Skipped: ${skipped}`);
}

main().catch(console.error);
