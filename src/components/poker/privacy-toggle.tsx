"use client";

import { EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrivacyToggleProps {
  isPrivate: boolean;
  onToggle: () => void;
}

export function PrivacyToggle({ isPrivate, onToggle }: PrivacyToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="gap-1.5 text-xs text-muted-foreground"
    >
      {isPrivate ? (
        <>
          <EyeOff className="h-3.5 w-3.5" />
          収支非表示
        </>
      ) : (
        <>
          <Eye className="h-3.5 w-3.5" />
          収支表示中
        </>
      )}
    </Button>
  );
}
