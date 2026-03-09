'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/Dialog';
import {
    Target,
    Users,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ArrowUpRight,
    Facebook,
    Instagram,
    Globe,
    Phone,
    MessageCircle,
    Building2,
    UserCheck,
    RefreshCw,
    Download,
    Eye,
    Plus
} from 'lucide-react';

// Mock lead source data
const MOCK_STATS = {
    totalLeads: 89,
    leadsChange: '+34%',
    totalValue: 4250000000,
    valueChange: '+28%',
    conversionRate: 12.5,
    conversionChange: '+2.1%',
    avgCost: 28090,
    costChange: '-12%',
};

const MOCK_SOURCES = [
    {
        id: 'facebook',
        name: 'Facebook',
        type: 'social',
        icon: Facebook,
        color: 'blue',
        leads: 32,
        qualified: 18,
        converted: 5,
        cost: 800000,
        revenue: 1850000000,
        cpl: 25000,
        conversionRate: 15.6,
    },
    {
        id: 'instagram',
        name: 'Instagram',
        type: 'social',
        icon: Instagram,
        color: 'pink',
        leads: 24,
        qualified: 14,
        converted: 3,
        cost: 500000,
        revenue: 980000000,
        cpl: 20833,
        conversionRate: 12.5,
    },
    {
        id: 'website',
        name: 'Вэбсайт',
        type: 'direct',
        icon: Globe,
        color: 'purple',
        leads: 18,
        qualified: 12,
        converted: 4,
        cost: 300000,
        revenue: 1200000000,
        cpl: 16667,
        conversionRate: 22.2,
    },
    {
        id: 'phone',
        name: 'Утасны дуудлага',
        type: 'direct',
        icon: Phone,
        color: 'emerald',
        leads: 8,
        qualified: 6,
        converted: 2,
        cost: 0,
        revenue: 620000000,
        cpl: 0,
        conversionRate: 25.0,
    },
    {
        id: 'referral',
        name: 'Санал болгосон',
        type: 'direct',
        icon: UserCheck,
        color: 'amber',
        leads: 7,
        qualified: 5,
        converted: 2,
        cost: 0,
        revenue: 890000000,
        cpl: 0,
        conversionRate: 28.6,
    },
];

const MOCK_MONTHLY = [
    { month: '9-р сар', facebook: 25, instagram: 18, website: 12, other: 8 },
    { month: '10-р сар', facebook: 28, instagram: 20, website: 15, other: 10 },
    { month: '11-р сар', facebook: 30, instagram: 22, website: 14, other: 9 },
    { month: '12-р сар', facebook: 35, instagram: 26, website: 18, other: 12 },
    { month: '1-р сар', facebook: 32, instagram: 24, website: 18, other: 15 },
];

export default function SourcesPage() {
    const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
    const [customChannels, setCustomChannels] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal states
    const [isAddChannelOpen, setIsAddChannelOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'social',
        description: ''
    });

    // Contracts Modal States
    const [isContractsOpen, setIsContractsOpen] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState<any>(null);
    const [contractsData, setContractsData] = useState<any[]>([]);
    const [isLoadingContracts, setIsLoadingContracts] = useState(false);

    // Add Contract States
    const [isAddContractOpen, setIsAddContractOpen] = useState(false);
    const [isSubmittingContract, setIsSubmittingContract] = useState(false);
    const [contractFormData, setContractFormData] = useState({
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        budget: 0,
        currency: 'MNT',
        kpi_target: '',
        terms: ''
    });

    const fetchChannels = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/marketing/channels');
            if (res.ok) {
                const data = await res.json();
                setCustomChannels(data.channels || []);
            }
        } catch (error) {
            console.error("Failed to load channel data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchContractsForChannel = async (channelId: string) => {
        setIsLoadingContracts(true);
        try {
            const res = await fetch(`/api/marketing/contracts?channel_id=${channelId}`);
            if (res.ok) {
                const data = await res.json();
                setContractsData(data.contracts || []);
            }
        } catch (error) {
            console.error("Failed to load contracts data", error);
        } finally {
            setIsLoadingContracts(false);
        }
    };

    const handleViewContracts = (source: any) => {
        setSelectedChannel(source);
        setIsContractsOpen(true);

        // Only fetch if it's a real channel from DB (uuid format roughly)
        if (source.id && source.id.length > 20) {
            fetchContractsForChannel(source.id);
        } else {
            // Mock source fallback
            setContractsData([]);
        }
    };

    const handleCreateContract = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedChannel) return;

        setIsSubmittingContract(true);
        try {
            const res = await fetch('/api/marketing/contracts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    channel_id: selectedChannel.id,
                    ...contractFormData,
                    budget: Number(contractFormData.budget)
                }),
            });

            if (res.ok) {
                setIsAddContractOpen(false);
                setContractFormData({
                    start_date: new Date().toISOString().split('T')[0],
                    end_date: '',
                    budget: 0,
                    currency: 'MNT',
                    kpi_target: '',
                    terms: ''
                });
                fetchContractsForChannel(selectedChannel.id); // refresh
            } else {
                const error = await res.json();
                console.error("Failed to add contract", error);
                alert("Алдаа гарлаа: " + (error.error || "Үл мэдэгдэх алдаа"));
            }
        } catch (error) {
            console.error("Error creating contract", error);
        } finally {
            setIsSubmittingContract(false);
        }
    };

    useEffect(() => {
        fetchChannels();
    }, []);

    const handleCreateChannel = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/marketing/channels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsAddChannelOpen(false);
                setFormData({ name: '', type: 'social', description: '' });
                fetchChannels(); // refresh
            } else {
                const error = await res.json();
                console.error("Failed to add channel", error);
            }
        } catch (error) {
            console.error("Error creating channel", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    // Combine custom fetched channels with the mock core data to show in UI
    const allSources = [...MOCK_SOURCES, ...customChannels.map(ch => ({
        id: ch.id,
        name: ch.name || '-',
        type: ch.type,
        icon: Globe, // generic icon for custom ones
        color: 'gray',
        leads: 0,
        qualified: 0,
        converted: 0,
        cost: 0,
        revenue: 0,
        cpl: 0,
        conversionRate: 0,
    }))];

    const formatCurrency = (value: number) => {
        if (value >= 1000000000) {
            return `${(value / 1000000000).toFixed(2)} тэрбум`;
        }
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)} сая`;
        }
        return `${(value / 1000).toFixed(0)}K`;
    };

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; text: string; light: string }> = {
            blue: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-100' },
            pink: { bg: 'bg-pink-500', text: 'text-pink-600', light: 'bg-pink-100' },
            purple: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-100' },
            emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-100' },
            amber: { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-100' },
            gray: { bg: 'bg-gray-500', text: 'text-gray-600', light: 'bg-gray-100' },
        };
        return colors[color] || colors.blue;
    };

    const totalLeads = allSources.reduce((sum, s) => sum + s.leads, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Target className="w-7 h-7 text-purple-600" />
                        Lead эх үүсвэр (Channels & Contracts)
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Сувгийн тохиргоо, гэрээ, болон Lead-үүдийн эх үүсвэр, чанар, ROI
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={isAddChannelOpen} onOpenChange={setIsAddChannelOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Шинэ суваг
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Шинэ маркетинг суваг нэмэх</DialogTitle>
                                <DialogDescription>
                                    Гэрээ болон зардлын хяналт хийх сувгаа бүртгэх.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateChannel} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Сувгийн нэр *</Label>
                                    <Input
                                        id="name"
                                        placeholder="Дээд түвшний суваг (жишээ нь Influencer A)"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Сувгийн төрөл</Label>
                                    <select
                                        id="type"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    >
                                        <option value="social">Сошиал медиа</option>
                                        <option value="search">Хайлтын систем</option>
                                        <option value="affiliate">Хамтын ажиллагаа (Affiliate/Influencer)</option>
                                        <option value="direct">Шууд (Direct)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Тайлбар</Label>
                                    <Input
                                        id="description"
                                        placeholder="Нэмэлт мэдээлэл..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button type="button" variant="outline" className="mr-2" onClick={() => setIsAddChannelOpen(false)}>
                                        Цуцлах
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Хадгалж байна...' : 'Хадгалах'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
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
                            <span className={`text-xs font-medium flex items-center text-emerald-600`}>
                                <TrendingUp className="w-3 h-3 mr-0.5" />
                                {MOCK_STATS.leadsChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{MOCK_STATS.totalLeads}</p>
                        <p className="text-xs text-gray-500">Нийт lead</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <DollarSign className="w-5 h-5 text-emerald-500" />
                            <span className={`text-xs font-medium flex items-center text-emerald-600`}>
                                <TrendingUp className="w-3 h-3 mr-0.5" />
                                {MOCK_STATS.valueChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(MOCK_STATS.totalValue)}</p>
                        <p className="text-xs text-gray-500">Борлуулалтын үнэ цэнэ</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <ArrowUpRight className="w-5 h-5 text-purple-500" />
                            <span className={`text-xs font-medium flex items-center text-emerald-600`}>
                                <TrendingUp className="w-3 h-3 mr-0.5" />
                                {MOCK_STATS.conversionChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{MOCK_STATS.conversionRate}%</p>
                        <p className="text-xs text-gray-500">Хөрвүүлэлтийн хувь</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Target className="w-5 h-5 text-amber-500" />
                            <span className={`text-xs font-medium flex items-center text-emerald-600`}>
                                <TrendingDown className="w-3 h-3 mr-0.5" />
                                {MOCK_STATS.costChange}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(MOCK_STATS.avgCost)}</p>
                        <p className="text-xs text-gray-500">Дундаж CPL</p>
                    </CardContent>
                </Card>
            </div>

            {/* Source Breakdown */}
            <Card className="bg-white border-gray-200">
                <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Эх үүсвэрийн задаргаа</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 text-xs text-gray-500 font-medium">Эх үүсвэр</th>
                                    <th className="text-center py-3 text-xs text-gray-500 font-medium">Lead</th>
                                    <th className="text-center py-3 text-xs text-gray-500 font-medium">Чанартай</th>
                                    <th className="text-center py-3 text-xs text-gray-500 font-medium">Хөрвүүлсэн</th>
                                    <th className="text-center py-3 text-xs text-gray-500 font-medium">Зардал</th>
                                    <th className="text-center py-3 text-xs text-gray-500 font-medium">CPL</th>
                                    <th className="text-center py-3 text-xs text-gray-500 font-medium">Орлого</th>
                                    <th className="text-center py-3 text-xs text-gray-500 font-medium">Хөрвүүлэлт</th>
                                    <th className="text-center py-3 text-xs text-gray-500 font-medium">Удирдах</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allSources.map((source) => {
                                    const Icon = source.icon;
                                    const colors = getColorClasses(source.color);
                                    return (
                                        <tr key={source.id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.light}`}>
                                                        <Icon className={`w-5 h-5 ${colors.text}`} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{source.name}</p>
                                                        <p className="text-xs text-gray-500">{totalLeads > 0 ? Math.round((source.leads / totalLeads) * 100) : 0}% хувь</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className="text-lg font-bold text-gray-900">{source.leads}</span>
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className="text-sm text-gray-600">{source.qualified}</span>
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                                    {source.converted}
                                                </span>
                                            </td>
                                            <td className="py-4 text-center text-sm text-gray-600">
                                                {source.cost > 0 ? formatCurrency(source.cost) : '-'}
                                            </td>
                                            <td className="py-4 text-center text-sm text-gray-600">
                                                {source.cpl > 0 ? formatCurrency(source.cpl) : '-'}
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className="text-sm font-medium text-emerald-600">
                                                    {source.revenue > 0 ? formatCurrency(source.revenue) : '-'}
                                                </span>
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className={`text-sm font-medium ${source.conversionRate > 20 ? 'text-emerald-600' :
                                                    source.conversionRate > 15 ? 'text-amber-600' : 'text-gray-600'
                                                    }`}>
                                                    {source.conversionRate}%
                                                </span>
                                            </td>
                                            <td className="py-4 text-center">
                                                <Button variant="ghost" size="sm" onClick={() => handleViewContracts(source)}>
                                                    <Eye className="w-4 h-4 mr-2" /> Гэрээ
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Source Distribution */}
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Lead хуваарилалт</h3>
                        <div className="space-y-3">
                            {allSources.map((source) => {
                                const colors = getColorClasses(source.color);
                                const percentage = totalLeads > 0 ? Math.round((source.leads / totalLeads) * 100) : 0;
                                return (
                                    <div key={source.id}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-gray-700">{source.name}</span>
                                            <span className="text-sm font-medium text-gray-900">{source.leads} ({percentage}%)</span>
                                        </div>
                                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${colors.bg}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* ROI by Source */}
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-4">ROI эх үүсвэрээр</h3>
                        <div className="space-y-4">
                            {allSources.filter(s => s.cost > 0).map((source) => {
                                const roi = ((source.revenue - source.cost) / source.cost * 100).toFixed(0);
                                const colors = getColorClasses(source.color);
                                return (
                                    <div key={source.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.light}`}>
                                                <source.icon className={`w-4 h-4 ${colors.text}`} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{source.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    Зардал: {formatCurrency(source.cost)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-emerald-600">+{roi}%</p>
                                            <p className="text-xs text-gray-500">ROI</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Contracts Dialog */}
            <Dialog open={isContractsOpen} onOpenChange={setIsContractsOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex justify-between items-center pr-6">
                            <span>Гэрээний дэлгэрэнгүй: {selectedChannel?.name}</span>
                            <Dialog open={isAddContractOpen} onOpenChange={setIsAddContractOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Шинэ гэрээ
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Шинэ гэрээ нэмэх ({selectedChannel?.name})</DialogTitle>
                                        <DialogDescription>
                                            Энэхүү сувагтай байгуулах шинэ гэрээ/нөхцөлийг оруулна уу.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleCreateContract} className="space-y-4 pt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="start_date">Эхлэх огноо *</Label>
                                                <Input
                                                    id="start_date"
                                                    type="date"
                                                    value={contractFormData.start_date}
                                                    onChange={(e) => setContractFormData({ ...contractFormData, start_date: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="end_date">Дуусах огноо</Label>
                                                <Input
                                                    id="end_date"
                                                    type="date"
                                                    value={contractFormData.end_date}
                                                    onChange={(e) => setContractFormData({ ...contractFormData, end_date: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="budget">Төсөв (MNT) *</Label>
                                            <Input
                                                id="budget"
                                                type="number"
                                                min="0"
                                                placeholder="Жишээ нь: 1000000"
                                                value={contractFormData.budget}
                                                onChange={(e) => setContractFormData({ ...contractFormData, budget: Number(e.target.value) })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="kpi_target">KPI Зорилт</Label>
                                            <Input
                                                id="kpi_target"
                                                placeholder="Жишээ нь: Сард 100 lead, CPA < 5000 MNT"
                                                value={contractFormData.kpi_target}
                                                onChange={(e) => setContractFormData({ ...contractFormData, kpi_target: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="terms">Нэмэлт нөхцөл/Тайлбар</Label>
                                            <Input
                                                id="terms"
                                                placeholder="Онцгой нөхцөлүүд..."
                                                value={contractFormData.terms}
                                                onChange={(e) => setContractFormData({ ...contractFormData, terms: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <Button type="button" variant="outline" className="mr-2" onClick={() => setIsAddContractOpen(false)}>
                                                Цуцлах
                                            </Button>
                                            <Button type="submit" disabled={isSubmittingContract}>
                                                {isSubmittingContract ? 'Хадгалж байна...' : 'Хадгалах'}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </DialogTitle>
                        <DialogDescription>
                            Энэхүү сувагтай холбоотой байгуулсан гэрээ, нөхцөлүүдийн түүх.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 pt-4">
                        {isLoadingContracts ? (
                            <p className="text-sm text-gray-500 text-center py-4">Уншиж байна...</p>
                        ) : contractsData.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-xs text-gray-500">
                                            <th className="text-left font-medium py-2">Хугацаа</th>
                                            <th className="text-center font-medium py-2">Төсөв</th>
                                            <th className="text-center font-medium py-2">Төлөв</th>
                                            <th className="text-left font-medium py-2">KPI Зорилт</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {contractsData.map((contract) => (
                                            <tr key={contract.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                <td className="py-2 text-gray-900">
                                                    {new Date(contract.start_date).toLocaleDateString()} -
                                                    {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'Тодорхойгүй'}
                                                </td>
                                                <td className="py-2 text-center text-emerald-600 font-medium font-mono">
                                                    {contract.budget.toLocaleString()} {contract.currency}
                                                </td>
                                                <td className="py-2 text-center">
                                                    <span className={`px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium`}>
                                                        {contract.status}
                                                    </span>
                                                </td>
                                                <td className="py-2 text-gray-600 truncate max-w-xs" title={contract.kpi_target}>
                                                    {contract.kpi_target || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Target className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">Бүртгэлтэй гэрээ олдсонгүй</p>
                                <p className="text-sm text-gray-400 mt-1">Шинэ гэрээ нэмэх товчийг дарж гэрээний мэдээлэл оруулна уу.</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
