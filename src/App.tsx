/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Direction,
  FoodItem,
  FoodType,
  GameMode,
  GameSettings,
  GameStats,
  Obstacle,
  Point,
} from './types';
import { soundFx } from './utils/audio';
import { GameBoard } from './components/GameBoard';
import { StatsPanel } from './components/StatsPanel';
import { GameControls } from './components/GameControls';
import { SettingsModal } from './components/SettingsModal';
import { HowToPlay } from './components/HowToPlay';
import { Gamepad2, Settings, HelpCircle, Trophy } from 'lucide-react';

const HIGH_SCORE_KEY = 'cyber_snake_high_score_v1';
const SETTINGS_KEY = 'cyber_snake_settings_v1';

export default function App() {
  // Game Settings State
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      gridSize: 20,
      initialSpeed: 100,
      gameMode: 'CLASSIC',
      skin: 'CYBER_GREEN',
      soundEnabled: true,
      hapticEnabled: true,
    };
  });

  // Game Core State
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Stats State
  const [stats, setStats] = useState<GameStats>(() => {
    const savedBest = localStorage.getItem(HIGH_SCORE_KEY);
    return {
      score: 0,
      highScore: savedBest ? parseInt(savedBest, 10) || 0 : 0,
      applesEaten: 0,
      goldenEaten: 0,
      specialEaten: 0,
      movesCount: 0,
      playTimeSeconds: 0,
      maxLength: 3,
    };
  });

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  // References for reliable Game Loop without stale state closures
  const snakeRef = useRef(snake);
  snakeRef.current = snake;

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const nextDirectionRef = useRef<Direction>(direction);

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const isGameOverRef = useRef(isGameOver);
  isGameOverRef.current = isGameOver;

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const foodsRef = useRef(foods);
  foodsRef.current = foods;

  const obstaclesRef = useRef(obstacles);
  obstaclesRef.current = obstacles;

  const statsRef = useRef(stats);
  statsRef.current = stats;

  const highScoredFiredRef = useRef(false);

  // Save settings changes to LocalStorage
  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    });
    if (newSettings.soundEnabled !== undefined) {
      soundFx.setMuted(!newSettings.soundEnabled);
    }
  };

  // Generate Maze Obstacles
  const generateObstacles = useCallback((gridSize: number, mode: GameMode): Obstacle[] => {
    if (mode !== 'OBSTACLE_MAZE') return [];
    const obs: Obstacle[] = [];
    const center = Math.floor(gridSize / 2);

    // 4 symmetric obstacles around corners/centers
    for (let i = 3; i < 7; i++) {
      obs.push({ x: i, y: 5 });
      obs.push({ x: gridSize - 1 - i, y: gridSize - 6 });
    }
    for (let i = center - 2; i <= center + 2; i++) {
      if (i !== center) {
        obs.push({ x: center - 4, y: i });
        obs.push({ x: center + 4, y: i });
      }
    }
    return obs;
  }, []);

  // Spawn Food Items
  const spawnFood = useCallback(
    (
      currentSnake: Point[],
      currentObstacles: Obstacle[],
      existingFoods: FoodItem[],
      mode: GameMode,
      gridSize: number
    ): FoodItem[] => {
      const occupied = new Set<string>();
      currentSnake.forEach((p) => occupied.add(`${p.x},${p.y}`));
      currentObstacles.forEach((o) => occupied.add(`${o.x},${o.y}`));
      existingFoods.forEach((f) => occupied.add(`${f.point.x},${f.point.y}`));

      const getRandomFreePoint = (): Point | null => {
        const freePoints: Point[] = [];
        for (let x = 0; x < gridSize; x++) {
          for (let y = 0; y < gridSize; y++) {
            if (!occupied.has(`${x},${y}`)) {
              freePoints.push({ x, y });
            }
          }
        }
        if (freePoints.length === 0) return null;
        return freePoints[Math.floor(Math.random() * freePoints.length)];
      };

      const result: FoodItem[] = [...existingFoods.filter((f) => !f.expiresAt || f.expiresAt > Date.now())];
      const targetCount = mode === 'FOOD_FRENZY' ? 4 : 1;

      while (result.length < targetCount) {
        const pt = getRandomFreePoint();
        if (!pt) break;
        occupied.add(`${pt.x},${pt.y}`);

        // Random chance for special food types
        const rand = Math.random();
        let type: FoodType = 'NORMAL';
        let points = 10;
        let expiresAt: number | undefined = undefined;

        if (rand > 0.88) {
          type = 'GOLDEN';
          points = 35;
          expiresAt = Date.now() + 9000;
        } else if (rand > 0.76) {
          type = 'SPEED';
          points = 25;
        } else if (rand > 0.68 && currentSnake.length > 8) {
          type = 'SHRINK';
          points = 15;
        }

        result.push({ point: pt, type, points, expiresAt });
      }

      return result;
    },
    []
  );

  // Initialize / Restart Game
  const handleRestart = useCallback(() => {
    soundFx.playClick();
    const center = Math.floor(settings.gridSize / 2);
    const initialSnake: Point[] = [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
    ];

    const initialObstacles = generateObstacles(settings.gridSize, settings.gameMode);
    const initialFoods = spawnFood(
      initialSnake,
      initialObstacles,
      [],
      settings.gameMode,
      settings.gridSize
    );

    setSnake(initialSnake);
    setDirection('RIGHT');
    nextDirectionRef.current = 'RIGHT';
    setFoods(initialFoods);
    setObstacles(initialObstacles);
    setIsGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
    highScoredFiredRef.current = false;

    setStats((prev) => ({
      score: 0,
      highScore: prev.highScore,
      applesEaten: 0,
      goldenEaten: 0,
      specialEaten: 0,
      movesCount: 0,
      playTimeSeconds: 0,
      maxLength: 3,
    }));
  }, [generateObstacles, settings.gameMode, settings.gridSize, spawnFood]);

  // Pause / Resume Toggle
  const handlePauseToggle = useCallback(() => {
    if (!isPlaying || isGameOver) return;
    soundFx.playClick();
    setIsPaused((prev) => !prev);
  }, [isPlaying, isGameOver]);

  // Direction Change Handler (with 180-degree anti-suicide buffer)
  const handleDirectionChange = useCallback((newDir: Direction) => {
    const current = nextDirectionRef.current;
    if (
      (newDir === 'UP' && current === 'DOWN') ||
      (newDir === 'DOWN' && current === 'UP') ||
      (newDir === 'LEFT' && current === 'RIGHT') ||
      (newDir === 'RIGHT' && current === 'LEFT')
    ) {
      return; // Disallow instant 180 reverse
    }
    nextDirectionRef.current = newDir;
    setDirection(newDir);
    soundFx.playClick();

    setStats((prev) => ({
      ...prev,
      movesCount: prev.movesCount + 1,
    }));
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when using arrow keys or spacebar
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        if (isPlayingRef.current && !isGameOverRef.current) {
          handlePauseToggle();
        } else if (!isPlayingRef.current || isGameOverRef.current) {
          handleRestart();
        }
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        handleRestart();
        return;
      }

      if (!isPlayingRef.current || isPausedRef.current || isGameOverRef.current) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          handleDirectionChange('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          handleDirectionChange('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handleDirectionChange('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          handleDirectionChange('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirectionChange, handlePauseToggle, handleRestart]);

  // Touch Swipe Gesture on Game Board
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const board = document.getElementById('game-board-container');
    if (!board) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      // Minimum swipe distance
      if (Math.max(absX, absY) > 24) {
        if (absX > absY) {
          handleDirectionChange(dx > 0 ? 'RIGHT' : 'LEFT');
        } else {
          handleDirectionChange(dy > 0 ? 'DOWN' : 'UP');
        }
      }
      touchStartRef.current = null;
    };

    board.addEventListener('touchstart', handleTouchStart, { passive: true });
    board.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      board.removeEventListener('touchstart', handleTouchStart);
      board.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleDirectionChange]);

  // Timer Tick (Seconds Counter)
  useEffect(() => {
    if (!isPlaying || isPaused || isGameOver) return;
    const timer = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        playTimeSeconds: prev.playTimeSeconds + 1,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, isPaused, isGameOver]);

  // Main Game Loop Tick
  useEffect(() => {
    if (!isPlaying || isPaused || isGameOver) return;

    const gameInterval = setInterval(() => {
      const currentSnake = snakeRef.current;
      const curDir = nextDirectionRef.current;
      const curSettings = settingsRef.current;
      const curObstacles = obstaclesRef.current;
      const curFoods = foodsRef.current;
      const head = currentSnake[0];

      // Calculate next head position
      let nextX = head.x;
      let nextY = head.y;

      if (curDir === 'UP') nextY -= 1;
      else if (curDir === 'DOWN') nextY += 1;
      else if (curDir === 'LEFT') nextX -= 1;
      else if (curDir === 'RIGHT') nextX += 1;

      // Wall Collision Logic
      const isOutOfBounds =
        nextX < 0 || nextX >= curSettings.gridSize || nextY < 0 || nextY >= curSettings.gridSize;

      if (isOutOfBounds) {
        if (curSettings.gameMode === 'NO_WALLS') {
          // Wrap around portal mode
          nextX = (nextX + curSettings.gridSize) % curSettings.gridSize;
          nextY = (nextY + curSettings.gridSize) % curSettings.gridSize;
        } else {
          // Wall crash Game Over
          soundFx.playGameOver();
          setIsGameOver(true);
          setIsPlaying(false);
          return;
        }
      }

      const nextHeadPoint: Point = { x: nextX, y: nextY };

      // Obstacle Collision Check
      const hitObstacle = curObstacles.some((o) => o.x === nextX && o.y === nextY);
      if (hitObstacle) {
        soundFx.playGameOver();
        setIsGameOver(true);
        setIsPlaying(false);
        return;
      }

      // Self Collision Check (ignore tail since it moves away unless growing)
      const hitSelf = currentSnake.slice(0, -1).some((seg) => seg.x === nextX && seg.y === nextY);
      if (hitSelf) {
        soundFx.playGameOver();
        setIsGameOver(true);
        setIsPlaying(false);
        return;
      }

      // Check Food Collision
      const eatenFoodIndex = curFoods.findIndex(
        (f) => f.point.x === nextX && f.point.y === nextY
      );

      let newSnake = [nextHeadPoint, ...currentSnake];

      if (eatenFoodIndex !== -1) {
        const food = curFoods[eatenFoodIndex];
        const newScore = statsRef.current.score + food.points;
        const currentHigh = statsRef.current.highScore;

        // Play appropriate sound fx
        if (food.type === 'GOLDEN') {
          soundFx.playBonus();
        } else if (food.type === 'SPEED' || food.type === 'SHRINK') {
          soundFx.playSpecial();
        } else {
          soundFx.playEat();
        }

        // Check for new high score celebration
        if (newScore > currentHigh && !highScoredFiredRef.current && currentHigh > 0) {
          highScoredFiredRef.current = true;
          soundFx.playHighScore();
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        }

        // Handle Shrink Fruit
        if (food.type === 'SHRINK' && newSnake.length > 5) {
          const cutLength = Math.max(Math.floor(newSnake.length * 0.7), 3);
          newSnake = newSnake.slice(0, cutLength);
        }

        // Update High Score in LocalStorage
        const updatedHigh = Math.max(newScore, currentHigh);
        localStorage.setItem(HIGH_SCORE_KEY, updatedHigh.toString());

        // Update Stats
        setStats((prev) => ({
          ...prev,
          score: newScore,
          highScore: updatedHigh,
          applesEaten: food.type === 'NORMAL' ? prev.applesEaten + 1 : prev.applesEaten,
          goldenEaten: food.type === 'GOLDEN' ? prev.goldenEaten + 1 : prev.goldenEaten,
          specialEaten:
            food.type === 'SPEED' || food.type === 'SHRINK'
              ? prev.specialEaten + 1
              : prev.specialEaten,
          maxLength: Math.max(prev.maxLength, newSnake.length),
        }));

        // Remove eaten food and spawn replacement
        const remainingFoods = curFoods.filter((_, idx) => idx !== eatenFoodIndex);
        const refreshedFoods = spawnFood(
          newSnake,
          curObstacles,
          remainingFoods,
          curSettings.gameMode,
          curSettings.gridSize
        );
        setFoods(refreshedFoods);
      } else {
        // Normal move without eating: pop tail
        newSnake.pop();
      }

      setSnake(newSnake);
    }, settings.initialSpeed);

    return () => clearInterval(gameInterval);
  }, [isPlaying, isPaused, isGameOver, settings.initialSpeed, spawnFood]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-between p-3 sm:p-5 antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Header Bar */}
      <header className="w-full max-w-lg mx-auto flex items-center justify-between py-2 px-1">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg shadow-md shadow-emerald-500/20">
            🐍
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black font-arcade text-white tracking-wide flex items-center gap-1.5">
              <span>CYBER SNAKE</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-code font-normal">
                ARCADE
              </span>
            </h1>
            <p className="text-[10px] text-zinc-400">Web App เกมงูเรโทรสไตล์ไซเบอร์พังค์</p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5">
          <button
            id="header-how-to-play-btn"
            onClick={() => setIsHowToPlayOpen(true)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-cyan-400 hover:bg-zinc-800 transition-all cursor-pointer"
            title="วิธีเล่น"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            id="header-settings-btn"
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 transition-all cursor-pointer"
            title="ตั้งค่า"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Single-Screen Application Content */}
      <main className="w-full max-w-lg mx-auto flex-1 flex flex-col items-center justify-center py-2 space-y-3">
        {/* Live Stats Row */}
        <StatsPanel
          stats={stats}
          snakeLength={snake.length}
          settings={settings}
          isGameOver={isGameOver}
        />

        {/* Canvas Board */}
        <GameBoard
          snake={snake}
          direction={direction}
          foods={foods}
          obstacles={obstacles}
          settings={settings}
          isGameOver={isGameOver}
          isPaused={isPaused}
          isPlaying={isPlaying}
          score={stats.score}
          onRestart={handleRestart}
          onPauseToggle={handlePauseToggle}
        />

        {/* Controls, Toolbar & Mobile D-Pad */}
        <GameControls
          onDirectionChange={handleDirectionChange}
          onPauseToggle={handlePauseToggle}
          onRestart={handleRestart}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          isPlaying={isPlaying}
          isPaused={isPaused}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() =>
            handleUpdateSettings({ soundEnabled: !settings.soundEnabled })
          }
        />
      </main>

      {/* Footer */}
      <footer className="w-full max-w-lg mx-auto mt-2 pt-2 border-t border-zinc-900 flex items-center justify-center text-[11px] text-zinc-500 px-1 gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Single-Page App • Responsive • Web Audio 8-Bit</span>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <HowToPlay
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
}
