"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { OriginBadge } from "@/components/ui/OriginBadge";
import { Button } from "@/components/ui/Button";
import { formatCurrencyARS, formatKWh, formatPercent } from "@/lib/utils";
import {
  Lightbulb,
  Snowflake,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  ShieldAlert,
  Zap,
} from "lucide-react";

interface LightingParams {
  lampCount: number;
  currentPowerW: number;
  ledPowerW: number;
  openHoursPerDay: number;
  daysPerMonth: number;
  nightForgetHours: number;
  nightForgetDays: number;
  applyLedReplacement: boolean;
  applyEliminateForget: boolean;
}

interface HvacParams {
  runningPowerKw: number;
  hoursReducedPerDay: number;
  daysPerMonth: number;
  dutyCycle: number;
  applyHvacReduction: boolean;
}

const DEFAULT_LIGHTING_PARAMS: LightingParams = {
  lampCount: 12,
  currentPowerW: 18,
  ledPowerW: 9,
  openHoursPerDay: 13,
  daysPerMonth: 30,
  nightForgetHours: 2,
  nightForgetDays: 10,
  applyLedReplacement: true,
  applyEliminateForget: true,
};

const DEFAULT_HVAC_PARAMS: HvacParams = {
  runningPowerKw: 1.2,
  hoursReducedPerDay: 1,
  daysPerMonth: 26,
  dutyCycle: 0.6,
  applyHvacReduction: true,
};

export default function SimulatorPage() {
  // Estado de los parámetros
  const [tariffPrice, setTariffPrice] = useState<number>(150);
  const [lighting, setLighting] = useState<LightingParams>(DEFAULT_LIGHTING_PARAMS);
  const [hvac, setHvac] = useState<HvacParams>(DEFAULT_HVAC_PARAMS);
  const [initialInvestment, setInitialInvestment] = useState<number>(35000); // Costo adquisición lámparas LED en ARS

  // =========================================================================
  // 1. CÁLCULO ESTRICTO DE ILUMINACIÓN (SIN DOBLE CONTEO)
  // Basado estrictamente en 15_Simulador_de_ahorro.md
  // =========================================================================
  const lightingCalculation = useMemo(() => {
    const lampCount = Math.max(1, lighting.lampCount);
    const pCurrentKw = (lampCount * lighting.currentPowerW) / 1000;
    const pLedKw = (lampCount * lighting.ledPowerW) / 1000;

    const baseOpenHours = lighting.openHoursPerDay * lighting.daysPerMonth;
    const baseForgetHours = lighting.nightForgetHours * lighting.nightForgetDays;
    const totalBaseHours = baseOpenHours + baseForgetHours;

    // E0: Consumo Base de Iluminación
    const baseEnergyKwh = pCurrentKw * totalBaseHours;

    // Escenario 1: Solo cambio a LED
    const ledOnlyEnergyKwh = pLedKw * totalBaseHours;
    const ledOnlySavingsKwh = baseEnergyKwh - ledOnlyEnergyKwh;

    // Escenario 2: Solo eliminar olvidos
    const forgetOnlyEnergyKwh = pCurrentKw * baseOpenHours;
    const forgetOnlySavingsKwh = baseEnergyKwh - forgetOnlyEnergyKwh;

    // Escenario Conjunto (E1): Ambos aplicados simultáneamente
    const resultingPowerKw = lighting.applyLedReplacement ? pLedKw : pCurrentKw;
    const resultingHours = lighting.applyEliminateForget ? baseOpenHours : totalBaseHours;
    const resultingEnergyKwh = resultingPowerKw * resultingHours;

    // Ahorro Real sin doble conteo: max(0, E0 - E1)
    const netSavingsKwh = Math.max(0, baseEnergyKwh - resultingEnergyKwh);
    const netSavingsArs = netSavingsKwh * tariffPrice;

    // Suma lineal hipotética (con doble conteo) para visualización educativa
    const linearSumSavingsKwh = ledOnlySavingsKwh + forgetOnlySavingsKwh;
    const doubleCountingErrorKwh = Math.max(0, linearSumSavingsKwh - netSavingsKwh);
    const doubleCountingErrorArs = doubleCountingErrorKwh * tariffPrice;

    return {
      basePowerKw: pCurrentKw,
      resultingPowerKw,
      baseHours: totalBaseHours,
      resultingHours,
      baseEnergyKwh,
      resultingEnergyKwh,
      netSavingsKwh,
      netSavingsArs,
      ledOnlySavingsKwh,
      forgetOnlySavingsKwh,
      linearSumSavingsKwh,
      doubleCountingErrorKwh,
      doubleCountingErrorArs,
      hasBothActive: lighting.applyLedReplacement && lighting.applyEliminateForget,
    };
  }, [lighting, tariffPrice]);

  // =========================================================================
  // 2. CÁLCULO DE CLIMATIZACIÓN (GRUPO DISJUNTO)
  // =========================================================================
  const hvacCalculation = useMemo(() => {
    const runningPower = hvac.runningPowerKw;
    const dutyCycle = hvac.dutyCycle;
    const baseHours = 8 * hvac.daysPerMonth; // 8 h de referencia de climatización comercial
    const baseEnergyKwh = runningPower * baseHours * dutyCycle;

    let savingsKwh = 0;
    if (hvac.applyHvacReduction) {
      savingsKwh = runningPower * hvac.hoursReducedPerDay * hvac.daysPerMonth * dutyCycle;
    }

    const resultingEnergyKwh = Math.max(0, baseEnergyKwh - savingsKwh);
    const savingsArs = savingsKwh * tariffPrice;

    return {
      baseEnergyKwh,
      resultingEnergyKwh,
      savingsKwh,
      savingsArs,
    };
  }, [hvac, tariffPrice]);

  // =========================================================================
  // 3. COMBINACIÓN GLOBAL (SUMA DE GRUPOS INDEPENDIENTES)
  // =========================================================================
  const totals = useMemo(() => {
    const totalBaseKwh = lightingCalculation.baseEnergyKwh + hvacCalculation.baseEnergyKwh;
    const totalResultingKwh = lightingCalculation.resultingEnergyKwh + hvacCalculation.resultingEnergyKwh;
    const totalSavingsKwh = lightingCalculation.netSavingsKwh + hvacCalculation.savingsKwh;
    const totalSavingsArs = totalSavingsKwh * tariffPrice;

    const savingsPercentage = totalBaseKwh > 0 ? (totalSavingsKwh / totalBaseKwh) * 100 : 0;

    // Amortización (Payback)
    const paybackMonths =
      totalSavingsArs > 0 && initialInvestment > 0
        ? Math.ceil(initialInvestment / totalSavingsArs)
        : null;

    return {
      totalBaseKwh,
      totalResultingKwh,
      totalSavingsKwh,
      totalSavingsArs,
      totalSavingsKwhYear: totalSavingsKwh * 12,
      totalSavingsArsYear: totalSavingsArs * 12,
      savingsPercentage,
      paybackMonths,
    };
  }, [lightingCalculation, hvacCalculation, tariffPrice, initialInvestment]);

  const handleResetDefaults = () => {
    setTariffPrice(150);
    setLighting(DEFAULT_LIGHTING_PARAMS);
    setHvac(DEFAULT_HVAC_PARAMS);
    setInitialInvestment(35000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. HEADER DE LA PÁGINA */}
      <div className="bg-white rounded-2xl border border-eco-border p-4 md:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-eco-text">
              Simulador Interactivo de Ahorro Energético
            </h1>
            <OriginBadge type="estimated" />
          </div>
          <p className="text-xs md:text-sm text-eco-muted mt-1">
            Demostración para <strong>Kiosco Central</strong> · Modelo matemático de cálculo conjunto sin doble conteo de energía.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetDefaults}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          title="Restablece los parámetros originales del modelo de demostración"
        >
          Restablecer Supuestos
        </Button>
      </div>

      {/* 2. TARJETAS DE RESULTADOS EN TIEMPO REAL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Métrica 1: Consumo Base Mensual */}
        <Card className="relative overflow-hidden border-eco-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-eco-muted uppercase tracking-wider">
              Consumo Base
            </span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl lg:text-3xl font-extrabold text-eco-text tabular-nums">
              {formatKWh(totals.totalBaseKwh)}
            </div>
            <p className="text-xs text-eco-muted mt-1">
              Consumo sin acciones de mejora
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-eco-muted">Supuesto de 30 días</span>
            <span className="font-mono text-slate-500 font-semibold">E₀</span>
          </div>
        </Card>

        {/* Métrica 2: Consumo Resultante */}
        <Card className="relative overflow-hidden border-eco-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-eco-muted uppercase tracking-wider">
              Consumo Resultante
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-eco-info">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl lg:text-3xl font-extrabold text-eco-text tabular-nums">
              {formatKWh(totals.totalResultingKwh)}
            </div>
            <p className="text-xs text-eco-muted mt-1">
              Con las acciones activadas
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-eco-muted">Recálculo conjunto</span>
            <span className="font-mono text-blue-600 font-semibold">E₁</span>
          </div>
        </Card>

        {/* Métrica 3: Ahorro Neto de Energía */}
        <Card className="relative overflow-hidden border-eco-primary-border bg-emerald-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-eco-primary uppercase tracking-wider">
              Ahorro Neto de Energía
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-100 text-eco-primary">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl lg:text-3xl font-extrabold text-eco-primary tabular-nums">
              {formatKWh(totals.totalSavingsKwh)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="font-bold text-eco-primary">
                -{formatPercent(totals.savingsPercentage)}
              </span>
              <span className="text-eco-muted">sobre el consumo base</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-emerald-100 flex items-center justify-between text-[11px]">
            <span className="text-eco-muted">kWh físicos mensuales</span>
            <span className="font-mono text-eco-primary font-bold">max(0, E₀ - E₁)</span>
          </div>
        </Card>

        {/* Métrica 4: Ahorro Económico Estimado (ARS) */}
        <Card className="relative overflow-hidden border-amber-200 bg-amber-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Ahorro Económico
            </span>
            <OriginBadge type="estimated" showTooltip={false} className="text-[10px]" />
          </div>
          <div className="mt-2.5">
            <div className="text-2xl lg:text-3xl font-extrabold text-eco-text tabular-nums">
              ~ {formatCurrencyARS(totals.totalSavingsArs)}
            </div>
            <p className="text-xs text-eco-muted mt-1">
              A tarifa base de <strong>ARS {tariffPrice}/kWh</strong>
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between text-[11px]">
            <span className="text-eco-muted">Estimación mensual</span>
            <span className="font-semibold text-amber-900">Variable puro</span>
          </div>
        </Card>
      </div>

      {/* 3. ALERTA EDUCATIVA: DEMOSTRACIÓN DE CERO DOBLE CONTEO */}
      {lightingCalculation.hasBothActive && (
        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-950 flex flex-col sm:flex-row items-start gap-3.5 shadow-xs">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-xs leading-relaxed space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-blue-900">
                Principio Anti Doble Conteo en Acción:
              </span>
              <span className="px-2 py-0.5 rounded-full font-bold bg-white text-blue-800 border border-blue-200">
                Recálculo Conjunto E₁
              </span>
            </div>
            <p>
              Si sumáramos los ahorros de forma lineal independiente:{" "}
              <strong>
                {formatKWh(lightingCalculation.ledOnlySavingsKwh)} (LED) +{" "}
                {formatKWh(lightingCalculation.forgetOnlySavingsKwh)} (Olvidos) ={" "}
                {formatKWh(lightingCalculation.linearSumSavingsKwh)}
              </strong>
              . Estaríamos <strong>sobrestimando el ahorro en {formatKWh(lightingCalculation.doubleCountingErrorKwh)}</strong> (~{formatCurrencyARS(lightingCalculation.doubleCountingErrorArs)}), porque no se puede ahorrar la potencia vieja de 18 W sobre horas que ya fueron apagadas.
            </p>
            <p className="font-semibold text-blue-900 pt-0.5">
              ✓ El modelo de ECO-Monitor calcula el estado conjunto exacto: {lightingCalculation.resultingPowerKw.toFixed(3)} kW × {lightingCalculation.resultingHours} h = {formatKWh(lightingCalculation.resultingEnergyKwh)}, entregando un ahorro real verificado de <strong>{formatKWh(lightingCalculation.netSavingsKwh)} (~{formatCurrencyARS(lightingCalculation.netSavingsArs)}/mes)</strong>.
            </p>
          </div>
        </div>
      )}

      {/* 4. CONTROLES Y PARÁMETROS DEL SIMULADOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda (2 cols): Sliders y Checkboxes */}
        <div className="lg:col-span-2 space-y-6">
          {/* GRUPO 1: ILUMINACIÓN COMERCIAL */}
          <Card>
            <CardHeader
              title="1. Parámetros de Iluminación Comercial"
              subtitle="Configurá el parque de luminarias del local, horas comerciales y olvidos nocturnos"
              action={
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-amber-50 text-amber-600">
                  <Lightbulb className="w-5 h-5" />
                </div>
              }
            />

            {/* Checkboxes Independientes */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Checkbox 1: Cambio a LED */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  lighting.applyLedReplacement
                    ? "bg-emerald-50/60 border-eco-primary-border shadow-xs"
                    : "bg-slate-50 border-eco-border hover:bg-slate-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={lighting.applyLedReplacement}
                  onChange={(e) =>
                    setLighting((prev) => ({
                      ...prev,
                      applyLedReplacement: e.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 text-eco-primary rounded focus:ring-eco-primary"
                />
                <div>
                  <span className="text-xs font-bold text-eco-text block">
                    Cambiar a iluminación LED eficiente (9 W)
                  </span>
                  <span className="text-[11px] text-eco-muted leading-tight block mt-0.5">
                    Reemplaza lámparas convencionales de 18 W por equivalentes LED de 9 W.
                  </span>
                </div>
              </label>

              {/* Checkbox 2: Eliminar Olvidos */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  lighting.applyEliminateForget
                    ? "bg-emerald-50/60 border-eco-primary-border shadow-xs"
                    : "bg-slate-50 border-eco-border hover:bg-slate-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={lighting.applyEliminateForget}
                  onChange={(e) =>
                    setLighting((prev) => ({
                      ...prev,
                      applyEliminateForget: e.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 text-eco-primary rounded focus:ring-eco-primary"
                />
                <div>
                  <span className="text-xs font-bold text-eco-text block">
                    Eliminar por completo olvidos al cierre
                  </span>
                  <span className="text-[11px] text-eco-muted leading-tight block mt-0.5">
                    Protocolo o automatización de apagado a las 21:00 hs sin encendido ocioso.
                  </span>
                </div>
              </label>
            </div>

            {/* Sliders Interactivos */}
            <div className="space-y-5 pt-2 border-t border-slate-100">
              {/* Slider 1: Cantidad de Lámparas */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-eco-text mb-2">
                  <span className="flex items-center gap-1.5">
                    <span>Cantidad de Lámparas en el Salón:</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-eco-primary font-bold tabular-nums">
                    {lighting.lampCount} unidades
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={lighting.lampCount}
                  onChange={(e) =>
                    setLighting((prev) => ({
                      ...prev,
                      lampCount: Number(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-eco-primary"
                />
                <div className="flex justify-between text-[10px] text-eco-muted mt-1 font-mono">
                  <span>1 lámpara</span>
                  <span>12 (nominal Kiosco)</span>
                  <span>40 lámparas</span>
                </div>
              </div>

              {/* Slider 2: Horas de Atención Diarias */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-eco-text mb-2">
                  <span>Horas de Atención Comercial Diarias:</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-eco-text font-bold tabular-nums">
                    {lighting.openHoursPerDay} h / día ({lighting.openHoursPerDay * lighting.daysPerMonth} h/mes)
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="18"
                  step="1"
                  value={lighting.openHoursPerDay}
                  onChange={(e) =>
                    setLighting((prev) => ({
                      ...prev,
                      openHoursPerDay: Number(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-eco-primary"
                />
                <div className="flex justify-between text-[10px] text-eco-muted mt-1 font-mono">
                  <span>6 horas</span>
                  <span>13 h (08:00 a 21:00)</span>
                  <span>18 horas</span>
                </div>
              </div>

              {/* Slider 3: Horas de Olvido Nocturno tras el cierre */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-eco-text mb-2">
                  <span>Horas de Olvido Nocturno (luces encendidas tras cierre):</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold tabular-nums">
                    {lighting.nightForgetHours} h en {lighting.nightForgetDays} noches
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="0.5"
                  value={lighting.nightForgetHours}
                  onChange={(e) =>
                    setLighting((prev) => ({
                      ...prev,
                      nightForgetHours: Number(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-eco-primary"
                />
                <div className="flex justify-between text-[10px] text-eco-muted mt-1 font-mono">
                  <span>0 h (sin olvidos)</span>
                  <span>2 h (típico post-cierre)</span>
                  <span>6 h (toda la madrugada)</span>
                </div>
              </div>

              {/* Slider 4: Frecuencia de Olvidos en el Mes */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-eco-text mb-2">
                  <span>Noches al Mes con Olvido Registrado:</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-eco-text font-bold tabular-nums">
                    {lighting.nightForgetDays} noches / mes
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={lighting.nightForgetDays}
                  onChange={(e) =>
                    setLighting((prev) => ({
                      ...prev,
                      nightForgetDays: Number(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-eco-primary"
                />
                <div className="flex justify-between text-[10px] text-eco-muted mt-1 font-mono">
                  <span>0 noches</span>
                  <span>10 noches (supuesto inicial)</span>
                  <span>30 noches (diario)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* GRUPO 2: CLIMATIZACIÓN (AIRE ACONDICIONADO) */}
          <Card>
            <CardHeader
              title="2. Grupo Climatización Comercial"
              subtitle="Potencia eléctrica media 1,2 kW con ciclado térmico de compresor al 60%"
              action={
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-blue-50 text-eco-info">
                  <Snowflake className="w-5 h-5" />
                </div>
              }
            />

            <div className="space-y-4">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  hvac.applyHvacReduction
                    ? "bg-blue-50/60 border-blue-200 shadow-xs"
                    : "bg-slate-50 border-eco-border hover:bg-slate-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={hvac.applyHvacReduction}
                  onChange={(e) =>
                    setHvac((prev) => ({
                      ...prev,
                      applyHvacReduction: e.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 text-eco-info rounded focus:ring-eco-info"
                />
                <div>
                  <span className="text-xs font-bold text-eco-text block">
                    Ajustar 1 hora de encendido en 26 días comerciales (preservando confort)
                  </span>
                  <span className="text-[11px] text-eco-muted leading-tight block mt-0.5">
                    Retrasar encendido matutino 30 min y anticipar 30 min antes del cierre:{" "}
                    <strong>{formatKWh(hvacCalculation.savingsKwh)}</strong> (~{formatCurrencyARS(hvacCalculation.savingsArs)}/mes).
                  </span>
                </div>
              </label>

              <div className="p-3 bg-slate-50 rounded-lg text-xs text-eco-muted space-y-1">
                <div className="font-semibold text-eco-text">Fórmula del grupo:</div>
                <p className="font-mono text-[11px] text-slate-600">
                  Ahorro = 1,2 kW × 1 h × 26 días × 0,60 factor de marcha = 18,72 kWh
                </p>
                <p className="text-[10px] text-slate-500">
                  * No se confunden frigorías térmicas con potencia eléctrica absorbida de línea.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Columna Derecha: Tarifa Editable, Payback y Cargas Esenciales */}
        <div className="space-y-6">
          {/* Card: Tarifa Editable */}
          <Card>
            <CardHeader
              title="Tarifa Base de Demostración"
              subtitle="Afecta a las estimaciones en pesos sin alterar los kWh físicos"
              action={<DollarSign className="w-5 h-5 text-eco-primary" />}
            />

            <div>
              <label className="block text-xs font-bold text-eco-text mb-1.5">
                Precio de la Energía (ARS / kWh)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-eco-muted font-bold text-sm">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={tariffPrice}
                  onChange={(e) => setTariffPrice(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2 border border-eco-border rounded-lg text-base font-bold tabular-nums text-eco-text focus:outline-none focus:ring-2 focus:ring-eco-primary"
                />
              </div>

              <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-[11px] text-eco-muted space-y-1">
                <div className="flex items-center justify-between">
                  <span>Sensibilidad física:</span>
                  <span className="font-semibold text-eco-text">Tarifa $0 = $0 ahorro</span>
                </div>
                <p className="text-slate-500">
                  Si la tarifa sube, el ahorro en pesos aumenta linealmente; los kWh de reducción se mantienen idénticos.
                </p>
              </div>
            </div>
          </Card>

          {/* Card: Análisis de Amortización (Payback) */}
          <Card className="bg-gradient-to-br from-white via-white to-emerald-50/40 border-eco-primary-border">
            <CardHeader
              title="Retorno de Inversión (Payback)"
              subtitle="Cálculo sobre el ahorro mensual conjunto generado"
            />

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-eco-text mb-1">
                  Inversión en Nuevas Lámparas LED (ARS):
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-eco-muted font-bold text-xs">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-7 pr-3 py-1.5 border border-eco-border rounded-lg text-xs font-bold tabular-nums text-eco-text focus:outline-none focus:ring-1 focus:ring-eco-primary"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-eco-primary-border shadow-xs">
                <div className="flex items-center justify-between text-xs text-eco-muted">
                  <span>Plazo de Recuperación:</span>
                  <OriginBadge type="estimated" showTooltip={false} className="text-[9px]" />
                </div>
                <div className="text-2xl font-extrabold text-eco-primary mt-1">
                  {totals.paybackMonths !== null
                    ? `${totals.paybackMonths} ${totals.paybackMonths === 1 ? "mes" : "meses"}`
                    : "No amortizable"}
                </div>
                <p className="text-[11px] text-eco-muted mt-1">
                  {totals.paybackMonths !== null
                    ? `La inversión de ${formatCurrencyARS(initialInvestment)} se recupera con el ahorro bruto de ${formatCurrencyARS(totals.totalSavingsArs)}/mes.`
                    : "Con los supuestos actuales no hay flujo positivo de ahorro."}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                <div className="font-semibold text-eco-text">Proyección a 12 meses constantes:</div>
                <div className="text-sm font-bold text-eco-text tabular-nums">
                  {formatKWh(totals.totalSavingsKwhYear)} · ~ {formatCurrencyARS(totals.totalSavingsArsYear)} / año
                </div>
                <p className="text-[10px] text-slate-500">
                  Condicionado a hábitos de apertura y tarifas estables.
                </p>
              </div>
            </div>
          </Card>

          {/* Card: Protección de Cargas Esenciales */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Protección de Cargas Esenciales</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Los equipos de <strong>refrigeración continua</strong> (heladeras exhibidoras de bebidas y freezers) se excluyen por diseño de recomendaciones de apagado o desconexión nocturna, preservando la cadena de frío y mercadería del comercio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
