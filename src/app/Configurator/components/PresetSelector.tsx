'use client'
import React from 'react'

type Preset = any

export function PresetSelector({ presets, onSelect }: { presets: any[]; onSelect: (p: any) => void }) {
    return (
        <main className="w-full h-screen overflow-hidden flex flex-col items-center justify-center p-8 text-white bg-[#16181A]">
            <div className="mb-12 text-center">
                <div className="text-[10px] uppercase tracking-[0.4em] text-blue-400 mb-3 font-bold">PC Configurator</div>
                <h1 className="text-3xl font-black uppercase tracking-wider mb-3">Какой ПК вам нужен?</h1>
                <p className="text-gray-500 text-sm">Выберите тип сборки — мы подберём оптимальные комплектующие</p>
            </div>

            <div className="grid grid-cols-2 gap-5 w-full max-w-3xl">
                {presets.map((preset) => (
                    <div
                        key={preset.key}
                        onClick={() => onSelect(preset)}
                        className={`group cursor-pointer border-2 p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl ${preset.accent}`}
                    >
                        <div className="text-4xl mb-4">{preset.icon}</div>
                        <div className="text-base font-black uppercase tracking-wider mb-2">{preset.label}</div>
                        <div className="text-xs text-gray-400 leading-relaxed">{preset.description}</div>
                        <div className="mt-5 text-[9px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors flex items-center gap-1">
                            Начать сборку <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-[10px] text-gray-700 uppercase tracking-widest">Пресет можно изменить в любой момент</div>
        </main>
    );
}

export default PresetSelector;
