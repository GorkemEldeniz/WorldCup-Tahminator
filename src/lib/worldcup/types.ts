export type GroupLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';

export type Stage =
  | 'ROUND_OF_32'
  | 'ROUND_OF_16'
  | 'QUARTER_FINAL'
  | 'SEMI_FINAL'
  | 'FINAL';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  group: GroupLetter;
  flag: string;   // ISO 3166-1 alpha-2 code for flagcdn.com
  crest?: string; // URL override from API (for display)
}

export interface BracketMatch {
  id: string;
  stage: Stage;
  homeTeamId: string | null;
  awayTeamId: string | null;
  winnerId: string | null;
}

export type GroupRankings = Record<GroupLetter, string[]>; // [1st, 2nd, 3rd, 4th] team IDs

export interface SimulationState {
  step: 1 | 2 | 3 | 4 | 5;
  groupRankings: GroupRankings;
  selectedThirds: string[]; // exactly 8 team IDs
  bracket: Record<string, BracketMatch>;
  champion: string | null;
  shareToken: string | null;
}
