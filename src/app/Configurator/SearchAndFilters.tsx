'use client'
import { useCallback } from "react"

export interface Filters {
    cpuBrand: 'all' | 'intel' | 'amd';
    gpuBrand: 'all' | 'nvidia' | 'amd' | 'intel';
    preset: 'office' | 'multimedia' | 'gaming' | 'professional' | 'all';
}

interface PRESETS {
    key: 'office' | 'multimedia' | 'gaming' | 'professional';
    label: string;
    icon: string;
}

interface SearchAndFiltersProps {
    search: string;
    onSearchChange: (search: string) => void;
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
    activeStep: 'cpu' | 'gpu' | 'mem' | 'motherboard';
    presets: PRESETS[];
}

function FilterButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-all ${
                active
                    ? 'bg-blue-400 text-black border-blue-400'
                    : 'bg-transparent text-gray-500 border-gray-700 hover:border-gray-500 hover:text-gray-300'
            }`}
        >
            {label}
        </button>
    );
}

export function SearchAndFilters({
    search,
    onSearchChange,
    filters,
    onFiltersChange,
    activeStep,
    presets,
}: SearchAndFiltersProps) {
    
    const stepLabels: Record<string, string> = {
        cpu: 'процессор',
        gpu: 'видеокарта',
        mem: 'память',
        motherboard: 'мат. плата',
    };

    const handlePresetChange = useCallback((preset: Filters['preset']) => {
        onFiltersChange({ ...filters, preset });
    }, [filters, onFiltersChange]);

    const handleCpuBrandChange = useCallback((brand: Filters['cpuBrand']) => {
        onFiltersChange({ ...filters, cpuBrand: brand });
    }, [filters, onFiltersChange]);

    const handleGpuBrandChange = useCallback((brand: Filters['gpuBrand']) => {
        onFiltersChange({ ...filters, gpuBrand: brand });
    }, [filters, onFiltersChange]);

    return (
        <>
            {/* ПОИСК */}
            <div className="shrink-0">
                <input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={`Поиск ${stepLabels[activeStep]}...`}
                    className="w-full bg-[#1E2023] border border-gray-700 p-4 outline-none focus:border-blue-300 transition-colors placeholder-gray-600 font-mono text-sm"
                />
            </div>

            {/* ФИЛЬТРЫ */}
            <div className="shrink-0 flex flex-wrap gap-x-5 gap-y-2 items-center px-1">

                {/* Пресет */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-gray-600 uppercase tracking-wider font-semibold w-10">Пресет</span>
                    <div className="flex gap-1">
                        <FilterButton
                            active={filters.preset === 'all'}
                            label="Все"
                            onClick={() => handlePresetChange('all')}
                        />
                        {presets.map(p => (
                            <FilterButton
                                key={p.key}
                                active={filters.preset === p.key}
                                label={p.icon + ' ' + p.label.split(' ')[0]}
                                onClick={() => handlePresetChange(p.key)}
                            />
                        ))}
                    </div>
                </div>

                {/* CPU Brand — показываем на всех шагах */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-gray-600 uppercase tracking-wider font-semibold w-10">CPU</span>
                    <div className="flex gap-1">
                        <FilterButton
                            active={filters.cpuBrand === 'all'}
                            label="Все"
                            onClick={() => handleCpuBrandChange('all')}
                        />
                        <FilterButton
                            active={filters.cpuBrand === 'intel'}
                            label="Intel"
                            onClick={() => handleCpuBrandChange('intel')}
                        />
                        <FilterButton
                            active={filters.cpuBrand === 'amd'}
                            label="AMD"
                            onClick={() => handleCpuBrandChange('amd')}
                        />
                    </div>
                </div>

                {/* GPU Brand — показываем на всех шагах */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-gray-600 uppercase tracking-wider font-semibold w-10">GPU</span>
                    <div className="flex gap-1">
                        <FilterButton
                            active={filters.gpuBrand === 'all'}
                            label="Все"
                            onClick={() => handleGpuBrandChange('all')}
                        />
                        <FilterButton
                            active={filters.gpuBrand === 'nvidia'}
                            label="NVIDIA"
                            onClick={() => handleGpuBrandChange('nvidia')}
                        />
                        <FilterButton
                            active={filters.gpuBrand === 'amd'}
                            label="AMD"
                            onClick={() => handleGpuBrandChange('amd')}
                        />
                        <FilterButton
                            active={filters.gpuBrand === 'intel'}
                            label="Intel"
                            onClick={() => handleGpuBrandChange('intel')}
                        />


                    </div>
                </div>
            </div>
        </>
    );
}
