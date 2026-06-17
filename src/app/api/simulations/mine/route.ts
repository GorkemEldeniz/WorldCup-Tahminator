import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("simulations")
    .select("share_token, group_rankings, selected_thirds, bracket, champion")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return NextResponse.json({ error: "not found" }, { status: 404 });

  const champion = data.champion ?? null;
  const bracket = data.bracket ?? {};
  const step: 1 | 2 | 4 | 5 = champion ? 5 : Object.keys(bracket).length > 0 ? 4 : 1;

  return NextResponse.json({
    step,
    shareToken: data.share_token,
    groupRankings: data.group_rankings,
    selectedThirds: data.selected_thirds ?? [],
    bracket,
    champion,
  });
}
