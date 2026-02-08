"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Camera, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoUploadProps {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  className?: string;
}

export function PhotoUpload({ value, onChange, className }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Resize and compress for storage
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 400;
        let w = img.width;
        let h = img.height;
        if (w > MAX || h > MAX) {
          const ratio = Math.min(MAX / w, MAX / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setPreview(dataUrl);
        onChange(dataUrl);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(undefined);
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

      {!preview && (
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
