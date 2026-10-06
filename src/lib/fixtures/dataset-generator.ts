import { DailySummary, Measurement } from "@/types";

/**
 * Tabla exacta de resúmenes diarios verificados en 13_Dataset_sintetico_30_dias.md
 * Total observado válido: 810.41444 kWh · ARS 121.562,17 · 8.636 válidos y 4 ausentes.
 */
export const SYNTHETIC_DAILY_SUMMARIES: DailySummary[] = [
  { day_index: 1,  date: "2026-08-25", observed_kwh: 27.834, estimated_cost_ars: 4175.09, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 2,  date: "2026-08-26", observed_kwh: 27.815, estimated_cost_ars: 4172.28, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 3,  date: "2026-08-27", observed_kwh: 27.794, estimated_cost_ars: 4169.06, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 4,  date: "2026-08-28", observed_kwh: 27.822, estimated_cost_ars: 4173.31, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 5,  date: "2026-08-29", observed_kwh: 26.627, estimated_cost_ars: 3994.02, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 6,  date: "2026-08-30", observed_kwh: 23.146, estimated_cost_ars: 3471.88, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 7,  date: "2026-08-31", observed_kwh: 27.822, estimated_cost_ars: 4173.23, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 8,  date: "2026-09-01", observed_kwh: 27.797, estimated_cost_ars: 4169.60, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 9,  date: "2026-09-02", observed_kwh: 27.820, estimated_cost_ars: 4172.97, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 10, date: "2026-09-03", observed_kwh: 27.735, estimated_cost_ars: 4160.22, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 11, date: "2026-09-04", observed_kwh: 27.802, estimated_cost_ars: 4170.37, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 12, date: "2026-09-05", observed_kwh: 27.088, estimated_cost_ars: 4063.25, coverage_percent: 100.0, injected_event: "luces tras cierre", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 13, date: "2026-09-06", observed_kwh: 23.207, estimated_cost_ars: 3481.08, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 14, date: "2026-09-07", observed_kwh: 27.827, estimated_cost_ars: 4174.02, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 15, date: "2026-09-08", observed_kwh: 27.811, estimated_cost_ars: 4171.64, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 16, date: "2026-09-09", observed_kwh: 28.250, estimated_cost_ars: 4237.52, coverage_percent: 100.0, injected_event: "luces tras cierre", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 17, date: "2026-09-10", observed_kwh: 27.787, estimated_cost_ars: 4167.97, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 18, date: "2026-09-11", observed_kwh: 27.790, estimated_cost_ars: 4168.43, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 19, date: "2026-09-12", observed_kwh: 26.664, estimated_cost_ars: 3999.62, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 20, date: "2026-09-13", observed_kwh: 23.716, estimated_cost_ars: 3557.35, coverage_percent: 100.0, injected_event: "aumento nocturno", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 21, date: "2026-09-14", observed_kwh: 28.378, estimated_cost_ars: 4256.72, coverage_percent: 100.0, injected_event: "aumento nocturno", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 22, date: "2026-09-15", observed_kwh: 28.769, estimated_cost_ars: 4315.34, coverage_percent: 100.0, injected_event: "luces tras cierre, aumento nocturno", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 23, date: "2026-09-16", observed_kwh: 27.862, estimated_cost_ars: 4179.24, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 24, date: "2026-09-17", observed_kwh: 28.063, estimated_cost_ars: 4209.46, coverage_percent: 100.0, injected_event: "potencia elevada", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 25, date: "2026-09-18", observed_kwh: 24.325, estimated_cost_ars: 3648.70, coverage_percent: 100.0, injected_event: "jornada reducida sintética", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 26, date: "2026-09-19", observed_kwh: 26.673, estimated_cost_ars: 4000.98, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 27, date: "2026-09-20", observed_kwh: 23.115, estimated_cost_ars: 3467.31, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 28, date: "2026-09-21", observed_kwh: 28.153, estimated_cost_ars: 4222.99, coverage_percent: 100.0, injected_event: "luces tras cierre", valid_intervals: 288, missing_intervals: 0 },
  { day_index: 29, date: "2026-09-22", observed_kwh: 27.087, estimated_cost_ars: 4063.12, coverage_percent: 98.61,  injected_event: "20 min sin datos", valid_intervals: 284, missing_intervals: 4 },
  { day_index: 30, date: "2026-09-23", observed_kwh: 27.836, estimated_cost_ars: 4175.41, coverage_percent: 100.0, injected_event: "normal", valid_intervals: 288, missing_intervals: 0 },
];

/**
 * Generador de pseudoaleatorios mulberry32 determinista
 */
function createPrng(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Genera los 288 intervalos de 5 minutos para un día específico según 13_Dataset_sintetico_30_dias.md
 */
export function generateDayIntervals(dayIndex: number): Measurement[] {
  const summary = SYNTHETIC_DAILY_SUMMARIES[dayIndex - 1];
  if (!summary) return [];

  const dateStr = summary.date; // YYYY-MM-DD
  const dateObj = new Date(`${dateStr}T00:00:00-03:00`);
  const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
  const isSaturday = dayOfWeek === 6;
  const isSunday = dayOfWeek === 0;

  const prng = createPrng(2026 + dayIndex * 1000);
  const intervals: Measurement[] = [];

  for (let b = 0; b < 288; b++) {
    const hour = b / 12;
    const intervalMinute = (b % 12) * 5;
    const intervalHour = Math.floor(hour);
    const timeFormatted = `${String(intervalHour).padStart(2, "0")}:${String(intervalMinute).padStart(2, "0")}`;
    const isoStart = `${dateStr}T${timeFormatted}:00-03:00`;

    // 1. Potencia base nominal según tabla horaria
    let nominalKw = 0.42;
    if (hour >= 8 && hour < 12) nominalKw = 1.45;
    else if (hour >= 12 && hour < 17) nominalKw = 2.20;
    else if (hour >= 17 && hour < 21) nominalKw = 1.60;
    else nominalKw = 0.42;

    // 2. Factores de fin de semana durante apertura (08:00 - 21:00)
    let powerKw = nominalKw;
    if (hour >= 8 && hour < 21) {
      if (isSaturday) powerKw *= 0.95;
      if (isSunday) powerKw *= 0.80;
      if (dayIndex === 25) powerKw *= 0.85; // Jornada reducida sintética
    }

    // 3. Ruido uniforme suave (0.97 a 1.03)
    const noise = 0.97 + 0.06 * prng();
    powerKw *= noise;

    // 4. Inyección de eventos
    // Luces tras cierre: +0.216 kW de 21:00 a 23:00 (b=252..275) en días 12, 16, 22, 28
    if ([12, 16, 22, 28].includes(dayIndex) && hour >= 21 && hour < 23) {
      powerKw += 0.216;
    }

    // Aumento nocturno: +0.18 kW de 02:00 a 05:00 (b=24..59) en días 20, 21, 22
    if ([20, 21, 22].includes(dayIndex) && hour >= 2 && hour < 5) {
      powerKw += 0.18;
    }

    // Potencia elevada: Día 24, intervalo 188 (15:40) -> 4.8 kW
    if (dayIndex === 24 && b === 188) {
      powerKw = 4.8;
    }

    // 5. Día 29, intervalos 144 a 147 (12:00–12:20): calidad 'missing'
    const isMissing = dayIndex === 29 && b >= 144 && b <= 147;

    const powerW = isMissing ? null : Math.round(powerKw * 1000 * 1000) / 1000;
    const energyWh = powerW !== null ? Math.round((powerW / 12) * 100000) / 100000 : null;

    intervals.push({
      device_id: "demo-kiosco-01",
      circuit_id: "general",
      boot_id: "fixture-v1",
      sequence: (dayIndex - 1) * 288 + b,
      interval_start: isoStart,
      interval_seconds: 300,
      avg_active_power_w: powerW,
      energy_wh: energyWh,
      voltage_v: null,
      current_a: null,
      power_factor: null,
      source: "simulated",
      quality: isMissing ? "missing" : "valid",
    });
  }

  return intervals;
}
