/**
 * ============================================
 * MOCK DATA FOR DEMO/PRESENTATION PURPOSES
 * ============================================
 * 
 * ⚠️ УСТГАХДАА:
 * 1. Энэ файлыг устгах
 * 2. Properties page дээрх import болон useMockData-г устгах
 * 3. Leads page дээрх import болон useMockData-г устгах
 * 
 * Хайх: "DEMO_MOCK_DATA" - бүх холбогдох кодыг олно
 */

// ================== PROPERTIES MOCK DATA ==================
// 3 Projects: Mandala Garden, 360/365 Mandala Tower, Elysium Residence
export const MOCK_PROPERTIES = [
    // Mandala Garden
    {
        id: '1',
        title: 'Mandala Garden - 2 өрөө (A блок)',
        type: 'mandala_garden',
        price: 280000000,
        size: 65,
        bedrooms: 2,
        bathrooms: 1,
        status: 'available',
        views: 324,
        location: 'Хан-Уул дүүрэг, Яармаг',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
        created_at: '2026-01-15',
    },
    {
        id: '2',
        title: 'Mandala Garden - 3 өрөө (B блок)',
        type: 'mandala_garden',
        price: 380000000,
        size: 95,
        bedrooms: 3,
        bathrooms: 2,
        status: 'available',
        views: 412,
        location: 'Хан-Уул дүүрэг, Яармаг',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
        created_at: '2026-01-20',
    },
    {
        id: '3',
        title: 'Mandala Garden - 1 өрөө студи',
        type: 'mandala_garden',
        price: 165000000,
        size: 42,
        bedrooms: 1,
        bathrooms: 1,
        status: 'reserved',
        views: 189,
        location: 'Хан-Уул дүүрэг, Яармаг',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
        created_at: '2026-01-25',
    },
    // 360/365 Mandala Tower
    {
        id: '4',
        title: 'Mandala Tower 360 - 2 өрөө (15 давхар)',
        type: 'mandala_tower',
        price: 420000000,
        size: 78,
        bedrooms: 2,
        bathrooms: 1,
        status: 'available',
        views: 567,
        location: 'Сүхбаатар дүүрэг, Төв',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
        created_at: '2026-01-10',
    },
    {
        id: '5',
        title: 'Mandala Tower 365 - 3 өрөө (22 давхар)',
        type: 'mandala_tower',
        price: 580000000,
        size: 110,
        bedrooms: 3,
        bathrooms: 2,
        status: 'available',
        views: 823,
        location: 'Сүхбаатар дүүрэг, Төв',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
        created_at: '2026-01-05',
    },
    {
        id: '6',
        title: 'Mandala Tower 360 - Пентхаус (30 давхар)',
        type: 'mandala_tower',
        price: 1250000000,
        size: 220,
        bedrooms: 4,
        bathrooms: 3,
        status: 'available',
        views: 356,
        location: 'Сүхбаатар дүүрэг, Төв',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
        created_at: '2026-01-28',
    },
    // Elysium Residence
    {
        id: '7',
        title: 'Elysium Residence - 2 өрөө Делюкс',
        type: 'elysium',
        price: 520000000,
        size: 88,
        bedrooms: 2,
        bathrooms: 2,
        status: 'available',
        views: 445,
        location: 'Баянзүрх дүүрэг, Ногоон нуур',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
        created_at: '2026-01-18',
    },
    {
        id: '8',
        title: 'Elysium Residence - 3 өрөө Премиум',
        type: 'elysium',
        price: 780000000,
        size: 135,
        bedrooms: 3,
        bathrooms: 2,
        status: 'reserved',
        views: 612,
        location: 'Баянзүрх дүүрэг, Ногоон нуур',
        image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400',
        created_at: '2026-01-22',
    },
    {
        id: '9',
        title: 'Elysium Residence - 4 өрөө Лакшери',
        type: 'elysium',
        price: 1100000000,
        size: 180,
        bedrooms: 4,
        bathrooms: 3,
        status: 'sold',
        views: 934,
        location: 'Баянзүрх дүүрэг, Ногоон нуур',
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400',
        created_at: '2026-01-12',
    },
];

// ================== LEADS MOCK DATA ==================
// Enhanced for Sales Managers with key talking points
export const MOCK_LEADS = [
    {
        id: '1',
        customer_name: 'Батбаяр Ганбат',
        customer_phone: '99112233',
        customer_email: 'batbayar@gmail.com',
        source: 'messenger',
        budget_min: 400000000,
        budget_max: 500000000,
        status: 'new',
        preferred_type: 'mandala_garden',
        notes: '3 өрөө байр хайж байна',
        created_at: '2026-02-01T10:30:00',
        // Enhanced fields for sales managers
        urgency: 'high', // high, medium, low
        ai_summary: 'Гэр бүлтэй, 2 хүүхэдтэй. Одоо байгаа байраа зарж шинэ байр авах гэж байна. Урьдчилгаа төлөх боломжтой.',
        interests: ['3 өрөө', 'Mandala Garden', 'Сургууль ойрхон'],
        talking_points: [
            '💡 Mandala Garden-ий B блок 3 өрөө сайн тохирно (380 сая)',
            '🏫 100м зайд олон улсын сургууль байгаа',
            '💰 Урьдчилгаа 30%-тай зээлийн бүтээгдэхүүн санал болго',
        ],
        matching_properties: ['2'], // Mandala Garden 3 өрөө
        last_contact: '2 цагийн өмнө',
        conversation_summary: 'Messenger-ээр холбоо барьсан. Байрны үнэ, хүргэлтийн хугацаа асуусан.',
    },
    {
        id: '2',
        customer_name: 'Оюунбилэг Дорж',
        customer_phone: '88445566',
        customer_email: 'oyunbileg.d@yahoo.com',
        source: 'instagram',
        budget_min: 500000000,
        budget_max: 700000000,
        status: 'contacted',
        preferred_type: 'mandala_tower',
        notes: 'Өндөр давхарт, сайхан харагдацтай',
        created_at: '2026-01-30T14:15:00',
        urgency: 'medium',
        ai_summary: 'Залуу мэргэжилтэн, хөрөнгө оруулалт хийх сонирхолтой. Түрээсээр өгөх зорилготой.',
        interests: ['Mandala Tower', 'Өндөр давхар', 'Хөрөнгө оруулалт'],
        talking_points: [
            '💡 Mandala Tower 365 - 22 давхар (580 сая) төгс сонголт',
            '📈 Түрээсийн өгөөж сарын 2-2.5 сая орчим',
            '🏢 Бизнесийн төв ойрхон, оффис руу ойр',
        ],
        matching_properties: ['5'], // Mandala Tower 365
        last_contact: '2 өдрийн өмнө',
        conversation_summary: 'Instagram DM-ээр бичсэн. Байрны харагдац, давхар талаар асуулт тавьсан.',
    },
    {
        id: '3',
        customer_name: 'Энхбаатар Цэрэн',
        customer_phone: '95001234',
        customer_email: 'enkhbaatar@company.mn',
        source: 'referral',
        budget_min: 1000000000,
        budget_max: 1500000000,
        status: 'viewing_scheduled',
        preferred_type: 'elysium',
        notes: 'VIP харилцагч - Компанийн захирал',
        created_at: '2026-01-28T09:00:00',
        urgency: 'high',
        ai_summary: 'Компанийн захирал. Премиум сегментийн байр хайж байна. Үзлэг 02/03-нд 14:00-д товлосон.',
        interests: ['Elysium Residence', 'Премиум', '4 өрөө', 'Паркинг'],
        talking_points: [
            '⭐ VIP харилцагч - онцгой анхаарал хандуулах',
            '💎 Elysium 4 өрөө Лакшери хамгийн тохиромжтой (1.1 тэрбум)',
            '🚗 2 машины зогсоол + VIP паркинг үнэгүй',
            '🎁 VIP хөнгөлөлт санал болго (5%)',
        ],
        matching_properties: ['9'], // Elysium 4 өрөө
        last_contact: '5 цагийн өмнө',
        conversation_summary: 'Зөвлөмжөөр ирсэн. Үзлэг захиалсан. Түргэн шийдвэр гаргах хүсэлтэй.',
        scheduled_viewing: '2026-02-03T14:00:00',
    },
    {
        id: '4',
        customer_name: 'Сарангэрэл Бат',
        customer_phone: '99887766',
        customer_email: 'sarangerel.b@gmail.com',
        source: 'messenger',
        budget_min: 150000000,
        budget_max: 200000000,
        status: 'offered',
        preferred_type: 'mandala_garden',
        notes: 'Оюутан, анхны байраа авах гэж байна',
        created_at: '2026-01-25T16:45:00',
        urgency: 'low',
        ai_summary: 'Оюутан. Эцэг эхийн дэмжлэгтэй анхны байраа авч байна. Студи эсвэл 1 өрөөг илүүд үздэг.',
        interests: ['Студи', '1 өрөө', 'Mandala Garden', 'Хямд'],
        talking_points: [
            '💡 Mandala Garden Студи (165 сая) - Төсөвт тохирно',
            '🎓 Их сургуульд ойрхон, автобусны зогсоол ч бий',
            '💳 "Анхны байр" хөтөлбөрийн зээл тайлбарла',
        ],
        matching_properties: ['3'], // Mandala Garden студи
        last_contact: '1 долоо хоногийн өмнө',
        conversation_summary: 'Үнийн санал илгээсэн. Эцэг эхтэйгээ зөвлөлдөж байна гэсэн.',
    },
    {
        id: '5',
        customer_name: 'Мөнхбат Ганзориг',
        customer_phone: '91234567',
        customer_email: 'munkhbat.g@outlook.com',
        source: 'messenger',
        budget_min: 600000000,
        budget_max: 900000000,
        status: 'negotiating',
        preferred_type: 'elysium',
        notes: 'Үнийн талаар хэлэлцэж байна',
        created_at: '2026-01-22T11:20:00',
        urgency: 'high',
        ai_summary: 'Серьёзний худалдан авагч. Elysium 3 өрөө сонирхож байна. Үнийг бага зэрэг бууруулахыг хүсч байна.',
        interests: ['Elysium', '3 өрөө', 'Премиум'],
        talking_points: [
            '🔥 ЯАРАЛТАЙ - Үнийн хэлэлцээр дуусах шатандаа',
            '💰 780 сая → 750 сая хүртэл бууруулах боломжтой',
            '🎁 Хөнгөлөлтийн оронд тавилга багцыг санал болго',
            '⏰ Энэ долоо хоногт шийдвэрлэхийг дүрдэ',
        ],
        matching_properties: ['8'], // Elysium 3 өрөө
        last_contact: '3 цагийн өмнө',
        conversation_summary: 'Үнэ хямдруулах хүсэлт тавьсан. Менежертэй ярилцах шаардлагатай.',
    },
    {
        id: '6',
        customer_name: 'Болормаа Тэмүүлэн',
        customer_phone: '88776655',
        customer_email: 'bolormaa.t@gmail.com',
        source: 'instagram',
        budget_min: 350000000,
        budget_max: 450000000,
        status: 'closed_won',
        preferred_type: 'mandala_garden',
        notes: 'Амжилттай - Гэрээ байгуулсан',
        created_at: '2026-01-15T13:30:00',
        urgency: 'low',
        ai_summary: 'АМЖИЛТТАЙ ХААГДСАН. Mandala Garden 3 өрөө байр худалдан авсан. Гэрээ 01/20-д байгуулагдсан.',
        interests: ['Mandala Garden', '3 өрөө'],
        talking_points: [
            '✅ Гэрээ байгуулагдсан',
            '📝 Үлдэгдэл төлбөрийн хуваарь хянах',
            '🤝 Зөвлөмжийн хөтөлбөр санал болго',
        ],
        matching_properties: ['2'],
        last_contact: '2 долоо хоногийн өмнө',
        conversation_summary: 'Гэрээ амжилттай байгуулагдсан. Хүргэлт 2026 оны 6 сард.',
        closed_date: '2026-01-20',
        closed_amount: 380000000,
    },
    {
        id: '7',
        customer_name: 'Тэмүүжин Эрдэнэ',
        customer_phone: '99554433',
        customer_email: 'temuujin@business.mn',
        source: 'referral',
        budget_min: 1000000000,
        budget_max: 1500000000,
        status: 'new',
        preferred_type: 'mandala_tower',
        notes: 'Пентхаус сонирхолтой - VIP',
        created_at: '2026-02-02T08:00:00',
        urgency: 'high',
        ai_summary: 'ШИНЭ VIP LEAD. Бизнесмен, цагийн хязгааргүй. Пентхаус эсвэл дээд давхрын байр хайж байна.',
        interests: ['Пентхаус', 'Mandala Tower', 'VIP', 'Өндөр давхар'],
        talking_points: [
            '🔥 ШИНЭ LEAD - Яаралтай холбогдох!',
            '⭐ VIP харилцагч - Зөвлөмжөөр ирсэн',
            '💎 Mandala Tower Пентхаус (1.25 тэрбум) санал болго',
            '📞 Өнөөдөр холбогдох!',
        ],
        matching_properties: ['6'], // Mandala Tower Пентхаус
        last_contact: 'Шинэ',
        conversation_summary: 'Зөвлөмжийн холбоос. Одоохондоо шууд холбоо барьж амжаагүй.',
    },
];

// ================== DASHBOARD STATS MOCK DATA ==================
export const MOCK_DASHBOARD_STATS = {
    totalProperties: 24,
    totalValue: 15800000000, // 15.8 billion MNT
    totalViews: 3456,
    avgPrice: 658333333,
    totalLeads: 47,
    newLeads: 12,
    inProgressLeads: 18,
    conversionRate: 23.4,
};

// ================== HELPER: Toggle Mock Data ==================
/**
 * Set to `true` to use mock data, `false` to use real API data
 * DEMO_MOCK_DATA marker for easy search
 */
export const USE_MOCK_DATA = true;

/**
 * Helper hook to determine if mock data should be used
 */
export function useMockData() {
    return USE_MOCK_DATA;
}
