'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Share2,
    TrendingUp,
    TrendingDown,
    Heart,
    MessageCircle,
    Users,
    Eye,
    Play,
    Image,
    Send,
    ArrowUpRight,
    RefreshCw,
    Facebook,
    Instagram,
} from 'lucide-react';

// Mock social media data
const MOCK_STATS = {
    facebook: {
        followers: 12500,
        followersChange: '+320',
        reach: 85000,
        reachChange: '+18%',
        engagement: 4.2,
        engagementChange: '+0.5%',
        posts: 24,
    },
    instagram: {
        followers: 8900,
        followersChange: '+450',
        reach: 62000,
        reachChange: '+25%',
        engagement: 6.8,
        engagementChange: '+0.8%',
        posts: 32,
    },
};

const MOCK_POSTS = [
    {
        id: '1',
        platform: 'instagram',
        type: 'video',
        caption: 'Mandala Garden 3D Tour 🏠✨',
        date: '2026-02-01',
        likes: 892,
        comments: 45,
        shares: 23,
        reach: 12500,
        engagement: 7.8,
    },
    {
        id: '2',
        platform: 'facebook',
        type: 'carousel',
        caption: 'Elysium Residence - Шинэ загвар 🌟',
        date: '2026-01-30',
        likes: 654,
        comments: 28,
        shares: 45,
        reach: 18200,
        engagement: 5.2,
    },
    {
        id: '3',
        platform: 'instagram',
        type: 'image',
        caption: 'Хаврын урамшуулал эхэллээ! 🎉',
        date: '2026-01-28',
        likes: 1234,
        comments: 67,
        shares: 89,
        reach: 22000,
        engagement: 8.5,
    },
    {
        id: '4',
        platform: 'facebook',
        type: 'video',
        caption: 'Customer testimonial - Батбаяр гэр бүл',
        date: '2026-01-25',
        likes: 445,
        comments: 32,
        shares: 28,
        reach: 15600,
        engagement: 4.8,
    },
    {
        id: '5',
        platform: 'instagram',
        type: 'reel',
        caption: 'Behind the scenes - Mandala Tower construction 🏗️',
        date: '2026-01-22',
        likes: 2100,
        comments: 89,
        shares: 156,
        reach: 45000,
        engagement: 12.3,
    },
];

const MOCK_AUDIENCE = {
    gender: [
        { label: 'Эмэгтэй', percentage: 55 },
        { label: 'Эрэгтэй', percentage: 45 },
    ],
    age: [
        { label: '18-24', percentage: 12 },
        { label: '25-34', percentage: 38 },
        { label: '35-44', percentage: 32 },
        { label: '45-54', percentage: 13 },
        { label: '55+', percentage: 5 },
    ],
};

export default function SocialPage() {
    const [platform, setPlatform] = useState<'all' | 'facebook' | 'instagram'>('all');

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const getPostTypeIcon = (type: string) => {
        switch (type) {
            case 'video': return <Play className="w-3 h-3" />;
            case 'reel': return <Play className="w-3 h-3" />;
            case 'carousel': return <Image className="w-3 h-3" />;
            default: return <Image className="w-3 h-3" />;
        }
    };

    const filteredPosts = platform === 'all'
        ? MOCK_POSTS
        : MOCK_POSTS.filter(p => p.platform === platform);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Share2 className="w-7 h-7 text-purple-600" />
                        Социал медиа
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Facebook & Instagram гүйцэтгэл
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setPlatform('all')}
                            className={`px-3 py-2 text-sm ${platform === 'all' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
                        >
                            Бүгд
                        </button>
                        <button
                            onClick={() => setPlatform('facebook')}
                            className={`px-3 py-2 text-sm ${platform === 'facebook' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                        >
                            Facebook
                        </button>
                        <button
                            onClick={() => setPlatform('instagram')}
                            className={`px-3 py-2 text-sm ${platform === 'instagram' ? 'bg-pink-100 text-pink-700' : 'text-gray-600'}`}
                        >
                            Instagram
                        </button>
                    </div>
                    <Button variant="secondary" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Шинэчлэх
                    </Button>
                </div>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Facebook */}
                <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                <Facebook className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Facebook</h3>
                                <p className="text-xs text-gray-500">@VertmonRealEstate</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <p className="text-xl font-bold text-gray-900">{formatNumber(MOCK_STATS.facebook.followers)}</p>
                                <p className="text-xs text-gray-500">Дагагч</p>
                                <p className="text-xs text-emerald-600">{MOCK_STATS.facebook.followersChange}</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900">{formatNumber(MOCK_STATS.facebook.reach)}</p>
                                <p className="text-xs text-gray-500">Хүрэлт</p>
                                <p className="text-xs text-emerald-600">{MOCK_STATS.facebook.reachChange}</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900">{MOCK_STATS.facebook.engagement}%</p>
                                <p className="text-xs text-gray-500">Engagement</p>
                                <p className="text-xs text-emerald-600">{MOCK_STATS.facebook.engagementChange}</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900">{MOCK_STATS.facebook.posts}</p>
                                <p className="text-xs text-gray-500">Пост</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Instagram */}
                <Card className="bg-gradient-to-br from-pink-50 to-white border-pink-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <Instagram className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Instagram</h3>
                                <p className="text-xs text-gray-500">@vertmon_realestate</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <p className="text-xl font-bold text-gray-900">{formatNumber(MOCK_STATS.instagram.followers)}</p>
                                <p className="text-xs text-gray-500">Дагагч</p>
                                <p className="text-xs text-emerald-600">{MOCK_STATS.instagram.followersChange}</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900">{formatNumber(MOCK_STATS.instagram.reach)}</p>
                                <p className="text-xs text-gray-500">Хүрэлт</p>
                                <p className="text-xs text-emerald-600">{MOCK_STATS.instagram.reachChange}</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900">{MOCK_STATS.instagram.engagement}%</p>
                                <p className="text-xs text-gray-500">Engagement</p>
                                <p className="text-xs text-emerald-600">{MOCK_STATS.instagram.engagementChange}</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900">{MOCK_STATS.instagram.posts}</p>
                                <p className="text-xs text-gray-500">Пост</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Posts */}
            <Card className="bg-white border-gray-200">
                <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Сүүлийн постууд</h3>
                    <div className="space-y-3">
                        {filteredPosts.map((post) => (
                            <div
                                key={post.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${post.platform === 'instagram' ? 'bg-pink-100' : 'bg-blue-100'
                                        }`}>
                                        {getPostTypeIcon(post.type)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{post.caption}</p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                            <span className={`px-2 py-0.5 rounded-full ${post.platform === 'instagram' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {post.platform}
                                            </span>
                                            <span className="capitalize">{post.type}</span>
                                            <span>{post.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                            <Heart className="w-3 h-3 text-red-500" /> {formatNumber(post.likes)}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                            <MessageCircle className="w-3 h-3 text-blue-500" /> {post.comments}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                            <Send className="w-3 h-3 text-emerald-500" /> {post.shares}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                            <Eye className="w-3 h-3 text-purple-500" /> {formatNumber(post.reach)}
                                        </p>
                                    </div>
                                    <div className="text-center min-w-16">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.engagement > 7 ? 'bg-emerald-100 text-emerald-700' :
                                                post.engagement > 4 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {post.engagement}% eng
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Audience */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Хүйсээр</h3>
                        <div className="space-y-3">
                            {MOCK_AUDIENCE.gender.map((item) => (
                                <div key={item.label}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-700">{item.label}</span>
                                        <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${item.label === 'Эмэгтэй' ? 'bg-pink-500' : 'bg-blue-500'}`}
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Насны ангилал</h3>
                        <div className="space-y-2">
                            {MOCK_AUDIENCE.age.map((item) => (
                                <div key={item.label}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-700">{item.label}</span>
                                        <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-500 rounded-full"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
