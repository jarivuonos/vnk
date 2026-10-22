'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useVnkStore } from '@/lib/store';
import { RefreshCw, Radio, CheckCircle2, FileText, Gavel, Archive, Layers } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { state, palautaAlkuperaisetTiedot } = useVnkStore();
  const [resetting, setResetting] = useState(false);

  const activeIstunto = state.istunnot.find((i) => i.tila === 'KAYNNISSA');

  const handleReset = () => {
    if (confirm('Haluatko palauttaa esimerkkidatan alkuperäiseen tilaan?')) {
      setResetting(true);
      palautaAlkuperaisetTiedot();
      setTimeout(() => setResetting(false), 500);
    }
  };

  const navLinks = [
    { href: '/', label: 'Yleisnäkymä', icon: Layers },
    { href: '/pts', label: 'PTS Päätöksenteko', icon: FileText, desc: 'Valmistelu & esityslista' },
    { href: '/ies', label: 'IES Istuntosovellus', icon: Gavel, desc: 'Istuntosali & päätökset' },
    { href: '/arkisto', label: 'Arkisto & Pöytäkirjat', icon: Archive, desc: 'VAHVA-arkisto' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top micro-bar */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="font-semibold text-slate-200 uppercase tracking-wider">
            Valtioneuvoston kanslia
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">VAHVA Päätöksentekojärjestelmä (PTS & IES)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded text-[11px]">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>Välilehtisynkronointi aktiivinen</span>
          </div>
          <button
            onClick={handleReset}
            disabled={resetting}
            title="Palauta alkuperäinen demodata"
            className="flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors text-[11px] py-0.5 px-2 rounded hover:bg-slate-800"
          >
            <RefreshCw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
            <span>Nollaa demodata</span>
          </button>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-blue-600 border border-blue-400 flex items-center justify-center font-bold text-white shadow-sm group-hover:bg-blue-500 transition-colors">
              <span className="text-lg">🏛️</span>
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-white flex items-center gap-2">
                VALTIONEUVOSTO
                <span className="text-[10px] bg-blue-900/80 text-blue-300 border border-blue-700/60 font-mono px-1.5 py-0.2 rounded font-normal">
                  PTS & IES
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-normal -mt-0.5">
                Valtioneuvoston päätöksenteon ja istuntojen sähköinen järjestelmä
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Live session pill */}
        <div className="flex items-center gap-3">
          {activeIstunto ? (
            <Link
              href="/ies"
              className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 hover:border-amber-400 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>
                Istunto käynnissä:{' '}
                <strong className="text-amber-200">{activeIstunto.otsikko}</strong>
              </span>
            </Link>
          ) : (
            <div className="hidden lg:flex items-center gap-2 text-slate-400 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Ei aktiivista istuntoa salissa</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
