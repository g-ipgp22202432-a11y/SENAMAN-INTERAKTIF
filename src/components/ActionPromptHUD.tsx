import React from 'react';
import { ActiveActionPrompt } from '../types';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, CheckCircle2, Sparkles } from 'lucide-react';

interface ActionPromptHUDProps {
  prompt: ActiveActionPrompt | null;
  feedbackText: string | null;
  isSuccessFeedback: boolean;
}

export const ActionPromptHUD: React.FC<ActionPromptHUDProps> = ({
  prompt,
  feedbackText,
  isSuccessFeedback,
}) => {
  // If neither prompt nor feedback is active, render nothing so the screen is completely clear
  if (!prompt && !feedbackText) return null;

  // Character metadata for authentic BoBoiBoy style
  const getCharacterMeta = (type: ActiveActionPrompt['type']) => {
    switch (type) {
      case 'LOMPAT':
        return {
          img: '/assets/boboiboy/boboiboy_crop.png',
          name: 'BoBoiBoy',
          bgColor: 'bg-amber-400 text-slate-950 border-amber-500 shadow-amber-500/30',
          badgeBg: 'bg-amber-500 text-white',
          barColor: 'bg-slate-950',
          icon: <ArrowUp className="w-5 h-5 stroke-[3] text-amber-950 animate-bounce" />,
          actionWord: 'LOMPAT!',
          subHint: 'Angkat lutut tinggi!',
        };
      case 'TUNDUK':
        return {
          img: '/assets/boboiboy/ying_crop.png',
          name: 'Ying',
          bgColor: 'bg-emerald-400 text-slate-950 border-emerald-500 shadow-emerald-500/30',
          badgeBg: 'bg-emerald-600 text-white',
          barColor: 'bg-slate-950',
          icon: <ArrowDown className="w-5 h-5 stroke-[3] text-emerald-950 animate-bounce" />,
          actionWord: 'TUNDUK!',
          subHint: 'Bengkokkan lutut & tunduk!',
        };
      case 'KIRI':
        return {
          img: '/assets/boboiboy/gopal_crop.png',
          name: 'Gopal',
          bgColor: 'bg-sky-400 text-slate-950 border-sky-500 shadow-sky-500/30',
          badgeBg: 'bg-sky-600 text-white',
          barColor: 'bg-slate-950',
          icon: <ArrowLeft className="w-5 h-5 stroke-[3] text-sky-950 animate-bounce" />,
          actionWord: 'ELAK KIRI!',
          subHint: 'Langkah ke lorong kiri!',
        };
      case 'KANAN':
        return {
          img: '/assets/boboiboy/yaya_crop.png',
          name: 'Yaya',
          bgColor: 'bg-rose-400 text-slate-950 border-rose-500 shadow-rose-500/30',
          badgeBg: 'bg-rose-600 text-white',
          barColor: 'bg-slate-950',
          icon: <ArrowRight className="w-5 h-5 stroke-[3] text-rose-950 animate-bounce" />,
          actionWord: 'ELAK KANAN!',
          subHint: 'Langkah ke lorong kanan!',
        };
    }
  };

  const meta = prompt ? getCharacterMeta(prompt.type) : null;

  return (
    <div className="pointer-events-none absolute top-14 md:top-15 left-0 right-0 z-20 flex justify-center items-center px-4">
      {/* Sleek horizontal container: prompt and feedback side-by-side, NEVER stacked vertically down into road */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-full">
        {/* Active Action Prompt Pill - Ultra-compact (height ~38px) */}
        {prompt && meta && (
          <div
            className={`relative flex items-center gap-2.5 px-3 py-1.5 rounded-full border-2 shadow-lg backdrop-blur-md transition-all duration-150 overflow-hidden ${meta.bgColor}`}
          >
            {/* Character Circular Avatar */}
            <div className="relative shrink-0">
              <img
                src={meta.img}
                alt={meta.name}
                className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm bg-white/30"
              />
              <span className="sr-only">{meta.name}</span>
            </div>

            {/* Action Icon Badge */}
            <div className="shrink-0 bg-white/80 p-0.5 rounded-full shadow-inner flex items-center justify-center">
              {meta.icon}
            </div>

            {/* Concise Direction Instruction */}
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-base md:text-lg font-black tracking-wide uppercase drop-shadow-xs">
                {meta.actionWord}
              </span>
              <span className="text-xs font-bold text-slate-900/80 hidden sm:inline">
                • {meta.subHint}
              </span>
            </div>

            {/* Integrated Reaction Time Gauge (Sleek bottom border progress bar, 0 extra vertical height) */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-950/25">
              <div
                className={`h-full ${meta.barColor} transition-all duration-75 ease-linear`}
                style={{ width: `${Math.round(prompt.timeRemainingRatio * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Immediate Feedback Pill - Stays on the same top line so road view is 100% unobstructed */}
        {feedbackText && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-xs md:text-sm border-2 shadow-lg animate-in zoom-in-95 fade-in duration-100 whitespace-nowrap ${
              isSuccessFeedback
                ? 'bg-lime-400 text-slate-950 border-lime-600 shadow-lime-500/20'
                : 'bg-amber-300 text-slate-950 border-amber-500 shadow-amber-500/20'
            }`}
          >
            {isSuccessFeedback ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-900" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-900" />
            )}
            <span>{feedbackText}</span>
          </div>
        )}
      </div>
    </div>
  );
};
