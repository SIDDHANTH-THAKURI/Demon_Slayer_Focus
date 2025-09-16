import { BreathingTechnique, TechniqueTheme, RankLevel } from '../types';

export const DEMON_SLAYER_RANKS: Record<RankLevel, { name: string; kanji: string; requiredMastery: number }> = {
  mizunoto: { name: "Mizunoto", kanji: "癸", requiredMastery: 0 },
  mizunoe: { name: "Mizunoe", kanji: "壬", requiredMastery: 100 },
  kanoto: { name: "Kanoto", kanji: "辛", requiredMastery: 250 },
  kanoe: { name: "Kanoe", kanji: "庚", requiredMastery: 500 },
  tsuchinoto: { name: "Tsuchinoto", kanji: "己", requiredMastery: 800 },
  tsuchinoe: { name: "Tsuchinoe", kanji: "戊", requiredMastery: 1200 },
  hinoto: { name: "Hinoto", kanji: "丁", requiredMastery: 1700 },
  hinoe: { name: "Hinoe", kanji: "丙", requiredMastery: 2300 },
  kinoto: { name: "Kinoto", kanji: "乙", requiredMastery: 3000 },
  kinoe: { name: "Kinoe", kanji: "甲", requiredMastery: 4000 },
  hashira: { name: "Hashira", kanji: "柱", requiredMastery: 5000 }
};

export const TECHNIQUE_THEMES: Record<BreathingTechnique, TechniqueTheme> = {
  water: {
    name: "Water Breathing",
    kanji: "水",
    description: "Fluid and adaptable, like flowing water that shapes itself to any container",
    colors: {
      primary: "#1e40af",
      secondary: "#0ea5e9",
      accent: "#67e8f9",
      gradient: "linear-gradient(135deg, #1e40af 0%, #0ea5e9 50%, #67e8f9 100%)",
      text: "#ffffff",
      background: "rgba(30, 64, 175, 0.1)"
    },
    patterns: {
      background: "seigaiha",
      border: "flowing-water",
      particle: "water-droplets"
    },
    effects: {
      animation: "flowing-waves",
      sound: "water-flow.mp3",
      completion: "water-splash",
      breathingPattern: { inhale: 4, hold: 2, exhale: 6 }
    },
    tsuba: {
      style: "circular-waves",
      innerPattern: "concentric-ripples",
      decorativeElements: ["water-drops", "wave-spirals", "flowing-lines"]
    }
  },
  flame: {
    name: "Flame Breathing",
    kanji: "炎",
    description: "Passionate and intense, burning away obstacles with unwavering determination",
    colors: {
      primary: "#dc2626",
      secondary: "#ea580c",
      accent: "#fbbf24",
      gradient: "linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #fbbf24 100%)",
      text: "#ffffff",
      background: "rgba(220, 38, 38, 0.1)"
    },
    patterns: {
      background: "flame-pattern",
      border: "fire-border",
      particle: "flame-sparks"
    },
    effects: {
      animation: "flickering-flames",
      sound: "fire-crackle.mp3",
      completion: "flame-burst",
      breathingPattern: { inhale: 3, hold: 1, exhale: 4 }
    },
    tsuba: {
      style: "flame-guard",
      innerPattern: "fire-spirals",
      decorativeElements: ["flame-tongues", "ember-dots", "heat-waves"]
    }
  },
  thunder: {
    name: "Thunder Breathing",
    kanji: "雷",
    description: "Swift and decisive, striking with the speed and power of lightning",
    colors: {
      primary: "#7c3aed",
      secondary: "#fbbf24",
      accent: "#f3f4f6",
      gradient: "linear-gradient(135deg, #7c3aed 0%, #fbbf24 50%, #f3f4f6 100%)",
      text: "#ffffff",
      background: "rgba(124, 58, 237, 0.1)"
    },
    patterns: {
      background: "lightning-pattern",
      border: "electric-border",
      particle: "lightning-bolts"
    },
    effects: {
      animation: "electric-pulse",
      sound: "thunder-crack.mp3",
      completion: "lightning-strike",
      breathingPattern: { inhale: 2, hold: 1, exhale: 3 }
    },
    tsuba: {
      style: "lightning-guard",
      innerPattern: "electric-zigzag",
      decorativeElements: ["lightning-bolts", "spark-points", "thunder-clouds"]
    }
  },
  insect: {
    name: "Insect Breathing",
    kanji: "蟲",
    description: "Graceful and precise, dancing through challenges like a butterfly",
    colors: {
      primary: "#059669",
      secondary: "#7c3aed",
      accent: "#f472b6",
      gradient: "linear-gradient(135deg, #059669 0%, #7c3aed 50%, #f472b6 100%)",
      text: "#ffffff",
      background: "rgba(5, 150, 105, 0.1)"
    },
    patterns: {
      background: "butterfly-pattern",
      border: "wing-border",
      particle: "poison-mist"
    },
    effects: {
      animation: "flutter-wings",
      sound: "insect-buzz.mp3",
      completion: "poison-burst",
      breathingPattern: { inhale: 3, hold: 2, exhale: 5 }
    },
    tsuba: {
      style: "butterfly-guard",
      innerPattern: "wing-scales",
      decorativeElements: ["butterfly-wings", "poison-drops", "flower-petals"]
    }
  },
  stone: {
    name: "Stone Breathing",
    kanji: "岩",
    description: "Steadfast and unbreakable, enduring like the eternal mountains",
    colors: {
      primary: "#78716c",
      secondary: "#a3a3a3",
      accent: "#fbbf24",
      gradient: "linear-gradient(135deg, #78716c 0%, #a3a3a3 50%, #fbbf24 100%)",
      text: "#ffffff",
      background: "rgba(120, 113, 108, 0.1)"
    },
    patterns: {
      background: "rock-pattern",
      border: "stone-border",
      particle: "rock-debris"
    },
    effects: {
      animation: "earth-tremor",
      sound: "stone-crash.mp3",
      completion: "boulder-smash",
      breathingPattern: { inhale: 6, hold: 4, exhale: 8 }
    },
    tsuba: {
      style: "mountain-guard",
      innerPattern: "rock-layers",
      decorativeElements: ["stone-chunks", "mountain-peaks", "crystal-shards"]
    }
  },
  wind: {
    name: "Wind Breathing",
    kanji: "風",
    description: "Free and untamed, cutting through obstacles like a fierce gale",
    colors: {
      primary: "#10b981",
      secondary: "#34d399",
      accent: "#f0fdf4",
      gradient: "linear-gradient(135deg, #10b981 0%, #34d399 50%, #f0fdf4 100%)",
      text: "#ffffff",
      background: "rgba(16, 185, 129, 0.1)"
    },
    patterns: {
      background: "wind-swirl",
      border: "gust-border",
      particle: "wind-leaves"
    },
    effects: {
      animation: "swirling-wind",
      sound: "wind-howl.mp3",
      completion: "tornado-burst",
      breathingPattern: { inhale: 4, hold: 1, exhale: 5 }
    },
    tsuba: {
      style: "cyclone-guard",
      innerPattern: "wind-spirals",
      decorativeElements: ["wind-blades", "leaf-swirls", "air-currents"]
    }
  },
  mist: {
    name: "Mist Breathing",
    kanji: "霞",
    description: "Elusive and mysterious, obscuring truth like morning fog",
    colors: {
      primary: "#6b7280",
      secondary: "#d1d5db",
      accent: "#f9fafb",
      gradient: "linear-gradient(135deg, #6b7280 0%, #d1d5db 50%, #f9fafb 100%)",
      text: "#374151",
      background: "rgba(107, 114, 128, 0.1)"
    },
    patterns: {
      background: "mist-pattern",
      border: "fog-border",
      particle: "mist-particles"
    },
    effects: {
      animation: "drifting-mist",
      sound: "mist-whisper.mp3",
      completion: "fog-disperse",
      breathingPattern: { inhale: 5, hold: 3, exhale: 7 }
    },
    tsuba: {
      style: "cloud-guard",
      innerPattern: "mist-swirls",
      decorativeElements: ["fog-wisps", "cloud-layers", "vapor-trails"]
    }
  },
  serpent: {
    name: "Serpent Breathing",
    kanji: "蛇",
    description: "Flexible and cunning, striking with the precision of a viper",
    colors: {
      primary: "#7c2d12",
      secondary: "#059669",
      accent: "#fbbf24",
      gradient: "linear-gradient(135deg, #7c2d12 0%, #059669 50%, #fbbf24 100%)",
      text: "#ffffff",
      background: "rgba(124, 45, 18, 0.1)"
    },
    patterns: {
      background: "snake-scale",
      border: "serpent-border",
      particle: "venom-drops"
    },
    effects: {
      animation: "serpentine-flow",
      sound: "snake-hiss.mp3",
      completion: "venom-strike",
      breathingPattern: { inhale: 4, hold: 3, exhale: 6 }
    },
    tsuba: {
      style: "serpent-guard",
      innerPattern: "scale-pattern",
      decorativeElements: ["snake-coils", "venom-fangs", "scale-diamonds"]
    }
  },
  flower: {
    name: "Flower Breathing",
    kanji: "花",
    description: "Beautiful and graceful, blooming with elegant strength",
    colors: {
      primary: "#ec4899",
      secondary: "#f472b6",
      accent: "#fdf2f8",
      gradient: "linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fdf2f8 100%)",
      text: "#ffffff",
      background: "rgba(236, 72, 153, 0.1)"
    },
    patterns: {
      background: "sakura-pattern",
      border: "petal-border",
      particle: "flower-petals"
    },
    effects: {
      animation: "blooming-flowers",
      sound: "petal-fall.mp3",
      completion: "petal-storm",
      breathingPattern: { inhale: 4, hold: 2, exhale: 6 }
    },
    tsuba: {
      style: "blossom-guard",
      innerPattern: "petal-mandala",
      decorativeElements: ["cherry-blossoms", "petal-swirls", "flower-buds"]
    }
  },
  sound: {
    name: "Sound Breathing",
    kanji: "音",
    description: "Explosive and rhythmic, resonating with thunderous power",
    colors: {
      primary: "#f59e0b",
      secondary: "#fbbf24",
      accent: "#fef3c7",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fef3c7 100%)",
      text: "#92400e",
      background: "rgba(245, 158, 11, 0.1)"
    },
    patterns: {
      background: "sound-wave",
      border: "vibration-border",
      particle: "sound-rings"
    },
    effects: {
      animation: "sound-pulse",
      sound: "explosive-beat.mp3",
      completion: "sonic-boom",
      breathingPattern: { inhale: 3, hold: 1, exhale: 4 }
    },
    tsuba: {
      style: "sound-guard",
      innerPattern: "wave-rings",
      decorativeElements: ["sound-waves", "explosion-bursts", "rhythm-lines"]
    }
  },
  love: {
    name: "Love Breathing",
    kanji: "恋",
    description: "Passionate and flexible, bending without breaking like the heart",
    colors: {
      primary: "#be185d",
      secondary: "#f472b6",
      accent: "#fdf2f8",
      gradient: "linear-gradient(135deg, #be185d 0%, #f472b6 50%, #fdf2f8 100%)",
      text: "#ffffff",
      background: "rgba(190, 24, 93, 0.1)"
    },
    patterns: {
      background: "heart-pattern",
      border: "love-border",
      particle: "heart-sparkles"
    },
    effects: {
      animation: "heartbeat-pulse",
      sound: "heartbeat.mp3",
      completion: "love-explosion",
      breathingPattern: { inhale: 4, hold: 2, exhale: 6 }
    },
    tsuba: {
      style: "heart-guard",
      innerPattern: "love-spirals",
      decorativeElements: ["heart-shapes", "love-ribbons", "passion-flames"]
    }
  },
  sun: {
    name: "Sun Breathing",
    kanji: "日",
    description: "The original and most powerful, burning with the intensity of the sun",
    colors: {
      primary: "#dc2626",
      secondary: "#f59e0b",
      accent: "#fef3c7",
      gradient: "linear-gradient(135deg, #dc2626 0%, #f59e0b 50%, #fef3c7 100%)",
      text: "#ffffff",
      background: "rgba(220, 38, 38, 0.1)"
    },
    patterns: {
      background: "sun-ray",
      border: "solar-border",
      particle: "sun-flares"
    },
    effects: {
      animation: "solar-flare",
      sound: "solar-wind.mp3",
      completion: "solar-explosion",
      breathingPattern: { inhale: 4, hold: 4, exhale: 8 }
    },
    tsuba: {
      style: "sun-guard",
      innerPattern: "solar-rays",
      decorativeElements: ["sun-flames", "solar-corona", "light-beams"]
    }
  }
};

// Helper function to get technique theme
export const getTechniqueTheme = (technique: BreathingTechnique): TechniqueTheme => {
  return TECHNIQUE_THEMES[technique];
};

// Helper function to get all technique options for selection
export const getAllTechniques = (): Array<{ value: BreathingTechnique; label: string; kanji: string; description: string }> => {
  return Object.entries(TECHNIQUE_THEMES).map(([key, theme]) => ({
    value: key as BreathingTechnique,
    label: theme.name,
    kanji: theme.kanji,
    description: theme.description
  }));
};

// Helper function to calculate rank based on mastery points
export const calculateRank = (masteryPoints: number): RankLevel => {
  const ranks = Object.entries(DEMON_SLAYER_RANKS).reverse();
  for (const [rank, data] of ranks) {
    if (masteryPoints >= data.requiredMastery) {
      return rank as RankLevel;
    }
  }
  return 'mizunoto';
};

// Helper function to get rank info
export const getRankInfo = (rank: RankLevel) => {
  return DEMON_SLAYER_RANKS[rank];
};

// Helper function to calculate mastery points from task completion
export const calculateMasteryPoints = (
  completedTasks: number,
  totalFocusTime: number, // in minutes
  averageCompletion: number // percentage
): number => {
  const taskPoints = completedTasks * 10;
  const timePoints = Math.floor(totalFocusTime / 25) * 5; // 5 points per 25-minute session
  const completionBonus = Math.floor(averageCompletion / 10) * 2; // Bonus for high completion rates
  return taskPoints + timePoints + completionBonus;
};

// Helper function to get next rank requirements
export const getNextRankRequirement = (currentRank: RankLevel): { nextRank: RankLevel | null; pointsNeeded: number } => {
  const ranks = Object.keys(DEMON_SLAYER_RANKS) as RankLevel[];
  const currentIndex = ranks.indexOf(currentRank);
  
  if (currentIndex === ranks.length - 1) {
    return { nextRank: null, pointsNeeded: 0 }; // Already at highest rank
  }
  
  const nextRank = ranks[currentIndex + 1];
  const currentPoints = DEMON_SLAYER_RANKS[currentRank].requiredMastery;
  const nextPoints = DEMON_SLAYER_RANKS[nextRank].requiredMastery;
  
  return { nextRank, pointsNeeded: nextPoints - currentPoints };
};