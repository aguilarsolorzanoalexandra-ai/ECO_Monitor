import { Alert, Measurement, Tariff } from "@/types";

/**
 * Motor de Detección de Cambios y Reglas de Alerta
 * Basado en 14_Motor_de_alertas_e_IA.md
 */

export interface EcoScoreResult {
  score: number | null;
  status: "insufficient_data" | "calculated";
  component_n: number; // Penalidad nocturna / fuera de horario
  component_p: number; // Penalidad eventos de potencia
  component_t: number; // Penalidad tendencia hora abierta
  explanation: string;
}

export function clamp(x: number): number {
  return Math.min(1, Math.max(0, x));
}

/**
 * Calcula el ECO Score operacional experimental
 */
export function calculateEcoScore(
  fractionExcessOffHours: number,
  fractionExcessPowerPeaks: number,
  relativeIncreaseOpenHours: number,
  hasEnoughHistory: boolean = true
): EcoScoreResult {
  if (!hasEnoughHistory) {
    return {
      score: null,
      status: "insufficient_data",
      component_n: 0,
      component_p: 0,
      component_t: 0,
      explanation: "Necesitamos más días comparables para calcular el ECO Score.",
    };
  }

  const N = clamp(fractionExcessOffHours / 0.20);
  const P = clamp(fractionExcessPowerPeaks / 0.10);
  const T = clamp(relativeIncreaseOpenHours / 0.20);

  const score = Math.round(100 - 50 * N - 20 * P - 30 * T);

  return {
    score: Math.max(0, Math.min(100, score)),
    status: "calculated",
    component_n: N,
    component_p: P,
    component_t: T,
    explanation: "Índice experimental de consistencia operativa frente al histórico.",
  };
}

/**
 * Genera las alertas P0 detectadas sobre los datos del Kiosco Central
 */
export function detectP0Alerts(
  intervals: Measurement[],
  tariff: Tariff = { id: "demo", store_id: "kiosco-central", currency: "ARS", price_per_kwh: 150, valid_from: "", is_demo: true }
): Alert[] {
  const alerts: Alert[] = [];

  // 1. Alerta de Aumento Nocturno (ej. Días 20, 21, 22 de 02:00 a 05:00)
  // Referencia madrugada: 0,42 kW (1,26 kWh en 3 h). Observado: 0,60 kW (1,80 kWh en 3 h).
  // Exceso = 0,54 kWh · Desvío = +42,86% · Costo = ARS 81 (tarifa 150)
  alerts.push({
    id: "alt-night-spike-22",
    store_id: "kiosco-central",
    circuit_id: "general",
    rule_version: "v1.0-madrugada",
    rule_type: "night_spike",
    title: "Consumo nocturno superior al habitual",
    start: "2026-09-15T02:00:00-03:00",
    end: "2026-09-15T05:00:00-03:00",
    baseline_power_w: 420,
    observed_power_w: 600,
    deviation_percent: 42.86,
    excess_kwh: 0.54,
    estimated_cost_ars: 0.54 * tariff.price_per_kwh,
    status: "new",
    source: "simulated",
    scope_description: "Medición general: no identifica un equipo individual",
    suggested_action: "Verificá si algún equipo de frío o iluminación quedó funcionando en régimen anómalo.",
  });

  // 2. Alerta de Consumo Fuera de Horario (Luces tras cierre: 21:00 a 23:00 en días 12, 16, 22, 28)
  // Referencia 21:00–23:00: 0,42 kW. Observado: 0,636 kW (+0,216 kW). Desvío = +51,43%.
  // Exceso = 0,216 kW × 2 h = 0,432 kWh · Costo = ARS 64,80
  alerts.push({
    id: "alt-off-hours-28",
    store_id: "kiosco-central",
    circuit_id: "general",
    rule_version: "v1.0-cierre",
    rule_type: "off_hours_consumption",
    title: "Carga activa no habitual tras el cierre comercial",
    start: "2026-09-21T21:00:00-03:00",
    end: "2026-09-21T23:00:00-03:00",
    baseline_power_w: 420,
    observed_power_w: 636,
    deviation_percent: 51.43,
    excess_kwh: 0.432,
    estimated_cost_ars: 0.432 * tariff.price_per_kwh,
    status: "reviewed",
    source: "simulated",
    scope_description: "Medición general: compatible con iluminación comercial activa",
    suggested_action: "Revisá luminarias de salón o cartel que hayan quedado encendidos luego de las 21:00.",
  });

  // 3. Alerta de Potencia Elevada Sostenida (Día 24, 15:40)
  // Intervalo 188 con 4,8 kW frente a referencia de 2,2 kW.
  alerts.push({
    id: "alt-power-peak-24",
    store_id: "kiosco-central",
    circuit_id: "general",
    rule_version: "v1.0-potencia",
    rule_type: "sustained_high_power",
    title: "Pico de potencia eléctrica registrado",
    start: "2026-09-17T15:40:00-03:00",
    end: "2026-09-17T15:45:00-03:00",
    baseline_power_w: 2200,
    observed_power_w: 4800,
    deviation_percent: 118.18,
    excess_kwh: (4.8 - 2.2) * (5 / 60), // 0.217 kWh
    estimated_cost_ars: (4.8 - 2.2) * (5 / 60) * tariff.price_per_kwh,
    status: "new",
    source: "simulated",
    scope_description: "Medición general: evento puntual de demanda",
    suggested_action: "Verificá simultaneidad de arranque de compresores o artefactos de alta potencia.",
  });

  // 4. Aviso de Telemetría (Día 29: 20 min sin datos)
  alerts.push({
    id: "alt-telemetry-gap-29",
    store_id: "kiosco-central",
    circuit_id: "general",
    rule_version: "v1.0-telemetria",
    rule_type: "no_data",
    title: "Interrupción de telemetría (20 min sin lecturas)",
    start: "2026-09-22T12:00:00-03:00",
    end: "2026-09-22T12:20:00-03:00",
    baseline_power_w: 2200,
    observed_power_w: 0,
    deviation_percent: -100,
    excess_kwh: 0,
    estimated_cost_ars: 0,
    status: "closed",
    source: "simulated",
    scope_description: "Aviso de conectividad de medidor: no diagnostica corte de local",
    suggested_action: "Verificá alimentación del sensor y conexión Wi-Fi durante el período señalado.",
  });

  return alerts;
}
