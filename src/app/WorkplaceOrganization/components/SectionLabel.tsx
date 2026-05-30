export default function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-4 rounded-full bg-blue-400" />
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.35em] text-slate-300">{children}</span>
        </div>
    );
}
