'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Star,
    TrendingUp,
    TrendingDown,
    Users,
    Eye,
    Heart,
    MessageCircle,
    Share2,
    RefreshCw,
    Download,
    Award,
    Sparkles,
    Zap,
    Quote,
} from 'lucide-react';

// Mock brand awareness data
const MOCK_STATS = {
    brandMentions: 324,
    mentionsChange: '+45%',
    sentimentScore: 4.6,
    sentimentChange: '+0.3',
    shareOfVoice: 28,
    voiceChange: '+5%',
    netPromoter: 72,
    npsChange: '+8',
};

const MOCK_SENTIMENT = {
    positive: 76,
    neutral: 18,
    negative: 6,
};

const MOCK_MENTIONS = [
    {
        id: '1',
        source: 'Facebook',
        author: 'Ц.Болормаа',
        content: 'Mandala Garden-ий байрыг үзэхээр очсон. Маш сайн чанартай, хүргэлт хурдан байна гэсэн. Үнэхээр сайн сонголт!',
        sentiment: 'positive',
        date: '2026-02-01',
        reach: 1200,
    },
    {
        id: '2',
        source: 'Instagram',
        author: '@batbold_mn',
        content: 'Elysium Residence penthouse 😍 Үнийн санал авахаар холбоо барьлаа. Маш мэргэжлийн үйлчилгээ!',
        sentiment: 'positive',
        date: '2026-01-30',
        reach: 3400,
    },
    {
        id: '3',
        source: 'Google Reviews',
        author: 'Ганбат Б.',
        content: 'Mandala Tower 365 барилгын ажил удаашралтай байгаа. Гэхдээ чанар сайн гэж найдаж байна.',
        sentiment: 'neutral',
        date: '2026-01-28',
        reach: 450,
    },
    {
        id: '4',
        source: 'Facebook',
        author: 'Н.Оюунаа',
        content: 'Vertmon компани дээр байр захиалсан. Маш их талархаж байна. Бүх зүйл тодорхой, ил тод!',
        sentiment: 'positive',
        date: '2026-01-25',
        reach: 890,
    },
];

const MOCK_COMPETITORS = [
    { name: 'Vertmon', share: 28, color: 'purple' },
    { name: 'Grand Plaza', share: 24, color: 'blue' },
    { name: 'Mongolyn Alt', share: 20, color: 'emerald' },
    { name: 'Newcom', share: 18, color: 'amber' },
    { name: 'Бусад', share: 10, color: 'gray' },
];

const MOCK_BRAND_HEALTH = [
    { metric: 'Таних байдал', score: 72, benchmark: 65 },
    { metric: 'Итгэлцэл', score: 68, benchmark: 60 },
    { metric: 'Санал болгох', score: 74, benchmark: 55 },
    { metric: 'Үнэ цэнийн мэдрэмж', score: 65, benchmark: 58 },
];

export default function BrandPage() {
    const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

    const getSentimentColor = (sentiment: string) => {
        switch (sentiment) {
            case 'positive': return 'bg-emerald-100 text-emerald-700';
            case 'neutral': return 'bg-gray-100 text-gray-700';
            case 'negative': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getSentimentLabel = (sentiment: string) => {
        switch (sentiment) {
            case 'positive': return 'Эерэг';
            case 'neutral': return 'Төвийг сахисан';
            case 'negative': return 'Сөрөг';
            default: return sentiment;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Award className="w-7 h-7 text-purple-600" />
                        Брэнд мэдрэмж
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Брэндийн таних байдал, сэтгэл хөдлөл шинжилгээ
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
                            <MessageCircle className="w-5 h-5 text-blue-500" />
                            <span className={`text-xs font-medium flex items-center text-emerald-600`}>
                                <TrendingUp className="w-3 h-3 mr-0.5" />
                                {MOCK_STATS.mentionsChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{MOCK_STATS.brandMentions}</p>
                        <p className="text-xs text-gray-500">Брэнд дурдагдсан</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Star className="w-5 h-5 text-amber-500" />
                            <span className={`text-xs font-medium flex items-center text-emerald-600`}>
                                <TrendingUp className="w-3 h-3 mr-0.5" />
                                {MOCK_STATS.sentimentChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{MOCK_STATS.sentimentScore}/5</p>
                        <p className="text-xs text-gray-500">Сэтгэл ханамж</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Zap className="w-5 h-5 text-purple-500" />
                            <span className={`text-xs font-medium flex items-center text-emerald-600`}>
                                <TrendingUp className="w-3 h-3 mr-0.5" />
                                {MOCK_STATS.voiceChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{MOCK_STATS.shareOfVoice}%</p>
                        <p className="text-xs text-gray-500">Share of Voice</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Sparkles className="w-5 h-5 text-emerald-500" />
                            <span className={`text-xs font-medium flex items-center text-emerald-600`}>
                                <TrendingUp className="w-3 h-3 mr-0.5" />
                                {MOCK_STATS.npsChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{MOCK_STATS.netPromoter}</p>
                        <p className="text-xs text-gray-500">Net Promoter Score</p>
                    </CardContent>
                </Card>
            </div>

            {/* Sentiment & Competition */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sentiment Breakdown */}
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Сэтгэл хөдлөлийн хуваарилалт</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <div
                                className="h-4 bg-emerald-500 rounded-l-full"
                                style={{ width: `${MOCK_SENTIMENT.positive}%` }}
                            />
                            <div
                                className="h-4 bg-gray-400"
                                style={{ width: `${MOCK_SENTIMENT.neutral}%` }}
                            />
                            <div
                                className="h-4 bg-red-500 rounded-r-full"
                                style={{ width: `${MOCK_SENTIMENT.negative}%` }}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-emerald-50 rounded-lg">
                                <p className="text-2xl font-bold text-emerald-600">{MOCK_SENTIMENT.positive}%</p>
                                <p className="text-xs text-gray-600">Эерэг</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-gray-600">{MOCK_SENTIMENT.neutral}%</p>
                                <p className="text-xs text-gray-600">Төвийг сахисан</p>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                <p className="text-2xl font-bold text-red-600">{MOCK_SENTIMENT.negative}%</p>
                                <p className="text-xs text-gray-600">Сөрөг</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Share of Voice */}
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Share of Voice - Өрсөлдөгчид</h3>
                        <div className="space-y-3">
                            {MOCK_COMPETITORS.map((comp, idx) => (
                                <div key={comp.name}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-sm ${idx === 0 ? 'font-semibold text-purple-700' : 'text-gray-700'}`}>
                                            {comp.name} {idx === 0 && '(Бид)'}
                                        </span>
                                        <span className="text-sm font-medium text-gray-900">{comp.share}%</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${comp.color === 'purple' ? 'bg-purple-500' :
                                                    comp.color === 'blue' ? 'bg-blue-500' :
                                                        comp.color === 'emerald' ? 'bg-emerald-500' :
                                                            comp.color === 'amber' ? 'bg-amber-500' : 'bg-gray-400'
                                                }`}
                                            style={{ width: `${comp.share}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Mentions */}
            <Card className="bg-white border-gray-200">
                <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Сүүлийн дурдлагууд</h3>
                    <div className="space-y-3">
                        {MOCK_MENTIONS.map((mention) => (
                            <div
                                key={mention.id}
                                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                                        <Quote className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-gray-900 text-sm">{mention.author}</span>
                                            <span className="text-xs text-gray-500">• {mention.source}</span>
                                            <span className="text-xs text-gray-500">• {mention.date}</span>
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${getSentimentColor(mention.sentiment)}`}>
                                                {getSentimentLabel(mention.sentiment)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700">{mention.content}</p>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                            <Eye className="w-3 h-3" />
                                            <span>~{mention.reach.toLocaleString()} хүрэлт</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Brand Health */}
            <Card className="bg-white border-gray-200">
                <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Брэндийн эрүүл мэнд</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {MOCK_BRAND_HEALTH.map((item) => (
                            <div key={item.metric} className="p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-600">{item.metric}</span>
                                    <span className={`text-xs ${item.score > item.benchmark ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {item.score > item.benchmark ? '+' : ''}{item.score - item.benchmark} vs салбар
                                    </span>
                                </div>
                                <div className="relative">
                                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-500 rounded-full"
                                            style={{ width: `${item.score}%` }}
                                        />
                                    </div>
                                    <div
                                        className="absolute top-0 w-0.5 h-3 bg-gray-600"
                                        style={{ left: `${item.benchmark}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-2xl font-bold text-gray-900">{item.score}%</span>
                                    <span className="text-xs text-gray-500">Салбар: {item.benchmark}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
