'use client'
import { useState, useEffect, useCallback, useMemo } from "react"
import { ComponentCard } from "./ComponentCard"
import { SearchAndFilters, type Filters } from "./SearchAndFilters"
import { ApiResponse, HardwareComponent, CPUSpecs, GPUSpecs, MotherboardData, MemoryData } from "../../../interface/specs";

// ─── ТИПЫ ────────────────────────────────────────────────────────────────────

type PresetKey = 'office' | 'multimedia' | 'gaming' | 'professional';

interface Preset {
    key: PresetKey;
    label: string;
    icon: string;
    description: string;
    accent: string;
    searchDefaults: Record<string, string>;
}

interface Step {
    id: 'cpu' | 'gpu' | 'mem' | 'motherboard';
    label: string;
    selected: HardwareComponent | null;
    urlTag: 'cpus' | 'gpus' | 'mem' | 'motherboard';
    lastSearch: string;
}

// ─── ПРЕСЕТЫ ─────────────────────────────────────────────────────────────────

const PRESETS: Preset[] = [
    {
        key: 'office',
        label: 'Офисный ПК',
        icon: '🖥️',
        description: 'Документы, браузер, почта. Тихая и экономичная система для ежедневных задач.',
        accent: 'border-emerald-500 bg-emerald-500/10',
        // Для офиса берем младшие процессоры (Core i3 и Ryzen 3) и встроенную/бюджетную графику
        searchDefaults: { 
            cpus: 'Core i3, Ryzen 3', 
            gpus: 'Intel UHD, Radeon Graphics, GT 1030', 
            mem: 'Crucial, Kingston', 
            motherboard: 'Gigabyte, MSI' 
        }
    },
    {
        key: 'multimedia',
        label: 'Мультимедиа',
        icon: '🎬',
        description: 'Фото, видео, стриминг. Баланс производительности для творческих задач.',
        accent: 'border-purple-500 bg-purple-500/10',
        // Средний сегмент: i5/Ryzen 5 и видеокарты прошлых/текущих поколений (RTX 3060, RX 6600)
        searchDefaults: { 
            cpus: 'Core i5, Ryzen 5', 
            gpus: 'RTX 3060, RX 6600, RTX 4060', 
            mem: 'Kingston, G.Skill', 
            motherboard: 'MSI, Gigabyte' 
        }
    },
    {
        key: 'gaming',
        label: 'Игровой ПК',
        icon: '🎮',
        description: 'Максимальный FPS и плавный геймплей. Для требовательных современных игр.',
        accent: 'border-blue-500 bg-blue-500/10',
        // Мощный игровой конфиг: i7/Ryzen 7 + мощные видеокарты (RTX 4070, RX 7800)
        searchDefaults: { 
            cpus: 'Core i7, Ryzen 7', 
            gpus: 'RTX 4070, RX 7700, RX 7800, RTX 4080', 
            mem: 'Corsair, GSkill', 
            motherboard: '' 
        }
    },
    {
        key: 'professional',
        label: 'Профессиональный',
        icon: '⚡',
        description: '3D, рендер, ML. Максимальная мощность для профессиональных задач.',
        accent: 'border-orange-500 bg-orange-500/10',
        // Топовое железо для рабочих станций: Core i9/Ryzen 9 + флагманские карты (преимущественно Nvidia для CUDA/ML, но и мощные AMD)
        searchDefaults: { 
            cpus: 'Ryzen 9, Core i9', 
            gpus: 'RTX 4090, RTX 4080, RX 7900 XTX', 
            mem: 'GSkill, Corsair', 
            motherboard: '  ' 
        }
    }
];


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

function applyFilters(
    items: HardwareComponent[],
    filters: Filters,
    stepId: Step['id']
): HardwareComponent[] {
    let result = [...items];

    // Фильтр по бренду CPU
    if (stepId === 'cpu' && filters.cpuBrand !== 'all') {
        result = result.filter(item => {
            const name = item.name.toLowerCase();
            if (filters.cpuBrand === 'intel') return name.includes('intel') || name.includes('core') || name.includes('celeron') || name.includes('pentium') || name.includes('xeon');
            if (filters.cpuBrand === 'amd') return name.includes('amd') || name.includes('ryzen') || name.includes('athlon') || name.includes('epyc');
            return true;
        });
    }

    // Фильтр по бренду GPU
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

// ─── ГЛАВНЫЙ КОНФИГУРАТОР ─────────────────────────────────────────────────────

export default function Configurator() {
    const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
    const [steps, setSteps] = useState<Step[]>([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [search, setSearch] = useState("");
    const [result, setResult] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        cpuBrand: 'all',
        gpuBrand: 'all',
        preset: 'all',
    });

    const currentStep = steps[activeIdx];

    const selectedCpu = useMemo(() => steps.find(s => s.id === 'cpu')?.selected, [steps]);
    const selectedMb = useMemo(() => steps.find(s => s.id === 'motherboard')?.selected, [steps]);
    const cpuSocket = hasSocket(selectedCpu?.specifications) ? selectedCpu!.specifications.socket : undefined;

    const compatibilityError = useMemo(() => {
        if (selectedCpu && selectedMb) {
            const mbSocket = hasSocket(selectedMb.specifications) ? selectedMb.specifications.socket : undefined;
            if (!checkSocketMatch(cpuSocket, mbSocket)) {
                return `Сокеты не совпадают: CPU (${cpuSocket}) и MB (${mbSocket})`;
            }
        }
        return null;
    }, [selectedCpu, selectedMb, cpuSocket]);

    const fetchData = useCallback(async (query: string, urlTag: string, lastSearch: string) => {
        setLoading(true);
        // Если задан фильтр пресета и поиск пустой — используем дефолт пресета
        let searchStr = query.trim() !== "" ? query.trim() : lastSearch;

        // Если выбран конкретный пресет в фильтрах — подставляем его дефолтный поиск
        if (filters.preset !== 'all' && query.trim() === "") {
            const p = PRESETS.find(x => x.key === filters.preset);
            if (p) {
                const mapping: Record<string, keyof typeof p.searchDefaults> = {
                    cpus: 'cpus', gpus: 'gpus', mem: 'mem', motherboard: 'motherboard'
                };
                searchStr = p.searchDefaults[urlTag] || lastSearch;
            }
        }

        try {
            const params = new URLSearchParams();
            params.set('search', searchStr);
            params.set('cpu_brand', filters.cpuBrand);
            params.set('gpu_brand', filters.gpuBrand);
            const socket = selectedCpu && hasSocket(selectedCpu.specifications) ? selectedCpu.specifications.socket : '';
            if (socket) params.set('cpu_socket', socket);
            
            const res = await fetch(
                `http://127.0.0.1:8000/hardware/${urlTag}?${params.toString()}`
            );
            if (!res.ok) throw new Error('Network error');
            const data: ApiResponse = await res.json();
            setResult(data);
        } catch (e) {
            setResult({ source: "error", data: [] });
        } finally {
            setLoading(false);
        }
    }, [filters.cpuBrand, filters.gpuBrand, filters.preset, selectedCpu]);

    useEffect(() => {
        if (!currentStep) return;
        setResult(null);
        const timer = setTimeout(() => {
            fetchData(search, currentStep.urlTag, currentStep.lastSearch);
        }, 400);
        return () => clearTimeout(timer);
    }, [search, activeIdx, fetchData]);

    useEffect(() => {
        if (search.trim() !== "" && currentStep) {
            setSteps(prev => prev.map((s, i) =>
                i === activeIdx ? { ...s, lastSearch: search } : s
            ));
        }
    }, [search]);

    // Применяем фильтры к результатам и удаляем дубликаты
    const filteredData = useMemo(() => {
        if (!result?.data || !currentStep) return [];
        const filtered = applyFilters(result.data, filters, currentStep.id);
        
        // Дедупликация по slug (если slug есть) или по имени
        const seen = new Set<string>();
        return filtered.filter(item => {
            const key = item.slug || item.name;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [result, filters, currentStep]);

    const handlePresetSelect = (preset: Preset) => {
        setSelectedPreset(preset);
        setSteps(makeSteps(preset));
        setFilters(prev => ({ ...prev, preset: preset.key }));
        setActiveIdx(0);
        setSearch("");
    };

    const handleSelect = (item: HardwareComponent) => {
        setSteps(prev => prev.map((s, i) =>
            i === activeIdx ? { ...s, selected: item } : s
        ));
    };

    const handleNextStep = () => {
        if (activeIdx < steps.length - 1) {
            setActiveIdx(prev => prev + 1);
            setSearch("");
        }
    };

    const totalTDP = useMemo(() => {
        const extractNumber = (str?: string) => parseInt(str?.replace(/\D/g, '') || '0');
        const cpuTDP = extractNumber(isCpuSpecs(selectedCpu?.specifications) ? selectedCpu!.specifications.tdp : undefined);
        const selectedGpu = steps.find(s => s.id === 'gpu')?.selected;
        const gpuTDP = extractNumber(isGpuSpecs(selectedGpu?.specifications) ? selectedGpu!.specifications.tdp : undefined);
        if (cpuTDP === 0 && gpuTDP === 0) return 0;
        return (cpuTDP + gpuTDP) * 1.2; // Добавляем 20% запас для других компонентов
    }, [steps, selectedCpu]);

    console.log(filteredData);
    

    const handleDownloadPDF = async () => {
        const selectedData = steps
            .filter(s => s.selected)
            .map(s => ({
                type: s.label,
                name: s.selected?.name,
                specifications: s.selected?.specifications
            }));

        if (selectedData.length === 0) {
            alert("Сначала выберите хотя бы один компонент!");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/hardware/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedData)
            });
            if (!response.ok) throw new Error("Ошибка генерации");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'my_pc_build.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            console.error(err);
            alert("Не удалось скачать PDF. Проверьте работу бэкенда.");
        }
    };

    // ── Экран выбора пресета ──────────────────────────────────────────────────
    if (!selectedPreset) {
        return <PresetSelector onSelect={handlePresetSelect} />;
    }

    // ── Основной конфигуратор ─────────────────────────────────────────────────
    return (
        <main className="w-full h-screen overflow-hidden p-8 flex gap-6 text-white">
            <div className="w-4/6 flex flex-col gap-4 h-full">

                {/* ШАПКА ТАБОВ */}
                <div className="bg-[#1E2023] border border-gray-700 h-20 shrink-0 flex items-center justify-around">
                    {steps.map((step, i) => (
                        <div
                            key={step.id}
                            onClick={() => { setActiveIdx(i); setSearch(""); }}
                            className={`flex items-center gap-3 cursor-pointer select-none transition-colors ${activeIdx === i ? "text-blue-300" : "text-gray-500 hover:text-gray-300"}`}
                        >
                            <div className={`size-8 border grid place-items-center font-bold transition-all ${step.selected ? "bg-blue-300 text-black border-blue-300" : activeIdx === i ? "border-blue-300" : "border-gray-700"}`}>
                                {step.selected ? "✓" : `0${i + 1}`}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider">{step.label}</span>
                        </div>
                    ))}

                    {/* Кнопка смены пресета */}
                    <button
                        onClick={() => { setSelectedPreset(null); setSteps([]); setActiveIdx(0); }}
                        className="ml-4 text-[9px] text-gray-600 uppercase tracking-widest border border-gray-800 px-3 py-1.5 hover:border-gray-600 hover:text-gray-400 transition-all"
                        title="Сменить пресет"
                    >
                        {selectedPreset.icon} {selectedPreset.label.split(' ')[0]}
                    </button>
                </div>

                {/* ПОИСК И ФИЛЬТРЫ */}
                <SearchAndFilters
                    search={search}
                    onSearchChange={setSearch}
                    filters={filters}
                    onFiltersChange={setFilters}
                    activeStep={currentStep?.id ?? 'cpu'}
                    presets={PRESETS}
                />

                {/* СЕТКА РЕЗУЛЬТАТОВ */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 pb-8 auto-rows-max">
                        {loading ? (
                            <div className="col-span-full text-center py-20 text-gray-500 uppercase tracking-widest text-sm">
                                Загрузка...
                            </div>
                        ) : filteredData.length ? (
                            filteredData.map((item) => {
                                const itemSocket = hasSocket(item.specifications) ? item.specifications.socket : undefined;
                                const isCompatible = currentStep?.id === 'motherboard'
                                    ? checkSocketMatch(cpuSocket, itemSocket)
                                    : true;

                                return (
                                    <ComponentCard
                                        key={item.slug || item.name}
                                        name={item.name}
                                        slug={item.slug}
                                        type={currentStep?.urlTag as any}
                                        specs={item.specifications}
                                        isSelected={currentStep?.selected?.slug === item.slug}
                                        isCompatible={isCompatible}
                                        onSelect={() => isCompatible && handleSelect(item)}
                                    />
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-600 uppercase text-xs">
                                {result?.data?.length ? "Нет результатов по фильтрам" : "Ничего не найдено"}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* БОКОВАЯ ПАНЕЛЬ */}
            <div className="w-2/6 bg-[#1E2023] border border-gray-700 p-6 flex flex-col justify-between h-full shadow-2xl">
                <div className="overflow-y-auto custom-scrollbar pr-2">
                    <h2 className="text-xl font-bold uppercase mb-2 italic tracking-wider border-b border-gray-800 pb-4 flex justify-between items-center">
                        Конфигурация
                        <span className="not-italic text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 border border-blue-500/20">v1.0</span>
                    </h2>

                    {/* Пресет-бейдж */}
                    <div className="mb-6 flex items-center gap-2 text-[10px] text-gray-500">
                        <span>{selectedPreset.icon}</span>
                        <span className="uppercase tracking-wider">{selectedPreset.label}</span>
                    </div>

                    {/* ОШИБКА СОВМЕСТИМОСТИ */}
                    {compatibilityError && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] font-bold uppercase animate-pulse flex items-center gap-2">
                            <span>⚠️</span> {compatibilityError}
                        </div>
                    )}

                    {/* СПИСОК КОМПОНЕНТОВ */}
                    <div className="space-y-6">
                        {steps.map((step) => (
                            <div key={step.id} className={`border-l-2 pl-4 transition-all ${step.selected ? "border-blue-300" : "border-gray-800"}`}>
                                <div className="flex justify-between items-start">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{step.label}</div>
                                    {hasSocket(step.selected?.specifications) && (
                                        <span className="text-[9px] text-blue-400/50 font-mono">{step.selected.specifications.socket}</span>
                                    )}
                                </div>
                                <div className={`text-sm font-bold truncate mt-0.5 ${step.selected ? "text-white" : "text-gray-600 italic"}`}>
                                    {step.selected ? step.selected.name : "Не выбрано"}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* БЛОК АНАЛИТИКИ (TDP) */}
                    {totalTDP > 100 && (
                        <div className="mt-10 p-4 bg-black/20 border border-gray-800 rounded-sm">
                            <div className="flex justify-between items-end mb-3">
                                <div className="text-[10px] text-gray-500 uppercase font-bold">Энергопотребление</div>
                                <div className="text-lg font-mono text-blue-300 leading-none">{totalTDP}W</div>
                            </div>
                            <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-500 h-full transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.min((totalTDP / 850) * 100, 100)}%` }}
                                />
                            </div>
                            <p className="text-[8px] text-gray-600 mt-2 uppercase tracking-tighter">
                                * Рекомендуемая мощность БП: {Math.ceil((totalTDP + 100) / 50) * 50}W
                            </p>
                        </div>
                    )}
                </div>

                {/* КНОПКИ ДЕЙСТВИЯ */}
                <div className="mt-6 space-y-3">
                    <button
                        onClick={handleDownloadPDF}
                        className="w-full border border-gray-700 py-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Экспорт в PDF
                    </button>

                    <button
                        onClick={handleNextStep}
                        disabled={activeIdx === steps.length - 1 || !!compatibilityError}
                        className="w-full bg-blue-300 text-black py-4 font-bold uppercase tracking-widest text-[11px] hover:bg-white disabled:bg-gray-800 disabled:text-gray-600 transition-all shadow-lg"
                    >
                        {activeIdx === steps.length - 1 ? "Сборка завершена" : "Следующий этап"}
                    </button>
                </div>
            </div>
        </main>
    );
}
