export type IntensityLevel = 'light' | 'medium' | 'high';

export interface ConfigState {
    cpuName: string;
    cpuTdp: number;
    gpuName: string;
    gpuTdp: number;
    hasDiscreteGpu: boolean;
}

export interface MaintenanceTask {
    id: string;
    title: string;
    applicability: string;
    baseInterval: string;
    highInterval: string;
    tools: string[];
    safetyNotes: string[];
    steps: string[];
    successCriteria: string;
    utilityName?: string;
}

export interface ThermalPaste {
    brand: string;
    conductivity: number;
    maxTdp: number;
    description: string;
    category: 'budget' | 'mid' | 'high';
}

export type TabId = 'schedule' | 'instructions' | 'thermal' | 'export';
