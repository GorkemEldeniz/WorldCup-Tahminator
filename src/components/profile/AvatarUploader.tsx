"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function AvatarUploader({
  userId,
  avatarUrl,
  onUploaded,
}: {
  userId: string;
  avatarUrl: string | null;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(avatarUrl);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Sadece PNG, JPEG veya WEBP yükleyebilirsin.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("Dosya boyutu en fazla 2MB olabilir.");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const path = `${userId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      setError("Yükleme başarısız oldu, tekrar dene.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setPreview(data.publicUrl);
    onUploaded(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {preview ? (
        <Image src={preview} alt="Profil fotoğrafı" width={96} height={96} className="size-24 rounded-full object-cover" unoptimized />
      ) : (
        <div className="size-24 rounded-full bg-surface-soft" />
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-sm font-semibold text-pitch-500 hover:text-pitch-600 disabled:opacity-50"
      >
        {uploading ? "Yükleniyor..." : "Fotoğraf değiştir"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <p className="text-xs text-coral-500">{error}</p>}
    </div>
  );
}
