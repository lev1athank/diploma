export interface CalcResult {
    tableHeight: number;
    chairHeight: number;
    monitorDist: number;
    tableStatus: "ok" | "low" | "high";
    chairStatus: "ok" | "low" | "high";
}

export interface CheckItem {
    id: string;
    label: string;
    norm: string;
    normSource: string;
    compliant: boolean | null;
}

export type Season = "warm" | "cold";
export type TabId = "calc" | "audit" | "env" | "kb";
