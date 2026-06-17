// Hand-written types mirroring supabase/migrations/0001_init.sql and 0003_scoring_function.sql.
// Keep in sync manually (no Supabase CLI codegen in this project).

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: number;
          name: string;
          short_name: string | null;
          logo_url: string | null;
          country: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["teams"]["Row"]> & { id: number; name: string };
        Update: Partial<Database["public"]["Tables"]["teams"]["Row"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          total_points: number;
          current_streak: number;
          best_streak: number;
          last_scored_kickoff_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string; username: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      matches: {
        Row: {
          id: string;
          api_fixture_id: number;
          home_team_id: number;
          away_team_id: number;
          kickoff_at: string;
          matchday_key: string;
          venue: string | null;
          round: string | null;
          status: string;
          home_goals: number | null;
          away_goals: number | null;
          scoring_status: "pending" | "scored" | "not_applicable";
          scored_at: string | null;
          last_synced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["matches"]["Row"]> & {
          api_fixture_id: number;
          home_team_id: number;
          away_team_id: number;
          kickoff_at: string;
          matchday_key: string;
        };
        Update: Partial<Database["public"]["Tables"]["matches"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "matches_home_team_id_fkey";
            columns: ["home_team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_away_team_id_fkey";
            columns: ["away_team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      predictions: {
        Row: {
          id: string;
          user_id: string;
          match_id: string;
          predicted_home: number;
          predicted_away: number;
          submitted_at: string;
          points_awarded: number | null;
          outcome_correct: boolean | null;
          scored_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["predictions"]["Row"]> & {
          user_id: string;
          match_id: string;
          predicted_home: number;
          predicted_away: number;
        };
        Update: Partial<Database["public"]["Tables"]["predictions"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "predictions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "predictions_match_id_fkey";
            columns: ["match_id"];
            isOneToOne: false;
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
        ];
      };
      match_injuries: {
        Row: {
          id: string;
          match_id: string;
          team_id: number;
          player_name: string;
          player_photo: string | null;
          type: string | null;
          reason: string | null;
          fetched_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["match_injuries"]["Row"]> & {
          match_id: string;
          team_id: number;
          player_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["match_injuries"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "match_injuries_match_id_fkey";
            columns: ["match_id"];
            isOneToOne: false;
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "match_injuries_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      apply_match_scoring: {
        Args: {
          p_match_ids: string[];
          p_prediction_updates: Json;
          p_profile_updates: Json;
        };
        Returns: undefined;
      };
    };
  };
}
