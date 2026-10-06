import React from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { OriginBadge } from "@/components/ui/OriginBadge";
import { Cpu, Wifi, ShieldAlert, CheckCircle, Activity, HardDrive } from "lucide-react";

export default function DevicePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-eco-text">Dispositivo y Hardware</h2>
            <OriginBadge type="measured_dc" />
            <span className="text-xs px-2 py-0.5 rounded font-bold bg-slate-100 text-eco-muted uppercase">
              Prioridad P1
            </span>
          </div>
          <p className="text-sm text-eco-muted mt-1">
            Demostración física de bajo riesgo en baja tensión (ESP32 + INA219 DC) para validar la cadena de telemetría.
          </p>
        </div>
      </div>

      {/* Safety & Academic Prototype Disclaimer */}
      <div className="p-4 bg-emerald-50 border border-eco-primary-border rounded-xl flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-eco-primary shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-950 space-y-1">
          <div className="font-bold">Demostración en Banco Seguro de Baja Tensión</div>
          <p className="leading-relaxed">
            Por seguridad física y normativa académica, la prueba de hardware utiliza un circuito de 5–12 V DC con sensor INA219 y microcontrolador ESP32. Esta configuración demuestra la ingesta HTTP por lotes, control de secuencia y cálculo de energía sin intervenir en tableros de 220 V ni poner en riesgo la instalación.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device Status Card */}
        <Card>
          <CardHeader
            title="Estado del Medidor Prototipo"
            subtitle="Identificador: esp32-banco-dc-01"
            action={<Cpu className="w-5 h-5 text-eco-primary" />}
          />

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-eco-muted">Estado de Conexión:</span>
              <span className="flex items-center gap-1.5 font-bold text-eco-primary">
                <span className="w-2 h-2 rounded-full bg-eco-primary animate-pulse" />
                En espera / Local LAN
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-eco-muted">Microcontrolador:</span>
              <span className="font-semibold text-eco-text">ESP32 DevKit V1 (Wi-Fi 802.11 b/g/n)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-eco-muted">Sensor de Corriente:</span>
              <span className="font-semibold text-eco-text">INA219 I2C (Baja Tensión DC)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-eco-muted">Endpoint de Ingesta:</span>
              <span className="font-mono text-[11px] text-eco-text">POST /api/measurements</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-eco-muted">Control de Idempotencia:</span>
              <span className="font-mono text-[11px] text-eco-text">(device_id, boot_id, seq)</span>
            </div>
          </div>
        </Card>

        {/* Contract & Telemetry Specifications */}
        <Card>
          <CardHeader
            title="Contrato de Telemetría"
            subtitle="Ingesta semiabierta [inicio, fin) en lotes controlados"
            action={<HardDrive className="w-5 h-5 text-eco-info" />}
          />

          <div className="space-y-3 text-xs">
            <p className="text-eco-muted leading-relaxed">
              El firmware del ESP32 promedia la potencia durante la ventana configurada y calcula la energía integrada:
            </p>

            <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] space-y-1 overflow-x-auto">
              <div>&#123;</div>
              <div className="pl-4">&quot;device_id&quot;: &quot;esp32-banco-dc-01&quot;,</div>
              <div className="pl-4">&quot;circuit_id&quot;: &quot;banco-dc&quot;,</div>
              <div className="pl-4">&quot;interval_seconds&quot;: 300,</div>
              <div className="pl-4">&quot;avg_active_power_w&quot;: 14.85,</div>
              <div className="pl-4">&quot;energy_wh&quot;: 1.237,</div>
              <div className="pl-4">&quot;source&quot;: &quot;measured_dc&quot;,</div>
              <div className="pl-4">&quot;quality&quot;: &quot;valid&quot;</div>
              <div>&#125;</div>
            </div>

            <p className="text-[11px] text-slate-500">
              * Nota: Las lecturas del banco DC conservan su etiqueta <OriginBadge type="measured_dc" showTooltip={false} /> y nunca se suman directamente con los consumos sintéticos del kiosco.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
