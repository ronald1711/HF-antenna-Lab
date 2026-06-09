/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MagLoopInputs } from '../types';
import { calculateMagLoop } from '../utils/calculations';
import {
  Zap,
  Radio,
  Sliders,
  Award,
  ShieldCheck,
  AlertTriangle,
  Compass,
  Link,
  Info
} from 'lucide-react';

export default function MagLoopCalc() {
  const [inputs, setInputs] = useState<MagLoopInputs>({
    shape: 'circular',
    circumference: 3.14, // 1 meter diameter loop is pi circumference
    conductorDiameter: 22, // 22mm copper pipe, popular DIY!
    material: 'copper',
    frequency: 14.150, // 20m band
    inputPower: 100, // Watts RMS
    contactResistance: 0.04, // soldered joints, high quality default
  });

  const [couplingType, setCouplingType] = useState<'faraday' | 'gamma' | 'toroid'>('faraday');

  const results = calculateMagLoop(inputs);

  // Calculate equivalent physical diameter of loop
  const diameter = inputs.shape === 'circular' 
    ? inputs.circumference / Math.PI 
    : inputs.shape === 'square' 
      ? inputs.circumference / 4 
      : inputs.circumference / 4.828; // octagonal flat to flat approx

  const wavelength = 299.792458 / inputs.frequency;
  const isElectricallySmall = inputs.circumference < (0.1 * wavelength);
  const isOutsideTheoreticalLimit = inputs.circumference > (0.28 * wavelength); // past self-resonance / non-uniform current

  const updateInput = (key: keyof MagLoopInputs, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6" id="magloop-calculator-section">
      {/* Overview */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl">
        <h2 className="text-xl font-light text-slate-900 tracking-tight flex items-center gap-2">
          Small Transmitting Loop (Magloop) Ontwerp & Analyse
        </h2>
        <p className="mt-2 text-slate-500 text-xs leading-relaxed max-w-4xl font-sans">
          Een magnetic loop of Small Transmitting Loop (STL) is een elektrisch uiterst kleine antenne (omtrek &lt; 0.25 λ) 
          die voornamelijk reageert op het magnetische veld in plaats van het elektrische veld. Hierdoor pakt hij veel minder locale 
          storingsruis (QRM) op en heeft hij een super scherp dipoolpatroon met diepe zijwaartse nullen, ideaal voor zendamateurs 
          met beperkte ruimte. Bepaal hieronder de resonantie, spanningen en stralingsefficiëntie van jouw STL.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            Ontwerpparameters (Inputs)
          </h3>

          <div className="space-y-4 text-xs">
            {/* Shape selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Loop Vorm
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['circular', 'square', 'octagon'] as const).map(sh => (
                  <button
                    key={sh}
                    type="button"
                    onClick={() => updateInput('shape', sh)}
                    className={`py-1.5 px-2 font-mono text-xs uppercase tracking-wider border text-center transition-all ${
                      inputs.shape === sh
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sh === 'circular' ? 'Cirkel' : sh === 'square' ? 'Vierkant' : 'Octagoon'}
                  </button>
                ))}
              </div>
            </div>

            {/* Circumference Slider and entry */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Omtrek Loop (m)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.05"
                  min="0.5"
                  max="15.0"
                  value={inputs.circumference}
                  onChange={e => updateInput('circumference', parseFloat(e.target.value) || 0.5)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden focus:border-slate-900 font-mono text-xs text-slate-800"
                />
                <span className="text-slate-400 text-xs font-mono min-w-[50px]">meters</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="12.0"
                step="0.1"
                value={inputs.circumference}
                onChange={e => updateInput('circumference', parseFloat(e.target.value) || 0.5)}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 mt-2"
              />
              <span className="text-[10px] text-slate-400 font-sans block mt-1.5">
                Diameter ring: <strong className="font-mono text-slate-600 font-medium">{diameter.toFixed(2)} m</strong>
              </span>
            </div>

            {/* Conductor Diameter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Buis Diameter / Dikte (mm)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="1"
                  min="2"
                  max="110"
                  value={inputs.conductorDiameter}
                  onChange={e => updateInput('conductorDiameter', parseFloat(e.target.value) || 2)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden focus:border-slate-900 font-mono text-xs text-slate-800"
                />
                <span className="text-slate-400 text-xs font-mono min-w-[50px]">mm</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={inputs.conductorDiameter}
                onChange={e => updateInput('conductorDiameter', parseFloat(e.target.value) || 5)}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 mt-2"
              />
              <span className="text-[10px] text-slate-450 font-sans block mt-1.5 leading-relaxed">
                Dikkere buis (bv. waterleiding van 22mm of 28mm) verlaagt de AC-skindiepte weerstand enorm en vergroot het rendement.
              </span>
            </div>

            {/* Frequency Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Werkfrequentie (MHz)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.005"
                  min="1.8"
                  max="30"
                  value={inputs.frequency}
                  onChange={e => updateInput('frequency', parseFloat(e.target.value) || 1.8)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden focus:border-slate-900 font-mono text-xs text-slate-800"
                />
                <span className="text-slate-400 text-xs font-mono min-w-[50px]">MHz</span>
              </div>
              <input
                type="range"
                min="3.5"
                max="30"
                step="0.1"
                value={inputs.frequency}
                onChange={e => updateInput('frequency', parseFloat(e.target.value) || 3.5)}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 mt-2"
              />
            </div>

            {/* Conductor Material */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Geleidermateriaal
              </label>
              <select
                value={inputs.material}
                onChange={e => updateInput('material', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden focus:border-slate-900 font-sans text-xs text-slate-800"
              >
                <option value="copper">Koper (Zacht / Waterleiding) - Beste keuze</option>
                <option value="aluminum">Aluminium (Ringen of Strips) - Matig</option>
                <option value="brass">Messing (Veel verlies bij zenden)</option>
              </select>
            </div>

            {/* Power input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                RF Zendvermogen (W)
              </label>
              <input
                type="number"
                min="1"
                max="1500"
                value={inputs.inputPower}
                onChange={e => updateInput('inputPower', parseInt(e.target.value) || 5)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden focus:border-slate-900 font-mono text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-450 block mt-1 leading-relaxed">
                *Vermogens &gt;10W produceren extreem hoge spanningen over de condensator!
              </span>
            </div>

            {/* Additional Contact Resistance */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Contact Verliesweerstand (Ω)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="2"
                value={inputs.contactResistance}
                onChange={e => updateInput('contactResistance', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden focus:border-slate-900 font-mono text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-450 block mt-1 leading-relaxed">
                Standaard gesoldeerd is ~0.02 Ω. Schuifcontacten verhogen dit tot &gt;0.2 Ω, wat het rendement sterk schaadt.
              </span>
            </div>

          </div>
        </div>

        {/* RESULTS GRID COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <span>Elektromagnetische Berekeningen & Status</span>
              <span className="font-mono text-[11px] text-slate-400">
                GOLFLENGTE (λ): {wavelength.toFixed(2)}m
              </span>
            </h3>

            {/* Theoretical limits warn display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {isElectricallySmall ? (
                <div className="flex gap-2 items-start p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-slate-805 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 font-medium">Formule Status: Optimaal.</strong> De loop-omtrek ({inputs.circumference}m) is korter dan 0.1 λ. De stroom is homogeen, waardoor de theorie uitstekend aansluit.
                  </div>
                </div>
              ) : isOutsideTheoreticalLimit ? (
                <div className="flex gap-2 items-start p-4 bg-rose-50 border border-rose-150 rounded-lg text-xs text-rose-905 leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-rose-950 font-bold">Waarschuwing: Omtrek te groot.</strong> De loop omtrek is groter dan 0.25 λ. Er treden faseverschillen op en de antenne verliest zijn magnetische werking.
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 items-start p-4 bg-amber-50 border border-amber-150 rounded-lg text-xs text-amber-905 leading-relaxed">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-950 font-bold">Overgangsgebied (0.1 - 0.25 λ).</strong> De antenne werkt uitstekend, maar begint directionele dipoolwerking te vertonen op de bovenfrequenties.
                  </div>
                </div>
              )}

              {/* High voltage danger warning box */}
              {results.capacitorVoltage > 1200 && (
                <div className="flex gap-2 items-start p-4 bg-rose-50 border border-rose-150 rounded-lg text-xs text-rose-905 leading-relaxed">
                  <Zap className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-rose-950 font-bold">Hoogspanning Risico.</strong> Bij {inputs.inputPower}W ontstaat er een dodelijke piekspanning van <span className="font-mono font-bold text-rose-700">{results.capacitorVoltage.toFixed(0)} V</span> over de condensator platen!
                  </div>
                </div>
              )}
            </div>

            {/* Core statistics cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-xl">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Tuning Capaciteit
                </div>
                <div className="text-2xl font-light text-slate-900 mt-1">
                  {results.tuningCapacitance.toFixed(1)} <span className="text-xs font-mono text-slate-450">pF</span>
                </div>
                <div className="text-[10px] text-slate-450 mt-1.5">
                  C-waarde bij {inputs.frequency} MHz
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Piekspanning (Vc)
                </div>
                <div className="text-2xl font-light text-slate-900 mt-1">
                  {results.capacitorVoltage > 1000 
                    ? `${(results.capacitorVoltage / 1000).toFixed(1)} kV` 
                    : `${results.capacitorVoltage.toFixed(0)} V`}
                </div>
                <div className="text-[10px] text-slate-455 mt-1.5">
                  Plaatafstand: <strong className="font-mono">{(results.capacitorVoltage / 3000).toFixed(1)} mm</strong>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  AC-Stroom (I_rms)
                </div>
                <div className="text-2xl font-light text-slate-900 mt-1">
                  {results.loopCurrent.toFixed(1)} <span className="text-xs font-mono text-slate-450">A</span>
                </div>
                <div className="text-[10px] text-slate-455 mt-1.5 font-sans">
                  Circuleert in de buis!
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Bandbreedte
                </div>
                <div className="text-2xl font-light text-blue-800 mt-1">
                  {results.bandwidth.toFixed(1)} <span className="text-xs font-mono text-slate-450">kHz</span>
                </div>
                <div className="text-[10px] text-slate-455 mt-1.5">
                  Q-Factor: <strong className="font-mono">{results.qualityFactor.toFixed(0)}</strong>
                </div>
              </div>
            </div>

            {/* Sub-components losses and efficiency */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Verliesweerstanden & Rendement Verdeling
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-650">
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-medium text-slate-800">Stralingsweerstand (R_rad):</span>
                    <span className="font-mono font-semibold text-emerald-700">{results.radiationResistance.toFixed(2)} mΩ</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-medium text-slate-805">Huidverlies buis (R_skin):</span>
                    <span className="font-mono font-semibold text-amber-700">{results.lossResistance.toFixed(2)} mΩ</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-medium text-slate-805">Extra contact verlies (R_contact):</span>
                    <span className="font-mono font-semibold text-slate-650">{(inputs.contactResistance * 1000).toFixed(0)} mΩ</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 pt-1.5">
                    <span>Totale weerstand (R_total):</span>
                    <span className="font-mono">{results.totalResistance.toFixed(1)} mΩ</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center bg-white p-5 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Rendement van deze Loop (η)</span>
                  <div className="text-3xl font-light text-slate-900 mt-1">
                    {results.efficiency.toFixed(2)} %
                  </div>
                  <p className="text-[10px] text-slate-450 text-center mt-3 leading-relaxed max-w-xs font-sans">
                    Van de {inputs.inputPower}W wordt { (inputs.inputPower * results.efficiency / 100).toFixed(2) } W effectief uitgestraald. De rest verwarmt de koperen pijp.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COUPLING AND RADIATION PATTERNS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Coupling visualizer card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Voeding & Koppeling naar Transceiver
              </h4>

              <div className="flex gap-1 border border-slate-200 p-0.5 rounded bg-slate-50">
                {(['faraday', 'gamma', 'toroid'] as const).map(style => (
                  <button
                    key={style}
                    onClick={() => setCouplingType(style)}
                    className={`flex-1 py-1.5 rounded-sm text-center font-mono text-[10px] uppercase tracking-wider transition-all ${
                      couplingType === style 
                        ? 'bg-slate-900 text-white font-medium shadow-xs'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {style === 'faraday' ? 'Faraday' : style === 'gamma' ? 'Gamma' : 'Toroid'}
                  </button>
                ))}
              </div>

              {/* Dynamic SVG representing coupling loops */}
              <div className="h-44 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-2 relative overflow-hidden">
                <svg viewBox="0 0 200 160" className="h-full">
                  {/* Outer Main Loop outline */}
                  <path d="M 100 10 A 65 65 0 1 1 99.9 10" fill="none" stroke="#64748b" strokeWidth="4.5" />
                  {/* Tuning Capacitor at bottom */}
                  <rect x="85" y="132" width="30" height="15" fill="#1e293b" rx="2" />
                  <text x="100" y="142" fill="#ffffff" fontSize="7" textAnchor="middle" fontFamily="monospace">CAP</text>

                  {/* FARADAY LOOP DESIGN */}
                  {couplingType === 'faraday' && (
                    <g>
                      {/* Shielded Faraday loop at top (exactly 1/5 diameter) */}
                      <circle cx="100" cy="32" r="14" fill="none" stroke="#0f172a" strokeWidth="2.5" />
                      <line x1="100" y1="46" x2="100" y2="70" stroke="#0f172a" strokeWidth="1.5" />
                      <text x="105" y="65" fill="#475569" fontSize="7" fontFamily="monospace">50Ω Coax</text>
                      <circle cx="100" cy="32" r="2.5" fill="#475569" />
                      <text x="100" y="24" fill="#0f172a" fontSize="6.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Faraday Loop</text>
                    </g>
                  )}

                  {/* GAMMA MATCH DESIGN */}
                  {couplingType === 'gamma' && (
                    <g>
                      {/* Feeding point grounded bottom and sliding bar up */}
                      <line x1="100" y1="130" x2="140" y2="130" stroke="#475569" strokeWidth="2" />
                      <line x1="140" y1="130" x2="140" y2="80" stroke="#0f172a" strokeWidth="2" />
                      {/* Sliding Gamma rod connector */}
                      <rect x="136" y="90" width="8" height="5" fill="#0f172a" />
                      <line x1="100" y1="130" x2="100" y2="150" stroke="#0f172a" strokeWidth="1.5" />
                      <text x="110" y="115" fill="#475569" fontSize="7" fontFamily="monospace">Gamma-rod</text>
                    </g>
                  )}

                  {/* TOROIDAL COUPLING */}
                  {couplingType === 'toroid' && (
                    <g>
                      {/* Toroidal core at bottom next to cap */}
                      <circle cx="50" cy="110" r="10" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                      <circle cx="50" cy="110" r="4.5" fill="#f8fafc" />
                      {/* winding lines */}
                      <path d="M 44 110 Q 50 115 56 110 M 43 107 Q 50 112 57 107" fill="none" stroke="#0f172a" strokeWidth="1" />
                      {/* main tube passing through toroid */}
                      <text x="50" y="94" fill="#0f172a" fontSize="6.5" fontFamily="monospace" textAnchor="middle">Ferriet Toroid</text>
                    </g>
                  )}
                </svg></div>

                <div className="absolute bottom-2 left-2 text-[9px] font-mono text-slate-400">
                  {couplingType === 'faraday' && 'Faraday loop: Geïsoleerd van de hoofdring. Koppelt puur inductief.'}
                  {couplingType === 'gamma' && 'Gamma match: Directe voeding. Schuif de clip om de 50 Ohm SWR te dippen.'}
                  {couplingType === 'toroid' && 'Toroid match: Hoofdstroom loopt door ferrietkern als één turn secundair.'}
                </div>
              </div>

            {/* Directional antenna pattern card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h4 className="text-base font-sans font-semibold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600 animate-spin-slow" />
                Stralingsdiagram & Richtingswerking
              </h4>

              <div className="h-44 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center relative p-2">
                
                {/* Custom rendering of polar toroidal figure 8 pattern */}
                <svg viewBox="0 0 160 160" className="h-full">
                  {/* Grid lines */}
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#334155" strokeWidth="0.5" />
                  <circle cx="80" cy="80" r="45" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
                  <circle cx="80" cy="80" r="20" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
                  {/* Axes */}
                  <line x1="80" y1="5" x2="80" y2="155" stroke="#334155" strokeWidth="0.5" />
                  <line x1="5" y1="80" x2="155" y2="80" stroke="#334155" strokeWidth="0.5" />

                  {/* Loop orientation representation inside */}
                  <line x1="80" y1="65" x2="80" y2="95" stroke="#b45309" strokeWidth="3" />
                  <text x="80" y="60" fill="#b45309" fontSize="6" textAnchor="middle" fontFamily="monospace">Loop Vlak</text>

                  {/* Figure 8 pattern: major lobes along loop plane, sharp deep nulls perpendicular */}
                  {/* Toroidal gain pattern for magnetic loop aligned along vertical Y-axis:
                      r(theta) = sin(theta) centered on the X-axis */}
                  <path 
                    d="M 80 80 
                       C 140 30, 140 130, 80 80
                       C 20 30, 20 130, 80 80 Z" 
                    fill="url(#patternGradient)" 
                    stroke="#10b981" 
                    strokeWidth="2" 
                    fillOpacity="0.4"
                  />
                  
                  {/* Compass labels */}
                  <text x="145" y="83" fill="#10b981" fontSize="7" fontFamily="sans-serif" fontWeight="bold">Max Lobe</text>
                  <text x="15" y="83" fill="#10b981" fontSize="7" fontFamily="sans-serif" fontWeight="bold">Max Lobe</text>
                  <text x="80" y="15" fill="#ef4444" fontSize="7" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">DEEP NULL</text>
                  <text x="80" y="153" fill="#ef4444" fontSize="7" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">DEEP NULL</text>

                  {/* Gradients */}
                  <defs>
                    <radialGradient id="patternGradient">
                      <stop offset="20%" stopColor="#059669" />
                      <stop offset="90%" stopColor="#10b981" />
                    </radialGradient>
                  </defs>
                </svg>

                <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-400 text-right">
                  Let op: Het zendpatroon staat haaks op wat velen denken!<br />
                  De straling is maximaal <strong>in het vlak</strong> van de ring.<br />
                  Er is een extreme drop (null van wel 30 dB) <strong>dwars door het gat</strong>.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
