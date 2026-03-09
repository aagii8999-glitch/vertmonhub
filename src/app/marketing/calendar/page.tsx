'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Calendar,
    Plus,
    ChevronLeft,
    ChevronRight,
    Image,
    Video,
    FileText,
    Mail,
    Instagram,
    Facebook,
    Clock,
    Edit,
    Trash2,
    MoreVertical,
} from 'lucide-react';

// Mock content calendar data
const MOCK_CONTENT = [
    {
        id: '1',
        title: 'Mandala Garden - 3D Tour',
        type: 'video',
        platform: ['instagram', 'facebook'],
        date: '2026-02-03',
        time: '10:00',
        status: 'scheduled',
        author: 'Оюунаа',
    },
    {
        id: '2',
        title: 'Хаврын урамшууллын зар',
        type: 'image',
        platform: ['instagram', 'facebook'],
        date: '2026-02-03',
        time: '14:00',
        status: 'scheduled',
        author: 'Батбаяр',
    },
    {
        id: '3',
        title: 'Weekly Newsletter',
        type: 'email',
        platform: ['email'],
        date: '2026-02-04',
        time: '09:00',
        status: 'draft',
        author: 'Оюунаа',
    },
    {
        id: '4',
        title: 'Elysium - Interior Showcase',
        type: 'carousel',
        platform: ['instagram'],
        date: '2026-02-05',
        time: '11:00',
        status: 'scheduled',
        author: 'Батбаяр',
    },
    {
        id: '5',
        title: 'Mandala Tower - Үнийн мэдээлэл',
        type: 'image',
        platform: ['facebook'],
        date: '2026-02-06',
        time: '12:00',
        status: 'scheduled',
        author: 'Оюунаа',
    },
    {
        id: '6',
        title: 'Instagram Story - Behind the scenes',
        type: 'story',
        platform: ['instagram'],
        date: '2026-02-07',
        time: '15:00',
        status: 'draft',
        author: 'Батбаяр',
    },
    {
        id: '7',
        title: 'Customer Testimonial',
        type: 'video',
        platform: ['facebook', 'instagram'],
        date: '2026-02-08',
        time: '10:00',
        status: 'scheduled',
        author: 'Оюунаа',
    },
];

const DAYS = ['Ням', 'Дав', 'Мяг', 'Лха', 'Пүр', 'Баа', 'Бям'];
const MONTHS = ['1-р сар', '2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар', '7-р сар', '8-р сар', '9-р сар', '10-р сар', '11-р сар', '12-р сар'];

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // February 2026
    const [view, setView] = useState<'month' | 'week'>('month');

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video': return <Video className="w-3 h-3" />;
            case 'image': return <Image className="w-3 h-3" />;
            case 'carousel': return <Image className="w-3 h-3" />;
            case 'story': return <Instagram className="w-3 h-3" />;
            case 'email': return <Mail className="w-3 h-3" />;
            default: return <FileText className="w-3 h-3" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'video': return 'bg-red-100 text-red-700 border-red-200';
            case 'image': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'carousel': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'story': return 'bg-pink-100 text-pink-700 border-pink-200';
            case 'email': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'bg-emerald-500';
            case 'draft': return 'bg-amber-500';
            case 'published': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    // Generate calendar days
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // Add empty slots for days before the first day
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const calendarDays = getDaysInMonth(currentDate);

    const getContentForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return MOCK_CONTENT.filter(c => c.date === dateStr);
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-7 h-7 text-purple-600" />
                        Контент календарь
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Нийтлэл, постуудын төлөвлөгөө
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setView('month')}
                            className={`px-3 py-2 text-sm ${view === 'month' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
                        >
                            Сар
                        </button>
                        <button
                            onClick={() => setView('week')}
                            className={`px-3 py-2 text-sm ${view === 'week' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
                        >
                            Долоо хоног
                        </button>
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Контент нэмэх
                    </Button>
                </div>
            </div>

            {/* Calendar Navigation */}
            <Card className="bg-white border-gray-200">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {DAYS.map((day) => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((date, idx) => {
                            if (!date) {
                                return <div key={idx} className="min-h-24 bg-gray-50 rounded-lg" />;
                            }

                            const content = getContentForDate(date);
                            const isToday = date.toDateString() === new Date().toDateString();

                            return (
                                <div
                                    key={idx}
                                    className={`min-h-24 p-2 border rounded-lg ${isToday ? 'border-purple-300 bg-purple-50' : 'border-gray-100 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-purple-600' : 'text-gray-700'}`}>
                                        {date.getDate()}
                                    </div>
                                    <div className="space-y-1">
                                        {content.slice(0, 3).map((item) => (
                                            <div
                                                key={item.id}
                                                className={`px-1.5 py-0.5 rounded text-xs flex items-center gap-1 border ${getTypeColor(item.type)} cursor-pointer hover:opacity-80`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(item.status)}`} />
                                                {getTypeIcon(item.type)}
                                                <span className="truncate">{item.title.slice(0, 12)}...</span>
                                            </div>
                                        ))}
                                        {content.length > 3 && (
                                            <div className="text-xs text-gray-500 pl-1">
                                                +{content.length - 3} илүү
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Upcoming Content List */}
            <Card className="bg-white border-gray-200">
                <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Ойрын 7 хоногийн контент</h3>
                    <div className="space-y-3">
                        {MOCK_CONTENT.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(item.type)}`}>
                                        {getTypeIcon(item.type)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            {item.date} {item.time}
                                            <span className="text-gray-300">|</span>
                                            {item.platform.map((p) => (
                                                <span key={p} className="capitalize">{p}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'scheduled' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {item.status === 'scheduled' ? 'Төлөвлөсөн' : 'Ноорог'}
                                    </span>
                                    <span className="text-xs text-gray-500">{item.author}</span>
                                    <button className="p-1 hover:bg-gray-200 rounded">
                                        <Edit className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Legend */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>Төлөвлөсөн</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span>Ноорог</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>Нийтлэгдсэн</span>
                </div>
            </div>
        </div>
    );
}
