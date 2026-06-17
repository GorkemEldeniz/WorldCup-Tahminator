-- Applies a whole batch of scoring results atomically (single transaction).
-- The scoring/streak math itself happens in the app (lib/scoring/score.ts,
-- unit-tested) — this function only persists the already-computed results,
-- but as one transaction so a crash never leaves predictions scored while
-- profiles/match status are stale, or vice versa.

create or replace function public.apply_match_scoring(
  p_match_ids uuid[],
  p_prediction_updates jsonb,
  p_profile_updates jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.predictions p
  set points_awarded = (u.value->>'points_awarded')::numeric,
      outcome_correct = (u.value->>'outcome_correct')::boolean,
      scored_at = (u.value->>'scored_at')::timestamptz
  from jsonb_array_elements(p_prediction_updates) as u
  where p.id = (u.value->>'id')::uuid;

  update public.profiles pr
  set total_points = (u.value->>'total_points')::numeric,
      current_streak = (u.value->>'current_streak')::int,
      best_streak = (u.value->>'best_streak')::int,
      last_scored_kickoff_at = (u.value->>'last_scored_kickoff_at')::timestamptz
  from jsonb_array_elements(p_profile_updates) as u
  where pr.id = (u.value->>'id')::uuid;

  update public.matches
  set scoring_status = 'scored',
      scored_at = now()
  where id = any(p_match_ids);
end;
$$;

revoke all on function public.apply_match_scoring(uuid[], jsonb, jsonb) from public;
grant execute on function public.apply_match_scoring(uuid[], jsonb, jsonb) to service_role;
