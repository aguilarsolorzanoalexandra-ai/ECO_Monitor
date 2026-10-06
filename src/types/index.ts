/**
 * ECO-Monitor — Tipos del Modelo de Datos
 * Basado en 12_Modelo_de_datos.md, 13_Dataset_sintetico_30_dias.md y 14_Motor_de_alertas_e_IA.md
 */

export interface Store {
  id: string;
  name: string;
  timezone: string; // ej. "America/Argentina/Buenos_Aires" (UTC-03:00)
  business_type: string; // ej. "Kiosco / Almacén"
  schedule: {
    open: string; // "08:00"
    close: string; // "21:00"
  };
}

export interface Device {
  id: string;
  store_id: string;
  model: string; // ej. "ESP32 + INA219" | "Virtual Sim Device"
  status: "online" | "offline" | "simulating";
  last_seen: string;
  credential_hash?: string;
}

export type CircuitScope = "general" | "circuito" | "individual";

export interface Circuit {
  id: string;
  device_id: string;
  label: string; // ej. "Medidor General", "Refrigeración", "Iluminación"
  scope: CircuitScope;
  essential: boolean; // ej. true para heladeras que nunca deben apagarse
}

export type AttributionSource = "medición_individual" | "circuito_compartido" | "declaración_usuario" | "simulación";

export interface Equipment {
  id: string;
  store_id: string;
  circuit_id: string;
  label: string;
  category: "refrigeracion" | "iluminacion" | "climatizacion" | "caja_servicios" | "otros";
  attribution_source: AttributionSource;
  essential: boolean;
  power_input_w: number;
  duty_cycle_assumption: number; // 0 a 1 (ej: 0.40 para compresor)
  notes?: string;
}

export type MeasurementSource = "simulated" | "measured_dc" | "measured_ac" | "derived_demo";

export type MeasurementQuality = "valid" | "missing" | "out_of_range" | "clock_uncertain" | "estimated";

export interface Measurement {
  device_id: string;
  circuit_id: string;
  boot_id: string;
  sequence: number;
  interval_start: string; // ISO 8601 UTC
  interval_seconds: number; // 300 s (5 min)
  avg_active_power_w: number | null;
  energy_wh: number | null;
  voltage_v?: number | null;
  current_a?: number | null;
  power_factor?: number | null;
  source: MeasurementSource;
  quality: MeasurementQuality;
}

export interface Tariff {
  id: string;
  store_id: string;
  currency: string; // "ARS"
  price_per_kwh: number; // Por defecto 150 en demo
  valid_from: string;
  valid_to?: string | null;
  is_demo: boolean;
  source_url?: string;
}

export type AlertRuleType =
  | "off_hours_consumption" // Consumo fuera de horario
  | "night_spike"           // Aumento nocturno (02:00–05:00)
  | "sustained_high_power"  // Potencia elevada sostenida
  | "no_data";              // Falta de lecturas / telemetría

export type AlertStatus = "new" | "reviewed" | "action_applied" | "closed";

export interface Alert {
  id: string;
  store_id: string;
  circuit_id: string;
  rule_version: string;
  rule_type: AlertRuleType;
  title: string;
  start: string;
  end: string;
  baseline_power_w: number;
  observed_power_w: number;
  deviation_percent: number;
  excess_kwh: number;
  estimated_cost_ars: number;
  status: AlertStatus;
  source: MeasurementSource;
  scope_description: string;
  suggested_action: string;
}

export interface Action {
  id: string;
  alert_id?: string;
  description: string;
  applied_at: string;
  author: string;
  notes?: string;
}

export interface ScenarioAssumptions {
  lighting?: {
    current_count: number;
    current_power_w: number;
    alternative_power_w: number;
    daily_hours: number;
    days_count: number;
    night_forget_hours: number;
    night_forget_days: number;
    apply_led: boolean;
    apply_eliminate_forget: boolean;
  };
  hvac?: {
    running_power_kw: number;
    hours_reduced: number;
    days_count: number;
    duty_cycle: number;
    apply_hvac_reduction: boolean;
  };
}

export interface SavingsScenarioResult {
  group_id: string;
  label: string;
  base_energy_kwh: number;
  resulting_energy_kwh: number;
  savings_kwh: number;
  savings_ars: number;
  explanation: string;
}

export interface CombinedSavingsResult {
  groups: SavingsScenarioResult[];
  total_savings_kwh_month: number;
  total_savings_ars_month: number;
  total_savings_kwh_year: number;
  total_savings_ars_year: number;
  tariff_used_ars: number;
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  day_index: number; // 1..30
  observed_kwh: number;
  estimated_cost_ars: number;
  coverage_percent: number;
  injected_event: string;
  valid_intervals: number;
  missing_intervals: number;
}

export type OriginBadgeType = "simulated" | "measured_dc" | "estimated";
