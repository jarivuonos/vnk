'use client';

import Link from 'next/link';
import { useVnkStore } from '@/lib/store';
import {
  FileText,
  Gavel,
  Archive,
  ArrowRight,
  CheckCircle2,
  Split,
  PlayCircle,
  Building2,
} from 'lucide-react';

export default function HomePage() {
  const { state } = useVnkStore();

  const valmistelussaCount = state.asiat.filter(
    (a) => a.tila === 'VALMISTELUSSA' || a.tila === 'TARKASTUKSESSA'
  ).length;
  const esityslistallaCount = state.asiat.filter(
    (a) => a.tila === 'HYVAKSYTTY_ESITYSLISTALLE' || a.tila === 'ISTUNTOKASITTELYSSA'
  ).length;
  const paatettyCount = state.asiat.filter(
    (a) => a.tila === 'PAATETTY' || a.tila === 'POYDATTY' || a.tila === 'ERI_MIELIPIDE' || a.tila === 'ARKISTOITU'
  ).length;

  const kaynnissaOlevaIstunto = state.istunnot.find((i) => i.tila === 'KAYNNISSA');
  const tulevatIstunnot = state.istunnot.filter((i) => i.tila !== 'PAATTYNYT');

  return (
    <div className="space-y-10 pb-16">
      {/* Hero section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/60 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Building2 className="w-3.5 h-3.5" />
            Valtioneuvoston kanslia • Päätöksentekojärjestelmät
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Valtioneuvoston sähköinen päätöksenteko ja istuntohallinta
          </h1>
          <p className="text-slate-300 max-w-3xl text-base sm:text-lg leading-relaxed mb-8">
            Tämä kokonaisuus mallintaa Valtioneuvoston kanslian (VNK) ja ministeriöiden yhteisen
            päätöksenteon elinkaaren: asioiden valmistelun ja esityslistojen laadinnan (<strong>PTS</strong>),
            reaaliaikaisen istuntokäsittelyn (<strong>IES</strong>) sekä päätösten arkistoinnin VAHVA-asianhallinnassa.
          </p>

          {/* Quick Demo side-by-side callout */}
          <div className="bg-blue-950/80 border border-blue-800/80 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-600/30 text-blue-300 shrink-0 mt-0.5">
                <Split className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Vinkki: Kokeile avaamalla kaksi selainikkunaa rinnakkain!
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Avaa vasempaan ikkunaan <strong>PTS</strong> (esittelijä valmistelee asian ja vie sen esityslistalle) ja
                  oikeaan ikkunaan <strong>IES</strong> (ministerit käsittelevät ja päättävät asian istuntosalissa).
                  Selaintallennus ja BroadcastChannel synkronoivat tilan reaaliajassa ruudulta toiselle.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/pts"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <span>Avaa PTS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/ies"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <span>Avaa IES</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main interactive cards & lifecycle */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Metric pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">PTS-valmistelussa</span>
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{valmistelussaCount} kpl</div>
            <div className="text-xs text-slate-500 mt-1">Valmistelussa tai tarkastuskierroksella</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Esityslistalla / IES</span>
              <Gavel className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{esityslistallaCount} kpl</div>
            <div className="text-xs text-slate-500 mt-1">
              {kaynnissaOlevaIstunto ? 'Istunto käynnissä salissa' : 'Odottaa istunnon avaamista'}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Päätetty & Arkistoitu</span>
              <Archive className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{paatettyCount} kpl</div>
            <div className="text-xs text-slate-500 mt-1">Päätöspöytäkirjat ja toimenpidejakelu</div>
          </div>
        </div>

        {/* System Applications Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PTS Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-colors group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                  <FileText className="w-3.5 h-3.5" />
                  Valmistelu & asianhallinta
                </span>
                <span className="text-xs font-mono text-slate-400">PTS-MODUULI</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                PTS – Päätöksentekosovellus
              </h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Ministeriöiden esittelijöiden ja valmistelijoiden työkalu. Asiakirjojen laadinta,
                esittelymuistiot, lakiluonnokset, jakelut, tarkastuskierrot sekä asioiden vieminen
                Valtioneuvoston yleisistunnon, Tasavallan presidentin esittelyn tai Raha-asiainvaliokunnan esityslistalle.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  Luo uusi päätösasia diaarinumeroineen
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  Kirjoita päätösehdotus ja esittelymuistio
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  Hyväksy asia esityslistalle ja lukitse istunto
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Rooli: Virkamies / Esittelijä</span>
              <Link
                href="/pts"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                <span>Siirry PTS:ään</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* IES Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-colors group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                  <Gavel className="w-3.5 h-3.5" />
                  Istuntosali & päätöksenteko
                </span>
                <span className="text-xs font-mono text-slate-400">IES-MODUULI</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                IES – Istuntosovellus
              </h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Ministereiden, pääministerin, presidentin ja istuntosihteerin reaaliaikainen
                kosketusnäyttösovellus salissa. Läsnäolon ja esteellisyyksien (jääviyksien) ilmoitus,
                pykäläkohtainen asioiden käsittely sekä päätösten ja eriävien mielipiteiden kirjaaminen.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  Reaaliaikainen asialistan pykälien läpikäynti
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  Ministerin esteellisyyden (hallintolaki 28 §) ilmoitus
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  Päätöksen kirjaaminen: hyväksytty, pöydätty tai eriävä mielipide
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Rooli: Ministeri / Istunnon pj</span>
              <Link
                href="/ies"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                <span>Siirry IES:ään</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Decision Lifecycle Flow Banner */}
        <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>Valtioneuvoston päätöksenteon elinkaari</span>
            <span className="text-xs bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded font-normal">
              PTS ➔ IES ➔ VAHVA-ARKISTO
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl">
              <div className="text-blue-400 font-semibold mb-1">1. Valmistelu (PTS)</div>
              <div className="font-medium text-white text-sm mb-1">Asian laadinta</div>
              <p className="text-slate-400 leading-relaxed">
                Virkamies laatii esittelymuistion, päätösehdotuksen ja liittää säädösluonnokset diaarinumerolle.
              </p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl">
              <div className="text-blue-400 font-semibold mb-1">2. Tarkastus & Lista (PTS)</div>
              <div className="font-medium text-white text-sm mb-1">Esityslistan lukitus</div>
              <p className="text-slate-400 leading-relaxed">
                Johdon tarkastuskierroksen jälkeen asia liitetään istuntoon pykäläksi ja esityslista lukitaan.
              </p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl">
              <div className="text-amber-400 font-semibold mb-1">3. Istunto (IES)</div>
              <div className="font-medium text-white text-sm mb-1">Päätöksenteko salissa</div>
              <p className="text-slate-400 leading-relaxed">
                Ministerit toteavat läsnäolon, ilmoittavat esteellisyydet ja puheenjohtaja kirjaa tehdyt päätökset.
              </p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl">
              <div className="text-emerald-400 font-semibold mb-1">4. Pöytäkirja (Arkisto)</div>
              <div className="font-medium text-white text-sm mb-1">Vahvistus & jakelu</div>
              <p className="text-slate-400 leading-relaxed">
                Päätökset arkistoidaan VAHVAan, muodostetaan virallinen pöytäkirja ja toimenpiteet välitetään Finlexiin / Eduskuntaan.
              </p>
            </div>
          </div>
        </div>

        {/* Current Active & Upcoming Sessions Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Istunnot järjestelmässä</h3>
              <p className="text-xs text-slate-500">Valtioneuvoston yleisistunnot, TP-esittelyt ja valiokunnat</p>
            </div>
            <Link
              href="/ies"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Siirry istuntosovellukseen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {tulevatIstunnot.map((istunto) => {
              const asiatCount = state.asiat.filter((a) => a.istuntoId === istunto.id).length;
              return (
                <div key={istunto.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                        istunto.tila === 'KAYNNISSA'
                          ? 'bg-amber-500 animate-ping'
                          : istunto.tila === 'LUKITTU'
                          ? 'bg-blue-500'
                          : 'bg-slate-300'
                      }`}
                    />
                    <div>
                      <div className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                        {istunto.otsikko}
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                            istunto.tila === 'KAYNNISSA'
                              ? 'bg-amber-100 text-amber-800 font-semibold'
                              : istunto.tila === 'LUKITTU'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {istunto.tila === 'KAYNNISSA'
                            ? 'KÄYNNISSÄ SALISSA'
                            : istunto.tila === 'LUKITTU'
                            ? 'ESITYSLISTA LUKITTU'
                            : 'VALMISTELUSSA'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1 mt-0.5">
                        <span>Pj: {istunto.puheenjohtaja}</span>
                        <span>•</span>
                        <span>{new Date(istunto.ajankohta).toLocaleString('fi-FI', { dateStyle: 'short', timeStyle: 'short' })}</span>
                        <span>•</span>
                        <span>{asiatCount} esityslista-asiaa</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/ies?istuntoId=${istunto.id}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
                      <span>Avaa IES-istunto</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
