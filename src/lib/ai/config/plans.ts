/**
 * Vertmon Hub AI Plan Configuration - GPT-5 Family
 * 
 * Strategy: Exclusive use of GPT-5 models across all tiers
 * - Trial: GPT-5 Mini (14 days)
 * - Starter: GPT-5 Nano - ₮149,000/month
 * - Pro: GPT-5 Mini - ₮349,000/month
 * - Ultimate: GPT-5 - ₮999,000/month
 */

export type PlanType = 'trial' | 'starter' | 'pro' | 'ultimate';
export type AIProvider = 'openai';
export type AIModel = 'gpt-5-nano' | 'gpt-5-mini' | 'gpt-5';

// Tool names available for each plan
import type { ToolName } from '../tools/definitions';

/**
 * Plan AI Configuration
 */
export interface PlanAIConfig {
    provider: AIProvider;
    model: AIModel;
    maxTokens: number;
    messagesPerMonth: number;
    trialDays?: number;
    maxShops: number;
    price: {
        mnt: number;
        usd: number;
    };
    features: {
        // AI Core
        toolCalling: boolean;
        vision: boolean;
        memory: boolean;
        salesIntelligence: boolean;

        // Modules
        leadManagement: boolean;
        viewingScheduler: boolean;
        loanCalculator: boolean;
        crmAnalytics: 'none' | 'basic' | 'advanced' | 'full';

        // Tools
        autoTagging: boolean;
        appointmentBooking: boolean;
        bulkMarketing: boolean;
        excelExport: boolean;
        customBranding: boolean;
        hubspotIntegration: boolean;
        prioritySupport: boolean;
    };
    enabledTools: ToolName[];
}

/**
 * Plan configurations - Real Estate focused
 */
export const PLAN_CONFIGS: Record<PlanType, PlanAIConfig> = {
    trial: {
        provider: 'openai',
        model: 'gpt-5-mini',
        maxTokens: 600,
        messagesPerMonth: 1000,
        trialDays: 14,
        maxShops: 1,
        price: { mnt: 0, usd: 0 },
        features: {
            // AI Core
            toolCalling: true,
            vision: true,
            memory: true,
            salesIntelligence: true,

            // Modules
            leadManagement: true,
            viewingScheduler: true,
            loanCalculator: true,
            crmAnalytics: 'advanced',

            // Tools
            autoTagging: true,
            appointmentBooking: true,
            bulkMarketing: false,
            excelExport: true,
            customBranding: false,
            hubspotIntegration: false,
            prioritySupport: false,
        },
        enabledTools: [
            'search_properties',
            'show_property_images',
            'calculate_loan',
            'schedule_viewing',
            'create_lead',
            'collect_contact_info',
            'request_human_support',
            'remember_preference',
        ],
    },

    starter: {
        provider: 'openai',
        model: 'gpt-5-nano',
        maxTokens: 500,
        messagesPerMonth: 2000,
        maxShops: 1,
        price: { mnt: 149000, usd: 44 },
        features: {
            // AI Core
            toolCalling: true,
            vision: true,
            memory: false,
            salesIntelligence: false,

            // Modules
            leadManagement: true,
            viewingScheduler: false,
            loanCalculator: true,
            crmAnalytics: 'basic',

            // Tools
            autoTagging: false,
            appointmentBooking: false,
            bulkMarketing: false,
            excelExport: false,
            customBranding: false,
            hubspotIntegration: false,
            prioritySupport: false,
        },
        enabledTools: [
            'search_properties',
            'show_property_images',
            'calculate_loan',
            'collect_contact_info',
        ],
    },

    pro: {
        provider: 'openai',
        model: 'gpt-5-mini',
        maxTokens: 800,
        messagesPerMonth: 25000,
        maxShops: 3,
        price: { mnt: 349000, usd: 103 },
        features: {
            // AI Core
            toolCalling: true,
            vision: true,
            memory: true,
            salesIntelligence: true,

            // Modules
            leadManagement: true,
            viewingScheduler: true,
            loanCalculator: true,
            crmAnalytics: 'advanced',

            // Tools
            autoTagging: true,
            appointmentBooking: true,
            bulkMarketing: false,
            excelExport: true,
            customBranding: false,
            hubspotIntegration: false,
            prioritySupport: false,
        },
        enabledTools: [
            'search_properties',
            'show_property_images',
            'calculate_loan',
            'schedule_viewing',
            'create_lead',
            'collect_contact_info',
            'request_human_support',
            'remember_preference',
        ],
    },

    ultimate: {
        provider: 'openai',
        model: 'gpt-5',
        maxTokens: 1500,
        messagesPerMonth: 50000,
        maxShops: 1000, // Effectively unlimited
        price: { mnt: 999000, usd: 294 },
        features: {
            // AI Core
            toolCalling: true,
            vision: true,
            memory: true,
            salesIntelligence: true,

            // Modules
            leadManagement: true,
            viewingScheduler: true,
            loanCalculator: true,
            crmAnalytics: 'full',

            // Tools
            autoTagging: true,
            appointmentBooking: true,
            bulkMarketing: true,
            excelExport: true,
            customBranding: true,
            hubspotIntegration: true,
            prioritySupport: true,
        },
        enabledTools: [
            'search_properties',
            'show_property_images',
            'calculate_loan',
            'schedule_viewing',
            'create_lead',
            'collect_contact_info',
            'request_human_support',
            'remember_preference',
        ],
    },
};

/**
 * Get plan config by plan type
 */
export function getPlanConfig(plan: PlanType): PlanAIConfig {
    return PLAN_CONFIGS[plan] || PLAN_CONFIGS.starter;
}

/**
 * Get plan type from subscription status
 */
export function getPlanTypeFromSubscription(subscription?: {
    plan?: string;
    status?: string;
    trial_ends_at?: string;
}): PlanType {
    if (!subscription || subscription.status === 'inactive') {
        return 'trial';
    }

    // Check if still in trial period
    if (subscription.status === 'trial' && subscription.trial_ends_at) {
        const trialEnds = new Date(subscription.trial_ends_at);
        if (trialEnds > new Date()) {
            return 'trial';
        }
    }

    // Only allow Paid plans if status is Active
    if (subscription.status !== 'active') {
        return 'starter';
    }

    const planName = subscription.plan?.toLowerCase();

    if (planName === 'ultimate' || planName === 'enterprise') {
        return 'ultimate';
    }
    if (planName === 'pro' || planName === 'professional') {
        return 'pro';
    }

    return 'starter';
}

/**
 * Check if a tool is enabled for a plan
 */
export function isToolEnabledForPlan(toolName: ToolName, plan: PlanType): boolean {
    const config = getPlanConfig(plan);
    return config.enabledTools.includes(toolName);
}

/**
 * Get enabled tools for a plan
 */
export function getEnabledToolsForPlan(plan: PlanType): ToolName[] {
    return getPlanConfig(plan).enabledTools;
}

/**
 * Check message limit
 */
export function checkMessageLimit(
    plan: PlanType,
    currentCount: number
): { allowed: boolean; remaining: number; limit: number } {
    const config = getPlanConfig(plan);
    const limit = config.messagesPerMonth;
    const remaining = Math.max(0, limit - currentCount);

    return {
        allowed: currentCount < limit,
        remaining,
        limit,
    };
}

/**
 * Check shop limit
 */
export function checkShopLimit(
    plan: PlanType,
    currentCount: number
): { allowed: boolean; remaining: number; limit: number } {
    const config = getPlanConfig(plan);
    const limit = config.maxShops;
    const remaining = Math.max(0, limit - currentCount);

    return {
        allowed: currentCount < limit,
        remaining,
        limit,
    };
}

/**
 * Model display names for UI
 */
export const MODEL_DISPLAY_NAMES: Record<AIModel, string> = {
    'gpt-5-nano': 'GPT-5 Nano',
    'gpt-5-mini': 'GPT-5 Mini',
    'gpt-5': 'GPT-5',
};

/**
 * Plan display names for UI
 */
export const PLAN_DISPLAY_NAMES: Record<PlanType, string> = {
    trial: '14-Day Trial',
    starter: 'Starter',
    pro: 'Pro',
    ultimate: 'Ultimate',
};
