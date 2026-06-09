"use client"
import { useCallback } from "react"
import { useConfiguratorStore, PRESETS } from "../../../store/useConfiguratorStore";

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
            className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider border transition-all ${
                active
                    ? 'bg-blue-400 text-black border-blue-400'
                    : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-200'
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
        cpu: 'процессора',
        gpu: 'видеокарты',
        mem: 'памяти',
        motherboard: 'материнской платы',
    };

    const setSelectedPreset = useConfiguratorStore(state => state.setSelectedPreset);

    const handlePresetChange = useCallback((preset: Filters['preset']) => {
        onFiltersChange({ ...filters, preset });
        if (preset === 'all') {
            setSelectedPreset(null);
            return;
        }
        const presetObj = PRESETS.find(p => p.key === preset);
        if (presetObj) setSelectedPreset(presetObj);
    }, [filters, onFiltersChange, setSelectedPreset]);

    const handleCpuBrandChange = useCallback((brand: Filters['cpuBrand']) => {
        onFiltersChange({ ...filters, cpuBrand: brand });
    }, [filters, onFiltersChange]);

    const handleGpuBrandChange = useCallback((brand: Filters['gpuBrand']) => {
        onFiltersChange({ ...filters, gpuBrand: brand });
    }, [filters, onFiltersChange]);

    return (
        <div className="space-y-4">
            <div className="bg-[#1E2023] border border-gray-800 rounded-2xl p-4 shadow-sm">
                <input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={`Поиск ${stepLabels[activeStep]}...`}
                    className="w-full bg-[#141517] border border-gray-800 rounded-2xl p-4 outline-none focus:border-blue-300 transition-colors placeholder-gray-600 font-mono text-sm text-white"
                />
            </div>

            <div className="bg-[#1E2023] border border-gray-800 rounded-2xl p-4 shadow-sm grid gap-4">
                <div className="grid gap-2">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">Пресет</span>
                    <div className="flex flex-wrap gap-2">
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

                <div className="grid gap-2">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">CPU</span>
                    <div className="flex flex-wrap gap-2">
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

                <div className="grid gap-2">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">GPU</span>
                    <div className="flex flex-wrap gap-2">
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
        </div>
    );
}
