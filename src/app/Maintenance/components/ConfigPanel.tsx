'use client'
import { useState, useEffect } from 'react';
import { ConfigState, IntensityLevel } from './types';
import { INTENSITY_LABELS } from './data';
import SectionLabel from './SectionLabel';

type Props = {
    config: ConfigState;
    setConfig: (c: ConfigState) => void;
    intensity: IntensityLevel;
    setIntensity: (i: IntensityLevel) => void;
};

export default function ConfigPanel({ config, setConfig, intensity, setIntensity }: Props) {
    // Стейты для выпадающих списков
    const [cpuResults, setCpuResults] = useState<any[]>([]);
    const [gpuResults, setGpuResults] = useState<any[]>([]);
    const [openCpu, setOpenCpu] = useState(false);
    const [openGpu, setOpenGpu] = useState(false);
    const [loadingCpu, setLoadingCpu] = useState(false);
    const [loadingGpu, setLoadingGpu] = useState(false);

    // Утилита для извлечения TDP
    const extractTdp = (specTdp: string | undefined) => {
        return parseInt(specTdp?.replace(/\D/g, '') || '0');
    };

    // API запрос для CPU
    useEffect(() => {
        if (!openCpu || config.cpuName.length < 2) return;
        const timer = setTimeout(async () => {
            setLoadingCpu(true);
            try {
                const res = await fetch(`http://127.0.0.1:8000/hardware/cpus?search=${config.cpuName}`);
                if (res.ok) {
                    const data = await res.json();
                    setCpuResults(data.data || []);
                }
            } catch (e) { console.error(e); }
            finally { setLoadingCpu(false); }
        }, 400);
        return () => clearTimeout(timer);
    }, [config.cpuName, openCpu]);

    // API запрос для GPU
    useEffect(() => {
        if (!openGpu || config.gpuName.length < 2) return;
        const timer = setTimeout(async () => {
            setLoadingGpu(true);
            try {
                const res = await fetch(`http://127.0.0.1:8000/hardware/gpus?search=${config.gpuName}`);
                if (res.ok) {
                    const data = await res.json();
                    setGpuResults(data.data || []);
                }
            } catch (e) { console.error(e); }
            finally { setLoadingGpu(false); }
        }, 400);
        return () => clearTimeout(timer);
    }, [config.gpuName, openGpu]);

    return (
        <div className="bg-[#1E2023] border border-gray-800 rounded-3xl shadow-sm p-6 space-y-6">
            {/* Конфигурация */}
            <div>
                <SectionLabel>Конфигурация системы</SectionLabel>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-4">
                    Данные перенесены из конфигуратора или введите новые для поиска
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* CPU */}
                    <div className="rounded-3xl bg-[#141517] border border-gray-800 p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#93C5FD] bg-[#93C5FD]/10 border border-[#93C5FD]/20 px-2 py-1">CPU</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wide">Процессор</span>
                        </div>
                        
                        {/* Поиск CPU */}
                        <div className="relative">
                            <input
                                type="text"
                                value={config.cpuName}
                                onFocus={() => setOpenCpu(true)}
                                onBlur={() => setTimeout(() => setOpenCpu(false), 200)}
                                onChange={e => {
                                    setConfig({ ...config, cpuName: e.target.value });
                                    setOpenCpu(true);
                                }}
                                placeholder="Напр: AMD Ryzen 7 7700X"
                                className="w-full bg-[#0f1113] border border-gray-800 text-white text-sm px-3 py-2 focus:outline-none focus:border-[#93C5FD] transition-colors placeholder:text-slate-600"
                            />
                            {/* Выпадающий список CPU */}
                            {openCpu && config.cpuName.length >= 2 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-[#181b1f] border border-gray-800 shadow-2xl z-50 max-h-48 overflow-y-auto custom-scrollbar rounded-3xl">
                                    {loadingCpu ? (
                                        <div className="p-3 text-xs text-slate-500 text-center uppercase tracking-widest">Загрузка...</div>
                                    ) : cpuResults.length > 0 ? (
                                        cpuResults.map(item => (
                                            <div
                                                key={item.slug || item.name}
                                                // onMouseDown срабатывает до onBlur инпута
                                                onMouseDown={() => {
                                                    setConfig({ ...config, cpuName: item.name, cpuTdp: extractTdp(item.specifications?.tdp) });
                                                    setOpenCpu(false);
                                                }}
                                                className="p-3 border-b border-[#374151]/50 text-sm text-slate-300 hover:bg-[#93C5FD]/10 hover:text-white cursor-pointer transition-colors flex justify-between items-center"
                                            >
                                                <span className="truncate pr-4">{item.name}</span>
                                                <span className="text-xs text-[#93C5FD] font-mono">{extractTdp(item.specifications?.tdp)}W</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-3 text-xs text-slate-500 text-center uppercase tracking-widest">Ничего не найдено</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 uppercase tracking-wide w-8">TDP</span>
                            <input
                                type="number"
                                value={config.cpuTdp || ''}
                                onChange={e => setConfig({ ...config, cpuTdp: parseInt(e.target.value) || 0 })}
                                placeholder="Вт"
                                min={0} max={350}
                                className="w-24 bg-[#0f1113] border border-[#374151] text-[#93C5FD] text-sm px-3 py-1.5 focus:outline-none focus:border-[#93C5FD] transition-colors placeholder:text-slate-600 font-mono"
                            />
                            <span className="text-xs text-slate-600">Вт</span>
                        </div>
                    </div>

                    {/* GPU */}
                    <div className="rounded-3xl bg-[#141517] border border-gray-800 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-400/10 border border-purple-400/20 px-2 py-1">GPU</span>
                                <span className="text-xs text-slate-500 uppercase tracking-wide">Видеокарта</span>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <span className="text-[10px] text-slate-500 uppercase">Дискретная</span>
                                <div
                                    onClick={() => setConfig({ ...config, hasDiscreteGpu: !config.hasDiscreteGpu })}
                                    className={`w-10 h-5 border relative transition-all cursor-pointer ${config.hasDiscreteGpu ? 'bg-[#93C5FD]/20 border-[#93C5FD]' : 'bg-[#141517] border-gray-800'}`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 transition-all ${config.hasDiscreteGpu ? 'bg-[#93C5FD] left-5' : 'bg-slate-600 left-0.5'}`} />
                                </div>
                            </label>
                        </div>
                        
                        {config.hasDiscreteGpu ? (
                            <>
                                {/* Поиск GPU */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={config.gpuName}
                                        onFocus={() => setOpenGpu(true)}
                                        onBlur={() => setTimeout(() => setOpenGpu(false), 200)}
                                        onChange={e => {
                                            setConfig({ ...config, gpuName: e.target.value });
                                            setOpenGpu(true);
                                        }}
                                        placeholder="Напр: NVIDIA RTX 4070"
                                        className="w-full bg-[#0f1113] border border-gray-800 text-white text-sm px-3 py-2 focus:outline-none focus:border-[#93C5FD] transition-colors placeholder:text-slate-600"
                                    />
                                    {/* Выпадающий список GPU */}
                                    {openGpu && config.gpuName.length >= 2 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#181b1f] border border-gray-800 shadow-2xl z-50 max-h-48 overflow-y-auto custom-scrollbar rounded-3xl">
                                            {loadingGpu ? (
                                                <div className="p-3 text-xs text-slate-500 text-center uppercase tracking-widest">Загрузка...</div>
                                            ) : gpuResults.length > 0 ? (
                                                gpuResults.map(item => (
                                                    <div
                                                        key={item.slug || item.name}
                                                        onMouseDown={() => {
                                                            setConfig({ ...config, gpuName: item.name, gpuTdp: extractTdp(item.specifications?.tdp) });
                                                            setOpenGpu(false);
                                                        }}
                                                        className="p-3 border-b border-[#374151]/50 text-sm text-slate-300 hover:bg-purple-400/10 hover:text-white cursor-pointer transition-colors flex justify-between items-center"
                                                    >
                                                        <span className="truncate pr-4">{item.name}</span>
                                                        <span className="text-xs text-purple-400 font-mono">{extractTdp(item.specifications?.tdp)}W</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-3 text-xs text-slate-500 text-center uppercase tracking-widest">Ничего не найдено</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 uppercase tracking-wide w-8">TDP</span>
                                    <input
                                        type="number"
                                        value={config.gpuTdp || ''}
                                        onChange={e => setConfig({ ...config, gpuTdp: parseInt(e.target.value) || 0 })}
                                        placeholder="Вт"
                                        min={0} max={600}
                                        className="w-24 bg-[#0f1113] border border-[#374151] text-purple-400 text-sm px-3 py-1.5 focus:outline-none focus:border-[#93C5FD] transition-colors placeholder:text-slate-600 font-mono"
                                    />
                                    <span className="text-xs text-slate-600">Вт</span>
                                </div>
                            </>
                        ) : (
                            <div className="py-3 text-xs text-slate-600 uppercase tracking-widest text-center">
                                Встроенная графика / не задана
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Интенсивность */}
            <div>
                <SectionLabel>Профиль интенсивности использования</SectionLabel>
                <div className="grid grid-cols-3 gap-3">
                    {(Object.entries(INTENSITY_LABELS) as [IntensityLevel, typeof INTENSITY_LABELS[IntensityLevel]][]).map(([key, val]) => (
                        <div
                            key={key}
                            onClick={() => setIntensity(key)}
                            className={`cursor-pointer rounded-3xl border-2 p-4 transition-all hover:scale-[1.02] ${intensity === key ? val.color + ' border-opacity-100 bg-[#1E2023]' : 'border-gray-800 bg-[#141517] hover:border-slate-500'}`}
                        >
                            <div className={`text-xs font-black uppercase tracking-widest mb-1 ${intensity === key ? '' : 'text-slate-400'}`}>{val.label}</div>
                            <div className="text-[10px] text-slate-500 leading-relaxed">{val.description}</div>
                            {intensity === key && (
                                <div className="mt-2 text-[9px] font-bold uppercase tracking-widest opacity-70">✓ Выбрано</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}