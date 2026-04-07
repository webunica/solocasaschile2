"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { solicitarSello } from "@/lib/supabase/actions";
import { Link as LinkIcon, Loader2, UploadCloud, ChevronRight, X } from "lucide-react";

export function SolicitarSelloForm({ sello }: { sello: any }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url) {
      alert("Por favor, ingresa el enlace a tus documentos.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("selloId", sello.id);
      formData.append("evidenciaUrl", url);
      await solicitarSello(formData);
      router.refresh();
      setIsOpen(false);
    } catch (err: any) {
      alert("Error al enviar solicitud: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="sm"
        variant="outline"
        className="mt-3 h-8 px-4 text-[10px] font-black uppercase tracking-widest rounded-full border-brand-indigo/30 text-brand-indigo hover:bg-brand-indigo hover:text-white transition-all shadow-sm"
      >
        Iniciar Proceso de Certificación <ChevronRight className="w-3 h-3 ml-1" />
      </Button>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-brand-indigo/10 bg-brand-indigo/[0.02] -mx-4 px-4 pb-4 sm:-mx-6 sm:px-6 rounded-b-2xl animate-in fade-in slide-in-from-top-4 relative">
      <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
        <X className="w-4 h-4" />
      </button>

      <div className="flex gap-3 mb-4">
        <div className="mt-1 w-8 h-8 rounded-full bg-brand-indigo/10 flex items-center justify-center shrink-0">
          <UploadCloud className="w-4 h-4 text-brand-indigo" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-brand-indigo">Documentación Requerida</h4>
          <p className="text-xs text-muted-foreground leading-relaxed pr-6">
            Sube tus certificados comerciales, extractos o documentos oficiales en formato PDF o JPG a
            <span className="font-bold text-foreground mx-1">Google Drive</span> o <span className="font-bold text-foreground">Dropbox</span>.
            Asegúrate de que el enlace sea **público** para que nuestro equipo pueda verificarlo y aprobar tu insignia en 24hs.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pl-11">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <input
            type="url"
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Pega aquí el enlace a tus documentos (Carpeta Drive, OneDrive, etc)"
            className="w-full rounded-xl border border-border bg-white px-9 py-2.5 text-xs font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-indigo/20 shadow-sm"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="h-9 px-6 bg-brand-indigo text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-brand-indigo/90 transition-all shadow-md shadow-brand-indigo/20"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Enviar Evidencia
        </Button>
      </form>
    </div>
  );
}
