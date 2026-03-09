/**
 * AI Module Exports
 * 
 * Main entry point for AI functionality
 */

// Main AI Router (recommended for new code)
export {
    routeToAI,
    analyzeProductImageWithPlan,
    type RouterChatContext,
    type RouterResponse,
} from './AIRouter';

// AI Configuration (simplified — single config, no plans)
export {
    type AIProvider,
    type AIModel,
    type AIConfig,
    AI_CONFIG,
    getAIConfig,
    isToolEnabled,
    getEnabledTools,
    MODEL_DISPLAY_NAME,
    // Legacy compatibility
    type PlanType,
    type PlanAIConfig,
    PLAN_CONFIGS,
    getPlanConfig,
    getPlanTypeFromSubscription,
    isToolEnabledForPlan,
    getEnabledToolsForPlan,
    checkMessageLimit,
    MODEL_DISPLAY_NAMES,
    PLAN_DISPLAY_NAMES,
} from './config/plans';

// Services
export { buildSystemPrompt } from './services/PromptService';
export { executeTool, type ToolExecutionContext, type ToolExecutionResult } from './services/ToolExecutor';

// Tools
export { AI_TOOLS, type ToolName } from './tools/definitions';
