import React from 'react';
import { Direction } from '../types';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Settings as SettingsIcon,
  HelpCircle,
} from 'lucide-react';

interface GameControlsProps {
  onDirectionChange: (dir: Direction) => void;
  onPauseToggle: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onDirectionChange,
  onPauseToggle,
  onRestart,
  onOpenSettings,
  onOpenHowToPlay,
  isPlaying,
  isPaused,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <div id="game-controls" className="w-full max-w-[460px] mx-auto space-y-3">
      {/* Action Buttons Toolbar */}
      <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-lg">
        {/* Play/Pause Button */}
        <button
          id="btn-play-pause"
          onClick={onPauseToggle}
          disabled={!isPlaying}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold font-arcade text-xs tracking-wider transition-all cursor-pointer ${
            !isPlaying
              ? 'bg-zinc-800/40 text-zinc-500 cursor-not-allowed'
              : isPaused
              ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20'
              : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30'
          }`}
          title="พัก / เล่นต่อ (Spacebar)"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          <span>{isPaused ? 'เล่นต่อ' : 'พักเกม'}</span>
        </button>

        {/* Restart Button */}
        <button
          id="btn-restart"
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 font-bold font-arcade text-xs tracking-wider transition-all border border-zinc-700/60 shadow-md cursor-pointer"
          title="เริ่มเกมใหม่ (R)"
        >
          <RotateCcw className="w-4 h-4 text-emerald-400" />
          <span>เริ่มใหม่</span>
        </button>

        {/* Sound Toggle */}
        <button
          id="btn-toggle-sound"
          onClick={onToggleSound}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
          }`}
          title={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Settings Button */}
        <button
          id="btn-open-settings"
          onClick={onOpenSettings}
          className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-all cursor-pointer"
          title="ตั้งค่า (ความเร็ว/โหมด/ธีม)"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>

        {/* How to play Button */}
        <button
          id="btn-open-how-to-play"
          onClick={onOpenHowToPlay}
          className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-cyan-400 hover:bg-zinc-700 transition-all cursor-pointer"
          title="วิธีเล่น / กติกา"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* On-screen Mobile Touch D-Pad */}
      <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
        <div className="text-[11px] font-medium text-zinc-400 text-center mb-2 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>ปุ่มควบคุมทิศทาง (D-PAD / ทัชสกรีน)</span>
        </div>

        <div className="grid grid-cols-3 gap-2 max-w-[210px] mx-auto">
          {/* Row 1: UP */}
          <div />
          <button
            id="dpad-up-btn"
            onClick={() => onDirectionChange('UP')}
            className="h-12 rounded-xl bg-zinc-800 active:bg-emerald-500 active:text-zinc-950 active:scale-90 border border-zinc-700/80 text-zinc-200 flex items-center justify-center transition-all shadow-md cursor-pointer hover:bg-zinc-750"
            aria-label="เลื่อนขึ้น (UP)"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div />

          {/* Row 2: LEFT, CENTER-PAUSE, RIGHT */}
          <button
            id="dpad-left-btn"
            onClick={() => onDirectionChange('LEFT')}
            className="h-12 rounded-xl bg-zinc-800 active:bg-emerald-500 active:text-zinc-950 active:scale-90 border border-zinc-700/80 text-zinc-200 flex items-center justify-center transition-all shadow-md cursor-pointer hover:bg-zinc-750"
            aria-label="เลี้ยวซ้าย (LEFT)"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            id="dpad-center-btn"
            onClick={() => {
              if (!isPlaying) onRestart();
              else onPauseToggle();
            }}
            className="h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 active:scale-90 flex items-center justify-center font-code text-xs font-bold transition-all shadow-inner cursor-pointer"
            aria-label="ปุ่มกลาง Pause/Play"
          >
            {isPaused ? '▶' : '⏸'}
          </button>

          <button
            id="dpad-right-btn"
            onClick={() => onDirectionChange('RIGHT')}
            className="h-12 rounded-xl bg-zinc-800 active:bg-emerald-500 active:text-zinc-950 active:scale-90 border border-zinc-700/80 text-zinc-200 flex items-center justify-center transition-all shadow-md cursor-pointer hover:bg-zinc-750"
            aria-label="เลี้ยวขวา (RIGHT)"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Row 3: DOWN */}
          <div />
          <button
            id="dpad-down-btn"
            onClick={() => onDirectionChange('DOWN')}
            className="h-12 rounded-xl bg-zinc-800 active:bg-emerald-500 active:text-zinc-950 active:scale-90 border border-zinc-700/80 text-zinc-200 flex items-center justify-center transition-all shadow-md cursor-pointer hover:bg-zinc-750"
            aria-label="เลื่อนลง (DOWN)"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <div />
        </div>

        {/* Keyboard hints footer */}
        <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-center gap-3 text-[10px] text-zinc-500">
          <span>🎮 คีย์บอร์ด: <span className="text-zinc-300 font-code font-semibold">ปุ่มลูกศร</span> หรือ <span className="text-zinc-300 font-code font-semibold">W A S D</span></span>
          <span>•</span>
          <span><span className="text-zinc-300 font-code font-semibold">Space</span> พักเกม</span>
        </div>
      </div>
    </div>
  );
};
