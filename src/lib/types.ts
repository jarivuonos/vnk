export type Istuntotyyppi = 'YLEISISTUNTO' | 'TP_ESITTELY' | 'RAHA_ASIAINVALIOKUNTA';

export type AsiaTila =
  | 'VALMISTELUSSA'
  | 'TARKASTUKSESSA'
  | 'HYVAKSYTTY_ESITYSLISTALLE'
  | 'ISTUNTOKASITTELYSSA'
  | 'PAATETTY'
  | 'POYDATTY'
  | 'ERI_MIELIPIDE'
  | 'ARKISTOITU';

export type IstuntoTila = 'VALMISTELUSSA' | 'LUKITTU' | 'KAYNNISSA' | 'PAATTYNYT';

export type SalassapitoLuokka = 'JULKINEN' | 'SALASSA_PIDETTAVA_JULKL_24_1';

export interface Ministeri {
  id: string;
  nimi: string;
  salkku: string;
  puolue: string;
  lasna: boolean;
}

export interface Esteellisyys {
  ministeriId: string;
  ministeriNimi: string;
  peruste: string;
  ilmoitettuAika: string;
}

export interface Paatosmerkinta {
  paatosTyyppi: 'HYVAKSYTTY' | 'POYDATTY' | 'MUUTETTU' | 'ERI_MIELIPIDE';
  teksti: string;
  poydalleSiirrettyPvm?: string;
  eriavatMielipiteet?: Array<{
    ministeriId: string;
    ministeriNimi: string;
    mielipide: string;
  }>;
  paatettyKlo: string;
}

export interface AsiakirjaLiite {
  id: string;
  nimi: string;
  tyyppi: 'muistio' | 'lakiluonnos' | 'liite' | 'talousarvio';
  sivumaara: number;
  koko: string;
}

export interface Asia {
  id: string;
  diaarinumero: string;
  otsikko: string;
  tiivistelma: string;
  ministerio: string;
  esittelija: {
    nimi: string;
    virkanimike: string;
    osasto: string;
  };
  vastuuministeri: string;
  istuntotyyppi: Istuntotyyppi;
  istuntoId: string | null;
  pykalaNumero: number | null;
  tila: AsiaTila;
  salassapito: SalassapitoLuokka;
  salassapitoPeruste?: string;
  paatosehdotus: string;
  esittelymuistio: string;
  asiakirjat: AsiakirjaLiite[];
  esteellisyydet: Esteellisyys[];
  paatosmerkinta: Paatosmerkinta | null;
  luotuPvm: string;
  paivitettyPvm: string;
}

export interface Istunto {
  id: string;
  numero: number;
  vuosi: number;
  tyyppi: Istuntotyyppi;
  otsikko: string;
  ajankohta: string; // ISO string
  paikka: string;
  puheenjohtaja: string;
  istuntosihteeri: string;
  tila: IstuntoTila;
  aktiivinenPykalaId: string | null;
  osallistujat: Ministeri[];
  lukittuPvm?: string;
  aloitettuPvm?: string;
  paattynytPvm?: string;
  poytakirjaNumero?: string;
}

export interface VnkStoreState {
  istunnot: Istunto[];
  asiat: Asia[];
  aktiivinenIstuntoId: string | null;
  kayttajarooli: 'ESITTELIJA' | 'MINISTERI' | 'SIHTEERI';
  valittuMinisteriId: string;
}
