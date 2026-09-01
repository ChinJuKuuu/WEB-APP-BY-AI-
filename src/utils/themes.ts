import { SnakeSkin } from '../types';

export interface SkinPalette {
  id: SnakeSkin;
  name: string;
  nameTh: string;
  head: string;
  bodyStart: string;
  bodyEnd: string;
  glow: string;
  accent: string;
  border: string;
  gridLine: string;
  bgHex: string;
}

export const THEME_PALETTES: Record<SnakeSkin, SkinPalette> = {
  CYBER_GREEN: {
    id: 'CYBER_GREEN',
    name: 'Cyber Matrix',
    nameTh: 'ไซเบอร์ แมทริกซ์',
    head: '#10b981',
    bodyStart: '#059669',
    bodyEnd: '#064e3b',
    glow: 'rgba(16, 185, 129, 0.4)',
    accent: '#34d399',
    border: '#059669',
    gridLine: 'rgba(16, 185, 129, 0.08)',
    bgHex: '#090d0b',
  },
  NEON_CYAN: {
    id: 'NEON_CYAN',
    name: 'Plasma Cyan',
    nameTh: 'พลาสมา ไซแอน',
    head: '#06b6d4',
    bodyStart: '#0891b2',
    bodyEnd: '#164e63',
    glow: 'rgba(6, 182, 212, 0.4)',
    accent: '#22d3ee',
    border: '#0891b2',
    gridLine: 'rgba(6, 182, 212, 0.08)',
    bgHex: '#080d12',
  },
  SOLAR_GOLD: {
    id: 'SOLAR_GOLD',
    name: 'Solar Neon',
    nameTh: 'โซลาร์ นีออน',
    head: '#f59e0b',
    bodyStart: '#d97706',
    bodyEnd: '#78350f',
    glow: 'rgba(245, 158, 11, 0.4)',
    accent: '#fbbf24',
    border: '#d97706',
    gridLine: 'rgba(245, 158, 11, 0.08)',
    bgHex: '#120e06',
  },
  VAPOR_PINK: {
    id: 'VAPOR_PINK',
    name: 'Vapor Synth',
    nameTh: 'เวเปอร์ ซินธ์',
    head: '#ec4899',
    bodyStart: '#db2777',
    bodyEnd: '#831843',
    glow: 'rgba(236, 72, 153, 0.4)',
    accent: '#f472b6',
    border: '#db2777',
    gridLine: 'rgba(236, 72, 153, 0.08)',
    bgHex: '#130810',
  },
  RETRO_AMBER: {
    id: 'RETRO_AMBER',
    name: 'Arcade Amber',
    nameTh: 'อาร์เคด แอมเบอร์',
    head: '#fb923c',
    bodyStart: '#ea580c',
    bodyEnd: '#7c2d12',
    glow: 'rgba(251, 146, 60, 0.4)',
    accent: '#fed7aa',
    border: '#ea580c',
    gridLine: 'rgba(251, 146, 60, 0.08)',
    bgHex: '#120b08',
  },
};
