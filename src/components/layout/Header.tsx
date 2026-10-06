"use client";

import React from "react";
import { OriginBadge } from "@/components/ui/OriginBadge";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Store as StoreIcon, ShieldCheck } from "lucide-react";
import { KIOSCO_CENTRAL_STORE } from "@/lib/constants";

export const Header: React.FC = () => {
  const handleResetDemo = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-eco-border px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-eco-primary-light border border-eco-primary-border flex items-center justify-center text-eco-primary">
          <StoreIcon className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-eco-text">{KIOSCO_CENTRAL_STORE.name}</h1>
            <OriginBadge type="simulated" />
          </div>
          <p className="text-xs text-eco-muted">
            {KIOSCO_CENTRAL_STORE.business_type} · Horario {KIOSCO_CENTRAL_STORE.schedule.open} a {KIOSCO_CENTRAL_STORE.schedule.close} (UTC-03:00)
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-eco-muted">
          <ShieldCheck className="w-4 h-4 text-eco-primary" />
          <span>Tarifa base: <strong>ARS 150 / kWh</strong></span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetDemo}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          title="Restituye parámetros iniciales y escenarios sin alterar mediciones reales"
        >
          Reiniciar Demo
        </Button>
      </div>
    </header>
  );
};
