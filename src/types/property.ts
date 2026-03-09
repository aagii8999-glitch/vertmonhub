/**
 * Property Types for Vertmon Hub Real Estate Platform
 */

// Property type enum
export type PropertyType = 'apartment' | 'house' | 'office' | 'land' | 'commercial';

// Property status enum
export type PropertyStatus = 'available' | 'reserved' | 'sold' | 'rented' | 'barter';

// Lead status enum
export type LeadStatus = 'new' | 'contacted' | 'viewing_scheduled' | 'offered' | 'negotiating' | 'closed_won' | 'closed_lost';

// Lead source
export type LeadSource = 'messenger' | 'instagram' | 'website' | 'referral' | 'phone' | 'other';

/**
 * Property Interface
 */
export interface Property {
    id: string;
    shop_id: string;

    // Basic Info
    name: string;
    description: string | null;
    type: PropertyType;

    // Pricing
    price: number;
    price_per_sqm: number | null;
    currency: string;

    // Specifications
    size_sqm: number | null;
    rooms: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    floor: string | null;
    year_built: number | null;

    // Location
    address: string | null;
    district: string | null;
    city: string;
    location_lat: number | null;
    location_lng: number | null;

    // Status
    status: PropertyStatus;
    is_active: boolean;
    is_featured: boolean;

    // Media
    images: string[];
    video_url: string | null;
    virtual_tour_url: string | null;

    // Features
    features: string[];
    amenities: string[];

    // Meta
    views_count: number;
    inquiries_count: number;

    // Timestamps
    created_at: string;
    updated_at: string;
}

/**
 * Lead Interface (Real Estate CRM)
 */
export interface Lead {
    id: string;
    shop_id: string;
    customer_id: string | null;
    property_id: string | null;

    // Lead Info
    status: LeadStatus;
    source: LeadSource;

    // Customer Info
    customer_name: string | null;
    customer_phone: string | null;
    customer_email: string | null;

    // Requirements
    budget_min: number | null;
    budget_max: number | null;
    preferred_type: PropertyType | null;
    preferred_district: string | null;
    preferred_rooms: number | null;
    preferred_size_min: number | null;
    preferred_size_max: number | null;

    // Timeline
    move_in_date: string | null;
    urgency: 'urgent' | 'normal' | 'flexible';

    // CRM Integration
    hubspot_deal_id: string | null;
    hubspot_contact_id: string | null;

    // Activity
    last_contact_at: string | null;
    next_followup_at: string | null;
    viewing_scheduled_at: string | null;

    // Notes
    notes: string | null;
    internal_notes: string | null;

    // Assignment
    assigned_to: string | null;

    // Conversion
    converted_at: string | null;
    conversion_value: number | null;

    // Timestamps
    created_at: string;
    updated_at: string;
}

/**
 * Property Viewing Interface
 */
export interface PropertyViewing {
    id: string;
    lead_id: string | null;
    property_id: string;

    // Scheduling
    scheduled_at: string;
    duration_minutes: number;

    // Status
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';

    // Feedback
    customer_feedback: string | null;
    agent_notes: string | null;
    interest_level: number | null;

    // Timestamps
    created_at: string;
    completed_at: string | null;
}

/**
 * Property Search Filters
 */
export interface PropertySearchFilters {
    type?: PropertyType;
    status?: PropertyStatus;
    min_price?: number;
    max_price?: number;
    min_size?: number;
    max_size?: number;
    rooms?: number;
    district?: string;
    city?: string;
    is_featured?: boolean;
}

/**
 * Loan Calculator Input
 */
export interface LoanCalculatorInput {
    amount: number;      // Principal amount
    rate: number;        // Annual interest rate (%)
    years: number;       // Loan term in years
}

/**
 * Loan Calculator Result
 */
export interface LoanCalculatorResult {
    monthly_payment: number;
    total_payment: number;
    total_interest: number;
    principal: number;
}
