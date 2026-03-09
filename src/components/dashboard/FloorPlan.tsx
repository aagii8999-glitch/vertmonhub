'use client';

import { useState, useMemo } from 'react';
import { Building2, ChevronDown } from 'lucide-react';

interface Unit {
    id: string;
    name: string;
    floor: number;
    position: number; // column position per floor
    status: 'available' | 'reserved' | 'sold' | 'rented' | 'barter';
    rooms: number;
    size_sqm: number;
    price: number;
}

interface FloorPlanProps {
    units: Unit[];
    totalFloors: number;
    unitsPerFloor: number;
    projectName?: string;
    onUnitClick?: (unit: Unit) => void;
}

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string; label: string }> = {
    available: { bg: 'bg-emerald-100 hover:bg-emerald-200', border: 'border-emerald-400', text: 'text-emerald-800', label: 'Чөлөөтэй' },
    reserved: { bg: 'bg-yellow-100 hover:bg-yellow-200', border: 'border-yellow-400', text: 'text-yellow-800', label: 'Захиалсан' },
    sold: { bg: 'bg-gray-200', border: 'border-gray-400', text: 'text-gray-500', label: 'Зарагдсан' },
    rented: { bg: 'bg-blue-100 hover:bg-blue-200', border: 'border-blue-400', text: 'text-blue-800', label: 'Түрээс' },
    barter: { bg: 'bg-orange-100 hover:bg-orange-200', border: 'border-orange-400', text: 'text-orange-800', label: 'Бартер' },
};

const formatPrice = (n: number) => n >= 1e9 ? `${(n / 1e9).toFixed(1)}B` : n >= 1e6 ? `${(n / 1e6).toFixed(0)}M` : n.toLocaleString();

export function FloorPlan({ units, totalFloors, unitsPerFloor, projectName, onUnitClick }: FloorPlanProps) {
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const floors = useMemo(() => {
        const floorMap: Record<number, Unit[]> = {};
        for (let f = 1; f <= totalFloors; f++) floorMap[f] = [];

        units.forEach(u => {
            if (floorMap[u.floor]) floorMap[u.floor].push(u);
        });

        // Sort by position within each floor
        Object.values(floorMap).forEach(arr => arr.sort((a, b) => a.position - b.position));
        return floorMap;
    }, [units, totalFloors]);

    const stats = useMemo(() => {
        const total = units.length;
        const available = units.filter(u => u.status === 'available').length;
        const sold = units.filter(u => u.status === 'sold').length;
        const reserved = units.filter(u => u.status === 'reserved').length;
        const barter = units.filter(u => u.status === 'barter').length;
        return { total, available, sold, reserved, barter, pctSold: total > 0 ? Math.round((sold / total) * 100) : 0 };
    }, [units]);

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-violet-600" />
                        <h3 className="font-semibold text-gray-900">{projectName || 'Давхарын план'}</h3>
                    </div>
                    <div className="text-sm text-gray-500">
                        {stats.available} чөлөөтэй / {stats.total} нийт ({stats.pctSold}% зарагдсан)
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-2">
                    {Object.entries(STATUS_COLORS).map(([key, val]) => {
                        const count = units.filter(u => u.status === key).length;
                        return (
                            <button
                                key={key}
                                onClick={() => setFilterStatus(filterStatus === key ? 'all' : key)}
                                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-all ${filterStatus === key ? `${val.bg} ${val.border} border-2` : 'border border-gray-200 text-gray-500'}`}
                            >
                                <div className={`w-2.5 h-2.5 rounded-sm ${val.bg.split(' ')[0]}`} />
                                {val.label} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Floor Plan Grid */}
            <div className="p-4 overflow-y-auto max-h-[600px]">
                {Array.from({ length: totalFloors }, (_, i) => totalFloors - i).map(floor => {
                    const floorUnits = floors[floor] || [];
                    return (
                        <div key={floor} className="flex items-stretch mb-1">
                            {/* Floor Label */}
                            <div className="w-12 flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0">
                                {floor}F
                            </div>

                            {/* Units */}
                            <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${unitsPerFloor}, 1fr)` }}>
                                {Array.from({ length: unitsPerFloor }, (_, pos) => {
                                    const unit = floorUnits.find(u => u.position === pos + 1);
                                    if (!unit) {
                                        return <div key={pos} className="h-12 bg-gray-50 rounded border border-gray-100" />;
                                    }

                                    const style = STATUS_COLORS[unit.status] || STATUS_COLORS.available;
                                    const isHighlighted = filterStatus === 'all' || filterStatus === unit.status;

                                    return (
                                        <button
                                            key={unit.id}
                                            onClick={() => {
                                                setSelectedUnit(unit);
                                                onUnitClick?.(unit);
                                            }}
                                            className={`h-12 rounded border-2 flex flex-col items-center justify-center transition-all text-center ${style.bg} ${style.border} ${style.text} ${!isHighlighted ? 'opacity-20' : ''} ${selectedUnit?.id === unit.id ? 'ring-2 ring-violet-500 scale-105' : ''}`}
                                        >
                                            <span className="text-[10px] font-bold leading-tight">{unit.name}</span>
                                            <span className="text-[9px] opacity-70">{unit.rooms}ө • {formatPrice(unit.price)}₮</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Selected Unit Detail */}
            {selectedUnit && (
                <div className="p-4 bg-violet-50 border-t border-violet-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-900">{selectedUnit.name}</p>
                            <p className="text-sm text-gray-600">
                                {selectedUnit.rooms} өрөө • {selectedUnit.size_sqm}м² • {selectedUnit.floor}-р давхар
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-violet-700">{formatPrice(selectedUnit.price)}₮</p>
                            <p className="text-xs text-gray-500">
                                {selectedUnit.size_sqm > 0 ? `${formatPrice(Math.round(selectedUnit.price / selectedUnit.size_sqm))}₮/м²` : ''}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
