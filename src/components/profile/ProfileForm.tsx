"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AvatarUploader } from "./AvatarUploader";

export function ProfileForm({
  userId,
  initialUsername,
  initialAvatarUrl,
}: {
  userId: string;
  initialUsername: string;
  initialAvatarUrl: string | null;
}) {
  const [username, setUsername] = useState(initialUsername);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    const trimmed = username.trim();
    if (trimmed.length < 3) {
      setStatus("error");
      setErrorMessage("Kullanıcı adı en az 3 karakter olmalı.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ username: trimmed, avatar_url: avatarUrl })
      .eq("id", userId);

    if (error) {
      setStatus("error");
      setErrorMessage(error.message.includes("duplicate") ? "Bu kullanıcı adı zaten alınmış." : "Kaydedilemedi, tekrar dene.");
      return;
    }

    setStatus("saved");
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
        <AvatarUploader userId={userId} avatarUrl={avatarUrl} onUploaded={setAvatarUrl} />

        <div className="w-full max-w-xs">
          <label htmlFor="username" className="mb-1 block text-xs text-ink-400">
            Kullanıcı adı
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-line-200 bg-surface p-2.5 text-ink-900"
            minLength={3}
            maxLength={32}
            required
          />
        </div>

        <Button type="submit" disabled={status === "saving"} className="w-full max-w-xs justify-center">
          {status === "saving" ? "Kaydediliyor..." : "Kaydet"}
        </Button>
        {status === "saved" && <p className="text-sm text-pitch-500">Profilin güncellendi.</p>}
        {status === "error" && errorMessage && <p className="text-sm text-coral-500">{errorMessage}</p>}
      </form>
    </Card>
  );
}
