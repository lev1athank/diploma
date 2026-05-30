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

export interface Step {
    id: 'cpu' | 'gpu' | 'mem' | 'motherboard';
    label: string;
    selected: HardwareComponent | null;
    urlTag: 'cpus' | 'gpus' | 'mem' | 'motherboard';
    lastSearch: string;
}

interface ConfiguratorState {
    selectedPreset: Preset | null;
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