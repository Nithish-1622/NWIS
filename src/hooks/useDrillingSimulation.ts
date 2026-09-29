'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TelemetryPoint, RiskAssessment, Well } from '@/types/nwis';
import { SIMULATION_TELEMETRY_STEPS } from '@/data/telemetry';
import { calculateRiskAssessment } from '@/lib/risk-engine';
import { ACTIVE_WELL, OFFSET_WELLS } from '@/data/wells';

export interface SimulationState {
  currentStepIndex: number;
  telemetry: TelemetryPoint;
  history: TelemetryPoint[];
  riskAssessment: RiskAssessment;
  isPlaying: boolean;
  speed: number; // 1x, 2x, 4x, 8x
  activeWell: Well;
  offsetWells: Well[];
  selectedOffsetWell: Well | null;
  radiusFilter: number; // 500, 1000, 2000, 5000 meters
}

export function useDrillingSimulation() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [selectedOffsetWell, setSelectedOffsetWell] = useState<Well | null>(OFFSET_WELLS[0]);
  const [radiusFilter, setRadiusFilter] = useState<number>(2000);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentTelemetry = SIMULATION_TELEMETRY_STEPS[currentStepIndex] || SIMULATION_TELEMETRY_STEPS[0];
  const history = SIMULATION_TELEMETRY_STEPS.slice(0, currentStepIndex + 1);
  const currentRisk = calculateRiskAssessment(currentTelemetry);

  // Filter offset wells by radius
  const filteredOffsetWells = OFFSET_WELLS.filter((w) => w.distance <= radiusFilter);

  const start = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const fastForward = useCallback(() => {
    // Jump straight to Critical Hazard stage (step 52)
    setCurrentStepIndex(52);
    setIsPlaying(false);
  }, []);

  const setStep = useCallback((step: number) => {
    const clamped = Math.max(0, Math.min(step, SIMULATION_TELEMETRY_STEPS.length - 1));
    setCurrentStepIndex(clamped);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(1200 / speed, 150);
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= SIMULATION_TELEMETRY_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, speed]);

  return {
    currentStepIndex,
    totalSteps: SIMULATION_TELEMETRY_STEPS.length,
    telemetry: currentTelemetry,
    history,
    riskAssessment: currentRisk,
    isPlaying,
    speed,
    setSpeed,
    start,
    pause,
    reset,
    fastForward,
    setStep,
    activeWell: ACTIVE_WELL,
    offsetWells: filteredOffsetWells,
    allOffsetWells: OFFSET_WELLS,
    selectedOffsetWell,
    setSelectedOffsetWell,
    radiusFilter,
    setRadiusFilter,
  };
}
