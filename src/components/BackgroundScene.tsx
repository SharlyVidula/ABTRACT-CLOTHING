'use client';

import React, { useState, useEffect } from 'react';

interface BackgroundSceneProps {
  mode: 'Female' | 'Male';
}

// ─── Data Shapes ──────────────────────────────────────────────────────────────
interface PetalData  { id: number; x: number; size: number; delay: number; duration: number; sway: number; spin: number; opacity: number; color: string; }
interface PlanetData { id: number; x: number; y: number; size: number; delay: number; duration: number; opacity: number; hasRing: boolean; color: string; }
interface RocketData { id: number; y: number; size: number; delay: number; duration: number; drift: number; opacity: number; tilt: number; }
interface StarData   { id: number; x: number; y: number; size: number; opacity: number; duration: number; delay: number; }

// ─── Petal SVG ────────────────────────────────────────────────────────────────
function Petal({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size * 1.7} viewBox="0 0 30 51" fill="none">
      {/* Main petal body */}
      <path
        d="M15 1 C25 5 31 18 29 34 C27 45 22 50 15 50 C8 50 3 45 1 34 C-1 18 5 5 15 1Z"
        fill={color}
      />
      {/* Inner highlight vein */}
      <path
        d="M15 7 C20 12 23 24 21 35 C19 43 17 48 15 48 C13 48 11 43 9 35 C7 24 10 12 15 7Z"
        fill="white"
        opacity="0.18"
      />
      {/* Central vein */}
      <line x1="15" y1="4" x2="15" y2="47" stroke="white" strokeWidth="0.7" opacity="0.15" />
      {/* Side veins */}
      <line x1="15" y1="16" x2="8"  y2="26" stroke="white" strokeWidth="0.4" opacity="0.12" />
      <line x1="15" y1="16" x2="22" y2="26" stroke="white" strokeWidth="0.4" opacity="0.12" />
      <line x1="15" y1="28" x2="7"  y2="38" stroke="white" strokeWidth="0.4" opacity="0.1"  />
      <line x1="15" y1="28" x2="23" y2="38" stroke="white" strokeWidth="0.4" opacity="0.1"  />
    </svg>
  );
}

// ─── Rocket SVG (pointing right) ──────────────────────────────────────────────
function Rocket({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 0.54} viewBox="0 0 90 49" fill="none">
      {/* Exhaust outer glow */}
      <ellipse cx="8"  cy="24.5" rx="10" ry="7.5" fill="#f59e0b" opacity="0.7" />
      {/* Exhaust inner flame */}
      <ellipse cx="4"  cy="24.5" rx="5.5" ry="4.5" fill="#fde68a" opacity="0.6" />
      <ellipse cx="1"  cy="24.5" rx="2.5" ry="2.5" fill="white"   opacity="0.35" />

      {/* Body */}
      <ellipse cx="44" cy="24.5" rx="30" ry="14.5" fill="#b45309" />
      {/* Body highlight */}
      <ellipse cx="44" cy="17"   rx="22" ry="5.5"  fill="white"   opacity="0.06" />
      {/* Body stripe */}
      <rect x="28" y="10" width="32" height="4" rx="2" fill="#d97706" opacity="0.4" />

      {/* Nose cone */}
      <path d="M70 24.5 L87 16 L87 33 Z" fill="#d97706" />
      {/* Nose highlight */}
      <path d="M70 24.5 L87 16 L81 19 Z" fill="white" opacity="0.1" />

      {/* Top fin */}
      <path d="M24 10  L11 1  L28 18 Z" fill="#92400e" />
      {/* Bottom fin */}
      <path d="M24 39  L11 48 L28 31 Z" fill="#92400e" />

      {/* Window ring */}
      <circle cx="50" cy="24.5" r="9.5" fill="#07080e" />
      <circle cx="50" cy="24.5" r="7.5" fill="#00e5ff" opacity="0.25" />
      <circle cx="50" cy="24.5" r="5.5" fill="#050507" />
      {/* Window glint */}
      <circle cx="47" cy="21.5" r="2.8" fill="white"   opacity="0.22" />

      {/* Antenna */}
      <line x1="62" y1="10" x2="68" y2="3"  stroke="#d97706" strokeWidth="1.2" opacity="0.6" />
      <circle cx="68" cy="3" r="1.5" fill="#fbbf24" opacity="0.7" />
    </svg>
  );
}

// ─── Planet SVG ───────────────────────────────────────────────────────────────
function Planet({ size, color, hasRing }: { size: number; color: string; hasRing: boolean }) {
  // Fixed internal viewport; scale via width/height
  const W   = hasRing ? 320 : 200;
  const H   = hasRing ? 200 : 200;
  const cx  = hasRing ? 160 : 100;
  const cy  = 100;
  const r   = 80;
  const rrx = 138; // ring x-radius
  const rry = 36;  // ring y-radius

  const svgW = hasRing ? size * 2.0 : size * 1.25;
  const svgH = hasRing ? size * 1.25 : size * 1.25;

  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${W} ${H}`} fill="none">
      {/* Back ring half (drawn first, behind planet) */}
      {hasRing && (
        <path
          d={`M ${cx - rrx} ${cy} A ${rrx} ${rry} 0 0 1 ${cx + rrx} ${cy}`}
          stroke={color} strokeWidth="3.5" fill="none" opacity="0.32"
        />
      )}

      {/* Atmosphere glow */}
      <circle cx={cx} cy={cy} r={r + 7} fill={color} opacity="0.07" />

      {/* Planet body */}
      <circle cx={cx} cy={cy} r={r} fill="rgba(13,10,6,0.97)" stroke={color} strokeWidth="1.8" />

      {/* Surface bands */}
      <ellipse cx={cx}      cy={cy - 26} rx={r * 0.84} ry={r * 0.13}  fill={color} opacity="0.16" />
      <ellipse cx={cx - 8}  cy={cy}      rx={r * 0.78} ry={r * 0.105} fill={color} opacity="0.11" />
      <ellipse cx={cx + 4}  cy={cy + 28} rx={r * 0.65} ry={r * 0.09}  fill={color} opacity="0.09" />

      {/* Specular highlight (top-left shimmer) */}
      <circle cx={cx - r * 0.28} cy={cy - r * 0.27} r={r * 0.42} fill="rgba(255,255,255,0.045)" />

      {/* Small crater detail */}
      <circle cx={cx + r * 0.35} cy={cy - r * 0.15} r={r * 0.09} stroke={color} strokeWidth="1" fill="none" opacity="0.2" />
      <circle cx={cx - r * 0.4}  cy={cy + r * 0.3}  r={r * 0.06} stroke={color} strokeWidth="1" fill="none" opacity="0.15" />

      {/* Front ring half (drawn last, in front of planet) */}
      {hasRing && (
        <path
          d={`M ${cx - rrx} ${cy} A ${rrx} ${rry} 0 0 0 ${cx + rrx} ${cy}`}
          stroke={color} strokeWidth="3.5" fill="none" opacity="0.72"
        />
      )}
    </svg>
  );
}

// ─── Main Scene Component ─────────────────────────────────────────────────────
export default function BackgroundScene({ mode }: BackgroundSceneProps) {
  const [petals,  setPetals]  = useState<PetalData[]>([]);
  const [planets, setPlanets] = useState<PlanetData[]>([]);
  const [rockets, setRockets] = useState<RocketData[]>([]);
  const [stars,   setStars]   = useState<StarData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // ── Petal colours (fem theme palette) ──────────────────────────────────
    const PC = ['#ff8da1', '#fda4af', '#f9a8d4', '#fb7185', '#ffb3c1', '#fce7f3', '#ff4d6d', '#ff6b8a'];

    setTimeout(() => {
      setPetals(Array.from({ length: 22 }, (_, i) => ({
        id:       i,
        x:        Math.random() * 100,
      size:     14 + Math.random() * 22,
      // Negative delay = start mid-cycle, so petals are visible immediately
      delay:    -(Math.random() * 20),
      duration: 12 + Math.random() * 14,
      sway:     (Math.random() > 0.5 ? 1 : -1) * (55 + Math.random() * 100),
      spin:     380 + Math.random() * 500,
      opacity:  0.2 + Math.random() * 0.32,
      color:    PC[Math.floor(Math.random() * PC.length)],
    })));

    // ── Planet colours (masc theme palette) ────────────────────────────────
    const PLC = ['#d97706', '#b45309', '#475569', '#92400e', '#78716c', '#a16207'];

    setPlanets(Array.from({ length: 7 }, (_, i) => ({
      id:       i,
      x:        3  + Math.random() * 88,
      y:        3  + Math.random() * 82,
      size:     42 + Math.random() * 68,
      delay:    -(Math.random() * 12),
      duration: 19 + Math.random() * 22,
      opacity:  0.06 + Math.random() * 0.10,
      hasRing:  i % 3 !== 1,            // 2 out of 3 have rings
      color:    PLC[i % PLC.length],
    })));

    setRockets(Array.from({ length: 7 }, (_, i) => ({
      id:       i,
      y:        4  + Math.random() * 86,
      size:     68 + Math.random() * 52,
      // Negative delay = rockets are already in flight on load
      delay:    -(Math.random() * 28),
      duration: 22 + Math.random() * 20,
      drift:    (Math.random() - 0.5) * 90,
      opacity:  0.12 + Math.random() * 0.16,
      tilt:     -14 + Math.random() * 28,
    })));

    setStars(Array.from({ length: 40 }, (_, i) => ({
      id:       i,
      x:        Math.random() * 100,
      y:        Math.random() * 100,
      size:     1  + Math.random() * 2.4,
        opacity:  0.1  + Math.random() * 0.32,
        duration: 2.5 + Math.random() * 4,
        delay:    -(Math.random() * 5),
      })));

      setMounted(true);
    }, 0);
  }, [mode]); // Added mode dependency to satisfy exhaustive-deps

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {mode === 'Female' ? (
        /* ══ FEMALE: Flowing Flower Petals ══════════════════════════════════ */
        petals.map((p) => (
          <div
            key={p.id}
            style={{
              position:  'absolute',
              left:      `${p.x}%`,
              top:       '-80px',
              willChange: 'transform, opacity',
              animation: `bg-petal-fall ${p.duration}s ${p.delay}s linear infinite`,
              '--sw': `${p.sway}px`,
              '--sp': `${p.spin}deg`,
              '--op': p.opacity,
            } as React.CSSProperties}
          >
            <Petal color={p.color} size={p.size} />
          </div>
        ))
      ) : (
        /* ══ MALE: Space Scene — Stars + Planets + Rockets ══════════════════ */
        <>
          {/* Twinkling stars */}
          {stars.map((s) => (
            <div
              key={`s${s.id}`}
              style={{
                position:     'absolute',
                left:         `${s.x}%`,
                top:          `${s.y}%`,
                width:        `${s.size}px`,
                height:       `${s.size}px`,
                borderRadius: '50%',
                background:   'white',
                willChange:   'opacity, transform',
                animation:    `bg-star-twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
                '--op': s.opacity,
              } as React.CSSProperties}
            />
          ))}

          {/* Floating planets */}
          {planets.map((p) => (
            <div
              key={`p${p.id}`}
              style={{
                position:   'absolute',
                left:       `${p.x}%`,
                top:        `${p.y}%`,
                opacity:     p.opacity,
                willChange: 'transform',
                animation:  `bg-planet-float ${p.duration}s ${p.delay}s ease-in-out infinite`,
              }}
            >
              <Planet size={p.size} color={p.color} hasRing={p.hasRing} />
            </div>
          ))}

          {/* Gliding rocketships */}
          {rockets.map((r) => (
            <div
              key={`r${r.id}`}
              style={{
                position:   'absolute',
                left:       '-100px',
                top:        `${r.y}%`,
                willChange: 'transform, opacity',
                animation:  `bg-rocket-glide ${r.duration}s ${r.delay}s linear infinite`,
                '--dr': `${r.drift}px`,
                '--op': r.opacity,
              } as React.CSSProperties}
            >
              {/* Inner wrapper carries static tilt so animation transform isn't clobbered */}
              <div style={{ transform: `rotate(${r.tilt}deg)` }}>
                <Rocket size={r.size} />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
