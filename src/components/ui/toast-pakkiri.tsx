"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { AlertCircle, CheckCircle, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  leaving?: boolean;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 200);
    }, 3000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-20 left-4 right-4 z-[100] flex flex-col gap-2 md:bottom-6 md:left-auto md:right-6 md:w-96 pointer-events-none">
        {toasts.map((t) => {
          const IconComponent = Icon[t.type];
          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium",
                t.leaving ? "animate-[toast-out_0.2s_ease-in_forwards]" : "animate-[toast-in_0.2s_ease-out]",
                t.type === "error" && "toast-pakkiri",
                t.type === "success" && "border-2 border-emerald bg-card text-foreground",
                t.type === "info" && "border border-border bg-card text-foreground",
              )}
            >
              <IconComponent
                className={cn(
                  "h-4 w-4 shrink-0",
                  t.type === "error" && "text-crimson",
                  t.type === "success" && "text-emerald",
                  t.type === "info" && "text-muted-foreground",
                )}
              />
              <span className="flex-1">{t.message}</span>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
