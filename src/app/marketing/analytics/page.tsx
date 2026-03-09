'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Globe,
    Users,
    Eye,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    TrendingDown,
    Monitor,
    Smartphone,
    Tablet,
    MapPin,
    RefreshCw,
    Download,
} from 'lucide-react';

// Mock web analytics data
const MOCK_STATS = {
    visitors: 12450,
    visitorsChange: '+18%',
    pageViews: 45200,
    pageViewsChange: '+23%',
    avgDuration: '2:45',
    durationChange: '+12%',
    bounceRate: 42.5,
    bounceRateChange: '-3.2%',
};

const MOCK_TOP_PAGES = [
    { path: '/', name: 'Нүүр хуудас', views: 15200, avgTime: '1:20' },
    { path: '/mandala-garden', name: 'Mandala Garden', views: 8900, avgTime: '3:45' },
    { path: '/elysium', name: 'Elysium Residence', views: 6700, avgTime: '4:12' },
    { path: '/mandala-tower', name: 'Mandala Tower', views: 5400, avgTime: '3:20' },
    { path: '/contact', name: 'Холбоо барих', views: 3200, avgTime: '0:45' },
];

const MOCK_SOURCES = [
    { source: 'Facebook', visits: 4500, percentage: 36 },
    { source: 'Google', visits: 3200, percentage: 26 },
    { source: 'Direct', visits: 2400, percentage: 19 },
    { source: 'Instagram', visits: 1800, percentage: 14 },
    { source: 'Referral', visits: 550, percentage: 5 },
];

const MOCK_DEVICES = [
    { device: 'Mobile', icon: Smartphone, visits: 7500, percentage: 60 },
    { device: 'Desktop', icon: Monitor, visits: 4200, percentage: 34 },
    { device: 'Tablet', icon: Tablet, visits: 750, percentage: 6 },
];

const MOCK_LOCATIONS = [
    { city: 'Улаанбаатар', visits: 9800 },
    { city: 'Дархан', visits: 890 },
    { city: 'Эрдэнэт', visits: 650 },
    { city: 'Бусад', visits: 1110 },
];

const MOCK_HOURLY = [
    { hour: '00', visitors: 120 },
    { hour: '06', visitors: 280 },
    { hour: '09', visitors: 890 },
    { hour: '12', visitors: 1200 },
    { hour: '15', visitors: 980 },
    { hour: '18', visitors: 1450 },
    { hour: '21', visitors: 780 },
];

export default function AnalyticsPage() {
    const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

    const stats = MOCK_STATS;
    const maxVisitors = Math.max(...MOCK_HOURLY.map(h => h.visitors));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Globe className="w-7 h-7 text-purple-600" />
                        Вэб аналитик
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Вэбсайтын хандалт, хэрэглэгчийн үйлдэл
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

            {/* Key Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            <span className={`text-xs font-medium flex items-center ${stats.visitorsChange.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                                {stats.visitorsChange.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                                {stats.visitorsChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.visitors.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Зочид</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Eye className="w-5 h-5 text-purple-500" />
                            <span className={`text-xs font-medium flex items-center ${stats.pageViewsChange.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                                {stats.pageViewsChange.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                                {stats.pageViewsChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.pageViews.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Хуудас үзэлт</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Clock className="w-5 h-5 text-emerald-500" />
                            <span className={`text-xs font-medium flex items-center ${stats.durationChange.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                                {stats.durationChange.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                                {stats.durationChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.avgDuration}</p>
                        <p className="text-xs text-gray-500">Дундаж хугацаа</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <ArrowDownRight className="w-5 h-5 text-amber-500" />
                            <span className={`text-xs font-medium flex items-center ${stats.bounceRateChange.startsWith('-') ? 'text-emerald-600' : 'text-red-600'}`}>
                                {stats.bounceRateChange.startsWith('-') ? <TrendingDown className="w-3 h-3 mr-0.5" /> : <TrendingUp className="w-3 h-3 mr-0.5" />}
                                {stats.bounceRateChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.bounceRate}%</p>
                        <p className="text-xs text-gray-500">Bounce rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hourly Traffic */}
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Цагийн трафик</h3>
                        <div className="h-40 flex items-end justify-between gap-4">
                            {MOCK_HOURLY.map((hour) => (
                                <div key={hour.hour} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full bg-purple-500 rounded-t hover:bg-purple-600 transition-colors"
                                        style={{ height: `${(hour.visitors / maxVisitors) * 120}px` }}
                                    />
                                    <span className="text-xs text-gray-500">{hour.hour}:00</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Traffic Sources */}
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Трафикийн эх үүсвэр</h3>
                        <div className="space-y-3">
                            {MOCK_SOURCES.map((source) => (
                                <div key={source.source}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-700">{source.source}</span>
                                        <span className="text-sm font-medium text-gray-900">{source.visits.toLocaleString()} ({source.percentage}%)</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-500 rounded-full"
                                            style={{ width: `${source.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Pages */}
                <Card className="bg-white border-gray-200 lg:col-span-2">
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Шилдэг хуудсууд</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-2 text-xs text-gray-500 font-medium">Хуудас</th>
                                        <th className="text-right py-2 text-xs text-gray-500 font-medium">Үзэлт</th>
                                        <th className="text-right py-2 text-xs text-gray-500 font-medium">Дундаж хугацаа</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MOCK_TOP_PAGES.map((page) => (
                                        <tr key={page.path} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-3">
                                                <p className="font-medium text-gray-900 text-sm">{page.name}</p>
                                                <p className="text-xs text-gray-500">{page.path}</p>
                                            </td>
                                            <td className="py-3 text-right text-sm font-medium text-gray-900">
                                                {page.views.toLocaleString()}
                                            </td>
                                            <td className="py-3 text-right text-sm text-gray-600">{page.avgTime}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Devices & Locations */}
                <div className="space-y-6">
                    <Card className="bg-white border-gray-200">
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-4">Төхөөрөмжүүд</h3>
                            <div className="space-y-3">
                                {MOCK_DEVICES.map((device) => {
                                    const Icon = device.icon;
                                    return (
                                        <div key={device.device} className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <Icon className="w-4 h-4 text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">{device.device}</span>
                                                    <span className="text-sm font-medium text-gray-900">{device.percentage}%</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                                                    <div
                                                        className="h-full bg-purple-500 rounded-full"
                                                        style={{ width: `${device.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-gray-200">
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-4">Байршлаар</h3>
                            <div className="space-y-2">
                                {MOCK_LOCATIONS.map((loc) => (
                                    <div key={loc.city} className="flex items-center justify-between py-1">
                                        <span className="text-sm text-gray-700 flex items-center gap-2">
                                            <MapPin className="w-3 h-3 text-gray-400" />
                                            {loc.city}
                                        </span>
                                        <span className="text-sm font-medium text-gray-900">{loc.visits.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
