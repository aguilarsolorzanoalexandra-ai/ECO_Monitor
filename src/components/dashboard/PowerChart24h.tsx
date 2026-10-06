"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import { Measurement } from "@/types";
import { OriginBadge } from "@/components/ui/OriginBadge";
import { Clock, Eye, Info, AlertTriangle } from "lucide-react";

interface PowerChart24hProps {
  measurements: Measurement[];
  dayIndex: number;
  dateStr: string;
  injectedEvent: string;
}

interface ChartDataPoint {
  time: string;
  power_w: number | null;
  ref_w: number;
  energy_wh: number | null;
  is_commercial: boolean;
  quality: string;
  event_note?: string;
}

export const PowerChart24h: React.FC<PowerChart24hProps> = ({
  measurements,
  dayIndex,
  dateStr,
  injectedEvent,
}) => {
  const [mounted, setMounted] = useState(false);
  const [showBaseline, setShowBaseline] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    return measurements.map((m, index) => {
      const date = new Date(m.interval_start);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const time = `${hours}:${minutes}`;

      const hourNum = date.getHours() + date.getMinutes() / 60;
      const isCommercial = hourNum >= 8 && hourNum < 21;

      // Mediana nominal de referencia histórica según especificación
      let refW = 420;
      if (hourNum >= 8 && hourNum < 12) refW = 1450;
      else if (hourNum >= 12 && hourNum < 17) refW = 2200;
      else if (hourNum >= 17 && hourNum < 21) refW = 1600;
      else refW = 420;

      let eventNote: string | undefined;
      if (m.quality === "missing") {
        eventNote = "Falta de telemetría (20 min sin datos)";
      } else if (dayIndex === 24 && index === 188) {
        eventNote = "Pico de demanda 4.800 W (+118% sobre referencia)";
      } else if ([12, 16, 22, 28].includes(dayIndex) && hourNum >= 21 && hourNum < 23) {
        eventNote = "Luces tras cierre comercial (+216 W)";
      } else if ([20, 21, 22].includes(dayIndex) && hourNum >= 2 && hourNum < 5) {
        eventNote = "Aumento nocturno no habitual (+180 W)";
      }

      return {
        time,
        power_w: m.avg_active_power_w,
        ref_w: refW,
        energy_wh: m.energy_wh,
        is_commercial: isCommercial,
        quality: m.quality,
        event_note: eventNote,
      } as ChartDataPoint;
    });
  }, [measurements, dayIndex]);

  if (!mounted) {
    return (
      <div className="h-80 w-full flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-eco-border animate-pulse text-eco-muted text-xs gap-2">
        <Clock className="w-6 h-6 text-eco-primary" />
        <span>Cargando curva de potencia de 24 horas...</span>
      </div>
    );
  }

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: ChartDataPoint = payload[0].payload;
      return (
        <div className="bg-white p-3.5 border border-eco-border rounded-xl shadow-xl text-xs space-y-2 min-w-[220px]">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <span className="font-bold text-eco-text text-sm">{label} hs</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                data.is_commercial
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {data.is_commercial ? "Local Abierto" : "Local Cerrado"}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-eco-muted flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-eco-primary inline-block" />
                Potencia Observada:
              </span>
              <span className="font-bold text-eco-text tabular-nums text-sm">
                {data.power_w !== null ? `${Math.round(data.power_w)} W` : "Sin datos"}
              </span>
            </div>

            {showBaseline && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-eco-muted flex items-center gap-1.5">
                  <span className="w-2.5 h-1 bg-slate-400 inline-block border-b border-dashed" />
                  Referencia Mediana:
                </span>
                <span className="font-semibold text-slate-600 tabular-nums">
                  {data.ref_w} W
                </span>
              </div>
            )}

            {data.energy_wh !== null && (
              <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-50">
                <span className="text-eco-muted">Energía (5 min):</span>
                <span className="font-medium text-eco-text tabular-nums">
                  {data.energy_wh.toFixed(1)} Wh
                </span>
              </div>
            )}

            {data.event_note && (
              <div className="mt-2 p-1.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium flex items-start gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{data.event_note}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-3">
      {/* Controles y Leyenda Superior */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Indicador de Línea Observada */}
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 rounded bg-eco-primary inline-block" />
            <span className="font-semibold text-eco-text">Potencia Medida (W)</span>
            <OriginBadge type="simulated" showTooltip={false} className="text-[10px] py-0 px-1.5" />
          </div>

          {/* Toggle de Referencia Mediana */}
          <button
            onClick={() => setShowBaseline(!showBaseline)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-colors ${
              showBaseline
                ? "bg-slate-100 border-slate-300 text-eco-text font-medium"
                : "bg-white border-dashed border-slate-200 text-eco-muted"
            }`}
          >
            <span className="w-3 h-0.5 border-b-2 border-dashed border-slate-500 inline-block" />
            <span>Referencia Mediana</span>
            <Eye className="w-3 h-3 text-eco-muted ml-0.5" />
          </button>

          {/* Franja Comercial Sombreada */}
          <div className="flex items-center gap-1.5 text-eco-muted">
            <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 inline-block" />
            <span>Horario Comercial (08:00–21:00)</span>
          </div>
        </div>

        {injectedEvent !== "normal" && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span className="capitalize">{injectedEvent}</span>
          </div>
        )}
      </div>

      {/* Recharts Container */}
      <div className="w-full h-80 bg-white rounded-xl p-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />

            <XAxis
              dataKey="time"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#CBD5E1" }}
              interval={23} // Muestra etiquetas aproximadamente cada 2 horas (24 intervalos = 2h)
            />

            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#CBD5E1" }}
              domain={[0, (dataMax: number) => Math.max(2500, Math.ceil(dataMax * 1.1))]}
              tickFormatter={(v) => `${v} W`}
            />

            {/* Sombreado de Horario Comercial de 08:00 a 21:00 */}
            <ReferenceArea
              x1="08:00"
              x2="21:00"
              y1={0}
              fill="#087F5B"
              fillOpacity={0.06}
              label={{
                value: "Local Abierto (08:00–21:00)",
                position: "insideTopLeft",
                fill: "#087F5B",
                fontSize: 11,
                fontWeight: 600,
                offset: 10,
              }}
            />

            {/* Línea horizontal de carga base nocturna (420 W) */}
            <ReferenceLine
              y={420}
              stroke="#94A3B8"
              strokeDasharray="2 2"
              label={{
                value: "Carga base (refrig.) 420 W",
                position: "insideBottomRight",
                fill: "#64748B",
                fontSize: 10,
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Línea de Referencia Mediana */}
            {showBaseline && (
              <Line
                type="stepAfter"
                dataKey="ref_w"
                name="Referencia Mediana"
                stroke="#64748B"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                isAnimationActive={false}
              />
            )}

            {/* Curva Principal de Potencia Observada */}
            <Line
              type="monotone"
              dataKey="power_w"
              name="Potencia Medida"
              stroke="#087F5B"
              strokeWidth={2}
              dot={false}
              connectNulls={false} // IMPORTANTE: deja hueco visible en caso de missing data (día 29)
              activeDot={{ r: 5, fill: "#087F5B", stroke: "#FFFFFF", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie de Gráfico con Especificación de Intervalo */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-eco-muted px-1">
        <span>
          288 intervalos de 5 minutos · Inicio nominal del día: 00:00 UTC−03:00 ({dateStr})
        </span>
        <span className="flex items-center gap-1 font-medium text-slate-600">
          <Info className="w-3 h-3 text-eco-primary" />
          La refrigeración nocturna (compresores cíclicos) conforma la meseta base de 420 W.
        </span>
      </div>
    </div>
  );
};
