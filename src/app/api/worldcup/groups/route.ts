import { NextResponse } from "next/server";
import { footballDataGet } from "@/lib/football-data/client";

const COMPETITION = process.env.FOOTBALL_DATA_COMPETITION_CODE ?? "WC";
const SEASON = Number(process.env.FOOTBALL_DATA_SEASON ?? 2026);

interface ApiTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

interface ApiMatch {
  group: string | null;
  stage: string;
  status: string;
  homeTeam: ApiTeam;
  awayTeam: ApiTeam;
  score: {
    fullTime: { home: number | null; away: number | null };
  };
}

interface StandingEntry {
  tla: string;
  name: string;
  shortName: string;
  crest: string;
  pts: number;
  gd: number;
  gf: number;
}

export async function GET() {
  try {
    const data = await footballDataGet<{ matches: ApiMatch[] }>(
      `/competitions/${COMPETITION}/matches`,
      { season: SEASON, stage: "GROUP_STAGE" }
    );

    // Build per-group team registry and compute standings from finished matches
    const registry: Record<string, Record<string, StandingEntry>> = {};

    for (const m of data.matches) {
      const groupCode = m.group;
      if (!groupCode) continue;
      const letter = groupCode.replace("GROUP_", "");

      if (!registry[letter]) registry[letter] = {};

      for (const side of ["homeTeam", "awayTeam"] as const) {
        const t = m[side];
        if (t.id && !registry[letter][t.tla]) {
          registry[letter][t.tla] = {
            tla: t.tla,
            name: t.name,
            shortName: t.shortName || t.tla,
            crest: t.crest,
            pts: 0, gd: 0, gf: 0,
          };
        }
      }

      // Accumulate points / goals only for finished matches
      if (m.status !== "FINISHED") continue;
      const hg = m.score.fullTime.home ?? 0;
      const ag = m.score.fullTime.away ?? 0;
      const hEntry = registry[letter][m.homeTeam.tla];
      const aEntry = registry[letter][m.awayTeam.tla];
      if (!hEntry || !aEntry) continue;

      hEntry.gf += hg; hEntry.gd += hg - ag;
      aEntry.gf += ag; aEntry.gd += ag - hg;

      if (hg > ag)      { hEntry.pts += 3; }
      else if (hg < ag) { aEntry.pts += 3; }
      else              { hEntry.pts += 1; aEntry.pts += 1; }
    }

    // Sort each group: pts → gd → gf → name
    const groups: Record<string, { tla: string; name: string; shortName: string; crest: string }[]> = {};
    for (const [letter, teams] of Object.entries(registry)) {
      groups[letter] = Object.values(teams)
        .sort((a, b) =>
          b.pts - a.pts ||
          b.gd  - a.gd  ||
          b.gf  - a.gf  ||
          a.name.localeCompare(b.name)
        )
        .map(({ tla, name, shortName, crest }) => ({ tla, name, shortName, crest }));
    }

    return NextResponse.json({ groups }, {
      headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate=60" },
    });
  } catch (err) {
    console.error("Failed to fetch WC groups:", err);
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}
