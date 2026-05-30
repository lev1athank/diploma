'use client'
import { ConfigState, IntensityLevel } from './types';
import { MAINTENANCE_TASKS, getInterval, isTaskApplicable, INTENSITY_LABELS } from './data';
import SectionLabel from './SectionLabel';

type Props = {
    config: ConfigState;
    intensity: IntensityLevel;
};

export default function ExportTab({ config, intensity }: Props) {
    const tasks = MAINTENANCE_TASKS.filter(t => isTaskApplicable(t, config));
    const intensityInfo = INTENSITY_LABELS[intensity];

    // Генерация XLSX-подобного CSV для журнала
    const handleDownloadJournal = () => {
        const BOM = '\uFEFF';
        const header = 'Вид работы;Периодичность;Дата выполнения;Исполнитель;Примечания\n';
        const rows = tasks.map(t =>
            `${t.title};${getInterval(t, intensity)};;;`
        ).join('\n');
        const csv = BOM + header + rows;
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'journal_TO.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Генерация HTML → PDF через print
    const handleDownloadPDF = () => {
        const intensityLabel = { light: 'Лёгкая', medium: 'Средняя', high: 'Высокая' }[intensity];
        const now = new Date().toLocaleDateString('ru-RU');

        const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Регламент ТО</title>
<style>
  body { font-family: Arial, sans-serif; margin: 40px; color: #1a1a1a; font-size: 12px; }
  h1 { font-size: 18px; margin-bottom: 4px; }
  .meta { color: #555; font-size: 11px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { background: #1e3a5f; color: white; text-align: left; padding: 8px 10px; font-size: 11px; text-transform: uppercase; }
  td { padding: 7px 10px; border-bottom: 1px solid #ddd; }
  tr:nth-child(even) { background: #f5f8ff; }
  .interval { font-weight: bold; color: #1e3a5f; }
  h2 { font-size: 14px; margin-top: 28px; border-bottom: 2px solid #1e3a5f; padding-bottom: 4px; }
  .instruction { margin-bottom: 16px; page-break-inside: avoid; }
  .instruction h3 { font-size: 12px; margin-bottom: 6px; }
  .instruction ol { margin: 0; padding-left: 18px; }
  .instruction li { margin-bottom: 3px; }
  @media print { body { margin: 20px; } }
</style>
</head>
<body>
<h1>TECHFORGE — Регламент технического обслуживания ПК</h1>
<div class="meta">
  Дата: ${now} &nbsp;|&nbsp;
  ${config.cpuName ? 'CPU: ' + config.cpuName : 'CPU не задан'}
  ${config.hasDiscreteGpu && config.gpuName ? ' | GPU: ' + config.gpuName : ''}
  &nbsp;|&nbsp; Профиль: ${intensityLabel}
</div>

<h2>Сводный регламент</h2>
<table>
  <thead><tr><th>#</th><th>Вид работы</th><th>Применимость</th><th>Периодичность</th></tr></thead>
  <tbody>
    ${tasks.map((t, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${t.title}</td>
      <td>${t.applicability}</td>
      <td class="interval">${getInterval(t, intensity)}</td>
    </tr>`).join('')}
  </tbody>
</table>

<h2>Инструкции по выполнению</h2>
${tasks.map((t, i) => `
<div class="instruction">
  <h3>${i + 1}. ${t.title} — ${getInterval(t, intensity)}</h3>
  <b>Инструменты:</b> ${t.tools.join(', ')}<br>
  <b>Порядок выполнения:</b>
  <ol>${t.steps.map(s => `<li>${s}</li>`).join('')}</ol>
  <b>Признаки успеха:</b> ${t.successCriteria}
</div>`).join('')}

<p style="margin-top:40px; color:#888; font-size:10px;">Сгенерировано TECHFORGE · ${now}</p>
</body></html>`;

        const win = window.open('', '_blank');
        if (win) {
            win.document.write(html);
            win.document.close();
            win.focus();
            setTimeout(() => win.print(), 500);
        }
    };

    return (
        <div className="space-y-5">
            <div className="bg-[#1E2023] rounded-3xl shadow-sm p-6">
                <SectionLabel>Экспорт документации</SectionLabel>

                {/* Превью */}
                <div className="mb-6 rounded-3xl p-4 bg-[#141517] border border-gray-800 space-y-2">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Содержимое документа</div>
                    <div className="flex justify-between text-sm border-b border-[#374151]/50 pb-2">
                        <span className="text-slate-400">Конфигурация</span>
                        <span className="text-white font-mono text-xs">{config.cpuName || '—'}{config.hasDiscreteGpu && config.gpuName ? ' + ' + config.gpuName : ''}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-[#374151]/50 pb-2">
                        <span className="text-slate-400">Профиль нагрузки</span>
                        <span className={`font-black text-xs uppercase ${intensityInfo.color.split(' ')[2]}`}>{intensityInfo.label}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-[#374151]/50 pb-2">
                        <span className="text-slate-400">Видов работ</span>
                        <span className="text-[#93C5FD] font-black font-mono">{tasks.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Пошаговых инструкций</span>
                        <span className="text-[#93C5FD] font-black font-mono">{tasks.length}</span>
                    </div>
                </div>

                {/* Кнопки */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-3xl border border-gray-800 p-5 space-y-3 bg-[#141517]">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                                <div className="text-xs font-black uppercase tracking-widest text-white">Регламент ТО</div>
                                <div className="text-[10px] text-slate-500">Таблица + инструкции</div>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                            Сводная таблица видов работ, периодичность с учётом нагрузки, пошаговые инструкции по каждой работе.
                        </p>
                        <button
                            onClick={handleDownloadPDF}
                            className="w-full border border-gray-700 py-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Скачать PDF
                        </button>
                    </div>

                    <div className="rounded-3xl border border-gray-800 p-5 space-y-3 bg-[#141517]">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M3 14h18M10 3v18M14 3v18M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                            </svg>
                            <div>
                                <div className="text-xs font-black uppercase tracking-widest text-white">Журнал ТО</div>
                                <div className="text-[10px] text-slate-500">Шаблон для учёта работ</div>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                            Таблица для ведения журнала выполненных работ: вид работы, дата, исполнитель, примечания.
                        </p>
                        <button
                            onClick={handleDownloadJournal}
                            className="w-full border border-gray-700 py-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Скачать CSV (Excel)
                        </button>
                    </div>
                </div>

                <div className="mt-4 rounded-3xl p-3 bg-[#141517] border border-gray-800 flex items-start gap-3">
                    <span className="text-blue-400 text-sm mt-0.5">ℹ</span>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide leading-relaxed">
                        PDF открывается в новой вкладке с диалогом печати. CSV открывается в Excel/LibreOffice Calc — при открытии выбирайте разделитель «точка с запятой».
                    </p>
                </div>
            </div>
        </div>
    );
}
