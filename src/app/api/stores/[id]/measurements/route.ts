import { NextResponse } from "next/server";
import { generateDayIntervals } from "@/lib/fixtures/dataset-generator";

/**
 * GET /api/stores/[id]/measurements?day=X
 * Devuelve los 288 intervalos de 5 minutos para el día solicitado
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const dayParam = searchParams.get("day");
  const dayIndex = dayParam ? parseInt(dayParam, 10) : 30;

  if (isNaN(dayIndex) || dayIndex < 1 || dayIndex > 30) {
    return NextResponse.json(
      { error: "Parámetro 'day' debe estar entre 1 y 30" },
      { status: 400 }
    );
  }

  const measurements = generateDayIntervals(dayIndex);

  return NextResponse.json({
    store_id: params.id,
    day_index: dayIndex,
    intervals_count: measurements.length,
    measurements,
    source: "simulated",
  });
}
