# Valtioneuvoston PTS & IES - Päätöksentekojärjestelmä (Next.js + TypeScript)

Tämä sovellus on toimiva prototyyppi Valtioneuvoston kanslian (**VNK**) ja ministeriöiden sähköisestä päätöksentekojärjestelmästä, joka koostuu päätöksentekosovelluksesta (**PTS**) ja istuntosovelluksesta (**IES**) osana valtionhallinnon asianhallintaratkaisua (**VAHVA**).

Sovellus on optimoitu **suoraan Vercel-pilveen vietäväksi** ilman ulkoisia tietokanta-asennuksia tai maksullisia lisäpalveluita.

---

## 🏛️ Järjestelmän osat ja elinkaari

```
┌─────────────────────────────────┐
│     1. VALMISTELU (PTS)         │  • Asian laadinta & diaarinumero (VN/xxxx/2026)
│  Esittelijän / virkamiehen      │  • Esittelymuistio, päätösehdotus, asiakirjaliitteet
│          työpöytä               │  • Salassapitoisuusluokittelu (JulkL 24 §)
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│   2. TARKASTUS & ESITYSLISTA    │  • Johdon tarkastuskierto
│             (PTS)               │  • Kytkeminen istuntoon (YI / TP / RV) pykäläksi
│                                 │  • Esityslistan lukitseminen
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│       3. ISTUNTO (IES)          │  • Reaaliaikainen kosketusnäyttö-/tablettinäkymä
│   Ministerit, Pääministeri,     │  • Läsnäolon vahvistus & esteellisyyksien ilmoitus (HL 28 §)
│  Presidentti, Istuntosihteeri   │  • Päätöksenteko: hyväksytty, pöydälle pano, eriävä mielipide
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│    4. ARKISTO & PÖYTÄKIRJAT     │  • Virallinen päätöspöytäkirjanote
│       (VAHVA-arkisto)           │  • Arkistointi, toimenpidejakelu (Eduskunta / Finlex)
└─────────────────────────────────┘
```

---

## 💡 Miten demota sovellusta (erityisesti Vercelissä)?

Sovelluksessa on käytössä **selaintallennus (`localStorage`) + `BroadcastChannel`-rajapinta**.

1. Avaa kaksi selainikkunaa näytöllesi vierekkäin:
   - **Vasen ikkuna:** [`/pts`](http://localhost:3000/pts) (Esittelijän näkymä)
   - **Oikea ikkuna:** [`/ies`](http://localhost:3000/ies) (Istuntosalin / ministerin näkymä)
2. **Kokeile reaaliaikaista virkamiestyön ja ministerin vuorovaikutusta:**
   - Luo PTS:ssä uusi asia tai hyväksy asia esityslistalle.
   - Huomaa, miten oikeanpuoleisen ikkunan IES-esityslista päivittyy **välittömästi ilman sivun uudelleenlatausta**.
   - Valitse IES:ssä ministeri ja klikkaa **"Ilmoita esteellisyys"** (esim. intressijääviys HL 28 §).
   - Avaa istunto ja tee päätös (*Hyväksytty*, *Pannaan pöydälle* tai *Eriävä mielipide*).
   - Päätä istunto ja siirry arkistoon tarkastelemaan virallista päätöspöytäkirjanotetta.
3. Voit milloin tahansa nollata esimerkkidatan yläpalkin **"Nollaa demodata"** -painikkeesta.

---

## 🚀 Paikallinen käynnistys

```bash
# Asenna riippuvuudet (valmiina)
npm install

# Käynnistä kehityspalvelin
npm run dev
```

Avaa selaimessa: [http://localhost:3000](http://localhost:3000)

## 📦 Vercel-deploysi

Tämä projekti ei vaadi mitään ympäristömuuttujia toimiakseen Vercelissä.

Voit viedä sen Verceliin suoraan:
```bash
# Vercel CLI:llä
npx vercel

# Tai puskaamalla Git-repoon ja kytkemällä se vercel.com:iin
```
