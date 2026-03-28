import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserShop } from '@/lib/auth/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { sendTextMessage, sendTaggedMessage } from '@/lib/facebook/messenger';
import { logger } from '@/lib/utils/logger';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        // Step 1: Authenticate
        let shopId: string | null = null;

        const authShop = await getAuthUserShop();

        if (authShop) {
            shopId = authShop.id;
        } else {
            // Fallback: use x-shop-id header directly (for custom auth sessions)
            const headerList = await headers();
            const headerShopId = headerList.get('x-shop-id');
            if (headerShopId) {
                logger.info('Reply API: using x-shop-id header fallback', { shopId: headerShopId });
                shopId = headerShopId;
            }
        }

        if (!shopId) {
            logger.error('Reply API: No auth - getAuthUserShop returned null and no x-shop-id header');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { customerId, message } = await request.json();

        if (!customerId || !message) {
            return NextResponse.json({ error: 'customerId and message are required' }, { status: 400 });
        }

        const supabase = supabaseAdmin();

        // Step 2: Get customer's Facebook ID
        const { data: customer, error: customerError } = await supabase
            .from('customers')
            .select('facebook_id, name')
            .eq('id', customerId)
            .eq('shop_id', shopId)
            .single();

        if (customerError || !customer) {
            logger.error('Customer not found for reply', { customerId, shopId, error: customerError?.message });
            return NextResponse.json({ error: `Хэрэглэгч олдсонгүй (ID: ${customerId})` }, { status: 404 });
        }

        if (!customer.facebook_id) {
            logger.error('Customer has no facebook_id', { customerId, customerName: customer.name });
            return NextResponse.json({ error: `${customer.name || 'Хэрэглэгч'}-д Facebook ID байхгүй байна. Messenger-ээр мессеж илгээх боломжгүй.` }, { status: 400 });
        }

        // Step 3: Get shop's Facebook page access token
        const { data: shop, error: shopError } = await supabase
            .from('shops')
            .select('facebook_page_access_token, name')
            .eq('id', shopId)
            .single();

        if (shopError || !shop?.facebook_page_access_token) {
            logger.error('Shop not configured with Facebook', { shopId, error: shopError?.message });
            return NextResponse.json({ error: 'Shop not configured with Facebook' }, { status: 400 });
        }

        // Step 4: Send message to Facebook Messenger
        logger.info('Reply API: Sending message', {
            shopName: shop.name,
            customerName: customer.name,
            recipientId: customer.facebook_id,
            messageLength: message.length,
        });

        try {
            await sendTextMessage({
                recipientId: customer.facebook_id,
                message: message,
                pageAccessToken: shop.facebook_page_access_token,
            });
        } catch (sendError: unknown) {
            // Fallback: try tagged message (bypasses 24-hour window)
            logger.warn('Reply API: Standard message failed, trying tagged message', {
                error: sendError instanceof Error ? sendError.message : 'Unknown',
            });
            await sendTaggedMessage({
                recipientId: customer.facebook_id,
                message: message,
                pageAccessToken: shop.facebook_page_access_token,
                tag: 'ACCOUNT_UPDATE',
            });
        }

        // Step 5: Save message to chat_history
        const { error: insertError } = await supabase.from('chat_history').insert({
            shop_id: shopId,
            customer_id: customerId,
            message: '', // User message is empty for shop replies
            response: message, // Shop's reply goes in response
            intent: 'human_reply',
        });

        if (insertError) {
            logger.warn('Reply API: chat_history insert failed (non-blocking)', { error: insertError.message });
        }

        // Step 6: Admin Takeover: Pause AI for 30 minutes
        const pauseTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
        await supabase
            .from('customers')
            .update({ ai_paused_until: pauseTime })
            .eq('id', customerId);

        logger.info('Reply API: Message sent successfully', { shopId, customerId });

        return NextResponse.json({ success: true, message: 'Message sent successfully' });
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        const errStack = error instanceof Error ? error.stack : undefined;
        logger.error('Reply API error:', { error: errMsg, stack: errStack });
        return NextResponse.json({
            error: 'Failed to send message',
            details: errMsg,
        }, { status: 500 });
    }
}
