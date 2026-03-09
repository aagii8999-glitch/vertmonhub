'use client';

import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, MessageSquare, CheckCircle2, AlertCircle, Download, Loader2 } from 'lucide-react';

type ImportType = 'properties' | 'faq';

interface ImportResult {
    success: boolean;
    imported: number;
    errors?: string[];
    message: string;
}

export default function AdminImportPage() {
    const [importType, setImportType] = useState<ImportType>('properties');
    const [file, setFile] = useState<File | null>(null);
    const [shopId, setShopId] = useState('');
    const [shops, setShops] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ImportResult | null>(null);
    const [shopsLoading, setShopsLoading] = useState(true);
    const fileRef = useRef<HTMLInputElement>(null);

    // Fetch shops on mount
    useState(() => {
        fetch('/api/admin/dashboard')
            .then(res => res.json())
            .then(data => {
                if (data.shops) setShops(data.shops);
                if (data.shops?.length > 0) setShopId(data.shops[0].id);
                setShopsLoading(false);
            })
            .catch(() => setShopsLoading(false));
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            setResult(null);
        }
    };

    const handleImport = async () => {
        if (!file || !shopId) return;

        setLoading(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('shopId', shopId);
            formData.append('type', importType);

            const res = await fetch('/api/admin/import', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            setResult(data);
        } catch (error: any) {
            setResult({ success: false, imported: 0, message: error.message });
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        // Create CSV template
        let csv = '';
        if (importType === 'properties') {
            csv = 'Нэр,Төрөл,Үнэ,Талбай,Өрөө,Унтлагын өрөө,Угаалгын өрөө,Давхар,Хаяг,Дүүрэг,Статус,Тайлбар,1м² үнэ\n';
            csv += 'A-301 3 өрөө,apartment,380000000,95,3,2,1,3/12,Mandala Garden,Хан-Уул,available,Өмнөд харагдацтай нарлаг байр,4000000\n';
            csv += 'B-501 2 өрөө,apartment,280000000,65,2,1,1,5/12,Mandala Garden,Хан-Уул,available,Зүүн харагдацтай,4307692\n';
        } else {
            csv = 'Асуулт,Хариулт\n';
            csv += 'Урьдчилгаа хэд вэ?,Нийт үнийн 30% урьдчилгаа төлнө.\n';
            csv += 'Зээлийн хүү хэд вэ?,Жилийн 8-12% хүүтэй.\n';
        }

        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = importType === 'properties' ? 'properties_template.csv' : 'faq_template.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Дата Импорт</h1>
                <p className="text-gray-500 mt-1">CSV/Excel файлаас үл хөдлөх, FAQ мэдээллийг бөөнөөр оруулах</p>
            </div>

            {/* Import Type Selector */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                    onClick={() => { setImportType('properties'); setResult(null); }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${importType === 'properties'
                        ? 'border-violet-600 bg-violet-50 text-violet-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                >
                    <FileSpreadsheet className="w-6 h-6" />
                    <div className="text-left">
                        <p className="font-semibold">Үл хөдлөх хөрөнгө</p>
                        <p className="text-xs opacity-70">Байр, газар, оффис</p>
                    </div>
                </button>

                <button
                    onClick={() => { setImportType('faq'); setResult(null); }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${importType === 'faq'
                        ? 'border-violet-600 bg-violet-50 text-violet-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                >
                    <MessageSquare className="w-6 h-6" />
                    <div className="text-left">
                        <p className="font-semibold">FAQ / Мэдлэгийн сан</p>
                        <p className="text-xs opacity-70">Асуулт-хариулт</p>
                    </div>
                </button>
            </div>

            {/* Import Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                {/* Shop Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Дэлгүүр/Компани</label>
                    {shopsLoading ? (
                        <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                    ) : (
                        <select
                            value={shopId}
                            onChange={(e) => setShopId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        >
                            {shops.map(shop => (
                                <option key={shop.id} value={shop.id}>{shop.name}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Template Download */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div>
                        <p className="text-sm font-medium text-blue-800">
                            {importType === 'properties' ? 'Үл хөдлөхийн загвар' : 'FAQ загвар'}
                        </p>
                        <p className="text-xs text-blue-600 mt-0.5">CSV загвар татаж, мэдээллээ бөглөнө үү</p>
                    </div>
                    <button
                        onClick={downloadTemplate}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        <Download className="w-4 h-4" />
                        Загвар татах
                    </button>
                </div>

                {/* Column Guide */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Шаардлагатай баганууд:</p>
                    {importType === 'properties' ? (
                        <div className="flex flex-wrap gap-1.5">
                            {['Нэр*', 'Үнэ*', 'Төрөл', 'Талбай (м²)', 'Өрөө', 'Давхар', 'Хаяг', 'Дүүрэг', 'Статус', 'Тайлбар'].map(col => (
                                <span key={col} className={`px-2 py-1 rounded text-xs font-medium ${col.includes('*') ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'}`}>
                                    {col}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-1.5">
                            {['Асуулт*', 'Хариулт*'].map(col => (
                                <span key={col} className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                                    {col}
                                </span>
                            ))}
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">* заавал бөглөх</p>
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Файл сонгох</label>
                    <div
                        onClick={() => fileRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/50 transition-all"
                    >
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        {file ? (
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm text-gray-600">Файл чирж тавих эсвэл сонгох</p>
                                <p className="text-xs text-gray-400 mt-1">.csv, .xlsx, .xls дэмжинэ</p>
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                {/* Import Button */}
                <button
                    onClick={handleImport}
                    disabled={!file || !shopId || loading}
                    className="w-full py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Импорт хийж байна...
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            Импорт хийх
                        </>
                    )}
                </button>
            </div>

            {/* Result */}
            {result && (
                <div className={`mt-6 p-6 rounded-xl border ${result.success
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                    }`}>
                    <div className="flex items-center gap-3 mb-3">
                        {result.success ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        )}
                        <p className={`font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                            {result.message}
                        </p>
                    </div>
                    {result.success && result.imported > 0 && (
                        <p className="text-sm text-green-700">
                            ✅ {result.imported} мөр амжилттай оруулсан
                        </p>
                    )}
                    {result.errors && result.errors.length > 0 && (
                        <div className="mt-3 p-3 bg-white rounded-lg border">
                            <p className="text-sm font-medium text-red-700 mb-2">Алдаатай мөрүүд:</p>
                            <ul className="text-xs text-red-600 space-y-1 max-h-40 overflow-y-auto">
                                {result.errors.map((err, i) => (
                                    <li key={i}>• {err}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
