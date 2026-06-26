'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Garment, GARMENTS } from '@/lib/garments';

export interface UserMeasurements {
  height: number;
  chest: number;
  waist: number;
  hips: number;
  inseam: number;
}

export interface SizeComparisons {
  sizeDown: string;
  selected: string;
  sizeUp: string;
}

export interface FitAdvisoryData {
  recommendedSize: 'S' | 'M' | 'L' | 'XL';
  fitAndFeel: string;
  sizeComparisons: SizeComparisons;
}

interface AtelierContextType {
  measurements: UserMeasurements;
  selectedGarment: Garment;
  selectedSize: 'S' | 'M' | 'L' | 'XL';
  fitAdvisory: FitAdvisoryData | null;
  isLoading: boolean;
  isAtelierOpen: boolean;
  updateMeasurement: (key: keyof UserMeasurements, value: number) => void;
  setSelectedGarment: (garment: Garment) => void;
  setSelectedSize: (size: 'S' | 'M' | 'L' | 'XL') => void;
  setIsAtelierOpen: (open: boolean) => void;
  runTryOn: () => Promise<void>;
  resetAtelier: () => void;
}

const defaultMeasurements: UserMeasurements = {
  height: 175,
  chest: 96,
  waist: 82,
  hips: 100,
  inseam: 80,
};

const AtelierContext = createContext<AtelierContextType | undefined>(undefined);

export function AtelierProvider({ children }: { children: React.ReactNode }) {
  const [measurements, setMeasurements] = useState<UserMeasurements>(defaultMeasurements);
  const [selectedGarment, setSelectedGarment] = useState<Garment>(GARMENTS[0]);
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [fitAdvisory, setFitAdvisory] = useState<FitAdvisoryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAtelierOpen, setIsAtelierOpen] = useState(false);

  // Auto-calculate size recommendation based on waist & chest
  useEffect(() => {
    const chestVal = measurements.chest;
    const waistVal = measurements.waist;

    let recommendedSize: 'S' | 'M' | 'L' | 'XL' = 'M';

    if (selectedGarment.category === 'Bottom') {
      if (waistVal <= 75) recommendedSize = 'S';
      else if (waistVal <= 84) recommendedSize = 'M';
      else if (waistVal <= 92) recommendedSize = 'L';
      else recommendedSize = 'XL';
    } else {
      if (chestVal <= 94) recommendedSize = 'S';
      else if (chestVal <= 104) recommendedSize = 'M';
      else if (chestVal <= 112) recommendedSize = 'L';
      else recommendedSize = 'XL';
    }

    setTimeout(() => setSelectedSize(recommendedSize), 0);
  }, [measurements, selectedGarment.category]);

  const updateMeasurement = (key: keyof UserMeasurements, value: number) => {
    setMeasurements((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const runTryOn = async () => {
    setIsLoading(true);
    setFitAdvisory(null);

    try {
      const response = await fetch('/api/simulate-fit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          measurements,
          garment: selectedGarment,
          size: selectedSize,
        }),
      });

      if (!response.ok) {
        throw new Error('Serverless try-on pipeline error');
      }

      const data = await response.json();
      setFitAdvisory({
        recommendedSize: data.recommendedSize,
        fitAndFeel: data.fitAndFeel,
        sizeComparisons: data.sizeComparisons,
      });
    } catch (error) {
      console.error('Virtual Atelier pipeline execution error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAtelier = () => {
    setMeasurements(defaultMeasurements);
    setFitAdvisory(null);
    setSelectedSize('M');
  };

  return (
    <AtelierContext.Provider
      value={{
        measurements,
        selectedGarment,
        selectedSize,
        fitAdvisory,
        isLoading,
        isAtelierOpen,
        updateMeasurement,
        setSelectedGarment,
        setSelectedSize,
        setIsAtelierOpen,
        runTryOn,
        resetAtelier,
      }}
    >
      {children}
    </AtelierContext.Provider>
  );
}

export function useAtelier() {
  const context = useContext(AtelierContext);
  if (context === undefined) {
    throw new Error('useAtelier must be used within an AtelierProvider');
  }
  return context;
}
