'use client';

import { useState } from 'react';
import { useVnkStore } from '@/lib/store';
import { Istunto, Asia } from '@/lib/types';
import {
  Archive,
  FileText,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Building,
  Calendar,
  Gavel,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function ArkistoPage() {
  const { state } = useVnkStore();
  const [valittuIstuntoId, setValittuIstuntoId] = useState<string>(
    state.istunnot.find((i) => i.tila === 'PAATTYNYT')?.id || state.istunnot[0]?.id || ''
  );
  const [valittuAsiaId, setValittuAsiaId] = useState<string | null>(null);

  const valittuIstunto = state.istunnot.find((i) => i.id === valittuIstuntoId);
  const istunnonAsiat = state.asiat
    .filter((a) => a.istuntoId === valittuIstuntoId)
    .sort((a, b) => (a.pykalaNumero ?? 0) - (b.pykalaNumero ?? 0));

  const tarkasteltavaAsia = state.asiat.find((a) => a.id === valittuAsiaId) || istunnonAsiat[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              VAHVA ARKISTOINTI
            </span>
            <span className="text-xs text-slate-500">• Valtioneuvoston viralliset päätöspöytäkirjat</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Päätökset, pöytäkirjat ja toimenpiteet</h1>
          <p className="text-sm text-slate-600 mt-1">
            Istunnoissa tehtyjen päätösten arkistoidut asiakirjat, ministereiden esteellisyysmerkinnät ja
            viralliset pöytäkirjan otteet säädösjakelua ja eduskuntaa varten.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Tulosta pöytäkirjanote</span>
          </button>
        </div>
      </div>

      {/* Selector: Choose which Istunto to view */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Valitse tarkasteltava istunto:
          </span>
          <div className="text-sm font-bold text-white mt-0.5">
            {valittuIstunto?.otsikko} (Pöytäkirja: {valittuIstunto?.poytakirjaNumero || 'Luonnos'})
          </div>
        </div>

        <select
          value={valittuIstuntoId}
          onChange={(e) => {
            setValittuIstuntoId(e.target.value);
            setValittuAsiaId(null);
          }}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 max-w-md focus:outline-hidden"
        >
          {state.istunnot.map((i) => (
            <option key={i.id} value={i.id}>
              {i.otsikko} – {i.tila} ({new Date(i.ajankohta).toLocaleDateString('fi-FI')})
            </option>
          ))}
        </select>
      </div>

      {/* Main Grid: Pykälät / Asiat left, Official Decision Extract right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Asiat list */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100 mb-3 flex items-center justify-between">
              <span>Istunnon käsitellyt asiat</span>
              <span className="text-[11px] font-mono text-slate-500">{istunnonAsiat.length} kpl</span>
            </h3>

            {istunnonAsiat.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Tälle istunnolle ei löydy kirjattuja asioita.
              </div>
            ) : (
              <div className="space-y-2">
                {istunnonAsiat.map((asia) => {
                  const isSelected = (tarkasteltavaAsia?.id || istunnonAsiat[0]?.id) === asia.id;
                  return (
                    <div
                      key={asia.id}
                      onClick={() => setValittuAsiaId(asia.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-xs text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                          {asia.pykalaNumero ?? '–'} §
                        </span>
                        <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {asia.diaarinumero}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {asia.paatosmerkinta?.paatosTyyppi || asia.tila}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-1">
                        {asia.otsikko}
                      </h4>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{asia.ministerio}</span>
                        {asia.esteellisyydet.length > 0 && (
                          <span className="text-red-700 font-semibold flex items-center gap-1">
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
        </div>

        {/* Right Column: Virallinen päätöspöytäkirjaote */}
        <div className="lg:col-span-7">
          {tarkasteltavaAsia ? (
            <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-sm space-y-6 print:border-none print:p-0 print:shadow-none font-serif">
              {/* Official Government Header */}
              <div className="border-b-2 border-slate-900 pb-5 text-center space-y-1">
                <div className="text-xs font-sans font-bold tracking-widest uppercase text-slate-700">
                  VALTIONEUVOSTO • STATSRÅDET
                </div>
                <h2 className="text-lg font-bold text-slate-950 font-sans uppercase">
                  Päätöspöytäkirjanote
                </h2>
                <div className="text-xs font-sans text-slate-600">
                  {valittuIstunto?.otsikko} • {valittuIstunto?.paikka}
                </div>
                <div className="text-xs font-mono font-semibold text-slate-800 pt-1">
                  Pöytäkirjanumero: {valittuIstunto?.poytakirjaNumero || 'VN/YI/2026/LUONNOS'}
                </div>
              </div>

              {/* Pykälä tiedot */}
              <div className="space-y-4 text-sm leading-relaxed text-slate-900">
                <div className="flex items-center justify-between font-sans text-xs border-b border-slate-200 pb-2">
                  <span>
                    <strong>Pykälä:</strong> {tarkasteltavaAsia.pykalaNumero} §
                  </span>
                  <span>
                    <strong>Diaarinumero:</strong> {tarkasteltavaAsia.diaarinumero}
                  </span>
                  <span>
                    <strong>Julkisuus:</strong> {tarkasteltavaAsia.salassapito}
                  </span>
                </div>

                <div>
                  <h3 className="font-sans font-bold text-base text-slate-950 mb-1">
                    {tarkasteltavaAsia.otsikko}
                  </h3>
                  <div className="font-sans text-xs text-slate-600 flex flex-wrap gap-x-4">
                    <span>
                      <strong>Ministeriö:</strong> {tarkasteltavaAsia.ministerio}
                    </span>
                    <span>
                      <strong>Esittelijä:</strong> {tarkasteltavaAsia.esittelija.nimi} (
                      {tarkasteltavaAsia.esittelija.virkanimike})
                    </span>
                  </div>
                </div>

                {/* Esteellisyydet pöytäkirjassa */}
                {tarkasteltavaAsia.esteellisyydet.length > 0 && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs font-sans">
                    <strong>Pöytäkirjaan merkitty esteellisyys (Hallintolaki 28 §):</strong>
                    {tarkasteltavaAsia.esteellisyydet.map((e, idx) => (
                      <div key={idx} className="mt-1">
                        Ministeri <strong>{e.ministeriNimi}</strong> ilmoitti olevansa esteellinen (
                        {e.peruste}) eikä osallistunut asian käsittelyyn tai päätöksentekoon.
                      </div>
                    ))}
                  </div>
                )}

                {/* Esittelijän ehdotus */}
                <div>
                  <div className="font-sans font-bold text-xs uppercase tracking-wider text-slate-600 mb-1">
                    Esittelijän päätösehdotus:
                  </div>
                  <div className="p-3 bg-slate-50 border-l-2 border-slate-400 italic">
                    {tarkasteltavaAsia.paatosehdotus}
                  </div>
                </div>

                {/* Tehty päätös */}
                <div className="p-4 bg-emerald-50/60 border border-emerald-300 rounded-lg">
                  <div className="font-sans font-bold text-xs uppercase tracking-wider text-emerald-900 mb-1">
                    Valtioneuvoston päätös:
                  </div>
                  <p className="font-semibold text-emerald-950">
                    {tarkasteltavaAsia.paatosmerkinta?.teksti ||
                      'Valtioneuvosto hyväksyi esityksen päätösehdotuksen mukaisesti sellaisenaan.'}
                  </p>

                  {tarkasteltavaAsia.paatosmerkinta?.eriavatMielipiteet && (
                    <div className="mt-3 pt-3 border-t border-emerald-200 text-xs font-sans">
                      <strong>Eriävä mielipide:</strong>
                      {tarkasteltavaAsia.paatosmerkinta.eriavatMielipiteet.map((em, idx) => (
                        <div key={idx} className="mt-1 italic text-slate-800">
                          &quot;{em.mielipide}&quot; – {em.ministeriNimi}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Allekirjoitukset & Vahvistus */}
                <div className="pt-8 border-t border-slate-200 font-sans text-xs grid grid-cols-2 gap-8">
                  <div>
                    <div className="border-b border-slate-400 pb-8 text-slate-400 italic">
                      [Sähköisesti varmennettu VAHVA-asianhallinnassa]
                    </div>
                    <div className="font-bold text-slate-900 mt-2">
                      {valittuIstunto?.puheenjohtaja}
                    </div>
                    <div className="text-slate-500">Istunnon puheenjohtaja</div>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 pb-8 text-slate-400 italic">
                      [Sähköisesti varmennettu VAHVA-asianhallinnassa]
                    </div>
                    <div className="font-bold text-slate-900 mt-2">
                      {valittuIstunto?.istuntosihteeri}
                    </div>
                    <div className="text-slate-500">Istuntosihteeri</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
              Valitse asia tarkastellaksesi sen virallista pöytäkirjanotetta.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
