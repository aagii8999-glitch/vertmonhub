/**
 * Admin Settings API
 * System configuration management
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/utils/logger';

// GET - Get all settings
export async function GET() {
    try {
        const admin = await getAdminUser();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Return system settings
        // In production, these would come from a settings table
        const settings = {
            general: {
                site_name: 'Syncly',
                support_email: 'support@smarthub.mn',
                default_currency: 'MNT'
            },
            notifications: {
                email_enabled: true,
                push_enabled: true,
                sms_enabled: false
            },
            billing: {
                trial_days: 14,
                grace_period_days: 7,
                auto_suspend: true
            },
            ai: {
                default_provider: 'gemini' as const,
                default_model: 'gemini-3.1-flash-lite-preview',
                max_tokens: 4096,
                temperature: 0.7
            }
        };

        return NextResponse.json({ settings, admin: { email: admin.email, role: admin.role } });
    } catch (error: unknown) {
        logger.error('Settings fetch error:', { error: error });
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
    try {
        const admin = await getAdminUser();
        if (!admin || admin.role !== 'super_admin') {
            return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
        }

        const body = await request.json();

        // In production, save to database
        // For now, just acknowledge the update

        return NextResponse.json({
            success: true,
            message: 'Settings updated',
            settings: body
        });
    } catch (error: unknown) {
        logger.error('Settings update error:', { error: error });
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
