/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MagLoopInputs {
  shape: 'circular' | 'square' | 'octagon';
  circumference: number; // in meters
  conductorDiameter: number; // in millimeters
  material: 'copper' | 'aluminum' | 'brass';
  frequency: number; // in MHz
  inputPower: number; // in Watts
  contactResistance: number; // in Ohms (e.g., 0.05 for solder, higher for sliding)
}

export interface MagLoopOutputs {
  inductance: number; // in microHenries (µH)
  reactance: number; // inductive reactance in Ohms at f
  tuningCapacitance: number; // in pF
  radiationResistance: number; // in mOhms
  lossResistance: number; // in mOhms
  skinDepth: number; // in microns (µm)
  totalResistance: number; // in mOhms
  qualityFactor: number; // Q
  bandwidth: number; // in kHz (-3dB)
  efficiency: number; // in %
  loopCurrent: number; // RMS current in Amperes
  capacitorVoltage: number; // Peak voltage in Volts
  inductiveL: number; // in Henries
}

export interface ScrewdriverInputs {
  whipLength: number; // in meters (typically 0.5 to 2.5m)
  whipDiameter: number; // in millimeters
  frequency: number; // in MHz
  inputPower: number; // in Watts
  coilDiameter: number; // in millimeters (body of SD-330 is ~40-50mm)
  coilWireDiameter: number; // in millimeters (wire thickness)
  coilLengthMax: number; // total winding length in millimeters
  coilTurnsMax: number; // total number of turns wound on body
  contactResistance: number; // sliding contact resistance in Ohms
}

export interface ScrewdriverOutputs {
  whipReactance: number; // capacitive reactance (negative Ohms)
  whipCapacitance: number; // equivalent capacitance in pF
  whipRadiationResistance: number; // in Ohms (very small)
  whipLossResistance: number; // due to soil / ground plane (e.g., 10-30 ohms standard mobile ground)
  requiredInductance: number; // in µH to resonate the whip
  requiredTurns: number; // estimated active turns needed
  solenoidLengthActive: number; // active coil length in mm
  coilLossResistance: number; // RF loss in coil (mOhms)
  coilQ: number; // Quality factor of coil alone
  systemEfficiency: number; // Overall efficiency (%)
  unmatchedSWR: number; // estimated SWR before matching network
  capacitorEquivalent: number; // equivalent matching shunt capacitance if using C-match
}
