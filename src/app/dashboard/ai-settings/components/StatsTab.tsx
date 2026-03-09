'use client';

import { Card, CardContent } from '@/components/ui/Card';
import type { AIStats } from './types';

interface StatsTabProps { stats: AIStats | null; }

export default function StatsTab({ stats }: StatsTabProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-violet-600">{stats?.total_conversations || 0}</p><p className="text-sm text-gray-500">Нийт яриа</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-violet-600">{stats?.recent_conversations || 0}</p><p className="text-sm text-gray-500">Сүүлийн 7 хоног</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-violet-600">{stats?.total_messages || 0}</p><p className="text-sm text-gray-500">Нийт мессеж</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-emerald-600">{stats?.conversion_rate?.toFixed(1) || 0}%</p><p className="text-sm text-gray-500">Захиалга болсон</p></CardContent></Card>
            </div>

            <Card>
                <CardContent className="p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">Түгээмэл асуултууд</h2>
                    {stats?.top_questions?.length ? (
                        <div className="space-y-3">
                            {stats.top_questions.map((q, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm text-gray-900">{q.sample_question}</p>
                                        <span className="text-xs text-gray-500">{q.category}</span>
                                    </div>
                                    <span className="px-2 py-1 bg-violet-100 text-violet-700 text-sm font-medium rounded">{q.count}x</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">Статистик цуглаагүй байна.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
