export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}

export type FoodType = 'NORMAL' | 'GOLDEN' | 'SPEED' | 'PORTAL' | 'SHRINK';

export interface FoodItem {
  point: Point;
  type: FoodType;
  points: number;
  expiresAt?: number; // timestamp for timed bonus food
}

export interface Obstacle {
  x: number;
  y: number;
}

export type GameMode = 'CLASSIC' | 'NO_WALLS' | 'OBSTACLE_MAZE' | 'FOOD_FRENZY';

export type SnakeSkin = 'CYBER_GREEN' | 'NEON_CYAN' | 'SOLAR_GOLD' | 'VAPOR_PINK' | 'RETRO_AMBER';

export interface GameSettings {
  gridSize: number; // e.g. 20 (20x20)
  initialSpeed: number; // in ms interval (e.g. 110ms)
  gameMode: GameMode;
  skin: SnakeSkin;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export interface GameStats {
  score: number;
  highScore: number;
  applesEaten: number;
  goldenEaten: number;
  specialEaten: number;
  movesCount: number;
  playTimeSeconds: number;
  maxLength: number;
}

export interface Achievement {
  id: string;
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  icon: string;
  unlocked: boolean;
}
