'use client'
import { ConfigState, IntensityLevel } from './types';
import { MAINTENANCE_TASKS, getInterval, isTaskApplicable, INTENSITY_LABELS } from './data';
import { THERMAL_PASTES, getRecommendedPastes } from './data';
import SectionLabel from './SectionLabel';

type Props = {
    config: ConfigState;
    intensity: IntensityLevel;
};

export default function ExportTab({ config, intensity }: Props) {
    const tasks = MAINTENANCE_TASKS.filter(t => isTaskApplicable(t, config));
    const intensityInfo = INTENSITY_LABELS[intensity];
    const maxTdp = Math.max(config.cpuTdp || 0, config.gpuTdp || 0);
    const recommendedPastes = getRecommendedPastes(maxTdp);

    // ── PDF через бэкенд ────────────────────────────────────────────────────
    const handleDownloadPDF = async () => {
        const body = {
            tasks: tasks.map(t => ({
                title:          t.title,
                applicability:  t.applicability,
                interval:       getInterval(t, intensity),
                base_interval:  t.baseInterval,
                high_interval:  t.highInterval,
                tools:          t.tools,
                safety:         t.safetyNotes,
                steps:          t.steps,
                success:        t.successCriteria,
                utility:        t.utilityName ?? null,
            })),
            intensity,
            cpu_name: config.cpuName || "",
            gpu_name: config.hasDiscreteGpu ? (config.gpuName || "") : "",
            thermal_pastes: recommendedPastes.map(p => ({
                brand:        p.brand,
                conductivity: p.conductivity,
                max_tdp:      p.maxTdp,
                description:  p.description,
                category:     p.category,
            })),
        };

        try {
            const res = await fetch("http://127.0.0.1:8000/maintenance/generate-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error(`Сервер вернул ${res.status}`);
            const blob = await res.blob();
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement("a");
            a.href     = url;
            a.download = "techforge_maintenance.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Не удалось скачать PDF. Проверьте работу бэкенда.");
        }
    };

    // ── CSV журнал (фронт, без бэка) ───────────────────────────────────────
    const handleDownloadJournal = () => {
        const BOM    = '\uFEFF';
        const header = 'Вид работы;Периодичность;Дата выполнения;Исполнитель;Примечания\n';
        const rows   = tasks.map(t => `${t.title};${getInterval(t, intensity)};;;`).join('\n');
        const blob   = new Blob([BOM + header + rows], { type: 'text/csv;charset=utf-8;' });
        const url    = URL.createObjectURL(blob);
        const a      = document.createElement('a');
        a.href       = url;
        a.download   = 'journal_TO.csv';
        a.click();
        URL.revokeObjectURL(url);
    };
    return (
        <div className="space-y-5">
            <div className="bg-[#1E2023] p-6 rounded-2xl">
                <SectionLabel>Экспорт документации</SectionLabel>

                {/* Превью содержимого */}
                <div className="mb-6 p-4 bg-[#141517] border border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl">
                    {[
                        { label: "Процессор",       value: config.cpuName || "—" },
                        { label: "Видеокарта",      value: config.hasDiscreteGpu && config.gpuName ? config.gpuName : "—" },
                        { label: "Профиль нагрузки", value: intensityInfo.label },
                        { label: "Видов работ",     value: String(tasks.length) },
                    ].map(({ label, value }) => (
                        <div key={label} className="space-y-1">
                            <div className="text-[9px] text-gray-400 uppercase tracking-widest">{label}</div>
                            <div className="text-xs font-black text-white truncate">{value}</div>
                        </div>
                    ))}
                </div>

                {/* Карточки файлов */}
                <div className="w-full">

                    {/* PDF */}
                    <div className="border border-gray-800 bg-[#141517] p-5 rounded-xl flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 grid place-items-center shrink-0 rounded-md">
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-xs font-black uppercase tracking-widest text-white">Регламент ТО</div>
                                <div className="text-[10px] text-gray-400 mt-0.5">PDF · Таблица + инструкции + термопасты</div>
                            </div>
                        </div>

                        <ul className="space-y-1.5">
                            {[
                                "Сводная таблица всех видов работ",
                                "Периодичность с учётом нагрузки",
                                "Пошаговые инструкции по каждой работе",
                                "Рекомендованные термопасты для вашего TDP",
                            ].map(item => (
                                <li key={item} className="flex items-start gap-2 text-[10px] text-gray-400">
                                    <span className="text-blue-400 mt-0.5 shrink-0">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={handleDownloadPDF}
                                className="flex-1 w-full border border-gray-800 rounded-xl py-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Скачать PDF
                            </button>


                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
