'use client'
import { useState, useEffect, useCallback, useMemo } from "react"
import { ComponentCard } from "./ComponentCard"
import { ApiResponse, HardwareComponent } from "../../../interface/specs";

interface Step {
    id: 'cpu' | 'gpu' | 'mem' | 'motherboard';
    label: string;
    selected: HardwareComponent | null;
    urlTag: string;
    lastSearch: string;
}

const initialSteps: Step[] = [
    { id: 'cpu', label: "ПРОЦЕССОР", selected: null, urlTag: "cpus", lastSearch: "Core" },
    { id: 'gpu', label: "ВИДЕОКАРТА", selected: null, urlTag: "gpus", lastSearch: "GTX" },
    { id: 'mem', label: "ПАМЯТЬ", selected: null, urlTag: "mem", lastSearch: "Corsair" },
    { id: 'motherboard', label: "МАТ. ПЛАТА", selected: null, urlTag: "motherboard", lastSearch: "Asus" },
]



// Функция проверки совместимости сокетов
const checkSocketMatch = (cpuSocket?: string, mbSocket?: string) => {
    if (!cpuSocket || !mbSocket) return true;
    const normalize = (s: string) => s.toUpperCase().replace(/\s+/g, '');
    return normalize(cpuSocket) === normalize(mbSocket);
};

export default function Configurator() {
    const [steps, setSteps] = useState<Step[]>(initialSteps)
    const [activeIdx, setActiveIdx] = useState(0)
    const [search, setSearch] = useState("")
    const [result, setResult] = useState<ApiResponse | null>(null)
    const [loading, setLoading] = useState(false)

    const currentStep = steps[activeIdx]

    // Вычисляем сокет выбранного процессора для глобальной проверки
    const selectedCpu = useMemo(() => steps.find(s => s.id === 'cpu')?.selected, [steps]);
    const selectedMb = useMemo(() => steps.find(s => s.id === 'motherboard')?.selected, [steps]);

    const cpuSocket = selectedCpu?.specifications?.socket;

    // Ошибка совместимости для сайдбара
    const compatibilityError = useMemo(() => {
        if (selectedCpu && selectedMb) {
            const mbSocket = selectedMb.specifications?.socket || (selectedMb as any).socket;
            if (!checkSocketMatch(cpuSocket, mbSocket)) {
                return `Сокеты не совпадают: CPU (${cpuSocket}) и MB (${mbSocket})`;
            }
        }
        return null;
    }, [selectedCpu, selectedMb, cpuSocket]);

    const fetchData = useCallback(async (query: string, urlTag: string, lastSearch: string) => {
        setLoading(true);
        const searchStr = query.trim() !== "" ? query.trim() : lastSearch;

        try {
            const res = await fetch(
                `http://127.0.0.1:8000/hardware/${urlTag}?search=${encodeURIComponent(searchStr)}`
            );
            if (!res.ok) throw new Error('Network error');
            const data: ApiResponse = await res.json();
            setResult(data);
        } catch (e) {
            setResult({ source: "error", data: [] });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setResult(null); // Сбрасываем старые результаты, чтобы показать "Загрузка..."
        const timer = setTimeout(() => {
            fetchData(search, currentStep.urlTag, currentStep.lastSearch);
        }, 400);
        return () => clearTimeout(timer);
    }, [search, activeIdx, fetchData]); // Добавь fetchData в зависимости

    useEffect(() => {
        if (search.trim() !== "") {
            setSteps(prev => prev.map((s, i) =>
                i === activeIdx ? { ...s, lastSearch: search } : s
            ));
        }
    }, [search]);

    const handleSelect = (item: HardwareComponent) => {
        setSteps(prev => prev.map((s, i) =>
            i === activeIdx ? { ...s, selected: item } : s
        ));
    }

    const handleNextStep = () => {
        if (activeIdx < steps.length - 1) {
            setActiveIdx(prev => prev + 1);
            setSearch("");
        }
    }

    const totalTDP = useMemo(() => {
        const extractNumber = (str?: string) => parseInt(str?.replace(/\D/g, '') || '0');

        const cpuTDP = extractNumber(selectedCpu?.specifications?.tdp);
        // Находим видеокарту в шагах
        const selectedGpu = steps.find(s => s.id === 'gpu')?.selected;
        const gpuTDP = extractNumber(selectedGpu?.specifications?.tdp);

        if (cpuTDP === 0 && gpuTDP === 0) return 0;
        return cpuTDP + gpuTDP + 100; // +100W запас на остальную систему
    }, [steps]);

    // 2. Функция-заглушка для PDF
    const handleDownloadPDF = async () => {
        // Собираем только те шаги, где выбран компонент
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

    return (
        <main className="w-full h-screen overflow-hidden p-8 flex gap-6 text-white ">
            <div className="w-4/6 flex flex-col gap-6 h-full">
                {/* ШАПКА ТАБОВ */}
                <div className="bg-[#1E2023] border border-gray-700 h-20 flex-shrink-0 flex items-center justify-around">
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
                </div>

                {/* ПОИСК */}
                <div className="flex-shrink-0">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`Поиск ${currentStep.label.toLowerCase()}...`}
                        className="w-full bg-[#1E2023] border border-gray-700 p-4 outline-none focus:border-blue-300 transition-colors placeholder-gray-600 font-mono text-sm"
                    />
                </div>

                {/* СЕТКА РЕЗУЛЬТАТОВ */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 pb-8 auto-rows-max">
                        {loading ? (
                            <div className="col-span-full text-center py-20 text-gray-500 uppercase tracking-widest text-sm">
                                Загрузка...
                            </div>
                        ) : result?.data?.length ? (
                            result.data.map((item, i) => {
                                // Проверка совместимости для текущей карточки в списке
                                const itemSocket = item.specifications?.socket || (item as any).socket;
                                const isCompatible = currentStep.id === 'motherboard'
                                    ? checkSocketMatch(cpuSocket, itemSocket)
                                    : true;

                                return (
                                    <ComponentCard
                                        key={`${item.slug || 'item'}-${i}`}
                                        name={item.name}
                                        slug={item.slug}
                                        type={currentStep.urlTag as any}
                                        specs={item.specifications}
                                        isSelected={currentStep.selected?.slug === item.slug}
                                        isCompatible={isCompatible} // Передаем результат проверки
                                        onSelect={() => isCompatible && handleSelect(item)}
                                    />
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-600 uppercase text-xs">
                                Ничего не найдено
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-2/6 bg-[#1E2023] border border-gray-700 p-6 flex flex-col justify-between h-full shadow-2xl">
                <div className="overflow-y-auto custom-scrollbar pr-2">
                    <h2 className="text-xl font-bold uppercase mb-8 italic tracking-wider border-b border-gray-800 pb-4 flex justify-between items-center">
                        Конфигурация
                        <span className="not-italic text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 border border-blue-500/20">v1.0</span>
                    </h2>

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
                                    {step.selected?.specifications?.socket && (
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
    )
}