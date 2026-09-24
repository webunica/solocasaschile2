"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, KeyRound, Loader2 } from "lucide-react";

export function TokenInputForm() {
  const [tokenInput, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = tokenInput.trim();
    if (!raw) return;

    setLoading(true);

    // Permitir pegar el token solo (UUID) o la URL completa (ej: ...?token=XYZ)
    let extracted = raw;
    try {
      if (raw.includes("token=")) {
        const url = new URL(raw.startsWith("http") ? raw : `https://dummy.com/${raw}`);
        const param = url.searchParams.get("token");
        if (param) extracted = param.trim();
      }
    } catch {
      // Si no es URL válida, usar el string tal cual
    }

    router.push(`/invitacion?token=${encodeURIComponent(extracted)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Pega tu código o enlace de invitación..."
            required
            className="h-11 pl-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-xs sm:text-sm font-medium shadow-sm hover:border-slate-400 focus-visible:border-brand-teal focus-visible:ring-2 focus-visible:ring-brand-teal/20"
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !tokenInput.trim()}
          className="h-11 px-5 rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-white font-bold text-xs uppercase tracking-wider gap-2 shrink-0 shadow-sm"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Validar <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground text-left leading-normal">
        Puedes pegar el código UUID o el enlace completo que recibiste en tu correo.
      </p>
    </form>
  );
}
