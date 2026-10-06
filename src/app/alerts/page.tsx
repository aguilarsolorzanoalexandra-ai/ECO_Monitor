"use client";

import React, { useState } from "react";
import { OriginBadge } from "@/components/ui/OriginBadge";
import { Button } from "@/components/ui/Button";
import { AlertStatus } from "@/types";
import { formatCurrencyARS, formatKWh, formatPercent, formatTimeUTC3 } from "@/lib/utils";
import {
  Clock,
  HelpCircle,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  Calendar,
  Flame,
} from "lucide-react";

interface AlertItem {
  id: string;
  isUrgentPrimary?: boolean;
  title: string;
  category: "nocturno" | "post_cierre" | "potencia" | "telemetria";
  urgencyLevel: "critica" | "advertencia" | "informativa";
  dateFormatted: string;
  start: string;
  end: string;
  windowDurationHours: number;
  baselinePowerW: number;
  observedPowerW: number;
  baselineEnergyKwh: number;
  observedEnergyKwh: number;
  deviationPercent: number;
  excessKwh: number;
  costExtraArs: number;
  tariffUsedArs: number;
  status: AlertStatus;
  ruleCode: string;
  historicalComparableDaysCount: number;
  scopeDescription: string;
  suggestedAction: string;
  actionLog?: {
    date: string;
    note: string;
  };
}

const INITIAL_ALERTS: AlertItem[] = [
  // 1. ALERTA PRINCIPAL URGENTE (ESPECIFICADA EN LA PLANIFICACIÓN)
  {
    id: "alt-urgente-nocturna-01",
    isUrgentPrimary: true,
    title: "Consumo nocturno superior al habitual",
    category: "nocturno",
    urgencyLevel: "critica",
    dateFormatted: "15 de Septiembre de 2026",
    start: "2026-09-15T02:00:00-03:00",
    end: "2026-09-15T05:00:00-03:00",
    windowDurationHours: 3,
    baselinePowerW: 888, // Mediana de los últimos 28 días
    observedPowerW: 1288,
    baselineEnergyKwh: 2.664, // 0,888 kW * 3 h
    observedEnergyKwh: 3.864, // 1,288 kW * 3 h
    deviationPercent: 45.0, // +45% exacto de la planificación
    excessKwh: 1.2, // 1,2 kWh de exceso en la ventana
    costExtraArs: 180, // 1,2 kWh * 150 ARS/kWh = ARS 180
    tariffUsedArs: 150,
    status: "new",
    ruleCode: "RULE-P0-NOCTURNA-MADRUGADA-V1",
    historicalComparableDaysCount: 28,
    scopeDescription:
      "Acometida general del comercio (medidor general). No se cuenta con submedición dedicada en circuitos individuales de frío.",
    suggestedAction:
      "Verificar burletes, termostatos y eventuales luces o artefactos que hayan quedado funcionando fuera de horario comercial.",
  },
  // 2. ALERTA HISTÓRICA: Luces tras el cierre
  {
    id: "alt-post-cierre-28",
    title: "Carga activa no habitual tras el cierre comercial",
    category: "post_cierre",
    urgencyLevel: "advertencia",
    dateFormatted: "21 de Septiembre de 2026",
    start: "2026-09-21T21:00:00-03:00",
    end: "2026-09-21T23:00:00-03:00",
    windowDurationHours: 2,
    baselinePowerW: 420,
    observedPowerW: 636,
    baselineEnergyKwh: 0.84,
    observedEnergyKwh: 1.272,
    deviationPercent: 51.43,
    excessKwh: 0.432,
    costExtraArs: 64.8,
    tariffUsedArs: 150,
    status: "reviewed",
    ruleCode: "RULE-P0-CIERRE-POSTATENCION-V1",
    historicalComparableDaysCount: 28,
    scopeDescription:
      "Medición general consolidada. Desvío coincidente con horario de fin de jornada comercial (21:00 a 23:00 hs).",
    suggestedAction:
      "Revisar el apagado del cartel exterior de marquesina y luminarias de salón comercial tras el horario de atención.",
    actionLog: {
      date: "22/09/2026 09:15 hs",
      note: "Comerciante notificó que se apagó el cartel de marquesina que había quedado encendido por olvido.",
    },
  },
  // 3. ALERTA HISTÓRICA: Pico de potencia
  {
    id: "alt-pico-potencia-24",
    title: "Pico de potencia eléctrica registrado",
    category: "potencia",
    urgencyLevel: "advertencia",
    dateFormatted: "17 de Septiembre de 2026",
    start: "2026-09-17T15:40:00-03:00",
    end: "2026-09-17T15:45:00-03:00",
    windowDurationHours: 0.083, // 5 minutos
    baselinePowerW: 2200,
    observedPowerW: 4800,
    baselineEnergyKwh: 0.183,
    observedEnergyKwh: 0.4,
    deviationPercent: 118.18,
    excessKwh: 0.217,
    costExtraArs: 32.55,
    tariffUsedArs: 150,
    status: "action_applied",
    ruleCode: "RULE-P0-POTENCIA-MAXIMA-V1",
    historicalComparableDaysCount: 28,
    scopeDescription:
      "Evento instantáneo de potencia activa de 5 minutos en horario comercial de alta demanda.",
    suggestedAction:
      "Verificar arranque simultáneo de compresores de refrigeración comercial junto con pava eléctrica o microondas.",
    actionLog: {
      date: "17/09/2026 16:30 hs",
      note: "Se reprogramó el encendido secuencial de equipos de cocina y cafetería para evitar picos simultáneos.",
    },
  },
  // 4. ALERTA HISTÓRICA: Aviso de telemetría (Día 29)
  {
    id: "alt-telemetria-29",
    title: "Interrupción de telemetría (20 min sin datos)",
    category: "telemetria",
    urgencyLevel: "informativa",
    dateFormatted: "22 de Septiembre de 2026",
    start: "2026-09-22T12:00:00-03:00",
    end: "2026-09-22T12:20:00-03:00",
    windowDurationHours: 0.333,
    baselinePowerW: 2200,
    observedPowerW: 0,
    baselineEnergyKwh: 0.733,
    observedEnergyKwh: 0,
    deviationPercent: -100,
    excessKwh: 0,
    costExtraArs: 0,
    tariffUsedArs: 150,
    status: "closed",
    ruleCode: "RULE-P0-TELEMETRIA-CALIDAD-V1",
    historicalComparableDaysCount: 28,
    scopeDescription:
      "Telemetría ausente durante 4 intervalos contiguos de 5 minutos. Cobertura diaria del 98,61%.",
    suggestedAction:
      "Verificar alimentación eléctrica del sensor de acometida y estabilidad del enlace Wi-Fi local.",
    actionLog: {
      date: "22/09/2026 13:00 hs",
      note: "Se comprobó microcorte en el router de conectividad Wi-Fi del comercio.",
    },
  },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [filter, setFilter] = useState<AlertStatus | "all">("all");
  const [actionInput, setActionInput] = useState<{ [key: string]: string }>({});
  const [activeModalId, setActiveModalId] = useState<string | null>(null);

  const filteredAlerts = filter === "all" ? alerts : alerts.filter((a) => a.status === filter);

  const handleUpdateStatus = (id: string, newStatus: AlertStatus, actionNote?: string) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            status: newStatus,
            actionLog: actionNote
              ? {
                  date: new Date().toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  note: actionNote,
                }
              : a.actionLog,
          };
        }
        return a;
      })
    );
    setActiveModalId(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. ENCABEZADO DE LA SECCIÓN */}
      <div className="bg-white rounded-2xl border border-eco-border p-4 md:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-eco-text">
              Centro de Alertas y Evidencia
            </h1>
            <OriginBadge type="simulated" />
            <span className="text-xs px-2 py-0.5 rounded font-bold bg-slate-100 text-eco-muted">
              Kiosco Central
            </span>
          </div>
          <p className="text-xs md:text-sm text-eco-muted mt-1">
            Detección estadística reproducible basada en la mediana de los últimos 28 días comparables.
          </p>
        </div>

        {/* Filtros de Estado */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs overflow-x-auto">
          {(
            [
              { key: "all", label: "Todas", count: alerts.length },
              { key: "new", label: "Nuevas", count: alerts.filter((a) => a.status === "new").length },
              { key: "reviewed", label: "Revisadas", count: alerts.filter((a) => a.status === "reviewed").length },
              { key: "action_applied", label: "Con Acción", count: alerts.filter((a) => a.status === "action_applied").length },
              { key: "closed", label: "Cerradas", count: alerts.filter((a) => a.status === "closed").length },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filter === item.key
                  ? "bg-white text-eco-text shadow-xs"
                  : "text-eco-muted hover:text-eco-text"
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filter === item.key ? "bg-emerald-50 text-eco-primary font-bold" : "bg-slate-200 text-slate-600"
                }`}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. BLOQUE OBLIGATORIO DE TRANSPARENCIA Y HONESTIDAD METODOLÓGICA */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-white to-slate-50 border border-blue-200 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 shrink-0 mt-0.5">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="text-xs text-blue-950 space-y-2 leading-relaxed">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-blue-900">
                Honestidad Metodológica: Medición General sin Falsa Submedición
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-200/70 text-blue-900">
                Regla de Alcance Técnico
              </span>
            </div>
            <p>
              El prototipo de <strong>ECO-Monitor</strong> utiliza un sensor instalado en la acometida eléctrica principal del <strong>Kiosco Central</strong>. El sistema identifica con rigor estadístico <em>en qué momento exacto ocurrió un desvío</em> respecto al comportamiento habitual, pero <strong>no puede atribuir de forma automática la culpa a un aparato específico</strong> (como asegurar que una heladera o freezer en particular está rota) sin disponer de sensores individuales dedicados.
            </p>
            <p className="font-medium text-blue-900">
              💡 <strong>Orientación para el comerciante:</strong> Ante una anomalía, el sistema sugiere inspeccionar visualmente luminarias que hayan quedado encendidas por olvido, verificar el cierre hermético de los burletes de heladeras exhibidoras o revisar si algún equipo secundario quedó conectado innecesariamente.
            </p>
          </div>
        </div>
      </div>

      {/* 3. LISTA DE ALERTAS HISTÓRICAS */}
      <div className="space-y-5">
        {filteredAlerts.map((alert) => {
          const isUrgent = alert.isUrgentPrimary;

          return (
            <div
              key={alert.id}
              className={`rounded-2xl transition-all overflow-hidden ${
                isUrgent
                  ? "bg-white border-2 border-red-500 shadow-md ring-4 ring-red-50"
                  : "bg-white border border-eco-border shadow-xs hover:shadow-sm"
              }`}
            >
              {/* Franja Superior Destacada para la Alerta Crítica Urgente */}
              {isUrgent && (
                <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white px-5 py-2 flex items-center justify-between text-xs font-bold tracking-wide">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 animate-bounce" />
                    <span className="uppercase">Alerta Prioritaria Más Urgente · Atención Requerida</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[11px]">
                    Desvío Crítico en Madrugada
                  </span>
                </div>
              )}

              <div className="p-5 md:p-6 space-y-5">
                {/* Cabecera de la Tarjeta */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${
                          alert.status === "new"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : alert.status === "reviewed"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : alert.status === "action_applied"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {alert.status === "new" && "● Nueva Alerta"}
                        {alert.status === "reviewed" && "● Revisada"}
                        {alert.status === "action_applied" && "✓ Acción Registrada"}
                        {alert.status === "closed" && "✕ Cerrada"}
                      </span>

                      <h2
                        className={`text-lg font-bold ${
                          isUrgent ? "text-red-900" : "text-eco-text"
                        }`}
                      >
                        {alert.title}
                      </h2>

                      <OriginBadge type="simulated" showTooltip={false} className="text-[10px]" />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-eco-muted flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-eco-primary" />
                        {alert.dateFormatted}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-eco-primary" />
                        {formatTimeUTC3(alert.start)} a {formatTimeUTC3(alert.end)} hs ({alert.windowDurationHours} h)
                      </span>
                      <span>·</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        Regla: {alert.ruleCode}
                      </span>
                    </div>
                  </div>

                  {/* Bloque de Impacto Económico y Exceso */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-right shrink-0 min-w-[190px]">
                    <div className="text-[11px] font-semibold text-eco-muted uppercase tracking-wider">
                      Costo Extra Estimado
                    </div>
                    <div className="text-2xl font-extrabold text-eco-text tabular-nums mt-0.5">
                      ~ {formatCurrencyARS(alert.costExtraArs)}
                    </div>
                    <div className="flex items-center justify-end gap-1.5 mt-1 text-xs">
                      <span className="font-bold text-amber-900">
                        +{formatKWh(alert.excessKwh)}
                      </span>
                      <OriginBadge type="estimated" showTooltip={false} className="text-[9px] py-0 px-1" />
                    </div>
                  </div>
                </div>

                {/* 2. EVIDENCIA EXACTA CALCULADA EN LA PLANIFICACIÓN */}
                <div
                  className={`p-4 rounded-xl border ${
                    isUrgent
                      ? "bg-red-50/40 border-red-200"
                      : "bg-slate-50/80 border-slate-200"
                  }`}
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-eco-muted mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-eco-primary" />
                      <span>Evidencia Cuantitativa Frente al Baseline Histórico</span>
                    </span>
                    <span className="text-[11px] font-normal text-slate-500 lowercase">
                      Base: mediana de {alert.historicalComparableDaysCount} días comparables
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-white p-2.5 rounded-lg border border-eco-border shadow-2xs">
                      <span className="text-[11px] text-eco-muted block font-medium">Referencia Mediana</span>
                      <span className="text-base font-bold text-slate-700 tabular-nums">
                        {alert.baselinePowerW} W
                      </span>
                      <span className="text-[10px] text-slate-400 block">({alert.baselineEnergyKwh.toFixed(2)} kWh)</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-eco-border shadow-2xs">
                      <span className="text-[11px] text-eco-muted block font-medium">Consumo Observado</span>
                      <span className="text-base font-bold text-eco-text tabular-nums">
                        {alert.observedPowerW} W
                      </span>
                      <span className="text-[10px] text-slate-400 block">({alert.observedEnergyKwh.toFixed(2)} kWh)</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-eco-border shadow-2xs">
                      <span className="text-[11px] text-eco-muted block font-medium">Desvío Relativo</span>
                      <span
                        className={`text-base font-extrabold tabular-nums ${
                          alert.deviationPercent > 0 ? "text-red-700" : "text-eco-muted"
                        }`}
                      >
                        +{formatPercent(alert.deviationPercent)}
                      </span>
                      <span className="text-[10px] text-red-600 font-semibold block">Sobre la mediana</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-eco-border shadow-2xs">
                      <span className="text-[11px] text-eco-muted block font-medium">Exceso Neto de Energía</span>
                      <span className="text-base font-extrabold text-amber-800 tabular-nums">
                        {formatKWh(alert.excessKwh)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">En la ventana</span>
                    </div>
                  </div>

                  {/* Proyección condicional */}
                  {alert.excessKwh > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between flex-wrap gap-2">
                      <span>
                        Tarifa de referencia: <strong>ARS {alert.tariffUsedArs} / kWh</strong> (exceso en 3 horas: {formatCurrencyARS(alert.costExtraArs)}).
                      </span>
                      <span className="text-slate-500">
                        Proyección si se repitiera 30 noches: <strong>~{formatCurrencyARS(alert.costExtraArs * 30)}/mes</strong>.
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. ALCANCE Y ACCIÓN SUGERIDA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Caja de Alcance */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-bold text-eco-text flex items-center gap-1.5 mb-1.5">
                      <ShieldAlert className="w-4 h-4 text-eco-warning" />
                      <span>Alcance y Límite de Afirmación</span>
                    </div>
                    <p className="text-eco-muted leading-relaxed">
                      {alert.scopeDescription}
                    </p>
                  </div>

                  {/* Caja de Acción Sugerida */}
                  <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-eco-primary-border">
                    <div className="font-bold text-eco-primary flex items-center gap-1.5 mb-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Recomendación Práctica al Comerciante</span>
                    </div>
                    <p className="text-eco-text leading-relaxed">
                      {alert.suggestedAction}
                    </p>
                  </div>
                </div>

                {/* Bitácora de Acción Aplicada (si existe) */}
                {alert.actionLog && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-start gap-2.5">
                    <FileCheck className="w-4 h-4 text-eco-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-emerald-900">
                        Acción Aplicada Registrada el {alert.actionLog.date}:
                      </div>
                      <p className="text-emerald-800 mt-0.5">
                        &quot;{alert.actionLog.note}&quot;
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. BOTONES DE GESTIÓN Y ESTADOS */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] text-eco-muted">
                    ID único: <span className="font-mono text-slate-500">{alert.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {alert.status === "new" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(alert.id, "reviewed")}
                      >
                        Marcar como revisada
                      </Button>
                    )}

                    {alert.status !== "action_applied" && alert.status !== "closed" && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setActiveModalId(activeModalId === alert.id ? null : alert.id)}
                      >
                        Registrar acción tomada
                      </Button>
                    )}

                    {alert.status !== "closed" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUpdateStatus(alert.id, "closed")}
                      >
                        Cerrar evento
                      </Button>
                    )}
                  </div>
                </div>

                {/* Input desplegable para registrar acción */}
                {activeModalId === alert.id && (
                  <div className="mt-3 p-3.5 bg-slate-50 border border-eco-border rounded-xl space-y-2.5 text-xs animate-in fade-in">
                    <label className="font-bold text-eco-text block">
                      ¿Qué acción o verificación realizaste en el Kiosco Central?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ej: Se comprobó que el burlete de la exhibidora estaba abierto y se corrigió el termostato."
                      value={actionInput[alert.id] || ""}
                      onChange={(e) =>
                        setActionInput({ ...actionInput, [alert.id]: e.target.value })
                      }
                      className="w-full p-2.5 border border-eco-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-eco-primary"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveModalId(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() =>
                          handleUpdateStatus(
                            alert.id,
                            "action_applied",
                            actionInput[alert.id] || "Se inspeccionaron equipos y luminarias del local."
                          )
                        }
                      >
                        Guardar Registro de Acción
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
