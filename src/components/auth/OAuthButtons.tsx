"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

// Facebook is deferred for now (skipped during setup) — add { id: "facebook", label: "Facebook ile giriş yap" }
// back here once the Facebook provider is configured in Supabase.
const PROVIDERS = [{ id: "google", label: "Google ile giriş yap" }] as const;

export function OAuthButtons({ redirectTo }: { redirectTo?: string }) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signIn(provider: "google") {
    setError(null);
    setLoadingProvider(provider);
    const supabase = createClient();
    const callbackUrl = new URL("/auth/callback", window.location.origin);
    if (redirectTo) callbackUrl.searchParams.set("next", redirectTo);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl.toString() },
    });

    if (error) {
      setError(error.message);
      setLoadingProvider(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {PROVIDERS.map(({ id, label }) => (
        <Button
          key={id}
          variant="ghost"
          onClick={() => signIn(id)}
          disabled={loadingProvider !== null}
          className="w-full justify-center"
        >
          {loadingProvider === id ? "Yönlendiriliyor..." : label}
        </Button>
      ))}
      {error && <p className="text-sm text-coral-500">{error}</p>}
    </div>
  );
}
