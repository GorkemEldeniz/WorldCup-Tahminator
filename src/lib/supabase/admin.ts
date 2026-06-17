import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Service-role client: bypasses RLS entirely. Only ever import this from
// server-only code (cron routes, the predictions API route's privileged writes).
// Never import this module from a Client Component or anything bundled to the browser.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
