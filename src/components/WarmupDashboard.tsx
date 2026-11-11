import React from 'react';
import { WarmupMetrics, PhaseInfo } from '../types';
import { Activity, Flame, Footprints, Award, Code2 } from 'lucide-react';

interface WarmupDashboardProps {
  metrics: WarmupMetrics;
  currentPhase: PhaseInfo;
  onOpenEmbed?: () => void;
}

export const WarmupDashboard: React.FC<WarmupDashboardProps> = ({
  metrics,
  currentPhase,
  onOpenEmbed,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = Math.min(
    100,
    Math.round((metrics.elapsedSeconds / metrics.totalDurationSeconds) * 100)
  );

  return (
    <header className="absolute top-2 left-2 right-2 md:left-4 md:right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
      {/* Title & Current Warm-up Phase */}
      <div className="flex items-center gap-2.5 bg-slate-900/90 text-white px-4 py-2 rounded-2xl border-2 border-slate-700 shadow-lg pointer-events-auto">
        <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-slate-900 font-extrabold text-lg shadow">
          🏃
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm md:text-base text-amber-400 tracking-wide">
              LARIAN KEJIRANAN BOBOIBOY
            </span>
            <span className="bg-amber-400/20 text-amber-300 text-xs px-2 py-0.5 rounded-full font-bold border border-amber-400/40">
              Kokotiam Tok Aba
            </span>
          </div>
          <div className="text-xs md:text-sm font-semibold text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {currentPhase.name}
          </div>
        </div>
      </div>

      {/* Center Timer & Session Progress */}
      <div className="hidden sm:flex flex-col items-center bg-slate-900/90 px-4 py-1.5 rounded-2xl border-2 border-slate-700 shadow-lg text-white pointer-events-auto min-w-[170px]">
        <div className="flex items-center justify-between w-full text-xs font-bold text-slate-300 mb-1">
          <span>Masa Sesi</span>
          <span className="font-mono text-amber-400 font-extrabold text-sm">
            {formatTime(metrics.elapsedSeconds)} / {formatTime(metrics.totalDurationSeconds)}
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Physical Activity Stats for Year 5 */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Steps */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 text-white shadow">
          <Footprints className="w-4 h-4 text-emerald-400" />
          <div className="leading-tight">
            <div className="text-[10px] uppercase font-bold text-slate-400">Langkah</div>
            <div className="font-extrabold text-sm text-emerald-300">
              {metrics.stepsEstimated}
            </div>
          </div>
        </div>

        {/* Calories */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 text-white shadow">
          <Flame className="w-4 h-4 text-rose-400" />
          <div className="leading-tight">
            <div className="text-[10px] uppercase font-bold text-slate-400">Kalori</div>
            <div className="font-extrabold text-sm text-rose-300">
              {metrics.caloriesBurned} <span className="text-[10px] font-normal">kcal</span>
            </div>
          </div>
        </div>

        {/* Score & Streak */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 text-white shadow">
          <Award className="w-4 h-4 text-amber-400" />
          <div className="leading-tight">
            <div className="text-[10px] uppercase font-bold text-slate-400">Skor</div>
            <div className="font-extrabold text-sm text-amber-300">
              {metrics.score}
            </div>
          </div>
        </div>

        {/* Kod Embed Button */}
        {onOpenEmbed && (
          <button
            type="button"
            onClick={onOpenEmbed}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 px-3 py-1.5 rounded-xl border border-amber-500 font-black text-xs shadow-md transition-all cursor-pointer"
            title="Dapatkan Kod Embed untuk Google Sites / DELIMa"
          >
            <Code2 className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Kod Embed</span>
          </button>
        )}
      </div>
    </header>
  );
};
