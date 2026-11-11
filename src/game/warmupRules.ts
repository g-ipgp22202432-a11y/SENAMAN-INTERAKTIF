import { ActionType, PhaseInfo, ObstacleData, SpeedLevel } from '../types';

export const WARMUP_PHASES: PhaseInfo[] = [
  {
    id: 1,
    name: 'Fasa 1: Mula Santai & Regangan',
    tagline: 'Lari setempat perlahan & panaskan sendi!',
    durationSeconds: 45,
    description: 'Mulakan larian setempat dengan rentak santai. Hayun tangan mengikut irama muzik.',
    targetBpm: 120,
  },
  {
    id: 2,
    name: 'Fasa 2: Cabaran Kejiranan Ceria',
    tagline: 'Elak halangan gotong-royong dengan tangkas!',
    durationSeconds: 90,
    description: 'Kawasan gotong-royong bermula! Ikut arahan: Kiri, Kanan, Lompat dan Tunduk.',
    targetBpm: 135,
  },
  {
    id: 3,
    name: 'Fasa 3: Pecutan Gotong-Royong',
    tagline: 'Lari pantas & elak halangan berturutan!',
    durationSeconds: 60,
    description: 'Meningkatkan degupan jantung dan ketangkasan murid dengan rentak cergas!',
    targetBpm: 145,
  },
  {
    id: 4,
    name: 'Fasa 4: Penyejukan & Tahniah',
    tagline: 'Perlahankan rentak & tarik nafas lega.',
    durationSeconds: 35,
    description: 'Jalan setempat perlahan-lahan, turunkan kadar nadi, dan sorak bersama jiran!',
    targetBpm: 100,
  },
];

export const TOTAL_DEFAULT_DURATION = WARMUP_PHASES.reduce(
  (sum, p) => sum + p.durationSeconds,
  0
);

export const SPEED_MULTIPLIERS: Record<SpeedLevel, number> = {
  SANTAI: 0.8,
  BIASA: 1.0,
  CERGAS: 1.25,
};

/**
 * Base speed in units per second along the Z axis
 */
export const BASE_RUN_SPEED = 14; // units/sec

/**
 * Generate a structured sequence of neighborhood obstacles with appropriate spacing
 * for Year 5 primary school warm-up activities.
 */
export function generateObstacleCourse(totalTrackLength: number = 3200): ObstacleData[] {
  const obstacles: ObstacleData[] = [];
  let currentZ = 60; // Start after warmup opening straight

  const templates: Array<{
    type: ActionType;
    lane: -1 | 0 | 1;
    modelType: ObstacleData['modelType'];
    nameBM: string;
    actionBM: string;
    tipBM: string;
  }> = [
    {
      type: 'KIRI',
      lane: 1, // Obstacle is on right, runner must step left
      modelType: 'TONG_SAMPAH',
      nameBM: 'Tong Sampah Gotong-Royong',
      actionBM: 'KIRI!',
      tipBM: 'Langkah ke kiri untuk elak!',
    },
    {
      type: 'LOMPAT',
      lane: 0,
      modelType: 'LOPAK_AIR',
      nameBM: 'Lopak Air Berkilau',
      actionBM: 'LOMPAT!',
      tipBM: 'Lompat dengan kedua-dua kaki!',
    },
    {
      type: 'KANAN',
      lane: -1, // Obstacle is on left, runner must step right
      modelType: 'KERETA_SORONG',
      nameBM: 'Kereta Sorong Pokok Bunga',
      actionBM: 'KANAN!',
      tipBM: 'Langkah ke kanan untuk elak!',
    },
    {
      type: 'TUNDUK',
      lane: 0,
      modelType: 'DAHAN_RENDAH',
      nameBM: 'Dahan Pokok Rendah',
      actionBM: 'TUNDUK!',
      tipBM: 'Bengkokkan lutut & tunduk rendah!',
    },
    {
      type: 'KIRI',
      lane: 0,
      modelType: 'KON_JALAN',
      nameBM: 'Kon Pembaikan Jalan',
      actionBM: 'KIRI!',
      tipBM: 'Pindah ke lorong kiri!',
    },
    {
      type: 'LOMPAT',
      lane: 0,
      modelType: 'LOPAK_AIR',
      nameBM: 'Hos Paip Air Gotong-Royong',
      actionBM: 'LOMPAT!',
      tipBM: 'Lompat melepasi halangan!',
    },
    {
      type: 'KANAN',
      lane: 0,
      modelType: 'TONG_SAMPAH',
      nameBM: 'Pasu Bunga Kejiranan',
      actionBM: 'KANAN!',
      tipBM: 'Pindah ke lorong kanan!',
    },
    {
      type: 'TUNDUK',
      lane: 0,
      modelType: 'DAHAN_RENDAH',
      nameBM: 'Kain Rentang Gotong-Royong',
      actionBM: 'TUNDUK!',
      tipBM: 'Tundukkan kepala melepasi kain rentang!',
    },
  ];

  let index = 0;
  while (currentZ < totalTrackLength - 150) {
    const t = templates[index % templates.length];
    // Spacing: 55 to 75 units gives ~4-5 seconds at base speed, giving Year 5 pupils comfortable reaction time!
    const gap = 55 + (index % 3) * 10;
    currentZ += gap;

    obstacles.push({
      id: `obs_${index}_${Math.round(currentZ)}`,
      type: t.type,
      lane: t.lane,
      zPos: currentZ,
      modelType: t.modelType,
      nameBM: t.nameBM,
      actionBM: t.actionBM,
      tipBM: t.tipBM,
      cleared: false,
    });
    index++;
  }

  return obstacles;
}

/**
 * Calculates current warmup phase based on elapsed seconds
 */
export function getCurrentPhaseIndex(
  elapsedSeconds: number,
  phases: PhaseInfo[] = WARMUP_PHASES
): number {
  let accum = 0;
  for (let i = 0; i < phases.length; i++) {
    accum += phases[i].durationSeconds;
    if (elapsedSeconds < accum) {
      return i;
    }
  }
  return phases.length - 1;
}

/**
 * Calculates estimated physical metrics for a Year 5 student (~11 years old, ~35kg)
 */
export function estimatePhysicalMetrics(elapsedSeconds: number, speedMultiplier: number = 1.0) {
  // Average cadence ~140 steps per minute during warm-up jogging
  const cadencePerMin = 140 * speedMultiplier;
  const steps = Math.round((cadencePerMin / 60) * elapsedSeconds);

  // MET for moderate-to-vigorous child jogging is ~6.5 - 7.5
  // Calories = MET * weight(kg) * 3.5 / 200 * minutes
  const weightKg = 35;
  const met = 7.0 * speedMultiplier;
  const minutes = elapsedSeconds / 60;
  const calories = Math.max(0, parseFloat(((met * weightKg * 3.5) / 200 * minutes).toFixed(1)));

  return { steps, calories };
}

/**
 * Evaluates whether player's action successfully avoided the obstacle
 */
export function evaluateActionSuccess(
  requiredAction: ActionType,
  playerAction: ActionType | null,
  playerLane: number,
  obstacleLane: number
): { success: boolean; scoreDelta: number; feedbackBM: string } {
  if (requiredAction === 'LOMPAT') {
    if (playerAction === 'LOMPAT') {
      return { success: true, scoreDelta: 100, feedbackBM: 'LOMPATAN TERBAIK! (Gaya BoBoiBoy)' };
    }
    return { success: false, scoreDelta: 0, feedbackBM: 'CUBA LOMPAT TINGGI LAGI!' };
  }

  if (requiredAction === 'TUNDUK') {
    if (playerAction === 'TUNDUK') {
      return { success: true, scoreDelta: 100, feedbackBM: 'TUNDUKAN PANTAS! (Laju Macam Ying)' };
    }
    return { success: false, scoreDelta: 0, feedbackBM: 'CUBA TUNDUK RENDAH LAGI!' };
  }

  if (requiredAction === 'KIRI') {
    if (playerLane < obstacleLane || playerAction === 'KIRI') {
      return { success: true, scoreDelta: 100, feedbackBM: 'ELAKKAN KE KIRI SEMPURNA! (Padu Gopal)' };
    }
    return { success: false, scoreDelta: 0, feedbackBM: 'LANGKAH KE KIRI!' };
  }

  if (requiredAction === 'KANAN') {
    if (playerLane > obstacleLane || playerAction === 'KANAN') {
      return { success: true, scoreDelta: 100, feedbackBM: 'ELAKKAN KE KANAN HEBAT! (Hebat Yaya)' };
    }
    return { success: false, scoreDelta: 0, feedbackBM: 'LANGKAH KE KANAN!' };
  }

  return { success: true, scoreDelta: 50, feedbackBM: 'TERUSKAN BERLARI! TERBAIK!' };
}
