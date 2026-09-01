import React from 'react';
import { X, Gamepad2, Keyboard, Apple, Sparkles, Shield, Trophy } from 'lucide-react';

interface HowToPlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold font-arcade text-white tracking-wide">
              วิธีเล่น & กติกา (HOW TO PLAY)
            </h2>
          </div>
          <button
            id="close-how-to-play-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Objective & Rules */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>1. เป้าหมาย & กติกาการเล่น</span>
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            บังคับงูไปกินผลไม้เพื่อเพิ่มความยาวตัวและสะสมคะแนนให้ได้มากที่สุด โดยต้องระวังอย่าให้หัวงูชนกับกำแพง ขอบกระดาน บล็อกสิ่งกีดขวาง หรือลำตัวของตัวเอง
          </p>
        </div>

        {/* Section 2: Controls */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Keyboard className="w-3.5 h-3.5" />
            <span>2. วิธีการควบคุม (Controls)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
              <span className="font-bold text-white">🖥️ คอมพิวเตอร์ (Keyboard)</span>
              <ul className="text-zinc-400 space-y-1 text-[11px]">
                <li>• <strong className="text-zinc-200">ปุ่มลูกศร (Arrow Keys)</strong> หรือ <strong className="text-zinc-200">W, A, S, D</strong> เพื่อเลี้ยว</li>
                <li>• <strong className="text-zinc-200">Spacebar</strong> หรือ <strong className="text-zinc-200">P</strong> เพื่อพักเกม/เล่นต่อ</li>
                <li>• <strong className="text-zinc-200">R</strong> เพื่อเริ่มเกมใหม่ทันที</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
              <span className="font-bold text-white">📱 มือถือ & แท็บเล็ต (Touch)</span>
              <ul className="text-zinc-400 space-y-1 text-[11px]">
                <li>• แตะปุ่มลูกศรจำลอง <strong className="text-zinc-200">(D-Pad)</strong> บนหน้าจอ</li>
                <li>• หรือ <strong className="text-zinc-200">ปัดนิ้ว (Swipe)</strong> บนกระดานตามทิศทางที่ต้องการ</li>
                <li>• แตะที่กระดานเกมเพื่อพักหรือเริ่มเล่นใหม่</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Items & Power-ups */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Apple className="w-3.5 h-3.5" />
            <span>3. ไอเทมและผลไม้พิเศษ</span>
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-start gap-2">
              <span className="text-lg">🍎</span>
              <div>
                <strong className="text-white text-xs block">แอปเปิ้ลแดง (Normal)</strong>
                <span className="text-[11px] text-zinc-400">+10 คะแนน, ลำตัวยาวขึ้น 1 ช่อง</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-start gap-2">
              <span className="text-lg">⭐</span>
              <div>
                <strong className="text-amber-300 text-xs block">ดาวทองคำ (Golden)</strong>
                <span className="text-[11px] text-zinc-400">+35 คะแนน (ไอเทมจำกัดเวลา)</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-start gap-2">
              <span className="text-lg">⚡</span>
              <div>
                <strong className="text-blue-300 text-xs block">สายฟ้าสปีด (Speed Blitz)</strong>
                <span className="text-[11px] text-zinc-400">+25 คะแนน, โบนัสคะแนนคูณ 2</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-start gap-2">
              <span className="text-lg">✂️</span>
              <div>
                <strong className="text-purple-300 text-xs block">กรรไกรย่องตัว (Shrink)</strong>
                <span className="text-[11px] text-zinc-400">ตัดความยาวงูลง 30% ให้เล่นง่ายขึ้น</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Game Modes */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>4. โหมดการเล่นที่มีให้เลือก</span>
          </h3>
          <div className="space-y-1.5 text-xs text-zinc-300 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
            <p>• <strong>โหมดคลาสสิก (Classic):</strong> ชนขอบตาย ชนตัวตาย สนุกท้าทายแบบต้นฉบับ</p>
            <p>• <strong>โหมดวาร์ปทะลุกำแพง (Portal):</strong> วิ่งทะลุขอบจอไปโผล่อีกฝั่งได้ เหมาะสำหรับเล่นชิวๆ</p>
            <p>• <strong>โหมดเขาวงกต (Obstacle Maze):</strong> มีบล็อกอุปสรรคสีแดงสุ่มขึ้นในแผนที่</p>
            <p>• <strong>โหมดผลไม้บุฟเฟ่ต์ (Food Frenzy):</strong> มีผลไม้เกิดขึ้นพร้อมกันหลายลูก</p>
          </div>
        </div>

        {/* Footer Button */}
        <button
          id="understood-how-to-play-btn"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 font-bold font-arcade text-sm tracking-wider shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          เข้าใจแล้ว เริ่มลุยเลย!
        </button>
      </div>
    </div>
  );
};
