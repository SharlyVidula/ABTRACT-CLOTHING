'use client';

import React from 'react';
import { UserMeasurements } from '@/lib/garments';
import { useAtelier } from '@/context/AtelierContext';
import { Ruler, Activity, Sparkles } from 'lucide-react';

interface MeasurementSliderProps {
  label: string;
  name: keyof UserMeasurements;
  min: number;
  max: number;
  unit: string;
  description: string;
}

export default function MeasurementForm() {
  const { measurements, updateMeasurement, selectedSize, selectedGarment } = useAtelier();

  const sliders: MeasurementSliderProps[] = [
    {
      label: 'HEIGHT',
      name: 'height',
      min: 150,
      max: 210,
      unit: 'cm',
      description: 'Total standing height from floor to crown.',
    },
    {
      label: 'CHEST / BUST',
      name: 'chest',
      min: 70,
      max: 130,
      unit: 'cm',
      description: 'Circumference around the fullest part of your chest.',
    },
    {
      label: 'WAIST',
      name: 'waist',
      min: 60,
      max: 120,
      unit: 'cm',
      description: 'Circumference around your natural narrow waistline.',
    },
    {
      label: 'HIPS',
      name: 'hips',
      min: 70,
      max: 130,
      unit: 'cm',
      description: 'Circumference around the widest part of your hips.',
    },
    {
      label: 'INSEAM',
      name: 'inseam',
      min: 60,
      max: 95,
      unit: 'cm',
      description: 'Length from crotch junction to the ankle bone.',
    },
  ];

  const isNeeded = (name: keyof UserMeasurements): boolean => {
    if (!selectedGarment) return true;
    const cat = selectedGarment.category;
    const styleType = selectedGarment.visualStyle?.type;

    if (name === 'height') return true;
    if (name === 'chest') return cat === 'Top' || cat === 'Outerwear';
    if (name === 'waist') return true;
    if (name === 'hips') return cat === 'Bottom' || styleType === 'frock' || styleType === 'skirt';
    if (name === 'inseam') return cat === 'Bottom' && styleType === 'trousers';
    return true;
  };

  const filteredSliders = sliders.filter((s) => isNeeded(s.name));

  return (
    <div className="flex flex-col gap-6 text-foreground">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Ruler className="w-5 h-5 text-cyber-green" />
        <div>
          <h3 className="font-mono text-sm tracking-widest text-[var(--theme-primary)] uppercase font-semibold">
            YOUR MEASUREMENTS
          </h3>
          <p className="text-xs text-white/40">Drag the sliders to match your body measurements</p>
        </div>
      </div>

      <div className="space-y-6">
        {filteredSliders.map((slider) => {
          const value = measurements[slider.name];
          const percent = ((value - slider.min) / (slider.max - slider.min)) * 100;

          return (
            <div key={slider.name} className="flex flex-col gap-2">
              <div className="flex justify-between items-baseline">
                <span className="font-mono text-xs tracking-wider text-white/80 font-medium">
                  {slider.label}
                </span>
                <span className="font-mono text-sm font-semibold text-[var(--theme-primary)]">
                  {value}
                  <span className="text-[10px] text-white/50 ml-0.5">{slider.unit}</span>
                </span>
              </div>
              
              <div className="relative flex items-center">
                {/* Custom glowing track background fill */}
                <div className="absolute left-0 right-0 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--theme-secondary)] to-[var(--theme-primary)]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  value={value}
                  onChange={(e) => updateMeasurement(slider.name, parseInt(e.target.value))}
                  className="w-full h-4 opacity-0 cursor-pointer relative z-10 custom-slider"
                />
                
                {/* Visual custom thumb tracker */}
                <div 
                  className="absolute pointer-events-none w-3.5 h-3.5 rounded-full bg-[var(--theme-primary)] border border-black shadow-[0_0_8px_var(--theme-glow)] transition-all"
                  style={{ left: `calc(${percent}% - 7px)` }}
                />
              </div>

              <span className="text-[10px] text-white/30 leading-relaxed">
                {slider.description}
              </span>
            </div>
          );
        })}
      </div>

      {/* Sizing Intel Box */}
      <div className="mt-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-start gap-3">
        <Activity className="w-5 h-5 text-[var(--theme-primary)] shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] tracking-wider text-[var(--theme-primary)] font-semibold uppercase">
            SIZE SUGGESTION
          </span>
          <p className="text-xs text-white/60 leading-normal">
            Based on your measurements, we suggest size{' '}
            <span className="text-[var(--theme-primary)] font-bold font-mono text-sm px-1.5 py-0.5 rounded border border-[var(--theme-primary)]/20 bg-[var(--theme-primary)]/5">
              {selectedSize}
            </span>
            . Changing your measurements will update the recommendation.
          </p>
        </div>
      </div>
    </div>
  );
}
