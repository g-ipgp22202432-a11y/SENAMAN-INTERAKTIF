/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FirstPersonRunnerScene } from './three/FirstPersonRunnerScene';
import { WarmupDashboard } from './components/WarmupDashboard';
import { ActionPromptHUD } from './components/ActionPromptHUD';
import { TeacherControlDock } from './components/TeacherControlDock';
import { MovementGuideModal } from './components/MovementGuideModal';
import { EndSummaryModal } from './components/EndSummaryModal';
import { EmbedCodeModal } from './components/EmbedCodeModal';
import { WARMUP_PHASES, TOTAL_DEFAULT_DURATION } from './game/warmupRules';
import { GameMode, SpeedLevel, WarmupMetrics, ActiveActionPrompt } from './types';
import { soundEngine } from './audio/soundEngine';
import { Sparkles, Info } from 'lucide-react';

export default function App() {
  // Start moving forward along the road by default!
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [hasStartedOnce, setHasStartedOnce] = useState<boolean>(true);
  const [gameMode, setGameMode] = useState<GameMode>('AUTO_TAYANGAN');
  const [speedLevel, setSpeedLevel] = useState<SpeedLevel>('BIASA');

  // Welcome banner visible for first 5 seconds then gently fades away
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(true);

  // Trigger states for manual / button actions
  const [jumpTrigger, setJumpTrigger] = useState<number>(0);
  const [duckTrigger, setDuckTrigger] = useState<number>(0);
  const [leftTrigger, setLeftTrigger] = useState<number>(0);
  const [rightTrigger, setRightTrigger] = useState<number>(0);

  // Modals
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState<boolean>(false);

  // HUD and scene feedback
  const [activePrompt, setActivePrompt] = useState<ActiveActionPrompt | null>(null);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [isSuccessFeedback, setIsSuccessFeedback] = useState<boolean>(true);

  // Metrics
  const [metrics, setMetrics] = useState<WarmupMetrics>({
    elapsedSeconds: 0,
    totalDurationSeconds: TOTAL_DEFAULT_DURATION,
    currentPhaseIndex: 0,
    stepsEstimated: 0,
    caloriesBurned: 0,
    score: 0,
    streak: 0,
    successfulActions: 0,
  });

  // Auto-hide the welcome hint after 5 seconds so view is totally clear
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeBanner(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
    if (!hasStartedOnce) setHasStartedOnce(true);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setIsSummaryOpen(false);
    setActivePrompt(null);
    setFeedbackText(null);
    setMetrics({
      elapsedSeconds: 0,
      totalDurationSeconds: TOTAL_DEFAULT_DURATION,
      currentPhaseIndex: 0,
      stepsEstimated: 0,
      caloriesBurned: 0,
      score: 0,
      streak: 0,
      successfulActions: 0,
    });
    soundEngine.restartMusic();
    // Brief timeout then start fresh
    setTimeout(() => {
      setIsPlaying(true);
      setShowWelcomeBanner(true);
    }, 150);
  };

  const handleFeedback = useCallback((text: string, isSuccess: boolean) => {
    setFeedbackText(text);
    setIsSuccessFeedback(isSuccess);
    setTimeout(() => {
      setFeedbackText(null);
    }, 1400);
  }, []);

  const handlePhaseComplete = useCallback(() => {
    handleFeedback('FASA BAHARU BERMULA! TERUSKAN BERLARI!', true);
  }, [handleFeedback]);

  const handleSessionFinish = useCallback(() => {
    setIsPlaying(false);
    setIsSummaryOpen(true);
  }, []);

  const currentPhase = WARMUP_PHASES[metrics.currentPhaseIndex] || WARMUP_PHASES[0];

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none"
      data-testid="app-root"
      data-state={isPlaying ? 'playing' : 'paused'}
    >
      {/* 3D First-Person Scene Viewport - Continuously moving forward */}
      <FirstPersonRunnerScene
        isPlaying={isPlaying}
        gameMode={gameMode}
        speedLevel={speedLevel}
        onMetricsUpdate={setMetrics}
        onActivePromptChange={setActivePrompt}
        onFeedback={handleFeedback}
        onPhaseComplete={handlePhaseComplete}
        onSessionFinish={handleSessionFinish}
        jumpTrigger={jumpTrigger}
        duckTrigger={duckTrigger}
        leftTrigger={leftTrigger}
        rightTrigger={rightTrigger}
      />

      {/* Top Dashboard Minimal Bar */}
      <WarmupDashboard
        metrics={metrics}
        currentPhase={currentPhase}
        onOpenEmbed={() => setIsEmbedOpen(true)}
      />

      {/* High Visibility Action Prompt HUD (Appears when obstacles approach) */}
      <ActionPromptHUD
        prompt={activePrompt}
        feedbackText={feedbackText}
        isSuccessFeedback={isSuccessFeedback}
      />

      {/* Floating Opening Toast Banner (Positioned at bottom corner so road view is 100% clear) */}
      {showWelcomeBanner && (
        <div className="absolute bottom-24 left-4 md:left-6 z-20 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-slate-900/90 border-2 border-amber-400 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3 max-w-sm">
            <span className="text-xl">⚡</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs text-amber-400">Larian Kejiranan BoBoiBoy</span>
                <span className="text-[9px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.2 rounded-full border border-amber-400/40">
                  Pulau Rintis
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Lari setempat & ikuti arahan watak!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowWelcomeBanner(false)}
              className="pointer-events-auto ml-1 text-[11px] text-slate-400 hover:text-white cursor-pointer px-2 py-0.5 bg-slate-800 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Unified Collapsible Bottom Control Dock */}
      <TeacherControlDock
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onRestart={handleRestart}
        gameMode={gameMode}
        onToggleGameMode={setGameMode}
        speedLevel={speedLevel}
        onChangeSpeed={setSpeedLevel}
        onTriggerJump={() => setJumpTrigger(Date.now())}
        onTriggerDuck={() => setDuckTrigger(Date.now())}
        onTriggerLeft={() => setLeftTrigger(Date.now())}
        onTriggerRight={() => setRightTrigger(Date.now())}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenEmbed={() => setIsEmbedOpen(true)}
      />

      {/* Movement Guide Modal */}
      <MovementGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* End Summary Modal */}
      <EndSummaryModal
        isOpen={isSummaryOpen}
        metrics={metrics}
        onRestart={handleRestart}
      />

      {/* Embed Code Modal */}
      <EmbedCodeModal
        isOpen={isEmbedOpen}
        onClose={() => setIsEmbedOpen(false)}
      />
    </div>
  );
}
