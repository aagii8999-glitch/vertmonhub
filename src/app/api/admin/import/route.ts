import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getClerkUser } from '@/lib/auth/supabase-auth';
import * as XLSX from 'xlsx';

/**
 * POST /api/admin/import
 * Bulk import properties from CSV/Excel
 */
export async function POST(request: NextRequest) {
    try {
        const userId = await getClerkUser();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = supabaseAdmin();

        // Check if user is admin
        const { data: admin } = await supabase
            .from('admins')
            .select('role')
            .eq('user_id', userId)
            .single();

        if (!admin) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const shopId = formData.get('shopId') as string;
        const importType = formData.get('type') as string; // 'properties' | 'faq'

        if (!file || !shopId) {
            return NextResponse.json({ error: 'File and shopId required' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        if (importType === 'properties') {
            return await importProperties(supabase, buffer, shopId, file.name);
        } else if (importType === 'faq') {
            return await importFAQ(supabase, buffer, shopId, file.name);
        }

        return NextResponse.json({ error: 'Invalid import type' }, { status: 400 });
    } catch (error: any) {
        console.error('Import error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * Import properties from Excel/CSV
 * Expected columns: name, type, price, size_sqm, rooms, bedrooms, bathrooms, floor, address, district, status, description
 */
async function importProperties(supabase: any, buffer: Buffer, shopId: string, fileName: string) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

    if (rows.length === 0) {
        return NextResponse.json({ error: 'Файл хоосон байна' }, { status: 400 });
    }

    const properties = [];
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNum = i + 2; // Excel row (header is row 1)

        // Map column names (Mongolian + English)
        const name = row['Нэр'] || row['name'] || row['Name'] || row['Байрны нэр'] || '';
        const price = parseFloat(row['Үнэ'] || row['price'] || row['Price'] || row['Үнэ (₮)'] || 0);

        if (!name) {
            errors.push(`Мөр ${rowNum}: Нэр хоосон`);
            continue;
        }
        if (!price || price <= 0) {
            errors.push(`Мөр ${rowNum}: Үнэ буруу (${name})`);
            continue;
        }

        const type = mapPropertyType(row['Төрөл'] || row['type'] || row['Type'] || 'apartment');
        const status = mapPropertyStatus(row['Статус'] || row['status'] || row['Status'] || 'available');

        properties.push({
            shop_id: shopId,
            name: String(name).trim(),
            description: String(row['Тайлбар'] || row['description'] || row['Description'] || '').trim() || null,
            type,
            price,
            price_per_sqm: parseFloat(row['1м² үнэ'] || row['price_per_sqm'] || 0) || null,
            size_sqm: parseFloat(row['Талбай'] || row['size_sqm'] || row['м²'] || 0) || null,
            rooms: parseInt(row['Өрөө'] || row['rooms'] || row['Rooms'] || 0) || null,
            bedrooms: parseInt(row['Унтлагын өрөө'] || row['bedrooms'] || 0) || null,
            bathrooms: parseInt(row['Угаалгын өрөө'] || row['bathrooms'] || 0) || null,
            floor: String(row['Давхар'] || row['floor'] || row['Floor'] || '').trim() || null,
            address: String(row['Хаяг'] || row['address'] || row['Address'] || '').trim() || null,
            district: String(row['Дүүрэг'] || row['district'] || row['District'] || '').trim() || null,
            status,
            is_active: true,
        });
    }

    if (properties.length === 0) {
        return NextResponse.json({
            error: 'Оруулах өгөгдөл олдсонгүй',
            errors
        }, { status: 400 });
    }

    // Batch insert
    const { data, error } = await supabase
        .from('properties')
        .insert(properties)
        .select('id, name');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        imported: data.length,
        errors: errors.length > 0 ? errors : undefined,
        message: `${data.length} үл хөдлөх амжилттай оруулсан${errors.length > 0 ? `, ${errors.length} алдаа` : ''}`,
    });
}

/**
 * Import FAQ/Knowledge Base entries
 * Expected columns: question, answer
 */
async function importFAQ(supabase: any, buffer: Buffer, shopId: string, fileName: string) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

    const entries = [];
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNum = i + 2;

        const title = row['Асуулт'] || row['question'] || row['Question'] || row['Гарчиг'] || '';
        const content = row['Хариулт'] || row['answer'] || row['Answer'] || row['Агуулга'] || '';

        if (!title || !content) {
            errors.push(`Мөр ${rowNum}: Асуулт эсвэл хариулт хоосон`);
            continue;
        }

        entries.push({
            shop_id: shopId,
            title: String(title).trim(),
            content: String(content).trim(),
            type: 'faq',
            is_active: true,
        });
    }

    if (entries.length === 0) {
        return NextResponse.json({ error: 'FAQ олдсонгүй', errors }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('custom_knowledge')
        .insert(entries)
        .select('id, title');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        imported: data.length,
        errors: errors.length > 0 ? errors : undefined,
        message: `${data.length} FAQ амжилттай оруулсан`,
    });
}

// Helper: Map Mongolian/mixed property types to enum
function mapPropertyType(input: string): string {
    const lower = String(input).toLowerCase().trim();
    const map: Record<string, string> = {
        'apartment': 'apartment', 'орон сууц': 'apartment', 'байр': 'apartment',
        'house': 'house', 'хаус': 'house', 'хашаа байшин': 'house',
        'office': 'office', 'оффис': 'office',
        'land': 'land', 'газар': 'land',
        'commercial': 'commercial', 'худалдааны': 'commercial',
    };
    return map[lower] || 'apartment';
}

// Helper: Map property status
function mapPropertyStatus(input: string): string {
    const lower = String(input).toLowerCase().trim();
    const map: Record<string, string> = {
        'available': 'available', 'боломжтой': 'available', 'чөлөөтэй': 'available', 'зарагдаж байна': 'available',
        'reserved': 'reserved', 'захиалсан': 'reserved', 'захиалагдсан': 'reserved',
        'sold': 'sold', 'зарагдсан': 'sold',
        'rented': 'rented', 'түрээслэсэн': 'rented', 'түрээслэгдсэн': 'rented',
        'barter': 'barter', 'бартер': 'barter', 'солилцоо': 'barter',
    };
    return map[lower] || 'available';
}
