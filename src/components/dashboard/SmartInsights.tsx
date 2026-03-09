'use client';

import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Lightbulb, AlertTriangle, Award, Building2 } from 'lucide-react';

interface SmartInsightsProps {
    bestSellers: Array<{
        name: string;
        quantity: number;
        revenue: number;
        percent: number;
    }>;
    revenue: {
        total: number;
        growth: number;
        orderCount: number;
    };
    period: string;
}

interface Insight {
    type: 'success' | 'warning' | 'tip' | 'info';
    icon: React.ReactNode;
    message: string;
}

export function SmartInsights({ bestSellers, revenue, period }: SmartInsightsProps) {
    const insights = useMemo<Insight[]>(() => {
        const result: Insight[] = [];

        // Growth insight
        if (revenue.growth > 20) {
            result.push({
                type: 'success',
                icon: <TrendingUp className="w-4 h-4" />,
                message: `🎉 Лийд ${revenue.growth}% өссөн байна! Маш сайн ажиллаж байна.`,
            });
        } else if (revenue.growth < -10) {
            result.push({
                type: 'warning',
                icon: <TrendingDown className="w-4 h-4" />,
                message: `⚠️ Лийд ${Math.abs(revenue.growth)}% буурсан. Маркетинг идэвхжүүлэх цаг боллоо.`,
            });
        }

        // Top property insights
        if (bestSellers.length > 0) {
            const topProperty = bestSellers[0];
            if (topProperty.percent > 40) {
                result.push({
                    type: 'info',
                    icon: <Award className="w-4 h-4" />,
                    message: `🏆 "${topProperty.name}" нь хамгийн их сонирхол татсан байр!`,
                });
            }
        }

        // Lead count insights
        if (revenue.orderCount > 0) {
            result.push({
                type: 'tip',
                icon: <Building2 className="w-4 h-4" />,
                message: `💡 ${getPeriodLabel(period)} ${revenue.orderCount} лийд бүртгэгдсэн. Үзлэг товлоно уу!`,
            });
        }

        // Default
        if (result.length === 0) {
            result.push({
                type: 'info',
                icon: <Lightbulb className="w-4 h-4" />,
                message: `📊 ${getPeriodLabel(period)} идэвхжил хэвийн түвшинд байна.`,
            });
        }

        return result;
    }, [bestSellers, revenue, period]);

    if (insights.length === 0) return null;

    return (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
            <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-emerald-600" />
                Ухаалаг Зөвлөгөө
            </h3>
            <div className="space-y-2">
                {insights.map((insight, idx) => (
                    <div
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-lg ${insight.type === 'success' ? 'bg-green-50 text-green-800' :
                            insight.type === 'warning' ? 'bg-orange-50 text-orange-800' :
                                insight.type === 'tip' ? 'bg-blue-50 text-blue-800' :
                                    'bg-white text-gray-700'
                            }`}
                    >
                        <span className={`mt-0.5 ${insight.type === 'success' ? 'text-green-600' :
                            insight.type === 'warning' ? 'text-orange-600' :
                                insight.type === 'tip' ? 'text-blue-600' :
                                    'text-gray-500'
                            }`}>
                            {insight.icon}
                        </span>
                        <p className="text-sm">{insight.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function getPeriodLabel(period: string): string {
    switch (period) {
        case 'today': return 'Өнөөдрийн';
        case 'week': return '7 хоногийн';
        case 'month': return 'Сарын';
        case 'year': return 'Жилийн';
        default: return '';
    }
}
