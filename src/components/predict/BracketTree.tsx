"use client";

import { useTeams, teamImgUrl } from "@/lib/worldcup/TeamContext";
import type { BracketMatch } from "@/lib/worldcup/types";

// ── Layout constants ─────────────────────────────────────────────────────────
// Total bracket height is determined by the R32 slot height × 16 matches.
// Each later round's slot height doubles, keeping all midpoints aligned.
const SLOT_H   = 96;              // R32 slot height (px) — card + equal padding
const TOTAL_H  = 16 * SLOT_H;    // 1536 px
const CARD_W   = 150;             // match card width (px)
const CARD_H   = 86;              // approximate rendered card height (px)
const GAP_W    = 36;              // gap between round columns (px)
const COL_STEP = CARD_W + GAP_W; // 186 px

const ROUNDS = [
  { title: "Son 32",      ids: ["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12","M13","M14","M15","M16"], count: 16 },
  { title: "Son 16",      ids: ["R01","R02","R03","R04","R05","R06","R07","R08"], count: 8 },
  { title: "Çeyrek Final",ids: ["Q01","Q02","Q03","Q04"], count: 4 },
  { title: "Yarı Final",  ids: ["S01","S02"], count: 2 },
  { title: "Final",       ids: ["F01"], count: 1 },
] as const;

// X coordinate of the left edge of each round column
const COL_X = ROUNDS.map((_, i) => i * COL_STEP);
const TOTAL_W = ROUNDS.length * CARD_W + (ROUNDS.length - 1) * GAP_W;

// ── Team row ─────────────────────────────────────────────────────────────────
interface TeamRowProps {
  teamId: string | null;
  isWinner: boolean;
  isLoser: boolean;
  onClick: () => void;
  disabled: boolean;
}

function TeamRow({ teamId, isWinner, isLoser, onClick, disabled }: TeamRowProps) {
  const { teamMap } = useTeams();
  const team = teamId ? teamMap[teamId] : null;

  return (
    <button
      onClick={onClick}
      disabled={disabled || !teamId}
      className={[
        "flex w-full items-center gap-2 px-2 py-1.5 text-left transition-all",
        !teamId ? "opacity-30 cursor-default" : disabled ? "cursor-default" : "cursor-pointer hover:bg-pitch-50",
        isWinner ? "bg-pitch-50 text-pitch-700" : "",
        isLoser  ? "opacity-40" : "",
      ].join(" ")}
    >
      {team ? (
        <>
          <img
            src={teamImgUrl(team, 40)}
            alt={team.name}
            className="h-4 w-6 shrink-0 rounded-sm object-cover"
            loading="lazy"
          />
          <span className={`truncate text-xs ${isWinner ? "font-bold" : ""}`}>
            {team.shortName}
          </span>
          {isWinner && <span className="ml-auto shrink-0 text-xs text-pitch-500">✓</span>}
        </>
      ) : (
        <span className="text-xs text-ink-400">TBD</span>
      )}
    </button>
  );
}

// ── Match card ────────────────────────────────────────────────────────────────
interface MatchCardProps {
  match: BracketMatch;
  onPick: (matchId: string, teamId: string) => void;
  readonly?: boolean;
}

function MatchCard({ match, onPick, readonly }: MatchCardProps) {
  const { id, homeTeamId, awayTeamId, winnerId } = match;
  const bothPresent = !!(homeTeamId && awayTeamId);

  return (
    <div className="flex flex-col rounded-lg border border-line-200 bg-surface shadow-sm overflow-hidden w-full">
      <div className="border-b border-line-200 bg-surface-soft px-2 py-0.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">{id}</span>
      </div>
      <TeamRow
        teamId={homeTeamId}
        isWinner={winnerId === homeTeamId}
        isLoser={!!winnerId && winnerId !== homeTeamId}
        onClick={() => homeTeamId && onPick(id, homeTeamId)}
        disabled={!!readonly || !bothPresent}
      />
      <div className="h-px bg-line-200" />
      <TeamRow
        teamId={awayTeamId}
        isWinner={winnerId === awayTeamId}
        isLoser={!!winnerId && winnerId !== awayTeamId}
        onClick={() => awayTeamId && onPick(id, awayTeamId)}
        disabled={!!readonly || !bothPresent}
      />
    </div>
  );
}

// ── SVG connector lines ───────────────────────────────────────────────────────
// For each adjacent pair of rounds, draw ─┤├─ style connectors.
// Each source match (even, odd) connects to their shared target match.
function ConnectorLines() {
  const lines: React.ReactNode[] = [];

  ROUNDS.slice(0, -1).forEach((round, ri) => {
    const slotH     = TOTAL_H / round.count;
    const nextSlotH = TOTAL_H / ROUNDS[ri + 1].count;
    const srcRight  = COL_X[ri] + CARD_W;     // right edge of source column
    const dstLeft   = COL_X[ri + 1];           // left edge of target column
    const midX      = srcRight + GAP_W / 2;    // vertical junction x

    for (let pair = 0; pair < round.count / 2; pair++) {
      const evenY  = (pair * 2 + 0.5) * slotH;          // center of even slot
      const oddY   = (pair * 2 + 1.5) * slotH;          // center of odd slot
      const targetY = (pair + 0.5) * nextSlotH;         // center of target slot

      lines.push(
        <g key={`${ri}-${pair}`} stroke="#e5e5e5" strokeWidth={1.5} fill="none">
          {/* Horizontal arms from source cards to midX */}
          <line x1={srcRight} y1={evenY}   x2={midX}   y2={evenY}   />
          <line x1={srcRight} y1={oddY}    x2={midX}   y2={oddY}    />
          {/* Vertical junction at midX */}
          <line x1={midX}    y1={evenY}   x2={midX}   y2={oddY}    />
          {/* Horizontal arm from midX to target card */}
          <line x1={midX}    y1={targetY} x2={dstLeft} y2={targetY} />
        </g>
      );
    }
  });

  return <>{lines}</>;
}

// ── Full bracket tree ─────────────────────────────────────────────────────────
interface Props {
  bracket: Record<string, BracketMatch>;
  onPick: (matchId: string, teamId: string) => void;
  readonly?: boolean;
}

export function BracketTree({ bracket, onPick, readonly }: Props) {
  return (
    <div className="overflow-x-auto pb-4 -mx-4 px-4">
      {/* Round title row */}
      <div style={{ width: TOTAL_W }} className="flex mb-3">
        {ROUNDS.map((round, i) => (
          <div
            key={round.title}
            style={{ width: CARD_W, marginLeft: i > 0 ? GAP_W : 0 }}
            className="text-center text-xs font-extrabold uppercase tracking-widest text-ink-400"
          >
            {round.title}
          </div>
        ))}
      </div>

      {/* Bracket area — fixed size, cards + SVG positioned absolutely */}
      <div style={{ width: TOTAL_W, height: TOTAL_H, position: "relative" }}>
        {/* SVG connector lines rendered below match cards */}
        <svg
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
          width={TOTAL_W}
          height={TOTAL_H}
          aria-hidden
          className="pointer-events-none"
        >
          <ConnectorLines />
        </svg>

        {/* Match cards */}
        {ROUNDS.map((round, ri) => {
          const slotH = TOTAL_H / round.count;
          return round.ids.map((id, i) => {
            const match = bracket[id];
            if (!match) return null;

            // Center the card vertically within its slot
            const top  = i * slotH + (slotH - CARD_H) / 2;
            const left = COL_X[ri];

            return (
              <div
                key={id}
                style={{ position: "absolute", top, left, width: CARD_W }}
              >
                <MatchCard match={match} onPick={onPick} readonly={readonly} />
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}
