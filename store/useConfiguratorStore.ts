import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Подтяни свои типы (HardwareComponent, Filters, и т.д. пути могут немного отличаться)
import { HardwareComponent } from '../interface/specs';

export type PresetKey = 'office' | 'multimedia' | 'gaming' | 'professional' | 'all';

export interface Filters {
    cpuBrand: 'all' | 'intel' | 'amd';
    gpuBrand: 'all' | 'nvidia' | 'amd' | 'intel';
    preset: PresetKey;
}

export interface Preset {
    key: Exclude<PresetKey, 'all'>;
    label: string;
    icon: string;
    description: string;
    accent: string;
    searchDefaults: Record<string, string>;
}

export const PRESETS: Preset[] = [
    {
        key: 'office',
        label: 'Офисный ПК',
        icon: '🖥️',
        description: 'Документы, браузер, почта. Тихая и экономичная система для ежедневных задач.',
        accent: 'border-emerald-500 bg-emerald-500/10',
        searchDefaults: {
            cpus: '',
            gpus: '',
            mem: '',
            motherboard: ''
        }
    },
    {
        key: 'multimedia',
        label: 'Мультимедиа',
        icon: '🎬',
        description: 'Фото, видео, стриминг. Баланс производительности для творческих задач.',
        accent: 'border-purple-500 bg-purple-500/10',
        searchDefaults: {
            cpus: 'Core i5, Ryzen 5',
            gpus: '',
            mem: '',
            motherboard: ''
        }
    },
    {
        key: 'gaming',
        label: 'Игровой ПК',
        icon: '🎮',
        description: 'Максимальный FPS и плавный геймплей. Для требовательных современных игр.',
        accent: 'border-blue-500 bg-blue-500/10',
        searchDefaults: {
            cpus: '',
            gpus: '',
            mem: '',
            motherboard: ''
        }
    },
    {
        key: 'professional',
        label: 'Профессиональный',
        icon: '⚡',
        description: '3D, рендер, ML. Максимальная мощность для профессиональных задач.',
        accent: 'border-orange-500 bg-orange-500/10',
        searchDefaults: {
            cpus: '',
            gpus: '',
            mem: '',
            motherboard: '  '
        }
    }
];

export interface Step {
    id: 'cpu' | 'gpu' | 'mem' | 'motherboard';
    label: string;
    selected: HardwareComponent | null;
    urlTag: 'cpus' | 'gpus' | 'mem' | 'motherboard';
    lastSearch: string;
}

interface ConfiguratorState {
    selectedPreset: Preset | null;
    presets: Preset[];
    steps: Step[];
    activeIdx: number;
    search: string;
    filters: Filters;
    
    // Экшены (функции для изменения стейта)
    setSelectedPreset: (preset: Preset | null) => void;
    setSteps: (updater: Step[] | ((prev: Step[]) => Step[])) => void;
    setActiveIdx: (updater: number | ((prev: number) => number)) => void;
    setSearch: (search: string) => void;
    setFilters: (updater: Filters | ((prev: Filters) => Filters)) => void;
    setPresets: (updater: Preset[] | ((prev: Preset[]) => Preset[])) => void;
    resetConfigurator: () => void;
}

const DEFAULT_FILTERS: Filters = {
    cpuBrand: 'all',
    gpuBrand: 'all',
    preset: 'all',
};

export const useConfiguratorStore = create<ConfiguratorState>()(
    persist(
        (set) => ({
            // Начальные значения
            selectedPreset: null,
            presets: PRESETS,
            steps: [],
            activeIdx: 0,
            search: "",
            filters: DEFAULT_FILTERS,

            // Функции обновления
            setSelectedPreset: (preset) => set({ selectedPreset: preset }),
            
            setSteps: (updater) => set((state) => ({
                steps: typeof updater === 'function' ? updater(state.steps) : updater
            })),
            
            setActiveIdx: (updater) => set((state) => ({
                activeIdx: typeof updater === 'function' ? updater(state.activeIdx) : updater
            })),
            
            setSearch: (search) => set({ search }),
            
            setFilters: (updater) => set((state) => ({
                filters: typeof updater === 'function' ? updater(state.filters) : updater
            })),
            setPresets: (updater) => set((state) => ({
                presets: typeof updater === 'function' ? updater(state.presets) : updater
            })),

            resetConfigurator: () => set({
                selectedPreset: null,
                steps: [],
                activeIdx: 0,
                search: "",
                filters: DEFAULT_FILTERS
            })
        }),
        {
            name: 'pc-configurator-storage', // Имя ключа в localStorage
        }
    )
);