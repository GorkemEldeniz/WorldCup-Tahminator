import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/simulations — save a completed simulation, return share_token
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { groupRankings, selectedThirds, bracket, champion } = body;
  if (!groupRankings || !selectedThirds || !bracket) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("simulations")
    .insert({
      user_id: user?.id ?? null,
      group_rankings: groupRankings,
      selected_thirds: selectedThirds,
      bracket,
      champion: champion ?? null,
    })
    .select("share_token")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ shareToken: data.share_token });
}
