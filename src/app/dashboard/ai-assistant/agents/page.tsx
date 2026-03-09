'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Bot, Settings, Trash2, Edit2, Shield, MessageSquareText } from 'lucide-react';
import Link from 'next/link';

// Detailed type definition
interface AIAgent {
    id: string;
    name: string;
    role: string;
    description: string;
    systemPrompt: string;
    isActive: boolean;
}

const MOCK_AGENTS: AIAgent[] = [
    {
        id: '1',
        name: 'Борлуулалтын зөвлөх',
        role: 'sales',
        description: 'Бүтээгдэхүүн санал болгох, гүйлгээ хийхэд туслах',
        systemPrompt: 'Та бол борлуулалтын мэргэжилтэн. Хэрэглэгчид бүтээгдэхүүн санал болгож, худалдан авалт хийхэд нь тусална.',
        isActive: true
    },
    {
        id: '2',
        name: 'Гомдол барагдуулагч',
        role: 'support',
        description: 'Хэрэглэгчийн гомдлыг хүлээн авч шийдвэрлэх',
        systemPrompt: 'Та бол хэрэглэгчийн үйлчилгээний мэргэжилтэн. Гомдол гаргасан хэрэглэгчтэй эелдэг харьцаж, асуудлыг шийдвэрлэнэ.',
        isActive: true
    },
    {
        id: '3',
        name: 'Маркетингийн аналист',
        role: 'marketing',
        description: 'Датанд анализ хийж дүгнэлт гаргах',
        systemPrompt: 'Та бол маркетингийн дата аналист. Тоон баримтад үндэслэн стратеги гаргана.',
        isActive: false
    }
];

export default function AIAgentsPage() {
    const [agents, setAgents] = useState<AIAgent[]>(MOCK_AGENTS);

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Bot className="w-6 h-6 text-emerald-500" />
                        AI Дүрүүд (Role-Based Agents)
                    </h1>
                    <p className="text-gray-500 mt-1">Олон өөр зорилгоор ажиллах тусгай AI агентууд үүсгэх, сургах</p>
                </div>
                <Button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4" /> Шинэ агент үүсгэх
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map(agent => (
                    <Card key={agent.id} className="group hover:border-emerald-200 transition-colors">
                        <CardHeader className="pb-3 flex flex-row items-start justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    {agent.role === 'support' ? <Shield className="w-4 h-4 text-amber-500" /> :
                                        agent.role === 'sales' ? <MessageSquareText className="w-4 h-4 text-emerald-500" /> :
                                            <Bot className="w-4 h-4 text-blue-500" />}
                                    {agent.name}
                                </CardTitle>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{agent.description}</p>
                            </div>
                            <div className={`w-2.5 h-2.5 rounded-full ${agent.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 font-mono mb-4 line-clamp-3">
                                {agent.systemPrompt}
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="outline" size="sm" className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700">
                                    <Edit2 className="w-3 h-3 mr-2" /> Засах
                                </Button>
                                <Button variant="outline" size="sm" className="w-10 px-0 border-gray-200 hover:text-red-600 hover:bg-red-50 text-gray-500">
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
