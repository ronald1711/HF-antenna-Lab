/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MagLoopInputs, MagLoopOutputs, ScrewdriverInputs, ScrewdriverOutputs } from '../types';

// Physical constants
const MU_0 = 4 * Math.PI * 1e-7; // permeability of free space (H/m)
const SPEED_OF_LIGHT = 299792458; // m/s

const MATERIAL_RESISTIVITY = {
  copper: 1.72e-8,
  aluminum: 2.65e-8,
  brass: 7.0e-8,
};

/**
 * Calculates primary magnetic loop antenna outputs
 */
export function calculateMagLoop(inputs: MagLoopInputs): MagLoopOutputs {
  const {
    shape,
    circumference,
    conductorDiameter,
    material,
    frequency,
    inputPower,
    contactResistance,
  } = inputs;

  const fHz = frequency * 1e6;
  const lambda = SPEED_OF_LIGHT / fHz;
  const dMeters = conductorDiameter / 1000;
  const rho = MATERIAL_RESISTIVITY[material] || MATERIAL_RESISTIVITY.copper;

  // 1. Loop Area & equivalent diameter
  let area = 0;
  let formFactorInductance = 1.07; // Circular default

  if (shape === 'circular') {
    const r = circumference / (2 * Math.PI);
    area = Math.PI * r * r;
    formFactorInductance = 1.07;
  } else if (shape === 'square') {
    const s = circumference / 4;
    area = s * s;
    formFactorInductance = 1.22;
  } else if (shape === 'octagon') {
    // Area of octagon is approx 0.0754 * C^2
    area = 0.07542 * circumference * circumference;
    formFactorInductance = 1.15; // Interpolated
  }

  // 2. Loop Inductance using standard high-precision formula
  // L = 2e-7 * C * [ ln(C/d) - formFactor ] Henry
  const lnTerm = Math.log(circumference / dMeters);
  const indH = 2e-7 * circumference * (lnTerm - formFactorInductance);
  const inductanceU_H = indH * 1e6;

  // 3. Reactance X_L = 2*pi*f*L
  const reactance = 2 * Math.PI * fHz * indH;

  // 4. Tuning Capacitance: C = 1 / ( (2*pi*f)^2 * L )
  const tuningCapFarads = 1 / (Math.pow(2 * Math.PI * fHz, 2) * indH);
  const tuningCapacitancePF = tuningCapFarads * 1e12;

  // 5. Skin depth: delta = sqrt( rho / (pi * mu_0 * f) )
  const skinDepth = Math.sqrt(rho / (Math.PI * MU_0 * fHz));

  // 6. Loop Loss Resistance (Skin effect)
  // R_loss = (rho * C) / (pi * d * delta)
  const lossResistance = (rho * circumference) / (Math.PI * dMeters * skinDepth);

  // 7. Radiation Resistance
  // R_rad = 31200 * (Area / lambda^2)^2
  const radResistance = 31200 * Math.pow(area / (lambda * lambda), 2);

  // 8. Total Resistance (incorporates skin loss, radiation, and contact)
  const totalResistance = radResistance + lossResistance + contactResistance;

  // 9. Q-Factor: Q = X_L / R_total
  const qualityFactor = reactance / totalResistance;

  // 10. Bandwidth: BW = f_Hz / Q. Displayed in kHz
  const bandwidthHz = fHz / qualityFactor;
  const bandwidthKHZ = bandwidthHz / 1000;

  // 11. Efficiency in %
  const efficiency = (radResistance / totalResistance) * 100;

  // 12. Loop Current (RMS)
  // P = I^2 * R_total => I = sqrt( P / R_total )
  const loopCurrent = Math.sqrt(inputPower / totalResistance);

  // 13. Capacitor peak voltage
  // V_peak = I_RMS * X_C * sqrt(2) == I_RMS * X_L * sqrt(2)
  const capacitorVoltage = loopCurrent * reactance * Math.sqrt(2);

  return {
    inductance: inductanceU_H,
    reactance,
    tuningCapacitance: tuningCapacitancePF,
    radiationResistance: radResistance * 1000, // convert to mOhms
    lossResistance: lossResistance * 1000, // convert to mOhms
    skinDepth: skinDepth * 1e6, // convert to microns
    totalResistance: totalResistance * 1000, // convert to mOhms
    qualityFactor,
    bandwidth: bandwidthKHZ,
    efficiency,
    loopCurrent,
    capacitorVoltage,
    inductiveL: indH,
  };
}

/**
 * Calculates primary motorized screwdriver whip antenna parameters (Diamond SD-330 style)
 */
export function calculateScrewdriver(inputs: ScrewdriverInputs): ScrewdriverOutputs {
  const {
    whipLength,
    whipDiameter,
    frequency,
    inputPower,
    coilDiameter,
    coilWireDiameter,
    coilLengthMax,
    coilTurnsMax,
    contactResistance,
  } = inputs;

  const fHz = frequency * 1e6;
  const lambda = SPEED_OF_LIGHT / fHz;
  const rWhip = whipDiameter / 2000; // Radius in meters
  const dCoilMeters = coilDiameter / 1000;
  const dWireMeters = coilWireDiameter / 1000;

  // 1. Monopole radiation resistance over average mobile ground car body
  // R_rad = 395 * (H / lambda)^2
  const whipReactanceFraction = (2 * Math.PI * whipLength) / lambda;
  const whipRadiationResistance = 39.5 * Math.pow(whipReactanceFraction, 2); // monopole radiation resistance

  // 2. Monopole self-capacitance and Reactance
  // Characteristic impedance of a vertical whip
  const z0 = 60 * (Math.log(whipLength / rWhip) - 1);
  
  // Reactance: X_a = -z0 * cot(2 * pi * H / lambda)
  // Protect against division by zero if whip is exactly odd multiple of quarter wave
  const arg = (2 * Math.PI * whipLength) / lambda;
  let whipReactance = -99999;
  if (Math.abs(Math.sin(arg)) > 1e-6) {
    whipReactance = -z0 / Math.tan(arg);
  }

  // Equivalent self-capacitance
  const whipCapacitance = 1e12 / (2 * Math.PI * fHz * Math.abs(whipReactance));

  // 3. Required inductance to resonate whip (X_L = -X_a)
  const reqInd_H = Math.abs(whipReactance) / (2 * Math.PI * fHz);
  const requiredInductance = reqInd_H * 1e6; // in uH

  // 4. Solve Wheeler's single layer solenoid formula to find active turns
  // L_uH = D_mm^2 * n^2 / (450 * D_mm + 1000 * l)
  // Since pitch p = coilLengthMax / coilTurnsMax, active length l = n * p
  // So: D^2 * n^2 - 1000 * p * L * n - 450 * D * L = 0
  const pitch = coilLengthMax / coilTurnsMax; // mm per turn
  const D = coilDiameter;
  const L = requiredInductance;

  const A_coeff = D * D;
  const B_coeff = -1000 * pitch * L;
  const C_coeff = -450 * D * L;

  let requiredTurns = 0;
  let solenoidLengthActive = 0;

  if (L <= 0 || A_coeff <= 0) {
    requiredTurns = 0;
  } else {
    // Solve quadratic equation: A*n^2 + B*n + C = 0
    const discriminant = B_coeff * B_coeff - 4 * A_coeff * C_coeff;
    if (discriminant >= 0) {
      requiredTurns = (-B_coeff + Math.sqrt(discriminant)) / (2 * A_coeff);
    }
    requiredTurns = Math.min(requiredTurns, coilTurnsMax);
    solenoidLengthActive = requiredTurns * pitch;
  }

  // 5. Calculate Coil Loss Resistance at RF
  // Active coil wire length
  const singleTurnLength = Math.PI * Math.sqrt(D * D + pitch * pitch) / 1000; // in meters
  const totalWireLength = requiredTurns * singleTurnLength;

  // Skin depth for copper wire at fHz
  const copperResistivity = 1.72e-8;
  const skinDepth = Math.sqrt(copperResistivity / (Math.PI * MU_0 * fHz));

  // AC resistance of coil straight wire
  const racStraight = (copperResistivity * totalWireLength) / (Math.PI * dWireMeters * skinDepth);

  // Proximity factor accounts for magnetic coupling in compact solenoid windings at RF
  // Solenoid coils wound tightly can have AC resistance 3.5x to 5x of the skin-effect alone.
  const proximityFactor = 3.8;
  const coilLossResistance = racStraight * proximityFactor;

  // 6. Coil Quality factor (Q_coil = X_L / R_coil_loss)
  const coilQ = Math.max(1, Math.abs(whipReactance) / (coilLossResistance + 1e-5));

  // 7. Ground loss resistance for a typical mobile installation (chassis ground)
  const whipLossResistance = 12.0; // 12 Ohms is typical for a well-grounded trunk mount/bumper mount on a car

  // Total Resistive Feed Impedance
  // R_feed = R_rad + R_coil_loss + R_ground_loss + R_contact
  const totalFeedR = whipRadiationResistance + coilLossResistance + whipLossResistance + contactResistance;

  // 8. Systems SWR before matching network
  const unmatchedSWR = Math.max(totalFeedR / 50, 50 / totalFeedR);

  // 9. Overall System Radiation Efficiency
  const systemEfficiency = (whipRadiationResistance / totalFeedR) * 100;

  // 10. Shunt Matching Inductance at the feedpoint to match low feed resistor to 50 ohms
  // L_shunt = sqrt(R_feed * (50 - R_feed)) / (2 * pi * f_Hz * 50)
  let capacitorEquivalent = 0;
  if (totalFeedR < 50) {
    const rPart = Math.sqrt(totalFeedR * (50 - totalFeedR));
    const matchingL_H = rPart / (2 * Math.PI * fHz * 50);
    // Let's compute equivalent shunt value if matched with C-shunt
    const matchingC_F = 1 / (2 * Math.PI * fHz * Math.sqrt(totalFeedR * 50));
    capacitorEquivalent = matchingC_F * 1e12; // shunt matching C in pF
  }

  return {
    whipReactance,
    whipCapacitance,
    whipRadiationResistance,
    whipLossResistance,
    requiredInductance,
    requiredTurns,
    solenoidLengthActive,
    coilLossResistance,
    coilQ,
    systemEfficiency,
    unmatchedSWR,
    capacitorEquivalent,
  };
}
