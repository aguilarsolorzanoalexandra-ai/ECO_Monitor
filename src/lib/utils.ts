import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyARS(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyARSDecimal(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatKWh(kwh: number, decimals: number = 2): string {
  return `${new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(kwh)} kWh`;
}

export function formatPower(watts: number): string {
  if (watts >= 1000) {
    return `${new Intl.NumberFormat("es-AR", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(watts / 1000)} kW`;
  }
  return `${Math.round(watts)} W`;
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value)}%`;
}

export function formatTimeUTC3(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDateUTC3(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
