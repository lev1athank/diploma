import SectionLabel from "./SectionLabel";
import { CheckItem } from "./types";

type Props = {
    checks: CheckItem[];
    toggleCheck: (id: string, val: boolean) => void;
    checked: number;
    passed: number;
    auditPct: number;
};

export default function AuditTab({ checks, toggleCheck, checked, passed, auditPct }: Props) {
    return (
        <div className="space-y-5">
            <div className="bg-[#1E2023] border border-[#374151] p-6">
                <SectionLabel>Интерактивный аудит рабочего места</SectionLabel>
                <p className="text-sm text-slate-300 uppercase tracking-wide mb-5">
                    Нажмите ✓ или ✗ по каждому пункту для оценки соответствия нормам
                </p>

                <div className="space-y-3">
                    {checks.map(c => (
                        <div
                            key={c.id}
                            className={`p-4 sm:p-5 flex items-start gap-4 transition-all relative overflow-hidden border ${
                                c.compliant === true  ? "bg-[#93C5FD] bg-opacity-8 border-[#93C5FD] text-[#141517]"  :
                                c.compliant === false ? "bg-red-600/6 border-red-600/30 text-red-200"   :
                                "bg-[#141517] border-[#374151]"
                            }`}
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-base sm:text-lg font-semibold text-white mb-2 leading-snug">{c.label}</p>
                                <p className="text-sm text-slate-300">
                                    {c.norm}
                                    <span className="text-[#93C5FD] ml-1">— {c.normSource}</span>
                                </p>
                                {c.compliant === false && (
                                    <div className="mt-3 border border-red-600/30 bg-red-600/10 px-3 py-2">
                                        <p className="text-xs text-red-300 font-black uppercase tracking-wide">
                                            ⚠ НАРУШЕНИЕ: {c.norm}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => toggleCheck(c.id, true)}
                                    className={`w-10 h-10 text-base font-black border transition-all ${
                                        c.compliant === true
                                            ? "bg-[#93C5FD] border-[#93C5FD] text-[#141517]"
                                            : "bg-transparent border-[#374151] text-slate-300 hover:border-[#93C5FD] hover:text-[#93C5FD]"
                                    }`}
                                >✓</button>
                                <button
                                    onClick={() => toggleCheck(c.id, false)}
                                    className={`w-10 h-10 text-base font-black border transition-all ${
                                        c.compliant === false
                                            ? "bg-red-500 border-red-500 text-white"
                                            : "bg-transparent border-[#374151] text-slate-300 hover:border-red-500 hover:text-red-300"
                                    }`}
                                >✗</button>
                            </div>
                        </div>
                    ))}
                </div>

                {checked > 0 && (
                    <div className="mt-6 p-5 bg-[#141517] border border-[#374151] flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div>
                            <div className={`text-4xl sm:text-5xl font-black ${auditPct >= 80 ? "text-[#93C5FD]" : auditPct >= 50 ? "text-amber-400" : "text-red-400"}`}>
                                {passed}<span className="text-slate-500 text-2xl">/{checked}</span>
                            </div>
                            <div className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest mt-1">ПУНКТОВ</div>
                        </div>
                        <div className="flex-1">
                            <div className="h-2.5 bg-[#13151A] w-full mb-3 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${auditPct >= 80 ? "bg-[#93C5FD]" : auditPct >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                                    style={{ width: `${auditPct}%` }}
                                />
                            </div>
                            <p className="text-sm sm:text-base text-slate-300 uppercase tracking-wide">
                                {auditPct >= 80
                                    ? "✓ РАБОЧЕЕ МЕСТО СООТВЕТСТВУЕТ НОРМАМ"
                                    : auditPct >= 50
                                    ? "⚠ НЕОБХОДИМЫ УЛУЧШЕНИЯ"
                                    : "✗ ТРЕБУЕТСЯ РЕОРГАНИЗАЦИЯ МЕСТА"}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
