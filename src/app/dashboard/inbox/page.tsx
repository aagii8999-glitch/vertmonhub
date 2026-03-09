'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useConversations } from '@/hooks/useConversations';
import { MessageSquare, Loader2, RefreshCcw, Search, User } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils/date';

export default function InboxPage() {
    const { data: conversations = [], isLoading, refetch } = useConversations();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const filtered = conversations.filter((c: any) =>
        (c.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selected = conversations.find((c: any) => c.id === selectedId);

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-140px)] items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Мессеж</h1>
                    <p className="text-gray-500 mt-1">Нийт {conversations.length} харилцан ярилцлага</p>
                </div>
                <Button onClick={() => refetch()} variant="outline" size="sm">
                    <RefreshCcw className="w-4 h-4 mr-2" /> Шинэчлэх
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Нэрээр хайх..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
            </div>

            {filtered.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500">Мессеж байхгүй</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    {filtered.map((conv: any) => (
                        <Card key={conv.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedId(conv.id)}>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{conv.customer_name || 'Харилцагч'}</p>
                                    <p className="text-sm text-gray-500 truncate">{conv.last_message || 'Мессеж байхгүй'}</p>
                                </div>
                                <div className="text-xs text-gray-400 flex-shrink-0">
                                    {conv.updated_at ? formatTimeAgo(conv.updated_at) : ''}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
