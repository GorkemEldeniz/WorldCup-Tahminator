"use client";

import { teamImgUrl, useTeams } from "@/lib/worldcup/TeamContext";
import type { BracketMatch } from "@/lib/worldcup/types";
import { useState } from "react";
import { BracketTree } from "./BracketTree";

interface Props {
	bracket: Record<string, BracketMatch>;
	champion: string | null;
	shareToken: string | null;
	onReset: () => void;
	onEditGroups: () => void;
	onEditBracket: () => void;
}

export function SharePanel({ bracket, champion, shareToken, onReset, onEditGroups, onEditBracket }: Props) {
	const { teamMap } = useTeams();
	const [copied, setCopied] = useState(false);

	const team = champion ? teamMap[champion] : null;

	async function copyLink() {
		if (!shareToken) return;
		const url = `${window.location.origin}/share/${shareToken}`;
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 3000);
		} catch {
			prompt("Linki kopyala:", url);
		}
	}

	return (
		<div className="space-y-6">
			{/* Champion banner */}
			{team && (
				<div className="relative overflow-hidden rounded-2xl border-2 border-gold-400 bg-linear-to-br from-gold-50 to-surface py-10 px-6 text-center shadow-card">
					<div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gold-400/10 blur-2xl" />
					<div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gold-400/10 blur-2xl" />
					<div className="relative">
						<span className="text-5xl">🏆</span>
						<p className="mt-3 text-xs font-bold uppercase tracking-widest text-gold-700">
							2026 Dünya Kupası Şampiyonum
						</p>
						<div className="mt-4 flex items-center justify-center gap-3">
							<img
								src={teamImgUrl(team, 80)}
								alt={team.name}
								className="h-12 w-16 rounded-lg object-cover shadow-card"
							/>
							<span className="text-3xl font-extrabold text-ink-900">{team.name}</span>
						</div>
					</div>
				</div>
			)}

			{!shareToken && (
				<div className="flex items-center justify-center gap-2 text-sm text-ink-400">
					<span className="inline-block h-2 w-2 animate-pulse rounded-full bg-pitch-400" />
					Tahmin kaydediliyor…
				</div>
			)}

			{/* Action buttons */}
			<div className="flex flex-wrap justify-center gap-3">
				<button
					onClick={copyLink}
					disabled={!shareToken}
					className="flex items-center gap-2 rounded-xl bg-pitch-500 px-6 py-3 text-sm font-bold text-white shadow-card transition-all hover:bg-pitch-600 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
				>
					{!shareToken ? "Kaydediliyor…" : copied ? "✓ Kopyalandı!" : "🔗 Link Kopyala"}
				</button>
				<button
					onClick={onEditBracket}
					className="flex items-center gap-2 rounded-xl border border-pitch-500/40 bg-pitch-50 px-5 py-3 text-sm font-semibold text-pitch-600 transition-all hover:border-pitch-500 hover:bg-pitch-500 hover:text-white"
				>
					✏ Bracket&apos;ı Düzenle
				</button>
				<button
					onClick={onEditGroups}
					className="flex items-center gap-2 rounded-xl border border-line-200 bg-surface px-5 py-3 text-sm font-semibold text-ink-600 transition-all hover:border-ink-400 hover:bg-surface-soft"
				>
					✏ Grupları Düzenle
				</button>
				<button
					onClick={onReset}
					className="flex items-center gap-2 rounded-xl border border-coral-400/40 bg-coral-50 px-5 py-3 text-sm font-semibold text-coral-600 transition-all hover:border-coral-500 hover:bg-coral-500 hover:text-white"
				>
					↺ Yeniden Başla
				</button>
			</div>

			{/* Bracket overview */}
			<div className="rounded-2xl border border-line-200 bg-surface p-6 shadow-card">
				<div className="mb-6 flex items-center gap-3">
					<div className="h-8 w-1 rounded-full bg-pitch-500" />
					<span className="text-lg font-extrabold text-ink-900">
						Eleme Turu Tahminim
					</span>
				</div>
				<BracketTree bracket={bracket} onPick={() => undefined} readonly />
			</div>
		</div>
	);
}
