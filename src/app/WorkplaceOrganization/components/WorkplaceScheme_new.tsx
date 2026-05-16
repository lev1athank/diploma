import { CalcResult } from "./types";

export default function WorkplaceScheme({ calc }: { calc: CalcResult }) {
    return (
        <svg viewBox="0 0 680 520" width="100%" className="max-w-full mx-auto block" aria-label="Схема рабочего места">
            <defs>
                <linearGradient id="neon" x1="0" x2="1">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#93C5FD" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#000" floodOpacity="0.45"/>
                </filter>
            </defs>

            {/* surface */}
            <rect x="10" y="360" width="660" height="10" fill="#374151" rx="2" />

            {/* table legs */}
            <rect x="210" y="300" width="12" height="120" rx="2" fill="#374151" />
            <rect x="420" y="300" width="12" height="120" rx="2" fill="#374151" />

            {/* desk top */}
            <rect x="140" y="260" width="400" height="30" fill="#1E2023" stroke="url(#neon)" strokeWidth="1.2" filter="url(#soft)" />

            {/* chair (left) */}
            <g>
                <rect x="70" y="220" width="16" height="150" rx="3" fill="#374151" />
                <rect x="80" y="190" width="80" height="24" rx="4" fill="#141517" stroke="#3b82f6" strokeWidth="1" />
                <line x1="120" y1="180" x2="120" y2="370" stroke="#60A5FA" strokeWidth="1" strokeDasharray="6,4" opacity="0.85" />
                <text x="120" y="200" fontSize="18" fill="#93C5FD" textAnchor="middle">{calc.chairHeight} мм</text>
            </g>

            {/* monitor */}
            <g>
                <rect x="245" y="90" width="190" height="140" rx="6" fill="#0d1117" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" />
                <rect x="255" y="100" width="170" height="120" rx="4" fill="#0a0e14" />
                {[0,1,2,3,4].map(i => (
                    <line key={i} x1={275 + i * 30} y1="110" x2={275 + i * 30} y2="200" stroke="#1d2d44" strokeWidth="0.6" />
                ))}
                <text x="340" y="140" fontSize="16" fill="#60A5FA" textAnchor="middle">МОНИТОР</text>
                <text x="340" y="170" fontSize="14" fill="#8b5cf6" textAnchor="middle">{calc.monitorDist} мм</text>
            </g>

            {/* keyboard / tray */}
            <rect x="260" y="230" width="140" height="18" rx="3" fill="#1E2023" stroke="#3b82f6" strokeWidth="1" />

            {/* PC on right */}
            <g>
                <rect x="520" y="160" width="80" height="120" fill="#0d1117" stroke="#1d2d44" strokeWidth="1.2" />
                <circle cx="560" cy="180" r="4" fill="#3b82f6" opacity="0.9" />
                <rect x="532" y="210" width="36" height="2" fill="#1d2d44" />
                <rect x="532" y="218" width="36" height="2" fill="#1d2d44" />
                <text x="560" y="295" fontSize="12" fill="#9CA3AF" textAnchor="middle">ПК</text>
            </g>

            {/* distance indicators */}
            <line x1="200" y1="220" x2="300" y2="220" stroke="#7c3aed" strokeWidth="1" strokeDasharray="6,4" />
            <polygon points="200,216 194,220 200,224" fill="#7c3aed" />
            <polygon points="300,216 294,220 300,224" fill="#7c3aed" />
            <text x="250" y="212" fontSize="14" fill="#8b5cf6" textAnchor="middle">{calc.monitorDist} мм</text>

            {/* table height indicator */}
            <line x1="120" y1="260" x2="120" y2="420" stroke="#60A5FA" strokeWidth="1" strokeDasharray="6,4" />
            <text x="120" y="440" fontSize="18" fill="#93C5FD" textAnchor="middle">{calc.tableHeight} мм</text>

            {/* light source left */}
            <g>
                <rect x="30" y="30" width="60" height="80" rx="6" fill="#0d1117" stroke="#fbbf24" strokeWidth="1.4" />
                {[0,1,2,3].map(i => (
                    <line key={i} x1="90" y1={46 + i * 16} x2={150 + i * 8} y2={60 + i * 18} stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="3,2" opacity="0.45" />
                ))}
                <text x="60" y="125" fontSize="14" fill="#d97706" textAnchor="middle">СВЕТ</text>
                <text x="60" y="145" fontSize="12" fill="#9a591b" textAnchor="middle">СЛЕВА</text>
            </g>

        </svg>
    );
}
