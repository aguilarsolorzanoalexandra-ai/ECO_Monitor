import { NextResponse } from "next/server";
import { detectP0Alerts } from "@/lib/engine/alert-detector";
import { DEFAULT_DEMO_TARIFF } from "@/lib/constants";

/**
 * GET /api/stores/[id]/alerts
 * Devuelve las alertas detectadas con evidencia reproducible
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const alerts = detectP0Alerts([], DEFAULT_DEMO_TARIFF);

  return NextResponse.json({
    store_id: params.id,
    alerts_count: alerts.length,
    alerts,
    source: "simulated",
  });
}
