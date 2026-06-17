import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = Promise<{ token: string }>;

// GET /api/simulations/[token] — public, no auth required
export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { token } = await params;
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("simulations")
    .select("share_token, group_rankings, selected_thirds, bracket, champion, profiles(username)")
    .eq("share_token", token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Tahmin bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({
    shareToken: data.share_token,
    groupRankings: data.group_rankings,
    selectedThirds: data.selected_thirds,
    bracket: data.bracket,
    champion: data.champion,
    username: data.profiles?.username ?? null,
  });
}

// PUT /api/simulations/[token] — update existing simulation (token = ownership proof)
export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const { token } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("simulations")
    .update({
      group_rankings: body.groupRankings,
      selected_thirds: body.selectedThirds,
      bracket: body.bracket,
      champion: body.champion ?? null,
    })
    .eq("share_token", token);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
