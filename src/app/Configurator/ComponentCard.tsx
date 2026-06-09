"use client"
import { CPUSpecs, GPUSpecs, MemoryData, MotherboardData, HardwareComponent } from "../../../interface/specs";

interface ComponentCardProps {
    component: HardwareComponent;
    isSelected: boolean;
    onSelect: () => void;
    isCompatible?: boolean; // Добавляем в интерфейс
}

export const ComponentCard = ({ component, isSelected, onSelect, isCompatible = true }: ComponentCardProps) => {

    const { name, specifications: specs } = component;

    const renderInfoRow = (label: string, value: string | number | undefined) => (
        <div className="flex justify-between border-b border-gray-800/40 py-1 items-center gap-2">
            <span className="text-[9px] text-gray-500 uppercase tracking-tight whitespace-nowrap">{label}</span>
            <span className="text-[11px] font-mono text-blue-100 text-right truncate">{value ?? '—'}</span>
        </div>
    );

    const detectType = (s?: any): 'cpus' | 'gpus' | 'mem' | 'motherboard' | null => {
        if (!s) return null;
        if (typeof s.cores !== 'undefined' || typeof s.threads !== 'undefined' || typeof s.clock_speed !== 'undefined') return 'cpus';
        if (typeof s.memory_size !== 'undefined' || typeof s.boost_clock !== 'undefined' || typeof s.core_clock !== 'undefined') return 'gpus';
        if (typeof s.speed !== 'undefined' && Array.isArray(s.speed)) return 'mem';
        if (typeof s.form_factor !== 'undefined' || typeof s.max_memory !== 'undefined') return 'motherboard';
        return null;
    };

    const renderContent = () => {
        if (!specs) return null;
        const type = detectType(specs);
        switch (type) {
            case 'cpus': {
                const s = specs as CPUSpecs;
                const frequencyStr = (s.clock_speed || s.turbo_speed) 
                    ? `${s.clock_speed || '—'} - ${s.turbo_speed || '—'}`
                    : undefined;
                return (
                    <>
                        {renderInfoRow("Ядра/Потоки", `${s.cores}/${s.threads}`)}
                        {frequencyStr && renderInfoRow("Частота", frequencyStr)}
                        {renderInfoRow("Сокет", s.socket)}
                        {renderInfoRow("TDP", s.tdp)}
                    </>
                );
            }
            case 'gpus': {
                const s = specs as GPUSpecs;
                const memoryDisplay = s.memory_size
                    ? (s.memory_type ? `${s.memory_size} ${s.memory_type}` : `${s.memory_size}`)
                    : undefined;
                return (
                    <>
                        {renderInfoRow("Память", memoryDisplay)}
                        {renderInfoRow("Частота", s.boost_clock)}
                        {renderInfoRow("TDP", s.tdp)}
                    </>
                );
            }
            case 'mem': {
                const s = specs as MemoryData;
                return (
                    <>
                        {renderInfoRow("Тип", `DDR${s.speed?.[0]}`)}
                        {renderInfoRow("Частота", `${s.speed?.[1]}MHz`)}
                        {renderInfoRow("Объем", `${s.modules?.[0]}x${s.modules?.[1]}GB`)}
                        {renderInfoRow("Латентность", s.cas_latency)}
                    </>
                );
            }
            case 'motherboard': {
                const s = specs as MotherboardData;
                return (
                    <>
                        {renderInfoRow("Сокет", s.socket)}
                        {renderInfoRow("Форм-фактор", s.form_factor)}
                        {renderInfoRow("Слоты RAM", s.memory_slots)}
                        {renderInfoRow("Max RAM", `${s.max_memory}GB`)}
                    </>
                );
            }
            default: return null;
        }
    };

    return (
        <div
            onClick={onSelect}
            className={`group cursor-pointer bg-[#141517] border border-gray-800 rounded-2xl p-4 flex flex-col gap-3 transition-all relative overflow-hidden shadow-sm ${!isCompatible ? "opacity-50 grayscale-[0.5]" : "hover:border-blue-400 hover:shadow-blue-950/10"} ${isSelected ? "border-blue-400" : ""}`}
        >
            {/* Плашка несовместимости */}
            {!isCompatible && (
                <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rotate-[-5deg] shadow-xl border border-white/20">
                        НЕ ПОДХОДИТ ПО СОКЕТУ
                    </div>
                </div>
            )}

            <div className="flex-1">
                <h3 className="text-[13px] font-bold text-white mb-3 leading-snug group-hover:text-blue-300 transition-colors min-h-9 line-clamp-2 pr-8">
                    {name}
                </h3>

                <div className="space-y-0.5">
                    {renderContent()}
                </div>
            </div>

            <button
                disabled={!isCompatible}
                className={`w-full py-2 text-[9px] font-black uppercase tracking-widest transition-all mt-2 ${
                    !isCompatible 
                        ? "bg-gray-900 text-gray-600 border border-gray-800 cursor-not-allowed" 
                        : isSelected ? "bg-blue-400 text-black" : "bg-gray-800/50 text-gray-400 border border-gray-700"
                }`}
            >
                {!isCompatible ? "НЕСОВМЕСТИМО" : isSelected ? "ВЫБРАНО" : "ВЫБРАТЬ"}
            </button>
        </div>
    );
};