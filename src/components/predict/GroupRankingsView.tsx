"use client";

import { useTeams, teamImgUrl } from "@/lib/worldcup/TeamContext";
import { GROUP_LETTERS } from "@/lib/worldcup/teams";

const POSITION_LABELS = ["1.", "2.", "3.", "4."];
const POSITION_COLORS = [
  "bg-pitch-500 text-white",
  "bg-pitch-400/20 text-pitch-600",
  "bg-gold-400/20 text-gold-700",
  "bg-line-200 text-ink-400",
];

interface Props {
  groupRankings: Record<string, string[]>;
}

export function GroupRankingsView({ groupRankings }: Props) {
  const { teamMap } = useTeams();

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {GROUP_LETTERS.map((letter) => {
        const teamIds: string[] = groupRankings[letter] ?? [];
        return (
          <div key={letter} className="rounded-xl border border-line-200 bg-surface overflow-hidden">
            <div className="bg-pitch-700 px-3 py-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-white">
                Grup {letter}
              </span>
            </div>
            <div className="divide-y divide-line-200/60">
              {teamIds.map((id, i) => {
                const team = teamMap[id];
                if (!team) return null;
                return (
                  <div key={id} className="flex items-center gap-2.5 px-3 py-2">
                    <span
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold ${POSITION_COLORS[i]}`}
                    >
                      {POSITION_LABELS[i]}
                    </span>
                    <img
                      src={teamImgUrl(team, 40)}
                      alt={team.name}
                      className="h-4 w-6 rounded-sm object-cover flex-shrink-0"
                    />
                    <span className="text-xs font-semibold text-ink-800 truncate">{team.shortName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
