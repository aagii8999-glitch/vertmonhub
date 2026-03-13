import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserShop } from '@/lib/auth/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/utils/logger';

interface ChatRecord {
    id: string;
    customer_id: string;
    message: string | null;
    response: string | null;
    created_at: string;
}

interface CustomerRecord {
    id: string;
    name: string | null;
}

interface ConversationMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

interface GroupedConversation {
    id: string;
    customer_name: string;
    customer_avatar: string | null;
    last_message: string;
    last_message_at: string;
    unread_count: number;
    messages: ConversationMessage[];
}

export async function GET(request: NextRequest) {
    try {
        const authShop = await getAuthUserShop();

        if (!authShop) {
            return NextResponse.json({ conversations: [] });
        }

        const supabase = supabaseAdmin();
        const shopId = authShop.id;

        // Get all conversations (grouped by customer) with latest message
        const { data: conversations, error: convoError } = await supabase
            .from('chat_history')
            .select('id, customer_id, message, response, created_at')
            .eq('shop_id', shopId)
            .order('created_at', { ascending: false })
            .limit(200);

        if (convoError) {
            logger.error('Error fetching conversations:', { error: convoError });
            return NextResponse.json({ error: 'Failed to fetch conversations', details: convoError.message }, { status: 500 });
        }

        // Fetch customer names separately
        const customerIds = [...new Set((conversations || []).map((c: ChatRecord) => c.customer_id).filter(Boolean))];
        const { data: customers } = customerIds.length > 0
            ? await supabase.from('customers').select('id, name').in('id', customerIds)
            : { data: [] };

        const customerNameMap = new Map((customers || []).map((c: CustomerRecord) => [c.id, c.name]));

        // Group messages by customer_id and get latest info
        const customerMap = new Map<string, GroupedConversation>();

        (conversations as ChatRecord[] | null)?.forEach((chat) => {
            const customerId = chat.customer_id;
            if (!customerMap.has(customerId)) {
                customerMap.set(customerId, {
                    id: customerId,
                    customer_name: customerNameMap.get(customerId) || 'Зочин',
                    customer_avatar: null,
                    last_message: chat.message || chat.response || '',
                    last_message_at: chat.created_at,
                    unread_count: 0,
                    messages: []
                });
            }

            // Each chat record has both user message and assistant response
            const msgs = customerMap.get(customerId)!.messages;

            // Add user message if exists
            if (chat.message) {
                msgs.push({
                    id: `${chat.id}-user`,
                    role: 'user',
                    content: chat.message,
                    created_at: chat.created_at
                });
            }

            // Add assistant response if exists
            if (chat.response) {
                msgs.push({
                    id: `${chat.id}-assistant`,
                    role: 'assistant',
                    content: chat.response,
                    created_at: chat.created_at
                });
            }
        });

        // Convert map to array for response
        const groupedConversations = Array.from(customerMap.values());

        return NextResponse.json({ conversations: groupedConversations });
    } catch (error: unknown) {
        logger.error('Conversations API error:', { error: error });
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
