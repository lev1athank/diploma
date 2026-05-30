'use client'
import { useState } from 'react';
import { ConfigState, IntensityLevel } from './types';
import { MAINTENANCE_TASKS, getInterval, isTaskApplicable } from './data';
import SectionLabel from './SectionLabel';

type Props = {
    config: ConfigState;
    intensity: IntensityLevel;
};

export default function InstructionsTab({ config, intensity }: Props) {
    const [openId, setOpenId] = useState<string | null>(null);
    const tasks = MAINTENANCE_TASKS.filter(t => isTaskApplicable(t, config));

    return (
        <div className="space-y-5">
            <div className="bg-[#141517] border border-gray-800 rounded-3xl shadow-sm p-6">
                <SectionLabel>Пошаговые инструкции по обслуживанию</SectionLabel>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-5">
                    Нажмите на работу, чтобы развернуть инструкцию
                </p>

                <div className="space-y-3">
                    {tasks.map((task, i) => {
                        const isOpen = openId === task.id;
                        const interval = getInterval(task, intensity);

                        return (
                            <div
                                key={task.id}
                                className={`overflow-hidden rounded-3xl border transition-all ${isOpen ? 'border-[#93C5FD]/40 bg-[#93C5FD]/5' : 'border-gray-800 bg-[#141517] hover:border-slate-500'}`}
                            >
                                {/* Заголовок аккордеона */}
                                <button
                                    onClick={() => setOpenId(isOpen ? null : task.id)}
                                    className="w-full flex items-center gap-4 p-4 text-left"
                                >
                                    <div className={`size-8 border grid place-items-center font-bold shrink-0 text-xs transition-all ${isOpen ? 'bg-[#93C5FD] text-black border-[#93C5FD]' : 'border-[#374151] text-slate-500'}`}>
                                        {String(i + 1).padStart(2, '0')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-white uppercase tracking-wide">{task.title}</div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{task.applicability}</div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-[10px] font-black font-mono text-[#93C5FD] hidden sm:block">{interval}</span>
                                        {task.utilityName && (
                                            <span className="text-[9px] text-purple-400 border border-purple-400/20 bg-purple-400/5 px-2 py-1 hidden sm:block uppercase tracking-wide">
                                                {task.utilityName}
                                            </span>
                                        )}
                                        <span className={`text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                                    </div>
                                </button>

                                {/* Раскрытый контент */}
                                {isOpen && (
                                    <div className="px-4 pb-5 space-y-5 border-t border-[#374151]">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                                            {/* Инструменты */}
                                            <div className="rounded-3xl bg-[#141517] border border-gray-800 p-4">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                                                    <span className="text-yellow-400">🔧</span> Инструменты
                                                </div>
                                                <ul className="space-y-1.5">
                                                    {task.tools.map((tool, j) => (
                                                        <li key={j} className="text-xs text-slate-300 flex items-start gap-2">
                                                            <span className="text-slate-600 mt-0.5 shrink-0">—</span>
                                                            {tool}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Меры безопасности */}
                                            <div className="rounded-3xl bg-[#141517] border border-red-900/30 p-4">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-3 flex items-center gap-2">
                                                    <span>⚠</span> Меры безопасности
                                                </div>
                                                <ul className="space-y-1.5">
                                                    {task.safetyNotes.map((note, j) => (
                                                        <li key={j} className="text-xs text-red-300/80 flex items-start gap-2">
                                                            <span className="text-red-600 mt-0.5 shrink-0">!</span>
                                                            {note}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Итог */}
                                            <div className="rounded-3xl bg-[#141517] border border-emerald-900/30 p-4">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-2">
                                                    <span>✓</span> Признаки успеха
                                                </div>
                                                <p className="text-xs text-emerald-300/80 leading-relaxed">{task.successCriteria}</p>
                                                {task.utilityName && (
                                                    <div className="mt-3 pt-3 border-t border-emerald-900/20">
                                                        <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-1">Утилита</div>
                                                        <span className="text-xs font-bold text-purple-400">{task.utilityName}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Порядок выполнения */}
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                                                <span className="text-blue-400">📋</span> Порядок выполнения
                                            </div>
                                            <ol className="space-y-2">
                                                {task.steps.map((step, j) => (
                                                    <li key={j} className="flex items-start gap-4">
                                                        <span className="w-6 h-6 border border-[#374151] bg-[#141517] grid place-items-center text-[10px] font-black text-slate-500 shrink-0 mt-0.5">
                                                            {j + 1}
                                                        </span>
                                                        <span className="text-sm text-slate-300 leading-relaxed">{step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
