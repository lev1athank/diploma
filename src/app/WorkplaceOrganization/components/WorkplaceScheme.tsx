import { CalcResult } from "./types";

export default function WorkplaceScheme({ calc }: { calc: CalcResult }) {
    return (
        <svg 
            viewBox="0 0 340 265" 
            width="100%" 
            className="max-w-xs mx-auto block drop-shadow-2xl"
            aria-label="Схема рабочего места"
        >
            <defs>
                <linearGradient id="deskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1f2937" />
                    <stop offset="100%" stopColor="#111827" />
                </linearGradient>
                
                <linearGradient id="monitorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e2937" />
                    <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                <filter id="shadow" x="-20%" y="-20%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur"/>
                    <feOffset dx="3" dy="5" result="offset"/>
                    <feMerge>
                        <feMergeNode in="offset"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Пол */}
            <rect x="15" y="238" width="310" height="28" fill="#1f2937" rx="6"/>
            <line x1="18" y1="242" x2="322" y2="242" stroke="#475569" strokeWidth="3" />

            {/* === СТУЛ СЛЕВА СБОКУ ОТ СТОЛА (более явно) === */}
            <g filter="url(#shadow)">
                {/* Спинка стула */}
                <rect 
                    x="32" 
                    y="135" 
                    width="16" 
                    height="58" 
                    rx="7" 
                    fill="#1e2937" 
                    stroke="#60a5fa" 
                    strokeWidth="3"
                />
                {/* Сиденье */}
                <rect 
                    x="22" 
                    y="183" 
                    width="55" 
                    height="15" 
                    rx="4" 
                    fill="#1e2937" 
                    stroke="#60a5fa" 
                    strokeWidth="3"
                />
                {/* Ножка / основание */}
                <rect 
                    x="48" 
                    y="195" 
                    width="10" 
                    height="49" 
                    rx="2" 
                    fill="#334155" 
                />
                {/* Перекладина */}
                <rect 
                    x="32" 
                    y="229" 
                    width="38" 
                    height="5" 
                    rx="2" 
                    fill="#475569"
                />
                {/* Колёсики */}
                <circle cx="33" cy="237" r="4" fill="#64748b"/>
                <circle cx="65" cy="237" r="4" fill="#64748b"/>
            </g>

            {/* === Стол === */}
            <rect 
                x="85" 
                y="157" 
                width="225" 
                height="48" 
                rx="8" 
                fill="url(#deskGrad)" 
                stroke="#60a5fa" 
                strokeWidth="2.2"
                filter="url(#shadow)"
            />

            {/* Ножки стола */}
            <rect x="125" y="198" width="7" height="48" rx="2" fill="#334155" />
            <rect x="265" y="198" width="7" height="48" rx="2" fill="#334155" />

            {/* === Монитор === */}
            <g filter="url(#shadow)">
                <rect 
                    x="125" 
                    y="65" 
                    width="118" 
                    height="84" 
                    rx="5" 
                    fill="url(#monitorGrad)" 
                    stroke="#60a5fa" 
                    strokeWidth="3"
                />
                <rect 
                    x="132" 
                    y="72" 
                    width="104" 
                    height="70" 
                    fill="#02060f" 
                />
                <rect 
                    x="137" 
                    y="77" 
                    width="54" 
                    height="13" 
                    fill="#60a5fa" 
                    opacity="0.17" 
                />
            </g>

            {/* Подставка монитора */}
            <rect x="165" y="147" width="35" height="11" rx="2" fill="#1e2937" stroke="#475569"/>
            <rect x="172" y="156" width="21" height="8" fill="#1e2937"/>

            {/* Клавиатура */}
            <rect x="145" y="167" width="82" height="13" rx="2.5" fill="#1e2937" stroke="#475569" strokeWidth="1.5"/>
            <rect x="150" y="169.5" width="72" height="4" fill="#475569" opacity="0.65"/>

            {/* ПК */}
            <rect 
                x="265" 
                y="156" 
                width="39" 
                height="73" 
                rx="5" 
                fill="#111827" 
                stroke="#475569" 
                strokeWidth="2.5"
                filter="url(#shadow)"
            />
            <rect x="271" y="164" width="27" height="4" fill="#3b82f6" opacity="0.75"/>
            <circle cx="281" cy="184" r="3.5" fill="#22d3ee"/>

            {/* === Измерения === */}

            {/* Высота стула */}
            <line x1="12" y1="184" x2="12" y2="242" stroke="#67e8f9" strokeWidth="1.4" strokeDasharray="4,3"/>
            <line x1="7" y1="184" x2="17" y2="184" stroke="#67e8f9" strokeWidth="2.2"/>
            <line x1="7" y1="242" x2="17" y2="242" stroke="#67e8f9" strokeWidth="2.2"/>
            <text x="5" y="214" fontSize="10.5" fill="#67e8f9" fontWeight="600" textAnchor="middle">
                {calc.chairHeight}
            </text>
            <text x="5" y="225" fontSize="7.5" fill="#94a3b8" textAnchor="middle">мм</text>

            {/* Высота стола */}
            <line x1="105" y1="159" x2="105" y2="242" stroke="#67e8f9" strokeWidth="1.3" strokeDasharray="4,3"/>
            <line x1="98" y1="159" x2="112" y2="159" stroke="#67e8f9" strokeWidth="2"/>
            <line x1="98" y1="242" x2="112" y2="242" stroke="#67e8f9" strokeWidth="2"/>
            <text x="92" y="200" fontSize="10" fill="#67e8f9" fontWeight="600" textAnchor="middle">
                {calc.tableHeight}
            </text>
            <text x="92" y="211" fontSize="7.5" fill="#94a3b8" textAnchor="middle">мм</text>

            {/* Расстояние до монитора */}
            <line x1="130" y1="113" x2="65" y2="113" stroke="#c084fc" strokeWidth="1.4" strokeDasharray="3,2"/>
            <polygon points="70,109 60,113 70,117" fill="#c084fc"/>
            <circle cx="55" cy="113" r="7.5" fill="#1e1b4b" stroke="#c084fc" strokeWidth="2"/>
            <text x="97" y="105" fontSize="10" fill="#c4b5fd" fontWeight="600" textAnchor="middle">
                {calc.monitorDist} мм
            </text>

            {/* Окно + свет */}
            <rect x="18" y="12" width="44" height="62" rx="4" fill="#0f172a" stroke="#fbbf24" strokeWidth="2.5"/>
            {[0,1,2,3].map(i => (
                <line 
                    key={i}
                    x1="63" y1={19 + i*13} 
                    x2={87 + i*7} y2={20 + i*14} 
                    stroke="#fcd34d" 
                    strokeWidth="1.2" 
                    strokeDasharray="2,2" 
                    opacity={0.5 - i*0.08}
                />
            ))}

            {/* Подписи */}
            <text x="40" y="83" fontSize="8.5" fill="#fcd34d" fontWeight="700" textAnchor="middle">СВЕТ</text>
            <text x="40" y="92" fontSize="7" fill="#b45309" textAnchor="middle">СЛЕВА</text>
            
            <text x="185" y="55" fontSize="9.5" fill="#bae6fd" fontWeight="700" textAnchor="middle">МОНИТОР</text>
            <text x="284" y="152" fontSize="7.5" fill="#64748b" textAnchor="middle">ПК</text>
        </svg>
    );
}