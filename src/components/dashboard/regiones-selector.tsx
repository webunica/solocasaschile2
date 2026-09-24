"use client";

import { useState } from "react";
import { REGIONES_CHILE } from "@/config/regions";
import { normalizeRegionName } from "@/lib/regions";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function RegionesSelector({ name, initialValue = [] }: { name: string; initialValue?: string[] }) {
  const normalizedInitial = (initialValue || []).map(r => normalizeRegionName(r)).filter(Boolean);
  const [selected, setSelected] = useState<string[]>(normalizedInitial);

  const toggle = (r: string) =>
    setSelected(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={selected.join(",")} />
      <div className="flex flex-wrap gap-2">
        {REGIONES_CHILE.map((r: string) => {
          const isSelected = selected.includes(r);
          return (
            <button
              key={r}
              type="button"
              onClick={() => toggle(r)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                isSelected
                  ? "bg-brand-teal text-white border-brand-teal shadow-md shadow-brand-teal/20 scale-[1.02]"
                  : "bg-muted/20 border-border/40 text-foreground/60 hover:text-foreground hover:border-brand-teal/30"
              )}
            >
              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              <span>{r}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
