'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Package,
    TrendingUp,
    AlertCircle,
    Star,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Eye,
    ShoppingCart
} from 'lucide-react';
import { BestSellersTable } from '@/components/dashboard/BestSellersTable';
import { useReports } from '@/hooks/useReports';

const KPI_CARDS = [
    {
        label: 'Нийт бүтээгдэхүүн',
        value: '342',
        trend: '+12',
        trendLabel: 'шинэ бараа',
        trendUp: true,
        icon: Package,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
    },
    {
        label: 'Идэвхтэй зарагдаж буй',
        value: '289',
        trend: '84.5%',
        trendLabel: 'нийт барааны',
        trendUp: true,
        icon: ShoppingCart,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100',
    },
    {
        label: 'Дуусах дөхсөн',
        value: '18',
        trend: '-5',
        trendLabel: 'өмнөх сараас',
        trendUp: true, // fewer stockouts is good
        icon: AlertCircle,
        color: 'text-amber-600',
        bgColor: 'bg-amber-100',
    },
    {
        label: 'Дундаж үнэлгээ',
        value: '4.8',
        trend: '+0.2',
        trendLabel: 'өмнөх сараас',
        trendUp: true,
        icon: Star,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
    },
];

const MOCK_CATEGORY_DATA = [
    { category: 'Арьс арчилгаа', count: 145, percentage: 42, color: 'bg-blue-500' },
    { category: 'Нүүр будалт', count: 98, percentage: 28, color: 'bg-pink-500' },
    { category: 'Үс арчилгаа', count: 56, percentage: 16, color: 'bg-indigo-500' },
    { category: 'Биеийн арчилгаа', count: 43, percentage: 14, color: 'bg-emerald-500' },
];

export function ProductsReport() {
    type Period = 'today' | 'week' | 'month' | 'year';
    const [period, setPeriod] = useState<Period>('month');
    const { data: reportData } = useReports(period);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Package className="w-6 h-6 text-primary" />
                        Бүтээгдэхүүний тайлан
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Бараа материалын үлдэгдэл болон гүйцэтгэл
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
                {/* Category Analysis */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            Ангиллаар
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {MOCK_CATEGORY_DATA.map((item, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-700">{item.category}</span>
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

                {/* Best Sellers */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Эрэлттэй бүтээгдэхүүн (Top 10)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BestSellersTable products={reportData?.bestSellers || []} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default ProductsReport;
