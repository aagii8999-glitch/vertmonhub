'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, BarChart3, Loader2 } from 'lucide-react';

interface CampaignROI {
    id: string;
    name: string;
    budget: number;
    leads_count: number;
    conversions: number;
    revenue: number;
    source: string;
    start_date: string;
    end_date: string | null;
}

const sourceLabels: Record<string, string> = {
    messenger: 'Messenger', instagram: 'Instagram', website: 'Вебсайт',
    referral: 'Танилын', phone: 'Утас', facebook: 'Facebook Ads',
    google: 'Google Ads', other: 'Бусад',
};

export default function MarketingROIPage() {
    const { shop } = useAuth();
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!shop?.id) return;
        fetchData();
    }, [shop?.id]);

    async function fetchData() {
        const { data } = await supabase
            .from('leads')
            .select('id, source, status, budget_min, budget_max, created_at')
            .eq('shop_id', shop!.id);
        setLeads(data || []);
        setLoading(false);
    }

    const analytics = useMemo(() => {
        if (leads.length === 0) return null;

        // Group by source
        const bySource: Record<string, { total: number; won: number; lost: number; active: number }> = {};
        leads.forEach(l => {
            const src = l.source || 'other';
            if (!bySource[src]) bySource[src] = { total: 0, won: 0, lost: 0, active: 0 };
            bySource[src].total++;
            if (l.status === 'closed_won') bySource[src].won++;
            else if (l.status === 'closed_lost') bySource[src].lost++;
            else bySource[src].active++;
        });

        // Conversion rates
        const sources = Object.entries(bySource).map(([source, data]) => ({
            source,
            label: sourceLabels[source] || source,
            ...data,
            conversionRate: data.total > 0 ? Math.round((data.won / data.total) * 100) : 0,
        })).sort((a, b) => b.total - a.total);

        const totalLeads = leads.length;
        const totalWon = leads.filter(l => l.status === 'closed_won').length;
        const totalLost = leads.filter(l => l.status === 'closed_lost').length;
        const overallConversion = totalLeads > 0 ? Math.round((totalWon / totalLeads) * 100) : 0;

        // Time analysis — leads per month
        const monthly: Record<string, number> = {};
        leads.forEach(l => {
            const month = new Date(l.created_at).toLocaleDateString('mn-MN', { year: 'numeric', month: 'short' });
            monthly[month] = (monthly[month] || 0) + 1;
        });

        // Best source
        const bestSource = sources.length > 0 ? sources.reduce((best, s) => s.conversionRate > best.conversionRate ? s : best) : null;

        return { sources, totalLeads, totalWon, totalLost, overallConversion, monthly, bestSource };
    }, [leads]);

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-violet-600" /></div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Маркетинг ROI</h1>
            <p className="text-sm text-gray-500 mb-6">Эх үүсвэр тус бүрийн лийд, конверс шинжилгээ</p>

            {!analytics ? (
                <div className="text-center py-16 text-gray-400">Лийд өгөгдөл байхгүй</div>
            ) : (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="text-xs text-gray-500">Нийт лийд</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{analytics.totalLeads}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Target className="w-4 h-4 text-emerald-600" />
                                <span className="text-xs text-gray-500">Амжилттай</span>
                            </div>
                            <p className="text-2xl font-bold text-emerald-600">{analytics.totalWon}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <BarChart3 className="w-4 h-4 text-violet-600" />
                                <span className="text-xs text-gray-500">Конверс</span>
                            </div>
                            <p className="text-2xl font-bold text-violet-600">{analytics.overallConversion}%</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="w-4 h-4 text-orange-600" />
                                <span className="text-xs text-gray-500">Шилдэг суваг</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 truncate">{analytics.bestSource?.label || '-'}</p>
                            <p className="text-xs text-orange-600">{analytics.bestSource?.conversionRate}% конверс</p>
                        </div>
                    </div>

                    {/* Source Breakdown Table */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700">Эх үүсвэрийн шинжилгээ</h3>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Суваг</th>
                                    <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-500">Лийд</th>
                                    <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-500">Амжилт</th>
                                    <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-500">Алдсан</th>
                                    <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-500">Идэвхтэй</th>
                                    <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-500">Конверс</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Визуал</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {analytics.sources.map(s => (
                                    <tr key={s.source} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{s.label}</td>
                                        <td className="px-4 py-3 text-center">{s.total}</td>
                                        <td className="px-4 py-3 text-center text-emerald-600 font-medium">{s.won}</td>
                                        <td className="px-4 py-3 text-center text-red-500">{s.lost}</td>
                                        <td className="px-4 py-3 text-center text-blue-600">{s.active}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.conversionRate >= 50 ? 'bg-emerald-100 text-emerald-700' : s.conversionRate >= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {s.conversionRate}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${s.conversionRate}%` }} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Monthly Trend */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Сар бүрийн лийд</h3>
                        <div className="flex items-end gap-2 h-32">
                            {Object.entries(analytics.monthly).slice(-6).map(([month, count]) => {
                                const max = Math.max(...Object.values(analytics.monthly));
                                const height = max > 0 ? (count / max) * 100 : 0;
                                return (
                                    <div key={month} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-xs font-bold text-gray-700">{count}</span>
                                        <div className="w-full bg-violet-200 rounded-t" style={{ height: `${height}%`, minHeight: '4px' }}>
                                            <div className="w-full h-full bg-violet-500 rounded-t" />
                                        </div>
                                        <span className="text-[10px] text-gray-400 truncate w-full text-center">{month}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
