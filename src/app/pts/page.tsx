'use client';

import { useState } from 'react';
import { useVnkStore } from '@/lib/store';
import { Asia, Istuntotyyppi } from '@/lib/types';
import {
  FileText,
  PlusCircle,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock,
  Send,
  Calendar,
  Layers,
  ChevronRight,
  FileCheck,
  AlertCircle,
  Eye,
  Lock,
  Building,
} from 'lucide-react';
import Link from 'next/link';

const MINISTERIOT = [
  'Valtioneuvoston kanslia',
  'Valtiovarainministeriö',
  'Oikeusministeriö',
  'Puolustusministeriö',
  'Ulkoministeriö',
  'Sisäministeriö',
  'Liikenne- ja viestintäministeriö',
  'Työ- ja elinkeinoministeriö',
  'Sosiaali- ja terveysministeriö',
  'Opetus- ja kulttuuriministeriö',
  'Ympäristöministeriö',
  'Maa- ja metsätalousministeriö',
];

export default function PtsPage() {
  const { state, createAsia, siirraTarkastukseen, hyvaksyEsityslistalle, lukitseEsityslista } =
    useVnkStore();

  const [activeTab, setActiveTab] = useState<'valmistelu' | 'tarkastus' | 'esityslista' | 'kaikki'>('valmistelu');
  const [valittuAsia, setValittuAsia] = useState<Asia | null>(state.asiat[0] || null);
  const [showUusiModal, setShowUusiModal] = useState(false);
  const [targetIstuntoId, setTargetIstuntoId] = useState<string>('');

  // New item form state
  const [uusiOtsikko, setUusiOtsikko] = useState('');
  const [uusiTiivistelma, setUusiTiivistelma] = useState('');
  const [uusiMinisterio, setUusiMinisterio] = useState(MINISTERIOT[0]);
  const [uusiVastuuministeri, setUusiVastuuministeri] = useState('Pääministeri Petteri Orpo');
  const [uusiEsittelijaNimi, setUusiEsittelijaNimi] = useState('Erityisasiantuntija Ville Virtanen');
  const [uusiEsittelijaVirka, setUusiEsittelijaVirka] = useState('Erityisasiantuntija (Tietojärjestelmät)');
  const [uusiEsittelijaOsasto, setUusiEsittelijaOsasto] = useState('Hallintoyksikkö');
  const [uusiIstuntotyyppi, setUusiIstuntotyyppi] = useState<Istuntotyyppi>('YLEISISTUNTO');
  const [uusiPaatosehdotus, setUusiPaatosehdotus] = useState('Valtioneuvosto päättää hyväksyä...');
  const [uusiEsittelymuistio, setUusiEsittelymuistio] = useState(
    'Esityksen perustelut ja taustavaikutukset valtionhallinnon toiminnalle...'
  );

  const filteredAsiat = state.asiat.filter((asia) => {
    if (activeTab === 'valmistelu') return asia.tila === 'VALMISTELUSSA';
    if (activeTab === 'tarkastus') return asia.tila === 'TARKASTUKSESSA';
    if (activeTab === 'esityslista')
      return (
        asia.tila === 'HYVAKSYTTY_ESITYSLISTALLE' ||
        asia.tila === 'ISTUNTOKASITTELYSSA' ||
        asia.tila === 'PAATETTY'
      );
    return true;
  });

  const avoimetIstunnot = state.istunnot.filter((i) => i.tila !== 'PAATTYNYT');

  const handleLuoUusi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uusiOtsikko.trim()) return;

    createAsia({
      otsikko: uusiOtsikko,
      tiivistelma: uusiTiivistelma,
      ministerio: uusiMinisterio,
      vastuuministeri: uusiVastuuministeri,
      esittelija: {
        nimi: uusiEsittelijaNimi,
        virkanimike: uusiEsittelijaVirka,
        osasto: uusiEsittelijaOsasto,
      },
      istuntotyyppi: uusiIstuntotyyppi,
      istuntoId: null,
      pykalaNumero: null,
      tila: 'VALMISTELUSSA',
      salassapito: 'JULKINEN',
      paatosehdotus: uusiPaatosehdotus,
      esittelymuistio: uusiEsittelymuistio,
      asiakirjat: [
        {
          id: `dok-${Date.now()}-1`,
          nimi: `Esittelymuistio_${uusiOtsikko.slice(0, 15).replace(/\s+/g, '_')}.pdf`,
          tyyppi: 'muistio',
          sivumaara: 6,
          koko: '185 KB',
        },
      ],
    });

    setShowUusiModal(false);
    setUusiOtsikko('');
    setUusiTiivistelma('');
  };

  const handleLiitaEsityslistalle = (asiaId: string) => {
    if (!targetIstuntoId) {
      alert('Valitse istunto, johon asia liitetään!');
      return;
    }
    hyvaksyEsityslistalle(asiaId, targetIstuntoId);
    // update current selected item view
    const updated = state.asiat.find((a) => a.id === asiaId);
    if (updated) setValittuAsia({ ...updated, tila: 'HYVAKSYTTY_ESITYSLISTALLE' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              VAHVA PTS
            </span>
            <span className="text-xs text-slate-500">• Valtioneuvoston päätöksentekosovellus</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Asioiden ja esityslistojen valmistelu</h1>
          <p className="text-sm text-slate-600 mt-1">
            Laadi esittelymuistioita, liitä asiakirjoja, vie asiat ministeriön tarkastuskiertoon ja kytke istunnon esityslistalle.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowUusiModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Uusi päätösasia</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('valmistelu')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'valmistelu'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Valmistelussa ({state.asiat.filter((a) => a.tila === 'VALMISTELUSSA').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('tarkastus')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'tarkastus'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Tarkastuskierto ({state.asiat.filter((a) => a.tila === 'TARKASTUKSESSA').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('esityslista')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'esityslista'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>
            Esityslistalla / Käsittelyssä (
            {
              state.asiat.filter(
                (a) =>
                  a.tila === 'HYVAKSYTTY_ESITYSLISTALLE' ||
                  a.tila === 'ISTUNTOKASITTELYSSA' ||
                  a.tila === 'PAATETTY'
              ).length
            }
            )
          </span>
        </button>
        <button
          onClick={() => setActiveTab('kaikki')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'kaikki'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Kaikki asiat ({state.asiat.length})</span>
        </button>
      </div>

      {/* Main Split: Left List, Right Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Asialista */}
        <div className="lg:col-span-5 space-y-3">
          {filteredAsiat.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Ei asioita tässä näkymässä.</p>
              <button
                onClick={() => setShowUusiModal(true)}
                className="mt-3 text-xs text-blue-600 font-semibold hover:underline"
              >
                + Luo uusi asia valmisteluun
              </button>
            </div>
          ) : (
            filteredAsiat.map((asia) => {
              const isSelected = valittuAsia?.id === asia.id;
              const istunto = state.istunnot.find((i) => i.id === asia.istuntoId);

              return (
                <div
                  key={asia.id}
                  onClick={() => setValittuAsia(asia)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {asia.diaarinumero}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        asia.tila === 'VALMISTELUSSA'
                          ? 'bg-slate-100 text-slate-700'
                          : asia.tila === 'TARKASTUKSESSA'
                          ? 'bg-amber-100 text-amber-800'
                          : asia.tila === 'HYVAKSYTTY_ESITYSLISTALLE'
                          ? 'bg-blue-100 text-blue-800'
                          : asia.tila === 'ISTUNTOKASITTELYSSA'
                          ? 'bg-purple-100 text-purple-800 animate-pulse'
                          : asia.tila === 'PAATETTY' || asia.tila === 'ARKISTOITU'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {asia.tila}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {asia.otsikko}
                  </h4>

                  <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
                    <span>{asia.ministerio}</span>
                    {asia.pykalaNumero && (
                      <span className="font-medium text-blue-700">Pykälä {asia.pykalaNumero} §</span>
                    )}
                  </div>

                  {istunto && (
                    <div className="mt-2 text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded flex items-center justify-between">
                      <span className="truncate">{istunto.otsikko}</span>
                      <span className="font-mono text-slate-500 shrink-0">
                        {istunto.tila === 'KAYNNISSA' ? '🔴 Sali' : istunto.tila}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Asia Details & Actions */}
        <div className="lg:col-span-7">
          {valittuAsia ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              {/* Header */}
              <div className="border-b border-slate-100 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
                      {valittuAsia.diaarinumero}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded font-medium">
                      {valittuAsia.istuntotyyppi}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Päivitetty: {new Date(valittuAsia.paivitettyPvm).toLocaleString('fi-FI')}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                  {valittuAsia.otsikko}
                </h2>
                <div className="mt-2 flex flex-wrap gap-y-1 gap-x-4 text-xs text-slate-600">
                  <div>
                    <strong>Ministeriö:</strong> {valittuAsia.ministerio}
                  </div>
                  <div>
                    <strong>Esittelijä:</strong> {valittuAsia.esittelija.nimi} ({valittuAsia.esittelija.virkanimike})
                  </div>
                  <div>
                    <strong>Vastuuministeri:</strong> {valittuAsia.vastuuministeri}
                  </div>
                </div>
              </div>

              {/* Action Bar based on State */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  PTS-prosessin toimenpiteet
                </div>

                {valittuAsia.tila === 'VALMISTELUSSA' && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <p className="text-xs text-slate-600">
                      Asia on luonnosvaiheessa. Kun esittelymuistio on valmis, siirrä asia johdon tarkastuskierrokselle.
                    </p>
                    <button
                      onClick={() => siirraTarkastukseen(valittuAsia.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Siirrä tarkastukseen</span>
                    </button>
                  </div>
                )}

                {valittuAsia.tila === 'TARKASTUKSESSA' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600">
                      Asia on tarkastuskierroksella. Valitse istunto, jonka esityslistalle asia asetetaan.
                    </p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <select
                        value={targetIstuntoId}
                        onChange={(e) => setTargetIstuntoId(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 flex-1"
                      >
                        <option value="">-- Valitse istunto esityslistalle --</option>
                        {avoimetIstunnot.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.otsikko} ({new Date(i.ajankohta).toLocaleDateString('fi-FI')}) - {i.tila}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleLiitaEsityslistalle(valittuAsia.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Hyväksy esityslistalle</span>
                      </button>
                    </div>
                  </div>
                )}

                {(valittuAsia.tila === 'HYVAKSYTTY_ESITYSLISTALLE' ||
                  valittuAsia.tila === 'ISTUNTOKASITTELYSSA') && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kytketty istuntoon pykäläksi {valittuAsia.pykalaNumero} §</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Asia on valmis istuntokäsittelyyn ja näkyy ministereille IES-istuntosovelluksessa.
                      </p>
                    </div>
                    <Link
                      href={`/ies?istuntoId=${valittuAsia.istuntoId}`}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <span>Siirry IES-istuntoon</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {(valittuAsia.tila === 'PAATETTY' || valittuAsia.tila === 'ARKISTOITU') && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>Asia on käsitelty istunnossa ja viety arkistoon.</span>
                    </span>
                    <Link
                      href="/arkisto"
                      className="text-xs text-blue-600 font-semibold hover:underline"
                    >
                      Katso arkistoitu pöytäkirja ➔
                    </Link>
                  </div>
                )}
              </div>

              {/* Päätösehdotus */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Päätösehdotus (Esittelijän ehdotus valtioneuvostolle)</span>
                </h4>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed font-serif">
                  {valittuAsia.paatosehdotus}
                </div>
              </div>

              {/* Esittelymuistio */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Esittelymuistio (Tausta ja perustelut)</span>
                </h4>
                <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {valittuAsia.esittelymuistio}
                </div>
              </div>

              {/* Liitteet */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Liitteet ja asiakirjat ({valittuAsia.asiakirjat.length} kpl)
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {valittuAsia.asiakirjat.map((liite) => (
                    <div
                      key={liite.id}
                      className="p-3 bg-white flex items-center justify-between text-xs hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-800">{liite.nimi}</span>
                        <span className="text-[10px] text-slate-500 uppercase">({liite.tyyppi})</span>
                      </div>
                      <span className="text-slate-400">{liite.koko}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
              Valitse asia vasemmalta tarkastellaksesi sen tietoja.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Uusi päätösasia */}
      {showUusiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Uusi päätösasia PTS-järjestelmään</h3>
                <p className="text-xs text-slate-500">Diaarinumero generoidaan automaattisesti tallennuksen yhteydessä.</p>
              </div>
              <button
                onClick={() => setShowUusiModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLuoUusi} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asian otsikko *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Esim. Hallituksen esitys eduskunnalle laiksi..."
                  value={uusiOtsikko}
                  onChange={(e) => setUusiOtsikko(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tiivistelmä
                </label>
                <textarea
                  rows={2}
                  placeholder="Lyhyt tiivistelmä esityksen pääasiallisesta sisällöstä..."
                  value={uusiTiivistelma}
                  onChange={(e) => setUusiTiivistelma(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Valmisteleva ministeriö
                  </label>
                  <select
                    value={uusiMinisterio}
                    onChange={(e) => setUusiMinisterio(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    {MINISTERIOT.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kohdeistunnon tyyppi
                  </label>
                  <select
                    value={uusiIstuntotyyppi}
                    onChange={(e) => setUusiIstuntotyyppi(e.target.value as Istuntotyyppi)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="YLEISISTUNTO">Valtioneuvoston yleisistunto</option>
                    <option value="TP_ESITTELY">Tasavallan presidentin esittely</option>
                    <option value="RAHA_ASIAINVALIOKUNTA">Raha-asiainvaliokunta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Esittelijän nimi
                  </label>
                  <input
                    type="text"
                    value={uusiEsittelijaNimi}
                    onChange={(e) => setUusiEsittelijaNimi(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Virkanimike
                  </label>
                  <input
                    type="text"
                    value={uusiEsittelijaVirka}
                    onChange={(e) => setUusiEsittelijaVirka(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Päätösehdotus
                </label>
                <textarea
                  rows={2}
                  value={uusiPaatosehdotus}
                  onChange={(e) => setUusiPaatosehdotus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Esittelymuistio
                </label>
                <textarea
                  rows={4}
                  value={uusiEsittelymuistio}
                  onChange={(e) => setUusiEsittelymuistio(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUusiModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold"
                >
                  Peruuta
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Tallenna PTS-järjestelmään
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
