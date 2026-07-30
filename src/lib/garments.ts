export interface UserMeasurements {
  height: number;
  chest: number;
  waist: number;
  hips: number;
  inseam: number;
}

export interface GarmentMeasurements {
  chest?: number; // cm
  waist?: number; // cm
  hips?: number;  // cm
  height?: number; // cm
  inseam?: number; // cm
}

export interface GarmentSizeGuide {
  S: GarmentMeasurements;
  M: GarmentMeasurements;
  L: GarmentMeasurements;
  XL: GarmentMeasurements;
  '2XL': GarmentMeasurements;
}

export interface Garment {
  id: string;
  name: string;
  category: 'Top' | 'Bottom' | 'Outerwear';
  price: number; // in LKR
  cost?: number; // manufacturing cost in LKR (for printed oversized T-shirts)
  description: string;
  technicalDetails: string[];
  sizes: GarmentSizeGuide;
  inventory: {
    S: number;
    M: number;
    L: number;
    XL: number;
    '2XL': number;
  };
  colorTheme: {
    primary: string;
    secondary: string;
    glow: string;
    glowRgb: string;
  };
  visualStyle: {
    type: 'blazer' | 'parka' | 'trousers' | 'frock' | 'skirt';
    primaryColor: string;
    accentColor: string;
    glowingLines: boolean;
  };
  gender: 'Male' | 'Female' | 'Unisex';
  brand?: string; // e.g. 'Universe' for collab brand garments
  image: string; // relative path under /public e.g. "/aurelia_silk_frock.png"
  images?: string[]; // optional additional gallery images
  video?: string; // optional runway video path
  disabledSizes?: ('S' | 'M' | 'L' | 'XL' | '2XL')[];
  categoryName?: string;
}

export const GARMENTS: Garment[] = [];
