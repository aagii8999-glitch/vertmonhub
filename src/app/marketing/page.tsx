'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    TrendingUp,
    TrendingDown,
    Users,
    Eye,
    MousePointer,
    DollarSign,
    Target,
    Megaphone,
    Calendar,
    ArrowUpRight,
    BarChart3,
    Share2,
    Mail,
    Sparkles,
} from 'lucide-react';
import Link from 'next/link';

// Mock data for marketing dashboard
const MOCK_STATS = {
    totalReach: 125000,
    reachChange: '+23%',
    totalImpressions: 450000,
    impressionsChange: '+18%',
    engagement: 4.2,
    engagementChange: '+0.8%',
    leads: 89,
    leadsChange: '+34%',
    adSpend: 2500000, // 2.5 сая
    adSpendChange: '-5%',
    costPerLead: 28090,
    costPerLeadChange: '-12%',
};

const MOCK_CAMPAIGNS = [
    { name: 'Mandala Garden - Хаврын урамшуулал', status: 'active', reach: 45000, leads: 23, budget: 800000 },
    { name: 'Elysium - VIP танилцуулга', status: 'active', reach: 28000, leads: 12, budget: 600000 },
    { name: 'Mandala Tower - Өрөө захиалга', status: 'scheduled', reach: 0, leads: 0, budget: 500000 },
];

const MOCK_TOP_CONTENT = [
    { title: '3D Tour - Elysium Penthouse', type: 'video', views: 12500, engagement: 8.2 },
    { title: 'Mandala Garden - Байрны танилцуулга', type: 'carousel', views: 8900, engagement: 5.4 },
    { title: 'Төлбөрийн нөхцөл - Infographic', type: 'image', views: 6700, engagement: 3.8 },
];

const MOCK_UPCOMING = [
    { title: 'Instagram Story - Mandala Tower', date: '02/03', platform: 'instagram' },
    { title: 'Facebook Post - Хаврын урамшуулал', date: '02/04', platform: 'facebook' },
    { title: 'Email Newsletter', date: '02/05', platform: 'email' },
];

export default function MarketingDashboardPage() {
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

    const stats = MOCK_STATS;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-7 h-7 text-purple-600" />
                        Маркетингийн хяналтын самбар
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Бүх маркетингийн үйл ажиллагааны нэгдсэн харагдац
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700">
                        <option>Сүүлийн 7 хоног</option>
                        <option>Сүүлийн 30 хоног</option>
                        <option>Энэ сар</option>
                        <option>Энэ улирал</option>
                    </select>
                    <Link href="/marketing/campaigns">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                            <Megaphone className="w-4 h-4 mr-2" />
                            Шинэ кампейн
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Eye className="w-5 h-5 text-blue-500" />
                            <span className={`text-xs font-medium flex items-center ${stats.reachChange.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                                {stats.reachChange.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                                {stats.reachChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalReach)}</p>
                        <p className="text-xs text-gray-500">Нийт хүрэлт</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <MousePointer className="w-5 h-5 text-purple-500" />
                            <span className={`text-xs font-medium flex items-center ${stats.impressionsChange.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                                {stats.impressionsChange.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                                {stats.impressionsChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalImpressions)}</p>
                        <p className="text-xs text-gray-500">Үзэлт</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Share2 className="w-5 h-5 text-pink-500" />
                            <span className={`text-xs font-medium flex items-center ${stats.engagementChange.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                                {stats.engagementChange.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                                {stats.engagementChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.engagement}%</p>
                        <p className="text-xs text-gray-500">Engagement</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="w-5 h-5 text-emerald-500" />
                            <span className={`text-xs font-medium flex items-center ${stats.leadsChange.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                                {stats.leadsChange.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                                {stats.leadsChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.leads}</p>
                        <p className="text-xs text-gray-500">Шинэ lead</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <DollarSign className="w-5 h-5 text-amber-500" />
                            <span className={`text-xs font-medium flex items-center ${stats.adSpendChange.startsWith('+') ? 'text-red-600' : 'text-emerald-600'}`}>
                                {stats.adSpendChange.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                                {stats.adSpendChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.adSpend)}</p>
                        <p className="text-xs text-gray-500">Зарын зардал</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Target className="w-5 h-5 text-indigo-500" />
                            <span className={`text-xs font-medium flex items-center ${stats.costPerLeadChange.startsWith('-') ? 'text-emerald-600' : 'text-red-600'}`}>
                                {stats.costPerLeadChange.startsWith('-') ? <TrendingDown className="w-3 h-3 mr-0.5" /> : <TrendingUp className="w-3 h-3 mr-0.5" />}
                                {stats.costPerLeadChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.costPerLead)}</p>
                        <p className="text-xs text-gray-500">Cost per lead</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Campaigns */}
                <Card className="bg-white border-gray-200 lg:col-span-2">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Megaphone className="w-5 h-5 text-purple-500" />
                                Идэвхтэй кампейнүүд
                            </h3>
                            <Link href="/marketing/campaigns" className="text-sm text-purple-600 hover:underline flex items-center">
                                Бүгдийг харах <ArrowUpRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {MOCK_CAMPAIGNS.map((campaign, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${campaign.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{campaign.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {campaign.status === 'active' ? 'Идэвхтэй' : 'Төлөвлөсөн'} · {formatCurrency(campaign.budget)} төсөв
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{formatNumber(campaign.reach)} хүрэлт</p>
                                        <p className="text-xs text-emerald-600">{campaign.leads} lead</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Content */}
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-500" />
                                Ойрын контент
                            </h3>
                            <Link href="/marketing/calendar" className="text-sm text-purple-600 hover:underline flex items-center">
                                Календарь <ArrowUpRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {MOCK_UPCOMING.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.platform === 'instagram' ? 'bg-pink-100' :
                                            item.platform === 'facebook' ? 'bg-blue-100' : 'bg-gray-100'
                                        }`}>
                                        {item.platform === 'email' ? (
                                            <Mail className="w-5 h-5 text-gray-600" />
                                        ) : (
                                            <Share2 className={`w-5 h-5 ${item.platform === 'instagram' ? 'text-pink-600' : 'text-blue-600'}`} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                        <p className="text-xs text-gray-500">{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Content */}
            <Card className="bg-white border-gray-200">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            Шилдэг контентууд
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {MOCK_TOP_CONTENT.map((content, idx) => (
                            <div key={idx} className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 text-xs rounded-full ${content.type === 'video' ? 'bg-red-100 text-red-700' :
                                            content.type === 'carousel' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {content.type === 'video' ? 'Видео' : content.type === 'carousel' ? 'Carousel' : 'Зураг'}
                                    </span>
                                </div>
                                <p className="font-medium text-gray-900 text-sm mb-3">{content.title}</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-1">
                                        <Eye className="w-4 h-4" /> {formatNumber(content.views)}
                                    </span>
                                    <span className="text-emerald-600 font-medium">{content.engagement}% engagement</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/marketing/ads" className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white hover:shadow-lg transition-shadow">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    <p className="font-medium">Зар сурталчилгаа</p>
                    <p className="text-xs text-blue-100">Facebook & Instagram Ads</p>
                </Link>
                <Link href="/marketing/social" className="p-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl text-white hover:shadow-lg transition-shadow">
                    <Share2 className="w-6 h-6 mb-2" />
                    <p className="font-medium">Социал медиа</p>
                    <p className="text-xs text-pink-100">Performance дашбоард</p>
                </Link>
                <Link href="/marketing/messaging" className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white hover:shadow-lg transition-shadow">
                    <Mail className="w-6 h-6 mb-2" />
                    <p className="font-medium">Email & SMS</p>
                    <p className="text-xs text-emerald-100">Мессеж кампейн</p>
                </Link>
                <Link href="/marketing/sources" className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white hover:shadow-lg transition-shadow">
                    <Users className="w-6 h-6 mb-2" />
                    <p className="font-medium">Lead эх үүсвэр</p>
                    <p className="text-xs text-amber-100">Хаанаас ирж байна</p>
                </Link>
            </div>
        </div>
    );
}
