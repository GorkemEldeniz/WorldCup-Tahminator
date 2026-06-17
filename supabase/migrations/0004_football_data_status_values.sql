-- Switching fixture/score provider from API-Football to football-data.org
-- (API-Football's free plan doesn't cover the current World Cup season;
-- football-data.org's free tier does). Status vocabulary changes from
-- API-Football's short codes (NS, FT, ...) to football-data.org's
-- (SCHEDULED, IN_PLAY, FINISHED, ...) — update the goals-consistency check
-- to match.

alter table public.matches drop constraint if exists chk_goals_consistency;

alter table public.matches add constraint chk_goals_consistency check (
  (status = 'FINISHED' and home_goals is not null and away_goals is not null)
  or status <> 'FINISHED'
);
