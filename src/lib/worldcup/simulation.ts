import type { GroupRankings, SimulationState } from "./types";
import { DEFAULT_RANKINGS } from "./teams";
import { applyWinner, clearDownstream, generateBracket } from "./matching";

function storageKey(userId: string) {
  return `wc2026_simulation_v1_${userId}`;
}

export function createInitialState(): SimulationState {
  return {
    step: 1,
    groupRankings: { ...DEFAULT_RANKINGS } as GroupRankings,
    selectedThirds: [],
    bracket: {},
    champion: null,
    shareToken: null,
  };
}

export function loadFromStorage(userId: string): SimulationState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return null;
    return JSON.parse(raw) as SimulationState;
  } catch {
    return null;
  }
}

export function saveToStorage(state: SimulationState, userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userId), JSON.stringify(state));
}

export function clearStorage(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey(userId));
}

// State transitions
export type SimAction =
  | { type: "REORDER_GROUP"; group: string; teams: string[] }
  | { type: "TOGGLE_THIRD"; teamId: string }
  | { type: "CONFIRM_THIRDS" }
  | { type: "PICK_WINNER"; matchId: string; winnerId: string }
  | { type: "SET_SHARE_TOKEN"; token: string }
  | { type: "RESET" }
  | { type: "LOAD"; state: SimulationState };

export function simReducer(state: SimulationState, action: SimAction): SimulationState {
  switch (action.type) {
    case "REORDER_GROUP": {
      const rankings = { ...state.groupRankings, [action.group]: action.teams } as GroupRankings;
      return { ...state, groupRankings: rankings };
    }

    case "TOGGLE_THIRD": {
      const cur = state.selectedThirds;
      const already = cur.includes(action.teamId);
      if (already) {
        return { ...state, selectedThirds: cur.filter((id) => id !== action.teamId) };
      }
      if (cur.length >= 8) return state; // cap at 8
      return { ...state, selectedThirds: [...cur, action.teamId] };
    }

    case "CONFIRM_THIRDS": {
      if (state.selectedThirds.length !== 8) return state;
      const bracket = generateBracket(state.groupRankings, state.selectedThirds);
      return { ...state, step: 4, bracket };
    }

    case "PICK_WINNER": {
      const { matchId, winnerId } = action;
      const current = state.bracket[matchId];
      if (!current) return state;

      // If picking same winner again, deselect (toggle off) and clear downstream
      if (current.winnerId === winnerId) {
        const cleared = clearDownstream(state.bracket, matchId);
        const updated = { ...cleared, [matchId]: { ...cleared[matchId], winnerId: null } };
        return { ...state, bracket: updated, champion: null };
      }

      // If changing the winner, clear downstream first
      const cleared = current.winnerId
        ? clearDownstream(state.bracket, matchId)
        : state.bracket;

      const next = applyWinner(cleared, matchId, winnerId);

      // Check if the final has been decided
      const champion = next["F01"]?.winnerId ?? null;
      return { ...state, bracket: next, champion, step: champion ? 5 : 4 };
    }

    case "SET_SHARE_TOKEN":
      return { ...state, shareToken: action.token };

    case "RESET":
      return createInitialState();

    case "LOAD":
      return action.state;

    default:
      return state;
  }
}
