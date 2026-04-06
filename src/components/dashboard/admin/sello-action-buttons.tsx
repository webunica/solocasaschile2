"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { aprobarSello, rechazarSello } from "@/lib/supabase/actions";
import { useRouter } from "next/navigation";

interface SelloActionButtonsProps {
  selloId: string;
}

export function SelloActionButtons({ selloId }: SelloActionButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"aprobar" | "rechazar" | null>(null);
  const [comentario, setComentario] = useState("");

  async function handleAprobar() {
    try {
      setLoading("aprobar");
      const formData = new FormData();
      formData.append("sellosId", selloId);
      const res = await aprobarSello(formData);
      
      if (res?.success) {
        router.refresh();
      } else if (res?.error) {
        alert("Error: " + res.error);
      }
    } catch (error) {
      console.error("Error al aprobar:", error);
      alert("Error al aprobar el sello. Revisa la consola.");
    } finally {
      setLoading(null);
    }
  }

  async function handleRechazar() {
    if (!comentario) {
      alert("Por favor, ingresa un motivo para el rechazo.");
      return;
    }

    try {
      setLoading("rechazar");
      const formData = new FormData();
      formData.append("sellosId", selloId);
      formData.append("comentario", comentario);
      const res = await rechazarSello(formData);
      
      if (res?.success) {
        setComentario("");
        router.refresh();
      } else if (res?.error) {
        alert("Error: " + res.error);
      }
    } catch (error) {
      console.error("Error al rechazar:", error);
      alert("Error al rechazar el sello.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-3 shrink-0 w-full md:w-60">
      <button
        onClick={handleAprobar}
        disabled={loading !== null}
        className="w-full flex items-center justify-center gap-2 bg-brand-teal text-white rounded-2xl px-6 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-brand-teal/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-teal/20"
      >
        {loading === "aprobar" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CheckCircle2 className="w-4 h-4" />
        )}
        {loading === "aprobar" ? "Aprobando..." : "Aprobar"}
      </button>

      <div className="pt-2 space-y-2">
        <input
          type="text"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Motivo del rechazo..."
          className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-xs font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand-indigo"
        />
        <button
          onClick={handleRechazar}
          disabled={loading !== null}
          className="w-full flex items-center justify-center gap-2 border border-destructive/30 text-destructive rounded-2xl px-6 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-destructive/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "rechazar" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {loading === "rechazar" ? "Rechazando..." : "Rechazar"}
        </button>
      </div>
    </div>
  );
}
