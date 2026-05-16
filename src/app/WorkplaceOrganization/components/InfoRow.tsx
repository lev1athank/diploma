export default function InfoRow({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex justify-between border-b border-[#374151] py-3 items-center gap-4">
            <span className="text-xs text-slate-400 uppercase tracking-tight whitespace-nowrap">{label}</span>
            <span className="text-sm font-medium text-slate-100 text-right truncate">{value}</span>
        </div>
    );
}
