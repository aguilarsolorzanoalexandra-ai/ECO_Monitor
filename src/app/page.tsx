'use client';
import React from 'react';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 antialiased selection:bg-cyan-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-2xl w-full text-center space-y-8 relative">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <span> CONVERGE Hackathon Prototipo Activo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            ECO-Monitor + EQUIA
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-md mx-auto">
            Plataforma Unificada de Gestión y Eficiencia Energética Eficaz. Seleccione el perfil para comenzar el monitoreo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
          {/* Perfil Residencial (Hogar - EQUIA) */}
          <Link href="/hogar/dashboard" className="group text-left p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col justify-between h-48">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                
              </div>
              <h2 className="text-xl font-bold group-hover:text-emerald-400 transition-colors">Perfil Hogar</h2>
              <p className="text-xs text-slate-400 leading-relaxed">Módulo EQUIA. Análisis empático, 7 categorías tarifarias residenciales CABA y control de electrodomésticos.</p>
            </div>
            <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Ingresar sistema &rarr;
            </span>
          </Link>

          {/* Perfil Comercial (Kiosco Central) */}
          <Link href="/dashboard" className="group text-left p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] flex flex-col justify-between h-48">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                
              </div>
              <h2 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">Perfil Comercio</h2>
              <p className="text-xs text-slate-400 leading-relaxed">Kiosco Central. Monitoreo comercial general, picos de demanda y alertas analíticas de madrugada.</p>
            </div>
            <span className="text-cyan-400 font-semibold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Ingresar sistema &rarr;
            </span>
          </Link>
        </div>

        <div className="text-xs text-slate-600 font-mono">
          Ecosistema Relacional Integrado &bull; Supabase PostgreSQL
        </div>
      </div>
    </div>
  );
}
