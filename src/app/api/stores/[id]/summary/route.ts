import { NextResponse } from "next/server";
import { SYNTHETIC_DAILY_SUMMARIES } from "@/lib/fixtures/dataset-generator";
import { KIOSCO_CENTRAL_STORE, DEFAULT_DEMO_TARIFF } from "@/lib/constants";

/**
 * GET /api/stores/[id]/summary
 * Devuelve el resumen general del comercio, agregados y estado demo
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (params.id !== KIOSCO_CENTRAL_STORE.id && params.id !== "kiosco-central") {
    return NextResponse.json({ error: "Comercio no encontrado" }, { status: 404 });
  }

  const totalValidKwh = SYNTHETIC_DAILY_SUMMARIES.reduce((acc, d) => acc + d.observed_kwh, 0);
  const totalCostArs = totalValidKwh * DEFAULT_DEMO_TARIFF.price_per_kwh;
  const currentDay = SYNTHETIC_DAILY_SUMMARIES[SYNTHETIC_DAILY_SUMMARIES.length - 1];

  return NextResponse.json({
    store: KIOSCO_CENTRAL_STORE,
    tariff: DEFAULT_DEMO_TARIFF,
    current_day: currentDay,
    aggregate_30_days: {
      total_observed_kwh: Number(totalValidKwh.toFixed(3)),
      estimated_variable_cost_ars: Number(totalCostArs.toFixed(2)),
      days_count: SYNTHETIC_DAILY_SUMMARIES.length,
      coverage_percent: 99.95,
      total_intervals: 8640,
      valid_intervals: 8636,
      missing_intervals: 4,
    },
    source: "simulated",
  });
}
