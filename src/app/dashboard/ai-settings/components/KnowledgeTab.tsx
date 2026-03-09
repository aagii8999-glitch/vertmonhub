'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, Save, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface KnowledgeTabProps {
    customKnowledge: Array<{ key: string; value: string }>;
    setCustomKnowledge: (v: Array<{ key: string; value: string }>) => void;
    saving: boolean;
    setSaving: (v: boolean) => void;
    setSuccess: (v: boolean) => void;
    setError: (v: string | null) => void;
}

export default function KnowledgeTab({ customKnowledge, setCustomKnowledge, saving, setSaving, setSuccess, setError }: KnowledgeTabProps) {
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');

    async function handleSave() {
        setSaving(true);
        try {
            const knowledgeObject = customKnowledge.reduce((acc, item) => {
                if (item.key && item.value) acc[item.key] = item.value;
                return acc;
            }, {} as Record<string, string>);

            const res = await fetch('/api/shop', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ custom_knowledge: knowledgeObject }),
            });

            if (res.ok) {
                setSuccess(true);
                toast.success('Амжилттай хадгалагдлаа');
                setTimeout(() => setSuccess(false), 3000);
            } else throw new Error('Failed to save');
        } catch (err: any) {
            setError(err.message);
            toast.error('Хадгалахад алдаа гарлаа');
        } finally { setSaving(false); }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Мэдлэгийн сан (Custom Knowledge)</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-sm text-gray-500">AI-д танай бизнесийн онцлог мэдээллийг зааж өгөх.</p>

                    <div className="flex gap-3 items-end p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex-1">
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Түлхүүр үг</label>
                            <Input placeholder="Жишээ: Хаяг" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
                        </div>
                        <div className="flex-[2]">
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Утга</label>
                            <Input placeholder="Жишээ: СБД, 1-р хороо, Blue Sky Tower" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
                        </div>
                        <Button onClick={() => { if (newKey && newValue) { setCustomKnowledge([...customKnowledge, { key: newKey, value: newValue }]); setNewKey(''); setNewValue(''); } }} disabled={!newKey || !newValue}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {customKnowledge.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                                <p className="text-sm">Мэдээлэл байхгүй байна</p>
                            </div>
                        ) : (
                            customKnowledge.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-violet-300 transition-colors group">
                                    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs">{idx + 1}</div>
                                    <div className="flex-1 grid grid-cols-3 gap-4">
                                        <div className="font-medium text-gray-900 col-span-1 border-r border-gray-100 pr-4 truncate" title={item.key}>{item.key}</div>
                                        <div className="text-gray-600 col-span-2 truncate" title={item.value}>{item.value}</div>
                                    </div>
                                    <button onClick={() => setCustomKnowledge(customKnowledge.filter((_, i) => i !== idx))} className="p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleSave} disabled={saving}>
                            <Save className="w-4 h-4 mr-2" /> {saving ? 'Хадгалж байна...' : 'Хадгалах'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
