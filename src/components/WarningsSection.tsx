/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, ShieldCheck, ThumbsUp, Flame, ShieldAlert, Wifi } from 'lucide-react';

export default function WarningsSection() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6" id="warnings-section">
      <div className="border-b border-slate-150 pb-3">
        <h3 className="text-xl font-sans font-semibold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />
          Zelfbouw Veiligheid & Praktische Waarschuwingen
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Zelfbouw antennes voor de HF-banden (Korte Golf) kunnen verrassend hoge vermogens, spanningen en stromen verwerken. 
          Neem de volgende richtlijnen in acht om storing, defecten en lichamelijk gevaar te voorkomen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MagLoop Warnings */}
        <div className="border border-slate-150 rounded-xl p-5 bg-rose-50/50 space-y-4">
          <h4 className="text-base font-sans font-bold text-rose-900 flex items-center gap-1.5 border-b border-rose-100 pb-2">
            <Flame className="w-5 h-5 text-rose-600" />
            Magnetic Loop Gevaren
          </h4>

          <ul className="space-y-3.5 text-xs text-slate-705">
            <li className="space-y-1">
              <strong className="text-rose-900 block">⚡ Levensgevaarlijke Spanningen:</strong>
              Even {100}W kan wel <span className="font-mono font-bold text-rose-700">4000 tot 7000 Volt</span> genereren over de platen van de afstemcondensator! 
              Zorg ervoor dat niemand de antenne of de condensator kan aanraken tijdens het zenden. Een aanraking leidt tot ernstige, diepe RF-brandwonden.
            </li>
            <li className="space-y-1">
              <strong className="text-rose-950 block">🔥 Contactverliezen en Hitte:</strong>
              Omdat de hoofdlusweerstand uiterst laag is (enkele milliohms), kunnen overgangsweerstanden van een slechte soldeerverbinding de loop direct in een kachel veranderen. 
              Soldeer of las alle verbindingen van de grote loop degelijk met een zware brander. Gebruik nergens fragiele kroonsteentjes of schroeven!
            </li>
            <li className="space-y-1">
              <strong className="text-rose-950 block">📡 Sterke Magnetische Velden (EMV):</strong>
              De magnetic loop creëert in een straal van enkele meters een heel intens magnetisch veld. 
              Houd de antenne buiten bereik van pacemakers en gevoelige elektronica. Plaats de loop bij voorkeur op een zolder of in de tuin op minimaal 4-5 meter afstand van menselijk verblijf.
            </li>
          </ul>
        </div>

        {/* Screwdriver Warnings */}
        <div className="border border-slate-150 rounded-xl p-5 bg-amber-50/50 space-y-4">
          <h4 className="text-base font-sans font-bold text-amber-900 flex items-center gap-1.5 border-b border-amber-100 pb-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            Screwdriver Antenne Gevaren
          </h4>

          <ul className="space-y-3.5 text-[12px] text-slate-705">
            <li className="space-y-1">
              <strong className="text-amber-900 block">⚙️ Motor Blokkeren en Doorbranden:</strong>
              Als het sleepcontact (wiper slede) de fysieke boven- of onderkant van de spoelas bereikt en de motor blijft draaien, kan de motor direct vastlopen (stallen) en doorbranden. 
              Installeer altijd twee verbreekcontacten of microschakelaars met diodes, of begrens de stroomtoevoer van de 12V voeding tot maximaal 0.5A.
            </li>
            <li className="space-y-1">
              <strong className="text-amber-950 block">⚡ Vonkoverslag (Arcing) bij Glijcontact:</strong>
              De stroom op het punt waar het sleepcontact de spoeldraad raakt is aanzienlijk bij vermogens &gt; 50W. 
              Als dit contact losjes zit, onstaat er een micro-boogontlading (arcing) die de kostbare zilver- of koperdraad onherstelbaar wegbrandt. 
              Zorg voor krachtige mechanische veerspanning op het sleepcontact.
            </li>
            <li className="space-y-1">
              <strong className="text-amber-950 block">🚗 Rijden met een Screwdriver:</strong>
              Zelfgebouwde screwdriver antennes kunnen erg zwaar en windgevoelig zijn op de auto. 
              Zorg voor een oerdegelijke mechanische constructie op de trekhaak of carrosseriedrager. 
              Gebruik een sterke glasvezel of stevige dikwandige PVC behuizing om breken op de snelweg te voorkomen.
            </li>
          </ul>
        </div>
      </div>

      {/* General Coax Feedline warning */}
      <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-lg flex gap-3 items-start">
        <Wifi className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-705 leading-relaxed">
          <strong className="text-emerald-900 block mb-1">Algemene Tip: Mantelstroomfilter (1:1 RF Choke)</strong>
          Zowel de magnetic loop als de mobiele screwdriver kunnen asymmetrische RF-stromen over de buitenmantel van je coaxkabel terugsturen naar de shack. 
          Dit veroorzaakt 'RF in de shack' (storing op computers, microfoons, of lichte schokken op je transceiverbehuizing). 
          Wikkel daarom vlak bij het voedingspunt van de antenne 8 tot 10 slagen RG-58 coax door een <strong>FT240-31 of FT240-43 ferrietring</strong> als mantelstroomfilter. 
          Dit elimineert mantelstromen volledig en maakt de SWR-meting stabiel!
        </div>
      </div>
    </div>
  );
}
