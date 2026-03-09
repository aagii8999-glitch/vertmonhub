import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        isPositive: boolean;
    };
    icon: LucideIcon;
    iconColor?: string;
    gradient?: string;
}

const GRADIENT_MAP: Record<string, { bg: string; icon: string; glow: string }> = {
    'bg-gold': {
        bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
        icon: 'bg-gradient-to-br from-amber-400 to-orange-500',
        glow: 'shadow-amber-200/50',
    },
    'bg-blue': {
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        icon: 'bg-gradient-to-br from-blue-400 to-indigo-500',
        glow: 'shadow-blue-200/50',
    },
    'bg-emerald': {
        bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
        icon: 'bg-gradient-to-br from-emerald-400 to-teal-500',
        glow: 'shadow-emerald-200/50',
    },
    'bg-violet': {
        bg: 'bg-gradient-to-br from-violet-50 to-purple-50',
        icon: 'bg-gradient-to-br from-violet-400 to-purple-500',
        glow: 'shadow-violet-200/50',
    },
    'bg-rose': {
        bg: 'bg-gradient-to-br from-rose-50 to-pink-50',
        icon: 'bg-gradient-to-br from-rose-400 to-pink-500',
        glow: 'shadow-rose-200/50',
    },
};

export function StatsCard({ title, value, change, icon: Icon, iconColor = 'bg-gold' }: StatsCardProps) {
    const style = GRADIENT_MAP[iconColor] || GRADIENT_MAP['bg-gold'];

    return (
        <div className={`${style.bg} rounded-2xl border border-white/80 p-4 md:p-5 hover:shadow-lg ${style.glow} transition-all duration-300 active:scale-[0.98] group`}>
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
                    {change && (
                        <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${change.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                            {change.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(change.value)}%
                            <span className="text-gray-400 font-normal hidden sm:inline ml-0.5">7 хоног</span>
                        </div>
                    )}
                </div>
                <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl ${style.icon} flex items-center justify-center text-white flex-shrink-0 ml-3 shadow-lg group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
            </div>
        </div>
    );
}
