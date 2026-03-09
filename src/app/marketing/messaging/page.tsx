'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Mail,
    MessageSquare,
    Send,
    Users,
    Eye,
    MousePointer,
    TrendingUp,
    TrendingDown,
    Plus,
    Clock,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Download,
    Sparkles,
    Bot,
    Loader2,
} from 'lucide-react';

// Mock messaging data
const MOCK_EMAIL_STATS = {
    sent: 4500,
    delivered: 4320,
    opened: 1890,
    clicked: 456,
    openRate: 43.8,
    clickRate: 10.6,
    unsubscribed: 12,
};

const MOCK_SMS_STATS = {
    sent: 1200,
    delivered: 1180,
    clicked: 234,
    clickRate: 19.8,
};

const MOCK_CAMPAIGNS = [
    {
        id: '1',
        name: 'Хаврын урамшуулал - Newsletter',
        type: 'email',
        status: 'sent',
        sentDate: '2026-02-01',
        recipients: 2500,
        opened: 1120,
        clicked: 245,
        openRate: 44.8,
    },
    {
        id: '2',
        name: 'Mandala Garden - Шинэ блок',
        type: 'sms',
        status: 'sent',
        sentDate: '2026-01-28',
        recipients: 800,
        opened: 0,
        clicked: 156,
        clickRate: 19.5,
    },
    {
        id: '3',
        name: 'VIP Урилга - Elysium',
        type: 'email',
        status: 'draft',
        sentDate: '',
        recipients: 150,
        opened: 0,
        clicked: 0,
        openRate: 0,
    },
    {
        id: '4',
        name: 'Төлбөрийн сануулга',
        type: 'sms',
        status: 'scheduled',
        sentDate: '2026-02-05',
        recipients: 45,
        opened: 0,
        clicked: 0,
        clickRate: 0,
    },
    {
        id: '5',
        name: 'Weekly Newsletter #4',
        type: 'email',
        status: 'sent',
        sentDate: '2026-01-25',
        recipients: 2400,
        opened: 980,
        clicked: 189,
        openRate: 40.8,
    },
];

const MOCK_TEMPLATES = [
    { id: '1', name: 'Шинэ төсөл танилцуулга', type: 'email', lastUsed: '2026-01-15' },
    { id: '2', name: 'Weekly Newsletter', type: 'email', lastUsed: '2026-01-25' },
    { id: '3', name: 'Урамшуулал мэдэгдэл', type: 'sms', lastUsed: '2026-01-20' },
    { id: '4', name: 'Төлбөрийн сануулга', type: 'sms', lastUsed: '2026-01-28' },
];

export default function MessagingPage() {
    const { shop } = useAuth();
    const [tab, setTab] = useState<'campaigns' | 'templates' | 'analysis'>('campaigns');
    const [filter, setFilter] = useState<'all' | 'email' | 'sms'>('all');

    // AI Analysis State
    const [aiData, setAiData] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const fetchAnalysisData = async () => {
        if (!shop?.id || isAnalyzing) return;
        setIsAnalyzing(true);
        try {
            const res = await fetch('/api/ai-assistant/analyze-messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shopId: shop.id })
            });
            if (res.ok) {
                const data = await res.json();
                setAiData(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    useEffect(() => {
        if (tab === 'analysis' && !aiData) {
            fetchAnalysisData();
        }
    }, [tab, shop]);

    const formatNumber = (num: number) => {
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sent': return 'bg-emerald-100 text-emerald-700';
            case 'scheduled': return 'bg-blue-100 text-blue-700';
            case 'draft': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'sent': return 'Илгээсэн';
            case 'scheduled': return 'Төлөвлөсөн';
            case 'draft': return 'Ноорог';
            default: return status;
        }
    };

    const filteredCampaigns = filter === 'all'
        ? MOCK_CAMPAIGNS
        : MOCK_CAMPAIGNS.filter(c => c.type === filter);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Mail className="w-7 h-7 text-purple-600" />
                        Email & SMS маркетинг
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Мессеж кампейн удирдлага
                    </p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Шинэ кампейн
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Email Stats */}
                <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                                <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Email статистик</h3>
                                <p className="text-xs text-gray-500">Сүүлийн 30 хоног</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            <div className="text-center p-2 bg-white rounded-lg">
                                <p className="text-lg font-bold text-gray-900">{formatNumber(MOCK_EMAIL_STATS.sent)}</p>
                                <p className="text-xs text-gray-500">Илгээсэн</p>
                            </div>
                            <div className="text-center p-2 bg-white rounded-lg">
                                <p className="text-lg font-bold text-gray-900">{formatNumber(MOCK_EMAIL_STATS.opened)}</p>
                                <p className="text-xs text-gray-500">Нээсэн</p>
                            </div>
                            <div className="text-center p-2 bg-white rounded-lg">
                                <p className="text-lg font-bold text-emerald-600">{MOCK_EMAIL_STATS.openRate}%</p>
                                <p className="text-xs text-gray-500">Open rate</p>
                            </div>
                            <div className="text-center p-2 bg-white rounded-lg">
                                <p className="text-lg font-bold text-blue-600">{MOCK_EMAIL_STATS.clickRate}%</p>
                                <p className="text-xs text-gray-500">Click rate</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* SMS Stats */}
                <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">SMS статистик</h3>
                                <p className="text-xs text-gray-500">Сүүлийн 30 хоног</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            <div className="text-center p-2 bg-white rounded-lg">
                                <p className="text-lg font-bold text-gray-900">{formatNumber(MOCK_SMS_STATS.sent)}</p>
                                <p className="text-xs text-gray-500">Илгээсэн</p>
                            </div>
                            <div className="text-center p-2 bg-white rounded-lg">
                                <p className="text-lg font-bold text-gray-900">{formatNumber(MOCK_SMS_STATS.delivered)}</p>
                                <p className="text-xs text-gray-500">Хүргэсэн</p>
                            </div>
                            <div className="text-center p-2 bg-white rounded-lg">
                                <p className="text-lg font-bold text-gray-900">{MOCK_SMS_STATS.clicked}</p>
                                <p className="text-xs text-gray-500">Клик</p>
                            </div>
                            <div className="text-center p-2 bg-white rounded-lg">
                                <p className="text-lg font-bold text-blue-600">{MOCK_SMS_STATS.clickRate}%</p>
                                <p className="text-xs text-gray-500">Click rate</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setTab('campaigns')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${tab === 'campaigns' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Кампейнүүд
                    </button>
                    <button
                        onClick={() => setTab('templates')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${tab === 'templates' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Загварууд
                    </button>
                    <button
                        onClick={() => setTab('analysis')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${tab === 'analysis' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            AI Шинжилгээ
                        </span>
                    </button>
                </div>
                {tab === 'campaigns' && (
                    <div className="flex items-center gap-2">
                        {['all', 'email', 'sms'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as typeof filter)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {f === 'all' ? 'Бүгд' : f.toUpperCase()}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            {tab === 'campaigns' ? (
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            {filteredCampaigns.map((campaign) => (
                                <div
                                    key={campaign.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${campaign.type === 'email' ? 'bg-emerald-100' : 'bg-blue-100'
                                            }`}>
                                            {campaign.type === 'email' ? (
                                                <Mail className={`w-5 h-5 text-emerald-600`} />
                                            ) : (
                                                <MessageSquare className={`w-5 h-5 text-blue-600`} />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-gray-900">{campaign.name}</p>
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                                                    {getStatusLabel(campaign.status)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {campaign.recipients} хүлээн авагч
                                                </span>
                                                {campaign.sentDate && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {campaign.sentDate}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {campaign.status === 'sent' && (
                                        <div className="flex items-center gap-6">
                                            {campaign.type === 'email' && (
                                                <>
                                                    <div className="text-center">
                                                        <p className="text-sm font-medium text-gray-900">{formatNumber(campaign.opened)}</p>
                                                        <p className="text-xs text-gray-500">Нээсэн</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-medium text-emerald-600">{campaign.openRate}%</p>
                                                        <p className="text-xs text-gray-500">Open rate</p>
                                                    </div>
                                                </>
                                            )}
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-blue-600">{campaign.clicked}</p>
                                                <p className="text-xs text-gray-500">Клик</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : tab === 'templates' ? (
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {MOCK_TEMPLATES.map((template) => (
                                <div
                                    key={template.id}
                                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${template.type === 'email' ? 'bg-emerald-100' : 'bg-blue-100'
                                        }`}>
                                        {template.type === 'email' ? (
                                            <Mail className="w-5 h-5 text-emerald-600" />
                                        ) : (
                                            <MessageSquare className="w-5 h-5 text-blue-600" />
                                        )}
                                    </div>
                                    <p className="font-medium text-gray-900 text-sm mb-1">{template.name}</p>
                                    <p className="text-xs text-gray-500">Сүүлд: {template.lastUsed}</p>
                                </div>
                            ))}
                            <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors">
                                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Шинэ загвар</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Bot className="w-5 h-5 text-emerald-500" />
                                    Мессеж & Чатны Шинжилгээ
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Нийт 2,450 харилцан ярианаас AI ашиглан нэгтгэсэн тайлан
                                </p>
                            </div>
                            <Button variant="outline" className="flex items-center gap-2 text-gray-600" onClick={fetchAnalysisData} disabled={isAnalyzing}>
                                <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                                Дахин шинжлэх
                            </Button>
                        </div>

                        {isAnalyzing && !aiData ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
                                <p>Харилцагчдын зурвасуудыг AI-аар уншуулж байна...</p>
                            </div>
                        ) : aiData ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* FAQ Section */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-purple-500" />
                                        Түгээмэл Асуултууд (FAQ)
                                    </h4>
                                    <div className="space-y-3">
                                        {aiData.faqs?.map((faq: any, i: number) => (
                                            <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="text-sm font-medium text-gray-900">{faq.q}</p>
                                                    <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600 border border-gray-200">
                                                        {faq.count} удаа
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs">
                                                    {faq.trend === 'up' ? <TrendingUp className="w-3 h-3 text-red-500" /> :
                                                        faq.trend === 'down' ? <TrendingDown className="w-3 h-3 text-emerald-500" /> :
                                                            <span className="w-3 h-3 block border-t-2 border-gray-400 my-auto" />}
                                                    <span className="text-gray-500">Сүүлийн 7 хоногт</span>
                                                </div>
                                            </div>
                                        ))}
                                        {(!aiData.faqs || aiData.faqs.length === 0) && (
                                            <p className="text-sm text-gray-500">Асуултууд олдсонгүй.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Topics & Sentiments */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-emerald-500" />
                                        Гол Сэдэв & Хандлага
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                            <h5 className="text-sm font-semibold text-emerald-900 mb-2">Эерэг хандлага ({aiData.positivePercent || 0}%)</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {aiData.positiveTraits?.map((trait: string, idx: number) => (
                                                    <span key={idx} className="px-2 py-1 bg-white text-emerald-700 text-xs rounded-full shadow-sm">{trait}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                            <h5 className="text-sm font-semibold text-red-900 mb-2">Гол асуудлууд ({aiData.negativePercent || 0}%)</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {aiData.negativeTraits?.map((trait: string, idx: number) => (
                                                    <span key={idx} className="px-2 py-1 bg-white text-red-700 text-xs rounded-full shadow-sm">{trait}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <p className="text-sm font-medium text-gray-700 mb-2">AI Дүгнэлт:</p>
                                            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                {aiData.summary}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
