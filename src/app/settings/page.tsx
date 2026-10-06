"use client";

import React, { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { OriginBadge } from "@/components/ui/OriginBadge";
import { Button } from "@/components/ui/Button";
import { KIOSCO_CENTRAL_STORE, DEFAULT_DEMO_TARIFF } from "@/lib/constants";
import { Sliders, Save, RotateCcw, Store, Clock, Zap, Database } from "lucide-react";

export default function SettingsPage() {
  const [storeName, setStoreName] = useState(KIOSCO_CENTRAL_STORE.name);
  const [openTime, setOpenTime] = useState(KIOSCO_CENTRAL_STORE.schedule.open);
  const [closeTime, setCloseTime] = useState(KIOSCO_CENTRAL_STORE.schedule.close);
  const [tariffPrice, setTariffPrice] = useState(DEFAULT_DEMO_TARIFF.price_per_kwh);
  const [dataSource, setDataSource] = useState<"synthetic" | "esp32_dc">("synthetic");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-eco-text">Configuración del Comercio</h2>
            <OriginBadge type="simulated" />
          </div>
          <p className="text-sm text-eco-muted mt-1">
            Parámetros operativos de Kiosco Central, supuestos económicos y selector de origen de datos.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          icon={<Save className="w-3.5 h-3.5" />}
        >
          {saved ? "¡Guardado!" : "Guardar Cambios"}
        </Button>
      </div>

      {/* Comercio y Horarios */}
      <Card>
        <CardHeader
          title="1. Identificación y Calendario Comercial"
          subtitle="Define la franja horaria para distinguir consumo en operación frente a consumo nocturno / fuera de hora"
          action={<Store className="w-5 h-5 text-eco-primary" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-eco-text mb-1">Nombre del Comercio</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3 py-2 border border-eco-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eco-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-eco-text mb-1">Horario Apertura</label>
            <input
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              className="w-full px-3 py-2 border border-eco-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eco-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-eco-text mb-1">Horario Cierre</label>
            <input
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              className="w-full px-3 py-2 border border-eco-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eco-primary"
            />
          </div>
        </div>
      </Card>

      {/* Supuesto Tarifario */}
      <Card>
        <CardHeader
          title="2. Supuesto Tarifario Eléctrico"
          subtitle="Tarifa editable en pesos por kilovatio-hora para calcular los costos variables estimados"
          action={<Zap className="w-5 h-5 text-amber-500" />}
        />

        <div className="max-w-xs">
          <label className="block text-xs font-semibold text-eco-text mb-1">
            Precio por kWh (ARS)
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
              onChange={(e) => setTariffPrice(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-2 border border-eco-border rounded-lg text-sm font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-eco-primary"
            />
          </div>
          <p className="text-[11px] text-eco-muted mt-1.5">
            Tarifa ficticia de demostración (ARS 150/kWh). Los kWh físicos no se alteran al cambiar este importe.
          </p>
        </div>
      </Card>

      {/* Origen de Datos */}
      <Card>
        <CardHeader
          title="3. Selector de Fuente de Datos"
          subtitle="Separación estricta entre simulación y banco físico de baja tensión"
          action={<Database className="w-5 h-5 text-eco-info" />}
        />

        <div className="space-y-3">
          <label className="flex items-start gap-3 p-3.5 rounded-lg border border-eco-border bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="radio"
              name="dataSource"
              value="synthetic"
              checked={dataSource === "synthetic"}
              onChange={() => setDataSource("synthetic")}
              className="mt-1 h-4 w-4 text-eco-primary focus:ring-eco-primary"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-eco-text">
                  Modo Demo Local (Dataset Sintético 30 días)
                </span>
                <OriginBadge type="simulated" showTooltip={false} />
              </div>
              <p className="text-xs text-eco-muted mt-0.5">
                8.640 intervalos de 5 minutos reproducibles con eventos inyectados de iluminación, desvíos y ausencias. Funciona 100% offline.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-lg border border-eco-border bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="radio"
              name="dataSource"
              value="esp32_dc"
              checked={dataSource === "esp32_dc"}
              onChange={() => setDataSource("esp32_dc")}
              className="mt-1 h-4 w-4 text-eco-primary focus:ring-eco-primary"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-eco-text">
                  Banco Físico Local (ESP32 + Sensor INA219 DC)
                </span>
                <OriginBadge type="measured_dc" showTooltip={false} />
              </div>
              <p className="text-xs text-eco-muted mt-0.5">
                Medición en baja tensión 5–12 V para verificar telemetría física en LAN local sin mezclar consumos con la simulación.
              </p>
            </div>
          </label>
        </div>
      </Card>
    </div>
  );
}
