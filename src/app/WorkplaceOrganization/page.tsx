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
        <div className="min-h-screen  text-white font-sans">
            <div className="border-b border-[#374151] bg-[#141517] flex">
                {TABS.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`flex-1 py-4 text-sm font-black uppercase  transition-all border-b-2 ${
                            activeTab === t.id
                                ? "border-[#93C5FD] text-[#93C5FD] bg-[#1E2023]"
                                : "border-transparent text-slate-500 hover:text-slate-300"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="px-8 py-10 w-full max-w-screen-2xl mx-auto">
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
