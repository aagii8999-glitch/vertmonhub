/**
 * AI Tool Definitions for Vertmon Hub
 * Real Estate Platform AI Function Calling Tools
 */

import OpenAI from 'openai';

/**
 * All available AI tools for function calling
 */
export const AI_TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    // ============================================
    // REAL ESTATE TOOLS
    // ============================================
    {
        type: 'function',
        function: {
            name: 'search_properties',
            description: 'Хэрэглэгчийн хүсэлтээр үл хөдлөх хөрөнгө хайх. Үнэ, хэмжээ, өрөөний тоо, байршил зэргээр шүүж болно.',
            parameters: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        enum: ['apartment', 'house', 'office', 'land', 'commercial'],
                        description: 'Үл хөдлөхийн төрөл'
                    },
                    min_price: {
                        type: 'number',
                        description: 'Хамгийн бага үнэ (MNT)'
                    },
                    max_price: {
                        type: 'number',
                        description: 'Хамгийн их үнэ (MNT)'
                    },
                    rooms: {
                        type: 'number',
                        description: 'Өрөөний тоо'
                    },
                    district: {
                        type: 'string',
                        description: 'Дүүрэг/Байршил (ЧД, БЗД, СХД, ХУД гэх мэт)'
                    },
                    min_size: {
                        type: 'number',
                        description: 'Хамгийн бага талбай (м²)'
                    },
                    max_size: {
                        type: 'number',
                        description: 'Хамгийн их талбай (м²)'
                    },
                    limit: {
                        type: 'number',
                        description: 'Хэдэн үр дүн харуулах (default: 5)'
                    }
                },
                required: []
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'show_property_images',
            description: 'Тодорхой үл хөдлөхийн зураг харуулах. Хэрэглэгч зураг үзэхийг хүссэн үед.',
            parameters: {
                type: 'object',
                properties: {
                    property_id: {
                        type: 'string',
                        description: 'Үл хөдлөхийн ID'
                    },
                    property_name: {
                        type: 'string',
                        description: 'Үл хөдлөхийн нэр (ID байхгүй бол)'
                    }
                },
                required: []
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'calculate_loan',
            description: 'Ипотекийн зээлийн сарын төлбөр тооцоолох. Хэрэглэгч зээлийн тооцоо асуухад ашиглана.',
            parameters: {
                type: 'object',
                properties: {
                    amount: {
                        type: 'number',
                        description: 'Зээлийн дүн (MNT)'
                    },
                    rate: {
                        type: 'number',
                        description: 'Жилийн хүү (%, жишээ: 12.5)'
                    },
                    years: {
                        type: 'number',
                        description: 'Зээлийн хугацаа (жил)'
                    },
                    down_payment: {
                        type: 'number',
                        description: 'Урьдчилгаа төлбөр (MNT, optional)'
                    }
                },
                required: ['amount', 'years']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'schedule_viewing',
            description: 'Үл хөдлөх үзэх уулзалт товлох. Хэрэглэгч үзлэг хийхийг хүссэн үед.',
            parameters: {
                type: 'object',
                properties: {
                    property_id: {
                        type: 'string',
                        description: 'Үл хөдлөхийн ID'
                    },
                    property_name: {
                        type: 'string',
                        description: 'Үл хөдлөхийн нэр (ID байхгүй бол)'
                    },
                    preferred_date: {
                        type: 'string',
                        description: 'Хүссэн огноо (YYYY-MM-DD эсвэл "маргааш", "ирэх долоо хоногт")'
                    },
                    preferred_time: {
                        type: 'string',
                        description: 'Хүссэн цаг (10:00, өглөө, үдээс хойш гэх мэт)'
                    },
                    customer_phone: {
                        type: 'string',
                        description: 'Хэрэглэгчийн утас'
                    }
                },
                required: ['property_name']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'create_lead',
            description: 'Шинэ lead/сонирхогч үүсгэх. Хэрэглэгч үл хөдлөхийн талаар сонирхол илэрхийлэхэд автоматаар үүсгэнэ.',
            parameters: {
                type: 'object',
                properties: {
                    property_id: {
                        type: 'string',
                        description: 'Сонирхсон үл хөдлөхийн ID'
                    },
                    budget_min: {
                        type: 'number',
                        description: 'Төсвийн доод хязгаар'
                    },
                    budget_max: {
                        type: 'number',
                        description: 'Төсвийн дээд хязгаар'
                    },
                    preferred_type: {
                        type: 'string',
                        enum: ['apartment', 'house', 'office', 'land', 'commercial'],
                        description: 'Хүссэн төрөл'
                    },
                    preferred_district: {
                        type: 'string',
                        description: 'Хүссэн байршил'
                    },
                    preferred_rooms: {
                        type: 'number',
                        description: 'Хүссэн өрөөний тоо'
                    },
                    notes: {
                        type: 'string',
                        description: 'Нэмэлт тэмдэглэл'
                    }
                },
                required: []
            }
        }
    },
    // ============================================
    // GENERAL TOOLS (Keep from original)
    // ============================================
    {
        type: 'function',
        function: {
            name: 'collect_contact_info',
            description: 'Хэрэглэгчийн холбоо барих мэдээлэл хадгалах. Утас, имэйл, хаяг өгөхөд ашиглана.',
            parameters: {
                type: 'object',
                properties: {
                    phone: {
                        type: 'string',
                        description: 'Утасны дугаар (8 оронтой)'
                    },
                    email: {
                        type: 'string',
                        description: 'Имэйл хаяг'
                    },
                    name: {
                        type: 'string',
                        description: 'Хэрэглэгчийн нэр'
                    }
                },
                required: []
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'request_human_support',
            description: 'Хүнтэй холбогдохыг хүссэн үед. Оператор, менежер, хүн гэх мэт.',
            parameters: {
                type: 'object',
                properties: {
                    reason: {
                        type: 'string',
                        description: 'Шалтгаан'
                    }
                },
                required: ['reason']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'remember_preference',
            description: 'Хэрэглэгчийн сонголтыг санах. Төсөв, байршил, өрөөний тоо гэх мэт.',
            parameters: {
                type: 'object',
                properties: {
                    key: {
                        type: 'string',
                        description: 'Сонголтын төрөл (budget, location, rooms, type)'
                    },
                    value: {
                        type: 'string',
                        description: 'Санах утга'
                    }
                },
                required: ['key', 'value']
            }
        }
    }
];

// ============================================
// TOOL ARGUMENT INTERFACES
// ============================================

export interface SearchPropertiesArgs {
    type?: 'apartment' | 'house' | 'office' | 'land' | 'commercial';
    min_price?: number;
    max_price?: number;
    rooms?: number;
    district?: string;
    min_size?: number;
    max_size?: number;
    limit?: number;
}

export interface ShowPropertyImagesArgs {
    property_id?: string;
    property_name?: string;
}

export interface CalculateLoanArgs {
    amount: number;
    rate?: number;
    years: number;
    down_payment?: number;
}

export interface ScheduleViewingArgs {
    property_id?: string;
    property_name?: string;
    preferred_date?: string;
    preferred_time?: string;
    customer_phone?: string;
}

export interface CreateLeadArgs {
    property_id?: string;
    budget_min?: number;
    budget_max?: number;
    preferred_type?: 'apartment' | 'house' | 'office' | 'land' | 'commercial';
    preferred_district?: string;
    preferred_rooms?: number;
    notes?: string;
}

export interface CollectContactArgs {
    phone?: string;
    email?: string;
    name?: string;
}

export interface RequestHumanSupportArgs {
    reason: string;
}

export interface RememberPreferenceArgs {
    key: string;
    value: string;
}

/**
 * Union type for all tool arguments
 */
export type ToolArgs =
    | SearchPropertiesArgs
    | ShowPropertyImagesArgs
    | CalculateLoanArgs
    | ScheduleViewingArgs
    | CreateLeadArgs
    | CollectContactArgs
    | RequestHumanSupportArgs
    | RememberPreferenceArgs;

/**
 * Tool names type
 */
export type ToolName =
    | 'search_properties'
    | 'show_property_images'
    | 'calculate_loan'
    | 'schedule_viewing'
    | 'create_lead'
    | 'collect_contact_info'
    | 'request_human_support'
    | 'remember_preference';
