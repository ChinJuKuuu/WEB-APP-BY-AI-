import React from 'react';
import { GameMode, GameSettings, SnakeSkin } from '../types';
import { THEME_PALETTES } from '../utils/themes';
import { X, Sliders, Palette, Grid, Gamepad2, Volume2, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const gameModes: { id: GameMode; title: string; desc: string; icon: string }[] = [
    {
      id: 'CLASSIC',
      title: 'คลาสสิก (Classic)',
      desc: 'ชนขอบกำแพงหรือชนตัวเองจบเกม กติกามาตรฐาน',
      icon: '🧱',
    },
    {
      id: 'NO_WALLS',
      title: 'วาร์ปทะลุกำแพง (Portal)',
      desc: 'ทะลุขอบจอไปโผล่อีกฝั่งได้ ชนเฉพาะตัวงูเอง',
      icon: '🌀',
    },
    {
      id: 'OBSTACLE_MAZE',
      title: 'เขาวงกตสิ่งกีดขวาง (Maze)',
      desc: 'มีบล็อกอันตรายสุ่มเกิดกลางกระดาน ห้ามชนเด็ดขาด',
      icon: '🚧',
    },
    {
      id: 'FOOD_FRENZY',
      title: 'ผลไม้บุฟเฟ่ต์ (Food Frenzy)',
      desc: 'มีไอเทมพิเศษและผลไม้โผล่พร้อมกันหลายชิ้น',
      icon: '🍒',
    },
  ];

  const gridSizes = [
    { size: 15, label: '15 x 15 (กระชับ)' },
    { size: 20, label: '20 x 20 (มาตรฐาน)' },
    { size: 25, label: '25 x 25 (กว้างขวาง)' },
  ];

  const speeds = [
    { ms: 140, label: 'สบายๆ (Slow)' },
    { ms: 100, label: 'มาตรฐาน (Normal)' },
    { ms: 75, label: 'เร็ว (Fast)' },
    { ms: 50, label: 'ไฮเปอร์ (Insane)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold font-arcade text-white tracking-wide">
              ตั้งค่าเกม (GAME SETTINGS)
            </h2>
          </div>
          <button
            id="close-settings-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Game Mode */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>โหมดการเล่น (Game Mode)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {gameModes.map((mode) => (
              <button
                key={mode.id}
                id={`setting-mode-${mode.id.toLowerCase()}`}
                onClick={() => onUpdateSettings({ gameMode: mode.id })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  settings.gameMode === mode.id
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-sm'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{mode.icon}</span>
                  <span className="text-xs font-bold font-arcade">{mode.title}</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-tight">{mode.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Speed / Difficulty */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ระดับความเร็ว (Speed / Difficulty)</span>
            </label>
            <span className="text-xs font-code text-amber-400 font-bold">
              {Math.round(1000 / settings.initialSpeed)} TPS ({settings.initialSpeed}ms)
            </span>
          </div>

          {/* Speed Preset Pills */}
          <div className="grid grid-cols-4 gap-1.5">
            {speeds.map((s) => (
              <button
                key={s.ms}
                onClick={() => onUpdateSettings({ initialSpeed: s.ms })}
                className={`py-1.5 px-2 rounded-xl text-center font-code text-xs transition-all cursor-pointer ${
                  settings.initialSpeed === s.ms
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'bg-zinc-950/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {s.label.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Speed Range Slider */}
          <input
            id="speed-range-slider"
            type="range"
            min="40"
            max="180"
            step="5"
            value={settings.initialSpeed}
            onChange={(e) => onUpdateSettings({ initialSpeed: Number(e.target.value) })}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>เร็วจัด (40ms)</span>
            <span>ปานกลาง (100ms)</span>
            <span>ช้า (180ms)</span>
          </div>
        </div>

        {/* Section 3: Grid Board Size */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Grid className="w-3.5 h-3.5 text-cyan-400" />
            <span>ขนาดกระดาน (Grid Size)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {gridSizes.map((g) => (
              <button
                key={g.size}
                id={`grid-size-${g.size}`}
                onClick={() => onUpdateSettings({ gridSize: g.size })}
                className={`py-2 px-3 rounded-xl border text-center font-code text-xs transition-all cursor-pointer ${
                  settings.gridSize === g.size
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Theme / Skin */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            <span>ธีมสีตัวงู & แสงนีออน (Skin Theme)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.keys(THEME_PALETTES) as SnakeSkin[]).map((skinKey) => {
              const pal = THEME_PALETTES[skinKey];
              return (
                <button
                  key={skinKey}
                  id={`theme-skin-${skinKey.toLowerCase()}`}
                  onClick={() => onUpdateSettings({ skin: skinKey })}
                  className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                    settings.skin === skinKey
                      ? 'border-white/50 bg-zinc-800 shadow-md ring-1 ring-white/20'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: pal.head }}
                  />
                  <div className="text-left overflow-hidden">
                    <div className="text-xs font-semibold text-zinc-200 truncate">{pal.name}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{pal.nameTh}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 5: Sound Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-zinc-400" />
            <div>
              <div className="text-xs font-semibold text-zinc-200">เสียงประกอบเกม (Sound FX)</div>
              <div className="text-[10px] text-zinc-500">ซินธิไซเซอร์ 8-Bit Chiptune</div>
            </div>
          </div>
          <button
            id="modal-sound-toggle-btn"
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              settings.soundEnabled
                ? 'bg-emerald-500 text-zinc-950'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {settings.soundEnabled ? 'เปิดอยู่ (ON)' : 'ปิดเสียง (OFF)'}
          </button>
        </div>

        {/* Footer OK Button */}
        <button
          id="confirm-settings-btn"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 font-bold font-arcade text-sm tracking-wider shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          บันทึกการตั้งค่า & เล่นต่อ
        </button>
      </div>
    </div>
  );
};
