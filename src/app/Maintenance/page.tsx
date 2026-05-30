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
        <div className="min-h-screen text-white font-sans w-full max-w-none px-6 lg:px-10 py-8">
            {/* Шапка страницы */}
            <div className="w-full max-w-screen-2xl mx-auto">
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
            <div className="w-full max-w-screen-2xl mx-auto mb-8">
                <ConfigPanel
                    config={config}
                    setConfig={setConfig}
                    intensity={intensity}
                    setIntensity={setIntensity}
                />
            </div>

            {/* Блок табов и контента */}
            <div className="w-full max-w-screen-2xl mx-auto space-y-4">
                <div className="flex items-center gap-2 border border-gray-800 rounded-3xl bg-[#141517] p-2">
                    {TABS.map((t) => {
                        const isActive = activeTab === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`flex-1 rounded-3xl px-5 py-3 text-sm font-bold tracking-wider uppercase transition ${
                                    isActive
                                        ? 'bg-[#1E2023] text-[#c084fc] shadow-inner shadow-blue-950/10'
                                        : 'bg-transparent text-slate-500 hover:text-white hover:bg-[#1E2023]/50'
                                }`}
                            >
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                <div className="bg-[#1E2023] border border-gray-800 rounded-3xl p-6 shadow-sm">
                    {activeTab === 'schedule'    && <ScheduleTab     config={config} intensity={intensity} />}
                    {activeTab === 'instructions' && <InstructionsTab config={config} intensity={intensity} />}
                    {activeTab === 'thermal'      && <ThermalTab      config={config} />}
                    {activeTab === 'export'       && <ExportTab       config={config} intensity={intensity} />}
                </div>
            </div>
        </div>
    );
}