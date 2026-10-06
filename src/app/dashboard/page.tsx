"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { OriginBadge } from "@/components/ui/OriginBadge";
import { Button } from "@/components/ui/Button";
import { PowerChart24h } from "@/components/dashboard/PowerChart24h";
import {
  generateDayIntervals,
  SYNTHETIC_DAILY_SUMMARIES,
} from "@/lib/fixtures/dataset-generator";
import {
  formatCurrencyARS,
  formatKWh,
  formatPercent,
  formatPower,
} from "@/lib/utils";
import {
  Zap,
  AlertTriangle,
  ArrowRight,
  Coins,
  Calendar,
  Store,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Layers,
} from "lucide-react";

export default function DashboardPage() {
  // Selector de día del fixture (por defecto el Día 22 que contiene múltiples eventos, o Día 30)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(22);
  const [activeIntervalIndex, setActiveIntervalIndex] = useState<number>(254); // ~21:10 hs por defecto

  // Obtener resumen del día seleccionado
  const daySummary = useMemo(() => {
    return (
      SYNTHETIC_DAILY_SUMMARIES.find((d) => d.day_index === selectedDayIndex) ||
      SYNTHETIC_DAILY_SUMMARIES[0]
    );
  }, [selectedDayIndex]);

  // Generar los 288 intervalos del día
  const intervals = useMemo(() => {
    return generateDayIntervals(selectedDayIndex);
  }, [selectedDayIndex]);

  // Intervalo actual seleccionado para métrica de "Tiempo Real"
  const currentInterval = intervals[activeIntervalIndex] || intervals[intervals.length - 1];
  const currentPowerW = currentInterval?.avg_active_power_w ?? 0;

  // Estado de Alerta del Día seleccionado
  const alertState = useMemo(() => {
    if (daySummary.injected_event.includes("aumento nocturno")) {
      return {
        level: "danger" as const,
        badgeBg: "bg-red-50 text-red-800 border-red-200",
        indicatorColor: "bg-red-500",
        title: "Desvío Crítico: Aumento Nocturno (+42,9%)",
        description: "02:00–05:00 · Consumo en madrugada superior a referencia de refrigeración.",
        action: "Verificar compresores o cargas que hayan quedado activas en madrugada.",
        hasAlert: true,
      };
    }
    if (daySummary.injected_event.includes("potencia elevada")) {
      return {
        level: "danger" as const,
        badgeBg: "bg-red-50 text-red-800 border-red-200",
        indicatorColor: "bg-red-500",
        title: "Pico de Potencia: 4.800 W (15:40 hs)",
        description: "Demanda instantánea atípica superando en +118% la mediana del horario.",
        action: "Revisar encendido simultáneo de equipamiento de alta potencia.",
        hasAlert: true,
      };
    }
    if (daySummary.injected_event.includes("luces tras cierre")) {
      return {
        level: "warning" as const,
        badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
        indicatorColor: "bg-amber-500",
        title: "Advertencia: Consumo Tras Cierre (+216 W)",
        description: "21:00–23:00 · Patrón compatible con luminarias encendidas post-atención.",
        action: "Confirmar apagado de cartelería y luminarias de salón.",
        hasAlert: true,
      };
    }
    if (daySummary.injected_event.includes("20 min sin datos")) {
      return {
        level: "warning" as const,
        badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
        indicatorColor: "bg-amber-500",
        title: "Aviso de Telemetría: 20 min sin lecturas",
        description: "12:00–12:20 · Cobertura reducida a 98,61% (4 intervalos faltantes).",
        action: "Comprobar alimentación del medidor y conectividad Wi-Fi.",
        hasAlert: true,
      };
    }
    return {
      level: "normal" as const,
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      indicatorColor: "bg-emerald-500",
      title: "Operación Normal",
      description: "Todas las lecturas están dentro del rango de tolerancia estadística.",
      action: "No se requieren acciones correctivas en este día.",
      hasAlert: false,
    };
  }, [daySummary]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. BARRA SUPERIOR: ECO-Monitor + Tag Kiosco Central + Selector de Escenarios */}
      <div className="bg-white rounded-2xl border border-eco-border p-4 md:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Título de la Aplicación y Tag Kiosco Central */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-eco-primary to-emerald-700 flex items-center justify-center text-white shadow-sm shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl font-extrabold tracking-tight text-eco-text">
                  ECO-Monitor
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-eco-primary border border-eco-primary-border flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-eco-primary animate-pulse" />
                  Kiosco Central
                </span>
                <OriginBadge type="simulated" />
              </div>
              <p className="text-xs text-eco-muted mt-0.5">
                Kiosco y Almacén · Un local comercial · Horario de apertura: <strong>08:00 a 21:00</strong> (UTC−03:00)
              </p>
            </div>
          </div>

          {/* Selector de Días y Casos de Demostración */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-eco-muted">
              <Calendar className="w-4 h-4 text-eco-primary" />
              <span className="font-semibold text-eco-text">Día de Demo:</span>
            </div>

            {/* Presets Rápidos de Demostración */}
            <div className="flex items-center gap-1 flex-wrap">
              {[
                { day: 22, label: "Día 22 (Aumento Nocturno)", isSpecial: true },
                { day: 28, label: "Día 28 (Luces Cierre)", isSpecial: true },
                { day: 24, label: "Día 24 (Pico 4,8 kW)", isSpecial: true },
                { day: 29, label: "Día 29 (Sin datos)", isSpecial: true },
                { day: 30, label: "Día 30 (Nominal)", isSpecial: false },
              ].map((preset) => (
                <button
                  key={preset.day}
                  onClick={() => setSelectedDayIndex(preset.day)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${selectedDayIndex === preset.day
                    ? "bg-eco-primary text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                >
                  {preset.label}
                </button>
              ))}

              {/* Selector Desplegable para los 30 Días */}
              <select
                value={selectedDayIndex}
                onChange={(e) => setSelectedDayIndex(Number(e.target.value))}
                className="px-2 py-1 bg-white border border-eco-border rounded-lg text-xs font-medium text-eco-text focus:outline-none focus:ring-2 focus:ring-eco-primary"
              >
                {SYNTHETIC_DAILY_SUMMARIES.map((d) => (
                  <option key={d.day_index} value={d.day_index}>
                    Día {d.day_index} ({d.date}) — {d.injected_event}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* BANNER DE ACCIÓN PRIORITARIA (si el día tiene anomalía) */}
      {alertState.hasAlert ? (
        <div
          className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${alertState.level === "danger"
            ? "bg-red-50/80 border-red-200 text-red-950"
            : "bg-amber-50/80 border-amber-200 text-amber-950"
            }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg shrink-0 ${alertState.level === "danger" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm leading-tight">{alertState.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 border border-current">
                  Regla Determinista
                </span>
                <OriginBadge type="simulated" showTooltip={false} className="text-[10px]" />
              </div>
              <p className="text-xs mt-1 text-slate-700">
                {alertState.description} {alertState.action}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                * Alcance: Medición en canal general (Kiosco Central no atribuye averías sin submedición dedicada).
              </p>
            </div>
          </div>

          <Link href="/alerts" className="shrink-0">
            <Button
              variant={alertState.level === "danger" ? "danger" : "secondary"}
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Ver Evidencia y Regla
            </Button>
          </Link>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-eco-primary shrink-0" />
            <span className="text-xs font-semibold">
              Jornada sin desvíos anómalos detectados: el consumo se encuentra alineado con la referencia mediana histórica.
            </span>
          </div>
          <OriginBadge type="simulated" showTooltip={false} />
        </div>
      )}

      {/* 2. TARJETAS DE MÉTRICAS PRINCIPALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TARJETA 1: Consumo Actual en Tiempo Real (W) */}
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-eco-muted uppercase tracking-wider">
              Consumo Actual
            </span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eco-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-eco-primary"></span>
              </span>
              <span className="text-[10px] font-bold text-eco-primary uppercase tracking-wider">
                En Vivo (5s)
              </span>
            </div>
          </div>

          <div className="mt-3">
            <div className="text-3xl font-extrabold text-eco-text tabular-nums tracking-tight">
              {currentPowerW !== null ? formatPower(currentPowerW) : "Sin señal"}
            </div>
            <p className="text-xs text-eco-muted mt-1 flex items-center gap-1">
              <span>Intervalo: 21:10 hs</span>
              <span>·</span>
              <span className="text-eco-text font-semibold">420 W base refrig.</span>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-eco-muted">Fuente: Sensor DC/Simulado</span>
            <OriginBadge type="simulated" showTooltip={false} />
          </div>
        </Card>

        {/* TARJETA 2: Energía Acumulada del Día (kWh) */}
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-eco-muted uppercase tracking-wider">
              Energía Acumulada
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-eco-primary">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-3xl font-extrabold text-eco-text tabular-nums tracking-tight">
              {formatKWh(daySummary.observed_kwh)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-eco-muted mt-1">
              <span>Cobertura:</span>
              <strong className="text-eco-text">{formatPercent(daySummary.coverage_percent)}</strong>
              <span>({daySummary.valid_intervals}/288 int.)</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-eco-muted">Fecha: {daySummary.date}</span>
            <OriginBadge type="simulated" showTooltip={false} />
          </div>
        </Card>

        {/* TARJETA 3: Costo Variable Estimado (ARS) a $150/kWh */}
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-eco-muted uppercase tracking-wider">
              Costo Variable
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-eco-warning">
              <Coins className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-3xl font-extrabold text-eco-text tabular-nums tracking-tight">
              {formatCurrencyARS(daySummary.estimated_cost_ars)}
            </div>
            <p className="text-xs text-eco-muted mt-1">
              Tarifa base: <strong>ARS 150 / kWh</strong>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-eco-muted">Costo variable puro</span>
            <OriginBadge type="estimated" showTooltip={false} />
          </div>
        </Card>

        {/* TARJETA 4: Estado de Alertas */}
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-eco-muted uppercase tracking-wider">
              Estado Operativo
            </span>
            <div className={`w-3 h-3 rounded-full ${alertState.indicatorColor}`} />
          </div>

          <div className="mt-3">
            <div className="text-xl font-bold text-eco-text truncate leading-snug">
              {alertState.hasAlert ? "Atención Requerida" : "Normal"}
            </div>
            <div className="text-xs text-eco-muted mt-1 line-clamp-1">
              {alertState.hasAlert ? alertState.title : "Sin desvíos registrados"}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <Link
              href="/alerts"
              className="text-eco-primary font-semibold hover:underline flex items-center gap-1"
            >
              <span>Ver centro de alertas</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${alertState.badgeBg}`}
            >
              {alertState.level.toUpperCase()}
            </span>
          </div>
        </Card>
      </div>

      {/* 3. GRÁFICO DE 24 HORAS CON RECHARTS */}
      <Card>
        <CardHeader
          title="Curva de Demanda Eléctrica en 24 Horas (Intervalos de 5 Minutos)"
          subtitle={`Día ${daySummary.day_index} (${daySummary.date}) · Horario comercial de apertura (08:00 a 21:00) sombreado con referencia mediana de base`}
          action={
            <div className="flex items-center gap-2">
              <OriginBadge type="simulated" />
              <OriginBadge type="estimated" />
            </div>
          }
        />

        <PowerChart24h
          measurements={intervals}
          dayIndex={daySummary.day_index}
          dateStr={daySummary.date}
          injectedEvent={daySummary.injected_event}
        />
      </Card>

      {/* SECCIÓN INFERIOR: RESUMEN MENSUAL Y ACCESO AL SIMULADOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tarjeta: Síntesis de los 30 Días */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Consolidado de 30 Días de Operación (Kiosco Central)"
            subtitle="Conjunto sintético reproducible de 8.640 intervalos de 5 minutos (25/08 a 23/09/2026)"
            action={<Layers className="w-5 h-5 text-eco-primary" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-eco-border">
              <span className="text-xs font-medium text-eco-muted block">Energía Total Válida</span>
              <div className="text-xl font-extrabold text-eco-text mt-1 tabular-nums">
                810,41 kWh
              </div>
              <span className="text-[11px] text-eco-muted mt-0.5 block">8.636 intervalos válidos</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-eco-border">
              <span className="text-xs font-medium text-eco-muted block">Gasto Variable Total</span>
              <div className="text-xl font-extrabold text-eco-text mt-1 tabular-nums">
                ARS 121.562
              </div>
              <span className="text-[11px] text-eco-muted mt-0.5 block">A tarifa ARS 150/kWh</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-eco-border">
              <span className="text-xs font-medium text-eco-muted block">Cobertura Global</span>
              <div className="text-xl font-extrabold text-eco-primary mt-1 tabular-nums">
                99,95%
              </div>
              <span className="text-[11px] text-amber-700 mt-0.5 block">4 faltantes (día 29)</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 text-xs text-blue-900 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Nota metodológica:</strong> La energía total observada no representa la energía física absoluta porque contiene un intervalo sin datos. La interfaz no inventa lecturas faltantes y reporta la cobertura explícitamente.
            </p>
          </div>
        </Card>

        {/* Tarjeta: Oportunidad de Ahorro y Acceso al Simulador */}
        <Card className="bg-gradient-to-br from-emerald-50/50 via-white to-white border-eco-primary-border flex flex-col justify-between">
          <div>
            <CardHeader
              title="Oportunidad de Ahorro"
              subtitle="Cálculo matemático sin doble conteo"
              action={<Sparkles className="w-5 h-5 text-eco-primary" />}
            />

            <div className="space-y-3">
              <div className="p-3.5 bg-white rounded-xl border border-eco-primary-border shadow-xs">
                <span className="text-xs font-bold text-eco-muted uppercase tracking-wider block">
                  Ahorro Mensual Evaluado
                </span>
                <div className="text-2xl font-extrabold text-eco-primary mt-1 tabular-nums">
                  65,16 kWh / mes
                </div>
                <div className="text-sm font-bold text-eco-text mt-0.5 tabular-nums">
                  ~ ARS 9.774 / mes (ARS 117.288 / año)
                </div>
              </div>

              <div className="text-xs text-eco-muted space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-eco-primary shrink-0" />
                  <span>Iluminación LED + horario de cierre: 46,44 kWh</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-eco-primary shrink-0" />
                  <span>Ajuste de climatización 1 h/día: 18,72 kWh</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link href="/simulator" className="block">
              <Button variant="primary" size="md" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                Explorar en el Simulador
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
