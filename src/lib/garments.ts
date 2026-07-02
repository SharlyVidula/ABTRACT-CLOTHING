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
  disabledSizes?: ('S' | 'M' | 'L' | 'XL')[];
  categoryName?: string;
}

export const GARMENTS: Garment[] = [
  {
    id: 'aurelia-silk-frock',
    name: 'AURELIA SILK FROCK',
    category: 'Outerwear',
    price: 5200,
    description: 'An elegant wholesale silk frock tailored with asymmetric draping panels and bioluminescent weave threads.',
    technicalDetails: [
      'Pure Mulberry silk blend',
      'Dynamic light-reactive thread overlay',
      'Asymmetric floating structural hem'
    ],
    sizes: {
      S: { chest: 88, waist: 68, hips: 92, height: 165 },
      M: { chest: 96, waist: 76, hips: 100, height: 170 },
      L: { chest: 104, waist: 84, hips: 108, height: 175 },
      XL: { chest: 112, waist: 92, hips: 116, height: 180 }
    },
    inventory: { S: 5, M: 8, L: 4, XL: 2 },
    colorTheme: {
      primary: '#d500f9',
      secondary: '#00ffaa',
      glow: 'rgba(213, 0, 249, 0.4)',
      glowRgb: '213, 0, 249'
    },
    visualStyle: {
      type: 'frock',
      primaryColor: '#1a0b22',
      accentColor: '#d500f9',
      glowingLines: true
    },
    gender: 'Female',
    image: '/aurelia_silk_frock.png'
  },
  {
    id: 'lumina-pleated-dress',
    name: 'LUMINA PLEATED DRESS',
    category: 'Outerwear',
    price: 4800,
    description: 'High-collared wholesale frock featuring laser-fused structural pleats and soft elasticated waist piping.',
    technicalDetails: [
      'Micro-pleated shape memory synthetic mesh',
      'Elastic waist cords with metallic locks',
      'Translucent cybernetic sleeve mesh panels'
    ],
    sizes: {
      S: { chest: 90, waist: 70, hips: 94, height: 165 },
      M: { chest: 98, waist: 78, hips: 102, height: 170 },
      L: { chest: 106, waist: 86, hips: 110, height: 175 },
      XL: { chest: 114, waist: 94, hips: 118, height: 180 }
    },
    inventory: { S: 3, M: 6, L: 3, XL: 1 },
    colorTheme: {
      primary: '#00ffaa',
      secondary: '#00e5ff',
      glow: 'rgba(0, 255, 170, 0.4)',
      glowRgb: '0, 255, 170'
    },
    visualStyle: {
      type: 'frock',
      primaryColor: '#0c1a16',
      accentColor: '#00ffaa',
      glowingLines: true
    },
    gender: 'Female',
    image: '/lumina_pleated_dress.png'
  },
  {
    id: 'seraphina-velvet-wrap',
    name: 'SERAPHINA VELVET WRAP',
    category: 'Outerwear',
    price: 6500,
    description: 'A luxurious wholesale wrap dress made from heavy liquid-metallic velvet, featuring geometric buckle closures.',
    technicalDetails: [
      'Metallic reflective crushed velvet fabric',
      'Magnetic buckle hardware waist closures',
      'Bionic reinforced lapels & sleeve cuff bounds'
    ],
    sizes: {
      S: { chest: 92, waist: 72, hips: 96, height: 168 },
      M: { chest: 100, waist: 80, hips: 104, height: 172 },
      L: { chest: 108, waist: 88, hips: 112, height: 176 },
      XL: { chest: 116, waist: 96, hips: 120, height: 180 }
    },
    inventory: { S: 2, M: 5, L: 4, XL: 2 },
    colorTheme: {
      primary: '#00e5ff',
      secondary: '#d500f9',
      glow: 'rgba(0, 229, 255, 0.4)',
      glowRgb: '0, 229, 255'
    },
    visualStyle: {
      type: 'frock',
      primaryColor: '#0b1622',
      accentColor: '#00e5ff',
      glowingLines: true
    },
    gender: 'Female',
    image: '/seraphina_velvet_wrap.png'
  },
  {
    id: 'celeste-lace-frock',
    name: 'CELESTE LACE FROCK',
    category: 'Outerwear',
    price: 5800,
    description: 'Bespoke wholesale lace dress with integrated optical cyber-patterns and flared structural cuffs.',
    technicalDetails: [
      'Laser-patterned synthetic mesh lace',
      'Flared structural hemline and bell sleeves',
      'Under-layered glowing slip dress panel'
    ],
    sizes: {
      S: { chest: 86, waist: 66, hips: 90, height: 165 },
      M: { chest: 94, waist: 74, hips: 98, height: 170 },
      L: { chest: 102, waist: 82, hips: 106, height: 175 },
      XL: { chest: 110, waist: 90, hips: 114, height: 180 }
    },
    inventory: { S: 4, M: 7, L: 5, XL: 3 },
    colorTheme: {
      primary: '#d500f9',
      secondary: '#00ffaa',
      glow: 'rgba(213, 0, 249, 0.4)',
      glowRgb: '213, 0, 249'
    },
    visualStyle: {
      type: 'frock',
      primaryColor: '#1e0c24',
      accentColor: '#d500f9',
      glowingLines: true
    },
    gender: 'Female',
    image: '/celeste_lace_frock.png'
  },
  {
    id: 'nova-georgette-dress',
    name: 'NOVA GEORGETTE DRESS',
    category: 'Outerwear',
    price: 4200,
    description: 'Lightweight georgette wholesale frock dress utilizing digital print shifts and pleated panels.',
    technicalDetails: [
      'Bionic georgette blend with cooling properties',
      'Photoreactive print elements',
      'Double flared micro-lining structure'
    ],
    sizes: {
      S: { chest: 90, waist: 68, hips: 92, height: 165 },
      M: { chest: 98, waist: 76, hips: 100, height: 170 },
      L: { chest: 106, waist: 84, hips: 108, height: 175 },
      XL: { chest: 114, waist: 92, hips: 116, height: 180 }
    },
    inventory: { S: 6, M: 10, L: 6, XL: 4 },
    colorTheme: {
      primary: '#00ffaa',
      secondary: '#00e5ff',
      glow: 'rgba(0, 255, 170, 0.4)',
      glowRgb: '0, 255, 170'
    },
    visualStyle: {
      type: 'frock',
      primaryColor: '#0a1a15',
      accentColor: '#00ffaa',
      glowingLines: true
    },
    gender: 'Female',
    image: '/nova_georgette_dress.png'
  },
  {
    id: 'signature-oversized-tee',
    name: 'SIGNATURE OVERSIZED T-SHIRT',
    category: 'Top',
    price: 1850,
    cost: 1500, // manufacturing cost
    description: 'Streetwear signature T-shirt with heavy oversized silhouette drop shoulders and high-fidelity chest brand prints.',
    technicalDetails: [
      '300GSM heavy luxury combed cotton',
      'High-resolution screen print graphics front and back',
      'Reinforced crewneck collar piping'
    ],
    sizes: {
      S: { chest: 108, waist: 104, hips: 106, height: 170 },
      M: { chest: 116, waist: 112, hips: 114, height: 175 },
      L: { chest: 124, waist: 120, hips: 122, height: 180 },
      XL: { chest: 132, waist: 128, hips: 130, height: 185 }
    },
    inventory: { S: 25, M: 40, L: 30, XL: 15 },
    colorTheme: {
      primary: '#00e5ff',
      secondary: '#d500f9',
      glow: 'rgba(0, 229, 255, 0.4)',
      glowRgb: '0, 229, 255'
    },
    visualStyle: {
      type: 'parka', // drawn as loose fit shirt shape using upper torso block
      primaryColor: '#12121e',
      accentColor: '#00e5ff',
      glowingLines: false
    },
    gender: 'Unisex',
    brand: 'Universe',
    image: '/signature_oversized_tee.png'
  },
  {
    id: 'executive-blazer',
    name: 'EXECUTIVE TAILORED BLAZER',
    category: 'Outerwear',
    price: 9800,
    description: 'A sharp, luxury tailored single-breasted blazer cut from premium Italian wool blend with high-end structured shoulders.',
    technicalDetails: [
      'Premium wool blend construction',
      'Fully lined interior with custom luxury satin',
      'Structured padded shoulders and peak lapels'
    ],
    sizes: {
      S: { chest: 94, waist: 80, hips: 96, height: 170, inseam: 76 },
      M: { chest: 102, waist: 88, hips: 104, height: 175, inseam: 78 },
      L: { chest: 110, waist: 96, hips: 112, height: 180, inseam: 80 },
      XL: { chest: 118, waist: 104, hips: 120, height: 185, inseam: 82 }
    },
    inventory: { S: 8, M: 12, L: 8, XL: 4 },
    colorTheme: {
      primary: '#b45309',
      secondary: '#475569',
      glow: 'rgba(180, 83, 9, 0.4)',
      glowRgb: '180, 83, 9'
    },
    visualStyle: {
      type: 'blazer',
      primaryColor: '#0e0f12',
      accentColor: '#b45309',
      glowingLines: false
    },
    gender: 'Male',
    image: '/executive_blazer.png'
  },
  {
    id: 'steel-cargo-pants',
    name: 'STEEL CARGO PANTS',
    category: 'Bottom',
    price: 4500,
    description: 'Modern slim cargo pants crafted with water-resistant stretch canvas, featuring double utility side pockets.',
    technicalDetails: [
      'Water-resistant stretch canvas blend',
      'Dual flat utility cargo side pockets',
      'Articulated knee joints for enhanced movement'
    ],
    sizes: {
      S: { chest: 80, waist: 74, hips: 92, height: 170, inseam: 76 },
      M: { chest: 88, waist: 82, hips: 100, height: 175, inseam: 78 },
      L: { chest: 96, waist: 90, hips: 108, height: 180, inseam: 80 },
      XL: { chest: 104, waist: 98, hips: 116, height: 185, inseam: 82 }
    },
    inventory: { S: 12, M: 15, L: 10, XL: 6 },
    colorTheme: {
      primary: '#475569',
      secondary: '#b45309',
      glow: 'rgba(71, 85, 105, 0.4)',
      glowRgb: '71, 85, 105'
    },
    visualStyle: {
      type: 'trousers',
      primaryColor: '#0b0c0e',
      accentColor: '#475569',
      glowingLines: false
    },
    gender: 'Male',
    image: '/steel_cargo_pants.png'
  },
  {
    id: 'quantum-wool-parka',
    name: 'QUANTUM WOOL PARKA',
    category: 'Outerwear',
    price: 12500,
    description: 'An premium heavyweight winter wool parka featuring an insulated geometric structural hood and double storm flaps.',
    technicalDetails: [
      'Dense thermal wool weave shell',
      'Storm hood with customizable neck drawcords',
      'Fleece-lined utility chest hand-warmer pockets'
    ],
    sizes: {
      S: { chest: 100, waist: 88, hips: 98, height: 172, inseam: 76 },
      M: { chest: 108, waist: 96, hips: 106, height: 177, inseam: 78 },
      L: { chest: 116, waist: 104, hips: 114, height: 182, inseam: 80 },
      XL: { chest: 124, waist: 112, hips: 122, height: 187, inseam: 82 }
    },
    inventory: { S: 6, M: 8, L: 5, XL: 3 },
    colorTheme: {
      primary: '#b45309',
      secondary: '#475569',
      glow: 'rgba(180, 83, 9, 0.4)',
      glowRgb: '180, 83, 9'
    },
    visualStyle: {
      type: 'parka',
      primaryColor: '#0c0d10',
      accentColor: '#b45309',
      glowingLines: false
    },
    gender: 'Male',
    image: '/quantum_wool_parka.png'
  },

  // ── PLACEHOLDER GARMENTS (images to be inserted by user) ────────────────────

  {
    id: 'ivory-satin-midi',
    name: 'IVORY SATIN MIDI DRESS',
    category: 'Outerwear',
    price: 5600,
    description: 'Flowing ivory satin midi dress with ruched bodice, spaghetti straps, and a soft draped skirt panel.',
    technicalDetails: [
      'Liquid-feel satin weave',
      'Ruched front bodice panel',
      'Adjustable tie-back straps'
    ],
    sizes: {
      S: { chest: 86, waist: 66, hips: 90, height: 165 },
      M: { chest: 94, waist: 74, hips: 98, height: 170 },
      L: { chest: 102, waist: 82, hips: 106, height: 175 },
      XL: { chest: 110, waist: 90, hips: 114, height: 180 }
    },
    inventory: { S: 6, M: 10, L: 7, XL: 4 },
    colorTheme: {
      primary: '#f9a8d4',
      secondary: '#e879f9',
      glow: 'rgba(249, 168, 212, 0.4)',
      glowRgb: '249, 168, 212'
    },
    visualStyle: {
      type: 'frock',
      primaryColor: '#1a0f16',
      accentColor: '#f9a8d4',
      glowingLines: false
    },
    gender: 'Female',
    image: '/ivory_satin_midi.png'
  },

  {
    id: 'cobalt-wrap-blouse',
    name: 'COBALT WRAP BLOUSE',
    category: 'Top',
    price: 2800,
    description: 'Deep cobalt wrap-front blouse with billowing sleeves, a V-neckline, and a self-tie waist sash.',
    technicalDetails: [
      'Crepe-chiffon blend fabric',
      'Wrap-front adjustable tie closure',
      'Bishop-style billowing sleeves'
    ],
    sizes: {
      S: { chest: 88, waist: 68, hips: 90, height: 165 },
      M: { chest: 96, waist: 76, hips: 98, height: 170 },
      L: { chest: 104, waist: 84, hips: 106, height: 175 },
      XL: { chest: 112, waist: 92, hips: 114, height: 180 }
    },
    inventory: { S: 8, M: 14, L: 9, XL: 5 },
    colorTheme: {
      primary: '#3b82f6',
      secondary: '#06b6d4',
      glow: 'rgba(59, 130, 246, 0.4)',
      glowRgb: '59, 130, 246'
    },
    visualStyle: {
      type: 'parka',
      primaryColor: '#0a0e18',
      accentColor: '#3b82f6',
      glowingLines: false
    },
    gender: 'Female',
    image: '/cobalt_wrap_blouse.png'
  },

  {
    id: 'emerald-pleated-skirt',
    name: 'EMERALD PLEATED MIDI SKIRT',
    category: 'Bottom',
    price: 3200,
    description: 'Knife-pleated emerald midi skirt with a high waistband, invisible zip closure, and flared hem.',
    technicalDetails: [
      'Structured knife-pleat construction',
      'High-rise elasticated waistband',
      'Side invisible zip closure'
    ],
    sizes: {
      S: { waist: 66, hips: 90, height: 165, inseam: 62 },
      M: { waist: 74, hips: 98, height: 170, inseam: 64 },
      L: { waist: 82, hips: 106, height: 175, inseam: 66 },
      XL: { waist: 90, hips: 114, height: 180, inseam: 68 }
    },
    inventory: { S: 7, M: 12, L: 8, XL: 4 },
    colorTheme: {
      primary: '#10b981',
      secondary: '#34d399',
      glow: 'rgba(16, 185, 129, 0.4)',
      glowRgb: '16, 185, 129'
    },
    visualStyle: {
      type: 'skirt',
      primaryColor: '#071510',
      accentColor: '#10b981',
      glowingLines: false
    },
    gender: 'Female',
    image: '/emerald_pleated_skirt.png'
  },

  {
    id: 'blush-ruffle-top',
    name: 'BLUSH RUFFLE CROP TOP',
    category: 'Top',
    price: 1950,
    description: 'Delicate blush crop top featuring cascading ruffle tiers, a square neckline, and soft smocked back.',
    technicalDetails: [
      'Lightweight chiffon ruffle tiers',
      'Square-cut neckline with elastic trim',
      'Smocked elastic back panel'
    ],
    sizes: {
      S: { chest: 80, waist: 62, hips: 84, height: 160 },
      M: { chest: 88, waist: 70, hips: 92, height: 165 },
      L: { chest: 96, waist: 78, hips: 100, height: 170 },
      XL: { chest: 104, waist: 86, hips: 108, height: 175 }
    },
    inventory: { S: 10, M: 16, L: 10, XL: 5 },
    colorTheme: {
      primary: '#fb7185',
      secondary: '#fda4af',
      glow: 'rgba(251, 113, 133, 0.4)',
      glowRgb: '251, 113, 133'
    },
    visualStyle: {
      type: 'parka',
      primaryColor: '#180b0d',
      accentColor: '#fb7185',
      glowingLines: false
    },
    gender: 'Female',
    image: '/blush_ruffle_top.png'
  },

  {
    id: 'noir-slip-dress',
    name: 'NOIR BIAS-CUT SLIP DRESS',
    category: 'Outerwear',
    price: 4400,
    description: 'Minimalist noir bias-cut slip dress in matte charmeuse, featuring double-layered shoulder straps and a subtle back slit.',
    technicalDetails: [
      'Charmeuse bias-cut silhouette',
      'Double layered adjustable shoulder straps',
      'Rear modesty slit with invisible hem stitch'
    ],
    sizes: {
      S: { chest: 84, waist: 64, hips: 88, height: 165 },
      M: { chest: 92, waist: 72, hips: 96, height: 170 },
      L: { chest: 100, waist: 80, hips: 104, height: 175 },
      XL: { chest: 108, waist: 88, hips: 112, height: 180 }
    },
    inventory: { S: 5, M: 8, L: 5, XL: 3 },
    colorTheme: {
      primary: '#a78bfa',
      secondary: '#7c3aed',
      glow: 'rgba(167, 139, 250, 0.4)',
      glowRgb: '167, 139, 250'
    },
    visualStyle: {
      type: 'frock',
      primaryColor: '#0d0b16',
      accentColor: '#a78bfa',
      glowingLines: false
    },
    gender: 'Female',
    image: '/noir_slip_dress.png'
  },

  {
    id: 'slate-slim-chinos',
    name: 'SLATE SLIM CHINOS',
    category: 'Bottom',
    price: 3800,
    description: 'Tailored slim-fit chinos in heathered slate, with flat-front construction, tapered leg, and side-seam pockets.',
    technicalDetails: [
      'Stretch-cotton twill blend',
      'Flat-front slim tapered cut',
      'Horn-finish button waistband'
    ],
    sizes: {
      S: { waist: 74, hips: 92, height: 170, inseam: 76 },
      M: { waist: 82, hips: 100, height: 175, inseam: 78 },
      L: { waist: 90, hips: 108, height: 180, inseam: 80 },
      XL: { waist: 98, hips: 116, height: 185, inseam: 82 }
    },
    inventory: { S: 10, M: 15, L: 10, XL: 6 },
    colorTheme: {
      primary: '#64748b',
      secondary: '#94a3b8',
      glow: 'rgba(100, 116, 139, 0.4)',
      glowRgb: '100, 116, 139'
    },
    visualStyle: {
      type: 'trousers',
      primaryColor: '#0b0c0f',
      accentColor: '#64748b',
      glowingLines: false
    },
    gender: 'Male',
    image: '/slate_slim_chinos.png'
  },

  {
    id: 'charcoal-henley',
    name: 'CHARCOAL PREMIUM HENLEY',
    category: 'Top',
    price: 2200,
    description: 'Heavyweight premium henley in charcoal, with a three-button placket, ribbed cuffs, and relaxed chest fit.',
    technicalDetails: [
      '280GSM combed cotton interlock',
      '3-button henley placket',
      'Ribbed collar, cuffs, and hem band'
    ],
    sizes: {
      S: { chest: 100, waist: 96, hips: 98, height: 170 },
      M: { chest: 108, waist: 104, hips: 106, height: 175 },
      L: { chest: 116, waist: 112, hips: 114, height: 180 },
      XL: { chest: 124, waist: 120, hips: 122, height: 185 }
    },
    inventory: { S: 18, M: 25, L: 18, XL: 10 },
    colorTheme: {
      primary: '#6b7280',
      secondary: '#9ca3af',
      glow: 'rgba(107, 114, 128, 0.4)',
      glowRgb: '107, 114, 128'
    },
    visualStyle: {
      type: 'parka',
      primaryColor: '#0e0f11',
      accentColor: '#6b7280',
      glowingLines: false
    },
    gender: 'Male',
    image: '/charcoal_henley.png'
  },

  {
    id: 'midnight-bomber',
    name: 'MIDNIGHT VARSITY BOMBER',
    category: 'Outerwear',
    price: 8900,
    description: 'Sleek midnight varsity bomber with satin shell, ribbed wool trim, contrast sleeve panels, and zip-through front.',
    technicalDetails: [
      'Satin shell with ribbed-knit collar, cuffs, and hem',
      'Contrast color-blocked sleeves',
      'Interior quilted satin lining'
    ],
    sizes: {
      S: { chest: 102, waist: 90, hips: 100, height: 170, inseam: 76 },
      M: { chest: 110, waist: 98, hips: 108, height: 175, inseam: 78 },
      L: { chest: 118, waist: 106, hips: 116, height: 180, inseam: 80 },
      XL: { chest: 126, waist: 114, hips: 124, height: 185, inseam: 82 }
    },
    inventory: { S: 8, M: 12, L: 8, XL: 4 },
    colorTheme: {
      primary: '#c084fc',
      secondary: '#a855f7',
      glow: 'rgba(192, 132, 252, 0.4)',
      glowRgb: '192, 132, 252'
    },
    visualStyle: {
      type: 'parka',
      primaryColor: '#0c0910',
      accentColor: '#c084fc',
      glowingLines: false
    },
    gender: 'Male',
    image: '/midnight_bomber.png'
  },

  {
    id: 'unisex-utility-vest',
    name: 'UTILITY CARGO VEST',
    category: 'Outerwear',
    price: 5100,
    description: 'Unisex tactical utility vest with six external pockets, snap-button front closure, and adjustable side buckles.',
    technicalDetails: [
      'Ripstop nylon shell, water-resistant coating',
      'Six external zip and snap cargo pockets',
      'Adjustable side cinch buckle system'
    ],
    sizes: {
      S: { chest: 98, waist: 86, hips: 96, height: 165 },
      M: { chest: 106, waist: 94, hips: 104, height: 172 },
      L: { chest: 114, waist: 102, hips: 112, height: 178 },
      XL: { chest: 122, waist: 110, hips: 120, height: 184 }
    },
    inventory: { S: 12, M: 18, L: 12, XL: 7 },
    colorTheme: {
      primary: '#84cc16',
      secondary: '#4ade80',
      glow: 'rgba(132, 204, 22, 0.4)',
      glowRgb: '132, 204, 22'
    },
    visualStyle: {
      type: 'blazer',
      primaryColor: '#0b0e09',
      accentColor: '#84cc16',
      glowingLines: false
    },
    gender: 'Unisex',
    image: '/utility_cargo_vest.png'
  },

  {
    id: 'unisex-track-pants',
    name: 'TECH FLEECE TRACK PANTS',
    category: 'Bottom',
    price: 3400,
    description: 'Unisex tech fleece track pants with tapered silhouette, dual zip pockets, ankle zips, and elastic waistband.',
    technicalDetails: [
      'Double-faced tech fleece bonded fabric',
      'Tapered leg with ankle zip openings',
      'Dual hand pockets with zip security'
    ],
    sizes: {
      S: { waist: 70, hips: 90, height: 165, inseam: 74 },
      M: { waist: 78, hips: 98, height: 172, inseam: 76 },
      L: { waist: 86, hips: 106, height: 178, inseam: 78 },
      XL: { waist: 94, hips: 114, height: 184, inseam: 80 }
    },
    inventory: { S: 15, M: 22, L: 15, XL: 8 },
    colorTheme: {
      primary: '#f59e0b',
      secondary: '#fbbf24',
      glow: 'rgba(245, 158, 11, 0.4)',
      glowRgb: '245, 158, 11'
    },
    visualStyle: {
      type: 'trousers',
      primaryColor: '#100e07',
      accentColor: '#f59e0b',
      glowingLines: false
    },
    gender: 'Unisex',
    image: '/tech_fleece_track_pants.png'
  }
];
