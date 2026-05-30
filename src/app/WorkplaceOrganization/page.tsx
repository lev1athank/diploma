'use client'

import { useEffect, useState } from "react";
import CalculatorTab from "./components/CalculatorTab";
import AuditTab from "./components/AuditTab";
import EnvironmentTab from "./components/EnvironmentTab";
import KnowledgeBaseTab from "./components/KnowledgeBaseTab";
import { calcParams, climateRanges, initialChecks } from "./components/helpers";
import { CalcResult, CheckItem, Season, TabId } from "./components/types";

const TABS: { id: TabId; label: string }[] = [
    { id: "calc",  label: "КАЛЬКУЛЯТОР" },
    { id: "audit", label: "АУДИТ МЕСТА" },
    { id: "env",   label: "СРЕДА" },
    { id: "kb",    label: "БАЗА ЗНАНИЙ" },
];

export default function ErgonomicsModule() {
    const [height, setHeight] = useState(175);
    const [season, setSeason] = useState<Season>("cold");
    const [calc, setCalc] = useState<CalcResult>(calcParams(175));
    const [activeTab, setActiveTab] = useState<TabId>("calc");
    const [checks, setChecks] = useState<CheckItem[]>(initialChecks);

    useEffect(() => {
        setCalc(calcParams(height));
    }, [height]);

    const climate = climateRanges[season];
    const checked = checks.filter(c => c.compliant !== null).length;
    const passed = checks.filter(c => c.compliant === true).length;
    const auditPct = checked > 0 ? Math.round((passed / checked) * 100) : 0;

    const toggleCheck = (id: string, val: boolean) =>
        setChecks(prev => prev.map(c => c.id === id ? { ...c, compliant: c.compliant === val ? null : val } : c));

    return (
        <div className="min-h-screen text-white font-sans w-full max-w-none px-6 lg:px-10 py-8">
            <div className="border border-[#374151] bg-[#141517] rounded-3xl overflow-hidden shadow-sm flex">
                {TABS.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`flex-1 py-4 text-sm font-black uppercase text-center transition-all ${
                            activeTab === t.id
                                ? "border-b-4 border-[#93C5FD] bg-[#1E2023] text-[#93C5FD]"
                                : "border-b-4 border-transparent text-slate-400 hover:text-white bg-[#141517] hover:bg-[#1E2023]"
                        } ${t.id === TABS[0].id ? "rounded-l-3xl" : ""} ${t.id === TABS[TABS.length-1].id ? "rounded-r-3xl" : ""}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="mt-8 w-full max-w-screen-2xl mx-auto space-y-8">
                {activeTab === "calc" && (
                    <CalculatorTab
                        height={height}
                        setHeight={setHeight}
                        season={season}
                        setSeason={setSeason}
                        calc={calc}
                    />
                )}

                {activeTab === "audit" && (
                    <AuditTab
                        checks={checks}
                        toggleCheck={toggleCheck}
                        checked={checked}
                        passed={passed}
                        auditPct={auditPct}
                    />
                )}

                {activeTab === "env" && (
                    <EnvironmentTab season={season} climate={climate} />
                )}

                {activeTab === "kb" && <KnowledgeBaseTab />}
            </div>
        </div>
    );
}
