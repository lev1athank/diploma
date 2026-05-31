'use client'
import React, { useMemo } from 'react'
import { ApiResponse, HardwareComponent } from '../../../../interface/specs';
import { Filters } from '../SearchAndFilters';
import { ComponentCard } from '../ComponentCard';

function applyFilters(items: HardwareComponent[], filters: Filters, stepId: string) {
    let result = [...items];

    if (stepId === 'cpu' && filters.cpuBrand !== 'all') {
        result = result.filter(item => {
            const name = item.name.toLowerCase();
            if (filters.cpuBrand === 'intel') return name.includes('intel') || name.includes('core') || name.includes('celeron') || name.includes('pentium') || name.includes('xeon');
            if (filters.cpuBrand === 'amd') return name.includes('amd') || name.includes('ryzen') || name.includes('athlon') || name.includes('epyc');
            return true;
        });
    }

    if (stepId === 'gpu' && filters.gpuBrand !== 'all') {
        result = result.filter(item => {
            const name = item.name.toLowerCase();
            if (filters.gpuBrand === 'nvidia') return name.includes('nvidia') || name.includes('geforce') || name.includes('rtx') || name.includes('gtx') || name.includes('quadro');
            if (filters.gpuBrand === 'amd') return name.includes('amd') || name.includes('radeon') || name.includes('rx ') || name.includes('vega');
            return true;
        });
    }

    return result;
}

export default function ResultsGrid({
    result,
    loading,
    currentStep,
    filters,
    onSelect,
}: {
    result: ApiResponse | null;
    loading: boolean;
    currentStep: any;
    filters: Filters;
    onSelect: (item: HardwareComponent) => void;
}) {
    const uniqueResults = useMemo(() => {
        if (!result?.data || !currentStep) return [] as HardwareComponent[];

        const filtered = applyFilters(result.data, filters, currentStep.id);
        const seen = new Set<string>();

        return filtered.filter(item => {
            const key = item.slug || item.name;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [result, currentStep?.id, filters]);

    return (
        <div className="bg-[#1E2023] border border-gray-800 rounded-2xl p-4">
            {loading ? (
                <div className="min-h-70 flex flex-col justify-center items-center text-gray-500">
                    <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <div className="text-xs uppercase tracking-widest font-bold">Поиск компонентов в базе данных...</div>
                </div>
            ) : uniqueResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {uniqueResults.map((item) => {
                        const isSelectedInCurrentStep = currentStep?.selected?.slug === item.slug;
                        return (
                            <ComponentCard
                                key={item.slug || item.name}
                                component={item}
                                isSelected={isSelectedInCurrentStep}
                                onSelect={() => onSelect(item)}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="min-h-70 border border-dashed border-gray-800 rounded-xl flex flex-col justify-center items-center text-gray-600">
                    <div className="text-2xl mb-2">🔍</div>
                    <div className="text-xs uppercase tracking-widest font-bold mb-1">Ничего не найдено</div>
                    <div className="text-[11px] text-gray-500">Попробуйте изменить поисковый запрос или сбросить фильтры производителей.</div>
                </div>
            )}
        </div>
    );
}
