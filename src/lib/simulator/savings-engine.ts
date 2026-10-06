import { CombinedSavingsResult, SavingsScenarioResult, ScenarioAssumptions } from "@/types";

/**
 * Motor del Simulador de Ahorro Sin Doble Conteo
 * Basado estrictamente en 15_Simulador_de_ahorro.md
 */

export interface SimulatorInputParams {
  tariff_price_ars: number; // Por defecto 150
  lighting: {
    lamp_count: number; // defecto 12
    current_power_w: number; // defecto 18 W
    alternative_power_w: number; // defecto 9 W
    open_hours_per_day: number; // defecto 13 h
    days_per_month: number; // defecto 30 días
    night_forget_hours: number; // defecto 2 h
    night_forget_days: number; // defecto 10 noches
    apply_led_replacement: boolean;
    apply_eliminate_forget: boolean;
  };
  hvac: {
    running_power_kw: number; // defecto 1.2 kW
    hours_reduced_per_day: number; // defecto 1 h
    days_per_month: number; // defecto 26 días
    duty_cycle: number; // defecto 0.60
    apply_hvac_reduction: boolean;
  };
}

export const DEFAULT_SIMULATOR_PARAMS: SimulatorInputParams = {
  tariff_price_ars: 150,
  lighting: {
    lamp_count: 12,
    current_power_w: 18,
    alternative_power_w: 9,
    open_hours_per_day: 13,
    days_per_month: 30,
    night_forget_hours: 2,
    night_forget_days: 10,
    apply_led_replacement: true,
    apply_eliminate_forget: true,
  },
  hvac: {
    running_power_kw: 1.2,
    hours_reduced_per_day: 1,
    days_per_month: 26,
    duty_cycle: 0.60,
    apply_hvac_reduction: true,
  },
};

/**
 * Calcula los ahorros mensuales y anuales evitando el doble conteo
 */
export function calculateSavingsScenario(params: SimulatorInputParams): CombinedSavingsResult {
  const tariff = Math.max(0, params.tariff_price_ars);
  const groups: SavingsScenarioResult[] = [];

  // ==========================================
  // GRUPO 1: ILUMINACIÓN COMERCIAL
  // ==========================================
  const l = params.lighting;
  const safeLampCount = Math.max(0, l.lamp_count);
  const safeCurrentPower = Math.max(0, l.current_power_w);
  const safeAltPower = Math.max(0, l.alternative_power_w);
  const safeOpenHours = Math.max(0, l.open_hours_per_day);
  const safeDays = Math.max(0, l.days_per_month);
  const safeForgetHours = Math.max(0, l.night_forget_hours);
  const safeForgetDays = Math.max(0, l.night_forget_days);

  // E0: Consumo base mensual actual
  const basePowerKw = (safeLampCount * safeCurrentPower) / 1000;
  const baseHours = safeOpenHours * safeDays + safeForgetHours * safeForgetDays;
  const baseEnergyKwh = basePowerKw * baseHours;

  // E1: Consumo resultante con acciones aplicadas en conjunto
  const resultingPowerKw = l.apply_led_replacement
    ? (safeLampCount * safeAltPower) / 1000
    : basePowerKw;

  const resultingHours = l.apply_eliminate_forget
    ? safeOpenHours * safeDays
    : baseHours;

  const resultingEnergyKwh = resultingPowerKw * resultingHours;
  const lightingSavingsKwh = Math.max(0, baseEnergyKwh - resultingEnergyKwh);
  const lightingSavingsArs = lightingSavingsKwh * tariff;

  let lightingExplanation = "Sin modificaciones aplicadas.";
  if (l.apply_led_replacement && l.apply_eliminate_forget) {
    lightingExplanation = `Recalculado conjunto (LED + eliminar olvidos): ${resultingPowerKw.toFixed(3)} kW × ${resultingHours} h = ${resultingEnergyKwh.toFixed(2)} kWh (evita sobreestimar sumando acciones aisladas).`;
  } else if (l.apply_led_replacement) {
    lightingExplanation = `Solo reemplazo a LED (${safeAltPower} W): ahorro sobre las ${baseHours} horas habituales.`;
  } else if (l.apply_eliminate_forget) {
    lightingExplanation = `Solo control de horario de apagado: se evitan ${safeForgetHours * safeForgetDays} h de encendido innecesario.`;
  }

  groups.push({
    group_id: "lighting",
    label: "Iluminación comercial de salón",
    base_energy_kwh: Number(baseEnergyKwh.toFixed(2)),
    resulting_energy_kwh: Number(resultingEnergyKwh.toFixed(2)),
    savings_kwh: Number(lightingSavingsKwh.toFixed(2)),
    savings_ars: Number(lightingSavingsArs.toFixed(2)),
    explanation: lightingExplanation,
  });

  // ==========================================
  // GRUPO 2: CLIMATIZACIÓN (AIRE ACONDICIONADO)
  // ==========================================
  const h = params.hvac;
  const safeHvacPowerKw = Math.max(0, h.running_power_kw);
  const safeHvacHoursRed = Math.max(0, h.hours_reduced_per_day);
  const safeHvacDays = Math.max(0, h.days_per_month);
  const safeDutyCycle = Math.min(1, Math.max(0, h.duty_cycle));

  let hvacSavingsKwh = 0;
  let hvacBaseEnergyKwh = safeHvacPowerKw * 8 * safeHvacDays * safeDutyCycle; // Supuesto base nominal 8 h
  let hvacResultingEnergyKwh = hvacBaseEnergyKwh;

  if (h.apply_hvac_reduction) {
    hvacSavingsKwh = safeHvacPowerKw * safeHvacHoursRed * safeHvacDays * safeDutyCycle;
    hvacResultingEnergyKwh = Math.max(0, hvacBaseEnergyKwh - hvacSavingsKwh);
  }

  const hvacSavingsArs = hvacSavingsKwh * tariff;
  const hvacExplanation = h.apply_hvac_reduction
    ? `Ajuste de 1 h/día en ${safeHvacDays} días con ciclado térmico ${Math.round(safeDutyCycle * 100)}%: preserva confort.`
    : "Sin ajustes de climatización.";

  groups.push({
    group_id: "hvac",
    label: "Climatización (Aire Acondicionado)",
    base_energy_kwh: Number(hvacBaseEnergyKwh.toFixed(2)),
    resulting_energy_kwh: Number(hvacResultingEnergyKwh.toFixed(2)),
    savings_kwh: Number(hvacSavingsKwh.toFixed(2)),
    savings_ars: Number(hvacSavingsArs.toFixed(2)),
    explanation: hvacExplanation,
  });

  // ==========================================
  // COMBINACIÓN GLOBAL (SUMA DE GRUPOS DISJUNTOS)
  // ==========================================
  const totalMonthlyKwh = lightingSavingsKwh + hvacSavingsKwh;
  const totalMonthlyArs = lightingSavingsArs + hvacSavingsArs;

  return {
    groups,
    total_savings_kwh_month: Number(totalMonthlyKwh.toFixed(2)),
    total_savings_ars_month: Number(totalMonthlyArs.toFixed(2)),
    total_savings_kwh_year: Number((totalMonthlyKwh * 12).toFixed(2)),
    total_savings_ars_year: Number((totalMonthlyArs * 12).toFixed(2)),
    tariff_used_ars: tariff,
  };
}

/**
 * Calcula período de retorno de inversión (payback en meses)
 */
export function calculatePayback(
  initialInvestmentArs: number,
  monthlyGrossSavingsArs: number,
  monthlyRecurringCostArs: number = 0
): { netMonthlyBenefitArs: number; paybackMonths: number | null; recoverable: boolean } {
  const netMonthlyBenefitArs = monthlyGrossSavingsArs - monthlyRecurringCostArs;
  if (netMonthlyBenefitArs <= 0 || initialInvestmentArs <= 0) {
    return {
      netMonthlyBenefitArs,
      paybackMonths: null,
      recoverable: false,
    };
  }

  const paybackMonths = Math.ceil(initialInvestmentArs / netMonthlyBenefitArs);
  return {
    netMonthlyBenefitArs,
    paybackMonths,
    recoverable: true,
  };
}
