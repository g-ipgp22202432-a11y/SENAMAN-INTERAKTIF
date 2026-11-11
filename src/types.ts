export type ActionType = 'KIRI' | 'KANAN' | 'LOMPAT' | 'TUNDUK' | 'LARI_SETEMPAT';

export type GameMode = 'AUTO_TAYANGAN' | 'INTERAKTIF';

export type SpeedLevel = 'SANTAI' | 'BIASA' | 'CERGAS';

export type MusicTrackId = 'BOBOIBOY_OST_OFFICIAL' | 'BOBOIBOY_HERO' | 'BOBOIBOY_ELEMENTAL' | 'KOKOTIAM_SANTAI' | 'CUSTOM_FILE';

export interface PhaseInfo {
  id: number;
  name: string;
  tagline: string;
  durationSeconds: number;
  description: string;
  targetBpm: number;
}

export interface ObstacleData {
  id: string;
  type: ActionType;
  lane: -1 | 0 | 1; // -1: Left, 0: Center, 1: Right
  zPos: number; // distance along track
  cleared?: boolean;
  modelType: 'TONG_SAMPAH' | 'LOPAK_AIR' | 'DAHAN_RENDAH' | 'KERETA_SORONG' | 'KON_JALAN';
  nameBM: string;
  actionBM: string;
  tipBM: string;
}

export interface WarmupMetrics {
  elapsedSeconds: number;
  totalDurationSeconds: number;
  currentPhaseIndex: number;
  stepsEstimated: number;
  caloriesBurned: number;
  score: number;
  streak: number;
  successfulActions: number;
}

export interface ActiveActionPrompt {
  type: ActionType;
  title: string;
  subtitle: string;
  timeRemainingRatio: number; // 1.0 down to 0.0
  targetDistance: number;
}
