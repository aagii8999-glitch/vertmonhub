'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Users,
    TrendingUp,
    Target,
    CheckCircle2,
    XCircle,
    Clock,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    RefreshCw,
    Calendar,
    DollarSign,
    PieChart,
    Filter,
    Building2,
    Percent
} from 'lucide-react';

const KPI_CARDS = [
    {
        label: 'Нийт сэжим',
        value: '156',
        trend: '+12%',
        trendLabel: 'өмнөх сараас',
        trendUp: true,
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
    },
    {
        label: 'Амжилттай',
        value: '42',
        trend: '+5%',
        trendLabel: 'өмнөх сараас',
        trendUp: true,
        icon: CheckCircle2,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100',
    },
    {
        label: 'Хөрвүүлэлт',
        value: '26.9%',
        trend: '-2.1%',
        trendLabel: 'өмнөх сараас',
        trendUp: false,
        icon: Target,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
    },
    {
        label: 'Боловсруулалтанд',
        value: '89',
        trend: '+18%',
        trendLabel: 'өмнөх сараас',
        trendUp: true,
        icon: Clock,
        color: 'text-amber-600',
        bgColor: 'bg-amber-100',
    },
];

const MOCK_SOURCE_DATA = [
    { source: 'Facebook', count: 65, percentage: 42, color: 'bg-blue-500' },
    { source: 'Instagram', count: 42, percentage: 27, color: 'bg-pink-500' },
    { source: 'Вэбсайт', count: 24, percentage: 15, color: 'bg-indigo-500' },
    { source: 'Зөвлөмж', count: 15, percentage: 10, color: 'bg-emerald-500' },
    { source: 'Бусад', count: 10, percentage: 6, color: 'bg-gray-500' },
];

const MOCK_LEAD_BY_PROJECT = [
    { project: 'Mandala Garden', leads: 65, won: 18, value: 4500000000 },
    { project: 'Mandala Tower', leads: 42, won: 12, value: 3800000000 },
    { project: 'Sunny Village', leads: 38, won: 9, value: 2100000000 },
];

const MOCK_TOP_PERFORMERS = [
    { name: 'Батбаяр М.', leads: 45, won: 15, value: 3200000000 },
    { name: 'Оюунаа С.', leads: 38, won: 12, value: 2800000000 },
    { name: 'Ганзориг Д.', leads: 31, won: 9, value: 2100000000 },
];

export function LeadsReport() {
    type Period = 'today' | 'week' | 'month' | 'year';
    const [period, setPeriod] = useState<Period>('month');

    const formatCurrency = (value: number) => {
        if (value >= 1000000000) {
            return `${(value / 1000000000).toFixed(1)} тэрбум ₮`;
        }
        return `${(value / 1000000).toLocaleString()} сая ₮`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary" />
                        Сэжмийн тайлан
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Худалдан авах магадлалтай харилцагчдын анализ
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Экспорт
                    </Button>
                </div>
            </div>

            {/* Period Filter */}
            <div className="flex flex-wrap gap-2">
                {[
                    { value: 'today', label: 'Өнөөдөр' },
                    { value: 'week', label: '7 хоног' },
                    { value: 'month', label: 'Сар' },
                    { value: 'year', label: 'Жил' },
                ].map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setPeriod(option.value as Period)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${period === option.value
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {KPI_CARDS.map((stat, index) => (
                    <Card key={index} className="transition-all hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                                </div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className={`text-sm font-medium flex items-center ${stat.trendUp ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {stat.trend}
                                </span>
                                <span className="text-xs text-gray-500">{stat.trendLabel}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Source Analysis */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-primary" />
                            Сувгийн анализ
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {MOCK_SOURCE_DATA.map((item, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-700">{item.source}</span>
                                        <div className="text-right">
                                            <span className="font-bold text-gray-900">{item.count}</span>
                                            <span className="text-sm text-gray-500 ml-2">({item.percentage}%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className={`${item.color} h-2 rounded-full transition-all`}
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Conversion Funnel */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-primary" />
                            Борлуулалтын юүлүүр
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { stage: 'Нийт сэжим', count: 156, color: 'bg-blue-500' },
                                { stage: 'Холбогдсон', count: 89, color: 'bg-indigo-500' },
                                { stage: 'Уулзалт товлосон', count: 34, color: 'bg-violet-500' },
                                { stage: 'Гэрээ хийсэн', count: 12, color: 'bg-purple-500' },
                            ].map((item, i, arr) => (
                                <div key={i} className="relative">
                                    {i > 0 && (
                                        <div className="absolute -top-4 left-6 w-0.5 h-4 bg-gray-200" />
                                    )}
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl ${item.color} bg-opacity-10 flex items-center justify-center flex-shrink-0`}>
                                            <span className={`font-bold ${item.color.replace('bg-', 'text-')}`}>
                                                {item.count}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{item.stage}</p>
                                            <p className="text-xs text-gray-500">
                                                {i === 0 ? '100%' : `${Math.round((item.count / arr[0].count) * 100)}% хөрвөлт`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance by Project */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            Төслөөр (Top 3)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {MOCK_LEAD_BY_PROJECT.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.project}</p>
                                        <div className="flex gap-4 mt-1">
                                            <p className="text-xs text-gray-500">Сэжим: {item.leads}</p>
                                            <p className="text-xs text-green-600">Амжилттай: {item.won}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary">{formatCurrency(item.value)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Performers */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Percent className="w-5 h-5 text-primary" />
                            Шилдэг ажилтнууд
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {MOCK_TOP_PERFORMERS.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl relative overflow-hidden">
                                    {i === 0 && (
                                        <div className="absolute top-0 right-0 p-2 text-yellow-500 bg-yellow-50 rounded-bl-xl">
                                            Шилдэг
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="font-bold text-primary">{item.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-xs text-gray-500">Хөрвөлт: {Math.round((item.won / item.leads) * 100)}%</p>
                                        </div>
                                    </div>
                                    <div className="text-right pr-6 md:pr-0">
                                        <p className="font-bold text-gray-900">{formatCurrency(item.value)}</p>
                                        <p className="text-xs text-gray-500">{item.won} гэрээ</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default LeadsReport;
