import type { Team } from "./types";

// 2026 FIFA World Cup — real 48 teams, real 12 groups (A–L)
// Groups sourced from football-data.org /competitions/WC/matches?stage=GROUP_STAGE
// Initial ordering reflects group draw seeding; live standings come from the API.
// flag = ISO 3166-1 alpha-2 for flagcdn.com/w40/{flag}.png
export const TEAMS: Team[] = [
  // ── Group A ──────────────────────────────────────────────────────────────
  { id: "MEX", name: "Meksika",           shortName: "Meksika",     group: "A", flag: "mx" },
  { id: "RSA", name: "Güney Afrika",      shortName: "G.Afrika",    group: "A", flag: "za" },
  { id: "KOR", name: "Güney Kore",        shortName: "G.Kore",      group: "A", flag: "kr" },
  { id: "CZE", name: "Çekya",             shortName: "Çekya",       group: "A", flag: "cz" },
  // ── Group B ──────────────────────────────────────────────────────────────
  { id: "CAN", name: "Kanada",            shortName: "Kanada",      group: "B", flag: "ca" },
  { id: "BIH", name: "Bosna Hersek",      shortName: "Bosna H.",    group: "B", flag: "ba" },
  { id: "QAT", name: "Katar",             shortName: "Katar",       group: "B", flag: "qa" },
  { id: "SUI", name: "İsviçre",           shortName: "İsviçre",     group: "B", flag: "ch" },
  // ── Group C ──────────────────────────────────────────────────────────────
  { id: "BRA", name: "Brezilya",          shortName: "Brezilya",    group: "C", flag: "br" },
  { id: "MAR", name: "Fas",               shortName: "Fas",         group: "C", flag: "ma" },
  { id: "HAI", name: "Haiti",             shortName: "Haiti",       group: "C", flag: "ht" },
  { id: "SCO", name: "İskoçya",           shortName: "İskoçya",     group: "C", flag: "gb-sct" },
  // ── Group D ──────────────────────────────────────────────────────────────
  { id: "USA", name: "ABD",               shortName: "ABD",         group: "D", flag: "us" },
  { id: "PAR", name: "Paraguay",          shortName: "Paraguay",    group: "D", flag: "py" },
  { id: "AUS", name: "Avustralya",        shortName: "Avustralya",  group: "D", flag: "au" },
  { id: "TUR", name: "Türkiye",           shortName: "Türkiye",     group: "D", flag: "tr" },
  // ── Group E ──────────────────────────────────────────────────────────────
  { id: "GER", name: "Almanya",           shortName: "Almanya",     group: "E", flag: "de" },
  { id: "CUW", name: "Curaçao",           shortName: "Curaçao",     group: "E", flag: "cw" },
  { id: "CIV", name: "Fildişi Sahili",    shortName: "Fildişi S.",  group: "E", flag: "ci" },
  { id: "ECU", name: "Ekvador",           shortName: "Ekvador",     group: "E", flag: "ec" },
  // ── Group F ──────────────────────────────────────────────────────────────
  { id: "NED", name: "Hollanda",          shortName: "Hollanda",    group: "F", flag: "nl" },
  { id: "JPN", name: "Japonya",           shortName: "Japonya",     group: "F", flag: "jp" },
  { id: "SWE", name: "İsveç",             shortName: "İsveç",       group: "F", flag: "se" },
  { id: "TUN", name: "Tunus",             shortName: "Tunus",       group: "F", flag: "tn" },
  // ── Group G ──────────────────────────────────────────────────────────────
  { id: "BEL", name: "Belçika",           shortName: "Belçika",     group: "G", flag: "be" },
  { id: "EGY", name: "Mısır",             shortName: "Mısır",       group: "G", flag: "eg" },
  { id: "IRN", name: "İran",              shortName: "İran",        group: "G", flag: "ir" },
  { id: "NZL", name: "Yeni Zelanda",      shortName: "Y.Zelanda",   group: "G", flag: "nz" },
  // ── Group H ──────────────────────────────────────────────────────────────
  { id: "ESP", name: "İspanya",           shortName: "İspanya",     group: "H", flag: "es" },
  { id: "CPV", name: "Yeşil Burun Adaları", shortName: "Y.Burun",  group: "H", flag: "cv" },
  { id: "KSA", name: "Suudi Arabistan",   shortName: "S.Arabistan", group: "H", flag: "sa" },
  { id: "URY", name: "Uruguay",           shortName: "Uruguay",     group: "H", flag: "uy" },
  // ── Group I ──────────────────────────────────────────────────────────────
  { id: "FRA", name: "Fransa",            shortName: "Fransa",      group: "I", flag: "fr" },
  { id: "SEN", name: "Senegal",           shortName: "Senegal",     group: "I", flag: "sn" },
  { id: "IRQ", name: "Irak",              shortName: "Irak",        group: "I", flag: "iq" },
  { id: "NOR", name: "Norveç",            shortName: "Norveç",      group: "I", flag: "no" },
  // ── Group J ──────────────────────────────────────────────────────────────
  { id: "ARG", name: "Arjantin",          shortName: "Arjantin",    group: "J", flag: "ar" },
  { id: "ALG", name: "Cezayir",           shortName: "Cezayir",     group: "J", flag: "dz" },
  { id: "AUT", name: "Avusturya",         shortName: "Avusturya",   group: "J", flag: "at" },
  { id: "JOR", name: "Ürdün",             shortName: "Ürdün",       group: "J", flag: "jo" },
  // ── Group K ──────────────────────────────────────────────────────────────
  { id: "POR", name: "Portekiz",          shortName: "Portekiz",    group: "K", flag: "pt" },
  { id: "COD", name: "Kongo DR",          shortName: "Kongo DR",    group: "K", flag: "cd" },
  { id: "UZB", name: "Özbekistan",        shortName: "Özbekistan",  group: "K", flag: "uz" },
  { id: "COL", name: "Kolombiya",         shortName: "Kolombiya",   group: "K", flag: "co" },
  // ── Group L ──────────────────────────────────────────────────────────────
  { id: "ENG", name: "İngiltere",         shortName: "İngiltere",   group: "L", flag: "gb-eng" },
  { id: "CRO", name: "Hırvatistan",       shortName: "Hırvatistan", group: "L", flag: "hr" },
  { id: "GHA", name: "Gana",              shortName: "Gana",        group: "L", flag: "gh" },
  { id: "PAN", name: "Panama",            shortName: "Panama",      group: "L", flag: "pa" },
];

export const TEAM_MAP: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.id, t])
);

export const GROUP_LETTERS = ["A","B","C","D","E","F","G","H","I","J","K","L"] as const;

export function getGroupTeams(group: string): Team[] {
  return TEAMS.filter((t) => t.group === group);
}

export function teamImgUrl(team: Team, size: 40 | 80 = 40): string {
  if (team.crest) return team.crest;
  return flagUrl(team.flag, size);
}

export function flagUrl(code: string, size: 40 | 80 = 40): string {
  return `https://flagcdn.com/w${size}/${code.toLowerCase()}.png`;
}

export const DEFAULT_RANKINGS = Object.fromEntries(
  GROUP_LETTERS.map((g) => [g, getGroupTeams(g).map((t) => t.id)])
) as Record<string, string[]>;
