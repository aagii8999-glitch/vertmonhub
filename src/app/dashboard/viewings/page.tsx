'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, MapPin, Phone, User, Plus, X, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Viewing {
    id: string;
    scheduled_at: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
    lead_id: string;
    property_id: string;
    customer_feedback: string | null;
    agent_notes: string | null;
    lead?: { customer_name: string; customer_phone: string };
    property?: { name: string; district: string };
}

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
    scheduled: { label: 'Товлосон', color: 'bg-blue-100 text-blue-700' },
    completed: { label: 'Дуусгасан', color: 'bg-emerald-100 text-emerald-700' },
    cancelled: { label: 'Цуцалсан', color: 'bg-red-100 text-red-700' },
    no_show: { label: 'Ирээгүй', color: 'bg-gray-100 text-gray-600' },
};

export default function ViewingsPage() {
    const { shop } = useAuth();
    const [viewings, setViewings] = useState<Viewing[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        if (!shop?.id) return;
        fetchViewings();
    }, [shop?.id]);

    async function fetchViewings() {
        const { data } = await supabase
            .from('property_viewings')
            .select('*, leads(customer_name, customer_phone), properties(name, district)')
            .eq('shop_id', shop!.id)
            .order('scheduled_at', { ascending: true });

        setViewings((data || []).map((v: any) => ({
            ...v,
            lead: v.leads,
            property: v.properties,
        })));
        setLoading(false);
    }

    async function updateStatus(id: string, status: string) {
        const { error } = await supabase
            .from('property_viewings')
            .update({ status })
            .eq('id', id);
        if (error) { toast.error('Алдаа'); return; }
        setViewings(prev => prev.map(v => v.id === id ? { ...v, status: status as any } : v));
        toast.success('Статус шинэчилсэн');
    }

    const filtered = filter === 'all' ? viewings : viewings.filter(v => v.status === filter);
    const upcoming = viewings.filter(v => v.status === 'scheduled' && new Date(v.scheduled_at) > new Date());

    const today = new Date().toDateString();
    const todayViewings = viewings.filter(v => new Date(v.scheduled_at).toDateString() === today);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Үзлэгүүд</h1>
                        <p className="text-xs text-gray-500">Өнөөдөр {todayViewings.length} үзлэг, нийт {upcoming.length} хүлээж байна</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 p-4">
                {Object.entries(STATUS_BADGES).map(([key, badge]) => {
                    const count = viewings.filter(v => v.status === key).length;
                    return (
                        <button
                            key={key}
                            onClick={() => setFilter(filter === key ? 'all' : key)}
                            className={`p-3 rounded-xl border transition-all text-center ${filter === key ? 'border-violet-400 bg-violet-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                        >
                            <p className="text-2xl font-bold text-gray-900">{count}</p>
                            <p className={`text-xs font-medium ${badge.color.split(' ')[1]}`}>{badge.label}</p>
                        </button>
                    );
                })}
            </div>

            {/* Viewings List */}
            <div className="px-4 pb-4 space-y-2">
                {loading ? (
                    <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">Үзлэг олдсонгүй</div>
                ) : (
                    filtered.map(v => {
                        const isPast = new Date(v.scheduled_at) < new Date();
                        const isToday = new Date(v.scheduled_at).toDateString() === today;
                        const badge = STATUS_BADGES[v.status] || STATUS_BADGES.scheduled;

                        return (
                            <div key={v.id} className={`bg-white rounded-xl border p-4 transition-all ${isToday ? 'border-violet-300 ring-2 ring-violet-100' : 'border-gray-200'}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className={`text-sm font-semibold ${isToday ? 'text-violet-700' : 'text-gray-900'}`}>
                                                {new Date(v.scheduled_at).toLocaleDateString('mn-MN')}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(v.scheduled_at).toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {isToday && <span className="px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded text-[10px] font-bold">ӨНӨӨДӨР</span>}
                                        </div>
                                        <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                                            <User className="w-3.5 h-3.5 text-gray-400" />
                                            {v.lead?.customer_name || 'Тодорхойгүй'}
                                        </p>
                                        {v.lead?.customer_phone && (
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Phone className="w-3 h-3" /> {v.lead.customer_phone}
                                            </p>
                                        )}
                                        {v.property && (
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                <MapPin className="w-3 h-3" /> {v.property.name} • {v.property.district}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                                            {badge.label}
                                        </span>
                                        {v.status === 'scheduled' && (
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => updateStatus(v.id, 'completed')}
                                                    className="p-1 hover:bg-emerald-50 rounded text-emerald-600"
                                                    title="Дуусгасан"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(v.id, 'no_show')}
                                                    className="p-1 hover:bg-gray-100 rounded text-gray-400"
                                                    title="Ирээгүй"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
