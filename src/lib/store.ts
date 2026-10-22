'use client';

import { useState, useEffect, useCallback } from 'react';
import { Asia, Istunto, VnkStoreState, Istuntotyyppi } from './types';
import { ALKUPERAISET_ASIAT, ALKUPERAISET_ISTUNNOT, ALKUPERAISET_MINISTERIT } from './mockData';

const STORAGE_KEY = 'vnk_valtioneuvosto_demo_data_v1';
const CHANNEL_NAME = 'vnk_broadcast_channel';

function getDefaultState(): VnkStoreState {
  return {
    istunnot: ALKUPERAISET_ISTUNNOT,
    asiat: ALKUPERAISET_ASIAT,
    aktiivinenIstuntoId: 'istunto-yi-2026-42',
    kayttajarooli: 'ESITTELIJA',
    valittuMinisteriId: 'min-1',
  };
}

function loadState(): VnkStoreState {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaultState = getDefaultState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
      return defaultState;
    }
    return JSON.parse(raw) as VnkStoreState;
  } catch (err) {
    console.error('Failed to load state from localStorage', err);
    return getDefaultState();
  }
}

function saveState(state: VnkStoreState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Broadcast to other tabs
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel(CHANNEL_NAME);
      bc.postMessage({ type: 'STATE_UPDATED', timestamp: Date.now() });
      bc.close();
    }
  } catch (err) {
    console.error('Failed to save state to localStorage', err);
  }
}

export function useVnkStore() {
  const [state, setState] = useState<VnkStoreState>(getDefaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from localStorage on mount and listen to BroadcastChannel
  useEffect(() => {
    setState(loadState());
    setIsLoaded(true);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      bc = new BroadcastChannel(CHANNEL_NAME);
      bc.onmessage = (event) => {
        if (event.data?.type === 'STATE_UPDATED') {
          setState(loadState());
        }
      };
    }

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setState(loadState());
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const updateState = useCallback((updater: (prev: VnkStoreState) => VnkStoreState) => {
    setState((prev) => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  // --- PTS TOIMINNOT (Valmistelu ja päätöksentekosovellus) ---

  const createAsia = useCallback(
    (uusiAsia: Omit<Asia, 'id' | 'diaarinumero' | 'luotuPvm' | 'paivitettyPvm' | 'esteellisyydet' | 'paatosmerkinta'>) => {
      updateState((prev) => {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const diaarinumero = `VN/${randomNum}/2026`;
        const id = `asia-${Date.now()}`;
        const now = new Date().toISOString();

        const item: Asia = {
          ...uusiAsia,
          id,
          diaarinumero,
          esteellisyydet: [],
          paatosmerkinta: null,
          luotuPvm: now,
          paivitettyPvm: now,
        };

        return {
          ...prev,
          asiat: [item, ...prev.asiat],
        };
      });
    },
    [updateState]
  );

  const updateAsia = useCallback(
    (id: string, updates: Partial<Asia>) => {
      updateState((prev) => ({
        ...prev,
        asiat: prev.asiat.map((a) =>
          a.id === id ? { ...a, ...updates, paivitettyPvm: new Date().toISOString() } : a
        ),
      }));
    },
    [updateState]
  );

  const siirraTarkastukseen = useCallback(
    (asiaId: string) => {
      updateState((prev) => ({
        ...prev,
        asiat: prev.asiat.map((a) =>
          a.id === asiaId ? { ...a, tila: 'TARKASTUKSESSA', paivitettyPvm: new Date().toISOString() } : a
        ),
      }));
    },
    [updateState]
  );

  const hyvaksyEsityslistalle = useCallback(
    (asiaId: string, istuntoId: string) => {
      updateState((prev) => {
        const istunnonAsiat = prev.asiat.filter((a) => a.istuntoId === istuntoId);
        const seuraavaPykala = istunnonAsiat.length + 1;

        return {
          ...prev,
          asiat: prev.asiat.map((a) =>
            a.id === asiaId
              ? {
                  ...a,
                  tila: 'HYVAKSYTTY_ESITYSLISTALLE',
                  istuntoId,
                  pykalaNumero: seuraavaPykala,
                  paivitettyPvm: new Date().toISOString(),
                }
              : a
          ),
        };
      });
    },
    [updateState]
  );

  const luoUusiIstunto = useCallback(
    (tyyppi: Istuntotyyppi, otsikko: string, ajankohta: string, paikka: string) => {
      updateState((prev) => {
        const samanTyypin = prev.istunnot.filter((i) => i.tyyppi === tyyppi);
        const numero = samanTyypin.length + 1;
        const id = `istunto-${Date.now()}`;
        const uusiIstunto: Istunto = {
          id,
          numero,
          vuosi: 2026,
          tyyppi,
          otsikko,
          ajankohta,
          paikka,
          puheenjohtaja:
            tyyppi === 'TP_ESITTELY'
              ? 'Tasavallan presidentti Alexander Stubb'
              : 'Pääministeri Petteri Orpo',
          istuntosihteeri: 'Lainsäädäntöneuvos / Valtioneuvoston kanslia',
          tila: 'VALMISTELUSSA',
          aktiivinenPykalaId: null,
          osallistujat: ALKUPERAISET_MINISTERIT,
        };

        return {
          ...prev,
          istunnot: [uusiIstunto, ...prev.istunnot],
          aktiivinenIstuntoId: id,
        };
      });
    },
    [updateState]
  );

  const lukitseEsityslista = useCallback(
    (istuntoId: string) => {
      updateState((prev) => ({
        ...prev,
        istunnot: prev.istunnot.map((i) =>
          i.id === istuntoId ? { ...i, tila: 'LUKITTU', lukittuPvm: new Date().toISOString() } : i
        ),
      }));
    },
    [updateState]
  );

  // --- IES TOIMINNOT (Istuntosovellus ja reaaliaikainen päätöksenteko) ---

  const asetaAktiivinenIstunto = useCallback(
    (istuntoId: string) => {
      updateState((prev) => ({ ...prev, aktiivinenIstuntoId: istuntoId }));
    },
    [updateState]
  );

  const aloitaIstunto = useCallback(
    (istuntoId: string) => {
      updateState((prev) => {
        const istuntoAsiat = prev.asiat
          .filter((a) => a.istuntoId === istuntoId)
          .sort((a, b) => (a.pykalaNumero ?? 0) - (b.pykalaNumero ?? 0));
        const ensimmainenAsia = istuntoAsiat[0];

        return {
          ...prev,
          istunnot: prev.istunnot.map((i) =>
            i.id === istuntoId
              ? {
                  ...i,
                  tila: 'KAYNNISSA',
                  aloitettuPvm: new Date().toISOString(),
                  aktiivinenPykalaId: ensimmainenAsia ? ensimmainenAsia.id : null,
                }
              : i
          ),
          asiat: prev.asiat.map((a) => {
            if (a.istuntoId === istuntoId) {
              if (ensimmainenAsia && a.id === ensimmainenAsia.id) {
                return { ...a, tila: 'ISTUNTOKASITTELYSSA', paivitettyPvm: new Date().toISOString() };
              }
              return { ...a, tila: 'HYVAKSYTTY_ESITYSLISTALLE' };
            }
            return a;
          }),
        };
      });
    },
    [updateState]
  );

  const vaihdaAktiivinenPykala = useCallback(
    (istuntoId: string, asiaId: string) => {
      updateState((prev) => ({
        ...prev,
        istunnot: prev.istunnot.map((i) =>
          i.id === istuntoId ? { ...i, aktiivinenPykalaId: asiaId } : i
        ),
        asiat: prev.asiat.map((a) => {
          if (a.id === asiaId) {
            return { ...a, tila: 'ISTUNTOKASITTELYSSA', paivitettyPvm: new Date().toISOString() };
          }
          return a;
        }),
      }));
    },
    [updateState]
  );

  const toggleMinisterinLasnaolo = useCallback(
    (istuntoId: string, ministeriId: string) => {
      updateState((prev) => ({
        ...prev,
        istunnot: prev.istunnot.map((i) => {
          if (i.id !== istuntoId) return i;
          return {
            ...i,
            osallistujat: i.osallistujat.map((m) =>
              m.id === ministeriId ? { ...m, lasna: !m.lasna } : m
            ),
          };
        }),
      }));
    },
    [updateState]
  );

  const ilmoitaEsteellisyys = useCallback(
    (asiaId: string, ministeriId: string, ministeriNimi: string, peruste: string) => {
      updateState((prev) => ({
        ...prev,
        asiat: prev.asiat.map((a) => {
          if (a.id !== asiaId) return a;
          const exists = a.esteellisyydet.some((e) => e.ministeriId === ministeriId);
          if (exists) return a;
          return {
            ...a,
            esteellisyydet: [
              ...a.esteellisyydet,
              {
                ministeriId,
                ministeriNimi,
                peruste,
                ilmoitettuAika: new Date().toISOString(),
              },
            ],
            paivitettyPvm: new Date().toISOString(),
          };
        }),
      }));
    },
    [updateState]
  );

  const poistaEsteellisyys = useCallback(
    (asiaId: string, ministeriId: string) => {
      updateState((prev) => ({
        ...prev,
        asiat: prev.asiat.map((a) => {
          if (a.id !== asiaId) return a;
          return {
            ...a,
            esteellisyydet: a.esteellisyydet.filter((e) => e.ministeriId !== ministeriId),
            paivitettyPvm: new Date().toISOString(),
          };
        }),
      }));
    },
    [updateState]
  );

  const teePaatos = useCallback(
    (
      asiaId: string,
      paatosTyyppi: 'HYVAKSYTTY' | 'POYDATTY' | 'MUUTETTU' | 'ERI_MIELIPIDE',
      teksti: string,
      eriavaMielipideTeksti?: string,
      ministeriId?: string
    ) => {
      updateState((prev) => {
        const now = new Date().toISOString();
        let uusiTila: Asia['tila'] = 'PAATETTY';
        if (paatosTyyppi === 'POYDATTY') uusiTila = 'POYDATTY';
        if (paatosTyyppi === 'ERI_MIELIPIDE') uusiTila = 'ERI_MIELIPIDE';

        const kohdeAsia = prev.asiat.find((a) => a.id === asiaId);
        const eriavat = eriavaMielipideTeksti && ministeriId
          ? [
              {
                ministeriId,
                ministeriNimi:
                  ALKUPERAISET_MINISTERIT.find((m) => m.id === ministeriId)?.nimi || 'Ministeri',
                mielipide: eriavaMielipideTeksti,
              },
            ]
          : undefined;

        // Auto advance active pykälä to next item in current istunto
        let nextPykalaId: string | null = null;
        if (kohdeAsia?.istuntoId) {
          const list = prev.asiat
            .filter((a) => a.istuntoId === kohdeAsia.istuntoId)
            .sort((a, b) => (a.pykalaNumero ?? 0) - (b.pykalaNumero ?? 0));
          const currentIndex = list.findIndex((a) => a.id === asiaId);
          if (currentIndex !== -1 && currentIndex + 1 < list.length) {
            nextPykalaId = list[currentIndex + 1].id;
          }
        }

        return {
          ...prev,
          asiat: prev.asiat.map((a) => {
            if (a.id === asiaId) {
              return {
                ...a,
                tila: uusiTila,
                paatosmerkinta: {
                  paatosTyyppi,
                  teksti,
                  eriavatMielipiteet: eriavat,
                  paatettyKlo: now,
                },
                paivitettyPvm: now,
              };
            }
            if (nextPykalaId && a.id === nextPykalaId) {
              return { ...a, tila: 'ISTUNTOKASITTELYSSA', paivitettyPvm: now };
            }
            return a;
          }),
          istunnot: prev.istunnot.map((i) => {
            if (i.id === kohdeAsia?.istuntoId && nextPykalaId) {
              return { ...i, aktiivinenPykalaId: nextPykalaId };
            }
            return i;
          }),
        };
      });
    },
    [updateState]
  );

  const paataIstunto = useCallback(
    (istuntoId: string) => {
      updateState((prev) => {
        const now = new Date().toISOString();
        const istunto = prev.istunnot.find((i) => i.id === istuntoId);
        const poytakirjaNumero = `VN/${istunto?.tyyppi === 'YLEISISTUNTO' ? 'YI' : istunto?.tyyppi === 'TP_ESITTELY' ? 'TP' : 'RV'}/${istunto?.numero ?? 1}/2026`;

        return {
          ...prev,
          istunnot: prev.istunnot.map((i) =>
            i.id === istuntoId
              ? {
                  ...i,
                  tila: 'PAATTYNYT',
                  paattynytPvm: now,
                  aktiivinenPykalaId: null,
                  poytakirjaNumero,
                }
              : i
          ),
          asiat: prev.asiat.map((a) => {
            if (a.istuntoId === istuntoId) {
              return {
                ...a,
                tila: 'ARKISTOITU',
                paivitettyPvm: now,
              };
            }
            return a;
          }),
        };
      });
    },
    [updateState]
  );

  const vaihdaRooli = useCallback(
    (rooli: 'ESITTELIJA' | 'MINISTERI' | 'SIHTEERI') => {
      updateState((prev) => ({ ...prev, kayttajarooli: rooli }));
    },
    [updateState]
  );

  const vaihdaValittuMinisteri = useCallback(
    (ministeriId: string) => {
      updateState((prev) => ({ ...prev, valittuMinisteriId: ministeriId }));
    },
    [updateState]
  );

  const palautaAlkuperaisetTiedot = useCallback(() => {
    const oletukset = getDefaultState();
    saveState(oletukset);
    setState(oletukset);
  }, []);

  return {
    state,
    isLoaded,
    // PTS
    createAsia,
    updateAsia,
    siirraTarkastukseen,
    hyvaksyEsityslistalle,
    luoUusiIstunto,
    lukitseEsityslista,
    // IES
    asetaAktiivinenIstunto,
    aloitaIstunto,
    vaihdaAktiivinenPykala,
    toggleMinisterinLasnaolo,
    ilmoitaEsteellisyys,
    poistaEsteellisyys,
    teePaatos,
    paataIstunto,
    // Global & Roles
    vaihdaRooli,
    vaihdaValittuMinisteri,
    palautaAlkuperaisetTiedot,
  };
}
