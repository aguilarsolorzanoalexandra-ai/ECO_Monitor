'use client';
import React from 'react';

export default function HogarAlerts() {
  const alertas = [
    {
      id: 1,
      tipo: 'Informativa',
      mensaje: 'Ciclo de refrigeración detectado durante ausencia',
      explicacion: 'La heladera encendió su compresor a las 11:15 AM estando la casa vacía. El consumo de 90W se encuentra dentro de los parámetros normales de mantenimiento térmico.',
      esDerroche: false,
      timestamp: 'Hoy, 11:15 AM'
    },
    {
      id: 2,
      tipo: 'Advertencia',
      mensaje: 'Consumo inusual detectado en Horario Vacío',
      explicacion: 'Se registró una carga constante de 180W entre las 02:00 AM y las 06:00 AM. El análisis sugiere un posible olvido de luces o una PC de escritorio encendida.',
      esDerroche: true,
      timestamp: 'Ayer, 02:15 AM'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 antialiased">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Encabezado */}
        <div className="border-b border-slate-800 pb-5">
          <div className="text-emerald-400 text-xs font-mono mb-1">MOTOR DE EXPLICABILIDAD CONTEXTUAL &bull; CERTEZA DEL DATO</div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Historial de Alertas Inteligentes</h1>
          <p className="text-xs text-slate-400 mt-1">Análisis automatizado de consumo basal y detección de anomalías residenciales.</p>
        </div>

        {/* Lista de Alertas */}
        <div className="space-y-4">
          {alertas.map((alerta) => (
            <div 
              key={alerta.id}
              className={`p-5 rounded-2xl bg-slate-900 border transition-all ${
                alerta.esDerroche 
                  ? 'border-amber-500/30 hover:border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.02)]' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/50 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{alerta.esDerroche ? '⚠️' : '❄️'}</span>
                  <div>
                    <h2 className="text-sm md:text-base font-bold text-slate-200">{alerta.mensaje}</h2>
                    <span className={`inline-block text-[9px] font-mono px-2 py-0.5 rounded font-medium mt-0.5 ${
                      alerta.esDerroche ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      Módulo: {alerta.tipo}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono self-start sm:self-center">{alerta.timestamp}</span>
              </div>
              
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{alerta.explicacion}</p>
              
              {!alerta.esDerroche && (
                <div className="mt-3 text-[10px] text-emerald-400 font-mono bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-lg">
                  💡 <span className="font-bold">Criterio EQUIA:</span> El sistema identificó este ciclo como consumo normal esperado para evitar falsas alarmas y cuidar la experiencia del usuario.
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Criterio de Mediana Histórica */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-mono">
          <span className="text-cyan-400 font-bold">📊 MOTOR ANALÍTICO:</span> Las anomalías de consumo en horario vacío se contrastan contra la <span className="text-slate-200 font-bold">mediana histórica de los últimos 28 días</span>, no contra el promedio, para mitigar el impacto de picos aislados de energía.
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
