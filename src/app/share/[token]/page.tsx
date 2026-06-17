"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { TeamsProvider, useTeams, teamImgUrl } from "@/lib/worldcup/TeamContext";
import { BracketTree } from "@/components/predict/BracketTree";
import { GroupRankingsView } from "@/components/predict/GroupRankingsView";
import type { BracketMatch } from "@/lib/worldcup/types";

interface SimulationData {
  shareToken: string;
  groupRankings: Record<string, string[]>;
  selectedThirds: string[];
  bracket: Record<string, BracketMatch>;
  champion: string | null;
  username: string | null;
}

function ShareView({ data }: { data: SimulationData }) {
  const { teamMap } = useTeams();
  const champion = data.champion ? teamMap[data.champion] : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">⚽</span>
          <span className="text-base font-extrabold tracking-tight text-ink-900">
            WC<span className="text-pitch-500">26</span>
            <span className="ml-1.5 text-gold-500">Tahmin</span>
          </span>
        </Link>
        <Link
          href="/predict"
          className="rounded-xl bg-pitch-500 px-5 py-2.5 text-sm font-bold text-white shadow-card transition-all hover:bg-pitch-600 hover:-translate-y-px"
        >
          Kendi Tahminini Yap →
        </Link>
      </div>

      {/* Champion banner */}
      {champion && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-gold-400 bg-linear-to-br from-gold-50 to-surface py-10 px-6 text-center shadow-card">
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gold-400/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gold-400/10 blur-2xl" />
          <div className="relative">
            <span className="text-5xl">🏆</span>
            {data.username && (
              <p className="mt-3 text-sm font-semibold text-gold-700">
                <span className="font-extrabold">@{data.username}</span> tarafından yapılan tahmin
              </p>
            )}
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gold-600">
              2026 Dünya Kupası Şampiyonu
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <img
                src={teamImgUrl(champion, 80)}
                alt={champion.name}
                className="h-12 w-16 rounded-lg object-cover shadow-card"
              />
              <span className="text-3xl font-extrabold text-ink-900">{champion.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* Group Rankings */}
      <div className="rounded-2xl border border-line-200 bg-surface p-6 shadow-card">
        <div className="mb-5 flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gold-500" />
          <h2 className="text-lg font-extrabold text-ink-900">Grup Sıralaması Tahmini</h2>
        </div>
        <GroupRankingsView groupRankings={data.groupRankings} />
      </div>

      {/* Bracket */}
      <div className="rounded-2xl border border-line-200 bg-surface p-6 shadow-card">
        <div className="mb-5 flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-pitch-500" />
          <h2 className="text-lg font-extrabold text-ink-900">Eleme Turu Tahminleri</h2>
        </div>
        <BracketTree bracket={data.bracket} onPick={() => undefined} readonly />
      </div>
    </div>
  );
}

export default function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [data, setData] = useState<SimulationData | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ok">("loading");

  useEffect(() => {
    fetch(`/api/simulations/${token}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((d) => { setData(d); setStatus("ok"); })
      .catch(() => setStatus("error"));
  }, [token]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-3">
          <span className="text-4xl animate-bounce inline-block">⚽</span>
          <p className="text-sm font-medium text-ink-600">Tahmin yükleniyor…</p>
        </div>
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-4">
        <span className="text-5xl">🔍</span>
        <div className="text-center">
          <p className="text-lg font-extrabold text-ink-900">Tahmin bulunamadı</p>
          <p className="mt-1 text-sm text-ink-400">Bu link geçersiz veya süresi dolmuş olabilir.</p>
        </div>
        <Link
          href="/predict"
          className="rounded-xl bg-pitch-500 px-6 py-3 text-sm font-bold text-white shadow-card hover:bg-pitch-600 transition-colors"
        >
          Kendi Tahminini Yap
        </Link>
      </div>
    );
  }

  return (
    <TeamsProvider>
      <ShareView data={data} />
    </TeamsProvider>
  );
}
