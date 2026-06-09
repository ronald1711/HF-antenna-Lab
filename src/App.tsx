/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import MagLoopCalc from './components/MagLoopCalc';
import ScrewdriverBuilder from './components/ScrewdriverBuilder';
import TheorySection from './components/TheorySection';
import WarningsSection from './components/WarningsSection';

import { 
  Radio, 
  Sliders, 
  Wrench, 
  BookOpen, 
  AlertTriangle, 
  ShieldCheck,
  Zap, 
  Info,
  HelpCircle,
  Menu,
  ChevronRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'welcome' | 'magloop' | 'screwdriver' | 'theory' | 'warnings'>('welcome');

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-[#1a1a1a] flex flex-col justify-between" id="app-root">
      
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-light tracking-tight text-slate-900">
                HF Antenna <span className="font-semibold">Design & Learning Lab</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1.5 uppercase tracking-widest font-mono">
                AMATEUR RADIO EXPERT SYSTEM • REACTION MATCHED CALCULATORS
              </p>
            </div>

            {/* Top Stats Banner */}
            <div className="flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded border border-slate-200 text-[11px] text-slate-600 font-mono">
              <div>
                <span className="text-slate-400">RAILLIMIET:</span>{' '}
                <span className="text-slate-800 font-bold">3.5 — 30 MHz</span>
              </div>
              <div className="border-l border-slate-200 h-4" />
              <div>
                <span className="text-slate-400">MAX VERMOGEN:</span>{' '}
                <span className="text-slate-800 font-bold">1500W PEP</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CORE NAVIGATION BAR */}
      <nav className="bg-[#fdfdfd] border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-3 scrollbar-none">
            <div className="flex space-x-2 w-full shrink-0">
              
              <button
                onClick={() => setActiveTab('welcome')}
                className={`px-4 py-2 font-mono uppercase tracking-wider text-xs border transition-all shrink-0 ${
                  activeTab === 'welcome'
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                id="tab-welcome"
              >
                Welkom & Keuze
              </button>

              <button
                onClick={() => setActiveTab('magloop')}
                className={`px-4 py-2 font-mono uppercase tracking-wider text-xs border transition-all shrink-0 ${
                  activeTab === 'magloop'
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                id="tab-magloop"
              >
                Magnetic Loop Calculator
              </button>

              <button
                onClick={() => setActiveTab('screwdriver')}
                className={`px-4 py-2 font-mono uppercase tracking-wider text-xs border transition-all shrink-0 ${
                  activeTab === 'screwdriver'
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                id="tab-screwdriver"
              >
                Zelfbouw DIY SD-330
              </button>

              <button
                onClick={() => setActiveTab('theory')}
                className={`px-4 py-2 font-mono uppercase tracking-wider text-xs border transition-all shrink-0 ${
                  activeTab === 'theory'
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                id="tab-theory"
              >
                Theorie & Wetenschap
              </button>

              <button
                onClick={() => setActiveTab('warnings')}
                className={`px-4 py-2 font-mono uppercase tracking-wider text-xs border transition-all shrink-0 ${
                  activeTab === 'warnings'
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                id="tab-warnings"
              >
                Veiligheid & RF Gevaren
              </button>

            </div>
          </div>
        </div>
      </nav>

      {/* VIEWPORT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'welcome' && (
          <div className="space-y-8" id="welcome-intro-panel">
            
            {/* Elegant light slate architectural banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-slate-800 relative overflow-hidden">
              <div className="relative z-10 max-w-3xl space-y-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold block">
                  AMATEUR RADIO ANTENNA ENGINEERING PLATFORM
                </span>
                <h2 className="text-3xl font-light tracking-tight text-slate-900 leading-tight">
                  Ontwerp Jouw Ideale <span className="font-semibold">HF Antenne</span> Zonder Ruimtegevoeligheid
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed font-sans">
                  Welkom bij de HF Antenna Lab. Als gelicenseerd zendamateur of luisteramateur (SWL) 
                  loop je vaak tegen ruimtegebrek aan, of mag je geen grote masten plaatsen in de woonwijk. 
                  Gelukkig bieden twee uiterst compacte antennetypes dé oplossing voor DX op HF (Korte Golf): 
                  de <strong>Magnetic Loop</strong> (voor vaste locaties) en de <strong>Screwdriver Monopool</strong> (zoals de Diamond SD-330 voor mobiel gebruik).
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button 
                    onClick={() => setActiveTab('magloop')}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono uppercase tracking-wider py-2.5 px-4 transition-all"
                  >
                    Magnetic Loop Calculator &rarr;
                  </button>
                  <button 
                    onClick={() => setActiveTab('screwdriver')}
                    className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-xs font-mono uppercase tracking-wider py-2.5 px-4 transition-all"
                  >
                    DIY SD-330 Bouwer &rarr;
                  </button>
                </div>
              </div>

              {/* Sophisticated light accent */}
              <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-3 hidden md:block select-none pointer-events-none">
                <Radio className="w-56 h-56 text-slate-950" />
              </div>
            </div>

            {/* In-depth Comparison Matrix block */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400">
                Antennevergelijker: Magnetic Loop vs. Motorized Screwdriver (SD-330)
              </h3>
              
              <div className="overflow-x-auto text-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-mono text-slate-400 uppercase">
                      <th className="pb-3 pr-4 font-normal">Eigenschap</th>
                      <th className="pb-3 px-4 font-semibold text-slate-800">Small Transmitting Loop (Magloop)</th>
                      <th className="pb-3 pl-4 font-semibold text-slate-800">Screwdriver (Diamond SD-330 Style)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-800">Type Straling</td>
                      <td className="py-3 px-4">Voornamelijk Magnetische Velden (stil, low QRM)</td>
                      <td className="py-3 pl-4">Elektrisch verkorte kwart-golf Monopool (E-veld)</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-800">Ideale Installatie</td>
                      <td className="py-3 px-4">Vaste balkons, slaapkamers, zolders of binnentuinen</td>
                      <td className="py-3 pl-4">Mobiel op de auto, vrachtwagen of balkonrand</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-800">Aardingsgevoeligheid</td>
                      <td className="py-3 px-4"><strong>Zelfstandig:</strong> Heeft geen aarde of tegencapaciteit nodig</td>
                      <td className="py-3 pl-4"><strong>Kritisch:</strong> Vereist carrosserie chassis-aarde</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-800">Bandbreedte (Q)</td>
                      <td className="py-3 px-4">Super smal (&lt;15 kHz). Vereist constante fijnafstemming</td>
                      <td className="py-3 pl-4">Smal, maar breder dan magloops. Makkelijker over banden skippen</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-800">Kritiek Onderdeel</td>
                      <td className="py-3 px-4">Afstemcondensator (Vereist &gt;4kV ratings bij 100W)</td>
                      <td className="py-3 pl-4">12V DC sleepcontact (Slijtage & overgangsheat)</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-800">Ontvangst (Receive)</td>
                      <td className="py-3 px-4">Uitmuntend stil. Richtbare noise nulls door de loop te draaien</td>
                      <td className="py-3 pl-4">Gevoeliger voor lokale storingsbronnen</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* App features overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                <Sliders className="w-5 h-5 text-slate-705" />
                <h4 className="text-sm font-sans font-semibold text-slate-900 uppercase tracking-tight">1. Magloop Analysis Tool</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Bereken de benodigde variabele condensator (pF), stroomsterktes, en inductiewaarden. 
                  Inclusief 2D stralingspatroon-grafiek en overspanningsbeschermingsadvies.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                <Wrench className="w-5 h-5 text-slate-705" />
                <h4 className="text-sm font-sans font-semibold text-slate-900 uppercase tracking-tight">2. DIY SD-330 Assembly</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ontdek de mechanische werking van telescopische en motor-gestuurde screwdriver antennes. 
                  Met interactieve schema's en wikkelen-berekeningen.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                <BookOpen className="w-5 h-5 text-slate-705" />
                <h4 className="text-sm font-sans font-semibold text-slate-900 uppercase tracking-tight">3. RF Physics & Safety</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Gedetailleerde formules, proximity effects op de spoel Q-factor, 
                  en overspanningen om brandwonden of vonkoverslag te voorkomen.
                </p>
              </div>

            </div>

          </div>
        )}

        {activeTab === 'magloop' && <MagLoopCalc />}

        {activeTab === 'screwdriver' && <ScrewdriverBuilder />}

        {activeTab === 'theory' && <TheorySection />}

        {activeTab === 'warnings' && <WarningsSection />}

      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-white border-t border-slate-200 px-4 py-8 text-slate-400 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span>© 2026 Amateur Radio RF Research Lab. Ontwikkeld voor HF ontwerpers.</span>
          </div>
          <div className="flex gap-6 uppercase tracking-widest text-[10px] text-slate-450">
            <span>Ontwerp</span>
            <span>Specificaties</span>
            <span>Veiligheidsrichtlijn</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
