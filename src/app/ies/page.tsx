'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useVnkStore } from '@/lib/store';
import { Asia, Istunto, Ministeri } from '@/lib/types';
import {
  Gavel,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  PauseCircle,
  PlayCircle,
  ShieldAlert,
  Archive,
  ChevronRight,
  ExternalLink,
  UserCheck,
  Building,
  Flag,
} from 'lucide-react';
import Link from 'next/link';

function IesContent() {
  const searchParams = useSearchParams();
  const requestedIstuntoId = searchParams.get('istuntoId');

  const {
    state,
    aloitaIstunto,
    vaihdaAktiivinenPykala,
    toggleMinisterinLasnaolo,
    ilmoitaEsteellisyys,
    poistaEsteellisyys,
    teePaatos,
    paataIstunto,
    vaihdaRooli,
    vaihdaValittuMinisteri,
  } = useVnkStore();

  // Find active or selected istunto
  const currentIstunto =
    (requestedIstuntoId && state.istunnot.find((i) => i.id === requestedIstuntoId)) ||
    state.istunnot.find((i) => i.tila === 'KAYNNISSA') ||
    state.istunnot.find((i) => i.tila === 'LUKITTU') ||
    state.istunnot[0];

  const istunnonAsiat = state.asiat
    .filter((a) => a.istuntoId === currentIstunto?.id)
    .sort((a, b) => (a.pykalaNumero ?? 0) - (b.pykalaNumero ?? 0));

  const aktiivinenAsia =
    state.asiat.find((a) => a.id === currentIstunto?.aktiivinenPykalaId) ||
    istunnonAsiat.find((a) => a.tila === 'ISTUNTOKASITTELYSSA') ||
    istunnonAsiat[0];

  // Local state for decision / dissenting opinion dialog
  const [showEriavaModal, setShowEriavaModal] = useState(false);
  const [eriavaTeksti, setEriavaTeksti] = useState('');
  const [showEsteellisyysModal, setShowEsteellisyysModal] = useState(false);
  const [esteellisyysPeruste, setEsteellisyysPeruste] = useState(
    'Hallintolain 28 § 1 mom. 5 kohta (intressijääviys)'
  );

  const nykyinenMinisteri =
    state.istunnot
      .flatMap((i) => i.osallistujat)
      .find((m) => m.id === state.valittuMinisteriId) || state.istunnot[0]?.osallistujat[0];

  const onkoEsteellinen = aktiivinenAsia?.esteellisyydet.some(
    (e) => e.ministeriId === state.valittuMinisteriId
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Session Header & Mode Bar */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                VAHVA IES • ISTUNTOSOVELLUS
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  currentIstunto?.tila === 'KAYNNISSA'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                    : currentIstunto?.tila === 'PAATTYNYT'
                    ? 'bg-slate-700 text-slate-300'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}
              >
                {currentIstunto?.tila === 'KAYNNISSA'
                  ? 'ISTUNTO KÄYNNISSÄ SALISSA'
                  : currentIstunto?.tila === 'PAATTYNYT'
                  ? 'ISTUNTO PÄÄTTYNYT'
                  : 'VALMIS ALOITETTAVAKSI'}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Gavel className="w-6 h-6 text-amber-400" />
              <span>{currentIstunto?.otsikko}</span>
            </h1>
            <p className="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1 pt-1">
              <span>
                <strong>Puheenjohtaja:</strong> {currentIstunto?.puheenjohtaja}
              </span>
              <span>•</span>
              <span>
                <strong>Sihteeri:</strong> {currentIstunto?.istuntosihteeri}
              </span>
              <span>•</span>
              <span>
                <strong>Paikka:</strong> {currentIstunto?.paikka}
              </span>
            </p>
          </div>

          {/* Role selector inside IES */}
          <div className="bg-slate-850 border border-slate-700/80 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                Käyttäjärooli salissa:
              </span>
              <div className="flex items-center gap-1 mt-1">
                <button
                  onClick={() => vaihdaRooli('SIHTEERI')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    state.kayttajarooli === 'SIHTEERI'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Puheenjohtaja / Sihteeri
                </button>
                <button
                  onClick={() => vaihdaRooli('MINISTERI')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    state.kayttajarooli === 'MINISTERI'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Ministeri (Pääte)
                </button>
              </div>
            </div>

            {state.kayttajarooli === 'MINISTERI' && currentIstunto && (
              <div className="border-t sm:border-t-0 sm:border-l border-slate-700 pt-2 sm:pt-0 sm:pl-3">
                <span className="block text-[10px] uppercase font-bold text-slate-400">
                  Valitse ministeri:
                </span>
                <select
                  value={state.valittuMinisteriId}
                  onChange={(e) => vaihdaValittuMinisteri(e.target.value)}
                  className="mt-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 max-w-[190px] focus:outline-hidden"
                >
                  {currentIstunto.osallistujat.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nimi} ({m.salkku})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Istunnon elinkaaripainikkeet (vain puheenjohtaja / sihteeri) */}
        {state.kayttajarooli === 'SIHTEERI' && currentIstunto && (
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              {currentIstunto.tila === 'VALMISTELUSSA' || currentIstunto.tila === 'LUKITTU' ? (
                <span>Istunnon esityslista on koossa. Voit avata istunnon virallista käsittelyä varten.</span>
              ) : currentIstunto.tila === 'KAYNNISSA' ? (
                <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Istunto on käynnissä. Päätökset tallentuvat reaaliajassa pöytäkirjaan.
                </span>
              ) : (
                <span className="text-emerald-400">
                  Istunto on päättynyt ja arkistoitu VAHVAan (Pöytäkirja: {currentIstunto.poytakirjaNumero}).
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {currentIstunto.tila !== 'KAYNNISSA' && currentIstunto.tila !== 'PAATTYNYT' && (
                <button
                  onClick={() => aloitaIstunto(currentIstunto.id)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Avaa istunto salissa</span>
                </button>
              )}

              {currentIstunto.tila === 'KAYNNISSA' && (
                <button
                  onClick={() => {
                    if (
                      confirm(
                        'Haluatko varmasti päättää istunnon ja vahvistaa virallisen päätöspöytäkirjan?'
                      )
                    ) {
                      paataIstunto(currentIstunto.id);
                    }
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Archive className="w-4 h-4" />
                  <span>Päätä istunto ja arkistoi pöytäkirja</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Agenda column & Active Pykälä Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Asialista (Pykälät 1 §, 2 §, ...) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>Esityslista</span>
                <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">
                  {istunnonAsiat.length} asiaa
                </span>
              </h3>
              <span className="text-[11px] text-slate-500">Valitse pykälä</span>
            </div>

            {istunnonAsiat.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Tälle istunnolle ei ole vielä liitetty asioita PTS:ssä.
              </div>
            ) : (
              <div className="space-y-2">
                {istunnonAsiat.map((asia) => {
                  const isActive = aktiivinenAsia?.id === asia.id;
                  const isDecided =
                    asia.tila === 'PAATETTY' ||
                    asia.tila === 'POYDATTY' ||
                    asia.tila === 'ERI_MIELIPIDE' ||
                    asia.tila === 'ARKISTOITU';

                  return (
                    <div
                      key={asia.id}
                      onClick={() => {
                        if (currentIstunto) {
                          vaihdaAktiivinenPykala(currentIstunto.id, asia.id);
                        }
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isActive
                          ? 'bg-amber-50/80 border-amber-500 shadow-xs ring-1 ring-amber-500'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-xs text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                          {asia.pykalaNumero ?? '–'} §
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            asia.tila === 'ISTUNTOKASITTELYSSA'
                              ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                              : isDecided
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {asia.tila === 'ISTUNTOKASITTELYSSA'
                            ? 'KÄSITTELYSSÄ'
                            : isDecided
                            ? 'PÄÄTETTY'
                            : 'ODOTTAA'}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-1">
                        {asia.otsikko}
                      </h4>

                      <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="truncate max-w-[170px]">{asia.ministerio}</span>
                        {asia.esteellisyydet.length > 0 && (
                          <span className="text-red-600 font-semibold flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" />
                            {asia.esteellisyydet.length} jäävi
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Läsnäolijat & Esteellisyydet card */}
          {currentIstunto && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>Läsnäolo ja esteellisyydet</span>
                </h4>
                <span className="text-[10px] text-slate-500">
                  {currentIstunto.osallistujat.filter((m) => m.lasna).length}/
                  {currentIstunto.osallistujat.length} läsnä
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
                {currentIstunto.osallistujat.map((m) => {
                  const onJääviNykyisessä = aktiivinenAsia?.esteellisyydet.some(
                    (e) => e.ministeriId === m.id
                  );

                  return (
                    <div
                      key={m.id}
                      className="py-2 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          disabled={state.kayttajarooli !== 'SIHTEERI'}
                          onClick={() => toggleMinisterinLasnaolo(currentIstunto.id, m.id)}
                          title={state.kayttajarooli === 'SIHTEERI' ? 'Vaihda läsnäolo' : undefined}
                          className={`w-3 h-3 rounded-full ${
                            m.lasna ? 'bg-emerald-500' : 'bg-slate-300'
                          } ${state.kayttajarooli === 'SIHTEERI' ? 'cursor-pointer' : ''}`}
                        />
                        <div>
                          <div className="font-medium text-slate-900">{m.nimi}</div>
                          <div className="text-[10px] text-slate-500">{m.salkku}</div>
                        </div>
                      </div>

                      {onJääviNykyisessä && (
                        <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>ESTEELLINEN</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Aktiivinen Pykälä ja Päätöksenteko */}
        <div className="lg:col-span-8 space-y-6">
          {aktiivinenAsia ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              {/* Pykälän otsikko */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-lg">
                      {aktiivinenAsia.pykalaNumero} §
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                      {aktiivinenAsia.diaarinumero}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {aktiivinenAsia.ministerio}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded ${
                      aktiivinenAsia.tila === 'ISTUNTOKASITTELYSSA'
                        ? 'bg-amber-100 text-amber-800'
                        : aktiivinenAsia.tila === 'PAATETTY'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    TILA: {aktiivinenAsia.tila}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                  {aktiivinenAsia.otsikko}
                </h2>
                <div className="mt-2 text-xs text-slate-600 flex flex-wrap gap-x-4">
                  <span>
                    <strong>Esittelijä:</strong> {aktiivinenAsia.esittelija.nimi} (
                    {aktiivinenAsia.esittelija.virkanimike})
                  </span>
                  <span>
                    <strong>Vastuuministeri:</strong> {aktiivinenAsia.vastuuministeri}
                  </span>
                </div>
              </div>

              {/* Ministerin esteellisyysilmoituspalkki (jos ministeri-roolissa) */}
              {state.kayttajarooli === 'MINISTERI' && nykyinenMinisteri && (
                <div
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    onkoEsteellinen
                      ? 'bg-red-50 border-red-300 text-red-900'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        onkoEsteellinen ? 'text-red-600' : 'text-slate-500'
                      }`}
                    />
                    <div>
                      <div className="text-xs font-bold">
                        {onkoEsteellinen
                          ? `Olet ilmoittanut esteellisyyden tähän pykälään (${nykyinenMinisteri.nimi})`
                          : `Esteellisyys (jääviys) tämän asian käsittelyssä? (${nykyinenMinisteri.nimi})`}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {onkoEsteellinen
                          ? 'Sinut on merkitty esteelliseksi. Et voi osallistua päätöksentekoon tässä pykälässä.'
                          : 'Jos sinulla tai läheiselläsi on intressijääviys (Hallintolaki 28 §), ilmoita esteellisyys välittömästi.'}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {onkoEsteellinen ? (
                      <button
                        onClick={() => poistaEsteellisyys(aktiivinenAsia.id, state.valittuMinisteriId)}
                        className="px-3 py-1.5 bg-white border border-red-300 hover:bg-red-100 text-red-800 rounded-lg text-xs font-semibold"
                      >
                        Peruuta esteellisyys
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowEsteellisyysModal(true)}
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Flag className="w-3.5 h-3.5" />
                        <span>Ilmoita esteellisyys</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Esteellisyydet listattuna kaikille */}
              {aktiivinenAsia.esteellisyydet.length > 0 && (
                <div className="bg-red-50/70 border border-red-200 rounded-xl p-3.5">
                  <div className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Kirjatut esteellisyydet tähän pykälään:</span>
                  </div>
                  <div className="space-y-1">
                    {aktiivinenAsia.esteellisyydet.map((e) => (
                      <div
                        key={e.ministeriId}
                        className="text-xs text-red-950 flex items-center justify-between"
                      >
                        <span>
                          <strong>{e.ministeriNimi}:</strong> {e.peruste}
                        </span>
                        <span className="text-[10px] text-red-600">
                          {new Date(e.ilmoitettuAika).toLocaleTimeString('fi-FI', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Päätösehdotus */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Esittelijän päätösehdotus</span>
                </h4>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif text-slate-900 leading-relaxed">
                  {aktiivinenAsia.paatosehdotus}
                </div>
              </div>

              {/* Esittelymuistio */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Esittelymuistio ja taustatiedot
                </h4>
                <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line">
                  {aktiivinenAsia.esittelymuistio}
                </div>
              </div>

              {/* Asiakirjaliitteet */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Istuntoasiakirjat ({aktiivinenAsia.asiakirjat.length} kpl)
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {aktiivinenAsia.asiakirjat.map((liite) => (
                    <div
                      key={liite.id}
                      className="p-3 bg-white flex items-center justify-between text-xs hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-slate-800">{liite.nimi}</span>
                        <span className="text-[10px] text-slate-400">({liite.sivumaara} sivua)</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">{liite.koko}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Päätösmerkinnät (jos jo päätetty) */}
              {aktiivinenAsia.paatosmerkinta && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Istunnossa tehty päätös</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-mono">
                      Klo{' '}
                      {new Date(aktiivinenAsia.paatosmerkinta.paatettyKlo).toLocaleTimeString('fi-FI', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-950 font-medium">
                    {aktiivinenAsia.paatosmerkinta.teksti}
                  </p>

                  {aktiivinenAsia.paatosmerkinta.eriavatMielipiteet && (
                    <div className="mt-2 pt-2 border-t border-emerald-200 text-xs">
                      <strong>Eriävä mielipide pöytäkirjaan:</strong>
                      {aktiivinenAsia.paatosmerkinta.eriavatMielipiteet.map((em, idx) => (
                        <div key={idx} className="text-emerald-900 mt-1 italic">
                          &quot;{em.mielipide}&quot; – {em.ministeriNimi}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Puheenjohtajan / Sihteerin Päätöstoiminnot */}
              {state.kayttajarooli === 'SIHTEERI' && (
                <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Gavel className="w-4 h-4" />
                      <span>Istunnon puheenjohtajan päätöstoiminto</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Pykälän {aktiivinenAsia.pykalaNumero} § ratkaisu
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() =>
                        teePaatos(
                          aktiivinenAsia.id,
                          'HYVAKSYTTY',
                          'Valtioneuvosto hyväksyi esityksen esittelijän päätösehdotuksen mukaisesti sellaisenaan.'
                        )
                      }
                      className="p-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-left transition-colors group"
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>Hyväksytty</span>
                        <CheckCircle className="w-4 h-4 text-emerald-200" />
                      </div>
                      <div className="text-[10px] text-emerald-100 mt-1">
                        Esityksen mukaisesti sellaisenaan
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        teePaatos(
                          aktiivinenAsia.id,
                          'POYDATTY',
                          'Valtioneuvosto päätti panna asian pöydälle seuraavaan yleisistuntoon lisäselvityksiä varten.'
                        )
                      }
                      className="p-3 bg-amber-600 hover:bg-amber-500 rounded-lg text-left transition-colors group"
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>Pannaan pöydälle</span>
                        <PauseCircle className="w-4 h-4 text-amber-200" />
                      </div>
                      <div className="text-[10px] text-amber-100 mt-1">
                        Siirretään seuraavaan istuntoon
                      </div>
                    </button>

                    <button
                      onClick={() => setShowEriavaModal(true)}
                      className="p-3 bg-purple-700 hover:bg-purple-600 rounded-lg text-left transition-colors group"
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>Eriävä mielipide</span>
                        <Flag className="w-4 h-4 text-purple-200" />
                      </div>
                      <div className="text-[10px] text-purple-200 mt-1">
                        Kirjaa ministerin vastalause
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
              Ei valittua pykälää. Valitse asia esityslistalta vasemmalta.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Eriävä mielipide */}
      {showEriavaModal && aktiivinenAsia && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Kirjaa eriävä mielipide pöytäkirjaan
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Asia hyväksytään enemmistöpäätöksenä, mutta ministerin virallinen eriävä kanta merkitään pöytäkirjaan.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Eriävän mielipiteen esittänyt ministeri
                </label>
                <select
                  value={state.valittuMinisteriId}
                  onChange={(e) => vaihdaValittuMinisteri(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {currentIstunto?.osallistujat.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nimi} ({m.salkku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Eriävän mielipiteen sanamuoto
                </label>
                <textarea
                  rows={3}
                  placeholder="Esim. Katson, että määrärahan allokaatiosta tulisi päättää vasta lausuntokierroksen jälkeen..."
                  value={eriavaTeksti}
                  onChange={(e) => setEriavaTeksti(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowEriavaModal(false)}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold"
              >
                Peruuta
              </button>
              <button
                onClick={() => {
                  teePaatos(
                    aktiivinenAsia.id,
                    'ERI_MIELIPIDE',
                    'Valtioneuvosto hyväksyi esityksen. Pöytäkirjaan merkittiin ministerin eriävä mielipide.',
                    eriavaTeksti || 'Eriävä mielipide esityksen talousvaikutuksista.',
                    state.valittuMinisteriId
                  );
                  setShowEriavaModal(false);
                  setEriavaTeksti('');
                }}
                className="px-4 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-xs font-semibold"
              >
                Tallenna ja hyväksy päätös
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Esteellisyys (jääviys) ilmoitus */}
      {showEsteellisyysModal && aktiivinenAsia && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Ilmoita esteellisyys (Hallintolaki 28 §)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pykälä {aktiivinenAsia.pykalaNumero} §: {aktiivinenAsia.otsikko}
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Esteellinen ministeri
                </label>
                <div className="p-2 bg-slate-100 rounded-lg text-xs font-medium text-slate-800">
                  {nykyinenMinisteri?.nimi} ({nykyinenMinisteri?.salkku})
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Esteellisyyden lakisääteinen peruste
                </label>
                <select
                  value={esteellisyysPeruste}
                  onChange={(e) => setEsteellisyysPeruste(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Hallintolain 28 § 1 mom. 1 kohta (asianosaisjäävi)">
                    HL 28 § 1 mom. 1 k (asianosaisjäävi)
                  </option>
                  <option value="Hallintolain 28 § 1 mom. 2 kohta (edustajan jääviys)">
                    HL 28 § 1 mom. 2 k (edustajan jääviys)
                  </option>
                  <option value="Hallintolain 28 § 1 mom. 3 kohta (palvelusuhde- tai toimeksiantojäävi)">
                    HL 28 § 1 mom. 3 k (palvelussuhde tai toimeksianto)
                  </option>
                  <option value="Hallintolain 28 § 1 mom. 4 kohta (yhteisöjäävi)">
                    HL 28 § 1 mom. 4 k (hallituksen tai hallintoelimen jäsenyys)
                  </option>
                  <option value="Hallintolain 28 § 1 mom. 5 kohta (intressijääviys)">
                    HL 28 § 1 mom. 5 k (erityinen hyöty tai vahinko)
                  </option>
                  <option value="Hallintolain 28 § 1 mom. 7 kohta (yleislauseke)">
                    HL 28 § 1 mom. 7 k (luottamus puolueettomuuteen muusta erityisestä syystä vaarantuu)
                  </option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowEsteellisyysModal(false)}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold"
              >
                Peruuta
              </button>
              <button
                onClick={() => {
                  if (nykyinenMinisteri) {
                    ilmoitaEsteellisyys(
                      aktiivinenAsia.id,
                      nykyinenMinisteri.id,
                      nykyinenMinisteri.nimi,
                      esteellisyysPeruste
                    );
                  }
                  setShowEsteellisyysModal(false);
                }}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold"
              >
                Vahvista esteellisyys
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-slate-500 text-sm">Ladataan istuntosovellusta...</div>
      }
    >
      <IesContent />
    </Suspense>
  );
}
