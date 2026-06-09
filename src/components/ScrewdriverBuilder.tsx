/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScrewdriverInputs } from '../types';
import { calculateScrewdriver } from '../utils/calculations';
import { 
  Wrench, 
  Settings, 
  HelpCircle, 
  Cpu, 
  Radio, 
  Layers, 
  AlertTriangle, 
  Zap, 
  TrendingUp, 
  MoveHorizontal 
} from 'lucide-react';

export default function ScrewdriverBuilder() {
  const [inputs, setInputs] = useState<ScrewdriverInputs>({
    whipLength: 1.20, // meters, typical SD-330 is 1.2m
    whipDiameter: 2.5, // mm
    frequency: 7.100, // MHz (40 meters band)
    inputPower: 100, // Watts
    coilDiameter: 42.0, // mm
    coilWireDiameter: 1.2, // mm (AWG 16 or 17 copper)
    coilLengthMax: 220, // mm total winding window
    coilTurnsMax: 90, // turns wound over that space
    contactResistance: 0.15, // Ohms for sliding copper/brass contacts
  });

  const [activeSubTab, setActiveSubTab] = useState<'calc' | 'mechanical' | 'controller'>('calc');

  const results = calculateScrewdriver(inputs);

  // Helper to update inputs comfortably
  const updateInput = (key: keyof ScrewdriverInputs, value: number) => {
    if (isNaN(value) || value < 0) return;
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  // Safe limits warnings
  const warnings: string[] = [];
  if (inputs.frequency < 3.5) {
    warnings.push('Frequenties onder 3.5 MHz vereisen een extreem grote spoel (vaak >120 turns) die mechanisch onstabiel kan zijn.');
  }
  if (results.requiredInductance > 150) {
    warnings.push('De benodigde inductie is groter dan de spoel aankan. Verleng de whip of vergroot de spoel-diameter!');
  }
  if (results.requiredTurns > inputs.coilTurnsMax) {
    warnings.push('De spoel heeft onvoldoende wikkelingen voor deze frequentie; de antenne zal niet resoneren.');
  }

  return (
    <div className="space-y-6" id="screwdriver-builder-section">
      {/* Header and overview */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl">
        <h2 className="text-xl font-light text-slate-900 tracking-tight flex items-center gap-2">
          Zelfbouw Motorized Screwdriver Antenne (Diamond SD-330 Kloon)
        </h2>
        <p className="mt-2 text-slate-500 text-xs leading-relaxed max-w-4xl font-sans">
          De Diamond SD-330 is een klassieke mobiele HF-antenne die werkt via het <strong>"Screwdriver" principe</strong>. 
          Binnenin zit een elektrische 12V motor die een messing sleepcontact (wiper carbon/messing) omhoog of omlaag schuift 
          over een stevig gewikkelde spoel. Hierdoor varieert de actieve inductie continu, waarmee je een relatief korte 
          straler (whip van model-afhankelijk ca. 1.2m) perfect kunt afstemmen van 3.5 tot 30 MHz. Hieronder vind je de 
          dynamische inductie-calculator en bouwtekeningen om dit legendarische project zelf te klonen.
        </p>
      </div>

      {/* Sub menu selector */}
      <div className="flex gap-1.5 scrollbar-none py-1 overflow-x-auto border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('calc')}
          className={`px-4 py-2 font-mono uppercase tracking-wider text-xs border-b-2 transition-all ${
            activeSubTab === 'calc'
              ? 'border-slate-900 text-slate-900 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="tab-sd-calc"
        >
          Coils Calculator
        </button>
        <button
          onClick={() => setActiveSubTab('mechanical')}
          className={`px-4 py-2 font-mono uppercase tracking-wider text-xs border-b-2 transition-all ${
            activeSubTab === 'mechanical'
              ? 'border-slate-900 text-slate-900 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="tab-sd-mech"
        >
          Mechanisch Bouwschema
        </button>
        <button
          onClick={() => setActiveSubTab('controller')}
          className={`px-4 py-2 font-mono uppercase tracking-wider text-xs border-b-2 transition-all ${
            activeSubTab === 'controller'
              ? 'border-slate-900 text-slate-900 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="tab-sd-control"
        >
          Motor Control & Match
        </button>
      </div>

      {activeSubTab === 'calc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Column */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              Antenne & Spoel Parameters
            </h3>

            {/* Input fields with validation */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Werkfrequentie (MHz)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="1.8"
                    max="54"
                    value={inputs.frequency}
                    onChange={e => updateInput('frequency', parseFloat(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden focus:border-slate-900 font-mono text-xs text-slate-800"
                  />
                  <span className="text-slate-400 text-xs font-mono min-w-[50px]">MHz</span>
                </div>
                <input
                  type="range"
                  min="3.5"
                  max="30"
                  step="0.05"
                  value={inputs.frequency}
                  onChange={e => updateInput('frequency', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Whip Lengte (m)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="3.0"
                    value={inputs.whipLength}
                    onChange={e => updateInput('whipLength', parseFloat(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden focus:border-slate-900 font-mono text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Whip Dikte (mm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="8"
                    value={inputs.whipDiameter}
                    onChange={e => updateInput('whipDiameter', parseFloat(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden focus:border-slate-900 font-mono text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Zendvermogen (W)
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={inputs.inputPower}
                  onChange={e => updateInput('inputPower', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden focus:border-slate-900 font-mono text-xs text-slate-800"
                />
              </div>

              <div className="border-t border-slate-100 my-2 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Zelfbouw Spoelafmeting (Wheeler Solenoid)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Koker Diameter (mm)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="15"
                      max="110"
                      value={inputs.coilDiameter}
                      onChange={e => updateInput('coilDiameter', parseFloat(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden focus:border-slate-900 font-mono text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Koperdraad Ø (mm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="3.0"
                      value={inputs.coilWireDiameter}
                      onChange={e => updateInput('coilWireDiameter', parseFloat(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden focus:border-slate-900 font-mono text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Wikkel Max Lengte (mm)
                    </label>
                    <input
                      type="number"
                      step="5"
                      min="50"
                      max="500"
                      value={inputs.coilLengthMax}
                      onChange={e => updateInput('coilLengthMax', parseFloat(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden focus:border-slate-900 font-mono text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Aantal Turns Max
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="20"
                      max="250"
                      value={inputs.coilTurnsMax}
                      onChange={e => updateInput('coilTurnsMax', parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden focus:border-slate-900 font-mono text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live diagram depicting matched coils */}
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg space-y-2 mt-4">
              <h4 className="text-xs font-mono font-bold text-slate-405 flex items-center justify-between">
                <span>ACTIEVE WIKKELINGEN STATUSHULP</span>
                <span className="text-slate-800 font-bold">
                  {results.requiredTurns > 0 ? results.requiredTurns.toFixed(1) : 'Systeem overfrequent'} turns
                </span>
              </h4>
              <div className="relative h-12 w-full bg-slate-200 rounded overflow-hidden flex items-center border border-slate-300">
                {/* Winding background */}
                <div 
                  className="bg-slate-900 h-full flex items-center justify-center font-mono text-[10px] text-white font-medium shadow-inner transition-all duration-300"
                  style={{ width: `${Math.max(1, Math.min(100, (results.requiredTurns / inputs.coilTurnsMax) * 100))}%` }}
                >
                  {results.requiredTurns > 0 && results.requiredTurns <= inputs.coilTurnsMax ? (
                    <span>~ {((results.requiredTurns / inputs.coilTurnsMax) * 100).toFixed(0)}% van de spoel actief</span>
                  ) : (
                    <span className="text-[10px]">Onvoldoende wikkeling</span>
                  )}
                </div>
                <div className="flex-1 text-center text-slate-400 text-[10px] font-mono">
                  Buiten werking (Kortgesloten)
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans mt-1">
                *Het mechanisme sluit de ongebruikte windingen kort via een meeschuivende sleeve of wiper contact, om parasitaire capaciteiten te hameren.
              </p>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-5 flex flex-col justify-between">
            <div className="space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>Berekeningsresultaten & Impedantie</span>
              </h3>

              {warnings.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-4 rounded-lg space-y-1">
                  {warnings.map((err, idx) => (
                    <div className="flex items-start gap-1" key={idx}>
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Grid of engineering readouts */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-xl">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Whip Capacitieve Reactantie (Xa)
                  </div>
                  <div className="text-2xl font-light text-slate-900 mt-1">
                    {results.whipReactance.toFixed(1)} <span className="text-xs font-mono text-slate-450">Ω</span>
                  </div>
                  <div className="text-[10px] text-slate-450 mt-1.5">
                    Komt overeen met <strong className="font-mono font-medium text-slate-600">{results.whipCapacitance.toFixed(1)} pF</strong>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Benodigde Resonantie Inductie
                  </div>
                  <div className="text-2xl font-light text-slate-900 mt-1">
                    {results.requiredInductance.toFixed(2)} <span className="text-xs font-mono text-slate-450">µH</span>
                  </div>
                  <div className="text-[10px] text-slate-455 mt-1.5">
                    Actieve spoellengte: <strong className="font-mono font-medium text-slate-600">{results.solenoidLengthActive.toFixed(1)} mm</strong>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Stralingsweerstand (R_rad)
                  </div>
                  <div className="text-2xl font-light text-slate-900 mt-1">
                    {results.whipRadiationResistance.toFixed(3)} <span className="text-xs font-mono text-slate-450">Ω</span>
                  </div>
                  <div className="text-[10px] text-slate-455 mt-1.5">
                    Verkort element ({inputs.whipLength}m)
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Totale AC Spoelverliezen
                  </div>
                  <div className="text-2xl font-light text-slate-900 mt-1">
                    {results.coilLossResistance.toFixed(2)} <span className="text-xs font-mono text-slate-450">Ω</span>
                  </div>
                  <div className="text-[10px] text-slate-455 mt-1.5">
                    Spoel Q op deze band: <strong className="font-mono font-medium text-slate-600">{results.coilQ.toFixed(0)}</strong>
                  </div>
                </div>
              </div>

              {/* Feed impedance line */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block tracking-wider">
                  Ingangsimpedantie Voedingspunt (Z_feed)
                </span>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-2xl font-light text-slate-900">
                    ~ {(results.whipRadiationResistance + results.coilLossResistance + results.whipLossResistance + inputs.contactResistance).toFixed(2)} Ω
                  </span>
                  <span className="text-[11px] text-slate-450 font-sans">
                    (Inclusief {results.whipLossResistance} Ω ground en {inputs.contactResistance} Ω RF sleepcontact)
                  </span>
                </div>
                <div className="text-xs text-slate-500 pt-2 leading-relaxed font-sans">
                  De feedpoint component is resistief door resonantie. Om de <strong>50 Ω coaxlijn</strong> te matchen (SWR 1:1), 
                  heb je aan de voet een kleine shunt spoel nodig van <strong>{results.unmatchedSWR > 1.2 && results.capacitorEquivalent > 0 ? `${results.capacitorEquivalent.toFixed(0)} pF` : 'niet kritisch'}</strong> als match.
                </div>
              </div>

              {/* Antenna efficiency display */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between text-[11px] text-slate-500 mb-1.5 font-bold uppercase tracking-wider">
                  <span>STRALINGSEFFICIËNTIE (ANTENNE-RENDEMENT)</span>
                  <span className="font-mono text-slate-900 font-bold">{results.systemEfficiency.toFixed(3)}%</span>
                </div>
                <div className="relative w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-slate-900 transition-all duration-300"
                    style={{ width: `${Math.min(100, results.systemEfficiency * 20)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                  <span>80m / 40m banden</span>
                  <span>20m / 15m banden</span>
                  <span>10m / 6m DX banden</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-[11px] text-slate-500 flex gap-2 items-start mt-4 leading-relaxed font-sans">
              <Zap className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong>Praktisch Bouwadvies:</strong> Gebruik dik koperdraad van minstens 1.2mm om de spoel te wikkelen. 
                Screwdriver antennes hebben bij lage efficientie & hoge vermogens last van warmte-ontwikkeling in de spoel. 
                Houd de sliding contacts super schoon en span ze stevig met messing/brons verenstaal om contactverlies te minimaliseren.
              </div>
            </div>
          </div>
        </div>
      )}
      {activeSubTab === 'mechanical' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2.5">
            Zelfbouw Mechanische Tekening & Layout
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Custom Interactive SVG Artwork of the internal mechanics */}
            <div className="border border-slate-200 bg-slate-50 rounded-xl p-4 flex flex-col items-center">
              <span className="text-[10px] font-mono text-slate-400 mb-3 uppercase self-start tracking-wider font-bold">
                🛠️ INTERNE SCHEMATISCHE WEERGAVE
              </span>
              
              <svg 
                viewBox="0 0 350 500" 
                className="w-full max-w-[320px] h-auto"
                id="screwdriver-blueprint"
              >
                {/* Outer clear shield tube */}
                <rect x="70" y="80" width="130" height="340" rx="10" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="210" y="110" fill="#64748b" fontSize="9" fontFamily="monospace">Acryl/PVC Beschermhuls (ø 50mm)</text>

                {/* Vertical slider Whip */}
                <line x1="135" y1="10" x2="135" y2="80" stroke="#475569" strokeWidth="2" />
                <line x1="135" y1="80" x2="135" y2="240" stroke="#64748b" strokeWidth="3" /> {/* internal slider rod */}
                <text x="145" y="30" fill="#0f172a" fontSize="10" fontFamily="sans-serif" fontWeight="bold">RVS Whip element (~1.2m)</text>

                {/* Coil former cylinder */}
                <rect x="90" y="120" width="90" height="240" fill="#f1f5f9" rx="5" stroke="#cbd5e1" />
                <text x="100" y="145" fill="#475569" fontSize="8" fontFamily="monospace">Binnendraad as (Fiberglass)</text>

                {/* Inductive helicoil winding representation */}
                {[...Array(24)].map((_, i) => (
                  <path 
                    key={i} 
                    d={`M 90 ${130 + (i * 10)} Q 135 ${135 + (i * 10)} 180 ${130 + (i * 10)}`} 
                    fill="none" 
                    stroke="#475569" 
                    strokeWidth="1.5" 
                  />
                ))}
                <text x="210" y="180" fill="#475569" fontSize="9" fontFamily="monospace">Spoel wikkeling koperdraad</text>

                {/* Carriage wiper slider (mechanical block representing the screwdriver action) */}
                <g transform="translate(0, 100)">
                  {/* Sliding body block */}
                  <rect x="85" y="100" width="100" height="20" fill="#334155" rx="2" fillOpacity="0.95" />
                  {/* Brass springs making contact on the inner side of outer turns */}
                  <path d="M 85 105 L 75 110 L 85 115" fill="none" stroke="#475569" strokeWidth="1.5" />
                  <path d="M 185 105 L 195 110 L 185 115" fill="none" stroke="#475569" strokeWidth="1.5" />
                  {/* Labels on the wiper */}
                  <text x="95" y="113" fill="#ffffff" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Wiper Sleeve (Messing)</text>
                  <text x="210" y="113" fill="#475569" fontSize="9" fontFamily="monospace">Koper Vingercontacten</text>
                </g>

                {/* Threaded steel rod driving the slider */}
                <rect x="131" y="240" width="8" height="150" fill="url(#threadedPattern)" stroke="#94a3b8" strokeWidth="0.5" />
                
                {/* Geared DC 12V High-torque electrical motor at the bottom */}
                <rect x="110" y="380" width="50" height="40" fill="#334155" rx="3" />
                <rect x="125" y="370" width="20" height="10" fill="#64748b" />
                <text x="115" y="405" fill="#ffffff" fontSize="8" fontFamily="sans-serif" fontWeight="bold">12V DC Motor</text>
                <text x="210" y="400" fill="#475569" fontSize="9" fontFamily="monospace">12V Geared motor (100 RPM)</text>

                {/* Base PL-259 adapter */}
                <rect x="120" y="440" width="30" height="30" fill="#e2e8f0" />
                <line x1="135" y1="440" x2="135" y2="470" stroke="#334155" strokeWidth="2" />
                <text x="160" y="460" fill="#475569" fontSize="9" fontFamily="monospace">Base RF Aansluiting PL259</text>

                {/* RF Shunt coil match at base */}
                <path d="M 120 450 Q 105 455 120 460 Q 105 465 120 470" fill="none" stroke="#475569" strokeWidth="1.5" />
                <text x="10" y="480" fill="#475569" fontSize="8" fontFamily="monospace">SWR Shunt Match Spoel (0.8µH)</text>

                {/* Custom pattern definition for threaded linear rail spindle */}
                <defs>
                  <pattern id="threadedPattern" width="4" height="6" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="1" x2="4" y2="5" stroke="#cbd5e1" strokeWidth="1" />
                  </pattern>
                </defs>
              </svg>

              <span className="text-[10px] text-slate-400 font-mono mt-3 text-center leading-normal max-w-xs block">
                Door omwisseling van de 12V polariteit op de motor roteert de draadas, waardoor de slede verschuift en windingen kortsluit met aarde.
              </span>
            </div>

            {/* Material list and Step-by-Step explanation */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Bouwstappen & Materialenlijst
              </h4>

              <div className="space-y-4 text-xs text-slate-500 leading-relaxed font-sans">
                <div>
                  <strong className="text-slate-950 block uppercase tracking-wider text-[10px] mb-1">1. Benodigde Materialen (Zelfbouw Lijst):</strong>
                  <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-600">
                    <li><strong>Coil koker:</strong> PVC buis of Delrin staaf (buitendiameter 40mm tot 50mm, ca. 300mm lang).</li>
                    <li><strong>Wikkeling:</strong> 1.2mm koperdraad (ca. 15-20 meter benodigd).</li>
                    <li><strong>Geleideras:</strong> M8 rvs draadeind spil met RVS messing moer voor de slede.</li>
                    <li><strong>Aandrijving:</strong> 12V DC reductiemotor (bijv. 60-120 RPM, hoog koppel).</li>
                    <li><strong>Glijcontacten:</strong> Be-Cu (Beryllium koper) vingers, of brons veren uit oude RF-relais. Dit is cruciaal! Slechte contacten veroorzaken vonkoverslag (arcing) bij &gt;10 Watt.</li>
                    <li><strong>Buitenbuis:</strong> Transparant plexiglas of polycarbonaat buis ter bescherming tegen weersinvloeden.</li>
                  </ul>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong className="text-slate-950 block uppercase tracking-wider text-[10px] mb-1">2. Bouwstappen:</strong>
                  <ol className="list-decimal pl-5 space-y-1.5 mt-1 text-slate-500">
                    <li>
                      <strong className="text-slate-800 font-medium">Winding van de spoel:</strong> Wikkel de spoel strak op de koker. Om een sliding contact mogelijk te maken, kun je een gleuf in de behuizing frezen, of de emaillelaag aan één zijde over de gehele lengte wegschuren, zodat de wiper direct op het koper schuift.
                    </li>
                    <li>
                      <strong className="text-slate-800 font-medium">Lineaire Motorisering:</strong> Bevestig de 12V motor aan de onderzijde van de spil in een afgedicht compartiment. De messing moer wordt ingebed in de wiper slede. Zodra de motor draait, schuift de slede lineair omhoog/omlaag.
                    </li>
                    <li>
                      <strong className="text-slate-800 font-medium">RVS Whip koppeling:</strong> Bevestig bovenaan een stevige isolator (bijv. POM of Teflon), met daardoorheen de aansluiting voor de rvs whip. De whip is elektrisch verbonden aan de top van de wikkeling.
                    </li>
                    <li>
                      <strong className="text-slate-800 font-medium">Gronding (Cruciaal!):</strong> De onderkant van de spoel en de rvs sledeas zijn verbonden met de auto-chassis aarde via de PL-259 afscherming.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'controller' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Electrical diagram 1: Simple manual polarity controller */}
            <div className="border border-slate-250/80 rounded-xl p-5 bg-slate-50 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1">
                1. Handmatige Polarisatieregelaar (DPDT Switch)
              </h4>
              <p className="text-xs text-slate-500 leading-normal font-sans">
                Screwdriver antennes worden standaard aangestuurd met een simpele <strong>DPDT (Double Pole Double Throw)</strong> schakelaar met middenstand (on-off-on). 
                Hiermee kun je handmatig de polariteit van de motor omdraaien om de antenne langer te maken (inductie toevoegen) of korter te maken.
              </p>

              <pre className="bg-white text-slate-800 font-mono text-[11px] p-4 rounded-lg border border-slate-200 leading-relaxed overflow-x-auto whitespace-pre">
                <span className="text-slate-400 block pb-1 border-b border-slate-100 font-bold uppercase tracking-wider text-[10px]">SCHAKELSCHEMA:</span>
                {` [ +12V DC ] --- (Pin 1)  \\  / (Pin 6)
                                    \\ / 
  [ DC Motor + ] ---------------- (Pin 2) ---- [ DC Motor - ]
                                    / \\
  [ GND Ground ] --- (Pin 3)  /  \\ (Pin 4)

  - Knop omhoog: Polen rechtstreeks -> Motor draait rechtsom (spoel sluit in)
  - Middenstand: Motor stopt direct
  - Knop omlaag: Polen gekruist -> Motor draait linksom`}
              </pre>
              <div className="text-[10px] text-slate-400 italic mt-1 leading-relaxed font-sans">
                Tip: Plaats twee eindschakelaars (limit switches) aan de uiterste einden van de spoelslede, in serie met sperdiodes. Dit voorkomt dat de motor vastloopt en doorbrandt!
              </div>
            </div>

            {/* Electrical diagram 2: Automatic RF switch and Matching */}
            <div className="border border-slate-255/80 rounded-xl p-5 bg-slate-50 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1">
                2. Automatische SWR Matcher (Arduino Upgrade)
              </h4>
              <p className="text-xs text-slate-500 leading-normal font-sans">
                Indien je automatische afstemming wilt op basis van je transceiverband, kun je de spil voorzien van een kleine magneetschijf en een Hall-effect sensor. 
                De Arduino telt het aantal pulsen om de positie te herberekenen.
              </p>

              <pre className="bg-white text-slate-800 font-mono text-[11px] p-4 rounded-lg border border-slate-200 leading-relaxed overflow-x-auto whitespace-pre">
                <span className="text-slate-400 block pb-1 border-b border-slate-100 font-bold uppercase tracking-wider text-[10px]">ARDUINO INTEGRATIE DIAGRAM:</span>
                {` [ SWR Bridge ] -> Analog Pin A0 (Forward/Reflected Power)
  [ Hall Sensor ] -> Interrupt Pin D2 (Telt omwentelingen)
  [ Relais Board ] -> Pins D4 & D5 (Omwisselen Polariteit)

  Procedure:
  1. Arduino leest frequentie via CAT of SWR-bridge.
  2. Motor start en scant naar het laagste SWR-punt.
  3. Positie (pulsscore) wordt opgeslagen in EEPROM.
  4. Snel tunen binnen < 2 seconden naar de juiste band!`}
              </pre>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                *Om inductie-storing (RF feedback) in de Arduino te voorkomen, dient de 12V motorkabel voorzien te worden van ferrietkralen en optocouplers.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Waarom is de Shunt Match aan de voet cruciaal?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500 leading-relaxed font-sans">
              <div>
                <p>
                  Omdat de straler (1.2m whip) korter is dan een kwart-golflengte, is zijn natuurlijke stralingsweerstand (R_rad) heel laag (meestal zo'n 1.5 Ω op 40 meter). Samen met de spoelverliezen en autoground kom je uit op een ingangsimpedantie van circa <strong>15 tot 22 Ohm</strong>.
                </p>
                <p className="mt-2">
                  Als je hier rechtstreeks een 50 Ohm coaxkabel op aansluit, is de SWR minstens 2.5:1, ondanks dat de antenne perfect in resonantie is!
                </p>
              </div>
              <div>
                <p>
                  <strong>De Oplossing (SWR Shunt Match):</strong> 
                  Sluit een hittebestendige spoel van circa <strong>0.7 µH tot 1.2 µH</strong> direct aan over de voedingsconnector tussen de kern en de aarding (chassis van de auto). 
                  Dit vormt een zogenaamde L-matching netwerk over de capacitieve antenneresistentie. 
                  Dit verlaagt de SWR direct naar 1.0:1 tot 1.2:1 over het gehele afstemgebied!
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
