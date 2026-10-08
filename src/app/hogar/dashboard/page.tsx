'use client';
import React, { useState } from 'react';

export default function HogarDashboard() {
  const [activeTab, setActiveTab] = useState('mes');

  // Datos semilla basados en el dataset sintético residencial EQUIA
  const metrics = {
    consumoActual: '385 W',
    gastoEstimadoPeriodo: '\$18.450',
    categoriaTarifa: 'T1R - R2 (CABA)',
    certezaDato: 'Estimado'
  };

  const electrodomesticos = [
    { name: 'Heladera con Freezer', consumo: '90W', estado: 'Encendido (Ciclo normal)', certeza: 'Medido' },
    { name: 'Aire Acondicionado Split', consumo: '1200W', estado: 'Apagado', certeza: 'Simulado' },
    { name: 'Iluminación Living (LED)', consumo: '45W', estado: 'Encendido', certeza: 'Medido' },
    { name: 'Smart TV 55"', consumo: '110W', estado: 'Encendido', certeza: 'Estimado' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="text-emerald-400 text-xs font-mono mb-1">PLATAFORMA EQUIA &bull; RESIDENCIAL</div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Mi Casa &mdash; Monitoreo</h1>
          </div>
          
          {/* Selector de Período */}
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-medium self-start md:self-center">
            {['dia', 'semana', 'mes', 'año'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg capitalize transition-all ${
                  activeTab === tab ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tarjetas de Métricas Clave */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-medium">Potencia Instantánea</span>
            <div className="text-3xl font-black text-emerald-400 font-mono">{metrics.consumoActual}</div>
            <span className="inline-flex text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">Dato Medido</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-medium">Gasto Proyectado ({activeTab})</span>
            <div className="text-3xl font-black text-slate-100 font-mono">{metrics.gastoEstimadoPeriodo}</div>
            <span className="inline-flex text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono">Dato Estimado</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-medium">Segmentación Tarifaria</span>
            <div className="text-xl font-bold text-cyan-400 pt-1">{metrics.categoriaTarifa}</div>
            <span className="text-[10px] text-slate-500 block">Jurisdicción Edenor/Edesur CABA</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-medium">Transparencia Metodológica</span>
            <div className="text-sm font-semibold text-slate-300 pt-1">Certeza de Datos Mixta</div>
            <p className="text-[10px] text-slate-400 leading-tight">Clasificación rigurosa según origen de la telemetría.</p>
          </div>
        </div>

        {/* Detalle por Electrodoméstico */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h2 className="text-lg font-bold">Desglose de Consumo del Hogar</h2>
            <p className="text-xs text-slate-400">Inventario de artefactos vinculados y estado en tiempo real.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-xs">
                  <th className="pb-3 font-medium">Artefacto</th>
                  <th className="pb-3 font-medium">Potencia</th>
                  <th className="pb-3 font-medium">Estado actual</th>
                  <th className="pb-3 font-medium text-right">Origen Metodológico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {electrodomesticos.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 font-semibold text-slate-200 flex items-center gap-2">
                      <span>{item.name === 'Heladera con Freezer' ? '❄️' : item.name === 'Aire Acondicionado Split' ? '💨' : item.name === 'Iluminación Living (LED)' ? '💡' : '📺'}</span>
                      {item.name}
                    </td>
                    <td className="py-3 font-mono text-slate-300">{item.consumo}</td>
                    <td className="py-3 text-slate-400">{item.estado}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-mono ${
                        item.certeza === 'Medido' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                        item.certeza === 'Estimado' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' :
                        'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                      }`}>
                        {item.certeza}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Navegación Interna */}
        <div className="flex gap-4 text-xs font-medium pt-2">
          <a href="/hogar/simulator" className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors text-slate-300">
            &rarr; Ir al Simulador de Ahorro Residencial
          </a>
          <a href="/hogar/alerts" className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors text-slate-300">
            🚨 Ver Historial de Alertas
          </a>
        </div>

      </div>
    </div>
  );
}
