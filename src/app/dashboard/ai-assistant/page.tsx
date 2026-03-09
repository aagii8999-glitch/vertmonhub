'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Bot, User, Sparkles, Loader2, BarChart2 } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    chartConfig?: any;
    data?: any;
}

export default function AIDataAssistantPage() {
    const { shop } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init',
            role: 'assistant',
            content: 'Сайн байна уу! 👋 Би таны AI Дата Туслах (Gemini). Vertmon-ий бүх мэдээллээс асуулт асууж болно — байр, лийд, харилцагч, захиалга, статистик бүгдийг мэднэ!'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

        const newMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: userMessage
        };

        setMessages(prev => [...prev, newMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai-assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    shopId: shop?.id,
                    history: messages.slice(1).map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            });

            if (!response.ok) throw new Error('Failed to fetch');

            const data = await response.json();

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                chartConfig: data.chartConfig,
                data: data.data
            }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Уучлаарай, алдаа гарлаа. Та дахин оролдоно уу.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderChart = (config: any) => {
        if (!config || !config.data || config.data.length === 0) return null;

        return (
            <div className="h-64 w-full mt-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <ResponsiveContainer width="100%" height="100%">
                    {config.type === 'line' ? (
                        <LineChart data={config.data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    ) : (
                        <BarChart data={config.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                            <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        );
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col max-w-5xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-emerald-500" />
                        AI Дата Туслах
                    </h1>
                    <p className="text-gray-500 mt-1">Vertmon-ий бүх мэдээллээс асуулт асууж, график тайлан авна уу. (Gemini AI)</p>
                </div>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden border-gray-200 shadow-sm bg-white/50 backdrop-blur-xl">
                {/* Chat Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Bot className="w-5 h-5 text-emerald-600" />
                                </div>
                            )}

                            <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
                                <div
                                    className={`px-4 py-3 rounded-2xl ${message.role === 'user'
                                        ? 'bg-emerald-600 text-white rounded-tr-sm'
                                        : 'bg-white border border-gray-100 shadow-sm rounded-tl-sm text-gray-800'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{message.content}</p>
                                </div>

                                {message.chartConfig && renderChart(message.chartConfig)}
                            </div>

                            {message.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1 order-2">
                                    <User className="w-5 h-5 text-gray-500" />
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4 justify-start">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                                <span className="text-sm text-gray-500">Өгөгдөл боловсруулж байна...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </CardContent>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSubmit} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Өнөөдөр хэдэн захиалга орж ирсэн бэ?..."
                            className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-1.5 h-10 w-10 p-0 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                        {['Боломжтой байрууд юу юу байна?', 'Шинэ лийдүүд хэн бэ?', 'Энэ сарын нийт орлого?', 'VIP лийдүүдийн мэдээлэл', 'Mandala Garden байрууд'].map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => setInput(suggestion)}
                                className="whitespace-nowrap px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200 transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}
