import React, { useEffect } from 'react';
import { WarmupMetrics } from '../types';
import confetti from 'canvas-confetti';
import { Award, Footprints, Flame, CheckCircle, RotateCcw } from 'lucide-react';

interface EndSummaryModalProps {
  isOpen: boolean;
  metrics: WarmupMetrics;
  onRestart: () => void;
}

export const EndSummaryModal: React.FC<EndSummaryModalProps> = ({
  isOpen,
  metrics,
  onRestart,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback silently if confetti canvas fails
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs">
      <div className="bg-slate-900 border-4 border-amber-400 w-full max-w-lg rounded-3xl p-6 shadow-2xl text-white text-center animate-in zoom-in-95 duration-200">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-400 text-slate-900 rounded-3xl text-4xl mb-3 shadow-lg transform -rotate-3">
          🏆
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-amber-400 tracking-wide">
          TAHNIAH, WARGA CERGAS TAHUN 5!
        </h2>
        <p className="text-sm text-slate-300 mt-1 mb-6">
          Pemanas Badan &quot;Larian Kejiranan&quot; berjaya ditamatkan dengan cemerlang!
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
              <Footprints className="w-4 h-4 text-emerald-400" />
              <span>JUMLAH LANGKAH</span>
            </div>
            <div className="text-2xl font-black text-emerald-300">
              {metrics.stepsEstimated}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Larian setempat</div>
          </div>

          <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>KALORI DIBAKAR</span>
            </div>
            <div className="text-2xl font-black text-rose-300">
              {metrics.caloriesBurned} <span className="text-sm font-normal">kcal</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Kadar cergas</div>
          </div>

          <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
              <CheckCircle className="w-4 h-4 text-sky-400" />
              <span>HALANGAN DIELAK</span>
            </div>
            <div className="text-2xl font-black text-sky-300">
              {metrics.successfulActions}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Kiri, kanan, lompat & tunduk</div>
          </div>

          <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span>SKOR KETANGKASAN</span>
            </div>
            <div className="text-2xl font-black text-amber-300">
              {metrics.score}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Tahap: Cemerlang!</div>
          </div>
        </div>

        {/* Health / Cool-down advice in Malay */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 text-xs text-emerald-200 mb-6 text-left">
          <strong>Langkah Seterusnya:</strong> Lakukan regangan statik ringan, tarik nafas perlahan-lahan untuk menenangkan otot, dan nikmati secawan air koko Tok Aba yang menyegarkan!
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 py-3 px-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black rounded-2xl cartoon-btn shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>MULA SEMULA SESI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
