import React from 'react';
import { GameMode, GameSettings, GameStats } from '../types';
import { Trophy, Flame, Timer, Zap, ArrowRightLeft, ShieldAlert } from 'lucide-react';

interface StatsPanelProps {
  stats: GameStats;
  snakeLength: number;
  settings: GameSettings;
  isGameOver: boolean;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  snakeLength,
  settings,
  isGameOver,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeLabel = (mode: GameMode) => {
    switch (mode) {
      case 'CLASSIC':
        return { label: 'คลาสสิก (Classic)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      case 'NO_WALLS':
        return { label: 'วาร์ปทะลุกำแพง (Portal)', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
      case 'OBSTACLE_MAZE':
        return { label: 'เขาวงกตสิ่งกีดขวาง (Maze)', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
      case 'FOOD_FRENZY':
        return { label: 'ผลไม้บุฟเฟ่ต์ (Frenzy)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    }
  };

  const modeBadge = getModeLabel(settings.gameMode);

  return (
    <div id="stats-panel" className="w-full max-w-[460px] mx-auto space-y-2">
      {/* Top Main Score Card */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Current Score */}
        <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-[11px] font-medium tracking-wider text-zinc-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
              <span>คะแนน (SCORE)</span>
            </div>
            <div className="text-2xl font-extrabold font-code text-white mt-0.5 tracking-tight">
              {stats.score}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-zinc-500">ความยาวงู</span>
            <div className="text-xs font-semibold text-emerald-400 font-code">
              {snakeLength} ช่อง
            </div>
          </div>
        </div>

        {/* High Score */}
        <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-[11px] font-medium tracking-wider text-zinc-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>คะแนนสูงสุด (BEST)</span>
            </div>
            <div className="text-2xl font-extrabold font-code text-amber-400 mt-0.5 tracking-tight">
              {stats.highScore}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-zinc-500">แอปเปิ้ลที่กิน</span>
            <div className="text-xs font-semibold text-amber-300 font-code">
              🍎 {stats.applesEaten}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Quick Metrics Row */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-[10px] text-zinc-400 flex items-center justify-center gap-0.5">
            <Timer className="w-3 h-3 text-cyan-400" />
            <span>เวลา</span>
          </div>
          <div className="text-xs font-bold font-code text-zinc-200 mt-0.5">
            {formatTime(stats.playTimeSeconds)}
          </div>
        </div>

        <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-[10px] text-zinc-400 flex items-center justify-center gap-0.5">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span>โบนัสทอง</span>
          </div>
          <div className="text-xs font-bold font-code text-amber-400 mt-0.5">
            ★ {stats.goldenEaten}
          </div>
        </div>

        <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-[10px] text-zinc-400 flex items-center justify-center gap-0.5">
            <ArrowRightLeft className="w-3 h-3 text-purple-400" />
            <span>การกดปุ่ม</span>
          </div>
          <div className="text-xs font-bold font-code text-purple-300 mt-0.5">
            {stats.movesCount}
          </div>
        </div>

        <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-[10px] text-zinc-400 flex items-center justify-center gap-0.5">
            <ShieldAlert className="w-3 h-3 text-emerald-400" />
            <span>กระดาน</span>
          </div>
          <div className="text-xs font-bold font-code text-zinc-300 mt-0.5">
            {settings.gridSize}x{settings.gridSize}
          </div>
        </div>
      </div>

      {/* Current Mode & State Pill */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-400 text-[11px]">โหมดปัจจุบัน:</span>
          <span className={`px-2 py-0.5 rounded-md border text-[11px] font-medium ${modeBadge.color}`}>
            {modeBadge.label}
          </span>
        </div>
        <div className="text-[11px] text-zinc-500">
          ความเร็ว: <span className="text-zinc-300 font-code">{Math.round(1000 / settings.initialSpeed)} tps</span>
        </div>
      </div>
    </div>
  );
};
