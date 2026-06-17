"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { StepIndicator } from "@/components/predict/StepIndicator";
import { GroupStage } from "@/components/predict/GroupStage";
import { BestThirdPicker } from "@/components/predict/BestThirdPicker";
import { BracketTree } from "@/components/predict/BracketTree";
import { SharePanel } from "@/components/predict/SharePanel";
import { TeamsProvider, useTeams } from "@/lib/worldcup/TeamContext";
import { createClient } from "@/lib/supabase/client";
import {
  createInitialState,
  clearStorage,
  loadFromStorage,
  saveToStorage,
  simReducer,
} from "@/lib/worldcup/simulation";
import type { GroupRankings, SimulationState } from "@/lib/worldcup/types";

function PredictWizard() {
  const [state, dispatch] = useReducer(simReducer, undefined, createInitialState);
  const { groupTeams, loaded } = useTeams();
  const [userId, setUserId] = useState<string | null>(null);
  const liveApplied = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSaving = useRef(false);

  // Resolve current user → localStorage → DB fallback
  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(async ({ data }) => {
        const uid = data.user?.id ?? null;
        setUserId(uid);
        if (!uid) return;

        const saved = loadFromStorage(uid);
        if (saved) {
          dispatch({ type: "LOAD", state: saved });
          return;
        }

        // No localStorage → try to restore from DB
        try {
          const res = await fetch("/api/simulations/mine");
          if (res.ok) {
            const d = await res.json();
            const dbState: SimulationState = {
              step: d.step,
              groupRankings: d.groupRankings,
              selectedThirds: d.selectedThirds,
              bracket: d.bracket,
              champion: d.champion,
              shareToken: d.shareToken,
            };
            dispatch({ type: "LOAD", state: dbState });
            saveToStorage(dbState, uid);
          }
        } catch {
          // No previous simulation → start fresh (do nothing)
        }
      });
  }, []);

  // Apply live API group rankings once (only when user is at step 1)
  useEffect(() => {
    if (!loaded || !userId || Object.keys(groupTeams).length === 0 || liveApplied.current) return;
    liveApplied.current = true;
    const saved = loadFromStorage(userId);
    if (saved && saved.step > 1) return;
    const liveRankings: Record<string, string[]> = {};
    for (const [letter, teams] of Object.entries(groupTeams)) {
      liveRankings[letter] = teams.map((t) => t.id);
    }
    dispatch({
      type: "LOAD",
      state: { ...(saved ?? createInitialState()), groupRankings: liveRankings as GroupRankings },
    });
  }, [groupTeams, loaded, userId]);

  // Persist every state change to localStorage (scoped to user)
  useEffect(() => {
    if (userId) saveToStorage(state, userId);
  }, [state, userId]);

  async function persistToDb(s: typeof state) {
    if (isSaving.current) return;
    isSaving.current = true;
    try {
      const body = {
        groupRankings: s.groupRankings,
        selectedThirds: s.selectedThirds,
        bracket: s.bracket,
        champion: s.champion,
      };
      if (s.shareToken) {
        await fetch(`/api/simulations/${s.shareToken}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        const res = await fetch("/api/simulations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const d = await res.json();
        if (d.shareToken) dispatch({ type: "SET_SHARE_TOKEN", token: d.shareToken });
      }
    } finally {
      isSaving.current = false;
    }
  }

  // Auto-save to DB when step 5 is reached or bracket changes there
  useEffect(() => {
    if (state.step !== 5 || !state.champion) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persistToDb(state), 800);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [state.champion, state.bracket, state.step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Navigation handlers ────────────────────────────────────────────────────

  function handleNavigate(targetStep: number) {
    if (targetStep >= state.step) return;
    if (targetStep === 1) {
      // Groups changed → thirds + bracket + champion must be redone
      dispatch({ type: "LOAD", state: { ...state, step: 1, selectedThirds: [], bracket: {}, champion: null } });
    } else if (targetStep === 2) {
      // Thirds re-selection → bracket + champion must be redone
      dispatch({ type: "LOAD", state: { ...state, step: 2, bracket: {}, champion: null } });
    } else if (targetStep === 4) {
      // Return to bracket → only champion reset (match edits clear downstream themselves)
      dispatch({ type: "LOAD", state: { ...state, step: 4, champion: null } });
    }
  }

  function handleEditGroups() {
    dispatch({ type: "LOAD", state: { ...state, step: 1, selectedThirds: [], bracket: {}, champion: null } });
  }

  function handleEditBracket() {
    dispatch({ type: "LOAD", state: { ...state, step: 4, champion: null } });
  }

  function handleReset() {
    if (userId) clearStorage(userId);
    dispatch({ type: "RESET" });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <StepIndicator current={state.step} onNavigate={handleNavigate} />

      <div className="mt-8">
        {state.step === 1 && (
          <GroupStage
            groupRankings={state.groupRankings as GroupRankings}
            onReorder={(group, teams) => dispatch({ type: "REORDER_GROUP", group, teams })}
            onNext={() =>
              dispatch({ type: "LOAD", state: { ...state, step: 2, selectedThirds: [] } })
            }
          />
        )}

        {state.step === 2 && (
          <BestThirdPicker
            groupRankings={state.groupRankings as GroupRankings}
            selectedThirds={state.selectedThirds}
            onToggle={(teamId) => dispatch({ type: "TOGGLE_THIRD", teamId })}
            onBack={() =>
              dispatch({ type: "LOAD", state: { ...state, step: 1, selectedThirds: [] } })
            }
            onNext={() => dispatch({ type: "CONFIRM_THIRDS" })}
          />
        )}

        {state.step === 4 && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-ink-900">Eleme Turu Ağacı</h2>
              <p className="mt-1 text-sm text-ink-600">
                Her maçta kazanacağını düşündüğün takımın adına tıkla
              </p>
            </div>
            <BracketTree
              bracket={state.bracket}
              onPick={(matchId, winnerId) =>
                dispatch({ type: "PICK_WINNER", matchId, winnerId })
              }
            />
            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  dispatch({ type: "LOAD", state: { ...state, step: 2, bracket: {}, champion: null } })
                }
                className="rounded-xl border border-line-200 bg-surface px-6 py-3 text-sm font-semibold text-ink-600 transition-colors hover:bg-surface-soft"
              >
                ← Geri
              </button>
              {!state.champion && (
                <p className="text-sm text-ink-400">
                  Finali oynayarak şampiyonu belirle
                </p>
              )}
            </div>
          </div>
        )}

        {state.step === 5 && (
          <SharePanel
            bracket={state.bracket}
            champion={state.champion}
            shareToken={state.shareToken}
            onReset={handleReset}
            onEditGroups={handleEditGroups}
            onEditBracket={handleEditBracket}
          />
        )}
      </div>
    </div>
  );
}

export default function PredictPage() {
  return (
    <TeamsProvider>
      <PredictWizard />
    </TeamsProvider>
  );
}
