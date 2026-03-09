'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Megaphone,
    BarChart3,
    Calendar,
    Globe,
    Share2,
    Mail,
    Target,
    Award,
    Settings,
    HelpCircle,
    LogOut,
    ChevronDown,
    ChevronUp,
    UserCircle,
    Building2,
    ArrowLeftRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MenuItem {
    name: string;
    href: string;
    icon: React.ComponentType<React.SVGAttributes<SVGSVGElement>>;
    badge?: string;
    children?: { name: string; href: string }[];
}

const menuItems: MenuItem[] = [
    { name: 'Хянах самбар', href: '/marketing', icon: LayoutDashboard },
    { name: 'Кампейнүүд', href: '/marketing/campaigns', icon: Megaphone },
    { name: 'Зар сурталчилгаа', href: '/marketing/ads', icon: BarChart3 },
    { name: 'Контент календарь', href: '/marketing/calendar', icon: Calendar },
    { name: 'Вэб аналитик', href: '/marketing/analytics', icon: Globe },
    { name: 'Социал медиа', href: '/marketing/social', icon: Share2 },
    { name: 'Email & SMS', href: '/marketing/messaging', icon: Mail },
    { name: 'Lead эх үүсвэр', href: '/marketing/sources', icon: Target },
    { name: 'Брэнд мэдрэмж', href: '/marketing/brand', icon: Award },
];

const bottomMenuItems = [
    { name: 'Тусламж', href: '/help', icon: HelpCircle },
    { name: 'Тохиргоо', href: '/dashboard/settings', icon: Settings },
];

function MarketingSidebar() {
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const pathname = usePathname();
    const { shop, signOut } = useAuth();

    const toggleMenu = (name: string) => {
        setExpandedMenus(prev =>
            prev.includes(name)
                ? prev.filter(m => m !== name)
                : [...prev, name]
        );
    };

    const isActive = (href: string) => pathname === href;
    const isParentActive = (item: MenuItem) => {
        if (isActive(item.href)) return true;
        return item.children?.some(child => isActive(child.href)) ?? false;
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50 hidden md:flex">
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center">
                        <Megaphone className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg text-gray-900">
                        Маркетинг
                    </span>
                </div>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Section Switcher */}
            <div className="px-3 py-3 border-b border-gray-100">
                <Link href="/dashboard">
                    <button className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                        <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-medium text-gray-700">Борлуулалт руу шилжих</span>
                        </div>
                        <ArrowLeftRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const active = isParentActive(item);
                        const isExpanded = expandedMenus.includes(item.name);
                        const hasChildren = item.children && item.children.length > 0;

                        return (
                            <li key={item.name}>
                                {hasChildren ? (
                                    <>
                                        <button
                                            onClick={() => toggleMenu(item.name)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${active
                                                ? 'bg-purple-50 text-purple-700'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className={`w-5 h-5 ${active ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                                <span className="font-medium text-sm">{item.name}</span>
                                                {item.badge && (
                                                    <span className="px-1.5 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp className="w-4 h-4 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                            )}
                                        </button>
                                        {isExpanded && (
                                            <ul className="mt-1 ml-4 pl-4 border-l border-gray-200 space-y-1">
                                                {item.children?.map((child) => (
                                                    <li key={child.name}>
                                                        <Link
                                                            href={child.href}
                                                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive(child.href)
                                                                ? 'text-purple-700 bg-purple-50 font-medium'
                                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {child.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${active
                                            ? 'bg-purple-50 text-purple-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 ${active ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                        <span className="font-medium text-sm">{item.name}</span>
                                        {item.badge && (
                                            <span className="px-1.5 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom Menu */}
            <div className="px-3 py-3 border-t border-gray-100">
                <ul className="space-y-1">
                    {bottomMenuItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive(item.href)
                                    ? 'text-purple-700 bg-purple-50'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() => signOut()}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm">Гарах</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* User Profile */}
            <div className="px-3 pb-4 border-t border-gray-100 pt-3">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <UserCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">{shop?.name || 'Маркетинг'}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
            </div>
        </aside>
    );
}

// Mobile Navigation for Marketing
function MarketingMobileNav() {
    const pathname = usePathname();

    const mobileItems = [
        { name: 'Самбар', href: '/marketing', icon: LayoutDashboard },
        { name: 'Кампейн', href: '/marketing/campaigns', icon: Megaphone },
        { name: 'Социал', href: '/marketing/social', icon: Share2 },
        { name: 'Борлуулт', href: '/dashboard', icon: Building2 },
    ];

    const isActive = (href: string) => pathname === href || (href !== '/marketing' && pathname.startsWith(href));

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
            <div className="flex items-center justify-around py-2">
                {mobileItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-3 py-2 ${active ? 'text-purple-600' : 'text-gray-500'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-xs">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

// Marketing Header
function MarketingHeader() {
    return (
        <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-4">
                <div className="md:hidden flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                        <Megaphone className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Маркетинг</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-gray-500" />
                </button>
            </div>
        </header>
    );
}

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <MarketingSidebar />
            <div className="md:ml-64 transition-all duration-300 min-h-screen flex flex-col">
                <MarketingHeader />
                <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
                    {children}
                </main>
            </div>
            <MarketingMobileNav />
        </div>
    );
}
