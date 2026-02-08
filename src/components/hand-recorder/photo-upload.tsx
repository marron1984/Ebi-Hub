"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Camera, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { compressAndEncode } from "@/lib/upload";

interface PhotoUploadProps {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  className?: string;
}

export function PhotoUpload({ value, onChange, className }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const result = await compressAndEncode(file);
      setPreview(result.dataUrl);
      onChange(result.dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "アップロードに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    setError(null);
    onChange(undefined);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />

      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Opponent photo"
            className="h-24 w-24 rounded-lg border-2 border-crimson/30 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border bg-card text-muted-foreground hover:text-crimson cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : loading ? (
        <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-emerald/50 bg-emerald/5">
          <Loader2 className="h-6 w-6 animate-spin text-emerald" />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-muted-foreground/30 cursor-pointer hover:border-primary/50 transition-colors"
        >
          <Camera className="h-5 w-5 text-muted-foreground" />
          <span className="text-[9px] text-muted-foreground">写真撮影</span>
        </button>
      )}

      {error && (
        <p className="text-[10px] text-crimson">{error}</p>
      )}

      {!preview && !loading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => inputRef.current?.click()}
        >
          <ImageIcon className="mr-1 h-3 w-3" />
          ライブラリから選択
        </Button>
      )}
    </div>
  );
}
