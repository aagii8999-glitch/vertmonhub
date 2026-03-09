'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActionCenter } from '@/components/dashboard/ActionCenter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PullToRefresh } from '@/components/ui/PullToRefresh';
import { DashboardSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/hooks/useDashboard';
import { formatTimeAgo } from '@/lib/utils/date';
import {
    Building2,
    Users,
    TrendingUp,
    FileText,
    Clock,
    ArrowRight,
    RefreshCw,
    Calendar,
    ChevronDown,
    Eye,
    MapPin,
} from 'lucide-react';

export default function DashboardPage() {
    const { user, shop, loading: authLoading } = useAuth();
    const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');

    const { data, isLoading, refetch, isRefetching } = useDashboard(timeFilter);

    const stats = data?.stats || { totalProperties: 0, totalLeads: 0, monthlyViewings: 0, pendingContracts: 0 };
    const recentLeads = data?.recentLeads || [];
    const upcomingViewings = data?.upcomingViewings || [];

    if (isLoading || authLoading) {
        return <DashboardSkeleton />;
    }

    const handleRefresh = async () => {
        await refetch();
    };

    return (
        <PullToRefresh onRefresh={handleRefresh}>
            <div className="space-y-4 md:space-y-6">
                {/* Compact Action Toolbar */}
                <div className="flex items-center justify-end gap-2 mb-2">
                    {/* Time Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => document.getElementById('time-filter-dropdown')?.classList.toggle('hidden')}
                            onBlur={() => setTimeout(() => document.getElementById('time-filter-dropdown')?.classList.add('hidden'), 200)}
                            className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {timeFilter === 'today' ? 'Өнөөдөр' : timeFilter === 'week' ? '7 хоног' : 'Сар'}
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                        </button>
                        <div id="time-filter-dropdown" className="hidden absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-10 overflow-hidden">
                            {[
                                { value: 'today', label: 'Өнөөдөр' },
                                { value: 'week', label: '7 хоног' },
                                { value: 'month', label: 'Сар' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setTimeFilter(option.value as 'today' | 'week' | 'month')}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${timeFilter === option.value ? 'text-primary font-medium bg-primary/5' : 'text-gray-700'}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Refresh Button */}
                    <Button
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 bg-white border border-gray-200"
                        title="Шинэчлэх"
                    >
                        <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefetching ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <StatsCard
                        title="Нийт байр"
                        value={stats.totalProperties.toString()}
                        icon={Building2}
                        iconColor="bg-gold"
                    />
                    <StatsCard
                        title="Нийт лийд"
                        value={stats.totalLeads.toString()}
                        icon={Users}
                        iconColor="bg-emerald"
                    />
                    <StatsCard
                        title="Үзлэг (сар)"
                        value={stats.monthlyViewings.toString()}
                        icon={Eye}
                        iconColor="bg-blue"
                    />
                    <StatsCard
                        title="Хүлээгдэж буй гэрээ"
                        value={stats.pendingContracts.toString()}
                        icon={FileText}
                        iconColor="bg-violet"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Leads */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between py-3 md:py-4">
                                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                                    <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                    Сүүлийн лийдүүд
                                </CardTitle>
                                <Link href="/dashboard/leads">
                                    <Button variant="ghost" size="sm" className="h-8 text-xs md:text-sm">
                                        Бүгдийг <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border">
                                    {recentLeads.length > 0 ? recentLeads.slice(0, 5).map((lead: any) => (
                                        <Link
                                            key={lead.id}
                                            href="/dashboard/leads"
                                            className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between hover:bg-secondary/20 transition-colors block"
                                        >
                                            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                                    <Users className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-sm md:text-base text-gray-900 truncate">{lead.name || 'Лийд'}</p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {lead.phone || lead.email || 'Холбоо барих'} • {formatTimeAgo(lead.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 pl-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                                                            lead.status === 'qualified' ? 'bg-emerald-100 text-emerald-700' :
                                                                'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {lead.status === 'new' ? 'Шинэ' :
                                                        lead.status === 'contacted' ? 'Холбогдсон' :
                                                            lead.status === 'qualified' ? 'Баталгаажсан' :
                                                                lead.status || 'Шинэ'}
                                                </span>
                                            </div>
                                        </Link>
                                    )) : (
                                        <div className="px-6 py-12 text-center text-muted-foreground">
                                            <Users className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 text-muted-foreground/50" />
                                            <p>Лийд байхгүй</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Action Center / Upcoming Viewings */}
                    <div className="space-y-6">
                        {/* Upcoming Viewings */}
                        <Card>
                            <CardHeader className="py-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Eye className="w-4 h-4 text-blue-600" />
                                    Ойролцоох үзлэгүүд
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border">
                                    {upcomingViewings.length > 0 ? upcomingViewings.slice(0, 3).map((v: any) => (
                                        <div key={v.id} className="px-4 py-3 hover:bg-secondary/20 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-900">{v.scheduled_at ? new Date(v.scheduled_at).toLocaleDateString('mn-MN') : 'TBD'}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {v.properties?.title || v.notes || 'Үзлэг'}
                                            </p>
                                        </div>
                                    )) : (
                                        <div className="px-4 py-8 text-center text-gray-400 text-sm">
                                            Товлосон үзлэг байхгүй
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PullToRefresh>
    );
}
