import { NextResponse } from "next/server";
import { Measurement } from "@/types";

/**
 * POST /api/measurements
 * Ingesta de telemetría desde ESP32 / sensor de banco DC o lote de prueba.
 * Cumple con 11_Arquitectura_y_stack.md y 12_Modelo_de_datos.md
 */

// Memoria volátil para idempotencia en demo local
const seenBatches = new Set<string>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const batch: Measurement[] = Array.isArray(body) ? body : [body];

    let accepted = 0;
    let duplicates = 0;
    const errors: string[] = [];

    for (const m of batch) {
      if (!m.device_id || !m.boot_id || m.sequence === undefined) {
        errors.push("Faltan campos de clave de idempotencia: device_id, boot_id, sequence.");
        continue;
      }

      const idempotencyKey = `${m.device_id}:${m.boot_id}:${m.sequence}`;
      if (seenBatches.has(idempotencyKey)) {
        duplicates++;
        continue;
      }

      // Validar coherencia física básica
      if (m.avg_active_power_w !== null && m.avg_active_power_w < 0) {
        errors.push(`Potencia negativa inválida en secuencia ${m.sequence}.`);
        continue;
      }

      seenBatches.add(idempotencyKey);
      accepted++;
    }

    return NextResponse.json({
      status: "success",
      total_received: batch.length,
      accepted,
      duplicates,
      rejected: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Formato JSON inválido" },
      { status: 400 }
    );
  }
}
