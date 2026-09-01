import React, { useEffect, useRef, useState } from 'react';
import { Direction, FoodItem, Obstacle, Point, GameSettings, GameMode } from '../types';
import { THEME_PALETTES } from '../utils/themes';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface GameBoardProps {
  snake: Point[];
  direction: Direction;
  foods: FoodItem[];
  obstacles: Obstacle[];
  settings: GameSettings;
  isGameOver: boolean;
  isPaused: boolean;
  isPlaying: boolean;
  score: number;
  onRestart: () => void;
  onPauseToggle: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  snake,
  direction,
  foods,
  obstacles,
  settings,
  isGameOver,
  isPaused,
  isPlaying,
  score,
  onRestart,
  onPauseToggle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [boardPixelSize, setBoardPixelSize] = useState<number>(440);
  const particlesRef = useRef<Particle[]>([]);
  const prevFoodCountRef = useRef<number>(foods.length);
  const prevScoreRef = useRef<number>(score);

  // ResizeObserver to adapt canvas size to container responsiveness
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        // Keep a neat square responsive board
        const size = Math.min(Math.max(width, 280), 520);
        setBoardPixelSize(size);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Spawn explosion particles on score increase
  useEffect(() => {
    if (score > prevScoreRef.current && snake.length > 0) {
      const head = snake[0];
      const cellSize = boardPixelSize / settings.gridSize;
      const originX = head.x * cellSize + cellSize / 2;
      const originY = head.y * cellSize + cellSize / 2;
      const palette = THEME_PALETTES[settings.skin];

      // Create burst of 16 particles
      for (let i = 0; i < 18; i++) {
        const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5);
        const speed = 1.5 + Math.random() * 3.5;
        particlesRef.current.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: i % 2 === 0 ? palette.accent : '#ffffff',
          size: 2 + Math.random() * 3,
          alpha: 1,
          life: 0,
          maxLife: 25 + Math.floor(Math.random() * 15),
        });
      }
    }
    prevScoreRef.current = score;
    prevFoodCountRef.current = foods.length;
  }, [score, snake, boardPixelSize, settings.gridSize, settings.skin, foods.length]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const cellSize = boardPixelSize / settings.gridSize;
    const palette = THEME_PALETTES[settings.skin];

    const render = () => {
      // Clear canvas with theme background
      ctx.fillStyle = palette.bgHex;
      ctx.fillRect(0, 0, boardPixelSize, boardPixelSize);

      // Draw subtle grid lines
      ctx.strokeStyle = palette.gridLine;
      ctx.lineWidth = 1;
      for (let i = 0; i <= settings.gridSize; i++) {
        const pos = Math.round(i * cellSize);
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, boardPixelSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(boardPixelSize, pos);
        ctx.stroke();
      }

      // Draw Obstacles (if any)
      obstacles.forEach((obs) => {
        const x = obs.x * cellSize;
        const y = obs.y * cellSize;
        ctx.fillStyle = '#dc2626';
        ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
        ctx.shadowBlur = 6;
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

        // Hazard diagonal stripes
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + 3, y + cellSize - 3);
        ctx.lineTo(x + cellSize - 3, y + 3);
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw Food items with pulsing glows
      const time = performance.now() * 0.005;
      foods.forEach((food) => {
        const cx = food.point.x * cellSize + cellSize / 2;
        const cy = food.point.y * cellSize + cellSize / 2;
        const pulse = 1 + Math.sin(time + food.point.x) * 0.15;
        const radius = (cellSize / 2 - 2) * pulse;

        ctx.save();
        if (food.type === 'NORMAL') {
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(radius, 2), 0, Math.PI * 2);
          ctx.fill();

          // Leaf/Sparkle
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(cx, cy - radius * 0.8, radius * 0.35, 0, Math.PI * 2);
          ctx.fill();
        } else if (food.type === 'GOLDEN') {
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = 'rgba(245, 158, 11, 1)';
          ctx.shadowBlur = 14;
          // Draw diamond / star shape
          ctx.beginPath();
          ctx.moveTo(cx, cy - radius);
          ctx.lineTo(cx + radius, cy);
          ctx.lineTo(cx, cy + radius);
          ctx.lineTo(cx - radius, cy);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 0.35, 0, Math.PI * 2);
          ctx.fill();
        } else if (food.type === 'SPEED') {
          ctx.fillStyle = '#3b82f6';
          ctx.shadowColor = 'rgba(59, 130, 246, 0.9)';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();

          // Lightning icon symbol
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.round(cellSize * 0.65)}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚡', cx, cy);
        } else if (food.type === 'SHRINK') {
          ctx.fillStyle = '#a855f7';
          ctx.shadowColor = 'rgba(168, 85, 247, 0.9)';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.round(cellSize * 0.55)}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✂', cx, cy);
        }
        ctx.restore();
      });

      // Draw Snake Body
      if (snake.length > 0) {
        for (let i = snake.length - 1; i >= 0; i--) {
          const seg = snake[i];
          const x = seg.x * cellSize;
          const y = seg.y * cellSize;
          const isHead = i === 0;

          ctx.save();
          if (isHead) {
            // Head styling
            ctx.fillStyle = palette.head;
            ctx.shadowColor = palette.glow;
            ctx.shadowBlur = 12;

            const radiusVal = Math.max(cellSize * 0.2, 4);
            ctx.beginPath();
            ctx.roundRect(x + 1, y + 1, cellSize - 2, cellSize - 2, radiusVal);
            ctx.fill();

            // Head eyes based on direction
            ctx.fillStyle = '#09090b';
            ctx.shadowBlur = 0;
            const eyeSize = Math.max(cellSize * 0.16, 2.5);
            const eyeOffset = cellSize * 0.28;

            let e1x = x + cellSize / 2 - eyeOffset;
            let e1y = y + cellSize / 2 - eyeOffset;
            let e2x = x + cellSize / 2 + eyeOffset;
            let e2y = y + cellSize / 2 - eyeOffset;

            if (direction === 'DOWN') {
              e1y = y + cellSize / 2 + eyeOffset;
              e2y = y + cellSize / 2 + eyeOffset;
            } else if (direction === 'LEFT') {
              e1x = x + cellSize / 2 - eyeOffset;
              e1y = y + cellSize / 2 - eyeOffset;
              e2x = x + cellSize / 2 - eyeOffset;
              e2y = y + cellSize / 2 + eyeOffset;
            } else if (direction === 'RIGHT') {
              e1x = x + cellSize / 2 + eyeOffset;
              e1y = y + cellSize / 2 - eyeOffset;
              e2x = x + cellSize / 2 + eyeOffset;
              e2y = y + cellSize / 2 + eyeOffset;
            }

            ctx.beginPath();
            ctx.arc(e1x, e1y, eyeSize, 0, Math.PI * 2);
            ctx.arc(e2x, e2y, eyeSize, 0, Math.PI * 2);
            ctx.fill();

            // Pupil whites
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(e1x, e1y, eyeSize * 0.45, 0, Math.PI * 2);
            ctx.arc(e2x, e2y, eyeSize * 0.45, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Body segments with color gradient interpolation
            const progress = i / snake.length;
            ctx.fillStyle = progress < 0.5 ? palette.bodyStart : palette.bodyEnd;
            const segPad = Math.min(2, cellSize * 0.1);
            const cornerR = Math.max(cellSize * 0.15, 2);

            ctx.beginPath();
            ctx.roundRect(
              x + segPad,
              y + segPad,
              cellSize - segPad * 2,
              cellSize - segPad * 2,
              cornerR
            );
            ctx.fill();
          }
          ctx.restore();
        }
      }

      // Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    boardPixelSize,
    snake,
    direction,
    foods,
    obstacles,
    settings.gridSize,
    settings.skin,
    settings.gameMode,
  ]);

  return (
    <div
      ref={containerRef}
      id="game-board-container"
      className="relative flex items-center justify-center w-full max-w-[460px] mx-auto select-none touch-none aspect-square"
    >
      <div className="relative p-1.5 sm:p-2 rounded-2xl bg-zinc-900/90 border-2 border-zinc-800 shadow-2xl shadow-emerald-950/20">
        <canvas
          ref={canvasRef}
          id="snake-canvas"
          width={boardPixelSize}
          height={boardPixelSize}
          className="rounded-xl block cursor-pointer transition-all duration-300"
          style={{ width: `${boardPixelSize}px`, height: `${boardPixelSize}px` }}
          onClick={() => {
            if (!isPlaying || isGameOver) {
              onRestart();
            } else {
              onPauseToggle();
            }
          }}
        />

        {/* Retro CRT scanline effect */}
        <div className="absolute inset-2 crt-overlay rounded-xl pointer-events-none" />

        {/* Start Game / Press to Play Overlay */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-2 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm rounded-xl p-6 text-center animate-fade-in">
            <div className="w-14 h-14 mb-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl shadow-lg shadow-emerald-500/20">
              🐍
            </div>
            <h3 className="text-xl font-bold font-arcade text-white tracking-wide mb-1">
              CYBER SNAKE ARENA
            </h3>
            <p className="text-xs text-zinc-400 max-w-[240px] mb-5">
              กดปุ่มด้านล่าง หรือใช้ปุ่มลูกศร / WASD บนคีย์บอร์ดเพื่อเริ่มเล่น
            </p>
            <button
              id="start-game-btn"
              onClick={onRestart}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 font-bold font-arcade text-sm tracking-wider shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
            >
              ▶ เริ่มเล่นเกม (START)
            </button>
          </div>
        )}

        {/* Paused Overlay */}
        {isPlaying && isPaused && !isGameOver && (
          <div className="absolute inset-2 flex flex-col items-center justify-center bg-zinc-950/85 backdrop-blur-sm rounded-xl p-6 text-center animate-fade-in">
            <span className="text-3xl mb-2">⏸️</span>
            <h3 className="text-2xl font-bold font-arcade text-amber-400 tracking-wider mb-2">
              PAUSED / พักเกม
            </h3>
            <p className="text-xs text-zinc-400 mb-5">กด Spacebar หรือกดปุ่มด้านล่างเพื่อเล่นต่อ</p>
            <button
              id="resume-game-btn"
              onClick={onPauseToggle}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 font-bold font-arcade text-sm tracking-wider shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
            >
              ▶ เล่นต่อ (RESUME)
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-2 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-sm rounded-xl p-6 text-center animate-fade-in">
            <span className="text-4xl mb-2 animate-bounce">💥</span>
            <h3 className="text-2xl font-bold font-arcade text-rose-500 tracking-wider mb-1">
              GAME OVER
            </h3>
            <p className="text-xs text-zinc-400 mb-3">คุณทำคะแนนได้</p>
            <div className="text-3xl font-black font-code text-white mb-5">
              {score} <span className="text-xs font-normal text-zinc-400">PTS</span>
            </div>
            <button
              id="game-over-restart-btn"
              onClick={onRestart}
              className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 active:scale-95 text-zinc-950 font-bold font-arcade text-sm tracking-wider shadow-lg shadow-rose-500/30 transition-all cursor-pointer"
            >
              🔄 เล่นใหม่อีกครั้ง (PLAY AGAIN)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
