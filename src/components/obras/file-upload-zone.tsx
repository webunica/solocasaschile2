"use client";

import { useState, useRef } from "react";
import type { ObraStage, ObraStageFile, ObraFileTipo } from "@/types/obra";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Upload, FileText, Image as ImageIcon, X, CheckCircle2,
  Loader2, Eye, EyeOff, File
} from "lucide-react";

const TIPOS_ARCHIVO: { value: ObraFileTipo; label: string; icon: React.ElementType; accept: string }[] = [
  { value: "foto",        label: "Foto",          icon: ImageIcon, accept: "image/*"       },
  { value: "pdf",         label: "PDF",           icon: FileText,  accept: ".pdf"          },
  { value: "plano",       label: "Plano",         icon: FileText,  accept: ".pdf,image/*"  },
  { value: "contrato",    label: "Contrato",      icon: FileText,  accept: ".pdf,.doc,.docx" },
  { value: "certificado", label: "Certificado",   icon: FileText,  accept: ".pdf"          },
  { value: "acta",        label: "Acta",          icon: FileText,  accept: ".pdf,.doc,.docx" },
  { value: "otro",        label: "Otro",          icon: File,      accept: "*"             },
];

const TIPO_ICON: Record<string, React.ElementType> = {
  foto: ImageIcon, pdf: FileText, plano: FileText,
  contrato: FileText, certificado: FileText, acta: FileText, otro: File,
};

export function FileUploadZone({
  projectId,
  stages,
  existingFiles,
  onUploaded,
}: {
  projectId: string;
  stages: ObraStage[];
  existingFiles: ObraStageFile[];
  onUploaded: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>("general");
  const [selectedTipo, setSelectedTipo] = useState<ObraFileTipo>("foto");
  const [visibleCliente, setVisibleCliente] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  const currentTipo = TIPOS_ARCHIVO.find(t => t.value === selectedTipo)!;

  const handleFile = (file: File) => {
    setUploadedFile(file);
    setSuccess(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("stageId", selectedStage === "general" ? "" : selectedStage);
    formData.append("tipo", selectedTipo);
    formData.append("visibleCliente", String(visibleCliente));

    try {
      const res = await fetch(`/api/obras/${projectId}/files`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setSuccess(true);
        setUploadedFile(null);
        onUploaded();
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally {
      setUploading(false);
    }
  };

  const fotos = existingFiles.filter(f => f.tipo === "foto");
  const docs  = existingFiles.filter(f => f.tipo !== "foto");

  return (
    <div className="space-y-8">
      {/* Upload zone */}
      <div className="p-8 rounded-[2rem] bg-white border border-border/40 space-y-6">
        <h3 className="font-heading font-black text-base tracking-tight">Subir Archivo</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tipo de Archivo</Label>
            <Select value={selectedTipo} onValueChange={(v: string | null) => setSelectedTipo((v ?? "foto") as ObraFileTipo)}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_ARCHIVO.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Etapa</Label>
            <Select value={selectedStage} onValueChange={(v: string | null) => setSelectedStage(v ?? "general")}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General del Proyecto</SelectItem>
                {stages.map(s => <SelectItem key={s.id} value={s.id}>{s.orden}. {s.nombre}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Visibilidad</Label>
            <button
              type="button"
              onClick={() => setVisibleCliente(!visibleCliente)}
              className={cn(
                "w-full h-10 rounded-xl border font-black text-[11px] uppercase tracking-wide flex items-center justify-center gap-2 transition-all",
                visibleCliente
                  ? "bg-brand-teal/10 text-brand-teal border-brand-teal/30"
                  : "bg-slate-50 text-slate-400 border-border/40"
              )}
            >
              {visibleCliente ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {visibleCliente ? "Visible para cliente" : "Solo interno"}
            </button>
          </div>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all",
            dragging        ? "border-brand-indigo bg-brand-indigo/5 scale-[1.01]" :
            uploadedFile    ? "border-emerald-400 bg-emerald-50" :
            "border-border/40 hover:border-brand-indigo/40 hover:bg-brand-indigo/2"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={currentTipo.accept}
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {uploadedFile ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              <p className="font-black text-emerald-700">{uploadedFile.name}</p>
              <p className="text-xs text-emerald-600/60 font-medium">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
              <button type="button" onClick={e => { e.stopPropagation(); setUploadedFile(null); }} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
                <X className="w-3 h-3" /> Quitar
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Upload className="w-10 h-10 opacity-30" />
              <p className="font-black text-sm">Arrastra un archivo o haz clic para seleccionar</p>
              <p className="text-xs opacity-50 font-medium">{currentTipo.label} · {currentTipo.accept}</p>
            </div>
          )}
        </div>

        {uploadedFile && (
          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="rounded-xl px-8 h-11 font-black uppercase tracking-wider text-[11px] bg-brand-indigo text-white shadow-xl shadow-brand-indigo/20"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
              {uploading ? "Subiendo..." : "Subir Archivo"}
            </Button>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> ¡Archivo subido exitosamente!
          </div>
        )}
      </div>

      {/* Galería de fotos */}
      {fotos.length > 0 && (
        <div className="p-8 rounded-[2rem] bg-white border border-border/40 space-y-4">
          <h3 className="font-heading font-black text-base tracking-tight">Galería de Fotos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {fotos.map(f => (
              <div key={f.id} className="group relative aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-border/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-[10px] font-bold truncate">{f.nombre}</p>
                </div>
                {!f.visible_cliente && (
                  <div className="absolute top-2 right-2">
                    <EyeOff className="w-3.5 h-3.5 text-white/70" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documentos */}
      {docs.length > 0 && (
        <div className="p-8 rounded-[2rem] bg-white border border-border/40 space-y-4">
          <h3 className="font-heading font-black text-base tracking-tight">Documentos</h3>
          <div className="divide-y divide-border/20">
            {docs.map(f => {
              const Icon = TIPO_ICON[f.tipo] ?? File;
              return (
                <div key={f.id} className="py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-indigo/5 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-brand-indigo" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-foreground truncate">{f.nombre}</p>
                    <p className="text-[10px] text-muted-foreground font-medium capitalize">{f.tipo} · {new Date(f.created_at).toLocaleDateString('es-CL')}</p>
                  </div>
                  {!f.visible_cliente && (
                    <span aria-label="Solo visible internamente"><EyeOff className="w-4 h-4 text-muted-foreground/40 shrink-0" /></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {existingFiles.length === 0 && (
        <div className="text-center py-12 text-muted-foreground font-medium text-sm">
          Sin evidencias subidas para este proyecto.
        </div>
      )}
    </div>
  );
}
