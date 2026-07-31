export enum AppSection {
  COUNTDOWN = 'COUNTDOWN',
  UNLOCK = 'UNLOCK',
  REASONS = 'REASONS',
  SONGS = 'SONGS',
  LETTER = 'LETTER',
  FINALE = 'FINALE'
}

export interface LoveReason {
  id: number;
  title: string;
  reason: string;
  flowerType: 'rose' | 'sakura' | 'tulip' | 'peony' | 'lily' | 'daisy' | 'orchid' | 'sunflower' | 'lotus' | 'jasmine';
  flowerColor: string;
  isUnlocked?: boolean;
}

export interface RomanticSong {
  id: string;
  title: string;
  artist: string;
  note: string;
  youtubeUrl: string;
  coverGradient: string;
}

export interface AppState {
  section: AppSection;
  nickname: string;
  isMusicPlaying: boolean;
  unlockedReasons: number[];
  reasons: LoveReason[];
  letterText: string;
  countdownTargetDate: string; // ISO date string
}
