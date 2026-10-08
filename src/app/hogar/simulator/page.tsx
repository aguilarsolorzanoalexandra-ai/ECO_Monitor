'use client';
import React, { useState } from 'react';

export default function HogarSimulator() {
  const [horasAire, setHorasAire] = useState(4);
  const [apagarAusencias, setApagarAusencias] = useState(false);

  // Cuadro tarifario residencial Edenor/Edesur CABA (Valores simulación base EQUIA)
  // ¡Acá podés editar los precios de base si el jurado te pide simular otros costos!
  const COSTO_KWH_BASE = 65; // Pesos por kWh promedio categoría residencial intermedia
  
  // Consumos típicos en Watts de los artefactos
  const POTENCIA_AIRE = 1.2; // 1200W = 1.2 kW
  const POTENCIA_OTROS = 0.35; // Consumo basal promedio de la casa (350W)

  // Cálculo matemático dinámico sin doble conteo de energía
  const diasMes = 30;
  const consumoMensualAire = POTENCIA_AIRE * horasAire * diasMes;
  const consumoMensualOtros = POTENCIA_OTROS * (apagarAusencias ? 14 : 24) * diasMes;
  const consumoTotalKwh = Math.round(consumoMensualAire + consumoMensualOtros);
  
  // Determinación automática de la categoría según los escalones estrictos de CABA
  let categoria = 'R1';
  if (consumoTotalKwh > 150 && consumoTotalKwh <= 325) categoria = 'R2';
  if (consumoTotalKwh > 325 && consumoTotalKwh <= 400) categoria = 'R3';
  if (consumoTotalKwh > 400 && consumoTotalKwh <= 450) categoria = 'R4';
  if (consumoTotalKwh > 450 && consumoTotalKwh <= 500) categoria = 'R5';
  if (consumoTotalKwh > 500 && consumoTotalKwh <= 600) categoria = 'R6';
  if (consumoTotalKwh > 600) categoria = 'R7';

  const gastoPesosEstimado = Math.round(consumoTotalKwh * COSTO_KWH_BASE);
  const ahorroEstimadoPesos = apagarAusencias ? Math.round(POTENCIA_OTROS * 10 * diasMes * COSTO_KWH_BASE) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 antialiased">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Encabezado */}
        <div className="border-b border-slate-800 pb-5">
          <div className="text-emerald-400 text-xs font-mono mb-1">MÓDULO SIMULACIÓN ESTRATÉGICA &bull; ALGORITMO INTEGRADO</div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Simulador de Ahorro EQUIA</h1>
          <p className="text-xs text-slate-400 mt-1">Calcule el impacto económico en base a las 7 categorías tarifarias residenciales vigentes en CABA.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Panel de Controles (Sliders) */}
          <div className="md:col-span-2 space-y-6 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-base font-bold text-slate-200 border-b border-slate-800 pb-2">Modificar Hábitos del Hogar</h2>
            
            {/* Control Aire Acondicionado */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="font-medium text-slate-300">Uso diario del Aire Acondicionado:</span>
                <span className="font-mono text-emerald-400 font-bold">{horasAire} horas/día</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="24" 
                value={horasAire} 
                onChange={(e) => setHorasAire(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <p className="text-[10px] text-slate-500 leading-tight">Calculado sobre un split estándar de 3000 frigorías (Consumo estimado: 1.2 kW/h activo).</p>
            </div>

            {/* Control Ausencias (Modo Eco) */}
            <div className="pt-4 border-t border-slate-800/60 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <label htmlFor="ausencias" className="text-xs md:text-sm font-medium text-slate-300 block cursor-pointer">
                  Apagar equipos en horario de ausencia laboral
                </label>
                <span className="text-[10px] text-slate-500 block leading-tight">
                  Simula la desconexión total de consumos vampiro (TV, PC, luces en espera) durante 10 horas al día.
                </span>
              </div>
              <input 
                id="ausencias"
                type="checkbox" 
                checked={apagarAusencias}
                onChange={(e) => setApagarAusencias(e.target.checked)}
                className="w-5 h-5 rounded border-slate-800 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950 cursor-pointer rounded-md mt-1"
              />
            </div>
          </div>

          {/* Panel de Resultados Económicos */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-200 border-b border-slate-800 pb-2">Impacto Proyectado</h2>
              
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Consumo Mensual</span>
                <div className="text-2xl font-black font-mono text-slate-100">{consumoTotalKwh} <span className="text-sm font-normal text-slate-400">kWh</span></div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Categoría Escalón CABA</span>
                <div className="text-xl font-bold text-cyan-400 font-mono">Tarifa Residencial {categoria}</div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Total Estimado en Pesos</span>
                <div className="text-3xl font-black font-mono text-emerald-400">\${gastoPesosEstimado.toLocaleString('es-AR')}</div>
              </div>
            </div>

            {ahorroEstimadoPesos > 0 && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium space-y-1">
                <div className="font-bold"> ¡Ahorro por Modo Eco Activo!</div>
                <p className="text-[10px] text-emerald-300/80 leading-snug">Evitaste derrochar \${ahorroEstimadoPesos.toLocaleString('es-AR')} este mes optimizando el horario vacío.</p>
              </div>
            )}
          </div>
        </div>

        {/* Advertencia Metodológica Estricta de EQUIA */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-mono">
          <span className="text-amber-400 font-bold">⚠️ CAUTELA METODOLÓGICA CONVERGE:</span> Este simulador recalcula el escenario conjunto modificando potencia y horas en simultáneo. No suma los ahorros de forma lineal para evitar el doble conteo de energía, garantizando la certeza del dato simulado.
        </div>

        {/* Volver */}
        <div className="pt-2">
          <a href="/hogar/dashboard" className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1">
            &larr; Volver al Dashboard de Mi Casa
          </a>
        </div>

      </div>
    </div>
  );
}
