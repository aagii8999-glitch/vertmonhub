'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, GripVertical, Trash2, Save, Send, Link, MessageCircle, X, ChevronRight, Activity, Calendar, ArrowLeft } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import NextLink from 'next/link';

type QuestionType = 'short_text' | 'long_text' | 'single_choice' | 'multiple_choice' | 'rating';

interface Question {
    id: string;
    type: QuestionType;
    text: string;
    options?: string[];
    required: boolean;
}

interface Survey {
    id?: string;
    title: string;
    description: string;
    questions: Question[];
    is_active?: boolean;
    created_at?: string;
}

export default function SurveysPage() {
    const [view, setView] = useState<'list' | 'create'>('list');
    const [surveyList, setSurveyList] = useState<Survey[]>([]);
    const [isLoadingList, setIsLoadingList] = useState(true);

    const [survey, setSurvey] = useState<Survey>({
        title: 'Шинэ судалгаа',
        description: 'Харилцагчийн сэтгэл ханамжийн судалгаа',
        questions: [
            { id: '1', type: 'short_text', text: 'Таны нэр?', required: true },
            { id: '2', type: 'rating', text: 'Үйлчилгээ 1-5 хүртэл хэдэн оноо өгөх вэ?', required: true },
        ]
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (view === 'list') {
            const fetchSurveys = async () => {
                setIsLoadingList(true);
                try {
                    const res = await fetch('/api/surveys');
                    if (res.ok) {
                        const data = await res.json();
                        setSurveyList(data.surveys || []);
                    }
                } catch (error) {
                    console.error('Failed to load surveys', error);
                } finally {
                    setIsLoadingList(false);
                }
            };
            fetchSurveys();
        }
    }, [view]);

    const questionTypes = [
        { id: 'short_text', label: 'Богино хариулт' },
        { id: 'long_text', label: 'Урт хариулт' },
        { id: 'single_choice', label: 'Нэг сонголт' },
        { id: 'multiple_choice', label: 'Олон сонголт' },
        { id: 'rating', label: 'Үнэлгээ (1-5)' },
    ];

    const addQuestion = (type: QuestionType) => {
        const newQuestion: Question = {
            id: Date.now().toString(),
            type,
            text: 'Шинэ асуулт',
            required: false,
            options: type.includes('choice') ? ['Сонголт 1', 'Сонголт 2'] : undefined,
        };
        setSurvey({ ...survey, questions: [...survey.questions, newQuestion] });
    };

    const updateQuestion = (id: string, updates: Partial<Question>) => {
        setSurvey({
            ...survey,
            questions: survey.questions.map(q => q.id === id ? { ...q, ...updates } : q)
        });
    };

    const removeQuestion = (id: string) => {
        setSurvey({
            ...survey,
            questions: survey.questions.filter(q => q.id !== id)
        });
    };

    const onDragEnd = (result: any) => {
        if (!result.destination) return;
        const items = Array.from(survey.questions);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setSurvey({ ...survey, questions: items });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/surveys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(survey),
            });
            if (!res.ok) throw new Error('Failed to save survey');
            alert('Судалгаа амжилттай хадгалагдлаа');
            setView('list'); // Switch back to list view on success
        } catch (error) {
            console.error(error);
            alert('Алдаа гарлаа');
        } finally {
            setIsSaving(false);
        }
    };

    if (view === 'list') {
        return (
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Судалгаанууд</h1>
                        <p className="text-gray-500 text-sm">Хэрэглэгчдийн санал асуулгын жагсаалт</p>
                    </div>
                    <Button onClick={() => setView('create')}>
                        <Plus className="w-5 h-5 mr-2" />
                        Судалгаа үүсгэх
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoadingList ? (
                        <div className="col-span-full py-12 text-center text-gray-500">
                            Уншиж байна...
                        </div>
                    ) : surveyList.length === 0 ? (
                        <div className="col-span-full py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <Plus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">Судалгаа олдсонгүй</h3>
                            <p className="text-gray-500 mt-1">Одоогоор шинэ судалгаа үүсгээгүй байна.</p>
                            <Button className="mt-4" onClick={() => setView('create')}>
                                Эхний судалгааг үүсгэх
                            </Button>
                        </div>
                    ) : (
                        surveyList.map((s) => (
                            <Card key={s.id} className="group hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg line-clamp-1">{s.title}</CardTitle>
                                            <CardDescription className="line-clamp-2 mt-1 min-h-[40px]">{s.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(s.created_at || '').toLocaleDateString('mn-MN')}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Activity className="w-4 h-4 text-emerald-500" />
                                            Идэвхтэй
                                        </div>
                                    </div>
                                    <NextLink href={`/dashboard/surveys/${s.id}`} className="mt-4 block w-full">
                                        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                                            Үр дүн харах <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </NextLink>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        );
    } else if (view === 'create') {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Судалгаа үүсгэх</h1>
                        <p className="text-gray-500 text-sm">Хэрэглэгчдээс санал асуулга авах, сэтгэл ханамж хэмжих</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setView('list')}><ArrowLeft className="w-4 h-4 mr-2" />Буцах</Button>
                        <Button variant="outline"><Link className="w-4 h-4 mr-2" />Линк хуулах</Button>
                        <Button variant="outline"><MessageCircle className="w-4 h-4 mr-2" />Messenger-ээр илгээх</Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Хадгалж байна...' : 'Хадгалах'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Left side - Question types toolkit */}
                    <div className="md:col-span-1 space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Асуулт нэмэх</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {questionTypes.map((qt) => (
                                    <Button
                                        key={qt.id}
                                        variant="outline"
                                        className="w-full justify-start text-left text-sm font-normal"
                                        onClick={() => addQuestion(qt.id as QuestionType)}
                                    >
                                        <Plus className="w-4 h-4 mr-2 text-gray-400" />
                                        {qt.label}
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right side - Builder area */}
                    <div className="md:col-span-3 space-y-4">
                        {/* Survey Header Setup */}
                        <Card className="border-t-4 border-t-primary">
                            <CardContent className="pt-6 space-y-4">
                                <input
                                    type="text"
                                    value={survey.title}
                                    onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
                                    className="text-3xl font-bold w-full outline-none border-b border-transparent hover:border-gray-200 focus:border-primary transition-colors pb-1 bg-transparent"
                                    placeholder="Судалгааны гарчиг"
                                />
                                <textarea
                                    value={survey.description}
                                    onChange={(e) => setSurvey({ ...survey, description: e.target.value })}
                                    className="w-full text-sm text-gray-600 outline-none resize-none border-b border-transparent hover:border-gray-200 focus:border-primary transition-colors pb-1 bg-transparent"
                                    placeholder="Судалгааны тайлбар"
                                    rows={2}
                                />
                            </CardContent>
                        </Card>

                        {/* Questions List */}
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="questions">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                        {survey.questions.map((q, index) => (
                                            <Draggable key={q.id} draggableId={q.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className="group relative"
                                                    >
                                                        <Card>
                                                            <div
                                                                {...provided.dragHandleProps}
                                                                className="absolute left-1/2 -top-3 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded px-2 py-0.5 cursor-grab active:cursor-grabbing text-gray-400"
                                                            >
                                                                <GripVertical className="w-4 h-4" />
                                                            </div>
                                                            <CardContent className="p-6">
                                                                <div className="flex items-start justify-between gap-4">
                                                                    <div className="flex-1 space-y-4">
                                                                        <input
                                                                            type="text"
                                                                            value={q.text}
                                                                            onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                                                                            className="w-full text-lg font-medium outline-none border-b bg-gray-50 px-3 py-2 rounded focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                                                            placeholder="Асуултаа энд бичнэ үү"
                                                                        />

                                                                        {/* Options preview based on type */}
                                                                        <div className="ml-3 mt-4 text-sm text-gray-500">
                                                                            {q.type === 'short_text' && <div className="border-b border-gray-300 w-1/2 pb-1">Богино хариу үлдээх зай...</div>}
                                                                            {q.type === 'long_text' && <div className="border border-gray-200 rounded p-2 h-20 bg-gray-50 flex items-center text-gray-400">Урт хариу үлдээх зай...</div>}
                                                                            {(q.type === 'single_choice' || q.type === 'multiple_choice') && (
                                                                                <div className="space-y-2">
                                                                                    {q.options?.map((opt, i) => (
                                                                                        <div key={i} className="flex items-center gap-2">
                                                                                            {q.type === 'single_choice' ? <div className="w-4 h-4 rounded-full border border-gray-300" /> : <div className="w-4 h-4 rounded border border-gray-300" />}
                                                                                            <input
                                                                                                type="text"
                                                                                                value={opt}
                                                                                                onChange={(e) => {
                                                                                                    const newOptions = [...(q.options || [])];
                                                                                                    newOptions[i] = e.target.value;
                                                                                                    updateQuestion(q.id, { options: newOptions });
                                                                                                }}
                                                                                                className="outline-none border-b border-transparent hover:border-gray-200 focus:border-primary text-gray-700 bg-transparent px-1"
                                                                                            />
                                                                                            <button
                                                                                                onClick={() => {
                                                                                                    const newOptions = q.options?.filter((_, idx) => idx !== i);
                                                                                                    updateQuestion(q.id, { options: newOptions });
                                                                                                }}
                                                                                                className="text-gray-300 hover:text-red-500 ml-2"
                                                                                            >
                                                                                                <X className="w-3 h-3" />
                                                                                            </button>
                                                                                        </div>
                                                                                    ))}
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className="text-primary mt-2 text-xs"
                                                                                        onClick={() => updateQuestion(q.id, { options: [...(q.options || []), `Сонголт ${(q.options?.length || 0) + 1}`] })}
                                                                                    >
                                                                                        Сонголт нэмэх
                                                                                    </Button>
                                                                                </div>
                                                                            )}
                                                                            {q.type === 'rating' && (
                                                                                <div className="flex gap-4 items-center mt-2">
                                                                                    {[1, 2, 3, 4, 5].map(num => (
                                                                                        <div key={num} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center font-medium text-gray-400">
                                                                                            {num}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Question Actions */}
                                                                    <div className="flex flex-col items-center gap-4 pt-2 border-l border-gray-100 pl-4">
                                                                        <button
                                                                            onClick={() => removeQuestion(q.id)}
                                                                            className="text-gray-400 hover:text-red-500 p-2 rounded hover:bg-red-50 transition-colors"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                        <div className="flex items-center gap-2 mt-4 text-xs font-medium text-gray-500">
                                                                            Шаардлагатай
                                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={q.required}
                                                                                    onChange={(e) => updateQuestion(q.id, { required: e.target.checked })}
                                                                                    className="sr-only peer"
                                                                                />
                                                                                <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        {survey.questions.length === 0 && (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <Plus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-500 font-medium">Асуулт одоогоор алга байна</p>
                                <p className="text-sm text-gray-400 mt-1">Зүүн талаас асуултын төрөл сонгож эхэлнэ үү</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
