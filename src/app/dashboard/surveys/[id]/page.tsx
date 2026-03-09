'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Sparkles, BarChart2, Users, FileText } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function SurveyReportPage() {
    const params = useParams();
    const router = useRouter();
    const surveyId = params.id as string;

    const [summary, setSummary] = useState<string>('');
    const [responseCount, setResponseCount] = useState<number>(0);
    const [responses, setResponses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch(`/api/surveys/${surveyId}`);
                if (!res.ok) throw new Error('Failed to fetch summary');
                const data = await res.json();
                setSummary(data.summary);
                setResponseCount(data.responseCount);
                setResponses(data.responses || []);
            } catch (error) {
                console.error(error);
                setSummary('Тайлан татахад алдаа гарлаа.');
            } finally {
                setIsLoading(false);
            }
        };

        if (surveyId) fetchSummary();
    }, [surveyId]);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()} className="text-gray-500 hover:text-gray-900">
                    <ArrowLeft className="w-5 h-5 mr-1" /> Буцах
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Судалгааны Тайлан</h1>
                    <p className="text-gray-500 text-sm">AI ашиглан нэгтгэсэн үр дүн</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-500">Нийт хариулт</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold flex items-center gap-2">
                            <Users className="w-6 h-6 text-primary" />
                            {isLoading ? '...' : responseCount}
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        <div>
                            <CardTitle>AI Нэгтгэл</CardTitle>
                            <CardDescription>Gemini загвар ашиглан гаргасан хураангуй</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="animate-pulse space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        ) : (
                            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                                {summary}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            Сүүлийн хариултууд
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Огноо</th>
                                        <th className="px-6 py-3">Хариултууд (JSON)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan={2} className="text-center py-4">Уншиж байна...</td></tr>
                                    ) : responses.length === 0 ? (
                                        <tr><td colSpan={2} className="text-center py-4 text-gray-400">Өгөгдөл алга байна</td></tr>
                                    ) : (
                                        responses.map((resp) => (
                                            <tr key={resp.id} className="bg-white border-b">
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    {new Date(resp.created_at).toLocaleString('mn-MN')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <pre className="text-xs bg-gray-50 p-2 rounded max-w-md overflow-x-auto">
                                                        {JSON.stringify(resp.answers, null, 2)}
                                                    </pre>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
