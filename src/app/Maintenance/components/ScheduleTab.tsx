import { ConfigState, IntensityLevel } from './types';
import { MAINTENANCE_TASKS, getInterval, isTaskApplicable } from './data';
import SectionLabel from './SectionLabel';

type Props = {
    config: ConfigState;
    intensity: IntensityLevel;
};

export default function ScheduleTab({ config, intensity }: Props) {
    const tasks = MAINTENANCE_TASKS.filter(t => isTaskApplicable(t, config));

    const intensityColor = intensity === 'high' ? 'text-blue-400' : intensity === 'medium' ? 'text-purple-400' : 'text-emerald-400';

    return (
        <div className="space-y-5">
            <div className="bg-[#141517] border border-gray-800 rounded-3xl shadow-sm p-6">
                <SectionLabel>Регламент технического обслуживания</SectionLabel>

                {/* Легенда */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <div className="rounded-3xl bg-[#141517] border border-gray-800 p-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500">
                        <span>Конфигурация:</span>
                        <span className="text-white font-bold">{config.cpuName || 'CPU не задан'}</span>
                        {config.hasDiscreteGpu && config.gpuName && (
                            <><span className="text-slate-600">+</span><span className="text-white font-bold">{config.gpuName}</span></>
                        )}
                    </div>
                    <div className="rounded-3xl bg-[#141517] border border-gray-800 p-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 ml-auto">
                        <span>Профиль:</span>
                        <span className={`font-black ${intensityColor}`}>{intensity === 'high' ? 'ВЫСОКАЯ' : intensity === 'medium' ? 'СРЕДНЯЯ' : 'ЛЁГКАЯ'}</span>
                    </div>
                </div>

                {/* Таблица */}
                <div className="overflow-x-auto rounded-3xl border border-gray-800">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#374151] bg-[#141517]">
                                {['#', 'Вид работы', 'Применимость', 'Периодичность'].map(h => (
                                    <th key={h} className="text-left text-[10px] text-slate-400 uppercase tracking-widest py-3 px-4 font-semibold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task, i) => {
                                const interval = getInterval(task, intensity);
                                const isHighFreq = intensity === 'high' && task.highInterval !== task.baseInterval;

                                return (
                                    <tr key={task.id} className={`border-b border-[#374151]/50 transition-colors hover:bg-[#93C5FD]/3 ${i % 2 === 0 ? 'bg-[#13151A]' : ''}`}>
                                        <td className="py-3 px-4 text-slate-600 font-mono text-xs">{String(i + 1).padStart(2, '0')}</td>
                                        <td className="py-3 px-4 text-slate-200 font-medium">{task.title}</td>
                                        <td className="py-3 px-4">
                                            <span className="text-[10px] text-slate-500 uppercase tracking-wide">{task.applicability}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`text-sm font-black font-mono ${isHighFreq ? 'text-blue-400' : 'text-[#93C5FD]'}`}>
                                                {interval}
                                            </span>
                                            {isHighFreq && (
                                                <span className="ml-2 text-[9px] text-blue-400/60 uppercase tracking-widest">↑ нагрузка</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Подсказка */}
                <div className="mt-4 rounded-3xl p-3 bg-[#141517] border border-gray-800 flex items-start gap-3">
                    <span className="text-blue-400 text-sm mt-0.5">ℹ</span>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide leading-relaxed">
                        {intensity === 'high'
                            ? 'При высокой нагрузке периодичность ряда работ сокращена на 25–30%. Регулярный мониторинг температур обязателен.'
                            : intensity === 'medium'
                            ? 'Стандартный регламент для повседневного использования.'
                            : 'Облегчённый режим для офисных систем с минимальной нагрузкой.'}
                    </p>
                </div>
            </div>
        </div>
    );
}
