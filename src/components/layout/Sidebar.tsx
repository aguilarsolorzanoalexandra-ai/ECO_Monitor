"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BellRing,
  Calculator,
  Sliders,
  Cpu,
  Leaf,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Resumen, potencia y 24 h",
    icon: LayoutDashboard,
    priority: "P0",
  },
  {
    href: "/alerts",
    label: "Alertas y Evidencia",
    description: "Desvíos y acciones sugeridas",
    icon: BellRing,
    priority: "P0",
  },
  {
    href: "/simulator",
    label: "Simulador de Ahorro",
    description: "Escenarios sin doble conteo",
    icon: Calculator,
    priority: "P0",
  },
  {
    href: "/settings",
    label: "Configuración",
    description: "Tarifa, horarios y fuente",
    icon: Sliders,
    priority: "P0",
  },
  {
    href: "/device",
    label: "Dispositivo y Sensor",
    description: "Banco DC / ESP32 (P1)",
    icon: Cpu,
    priority: "P1",
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-eco-border shrink-0 flex flex-col justify-between min-h-screen">
      <div className="p-4">
        {/* Logo / App Title */}
        <div className="flex items-center gap-2.5 px-3 py-3 mb-4 rounded-xl bg-eco-bg border border-eco-border">
          <div className="w-8 h-8 rounded-lg bg-eco-primary flex items-center justify-center text-white shadow-xs">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-eco-text">ECO-Monitor</div>
            <div className="text-[10px] text-eco-muted font-medium">Gestión Energética MVP</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-eco-primary text-white shadow-xs"
                    : "text-eco-text hover:bg-slate-100 hover:text-eco-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive ? "text-white" : "text-eco-muted group-hover:text-eco-primary"
                    )}
                  />
                  <div>
                    <div className="leading-tight">{item.label}</div>
                  </div>
                </div>

                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-eco-muted group-hover:bg-emerald-50 group-hover:text-eco-primary"
                  )}
                >
                  {item.priority}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-eco-border">
        <div className="p-3 bg-eco-bg rounded-lg border border-eco-border/80 text-xs text-eco-muted space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-eco-text">
            <Info className="w-3.5 h-3.5 text-eco-primary" />
            <span>Kiosco Central (Demo)</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Medidor general sintético de 30 días. No desconecta cargas esenciales de refrigeración.
          </p>
        </div>
      </div>
    </aside>
  );
};
