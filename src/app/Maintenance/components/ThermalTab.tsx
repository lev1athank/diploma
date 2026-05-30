import { ConfigState } from './types';
import { THERMAL_PASTES, getRecommendedPastes } from './data';
import SectionLabel from './SectionLabel';

type Props = {
    config: ConfigState;
};

const categoryLabel: Record<string, { label: string; color: string }> = {
    budget: { label: 'Бюджет',   color: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' },
    mid:    { label: 'Средний',  color: 'text-blue-400 border-blue-400/20 bg-blue-400/5' },
    high:   { label: 'Высокий',  color: 'text-purple-400 border-purple-400/20 bg-purple-400/5' },
};

export default function ThermalTab({ config }: Props) {
    const maxTdp = Math.max(config.cpuTdp || 0, config.gpuTdp || 0);
    const recommended = getRecommendedPastes(maxTdp);
    const notRecommended = maxTdp > 0 ? THERMAL_PASTES.filter(p => p.maxTdp < maxTdp) : [];

    return (
        <div className="space-y-5">
            {/* Контекст */}
            <div className="bg-[#1E2023] border border-[#374151] p-6">
                <SectionLabel>Подбор термопасты</SectionLabel>

                {maxTdp > 0 ? (
                    <div className="flex flex-wrap gap-4 mb-4 p-4 bg-[#141517] border border-[#374151]">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Макс. TDP системы:</span>
                            <span className="text-lg font-black font-mono text-[#93C5FD]">{maxTdp} Вт</span>
                        </div>
                        {config.cpuTdp > 0 && (
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-wide">
                                <span className="text-[#93C5FD]/60">CPU</span> {config.cpuTdp}W
                            </div>
                        )}
                        {config.hasDiscreteGpu && config.gpuTdp > 0 && (
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-wide">
                                <span className="text-purple-400/60">GPU</span> {config.gpuTdp}W
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mb-4 p-4 bg-[#141517] border border-[#374151] text-xs text-slate-500 uppercase tracking-widest">
                        ℹ Укажите TDP процессора в панели конфигурации для персонализированных рекомендаций
                    </div>
                )}

                {/* Рекомендованные */}
                <div className="mb-2 text-[10px] text-slate-500 uppercase tracking-widest">
                    {maxTdp > 0 ? `Подходящие для TDP ${maxTdp}+ Вт` : 'Все варианты'}
                </div>
                <div className="space-y-3 mb-6">
                    {recommended.map(paste => {
                        const cat = categoryLabel[paste.category];
                        return (
                            <div key={paste.brand} className="border border-[#374151] bg-[#141517] p-4 flex items-start gap-4 hover:border-[#93C5FD]/30 transition-colors">
                                <div className="shrink-0 text-center pt-1">
                                    <div className="text-xl font-black text-[#93C5FD] font-mono leading-none">{paste.conductivity}</div>
                                    <div className="text-[9px] text-slate-600 uppercase tracking-wide">Вт/(м·К)</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className="text-sm font-black text-white uppercase tracking-wide">{paste.brand}</span>
                                        <span className={`text-[9px] font-bold uppercase tracking-widest border px-2 py-0.5 ${cat.color}`}>{cat.label}</span>
                                        {paste.maxTdp < 999 && (
                                            <span className="text-[9px] text-slate-600 uppercase tracking-wide">до {paste.maxTdp} Вт</span>
                                        )}
                                        {paste.maxTdp >= 999 && (
                                            <span className="text-[9px] text-slate-500 uppercase tracking-wide">Без ограничений</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">{paste.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Не рекомендованные */}
                {notRecommended.length > 0 && (
                    <>
                        <div className="mb-2 text-[10px] text-slate-600 uppercase tracking-widest flex items-center gap-2">
                            <span className="text-red-500/60">✗</span> Не рекомендованы для вашего TDP
                        </div>
                        <div className="space-y-2 opacity-40">
                            {notRecommended.map(paste => (
                                <div key={paste.brand} className="border border-[#374151]/50 bg-[#141517]/50 p-3 flex items-center gap-4">
                                    <div className="shrink-0 text-center">
                                        <div className="text-base font-black text-slate-600 font-mono">{paste.conductivity}</div>
                                        <div className="text-[9px] text-slate-700 uppercase">Вт/(м·К)</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-500 uppercase">{paste.brand}</div>
                                        <div className="text-[10px] text-slate-700">до {paste.maxTdp} Вт — ниже вашего TDP</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Советы по нанесению */}
                <div className="mt-6 border border-[#374151] bg-[#141517] p-5">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                        <span className="text-blue-400">💡</span> Советы по нанесению
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { icon: '⚫', title: 'Горошина', desc: 'Капля размером с горошину в центр крышки процессора. Самый простой и надёжный метод.' },
                            { icon: '➕', title: 'Крест', desc: 'Нанесите тонкий крест по центру. Равномерно покрывает теплораспределитель CPU.' },
                            { icon: '📏', title: 'Тонкий слой', desc: 'Размажьте пластиковой карточкой тонким слоем по всей крышке. Идеально для GPU.' },
                        ].map(tip => (
                            <div key={tip.title} className="space-y-1">
                                <div className="text-sm">{tip.icon} <span className="text-xs font-black text-slate-300 uppercase tracking-wide">{tip.title}</span></div>
                                <p className="text-[10px] text-slate-500 leading-relaxed">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
