'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Eye,
    MousePointer,
    DollarSign,
    Users,
    Target,
    ArrowUpRight,
    RefreshCw,
    Download,
    Filter,
} from 'lucide-react';

// Mock ad performance data
const MOCK_AD_STATS = {
    totalSpend: 2500000,
    totalReach: 133500,
    totalImpressions: 459000,
    totalClicks: 5890,
    ctr: 1.28,
    cpc: 424,
    totalLeads: 74,
    cpl: 33784,
    comparison: {
        spend: '+12%',
        reach: '+23%',
        ctr: '+0.15%',
        cpl: '-8%',
    },
};

const MOCK_AD_ACCOUNTS = [
    {
        id: '1',
        name: 'Vertmon Main',
        platform: 'facebook',
        spend: 1800000,
        reach: 95000,
        impressions: 320000,
        clicks: 4100,
        leads: 52,
        status: 'active',
    },
    {
        id: '2',
        name: 'Vertmon Instagram',
        platform: 'instagram',
        spend: 700000,
        reach: 38500,
        impressions: 139000,
        clicks: 1790,
        leads: 22,
        status: 'active',
    },
];

const MOCK_TOP_ADS = [
    {
        name: 'Mandala Garden - 3D Tour Video',
        type: 'video',
        spend: 450000,
        reach: 28000,
        clicks: 1200,
        leads: 15,
        ctr: 4.29,
    },
    {
        name: 'Elysium - Penthouse Carousel',
        type: 'carousel',
        spend: 320000,
        reach: 18500,
        clicks: 890,
        leads: 8,
        ctr: 4.81,
    },
    {
        name: 'Mandala Tower - Урьдчилгаа хөнгөлөлт',
        type: 'image',
        spend: 280000,
        reach: 22000,
        clicks: 750,
        leads: 11,
        ctr: 3.41,
    },
    {
        name: 'Retargeting - Вэбсайт зочид',
        type: 'dynamic',
        spend: 120000,
        reach: 8500,
        clicks: 890,
        leads: 8,
        ctr: 10.47,
    },
];

const MOCK_DAILY_DATA = [
    { date: '01/27', spend: 85000, leads: 3 },
    { date: '01/28', spend: 92000, leads: 4 },
    { date: '01/29', spend: 78000, leads: 2 },
    { date: '01/30', spend: 105000, leads: 5 },
    { date: '01/31', spend: 88000, leads: 3 },
    { date: '02/01', spend: 95000, leads: 4 },
    { date: '02/02', spend: 110000, leads: 6 },
];

export default function AdsPage() {
    const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const formatCurrency = (value: number) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)} сая`;
        }
        return `${(value / 1000).toFixed(0)}K`;
    };

    const stats = MOCK_AD_STATS;
    const maxSpend = Math.max(...MOCK_DAILY_DATA.map(d => d.spend));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-7 h-7 text-purple-600" />
                        Зар сурталчилгаа
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Facebook & Instagram зарын гүйцэтгэл
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as typeof period)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
                    >
                        <option value="7d">Сүүлийн 7 хоног</option>
                        <option value="30d">Сүүлийн 30 хоног</option>
                        <option value="90d">Сүүлийн 90 хоног</option>
                    </select>
                    <Button variant="secondary" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Тайлан
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <DollarSign className="w-5 h-5 text-purple-500" />
                            <span className={`text-xs font-medium flex items-center text-red-600`}>
                                <TrendingUp className="w-3 h-3 mr-0.5" />
                                {stats.comparison.spend}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpend)}</p>
                        <p className="text-xs text-gray-500">Нийт зардал</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Eye className="w-5 h-5 text-blue-500" />
                            <span className="text-xs font-medium flex items-center text-emerald-600">
                                <TrendingUp className="w-3 h-3 mr-0.5" />
                                {stats.comparison.reach}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalReach)}</p>
                        <p className="text-xs text-gray-500">Хүрэлт</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <MousePointer className="w-5 h-5 text-pink-500" />
                            <span className="text-xs font-medium flex items-center text-emerald-600">
                                <TrendingUp className="w-3 h-3 mr-0.5" />
                                {stats.comparison.ctr}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.ctr}%</p>
                        <p className="text-xs text-gray-500">CTR (Click-through rate)</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Target className="w-5 h-5 text-emerald-500" />
                            <span className="text-xs font-medium flex items-center text-emerald-600">
                                <TrendingDown className="w-3 h-3 mr-0.5" />
                                {stats.comparison.cpl}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.cpl)}</p>
                        <p className="text-xs text-gray-500">Cost per Lead</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Spend Chart */}
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Өдөр тутмын зардал</h3>
                        <div className="h-48 flex items-end justify-between gap-2">
                            {MOCK_DAILY_DATA.map((day) => (
                                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-xs font-medium text-emerald-600">+{day.leads}</span>
                                    <div
                                        className="w-full bg-purple-500 rounded-t hover:bg-purple-600 transition-colors cursor-pointer"
                                        style={{ height: `${(day.spend / maxSpend) * 140}px` }}
                                    />
                                    <span className="text-xs text-gray-500">{day.date}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Ad Accounts */}
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Зарын аккаунтууд</h3>
                        <div className="space-y-4">
                            {MOCK_AD_ACCOUNTS.map((account) => (
                                <div key={account.id} className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${account.platform === 'facebook' ? 'bg-blue-100' : 'bg-pink-100'
                                                }`}>
                                                <BarChart3 className={`w-5 h-5 ${account.platform === 'facebook' ? 'text-blue-600' : 'text-pink-600'
                                                    }`} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{account.name}</p>
                                                <p className="text-xs text-gray-500 capitalize">{account.platform}</p>
                                            </div>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 text-center">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{formatCurrency(account.spend)}</p>
                                            <p className="text-xs text-gray-500">Зардал</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{formatNumber(account.reach)}</p>
                                            <p className="text-xs text-gray-500">Хүрэлт</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{formatNumber(account.clicks)}</p>
                                            <p className="text-xs text-gray-500">Клик</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-emerald-600">{account.leads}</p>
                                            <p className="text-xs text-gray-500">Lead</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Performing Ads */}
            <Card className="bg-white border-gray-200">
                <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Шилдэг гүйцэтгэлтэй зарууд</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 text-xs text-gray-500 font-medium">Зар</th>
                                    <th className="text-center py-3 text-xs text-gray-500 font-medium">Төрөл</th>
                                    <th className="text-center py-3 text-xs text-gray-500 font-medium">Зардал</th>
                                    <th className="text-center py-3 text-xs text-gray-500 font-medium">Хүрэлт</th>
                                    <th className="text-center py-3 text-xs text-gray-500 font-medium">Клик</th>
                                    <th className="text-center py-3 text-xs text-gray-500 font-medium">CTR</th>
                                    <th className="text-center py-3 text-xs text-gray-500 font-medium">Lead</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_TOP_ADS.map((ad, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-3">
                                            <p className="font-medium text-gray-900 text-sm">{ad.name}</p>
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className={`px-2 py-1 text-xs rounded-full ${ad.type === 'video' ? 'bg-red-100 text-red-700' :
                                                    ad.type === 'carousel' ? 'bg-blue-100 text-blue-700' :
                                                        ad.type === 'dynamic' ? 'bg-purple-100 text-purple-700' :
                                                            'bg-gray-100 text-gray-700'
                                                }`}>
                                                {ad.type}
                                            </span>
                                        </td>
                                        <td className="py-3 text-center text-sm text-gray-600">{formatCurrency(ad.spend)}</td>
                                        <td className="py-3 text-center text-sm text-gray-600">{formatNumber(ad.reach)}</td>
                                        <td className="py-3 text-center text-sm text-gray-600">{formatNumber(ad.clicks)}</td>
                                        <td className="py-3 text-center">
                                            <span className={`text-sm font-medium ${ad.ctr > 5 ? 'text-emerald-600' : 'text-gray-600'}`}>
                                                {ad.ctr}%
                                            </span>
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                                {ad.leads}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
