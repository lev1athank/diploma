import InfoRow from "./InfoRow";
import SectionLabel from "./SectionLabel";
import WorkplaceScheme from "./WorkplaceScheme";
import { CalcResult, Season } from "./types";

type Props = {
    height: number;
    setHeight: (value: number) => void;
    season: Season;
    setSeason: (value: Season) => void;
    calc: CalcResult;
};

export default function CalculatorTab({ height, setHeight, season, setSeason, calc }: Props) {
    return (
        <div className="grid gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
                <div className="space-y-6">
                    <div className="bg-[#141517] border border-gray-800 rounded-3xl shadow-sm p-6">
                        <SectionLabel>Входные данные</SectionLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="text-xs text-slate-400 uppercase tracking-[0.35em] mb-3">Рост пользователя (см)</div>
                                <div className="flex items-center gap-3 mb-4">
                                    <input
                                        type="number"
                                        min={140}
                                        max={220}
                                        value={height}
                                        onChange={e => setHeight(Number(e.target.value))}
                                        className="w-24 bg-[#141517] border border-[#374151] text-white text-sm font-semibold px-3 py-3 focus:border-[#93C5FD] focus:outline-none"
                                    />
                                    <span className="text-xs text-slate-400 uppercase tracking-[0.35em]">СМ</span>
                                </div>
                                <input
                                    type="range"
                                    min={140}
                                    max={220}
                                    value={height}
                                    step={1}
                                    onChange={e => setHeight(Number(e.target.value))}
                                    className="w-full accent-[#93C5FD] h-2 cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-3">
                                    <span>140</span><span>220</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase tracking-[0.35em] mb-3">Сезон</div>
                                <div className="grid grid-cols-2 gap-3">
                                    {(["warm", "cold"] as const).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setSeason(s)}
                                            className={`py-3 text-sm font-black uppercase tracking-[0.25em] transition-all border ${
                                                season === s
                                                    ? "bg-[#93C5FD] text-[#141517] border-[#93C5FD]"
                                                    : "bg-[#141517] text-slate-300 border-[#374151] hover:border-[#93C5FD] hover:text-white"
                                            }`}
                                        >
                                            {s === "warm" ? "ТЁПЛЫЙ" : "ХОЛОДНЫЙ"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#141517] border border-gray-800 rounded-3xl shadow-sm p-6">
                        <SectionLabel>Расчётные параметры мебели</SectionLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { label: "Высота стола",   value: calc.tableHeight, unit: "мм", range: "ГОСТ: 680–800 мм",    status: calc.tableStatus, src: "ГОСТ Р 50923-96" },
                                { label: "Высота сиденья", value: calc.chairHeight, unit: "мм", range: "ГОСТ: 400–550 мм",    status: calc.chairStatus, src: "ГОСТ 12.2.032-78" },
                                { label: "До монитора",    value: calc.monitorDist, unit: "мм", range: "СанПиН: 600–1200 мм", status: "ok" as const,    src: "СанПиН 2.2.3670-20" },
                            ].map(m => (
                                <div key={m.label} className="bg-[#141517] border border-[#374151] p-5 flex flex-col gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-[0.2em]">{m.label}</h3>
                                        <div className="space-y-3">
                                            <InfoRow label="Значение" value={`${m.value} ${m.unit}`} />
                                            <InfoRow label="Норма"    value={m.range} />
                                            <InfoRow label="Источник" value={m.src} />
                                        </div>
                                    </div>
                                    <div className={`w-full py-3 text-xs font-black uppercase tracking-[0.3em] text-center ${
                                        m.status === "ok"
                                            ? "bg-[#93C5FD] text-[#141517]"
                                            : "bg-[#141517] text-[#93C5FD] border border-[#374151]"
                                    }`}>
                                        {m.status === "ok" ? "В НОРМЕ" : m.status === "low" ? "НИЖЕ ГОСТ" : "ВЫШЕ ГОСТ"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#141517] border border-gray-800 rounded-3xl shadow-sm p-6">
                        <SectionLabel>Снижение ЭМИ и шума</SectionLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { tip: "Системный блок — не ближе 0,5 м от оператора, под стол или сбоку",     ref: "СанПиН 2.2.3670-20" },
                                { tip: "Все кабели убрать в кабель-каналы вдоль плинтусов / ножки стола",       ref: "ПУЭ" },
                                { tip: "Мониторы не напротив друг друга — расстояние между ними ≥ 1,2 м",       ref: "СанПиН 2.2.3670-20" },
                                { tip: "Системный блок в закрытый корпус, виброгасящие подставки под него",     ref: "СанПиН 1.2.3685-21" },
                            ].map((t, i) => (
                                <div key={i} className="rounded-3xl border border-gray-800 bg-[#141517] p-4 flex flex-col gap-3 shadow-sm">
                                    <p className="text-sm text-slate-100 leading-relaxed">{t.tip}</p>
                                    <span className="text-xs text-slate-400 uppercase tracking-[0.25em]">{t.ref}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-[#141517] border border-gray-800 rounded-3xl shadow-sm p-6">
                        <SectionLabel>Схема рабочего места</SectionLabel>
                        <WorkplaceScheme calc={calc} />
                        <div className="flex flex-wrap gap-4 justify-center mt-5 pt-5 border-t border-gray-800">
                            {[
                                { color: "bg-[#93C5FD]", label: "Высота стола" },
                                { color: "bg-[#60A5FA]", label: "Высота стула" },
                                { color: "bg-[#8B5CF6]", label: "До монитора" },
                                { color: "bg-[#38BDF8]", label: "Освещение (слева)" },
                            ].map(l => (
                                <div key={l.label} className="flex items-center gap-2">
                                    <div className={`w-5 h-1 ${l.color}`} />
                                    <span className="text-xs text-slate-400 uppercase tracking-[0.25em]">{l.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
