"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { TEAM_MAP as STATIC_MAP, flagUrl, GROUP_LETTERS } from "./teams";
import type { Team, GroupLetter } from "./types";

export interface TeamsContextValue {
  teamMap: Record<string, Team>;
  groupTeams: Record<string, Team[]>; // sorted by current live standings
  loaded: boolean;
}

const TeamsContext = createContext<TeamsContextValue>({
  teamMap: STATIC_MAP,
  groupTeams: {},
  loaded: false,
});

export function useTeams() {
  return useContext(TeamsContext);
}

export function TeamsProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<TeamsContextValue>({
    teamMap: STATIC_MAP,
    groupTeams: {},
    loaded: false,
  });

  useEffect(() => {
    fetch("/api/worldcup/groups")
      .then((r) => r.json())
      .then((data: { groups?: Record<string, { tla: string; name: string; shortName: string; crest: string }[]>; error?: string }) => {
        if (data.error || !data.groups) {
          setValue((v) => ({ ...v, loaded: true }));
          return;
        }

        const newTeamMap: Record<string, Team> = { ...STATIC_MAP };
        const groupTeams: Record<string, Team[]> = {};

        for (const letter of GROUP_LETTERS) {
          const apiTeams = data.groups[letter];
          if (!apiTeams) continue;

          const teams: Team[] = apiTeams.map((t) => {
            const s = STATIC_MAP[t.tla]; // static entry (for Turkish names)
            return {
              id: t.tla,
              name: s?.name ?? t.name,
              shortName: s?.shortName ?? t.shortName,
              group: letter as GroupLetter,
              flag: s?.flag ?? "",
              crest: t.crest,
            };
          });

          teams.forEach((t) => { newTeamMap[t.id] = t; });
          groupTeams[letter] = teams;
        }

        setValue({ teamMap: newTeamMap, groupTeams, loaded: true });
      })
      .catch(() => setValue((v) => ({ ...v, loaded: true })));
  }, []);

  return <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>;
}

// Always prefer flagcdn.com (CORS-safe PNG) over API crests (SVG, no CORS headers)
export function teamImgUrl(team: Team, size: 40 | 80 = 40): string {
  if (team.flag) return flagUrl(team.flag, size);
  if (team.crest) return team.crest;
  return "";
}
