import InfoRow from "./InfoRow";
import SectionLabel from "./SectionLabel";

export default function KnowledgeBaseTab() {
    return (
        <div className="space-y-6">
            <div className="bg-[#1E2023] border border-[#374151] p-6">
                <SectionLabel>Нормативная база</SectionLabel>
                <div className="space-y-3">
                    {[
                        { id: "СанПиН 1.2.3685-21", scope: "Гигиенические нормативы: микроклимат, шум, освещение, ЭМИ" },
                        { id: "СанПиН 2.2.3670-20", scope: "Санитарные требования к условиям труда при работе с ПК" },
                        { id: "ГОСТ Р 50923-96",    scope: "Дисплеи. Рабочее место оператора. Требования к мебели и компоновке" },
                        { id: "ГОСТ 12.2.032-78",   scope: "Рабочее место при выполнении работ сидя. Общие требования" },
                        { id: "СП 52.13330.2016",   scope: "Естественное и искусственное освещение" },
                    ].map(r => (
                        <div key={r.id} className="border border-[#374151] bg-[#141517] p-4 flex items-start gap-4">
                            <span className="text-xs font-black text-[#93C5FD] bg-[#93C5FD]/6 border border-[#93C5FD]/20 px-3 py-1.5 whitespace-nowrap uppercase tracking-wide">{r.id}</span>
                            <span className="text-sm text-slate-300 leading-relaxed pt-0.5">{r.scope}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#1E2023] border border-[#374151] p-6">
                <SectionLabel>Параметры мебели (ГОСТ)</SectionLabel>
                <div className="overflow-x-auto border border-[#374151] bg-[#141517]">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#374151]">
                                { ["ПАРАМЕТР", "НОРМА", "ФОРМУЛА", "ИСТОЧНИК"].map(h => (
                                    <th key={h} className="text-left text-xs text-slate-400 uppercase tracking-widest py-3 px-4 font-semibold">{h}</th>
                                )) }
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ["Высота стола",          "680–800 мм",   "рост × 0.43", "ГОСТ Р 50923-96"],
                                ["Высота сиденья",        "400–550 мм",   "рост × 0.26", "ГОСТ 12.2.032-78"],
                                ["Расстояние до монитора","600–1200 мм",  "рост × 0.55", "СанПиН 2.2.3670-20"],
                                ["Угол наклона монитора", "0°–30°",       "—",           "ГОСТ Р 50923-96"],
                                ["Между мониторами",      "≥ 1200 мм",   "—",           "СанПиН 2.2.3670-20"],
                            ].map((row, i) => (
                                <tr key={i} className={`border-b border-[#374151]/50 ${i % 2 === 0 ? "bg-[#13151A]" : ""}`}>
                                    <td className="py-2 px-3 text-blue-100 font-mono">{row[0]}</td>
                                    <td className="py-2 px-3 text-[#93C5FD] font-black font-mono">{row[1]}</td>
                                    <td className="py-2 px-3 text-purple-400 font-mono">{row[2]}</td>
                                    <td className="py-2 px-3 text-gray-500 font-mono">{row[3]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-[#1E2023] border border-[#374151] p-6">
                <SectionLabel>Требования к освещению</SectionLabel>
                <div className="space-y-2">
                    {[
                        ["Тип освещения",             "Комбинированное (общее + местное)"],
                        ["Освещённость при ПК",       "300–500 лк"],
                        ["Коэффициент пульсации",     "≤ 5%"],
                        ["Показатель ослеплённости",  "≤ 40"],
                        ["Расположение светильников", "Параллельно окнам, сверху или сбоку"],
                        ["Естественный свет",         "Боковое левостороннее освещение"],
                    ].map(([k, v]) => (
                        <InfoRow key={k} label={k} value={v} />
                    ))}
                </div>
            </div>
        </div>
    );
}
