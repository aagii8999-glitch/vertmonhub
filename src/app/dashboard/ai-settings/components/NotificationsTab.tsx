'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';

interface NotificationsTabProps {
    notifyOnOrder: boolean;
    setNotifyOnOrder: (v: boolean) => void;
    notifyOnContact: boolean;
    setNotifyOnContact: (v: boolean) => void;
    notifyOnSupport: boolean;
    setNotifyOnSupport: (v: boolean) => void;
    saving: boolean;
    onSave: () => void;
}

export default function NotificationsTab({ notifyOnOrder, setNotifyOnOrder, notifyOnContact, setNotifyOnContact, notifyOnSupport, setNotifyOnSupport, saving, onSave }: NotificationsTabProps) {
    const items = [
        { label: 'Шинэ захиалга', desc: 'AI амжилттай захиалга бүртгэх үед', value: notifyOnOrder, toggle: () => setNotifyOnOrder(!notifyOnOrder) },
        { label: 'Холбогдох хүсэлт', desc: 'Хэрэглэгч дугаараа үлдээх үед', value: notifyOnContact, toggle: () => setNotifyOnContact(!notifyOnContact) },
        { label: 'Тусламж хүсэх', desc: 'Хэрэглэгч оператортой холбогдох үед', value: notifyOnSupport, toggle: () => setNotifyOnSupport(!notifyOnSupport) },
    ];

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-6">
                    <h2 className="font-semibold text-gray-900 mb-2">Push Мэдэгдлийн тохиргоо</h2>
                    <p className="text-sm text-gray-500 mb-6">AI ямар тохиолдолд танд мэдэгдэл илгээхийг сонгоно уу.</p>
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-medium text-gray-900">{item.label}</p>
                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                </div>
                                <button onClick={item.toggle} className={`w-12 h-6 rounded-full transition-colors relative ${item.value ? 'bg-violet-600' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.value ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-6">
                        <Button onClick={onSave} disabled={saving}><Save className="w-4 h-4 mr-2" /> Хадгалах</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
