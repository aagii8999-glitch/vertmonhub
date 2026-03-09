/**
 * Role-Based Access Control (RBAC)
 * 
 * Vertmon Hub дотоод ажилчдын хандалтын хяналт.
 * 4 дүр: admin, sales_manager, marketing, viewer
 */

// ============================================
// Types
// ============================================

export type UserRole = 'admin' | 'sales_manager' | 'marketing' | 'viewer';

export interface RolePermissions {
    /** Allowed dashboard modules */
    modules: string[];
    /** Can create/edit data */
    canWrite: boolean;
    /** Can delete data */
    canDelete: boolean;
    /** Can access admin panel */
    canAccessAdmin: boolean;
    /** Display name */
    displayName: string;
    /** Mongolian display name */
    displayNameMN: string;
}

// ============================================
// Module Definitions
// ============================================

/** All dashboard module slugs */
export const ALL_MODULES = [
    'dashboard',
    'ai-assistant',
    'ai-settings',
    'customers',
    'inbox',
    'leads',
    'properties',
    'reports',
    'surveys',
    'settings',
] as const;

export type DashboardModule = typeof ALL_MODULES[number];

// ============================================
// Role → Permission Mapping
// ============================================

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
    admin: {
        modules: [...ALL_MODULES], // all
        canWrite: true,
        canDelete: true,
        canAccessAdmin: true,
        displayName: 'Admin',
        displayNameMN: 'Админ',
    },
    sales_manager: {
        modules: [
            'dashboard',
            'ai-assistant',
            'customers',
            'inbox',
            'leads',
            'orders',
            'products',
            'properties',
            'reports',
        ],
        canWrite: true,
        canDelete: false,
        canAccessAdmin: false,
        displayName: 'Sales Manager',
        displayNameMN: 'Борлуулалтын менежер',
    },
    marketing: {
        modules: [
            'dashboard',
            'ai-assistant',
            'ai-settings',
            'reports',
            'surveys',
        ],
        canWrite: true,
        canDelete: false,
        canAccessAdmin: false,
        displayName: 'Marketing',
        displayNameMN: 'Маркетинг',
    },
    viewer: {
        modules: [
            'dashboard',
            'reports',
        ],
        canWrite: false,
        canDelete: false,
        canAccessAdmin: false,
        displayName: 'Viewer',
        displayNameMN: 'Зөвхөн харагч',
    },
};

// ============================================
// Helper Functions
// ============================================

/** Check if a role can access a specific module */
export function canAccessModule(role: UserRole, module: string): boolean {
    return ROLE_PERMISSIONS[role].modules.includes(module);
}

/** Check if a role has write permissions */
export function canWrite(role: UserRole): boolean {
    return ROLE_PERMISSIONS[role].canWrite;
}

/** Check if a role has delete permissions */
export function canDelete(role: UserRole): boolean {
    return ROLE_PERMISSIONS[role].canDelete;
}

/** Check if a role can access admin panel */
export function canAccessAdmin(role: UserRole): boolean {
    return ROLE_PERMISSIONS[role].canAccessAdmin;
}

/** Get display name for a role */
export function getRoleDisplayName(role: UserRole, locale: 'en' | 'mn' = 'mn'): string {
    const perms = ROLE_PERMISSIONS[role];
    return locale === 'mn' ? perms.displayNameMN : perms.displayName;
}

/** Get allowed modules for a role */
export function getAllowedModules(role: UserRole): string[] {
    return ROLE_PERMISSIONS[role].modules;
}

/** Validate if a string is a valid role */
export function isValidRole(role: string): role is UserRole {
    return ['admin', 'sales_manager', 'marketing', 'viewer'].includes(role);
}
