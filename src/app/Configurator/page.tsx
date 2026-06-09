'use client'
import { useState, useEffect, useCallback, useMemo } from "react"
import { ComponentCard } from "./ComponentCard"
import { SearchAndFilters, type Filters } from "./SearchAndFilters"
import { ApiResponse, HardwareComponent, CPUSpecs, GPUSpecs, MotherboardData, MemoryData } from "../../../interface/specs";
import { useConfiguratorStore, PRESETS, type Preset } from "../../../store/useConfiguratorStore";

// ─── ТИПЫ ────────────────────────────────────────────────────────────────────

interface Step {
    id: 'cpu' | 'gpu' | 'mem' | 'motherboard';
    label: string;
    selected: HardwareComponent | null;
    urlTag: 'cpus' | 'gpus' | 'mem' | 'motherboard';
    lastSearch: string;
}

// PRESETS centrally provided from store/useConfiguratorStore

const INITIAL_STEPS_TEMPLATES = [
    { id: 'cpu', label: 'Процессор', selected: null, urlTag: 'cpus', lastSearch: '' },
    { id: 'gpu', label: 'Видеокарта', selected: null, urlTag: 'gpus', lastSearch: '' },
    { id: 'motherboard', label: 'Материнская плата', selected: null, urlTag: 'motherboard', lastSearch: '' },
    { id: 'mem', label: 'Оперативная память', selected: null, urlTag: 'mem', lastSearch: '' },
] as const;


// ─── НАЧАЛЬНЫЕ ШАГИ ──────────────────────────────────────────────────────────

const makeSteps = (preset: Preset): Step[] => [
    { id: 'cpu', label: "ПРОЦЕССОР", selected: null, urlTag: "cpus", lastSearch: preset.searchDefaults.cpus },
    { id: 'gpu', label: "ВИДЕОКАРТА", selected: null, urlTag: "gpus", lastSearch: preset.searchDefaults.gpus },
    { id: 'mem', label: "ОП. ПАМЯТЬ", selected: null, urlTag: "mem", lastSearch: preset.searchDefaults.mem },
    { id: 'motherboard', label: "МАТ. ПЛАТА", selected: null, urlTag: "motherboard", lastSearch: preset.searchDefaults.motherboard },
]

// ─── УТИЛИТЫ ─────────────────────────────────────────────────────────────────

const checkSocketMatch = (cpuSocket?: string, mbSocket?: string) => {
    if (!cpuSocket || !mbSocket) return true;
    const normalize = (s: string) => s.toUpperCase().replace(/\s+/g, '');
    return normalize(cpuSocket) === normalize(mbSocket);
};

const hasSocket = (specs?: HardwareComponent['specifications']): specs is CPUSpecs | MotherboardData => {
    return !!specs && typeof (specs as any).socket === 'string';
};

const isCpuSpecs = (specs?: HardwareComponent['specifications']): specs is CPUSpecs => {
    return !!specs && typeof (specs as any).tdp === 'string' && typeof (specs as any).socket === 'string';
};

const isGpuSpecs = (specs?: HardwareComponent['specifications']): specs is GPUSpecs => {
    return !!specs && typeof (specs as any).tdp === 'string' && typeof (specs as any).memory_type !== 'undefined';
};

const isMotherboardSpecs = (specs?: HardwareComponent['specifications']): specs is MotherboardData => {
    return !!specs && typeof (specs as any).form_factor === 'string' && typeof (specs as any).socket === 'string';
};

// ─── ФУНКЦИЯ ФИЛЬТРАЦИИ ДАННЫХ ────────────────────────────────────────────────

function applyFilters(
    items: HardwareComponent[],
    filters: Filters,
    stepId: Step['id']
): HardwareComponent[] {
    let result = [...items];

    // Фильтр по бренду CPU — простой поиск по ключевым словам
    if (stepId === 'cpu' && filters.cpuBrand !== 'all') {
        result = result.filter(item => {
            const name = item.name.toLowerCase();
            if (filters.cpuBrand === 'intel') return name.includes('core');
            if (filters.cpuBrand === 'amd') return name.includes('ryzen');
            return true;
        });
    }

    // Фильтр по бренду GPU — простой поиск по ключевым словам
    if (stepId === 'gpu' && filters.gpuBrand !== 'all') {
        result = result.filter(item => {
            const name = item.name.toLowerCase();
            if (filters.gpuBrand === 'nvidia') return name.includes('geforce');
            if (filters.gpuBrand === 'amd') return name.includes('radeon');
            return true;
        });
    }

    return result;
}

// ─── ЭКРАН ВЫБОРА ПРЕСЕТА ─────────────────────────────────────────────────────

function PresetSelector({ onSelect }: { onSelect: (preset: Preset) => void }) {
    return (
        <main className="w-full h-screen overflow-hidden flex flex-col items-center justify-center p-8 text-white bg-[#16181A]">
            <div className="mb-12 text-center">
                <div className="text-[10px] uppercase tracking-[0.4em] text-blue-400 mb-3 font-bold">PC Configurator</div>
                <h1 className="text-3xl font-black uppercase tracking-wider mb-3">Какой ПК вам нужен?</h1>
                <p className="text-gray-500 text-sm">Выберите тип сборки — мы подберём оптимальные комплектующие</p>
            </div>

            <div className="grid grid-cols-2 gap-5 w-full max-w-3xl">
                {PRESETS.map((preset) => (
                    <div
                        key={preset.key}
                        onClick={() => onSelect(preset)}
                        className={`group cursor-pointer border-2 p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl ${preset.accent}`}
                    >
                        <div className="text-4xl mb-4">{preset.icon}</div>
                        <div className="text-base font-black uppercase tracking-wider mb-2">{preset.label}</div>
                        <div className="text-xs text-gray-400 leading-relaxed">{preset.description}</div>
                        <div className="mt-5 text-[9px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors flex items-center gap-1">
                            Начать сборку <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-[10px] text-gray-700 uppercase tracking-widest">
                Пресет можно изменить в любой момент
            </div>
        </main>
    );
}

// ─── ФУНКЦИЯ ФИЛЬТРАЦИИ ДАННЫХ ────────────────────────────────────────────────

// Filtering logic moved to ./components/ResultsGrid

// ─── ГЛАВНЫЙ КОНФИГУРАТОР ─────────────────────────────────────────────────────

export default function Configurator() {
    // Извлекаем состояние и экшены из Zustand
    const {
        selectedPreset,
        setSelectedPreset,
        steps,
        setSteps,
        activeIdx,
        setActiveIdx,
        search,
        setSearch,
        filters,
        setFilters,
        resetConfigurator
    } = useConfiguratorStore();

    // Локальные состояния только для загрузки данных в моменте
    const [result, setResult] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const currentStep = steps[activeIdx];

    const selectedCpu = useMemo(() => {
        return steps.find(step => step.id === 'cpu')?.selected;
    }, [steps]);

    const cpuSocket = useMemo(() => {
        return selectedCpu ? (selectedCpu.specifications as any)?.socket : undefined;
    }, [selectedCpu]);

    const uniqueResults = useMemo<HardwareComponent[]>(() => {
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

    // Выбор готового пресета
    const handleSelectPreset = (preset: Preset) => {
        setSelectedPreset(preset);
        
        // Генерация шагов на основе пресета
        const initializedSteps = INITIAL_STEPS_TEMPLATES.map(step => ({
            ...step,
            lastSearch: preset.searchDefaults[step.urlTag] || ''
        }));
        
        setSteps(initializedSteps);
        setActiveIdx(0);
        setSearch(preset.searchDefaults[INITIAL_STEPS_TEMPLATES[0].urlTag] || '');
        setFilters({ cpuBrand: 'all', gpuBrand: 'all', preset: preset.key });
    };

    // Загрузка компонентов из API
    const fetchComponents = useCallback(async (signal: AbortSignal) => {
        if (!currentStep) return;
        setLoading(true);
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';
            let url = `${apiBase}/hardware/${currentStep.urlTag}?search=${encodeURIComponent(search)}`;
            
            if (filters.preset !== 'all') {
                url += `&preset=${encodeURIComponent(filters.preset)}`;
            }
            if (currentStep.id === 'motherboard' && cpuSocket) {
                url += `&cpu_socket=${encodeURIComponent(cpuSocket)}`;
            }

            const res = await fetch(url, { signal });
            if (!signal.aborted && res.ok) {
                const body = await res.json();
                const normalized = Array.isArray(body)
                    ? { source: 'api', data: body }
                    : body;
                setResult(normalized);
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error("Ошибка при загрузке данных конфигуратора:", error);
            }
        } finally {
            setLoading(false);
        }
    }, [currentStep?.urlTag, currentStep?.id, search, filters.cpuBrand, filters.gpuBrand, filters.preset, currentStep?.id === 'motherboard' ? cpuSocket : undefined]);

    // Запрос к API с дебаунсом при вводе поискового запроса или смене фильтров/шага
    useEffect(() => {
        if (!selectedPreset || !currentStep) return;

        const controller = new AbortController();
        setResult(null);
        const delayDebounce = setTimeout(() => {
            fetchComponents(controller.signal);
        }, 300);

            return () => {
                clearTimeout(delayDebounce);
                controller.abort();
            };
        }, [search, activeIdx, selectedPreset, fetchComponents]);

    // Изменение поисковой строки при переключении шагов
    useEffect(() => {
        if (currentStep) {
            setSearch(currentStep.lastSearch || '');
        }
    }, [activeIdx, setSearch]);

    // Выбор компонента в текущем шаге
    const handleSelect = (item: HardwareComponent) => {
        setSteps(prev => {
            const newSteps = prev.map((s, i) =>
                i === activeIdx ? { ...s, selected: item } : s
            );

            // Автоматический экспорт выбранных CPU и GPU для страницы ТО
            const currentStepId = newSteps[activeIdx].id;
            const tdpMatch = typeof (item.specifications as any).tdp === 'string'
                ? parseInt((item.specifications as any).tdp.replace(/\D/g, '') || '0')
                : 0;

            if (currentStepId === 'cpu') {
                localStorage.setItem('maintenance_cpu', JSON.stringify({ name: item.name, tdp: tdpMatch }));
            } else if (currentStepId === 'gpu') {
                localStorage.setItem('maintenance_gpu', JSON.stringify({ name: item.name, tdp: tdpMatch }));
            }

            return newSteps;
        });
    };

    // Расчет энергопотребления и ошибок совместимости
    const compatibilityError = useMemo(() => {
        const cpu = steps.find(s => s.id === 'cpu')?.selected;
        const mobo = steps.find(s => s.id === 'motherboard')?.selected;
        
        if (cpu && mobo) {
            const cpuSocket = (cpu.specifications as any)?.socket;
            const moboSocket = (mobo.specifications as any)?.socket;
            if (cpuSocket && moboSocket && !checkSocketMatch(cpuSocket, moboSocket)) {
                return `Несовместимые сокеты! Процессор требует ${cpuSocket}, а материнская плата имеет ${moboSocket}.`;
            }
        }
        return null;
    }, [steps]);

    const totalTdp = useMemo(() => {
        return steps.reduce((acc, step) => {
            const tdp = (step.selected?.specifications as any)?.tdp;
            if (tdp) {
                return acc + (parseInt(tdp.replace(/\D/g, '')) || 0);
            }
            return acc;
        }, 0);
    }, [steps]);

    // Переключение шагов кликом по боковой панели
    const handleStepClick = (index: number) => {
        setActiveIdx(index);
    };

    const handleNextStep = () => {
        if (activeIdx < steps.length - 1) {
            setActiveIdx(activeIdx + 1);
        }
    };

    const handleDownloadPDF = () => {
        alert("Экспорт конфигурации в PDF...");
    };

    const handleSearchChange = (value: string) => {
        if (filters.preset !== 'all') {
            setFilters(prev => ({ ...prev, preset: 'all' }));
        }
        setSearch(value);
    };

    // ЭКРАН 1: Выбор пресета
    if (!selectedPreset) {
        return (
            <div className="min-h-screen text-white font-sans p-8 max-w-screen-2xl mx-auto flex flex-col justify-center">
                <div className="mb-10 text-center">
                    <div className="text-[10px] uppercase tracking-[0.4em] text-blue-400 mb-2 font-bold">
                        Конфигуратор систем
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-wider mb-2">
                        Выберите базовый профиль использования
                    </h1>
                    <p className="text-gray-500 text-sm max-w-xl mx-auto">
                        Мы автоматически настроим поисковые фильтры под ваши задачи, чтобы подбор комплектующих был максимально точным.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PRESETS.map((preset) => (
                        <div
                            key={preset.key}
                            onClick={() => handleSelectPreset(preset)}
                            className="bg-[#141517] border border-gray-800 p-6 rounded-xl cursor-pointer hover:border-gray-600 transition-all group hover:scale-[1.02] flex flex-col justify-between min-h-55"
                        >
                            <div>
                                <div className="text-3xl mb-4 group-hover:animate-pulse">{preset.icon}</div>
                                <h3 className="text-lg font-bold uppercase tracking-wider mb-2 text-white group-hover:text-blue-300 transition-colors">
                                    {preset.label}
                                </h3>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {preset.description}
                                </p>
                            </div>
                            <div className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                Начать сборку <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ЭКРАН 2: Полноценный пошаговый конфигуратор
    return (
        <div className="min-h-screen text-white font-sans w-4/6 max-w-none mx-auto px-6 lg:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* ПРАВАЯ КОЛОНКА: Выбор железа (Поиск, Фильтры, Карточки результатов) */}
            <div className="lg:col-span-9 space-y-6">
                <div className="bg-[#141517] border border-gray-800 rounded-2xl p-6 space-y-5 shadow-sm">
                    {currentStep && (
                        <SearchAndFilters
                            search={search}
                            onSearchChange={handleSearchChange}
                            filters={filters}
                            onFiltersChange={setFilters}
                            activeStep={currentStep.id}
                            presets={PRESETS}
                        />
                    )}
                    <div className="bg-[#1E2023] border border-gray-800 rounded-2xl p-4">
                        {loading ? (
                            <div className="min-h-70 flex flex-col justify-center items-center text-gray-500">
                                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <div className="text-xs uppercase tracking-widest font-bold">Поиск компонентов в базе данных...</div>
                            </div>
                        ) : uniqueResults.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {uniqueResults.map((item: HardwareComponent) => {
                                    const isSelectedInCurrentStep = currentStep?.selected?.slug === item.slug;
                                    return (
                                        <ComponentCard
                                            key={item.slug || item.name}
                                            component={item}
                                            isSelected={isSelectedInCurrentStep}
                                            onSelect={() => handleSelect(item)}
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
                </div>
            </div>

            {/* ПРАВАЯ КОЛОНКА: Навигация по шагам сборки (Шаги) */}
            <div className="lg:col-span-3 space-y-4">
                <div className="bg-[#141517] border border-gray-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <div className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">ПРОФИЛЬ</div>
                        <div className="text-xs font-black uppercase tracking-wider text-blue-300">{selectedPreset.label}</div>
                    </div>
                    <button
                        onClick={() => resetConfigurator()}
                        className="text-[9px] text-gray-500 hover:text-red-400 uppercase tracking-widest border border-gray-800 hover:border-red-900/30 bg-transparent px-2 py-1 rounded transition-all"
                    >
                        Сбросить
                    </button>
                </div>

                <div className="space-y-2">
                    {steps.map((step, idx) => {
                        const isActive = idx === activeIdx;
                        const isSelected = step.selected !== null;
                        return (
                            <div
                                key={step.id}
                                onClick={() => handleStepClick(idx)}
                                className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                                    isActive 
                                        ? 'bg-[#1e2023] border-blue-400/50 shadow-lg shadow-blue-950/10' 
                                        : 'bg-[#141517] border-gray-800 hover:border-gray-700'
                                }`}
                            >
                                <div className="truncate pr-2">
                                    <div className="text-[9px] text-gray-600 uppercase tracking-widest font-mono">Шаг 0{idx + 1}</div>
                                    <div className={`text-xs font-bold uppercase tracking-wide ${isActive ? 'text-blue-300' : 'text-gray-400'}`}>
                                        {step.label}
                                    </div>
                                    {isSelected && (
                                        <div className="text-[11px] text-gray-300 truncate mt-1 font-medium">
                                            {step.selected?.name}
                                        </div>
                                    )}
                                </div>
                                {isSelected ? (
                                    <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">✓</span>
                                ) : (
                                    <span className="text-gray-700 text-xs font-mono">•</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* СВОДКА СОВМЕСТИМОСТИ И ПОТРЕБЛЕНИЯ */}
                <div className="bg-[#141517] border border-gray-800 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Общее TDP:</span>
                        <span className="text-sm font-mono font-bold text-blue-300">{totalTdp} W</span>
                    </div>
                    {compatibilityError ? (
                        <div className="p-3 bg-red-950/30 border border-red-900/50 text-[11px] text-red-400 rounded-lg leading-relaxed">
                            ⚠️ {compatibilityError}
                        </div>
                    ) : (
                        <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 text-[10px] text-emerald-500 font-bold uppercase tracking-wider text-center rounded-lg">
                            ✓ Система совместима
                        </div>
                    )}
                </div>

                {/* КНОПКИ ДЕЙСТВИЯ */}
                <div className="space-y-2">
                    <button
                        onClick={handleDownloadPDF}
                        className="w-full border border-gray-800 rounded-xl py-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                    >
                        Экспорт конфигурации (PDF)
                    </button>
                    <button
                        onClick={handleNextStep}
                        disabled={activeIdx === steps.length - 1 || !!compatibilityError}
                        className="w-full bg-blue-400 disabled:bg-gray-800 disabled:text-gray-600 text-black rounded-xl py-3.5 font-black uppercase tracking-widest text-[11px] transition-all hover:bg-blue-300 shadow-md"
                    >
                        Следующий шаг
                    </button>
                </div>
            </div>
        </div>
    );
}
