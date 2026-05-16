import InfoRow from "./InfoRow";
import SectionLabel from "./SectionLabel";
import { Season } from "./types";

type Props = {
    season: Season;
    climate: { tMin: number; tMax: number; hMin: number; hMax: number };
};

export default function EnvironmentTab({ season, climate }: Props) {
    return (
        <div className="space-y-6">
            <div>
                <SectionLabel>
                    Физические факторы — {season === "warm" ? "ТЁПЛЫЙ СЕЗОН" : "ХОЛОДНЫЙ СЕЗОН"}
                </SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {[
                        { label: "Температура",  value: `${climate.tMin}–${climate.tMax}°C`, norm: `${climate.tMin}–${climate.tMax}°C`, src: "СанПиН 1.2.3685-21" },
                        { label: "Влажность",    value: `${climate.hMin}–${climate.hMax}%`,  norm: "40–60%",    src: "СанПиН 1.2.3685-21" },
                        { label: "Освещённость", value: "≥ 300 лк",                          norm: "300–500 лк", src: "СП 52.13330.2016"   },
                        { label: "Шум",          value: "≤ 50 дБА",                          norm: "50 дБА",     src: "СанПиН 1.2.3685-21" },
                    ].map(f => (
                        <div key={f.label} className="bg-[#141517] border border-[#374151] p-5 flex flex-col gap-3">
                            <h3 className="text-sm sm:text-base font-semibold text-white uppercase tracking-wide">{f.label}</h3>
                            <div className="space-y-1">
                                <InfoRow label="Норма"    value={f.value} />
                                <InfoRow label="По ГОСТ"  value={f.norm} />
                                <InfoRow label="Источник" value={f.src} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#1E2023] border border-[#374151] p-5">
                <SectionLabel>Нормы ЭМИ для ВДТ — СанПиН 1.2.3685-21</SectionLabel>
                <div className="overflow-x-auto border border-[#374151] bg-[#141517]">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#374151]">
                                { ["ПОЛЕ", "ДИАПАЗОН ЧАСТОТ", "НОРМАТИВ"].map(h => (
                                    <th key={h} className="text-left text-xs text-slate-400 uppercase tracking-widest py-3 px-4 font-semibold">{h}</th>
                                )) }
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ["Электрическое",  "5 Гц – 2 кГц",    "≤ 25 В/м"],
                                ["Электрическое",  "2 кГц – 400 кГц", "≤ 2,5 В/м"],
                                ["Магнитное",      "5 Гц – 2 кГц",    "≤ 250 нТл"],
                                ["Магнитное",      "2 кГц – 400 кГц", "≤ 25 нТл"],
                                ["Электростатич.", "—",               "≤ 15 кВ/м"],
                            ].map((row, i) => (
                                <tr key={i} className={`border-b border-[#374151]/50 ${i % 2 === 0 ? "bg-[#13151A]" : ""}`}>
                                    <td className="py-2 px-3 font-mono text-blue-100">{row[0]}</td>
                                    <td className="py-2 px-3 font-mono text-gray-400">{row[1]}</td>
                                    <td className="py-2 px-3 font-mono text-[#93C5FD] font-black">{row[2]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
