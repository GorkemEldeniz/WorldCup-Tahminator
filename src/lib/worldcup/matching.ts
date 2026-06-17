import type { BracketMatch, GroupRankings, Stage } from "./types";

// ---------------------------------------------------------------------------
// R32 Bracket layout for 2026 FIFA World Cup (48 teams, 12 groups)
//
// Structure:
//   - 8 group leaders (A-H) vs 8 best thirds  → Match M01–M08
//   - 4 group leaders (I-L) vs runners-up      → Match M09–M12
//   - 8 runners-up vs runners-up               → Match M13–M16
//
// R16: winners of (M01,M02)→R1, (M03,M04)→R2, (M05,M06)→R3, (M07,M08)→R4
//       (M09,M10)→R5, (M11,M12)→R6, (M13,M14)→R7, (M15,M16)→R8
// QF:  (R1,R2)→Q1, (R3,R4)→Q2, (R5,R6)→Q3, (R7,R8)→Q4
// SF:  (Q1,Q2)→S1, (Q3,Q4)→S2
// Final: S1 vs S2
// ---------------------------------------------------------------------------

export interface SlotAssignment {
  matchId: string;
  homeTeamId: string;
  awayTeamId: string;
}

// Assigns the 8 selected best-thirds to slots M01–M08 in group alphabetical order.
// FIFA's official 495-combination lookup table governs the exact cross-group
// restrictions; here we use a simplified ordered assignment as a first pass.
function assignThirds(selectedThirds: string[], leaders: string[]): Array<{ home: string; away: string }> {
  const sorted = [...selectedThirds].sort(); // deterministic ordering
  return leaders.slice(0, 8).map((leader, i) => ({
    home: leader,
    away: sorted[i] ?? "TBD",
  }));
}

export function generateBracket(
  groupRankings: GroupRankings,
  selectedThirds: string[]
): Record<string, BracketMatch> {
  const gl = "ABCDEFGHIJKL".split("") as Array<keyof GroupRankings>;

  const leaders = gl.map((g) => groupRankings[g]?.[0] ?? "TBD");   // 12 group leaders
  const runners = gl.map((g) => groupRankings[g]?.[1] ?? "TBD");   // 12 runners-up

  // Seeded leaders (A-H) vs best thirds
  const seededLeaders = leaders.slice(0, 8);
  const unseededLeaders = leaders.slice(8);   // I, J, K, L

  // Thirds sorted by group letter
  const thirds = assignThirds(selectedThirds, seededLeaders);

  // 8 runners-up cross-matches: A2vB2, C2vD2, E2vF2, G2vH2, I2vJ2, K2vL2, then 2 more
  const runnerPairs: Array<[string, string]> = [
    [runners[0], runners[1]],   // A2 vs B2 → M13
    [runners[2], runners[3]],   // C2 vs D2 → M14
    [runners[4], runners[5]],   // E2 vs F2 → M15
    [runners[6], runners[7]],   // G2 vs H2 → M16
  ];

  // Unseeded leaders vs runners-up from later groups
  const unseededPairs: Array<[string, string]> = [
    [unseededLeaders[0], runners[8]],   // I1 vs I2 → M09
    [unseededLeaders[1], runners[9]],   // J1 vs J2 → M10
    [unseededLeaders[2], runners[10]],  // K1 vs K2 → M11
    [unseededLeaders[3], runners[11]],  // L1 vs L2 → M12
  ];

  const matches: Record<string, BracketMatch> = {};

  function m(id: string, stage: Stage, home: string, away: string): void {
    matches[id] = { id, stage, homeTeamId: home, awayTeamId: away, winnerId: null };
  }
  function empty(id: string, stage: Stage): void {
    matches[id] = { id, stage, homeTeamId: null, awayTeamId: null, winnerId: null };
  }

  // R32
  thirds.forEach(({ home, away }, i) => m(`M${String(i + 1).padStart(2, "0")}`, "ROUND_OF_32", home, away));
  unseededPairs.forEach(([home, away], i) => m(`M${String(i + 9).padStart(2, "0")}`, "ROUND_OF_32", home, away));
  runnerPairs.forEach(([home, away], i) => m(`M${String(i + 13).padStart(2, "0")}`, "ROUND_OF_32", home, away));

  // R16 — filled when R32 matches are decided
  for (let i = 1; i <= 8; i++) empty(`R${String(i).padStart(2, "0")}`, "ROUND_OF_16");
  // QF
  for (let i = 1; i <= 4; i++) empty(`Q${String(i).padStart(2, "0")}`, "QUARTER_FINAL");
  // SF
  empty("S01", "SEMI_FINAL");
  empty("S02", "SEMI_FINAL");
  // Final
  empty("F01", "FINAL");

  return matches;
}

// Map that defines which later matches are fed by a given match's winner.
// home/away determines which slot (home or away) the winner fills.
export const FEED_MAP: Record<string, { nextId: string; slot: "home" | "away" }> = {
  M01: { nextId: "R01", slot: "home" }, M02: { nextId: "R01", slot: "away" },
  M03: { nextId: "R02", slot: "home" }, M04: { nextId: "R02", slot: "away" },
  M05: { nextId: "R03", slot: "home" }, M06: { nextId: "R03", slot: "away" },
  M07: { nextId: "R04", slot: "home" }, M08: { nextId: "R04", slot: "away" },
  M09: { nextId: "R05", slot: "home" }, M10: { nextId: "R05", slot: "away" },
  M11: { nextId: "R06", slot: "home" }, M12: { nextId: "R06", slot: "away" },
  M13: { nextId: "R07", slot: "home" }, M14: { nextId: "R07", slot: "away" },
  M15: { nextId: "R08", slot: "home" }, M16: { nextId: "R08", slot: "away" },
  R01: { nextId: "Q01", slot: "home" }, R02: { nextId: "Q01", slot: "away" },
  R03: { nextId: "Q02", slot: "home" }, R04: { nextId: "Q02", slot: "away" },
  R05: { nextId: "Q03", slot: "home" }, R06: { nextId: "Q03", slot: "away" },
  R07: { nextId: "Q04", slot: "home" }, R08: { nextId: "Q04", slot: "away" },
  Q01: { nextId: "S01", slot: "home" }, Q02: { nextId: "S01", slot: "away" },
  Q03: { nextId: "S02", slot: "home" }, Q04: { nextId: "S02", slot: "away" },
  S01: { nextId: "F01", slot: "home" }, S02: { nextId: "F01", slot: "away" },
};

export function applyWinner(
  bracket: Record<string, BracketMatch>,
  matchId: string,
  winnerId: string
): Record<string, BracketMatch> {
  const next = FEED_MAP[matchId];
  const updated: Record<string, BracketMatch> = {
    ...bracket,
    [matchId]: { ...bracket[matchId], winnerId },
  };

  if (next) {
    const nextMatch = { ...updated[next.nextId] };
    if (next.slot === "home") nextMatch.homeTeamId = winnerId;
    else nextMatch.awayTeamId = winnerId;
    updated[next.nextId] = nextMatch;
  }

  return updated;
}

// When a winner is changed for a match, we must clear all downstream winners
// so the user can re-pick consistently.
export function clearDownstream(
  bracket: Record<string, BracketMatch>,
  matchId: string
): Record<string, BracketMatch> {
  const updated = { ...bracket };
  let current: string | undefined = matchId;

  while (current && FEED_MAP[current]) {
    const { nextId, slot }: { nextId: string; slot: "home" | "away" } = FEED_MAP[current];
    const next = { ...updated[nextId] };
    // Clear winner and the slot that this match fed
    if (slot === "home") next.homeTeamId = null;
    else next.awayTeamId = null;
    next.winnerId = null;
    updated[nextId] = next;
    current = nextId;
  }
  return updated;
}
