'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Megaphone,
    Plus,
    Play,
    Pause,
    Edit,
    Trash2,
    Eye,
    Users,
    DollarSign,
    Calendar,
    Target,
    TrendingUp,
    MoreVertical,
    Copy,
    BarChart3,
} from 'lucide-react';

// Mock campaigns data
const MOCK_CAMPAIGNS = [
    {
        id: '1',
        name: 'Mandala Garden - Хаврын урамшуулал',
        status: 'active',
        platform: ['facebook', 'instagram'],
        objective: 'lead_generation',
        startDate: '2026-01-15',
        endDate: '2026-02-28',
        budget: 1500000,
        spent: 800000,
        reach: 45000,
        impressions: 125000,
        clicks: 3200,
        leads: 23,
        cpl: 34783,
    },
    {
        id: '2',
        name: 'Elysium Residence - VIP танилцуулга',
        status: 'active',
        platform: ['facebook'],
        objective: 'brand_awareness',
        startDate: '2026-01-20',
        endDate: '2026-02-15',
        budget: 800000,
        spent: 600000,
        reach: 28000,
        impressions: 89000,
        clicks: 1800,
        leads: 12,
        cpl: 50000,
    },
    {
        id: '3',
        name: 'Mandala Tower 365 - Өрөө захиалга',
        status: 'scheduled',
        platform: ['facebook', 'instagram'],
        objective: 'conversions',
        startDate: '2026-02-10',
        endDate: '2026-03-10',
        budget: 2000000,
        spent: 0,
        reach: 0,
        impressions: 0,
        clicks: 0,
        leads: 0,
        cpl: 0,
    },
    {
        id: '4',
        name: 'Retargeting - Вэбсайт зочид',
        status: 'active',
        platform: ['facebook', 'instagram'],
        objective: 'retargeting',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        budget: 500000,
        spent: 120000,
        reach: 8500,
        impressions: 45000,
        clicks: 890,
        leads: 8,
        cpl: 15000,
    },
    {
        id: '5',
        name: 'Mandala Garden - Шинэ жилийн хөнгөлөлт',
        status: 'completed',
        platform: ['facebook'],
        objective: 'lead_generation',
        startDate: '2025-12-15',
        endDate: '2026-01-10',
        budget: 1000000,
        spent: 980000,
        reach: 52000,
        impressions: 156000,
        clicks: 4100,
        leads: 31,
        cpl: 31613,
    },
];

export default function CampaignsPage() {
    const [filter, setFilter] = useState<'all' | 'active' | 'scheduled' | 'completed'>('all');

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-100 text-emerald-700';
            case 'scheduled': return 'bg-amber-100 text-amber-700';
            case 'completed': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Идэвхтэй';
            case 'scheduled': return 'Төлөвлөсөн';
            case 'completed': return 'Дууссан';
            default: return status;
        }
    };

    const getObjectiveLabel = (objective: string) => {
        switch (objective) {
            case 'lead_generation': return 'Lead үүсгэх';
            case 'brand_awareness': return 'Брэнд таниулах';
            case 'conversions': return 'Хөрвүүлэлт';
            case 'retargeting': return 'Retargeting';
            default: return objective;
        }
    };

    const filteredCampaigns = filter === 'all'
        ? MOCK_CAMPAIGNS
        : MOCK_CAMPAIGNS.filter(c => c.status === filter);

    const totalStats = {
        budget: MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.budget, 0),
        spent: MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.spent, 0),
        leads: MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.leads, 0),
        reach: MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.reach, 0),
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Megaphone className="w-7 h-7 text-purple-600" />
                        Кампейн удирдлага
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Маркетингийн бүх кампейнүүдийг удирдах
                    </p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Шинэ кампейн
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <DollarSign className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalStats.spent)}</p>
                                <p className="text-xs text-gray-500">Нийт зарцуулсан / {formatCurrency(totalStats.budget)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Eye className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{formatNumber(totalStats.reach)}</p>
                                <p className="text-xs text-gray-500">Нийт хүрэлт</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <Users className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{totalStats.leads}</p>
                                <p className="text-xs text-gray-500">Нийт lead</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Target className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalStats.spent / totalStats.leads)}</p>
                                <p className="text-xs text-gray-500">Дундаж CPL</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
                {[
                    { value: 'all', label: 'Бүгд', count: MOCK_CAMPAIGNS.length },
                    { value: 'active', label: 'Идэвхтэй', count: MOCK_CAMPAIGNS.filter(c => c.status === 'active').length },
                    { value: 'scheduled', label: 'Төлөвлөсөн', count: MOCK_CAMPAIGNS.filter(c => c.status === 'scheduled').length },
                    { value: 'completed', label: 'Дууссан', count: MOCK_CAMPAIGNS.filter(c => c.status === 'completed').length },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value as typeof filter)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === tab.value
                                ? 'bg-purple-100 text-purple-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Campaign List */}
            <div className="space-y-4">
                {filteredCampaigns.map((campaign) => (
                    <Card key={campaign.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Campaign Info */}
                                <div className="flex-1">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${campaign.status === 'active' ? 'bg-emerald-100' :
                                                campaign.status === 'scheduled' ? 'bg-amber-100' : 'bg-gray-100'
                                            }`}>
                                            <Megaphone className={`w-5 h-5 ${campaign.status === 'active' ? 'text-emerald-600' :
                                                    campaign.status === 'scheduled' ? 'text-amber-600' : 'text-gray-600'
                                                }`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                                                    {getStatusLabel(campaign.status)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Target className="w-3 h-3" />
                                                    {getObjectiveLabel(campaign.objective)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {campaign.startDate} - {campaign.endDate}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-4 gap-6 lg:w-auto">
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-gray-900">{formatNumber(campaign.reach)}</p>
                                        <p className="text-xs text-gray-500">Хүрэлт</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-gray-900">{formatNumber(campaign.clicks)}</p>
                                        <p className="text-xs text-gray-500">Клик</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-emerald-600">{campaign.leads}</p>
                                        <p className="text-xs text-gray-500">Lead</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-gray-900">{formatCurrency(campaign.spent)}</p>
                                        <p className="text-xs text-gray-500">Зарцуулсан</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {campaign.status === 'active' && (
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            <Pause className="w-4 h-4 text-gray-600" />
                                        </button>
                                    )}
                                    {campaign.status === 'scheduled' && (
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            <Play className="w-4 h-4 text-gray-600" />
                                        </button>
                                    )}
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <BarChart3 className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Copy className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Edit className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Budget Progress */}
                            {campaign.budget > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-500">Төсвийн зарцуулалт</span>
                                        <span className="text-xs font-medium text-gray-700">
                                            {Math.round((campaign.spent / campaign.budget) * 100)}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${campaign.spent / campaign.budget > 0.9 ? 'bg-red-500' :
                                                    campaign.spent / campaign.budget > 0.7 ? 'bg-amber-500' : 'bg-emerald-500'
                                                }`}
                                            style={{ width: `${Math.min(100, (campaign.spent / campaign.budget) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
