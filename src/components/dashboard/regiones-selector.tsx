"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { REGIONES_CHILE } from "@/config/regions";
import { cn } from "@/lib/utils";

export function RegionesSelector({ name, initialValue = [] }: { name: string; initialValue?: string[] }) {
  const [selected, setSelected] = useState<string[]>(initialValue || []);

  const toggle = (r: string) =>
    setSelected(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={selected.join(",")} />
      <div className="flex flex-wrap gap-2">
        {REGIONES_CHILE.map((r: string) => (
          <button
            key={r}
            type="button"
            onClick={() => toggle(r)}
            className={cn(
              "px-3 py-2 rounded-xl border text-xs font-bold transition-all",
              selected.includes(r)
                ? "bg-brand-teal/10 border-brand-teal/30 text-brand-teal"
                : "bg-muted/20 border-border/40 text-foreground/50 hover:border-brand-teal/20"
            )}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
