import { Store, Tariff, Equipment } from "@/types";

export const KIOSCO_CENTRAL_STORE: Store = {
  id: "kiosco-central",
  name: "Kiosco Central",
  timezone: "America/Argentina/Buenos_Aires",
  business_type: "Kiosco y Almacén",
  schedule: {
    open: "08:00",
    close: "21:00",
  },
};

export const DEFAULT_DEMO_TARIFF: Tariff = {
  id: "tariff-demo-2026",
  store_id: "kiosco-central",
  currency: "ARS",
  price_per_kwh: 150, // ARS 150/kWh
  valid_from: "2026-08-25T00:00:00Z",
  valid_to: null,
  is_demo: true,
  source_url: "Tarifa ficticia orientativa para demostración",
};

export const ORIGIN_LABELS = {
  simulated: {
    label: "Simulado",
    description: "Historial o evento generado para la demo",
    badgeClass: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  measured_dc: {
    label: "Medido · banco DC",
    description: "Lectura física del prototipo de baja tensión (ESP32)",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  estimated: {
    label: "Estimado",
    description: "Costo, proyección o ahorro calculado con supuestos",
    badgeClass: "bg-amber-50 text-amber-700 border border-amber-200",
  },
} as const;

export const NOMINAL_POWER_PROFILE = [
  { start: "00:00", end: "08:00", power_w: 420, label: "Carga base nocturna (refrigeración)" },
  { start: "08:00", end: "12:00", power_w: 1450, label: "Apertura mañana" },
  { start: "12:00", end: "17:00", power_w: 2200, label: "Pico comercial tarde" },
  { start: "17:00", end: "21:00", power_w: 1600, label: "Comercial vespertino" },
  { start: "21:00", end: "24:00", power_w: 420, label: "Cierre y carga base (refrigeración)" },
];

export const INITIAL_EQUIPMENT_CATALOG: Equipment[] = [
  {
    id: "EQ01",
    store_id: "kiosco-central",
    circuit_id: "general",
    label: "Heladera exhibidora",
    category: "refrigeracion",
    attribution_source: "declaración_usuario",
    essential: true,
    power_input_w: 300,
    duty_cycle_assumption: 0.40,
    notes: "Carga esencial 24 h. Compresor intermitente.",
  },
  {
    id: "EQ02",
    store_id: "kiosco-central",
    circuit_id: "general",
    label: "Freezer horizontal",
    category: "refrigeracion",
    attribution_source: "declaración_usuario",
    essential: true,
    power_input_w: 400,
    duty_cycle_assumption: 0.35,
    notes: "Carga esencial 24 h.",
  },
  {
    id: "EQ05",
    store_id: "kiosco-central",
    circuit_id: "general",
    label: "Lámparas actuales (12 un × 18 W)",
    category: "iluminacion",
    attribution_source: "declaración_usuario",
    essential: false,
    power_input_w: 216,
    duty_cycle_assumption: 1.0,
    notes: "13 h diarias de apertura + eventuales olvidos al cierre.",
  },
  {
    id: "EQ10",
    store_id: "kiosco-central",
    circuit_id: "general",
    label: "Aire acondicionado",
    category: "climatizacion",
    attribution_source: "declaración_usuario",
    essential: false,
    power_input_w: 1200,
    duty_cycle_assumption: 0.60,
    notes: "Potencia eléctrica media de marcha 1,2 kW.",
  },
  {
    id: "EQ13",
    store_id: "kiosco-central",
    circuit_id: "general",
    label: "PC y punto de caja",
    category: "caja_servicios",
    attribution_source: "declaración_usuario",
    essential: false,
    power_input_w: 60,
    duty_cycle_assumption: 1.0,
    notes: "Horario de atención.",
  },
  {
    id: "EQ16",
    store_id: "kiosco-central",
    circuit_id: "general",
    label: "Cámaras y router",
    category: "caja_servicios",
    attribution_source: "declaración_usuario",
    essential: true,
    power_input_w: 37,
    duty_cycle_assumption: 1.0,
    notes: "Seguridad y conectividad continua 24 h.",
  },
];
