"use client";

import { GROUP_LETTERS } from "@/lib/worldcup/teams";
import { useTeams, teamImgUrl } from "@/lib/worldcup/TeamContext";
import type { GroupRankings } from "@/lib/worldcup/types";

interface Props {
  groupRankings: GroupRankings;
  selectedThirds: string[];
  onToggle: (teamId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function BestThirdPicker({ groupRankings, selectedThirds, onToggle, onBack, onNext }: Props) {
  const { teamMap } = useTeams();

  const thirds = GROUP_LETTERS.map((g) => ({
    group: g,
    teamId: groupRankings[g]?.[2],
  }));

  const selected = selectedThirds.length;
  const canProceed = selected === 8;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-ink-900">En İyi 8 Grup Üçüncüsü</h2>
        <p className="mt-1 text-sm text-ink-600">
          12 grup üçüncüsü arasından eleme turuna geçecek <strong>8 takımı</strong> seç
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between rounded-xl bg-gold-50 border border-gold-400 px-4 py-3">
          <span className="text-sm font-semibold text-gold-700">Seçilen takım sayısı</span>
          <span className={`text-2xl font-extrabold ${canProceed ? "text-pitch-500" : "text-gold-500"}`}>
            {selected} / 8
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {thirds.map(({ group, teamId }) => {
            if (!teamId) return null;
            const team = teamMap[teamId];
            const isSelected = selectedThirds.includes(teamId);
            const isFull = selected >= 8 && !isSelected;

            return (
              <button
                key={teamId}
                onClick={() => !isFull && onToggle(teamId)}
                disabled={isFull}
                className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all
                  ${isSelected
                    ? "border-pitch-500 bg-pitch-50 shadow-card"
                    : isFull
                    ? "border-line-200 bg-surface-soft opacity-40 cursor-not-allowed"
                    : "border-line-200 bg-surface hover:border-pitch-400 hover:shadow-card cursor-pointer"
                  }`}
              >
                <div className="flex flex-col items-center gap-1 min-w-fit">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-ink-400">
                    {group}
                  </span>
                  {team ? (
                    <img
                      src={teamImgUrl(team, 40)}
                      alt={team.name}
                      className="h-6 w-9 rounded-sm object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-6 w-9 rounded-sm bg-line-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-semibold text-ink-900">
                    {team?.shortName ?? teamId}
                  </div>
                  {isSelected && (
                    <div className="text-xs font-bold text-pitch-500 mt-0.5">✓ Seçildi</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-xl border border-line-200 bg-surface px-6 py-3 text-sm font-semibold text-ink-600 transition-colors hover:bg-surface-soft"
        >
          ← Geri
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`rounded-xl px-8 py-3 text-base font-bold text-white shadow-card transition-colors
            ${canProceed ? "bg-pitch-500 hover:bg-pitch-600" : "bg-line-200 text-ink-400 cursor-not-allowed"}`}
        >
          Eşleşmeleri Oluştur →
        </button>
      </div>
    </div>
  );
}
