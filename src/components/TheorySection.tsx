/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export default function TheorySection() {
  const [activeTopic, setActiveTopic] = useState<'magloop' | 'screwdriver'>('magloop');

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6" id="theory-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-3">
        <h3 className="text-xl font-light text-slate-900 tracking-tight flex items-center gap-2">
          RF Antennevademecum & Educatieve Theorie
        </h3>
        
        {/* Toggle between loop physics and screwdriver physics */}
        <div className="flex gap-1.5 border-b border-slate-200 sm:border-0">
          <button
            onClick={() => setActiveTopic('magloop')}
            className={`px-4 py-2 font-mono uppercase tracking-wider text-xs border-b-2 transition-all ${
              activeTopic === 'magloop' 
                ? 'border-slate-900 text-slate-900 font-semibold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Magnetic Loop
          </button>
          <button
            onClick={() => setActiveTopic('screwdriver')}
            className={`px-4 py-2 font-mono uppercase tracking-wider text-xs border-b-2 transition-all ${
              activeTopic === 'screwdriver' 
                ? 'border-slate-900 text-slate-900 font-semibold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Screwdriver
          </button>
        </div>
      </div>

      {activeTopic === 'magloop' ? (
        <div className="space-y-6">
          {/* Layer 1: Executive Summary */}
          <div className="bg-slate-50 border border-slate-150 p-5 rounded-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              1. Samenvatting: Wat maakt een Loop "Small"?
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed font-sans">
              Een <strong>Small Transmitting Loop (STL)</strong> is een ring waarvan de omtrek kleiner is dan een kwart-golflengte (&lt;0.25 λ). 
              In tegenstelling tot een standaard halve-golf dipool, die zendt via een elektrisch veld (hoge spanningen aan de uiteinden), 
              heeft een magloop een vrijwel homogene, gigantische stroomverdeling. Hij creëert een krachtig <strong>lokaal magnetisch veld (H-veld)</strong>. 
              Hierdoor reageert hij vrijwel niet op de reactieve, lokale elektrische ruisvelden (E-ruis van zonnepanelen, PLC-adapters, Led-verlichting), 
              wat resulteert in een extreem rustige ontvangstomgeving (low-noise receive).
            </p>
          </div>

          {/* Layer 2: Core formulas and Variables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Belangrijke Elektromagnetische Formules
              </h5>

              <div className="space-y-4 text-xs text-slate-500">
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                  <strong className="text-slate-900 text-xs block font-medium">Stralingsweerstand (R_rad):</strong>
                  <div className="text-xs font-mono font-medium text-slate-800 bg-slate-50 px-3 py-1.5 rounded border border-slate-200 inline-block my-1">
                    R_rad = 31200 * (A / λ²)^2
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500 mt-1 font-sans">
                    <li><strong>A:</strong> Oppervlakte van de loop (m²)</li>
                    <li><strong>λ:</strong> Golflengte (m)</li>
                  </ul>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-sans mt-2">
                    *Uitleg: Omdat de loop klein is vergeleken met de golflengte, is de stralingsweerstand super klein (vaak &lt; 0.1 Ohm). 
                    Dit betekent dat de AC-weerstand van de buis en de soldeerverbindingen extreem laag moeten zijn, anders verdwijnt al je vermogen in warmte!
                  </p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                  <strong className="text-slate-900 text-xs block font-medium">Kwaliteitsfactor (Q):</strong>
                  <div className="text-xs font-mono font-medium text-slate-800 bg-slate-50 px-3 py-1.5 rounded border border-slate-200 inline-block my-1">
                    Q = X_L / R_total = 2 * π * f * L / R_total
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-sans mt-2">
                    Vanwege de lage weerstand (R_total) is de Q-factor gigantisch (meestal tussen de 200 en 1000). 
                    Dit levert een extreem smalle bandbreedte op (slechts enkele kHz). Je moet de antenne dus telkens bijstemmen als je meer dan 10 kHz verschuift op de transceiver.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Waarom de Condensator Spanning explodeert
              </h5>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <p>
                  Omdat de loop werkt als een extreem verliesarme parallelle LC-kring met een hoge Q, treedt er <strong>resonantievermeerdering</strong> op van de spanning en stroom.
                </p>
                <p>
                  Als je 100 Watt zendt in een loop met een Q van 500 en een inductieve reactantie van 250 Ohm, loopt er een circulerende stroom van ongeveer:
                </p>
                <div className="font-mono text-xs bg-slate-50 px-3 py-1.5 rounded border border-slate-200 inline-block text-slate-800 font-mono">
                  I_loop = sqrt( (P * Q) / X_L ) = sqrt( (100 * 500) / 250 ) = 14.1 Ampère RMS!
                </div>
                <p>
                  De spanning over de condensator is vervolgens V = I * X_C, wat resulteert in:
                </p>
                <div className="font-mono text-xs bg-slate-50 px-3 py-1.5 rounded border border-slate-200 inline-block text-slate-800 font-semibold font-mono">
                  Vc = 14.1 A * 250 Ω * 1.414 ≈ 5000 Volt Peak!
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-1">
                  *Conclusie: Standaard afstemcondensatoren uit oude radio's trekken dit absoluut niet en zullen direct gaan vonken en vlam vatten. 
                  Zelfbouwers gebruiken daarom legendarische vacuümcondensatoren of grote zelfbouw 'tromp'-vlindercondensatoren.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Layer 1: Executive Summary */}
          <div className="bg-slate-50 border border-slate-150 p-5 rounded-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              1. Samenvatting: Het geheim van de Screwdriver Antenne
            </h4>
            <p className="text-xs text-slate-550 mt-1 leading-relaxed font-sans">
              Een <strong>Screwdriver Antenne</strong> (zoals de Diamond SD-330) is een elektrisch verkorte kwart-golflengte mobiele spriet (monopool). 
              Wanneer een spriet veel korter is dan een kwart-golf (bijv. een autowhip van 1.2 meter op de 40 meter band, waar λ/4 = 10 meter is), 
              is de antenne extreem capacitief en heeft hij een ingangsimpedantie van enkele honderden Ohms reactief (X_a ≈ -500 Ω). 
              Om deze spriet te laten resoneren, plaatsen we een <strong>verstelbare laadspoel (loading coil)</strong> aan de voet. 
              De inductie van deze spoel neutraliseert de capacitieve reactantie volledig (X_L + X_a = 0), waardoor de antenne puur resistief en resonant wordt op HF.
            </p>
          </div>

          {/* Layer 2: Hard science details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                De Wheeler Solenoid Formule
              </h5>
              <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 space-y-3 font-sans">
                <p>
                  Voor het ontwerpen van de laadspoel gebruikt de calculator de legendarische <strong>Wheeler-formule</strong> voor enkellaags spoelen:
                </p>
                <div className="text-xs font-mono font-medium text-slate-800 bg-slate-50 px-3 py-1.5 rounded border border-slate-200 inline-block my-1 font-mono">
                  L_µH = D² * n² / (450 * D + 1000 * l)
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500">
                  <li><strong>D:</strong> Diameter van de spoelvorm in millimeters</li>
                  <li><strong>n:</strong> Aantal wikkelingen (turns)</li>
                  <li><strong>l:</strong> Actieve wikkelingslengte in millimeters</li>
                </ul>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-2 font-sans">
                  Bij een screwdriver schuift het contact over de wikkelingen heen. De wikkelingen onder de slede worden elektrisch 
                  kortgesloten met de aarde. Hierdoor verandert 'l' en 'n' proportioneel mee met de verplaatsing van de spoelslede, 
                  waardoor we de inductie uiterst nauwkeurig kunnen regelen voor elke gewenste frequentie.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Het belang van een goeie Auto Masse (Ground Plane)
              </h5>
              <div className="space-y-3 text-xs text-slate-550 leading-relaxed font-sans">
                <p>
                  Omdat een screwdriver antenne een monopool is, vormt hij slechts de <strong>halve antenne</strong>. 
                  De andere helft van de antenne is de <strong>carrosserie van je auto</strong> (of je metalen balkonhek/grondnet) 
                  die fungeert als ground plane via capacitieve koppeling met de aarde.
                </p>
                <div className="flex gap-2 p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-[11px] font-sans leading-relaxed">
                  <span className="text-slate-900 font-semibold">•</span>
                  <span>
                    Zonder een uitstekend aardingsvlak is de SWR niet omlaag te krijgen en straalt de antenne voornamelijk ruis uit in plaats van HF-signalen. 
                    Verbind je magneetvoet of bumpersteun met dikke koperen aardlitze rechtstreeks aan het blanke metaal van je chassis!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
