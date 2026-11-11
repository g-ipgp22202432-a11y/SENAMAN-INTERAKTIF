import React, { useState, useRef } from 'react';
import { GameMode, SpeedLevel, MusicTrackId } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Tv,
  Gamepad2,
  Info,
  Code2,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Music,
  Upload,
  Check,
  Sparkles,
} from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface TeacherControlDockProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  gameMode: GameMode;
  onToggleGameMode: (mode: GameMode) => void;
  speedLevel: SpeedLevel;
  onChangeSpeed: (speed: SpeedLevel) => void;
  onTriggerJump: () => void;
  onTriggerDuck: () => void;
  onTriggerLeft: () => void;
  onTriggerRight: () => void;
  onOpenGuide: () => void;
  onOpenEmbed?: () => void;
}

export const TeacherControlDock: React.FC<TeacherControlDockProps> = ({
  isPlaying,
  onTogglePlay,
  onRestart,
  gameMode,
  onToggleGameMode,
  speedLevel,
  onChangeSpeed,
  onTriggerJump,
  onTriggerDuck,
  onTriggerLeft,
  onTriggerRight,
  onOpenGuide,
  onOpenEmbed,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [isMusicMenuOpen, setIsMusicMenuOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState<MusicTrackId>(soundEngine.getMusicTrack());
  const [customFileName, setCustomFileName] = useState<string | null>(soundEngine.getCustomFileName());
  const [musicToast, setMusicToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  const handleSelectTrack = (track: MusicTrackId) => {
    setActiveTrack(track);
    soundEngine.setMusicTrack(track);
    setIsMusicMenuOpen(false);

    let name = 'Lagu Tema BoBoiBoy (OST Rasmi)';
    if (track === 'BOBOIBOY_OST_OFFICIAL') name = 'OST BoBoiBoy (Rasmi)';
    else if (track === 'BOBOIBOY_HERO') name = 'Lagu Tema BoBoiBoy (Sintesis)';
    else if (track === 'BOBOIBOY_ELEMENTAL') name = 'Pecutan Kuasa Elemental';
    else if (track === 'KOKOTIAM_SANTAI') name = 'Santai Kokotiam Tok Aba';
    else if (track === 'CUSTOM_FILE') name = customFileName || 'Fail Lagu Pilihan';

    setMusicToast(`Lagu ditukar: ${name}`);
    setTimeout(() => setMusicToast(null), 2500);
  };

  const handleCustomAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileName = await soundEngine.loadCustomAudioFile(file);
      setCustomFileName(fileName);
      setActiveTrack('CUSTOM_FILE');
      setIsMusicMenuOpen(false);
      setMusicToast(`Memainkan lagu: ${fileName}`);
      setTimeout(() => setMusicToast(null), 3000);
    } catch {
      setMusicToast('Ralat memuat naik audio');
      setTimeout(() => setMusicToast(null), 2000);
    }
  };

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-[94vw] md:max-w-4xl transition-transform duration-300 ease-in-out ${
        isCollapsed ? 'translate-y-[calc(100%-42px)]' : 'translate-y-0'
      }`}
    >
      {/* Toast Notice when Track Changes */}
      {musicToast && (
        <div className="flex justify-center mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-amber-400 text-slate-900 font-extrabold text-xs px-4 py-1.5 rounded-full shadow-lg border border-amber-300 flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 fill-current" />
            <span>{musicToast}</span>
          </div>
        </div>
      )}

      {/* Collapse/Expand Toggle Tab */}
      <div className="flex justify-center mb-1">
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900/95 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-t-xl border-t border-x border-slate-700 shadow-lg cursor-pointer transition-colors"
          aria-label={isCollapsed ? 'Papar Panel Kawalan' : 'Sembunyikan Panel Kawalan'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-4 h-4 text-amber-400" />
              <span>▴ Papar Kawalan Guru & Murid</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 text-slate-400" />
              <span>▾ Sembunyikan Kawalan (Skrin Penuh)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Unified Control Bar */}
      <div className="relative bg-slate-900/95 border-2 border-slate-700 rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-white">
        {/* Left: Primary Playback & Mode Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm md:text-base cartoon-btn shadow-md cursor-pointer ${
              isPlaying
                ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 border-b-4 border-amber-600'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white border-b-4 border-emerald-700'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>JEDA</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>MULA LARIAN</span>
              </>
            )}
          </button>

          {/* Restart Button */}
          <button
            type="button"
            onClick={onRestart}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 cursor-pointer"
            title="Mula Semula Larian"
            aria-label="Mula Semula"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Mode Selector (Tayangan Kelas vs Interaktif) */}
          <div className="flex bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => onToggleGameMode('AUTO_TAYANGAN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                gameMode === 'AUTO_TAYANGAN'
                  ? 'bg-sky-500 text-white shadow font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mod Tayangan</span> Kelas
            </button>
            <button
              type="button"
              onClick={() => onToggleGameMode('INTERAKTIF')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                gameMode === 'INTERAKTIF'
                  ? 'bg-amber-500 text-slate-900 shadow font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Interaktif</span>
            </button>
          </div>
        </div>

        {/* Center: On-screen Action Triggers with BoBoiBoy Character Avatars */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1.5 rounded-2xl border border-slate-700">
          <button
            type="button"
            onClick={onTriggerLeft}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 border border-sky-500/40 rounded-xl text-xs font-black cursor-pointer cartoon-btn"
            title="Langkah ke Kiri (Gopal & Ochobot)"
          >
            <img src="/assets/boboiboy/gopal_crop.png" alt="Gopal" className="w-4 h-4 rounded-full object-cover border border-sky-400" />
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-extrabold">KIRI</span>
          </button>

          <button
            type="button"
            onClick={onTriggerJump}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-black cursor-pointer cartoon-btn"
            title="Lompat Melepasi Halangan (BoBoiBoy)"
          >
            <img src="/assets/boboiboy/boboiboy_crop.png" alt="BoBoiBoy" className="w-4 h-4 rounded-full object-cover border border-amber-400" />
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="font-extrabold">LOMPAT</span>
          </button>

          <button
            type="button"
            onClick={onTriggerDuck}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-black cursor-pointer cartoon-btn"
            title="Tunduk Rendah (Ying)"
          >
            <img src="/assets/boboiboy/ying_crop.png" alt="Ying" className="w-4 h-4 rounded-full object-cover border border-emerald-400" />
            <ArrowDown className="w-3.5 h-3.5" />
            <span className="font-extrabold">TUNDUK</span>
          </button>

          <button
            type="button"
            onClick={onTriggerRight}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-black cursor-pointer cartoon-btn"
            title="Langkah ke Kanan (Yaya)"
          >
            <span className="font-extrabold">KANAN</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <img src="/assets/boboiboy/yaya_crop.png" alt="Yaya" className="w-4 h-4 rounded-full object-cover border border-rose-400" />
          </button>
        </div>

        {/* Right: Music Track Selector, Speed Multiplier, Sound Toggle, and PE Guide */}
        <div className="flex items-center gap-2">
          {/* BoBoiBoy Music Track Selector Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMusicMenuOpen(!isMusicMenuOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                activeTrack === 'BOBOIBOY_OST_OFFICIAL' || activeTrack === 'BOBOIBOY_HERO'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-extrabold shadow-sm'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Pilih Lagu Latar BoBoiBoy"
            >
              <Music className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">
                {activeTrack === 'BOBOIBOY_OST_OFFICIAL'
                  ? '⭐ OST BoBoiBoy'
                  : activeTrack === 'BOBOIBOY_HERO'
                  ? 'Lagu BoBoiBoy'
                  : activeTrack === 'BOBOIBOY_ELEMENTAL'
                  ? 'Kuasa Elemental'
                  : activeTrack === 'KOKOTIAM_SANTAI'
                  ? 'Santai Kokotiam'
                  : 'Fail MP3 Anda'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Music Track Popover Menu */}
            {isMusicMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-80 bg-slate-900 border-2 border-amber-500/60 rounded-2xl p-2.5 shadow-2xl z-40 text-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700 text-amber-300 font-black">
                  <span className="flex items-center gap-1.5">
                    <Music className="w-4 h-4 text-amber-400" />
                    Pilihan Lagu Latar BoBoiBoy:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMusicMenuOpen(false)}
                    className="text-slate-400 hover:text-white cursor-pointer px-1.5 py-0.5 rounded-lg hover:bg-slate-800"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-1.5">
                  {/* Track 0: Official BoBoiBoy OST Instrumental Audio */}
                  <button
                    type="button"
                    onClick={() => handleSelectTrack('BOBOIBOY_OST_OFFICIAL')}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                      activeTrack === 'BOBOIBOY_OST_OFFICIAL'
                        ? 'bg-amber-400 text-slate-900 font-black'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold flex items-center gap-1.5">
                        <span>⭐ Lagu Tema BoBoiBoy (OST Rasmi)</span>
                        <span className={`text-[10px] px-1.5 rounded font-black ${
                          activeTrack === 'BOBOIBOY_OST_OFFICIAL'
                            ? 'bg-slate-900 text-amber-400'
                            : 'bg-emerald-500 text-white'
                        }`}>
                          Aktif
                        </span>
                      </div>
                      <div className="text-[10px] opacity-85">Fail audio instrumental rasmi BoBoiBoy OST</div>
                    </div>
                    {activeTrack === 'BOBOIBOY_OST_OFFICIAL' && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  {/* Track 1: BoBoiBoy Superhero Synthesis */}
                  <button
                    type="button"
                    onClick={() => handleSelectTrack('BOBOIBOY_HERO')}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                      activeTrack === 'BOBOIBOY_HERO'
                        ? 'bg-amber-400 text-slate-900 font-black'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold flex items-center gap-1.5">
                        <span>⚡ Lagu Tema BoBoiBoy (Sintesis)</span>
                      </div>
                      <div className="text-[10px] opacity-80">Gubahan melodi "BoBoiBoy Superhero Kita!"</div>
                    </div>
                    {activeTrack === 'BOBOIBOY_HERO' && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  {/* Track 2: Elemental Rush */}
                  <button
                    type="button"
                    onClick={() => handleSelectTrack('BOBOIBOY_ELEMENTAL')}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                      activeTrack === 'BOBOIBOY_ELEMENTAL'
                        ? 'bg-amber-400 text-slate-900 font-black'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold">🔥 Pecutan Kuasa Elemental</div>
                      <div className="text-[10px] opacity-80">Irama laju bertenaga untuk larian pecut</div>
                    </div>
                    {activeTrack === 'BOBOIBOY_ELEMENTAL' && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  {/* Track 3: Kokotiam Tok Aba */}
                  <button
                    type="button"
                    onClick={() => handleSelectTrack('KOKOTIAM_SANTAI')}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                      activeTrack === 'KOKOTIAM_SANTAI'
                        ? 'bg-amber-400 text-slate-900 font-black'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold">☕ Santai Kokotiam Tok Aba</div>
                      <div className="text-[10px] opacity-80">Rentak santai riang taman kejiranan</div>
                    </div>
                    {activeTrack === 'KOKOTIAM_SANTAI' && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  {/* Upload Custom BoBoiBoy MP3 File */}
                  <div className="pt-1.5 border-t border-slate-700/80">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleCustomAudioUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full p-2.5 rounded-xl flex items-center justify-between border border-dashed border-amber-400/50 cursor-pointer transition-colors ${
                        activeTrack === 'CUSTOM_FILE'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                          : 'bg-slate-800/50 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-amber-400" />
                        <div>
                          <div className="font-extrabold text-amber-300">Pilih Fail MP3 Lain</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[190px]">
                            {customFileName || 'Muat naik fail lagu sendiri dari komputer'}
                          </div>
                        </div>
                      </div>
                      {activeTrack === 'CUSTOM_FILE' && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Speed Pills */}
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            {(['SANTAI', 'BIASA', 'CERGAS'] as SpeedLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onChangeSpeed(level)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  speedLevel === level
                    ? 'bg-amber-400 text-slate-900 font-extrabold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {level === 'SANTAI' ? 'Santai' : level === 'BIASA' ? 'Biasa' : 'Cergas'}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleMute}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 cursor-pointer"
            title={isMuted ? 'Buka Muzik & Bunyi' : 'Senyapkan Bunyi'}
            aria-label="Bunyi"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-rose-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            )}
          </button>

          {/* Guide Modal Trigger */}
          <button
            type="button"
            onClick={onOpenGuide}
            className="flex items-center gap-1 p-2 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl border border-slate-700 cursor-pointer text-xs font-bold"
            title="Panduan Pergerakan Murid Tahun 5"
          >
            <Info className="w-4 h-4" />
            <span className="hidden lg:inline">Panduan PJK</span>
          </button>

          {/* Embed Code Modal Trigger */}
          {onOpenEmbed && (
            <button
              type="button"
              onClick={onOpenEmbed}
              className="flex items-center gap-1 p-2 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-xl font-black text-xs cursor-pointer shadow transition-all"
              title="Dapatkan Kod Embed untuk Google Sites / DELIMa"
            >
              <Code2 className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Kod Embed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
