/**
 * ToolExecutor - Handles execution of AI tool calls
 * Extracted from openai.ts generateChatResponse function
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/utils/logger';
import { sendOrderNotification, sendPushNotification } from '@/lib/notifications';
import { checkProductStock, getProductFromDB, addItemToCart, getCartFromDB } from '../helpers/stockHelpers';
import type { ChatContext, ImageAction } from '@/types/ai';
import type {
    CreateOrderArgs,
    CollectContactArgs,
    RequestHumanSupportArgs,
    CancelOrderArgs,
    ShowProductImageArgs,
    AddToCartArgs,
    RemoveFromCartArgs,
    CheckoutArgs,
    RememberPreferenceArgs,
    CheckPaymentArgs,
    ToolName,
} from '../tools/definitions';
import { saveCustomerPreference } from '../tools/memory';

/**
 * Result of tool execution
 */
export interface ToolExecutionResult {
    success: boolean;
    message?: string;
    error?: string;
    data?: Record<string, unknown>;
    imageAction?: ImageAction;
    quickReplies?: Array<{ title: string; payload: string }>;  // Quick reply buttons
}

/**
 * Tool execution context
 */
export interface ToolExecutionContext {
    shopId: string;
    customerId?: string;
    customerName?: string;
    products: ChatContext['products'];
    notifySettings?: ChatContext['notifySettings'];
}

/**
 * Execute collect_contact_info tool
 */
export async function executeCollectContact(
    args: CollectContactArgs,
    context: ToolExecutionContext
): Promise<ToolExecutionResult> {
    const { phone, address, name } = args;

    if (!context.customerId) {
        return { success: false, error: 'No customer context' };
    }

    const supabase = supabaseAdmin();
    const updateData: Record<string, string> = {};

    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (name) updateData.name = name;

    if (Object.keys(updateData).length === 0) {
        return { success: true, message: 'No info to save' };
    }

    const { error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', context.customerId);

    if (error) {
        logger.error('Contact save error:', { error });
        return { success: false, error: error.message };
    }

    logger.info('Contact info saved to CRM:', updateData);

    // Send notification
    if (context.notifySettings?.contact !== false) {
        await sendPushNotification(context.shopId, {
            title: '📍 Хаяг мэдээлэл ирлээ',
            body: `${name || 'Хэрэглэгч'} мэдээллээ үлдээлээ: ${phone || ''} ${address || ''}`,
            url: `/dashboard/customers/${context.customerId}`,
            tag: `contact-${context.customerId}`
        });
    }

    return {
        success: true,
        message: `Saved: ${phone ? 'phone ' : ''}${address ? 'address ' : ''}${name ? 'name' : ''}`
    };
}

/**
 * Execute request_human_support tool
 */
export async function executeRequestSupport(
    args: RequestHumanSupportArgs,
    context: ToolExecutionContext
): Promise<ToolExecutionResult> {
    const { reason } = args;

    if (context.notifySettings?.support !== false) {
        await sendPushNotification(context.shopId, {
            title: '📞 Холбогдох хүсэлт',
            body: `Хэрэглэгч холбогдох хүсэлт илгээлээ. Шалтгаан: ${reason || 'Тодорхойгүй'}`,
            url: `/dashboard/chat?customer=${context.customerId}`,
            tag: `support-${context.customerId}`
        });
    }

    return { success: true, message: 'Support request notified.' };
}

/**
 * Execute create_order tool
 */
export async function executeCreateOrder(
    args: CreateOrderArgs,
    context: ToolExecutionContext
): Promise<ToolExecutionResult> {
    const { product_name, quantity, color, size } = args;
    const supabase = supabaseAdmin();

    // Find product from context
    const product = context.products.find(p =>
        p.name.toLowerCase().includes(product_name.toLowerCase())
    );

    if (!product) {
        return { success: false, error: `Product "${product_name}" not found.` };
    }

    // Verify stock from DB
    const { data: dbProduct } = await supabase
        .from('products')
        .select('stock, reserved_stock, price, id')
        .eq('id', product.id)
        .single();

    const availableStock = (dbProduct?.stock || 0) - (dbProduct?.reserved_stock || 0);
    if (!dbProduct || availableStock < quantity) {
        return { success: false, error: `Not enough stock. Only ${availableStock} available.` };
    }

    if (!context.shopId || !context.customerId) {
        return { success: false, error: 'Missing shop or customer ID context.' };
    }

    // Create order


    // Check for duplicate pending orders (Idempotency)
    // If a pending order for same product/customer exists created in last 30s, return it
    const thirtySecondsAgo = new Date(Date.now() - 30000).toISOString();
    const { data: existingOrder } = await supabase
        .from('orders')
        .select('id, total_amount')
        .eq('customer_id', context.customerId)
        .eq('shop_id', context.shopId)
        .eq('status', 'pending')
        .gt('created_at', thirtySecondsAgo)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (existingOrder) {
        // Double check if it contains the same product
        const { data: verifyItem } = await supabase
            .from('order_items')
            .select('product_id')
            .eq('order_id', existingOrder.id)
            .eq('product_id', product.id)
            .single();

        if (verifyItem) {
            logger.info('Duplicate order prevented, returning existing:', { orderId: existingOrder.id });
            return {
                success: true,
                message: `Success! Order #${existingOrder.id.substring(0, 8)} created (Found existing). Total: ${existingOrder.total_amount.toLocaleString()}₮.`,
                data: { orderId: existingOrder.id, total: existingOrder.total_amount }
            };
        }
    }

    // Create order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            shop_id: context.shopId,
            customer_id: context.customerId,
            status: 'pending',
            total_amount: dbProduct.price * quantity,
            notes: `AI Order: ${product_name} (${color || ''} ${size || ''})`,
            created_at: new Date().toISOString()
        })
        .select()
        .single();

    if (orderError) {
        logger.error('Order creation error:', { error: orderError });
        return { success: false, error: orderError.message };
    }

    // Create order item
    await supabase.from('order_items').insert({
        order_id: order.id,
        product_id: product.id,
        quantity: quantity,
        unit_price: dbProduct.price,
        color: color || null,
        size: size || null
    });

    // Reserve stock
    await supabase
        .from('products')
        .update({ reserved_stock: (dbProduct.reserved_stock || 0) + quantity })
        .eq('id', product.id);

    // Send notification
    if (context.notifySettings?.order !== false) {
        try {
            await sendOrderNotification(context.shopId, 'new', {
                orderId: order.id,
                customerName: context.customerName,
                totalAmount: dbProduct.price * quantity,
            });
        } catch (notifError) {
            logger.warn('Failed to send order notification:', { error: String(notifError) });
        }
    }

    return {
        success: true,
        message: `Success! Order #${order.id.substring(0, 8)} created. Total: ${(dbProduct.price * quantity).toLocaleString()}₮. Stock reserved.`,
        data: { orderId: order.id, total: dbProduct.price * quantity }
    };
}

/**
 * Execute cancel_order tool
 */
export async function executeCancelOrder(
    args: CancelOrderArgs,
    context: ToolExecutionContext
): Promise<ToolExecutionResult> {
    const { reason } = args;
    const supabase = supabaseAdmin();

    if (!context.customerId) {
        return { success: false, error: 'No customer context' };
    }

    // Find pending order
    const { data: pendingOrder } = await supabase
        .from('orders')
        .select(`id, status, total_amount, order_items (product_id, quantity)`)
        .eq('customer_id', context.customerId)
        .eq('shop_id', context.shopId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (!pendingOrder) {
        return { success: false, error: 'No pending order found to cancel' };
    }

    // Cancel order
    await supabase
        .from('orders')
        .update({ status: 'cancelled', notes: `Cancelled by customer. Reason: ${reason || 'Not specified'}` })
        .eq('id', pendingOrder.id);

    // Restore stock
    for (const item of (pendingOrder.order_items as any[] || [])) {
        const { data: product } = await supabase
            .from('products')
            .select('reserved_stock')
            .eq('id', item.product_id)
            .single();

        if (product) {
            await supabase
                .from('products')
                .update({ reserved_stock: Math.max(0, (product.reserved_stock || 0) - item.quantity) })
                .eq('id', item.product_id);
        }
    }

    // Send notification
    if (context.notifySettings?.cancel !== false) {
        await sendPushNotification(context.shopId, {
            title: '❌ Захиалга цуцлагдлаа',
            body: `${context.customerName || 'Хэрэглэгч'} захиалгаа цуцаллаа. Шалтгаан: ${reason || 'Тодорхойгүй'}`,
            url: '/dashboard/orders',
            tag: `cancel-${pendingOrder.id}`
        });
    }

    logger.info('Order cancelled and stock restored:', { orderId: pendingOrder.id });

    return {
        success: true,
        message: `Order #${pendingOrder.id.substring(0, 8)} cancelled. Stock restored.`
    };
}

/**
 * Execute show_product_image tool
 */
export function executeShowProductImage(
    args: ShowProductImageArgs,
    context: ToolExecutionContext
): ToolExecutionResult {
    const { product_names, mode } = args;

    const matchedProducts = product_names
        .map(name => {
            const product = context.products.find(p =>
                p.name.toLowerCase().includes(name.toLowerCase()) ||
                name.toLowerCase().includes(p.name.toLowerCase())
            );

            // Resolving image URL: Try images array first, then fallback to image_url
            const imageUrl = (product && product.images && product.images.length > 0)
                ? product.images[0]
                : (product && product.image_url);

            if (product) {
                // FALLBACK: Use placeholder if no image
                const finalImageUrl = imageUrl || 'https://placehold.co/600x400?text=No+Image';
                return {
                    name: product.name,
                    price: product.price,
                    imageUrl: finalImageUrl,
                    description: product.description,
                };
            }
            return null;
        })
        .filter((p): p is NonNullable<typeof p> => p !== null);

    if (matchedProducts.length > 0) {
        return {
            success: true,
            message: `Showing ${matchedProducts.length} product image(s) in ${mode} mode.`,
            imageAction: { type: mode, products: matchedProducts }
        };
    }

    return {
        success: false,
        // Changed error to a soft message so AI can say "I couldn't find an image" gracefully
        error: 'Зурагтай бүтээгдэхүүн олдсонгүй.'
    };
}

/**
 * Execute add_to_cart tool
 */
export async function executeAddToCart(
    args: AddToCartArgs,
    context: ToolExecutionContext
): Promise<ToolExecutionResult> {
    const { product_name, quantity = 1, color, size } = args;
    const supabase = supabaseAdmin();

    if (!context.customerId) {
        return { success: false, error: 'No customer context' };
    }

    // Get product from DB
    const product = await getProductFromDB(context.shopId, product_name);
    if (!product) {
        return { success: false, error: `"${product_name}" олдсонгүй` };
    }

    // Check stock
    const stockCheck = await checkProductStock(product.id, quantity);
    if (!stockCheck.available) {
        return { success: false, error: `Үлдэгдэл хүрэлцэхгүй. Боломжит: ${stockCheck.currentStock}` };
    }

    // Get or create cart
    const { data: cartId } = await supabase.rpc('get_or_create_cart', {
        p_shop_id: context.shopId,
        p_customer_id: context.customerId
    });

    // Calculate price
    const discountedPrice = product.discount_percent
        ? Math.round(product.price * (1 - product.discount_percent / 100))
        : product.price;

    const variantSpecs: Record<string, string> = {};
    if (color) variantSpecs.color = color;
    if (size) variantSpecs.size = size;

    // Add to cart
    const result = await addItemToCart(cartId, product.id, variantSpecs, quantity, discountedPrice);

    // Get updated total
    const { data: total } = await supabase.rpc('calculate_cart_total', { p_cart_id: cartId });

    // Stock urgency hint
    let urgencyHint = '';
    if (stockCheck.currentStock <= 3) {
        urgencyHint = ` ⚠️ Зөвхөн ${stockCheck.currentStock} ширхэг үлдлээ!`;
    }

    return {
        success: true,
        message: `${product.name} (${result.newQuantity}ш) сагсанд нэмэгдлээ!${urgencyHint} Нийт: ${total?.toLocaleString()}₮`,
        data: { cart_total: total, stock_remaining: stockCheck.currentStock },
        quickReplies: [
            { title: '💳 Төлбөр төлөх', payload: 'CHECKOUT' },
            { title: '🛒 Сагс харах', payload: 'VIEW_CART' },
            { title: '🔙 Үргэлжлүүлэх', payload: 'CONTINUE_SHOPPING' }
        ]
    };
}

/**
 * Execute view_cart tool
 */
export async function executeViewCart(
    context: ToolExecutionContext
): Promise<ToolExecutionResult> {
    if (!context.customerId) {
        return { success: false, error: 'No customer context' };
    }

    const cart = await getCartFromDB(context.shopId, context.customerId);

    if (!cart || cart.items.length === 0) {
        return {
            success: true,
            message: 'Таны сагс хоосон байна.',
            data: { items: [], total: 0 }
        };
    }

    const summary = cart.items
        .map(item => `• ${item.name} x${item.quantity} = ${(item.unit_price * item.quantity).toLocaleString()}₮`)
        .join('\n');

    return {
        success: true,
        message: `Таны сагс:\n${summary}\n\nНийт: ${cart.total_amount.toLocaleString()}₮`,
        data: { items: cart.items, total: cart.total_amount },
        quickReplies: [
            { title: '💳 Төлбөр төлөх', payload: 'CHECKOUT' },
            { title: '➕ Бараа нэмэх', payload: 'ADD_MORE' },
            { title: '🗑️ Цэвэрлэх', payload: 'CLEAR_CART' }
        ]
    };
}

/**
 * Execute remove_from_cart tool
 */
export async function executeRemoveFromCart(
    args: RemoveFromCartArgs,
    context: ToolExecutionContext
): Promise<ToolExecutionResult> {
    const { product_name } = args;
    const supabase = supabaseAdmin();

    if (!context.customerId) {
        return { success: false, error: 'No customer context' };
    }

    const cart = await getCartFromDB(context.shopId, context.customerId);

    if (!cart || cart.items.length === 0) {
        return { success: false, error: 'Сагс хоосон байна' };
    }

    const item = cart.items.find(i => i.name.toLowerCase().includes(product_name.toLowerCase()));

    if (!item) {
        return { success: false, error: `"${product_name}" сагсанд олдсонгүй` };
    }

    await supabase.from('cart_items').delete().eq('id', item.id);

    return { success: true, message: `${item.name} сагснаас хасагдлаа` };
}

/**
 * Execute checkout tool
 */
export async function executeCheckout(
    args: CheckoutArgs,
    context: ToolExecutionContext
): Promise<ToolExecutionResult> {
    const { notes } = args;
    const supabase = supabaseAdmin();

    if (!context.customerId) {
        return { success: false, error: 'No customer context' };
    }

    const cart = await getCartFromDB(context.shopId, context.customerId);

    if (!cart || cart.items.length === 0) {
        return { success: false, error: 'Сагс хоосон байна. Эхлээд бараа нэмнэ үү.' };
    }

    const { data: orderId, error: checkoutError } = await supabase.rpc('checkout_cart', {
        p_cart_id: cart.id,
        p_notes: notes || 'AI Chat Checkout'
    });

    if (checkoutError) {
        logger.error('Checkout error:', { error: checkoutError });
        return { success: false, error: checkoutError.message };
    }

    let bankInfo = null;

    try {
        // Fetch Shop Bank Info
        const { data: shop } = await supabase
            .from('shops')
            .select('bank_name, account_number, account_name')
            .eq('id', context.shopId)
            .single();

        bankInfo = shop;
    } catch (err) {
        logger.warn('Failed to fetch bank info:', { error: String(err) });
    }

    // Send notification
    if (context.notifySettings?.order !== false) {
        try {
            await sendOrderNotification(context.shopId, 'new', {
                orderId: orderId,
                customerName: context.customerName,
                totalAmount: cart.total_amount,
            });
        } catch (notifyError) {
            logger.warn('Notification failed but order created:', { error: String(notifyError) });
        }
    }

    // Construct Payment Instructions (Bank only - no QPay)
    let paymentMsg = `Захиалга #${orderId.substring(0, 8)} амжилттай үүслээ! Нийт: ${cart.total_amount.toLocaleString()}₮\n\nТөлбөр төлөх:`;

    // Bank Transfer
    if (bankInfo && bankInfo.account_number) {
        paymentMsg += `\n\nДансны шилжүүлэг:\nБанк: ${bankInfo.bank_name || 'Банк'}\nДанс: ${bankInfo.account_number}\nНэр: ${bankInfo.account_name || 'Дэлгүүр'}\nГүйлгээний утга: ${orderId.substring(0, 8)}`;
        paymentMsg += `\n\n*Дансаар шилжүүлсэн бол баримтаа илгээнэ үү.`;
    } else {
        paymentMsg += `\n\nМанай менежертэй холбогдож төлбөрийн мэдээлэл авна уу.`;
    }

    return {
        success: true,
        message: paymentMsg,
        data: {
            order_id: orderId,
            bank: bankInfo
        }
    };
}

/**
 * Execute remember_preference tool - Save customer preference to memory
 */
export async function executeRememberPreference(
    args: RememberPreferenceArgs,
    context: ToolExecutionContext
): Promise<ToolExecutionResult> {
    const { key, value } = args;

    if (!context.customerId) {
        return { success: false, error: 'No customer context' };
    }

    const result = await saveCustomerPreference(context.customerId, key, value);

    if (!result.success) {
        return { success: false, error: result.error };
    }

    logger.info('Customer preference saved:', { customerId: context.customerId, key, value });

    return {
        success: true,
        message: `Санах ойд хадгаллаа: ${key} = ${value}`,
        data: { key, value }
    };
}

/**
 * Execute check_payment_status tool (Manual check without QPay)
 */
export async function executeCheckPaymentStatus(
    args: CheckPaymentArgs,
    context: ToolExecutionContext
): Promise<ToolExecutionResult> {
    const supabase = supabaseAdmin();

    if (!context.customerId) {
        return { success: false, error: 'No customer context' };
    }

    // Find recent pending orders
    let query = supabase
        .from('orders')
        .select('id, status, total_amount, created_at')
        .eq('shop_id', context.shopId)
        .eq('customer_id', context.customerId)
        .in('status', ['pending', 'paid']);

    if (args.order_id) {
        query = query.eq('id', args.order_id);
    } else {
        query = query.order('created_at', { ascending: false }).limit(3);
    }

    const { data: orders } = await query;

    if (!orders || orders.length === 0) {
        return { success: false, error: 'Захиалга олдсонгүй.' };
    }

    const paidOrders = orders.filter(o => o.status === 'paid');
    const pendingOrders = orders.filter(o => o.status === 'pending');

    if (paidOrders.length > 0) {
        return {
            success: true,
            message: `Төлбөр баталгаажсан захиалга: ${paidOrders.map(o => '#' + o.id.substring(0, 8)).join(', ')} ✅`,
            data: { paid_orders: paidOrders.map(o => o.id) }
        };
    }

    return {
        success: true,
        message: `Төлөгдөөгүй захиалга: ${pendingOrders.map(o => '#' + o.id.substring(0, 8) + ' (' + o.total_amount.toLocaleString() + '₮)').join(', ')}. Төлбөр хийсний дараа менежер баталгаажуулна.`,
        data: { pending_orders: pendingOrders.map(o => o.id) }
    };
}

/**
 * Main tool executor - routes to appropriate handler
 */
export async function executeTool(
    toolName: ToolName,
    args: unknown,
    context: ToolExecutionContext
): Promise<ToolExecutionResult> {
    try {
        switch (toolName) {
            case 'collect_contact_info':
                return await executeCollectContact(args as CollectContactArgs, context);
            case 'request_human_support':
                return await executeRequestSupport(args as RequestHumanSupportArgs, context);
            case 'create_order':
                return await executeCreateOrder(args as CreateOrderArgs, context);
            case 'cancel_order':
                return await executeCancelOrder(args as CancelOrderArgs, context);
            case 'show_product_image':
                return executeShowProductImage(args as ShowProductImageArgs, context);
            case 'add_to_cart':
                return await executeAddToCart(args as AddToCartArgs, context);
            case 'view_cart':
                return await executeViewCart(context);
            case 'remove_from_cart':
                return await executeRemoveFromCart(args as RemoveFromCartArgs, context);
            case 'checkout':
                return await executeCheckout(args as CheckoutArgs, context);
            case 'remember_preference':
                return await executeRememberPreference(args as RememberPreferenceArgs, context);
            case 'check_payment_status':
                return await executeCheckPaymentStatus(args as CheckPaymentArgs, context);
            default:
                return { success: false, error: `Unknown tool: ${toolName}` };
        }
    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Tool execution error (${toolName}):`, { error: errorMessage });
        return { success: false, error: errorMessage };
    }
}
