'use client'
import { useEffect, useState } from 'react';
import { ConfigState, IntensityLevel, TabId } from './components/types';
import ConfigPanel from './components/ConfigPanel';
import ScheduleTab from './components/ScheduleTab';
import InstructionsTab from './components/InstructionsTab';
import ThermalTab from './components/ThermalTab';
import ExportTab from './components/ExportTab';

const TABS: { id: TabId; label: string }[] = [
    { id: 'schedule',     label: 'РЕГЛАМЕНТ' },
    { id: 'instructions', label: 'ИНСТРУКЦИИ' },
    { id: 'thermal',      label: 'ТЕРМОПАСТА' },
    { id: 'export',       label: 'ЭКСПОРТ' },
];

const DEFAULT_CONFIG: ConfigState = {
    cpuName: '',
    cpuTdp: 0,
    gpuName: '',
    gpuTdp: 0,
    hasDiscreteGpu: true,
};

export default function MaintenancePage() {
    const [config, setConfig] = useState<ConfigState>(DEFAULT_CONFIG);
    const [intensity, setIntensity] = useState<IntensityLevel>('medium');
    const [activeTab, setActiveTab] = useState<TabId>('schedule');

    // Проверяем, активен ли первый таб, чтобы убрать скругление левого угла у папки
    const isFirstTabActive = activeTab === TABS[0].id;

    // Внутри MaintenancePage() перед return:

    useEffect(() => {
        const savedCpu = localStorage.getItem('maintenance_cpu');
        const savedGpu = localStorage.getItem('maintenance_gpu');
        
        setConfig(prev => {
            const newConfig = { ...prev };
            if (savedCpu) {
                const parsed = JSON.parse(savedCpu);
                newConfig.cpuName = parsed.name;
                newConfig.cpuTdp = parsed.tdp;
            }
            if (savedGpu) {
                const parsed = JSON.parse(savedGpu);
                newConfig.gpuName = parsed.name;
                newConfig.gpuTdp = parsed.tdp;
                newConfig.hasDiscreteGpu = true;
            }
            return newConfig;
        });
    }, []);

    return (
        <div className="min-h-screen text-white font-sans bg-[#0d0e12]">
            {/* Шапка страницы */}
            <div className="px-8 pt-8 pb-0 w-full max-w-screen-2xl mx-auto">
                <div className="mb-6">
                    <div className="text-[10px] uppercase tracking-[0.4em] text-blue-400 mb-2 font-bold">
                        Техническое обслуживание
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-wider text-white mb-1">
                        Регламент и инструкции ТО
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Персонализированное техническое обслуживание на основе вашей конфигурации
                    </p>
                </div>
            </div>

            {/* Панель конфигурации */}
            <div className="px-8 pb-6 w-full max-w-screen-2xl mx-auto">
                <ConfigPanel
                    config={config}
                    setConfig={setConfig}
                    intensity={intensity}
                    setIntensity={setIntensity}
                />
            </div>

            {/* Блок папки (Табы + Контент) */}
            <div className="px-8 pb-8 w-full max-w-screen-2xl mx-auto">
                
                {/* Вкладки (корешки папки) */}
                <div className="flex relative z-10 -mb-[1px]">
                    {TABS.map(t => {
                        const isActive = activeTab === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                // focus:outline-none убирает системную обводку при клике
                                className={`
                                    relative px-6 py-3.5 text-sm font-bold tracking-wider uppercase 
                                    rounded-t-xl transition-colors focus:outline-none border
                                    ${isActive
                                        ? 'bg-[#141517] border-[#374151] border-b-[#141517] text-[#c084fc] z-20' 
                                        : 'bg-transparent border-transparent border-b-[#374151] text-slate-500 hover:text-slate-300 hover:bg-[#141517]/50 z-10'
                                    }
                                `}
                            >
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                {/* Основное тело папки (Контент) */}
                <div className={`
                    relative z-0 bg-[#141517] border border-[#374151] p-6 shadow-2xl
                    rounded-xl ${isFirstTabActive ? 'rounded-tl-none' : ''}
                `}>
                    {activeTab === 'schedule'    && <ScheduleTab     config={config} intensity={intensity} />}
                    {activeTab === 'instructions' && <InstructionsTab config={config} intensity={intensity} />}
                    {activeTab === 'thermal'      && <ThermalTab      config={config} />}
                    {activeTab === 'export'       && <ExportTab       config={config} intensity={intensity} />}
                </div>
                
            </div>
        </div>
    );
}