import { CalcResult, CheckItem, Season } from "./types";

export function calcParams(height: number): CalcResult {
    const rawTable = Math.round(height * 0.43 * 10);
    const rawChair = Math.round(height * 0.26 * 10);
    return {
        tableHeight: Math.max(680, Math.min(800, rawTable)),
        chairHeight: Math.max(400, Math.min(550, rawChair)),
        monitorDist: Math.round(height * 0.55 * 10),
        tableStatus: rawTable < 680 ? "low" : rawTable > 800 ? "high" : "ok",
        chairStatus: rawChair < 400 ? "low" : rawChair > 550 ? "high" : "ok",
    };
}

export const initialChecks: CheckItem[] = [
    { id: "light_left", label: "Освещение падает слева от монитора",         norm: "Естественное освещение — боковое (левостороннее)",              normSource: "ГОСТ Р 50923-96, п. 5.2",     compliant: null },
    { id: "noise",      label: "Уровень шума не превышает 50 дБА",           norm: "Допустимый уровень шума — не более 50 дБА",                     normSource: "СанПиН 1.2.3685-21, табл. 5.35", compliant: null },
    { id: "mon_dist",   label: "Расстояние до экрана 600–1200 мм",           norm: "Расстояние от глаз до дисплея: 600–1200 мм",                    normSource: "СанПиН 2.2.3670-20, п. 4.4", compliant: null },
    { id: "mon_top",    label: "Верхний край монитора ≤ уровня глаз",        norm: "Экран монитора должен располагаться ниже уровня глаз",           normSource: "ГОСТ Р 50923-96, п. 5.3",     compliant: null },
    { id: "back",       label: "Спинка кресла регулируется (поясн. упор)",   norm: "Кресло должно иметь регулируемую спинку с поясничным упором",   normSource: "ГОСТ 12.2.032-78, п. 3.2",    compliant: null },
    { id: "feet",       label: "Ступни полностью стоят на полу / подставке", norm: "Ноги должны иметь опору: пол или подставка",                    normSource: "СанПиН 2.2.3670-20, п. 4.3", compliant: null },
    { id: "pc_dist",    label: "Системный блок на расстоянии ≥ 0,5 м",      norm: "Системный блок — не ближе 0,5 м от оператора (ЭМИ)",            normSource: "СанПиН 2.2.3670-20, п. 4.7", compliant: null },
    { id: "cables",     label: "Кабели убраны в кабель-каналы",              norm: "Электропроводка должна быть в защитных кожухах",                normSource: "СанПиН 2.2.3670-20, п. 4.8", compliant: null },
];

export const climateRanges: Record<Season, { tMin: number; tMax: number; hMin: number; hMax: number }> = {
    warm: { tMin: 23, tMax: 25, hMin: 40, hMax: 60 },
    cold: { tMin: 21, tMax: 23, hMin: 40, hMax: 60 },
};
