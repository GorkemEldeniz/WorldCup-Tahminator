"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GROUP_LETTERS } from "@/lib/worldcup/teams";
import { useTeams, teamImgUrl } from "@/lib/worldcup/TeamContext";
import type { GroupRankings } from "@/lib/worldcup/types";

// ── Sortable team row ──────────────────────────────────────────────────────
function SortableTeam({ teamId, rank }: { teamId: string; rank: number }) {
  const { teamMap } = useTeams();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: teamId });
  const team = teamMap[teamId];

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const rankColor =
    rank === 1 ? "text-gold-500 font-extrabold" :
    rank === 2 ? "text-pitch-500 font-bold" :
    rank === 3 ? "text-coral-500" : "text-ink-400";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex cursor-grab items-center gap-2 rounded-lg border border-line-200 bg-surface px-3 py-2 shadow-sm active:cursor-grabbing select-none"
    >
      <span className={`w-4 shrink-0 text-center text-sm ${rankColor}`}>{rank}</span>
      {team ? (
        <img
          src={teamImgUrl(team, 40)}
          alt={team.name}
          className="h-5 w-7 shrink-0 rounded-sm object-cover"
          loading="lazy"
        />
      ) : (
        <div className="h-5 w-7 shrink-0 rounded-sm bg-line-200" />
      )}
      <span className="flex-1 truncate text-sm font-medium text-ink-900">
        {team?.shortName ?? teamId}
      </span>
      <span className="text-ink-400 text-xs select-none">☰</span>
    </div>
  );
}

// ── Single group card ──────────────────────────────────────────────────────
interface GroupCardProps {
  group: string;
  teamIds: string[];
  onReorder: (group: string, newOrder: string[]) => void;
}

function GroupCard({ group, teamIds, onReorder }: GroupCardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = teamIds.indexOf(active.id as string);
      const newIdx = teamIds.indexOf(over.id as string);
      onReorder(group, arrayMove(teamIds, oldIdx, newIdx));
    }
  }

  return (
    <div className="rounded-xl border border-line-200 bg-surface-soft p-4 shadow-card">
      <h3 className="mb-3 text-center text-sm font-extrabold uppercase tracking-widest text-ink-600">
        Grup {group}
      </h3>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={teamIds} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {teamIds.map((id, i) => (
              <SortableTeam key={id} teamId={id} rank={i + 1} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

// ── Main Group Stage ────────────────────────────────────────────────────────
interface Props {
  groupRankings: GroupRankings;
  onReorder: (group: string, newOrder: string[]) => void;
  onNext: () => void;
}

export function GroupStage({ groupRankings, onReorder, onNext }: Props) {
  const { loaded } = useTeams();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-ink-900">Grup Sıralaması</h2>
        <p className="mt-1 text-sm text-ink-600">
          Her grupta takımları sürükleyerek 1.&ndash;4. sırayı belirle
          {!loaded && (
            <span className="ml-2 text-ink-400">(Gerçek veriler yükleniyor…)</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {GROUP_LETTERS.map((g) => (
          <GroupCard
            key={g}
            group={g}
            teamIds={groupRankings[g] ?? []}
            onReorder={onReorder}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="rounded-xl bg-pitch-500 px-8 py-3 text-base font-bold text-white shadow-card transition-colors hover:bg-pitch-600 active:bg-pitch-700"
        >
          Devam Et →
        </button>
      </div>
    </div>
  );
}
