"use client";

import { useState, useTransition } from "react";
import type { ObraStage, ObraStageEstado, UpdateObraStageDTO } from "@/types/obra";
import { StageStatusBadge } from "@/components/obras/stage-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Save, Loader2, AlertTriangle, Plus, Layers, Camera, Image as ImageIcon, Eye, EyeOff, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

// Componente para la galería de fotos por etapa
function StagePhotos({ 
  stageId, 
  projectId, 
  initialFiles 
}: { 
  stageId: string; 
  projectId: string; 
  initialFiles: any[] 
}) {
  const [files, setFiles] = useState(initialFiles || []);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("stageId", stageId);
    formData.append("tipo", "foto");

    try {
      const res = await fetch(`/api/obras/${projectId}/files`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const newFile = await res.json();
        setFiles(prev => [newFile, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-border/40">
      <div className="flex items-center justify-between">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Camera className="w-3.5 h-3.5" /> Evidencia Fotográfica
        </Label>
        <label className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-wider cursor-pointer hover:bg-brand-teal/20 transition-colors",
          uploading && "opacity-50 pointer-events-none"
        )}>
          {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
          Subir Foto
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {files.map((file: any) => {
          // Generar URL pública o firmada
          const { data } = supabase.storage.from('obra-files').getPublicUrl(file.storage_path);
          const imageUrl = data.publicUrl;

          return (
            <div key={file.id} className="group relative aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-border/40 shadow-sm">
              <img 
                src={imageUrl} 
                alt={file.nombre}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/40 transition-colors">
                  {file.visible_cliente ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
        {files.length === 0 && !uploading && (
          <div className="col-span-full py-8 text-center border-2 border-dashed border-border/20 rounded-2xl">
            <p className="text-[11px] text-muted-foreground font-medium">Sin fotos de evidencia todavía</p>
          </div>
        )}
      </div>
    </div>
  );
}

const ESTADOS: { value: ObraStageEstado; label: string }[] = [
  { value: "pendiente",      label: "Pendiente"       },
  { value: "en_preparacion", label: "En preparación"  },
  { value: "en_curso",       label: "En curso"        },
  { value: "pausada",        label: "Pausada"         },
  { value: "retrasada",      label: "Retrasada"       },
  { value: "completada",     label: "Completada"      },
  { value: "cancelada",      label: "Cancelada"       },
];

function StageRow({
  stage,
  projectId,
  onSaved,
}: {
  stage: ObraStage;
  projectId: string;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<UpdateObraStageDTO>({
    estado:             stage.estado,
    porcentaje_avance:  stage.porcentaje_avance,
    fecha_inicio_real:  stage.fecha_inicio_real ?? "",
    fecha_termino_real: stage.fecha_termino_real ?? "",
    responsable:        stage.responsable ?? "",
    observaciones:      stage.observaciones ?? "",
    tiene_retraso:      stage.tiene_retraso,
    motivo_retraso:     stage.motivo_retraso ?? "",
  });

  const handleSave = () => {
    startTransition(async () => {
      await fetch(`/api/obras/${projectId}/stages/${stage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      onSaved();
      setOpen(false);
    });
  };

  return (
    <div className={cn(
      "rounded-[1.5rem] border transition-all overflow-hidden",
      open ? "border-brand-indigo/30 shadow-lg shadow-brand-indigo/5" : "border-border/40 bg-white hover:border-border/60"
    )}>
      {/* Header row */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 text-[11px] font-black text-muted-foreground">
          {stage.orden}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-foreground text-sm leading-tight">{stage.nombre}</p>
          {stage.descripcion && (
            <p className="text-[11px] text-muted-foreground font-medium mt-0.5 line-clamp-1">{stage.descripcion}</p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-20 h-1.5 bg-slate-100 rounded-full">
              <div className="h-full bg-brand-teal rounded-full transition-all" style={{ width: `${form.porcentaje_avance}%` }} />
            </div>
            <span className="text-[11px] font-black text-muted-foreground w-7">{form.porcentaje_avance}%</span>
          </div>
          <StageStatusBadge estado={form.estado!} />
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded form */}
      {open && (
        <div className="border-t border-border/40 p-6 bg-slate-50/50 space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Estado */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estado</Label>
              <Select
                value={form.estado}
                onValueChange={v => setForm(p => ({ ...p, estado: v as ObraStageEstado }))}
              >
                <SelectTrigger className="h-10 rounded-xl bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Fecha inicio real */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fecha Inicio Real</Label>
              <Input
                type="date"
                className="h-10 rounded-xl bg-white"
                value={form.fecha_inicio_real ?? ""}
                onChange={e => setForm(p => ({ ...p, fecha_inicio_real: e.target.value }))}
              />
            </div>

            {/* Fecha término real */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fecha Término Real</Label>
              <Input
                type="date"
                className="h-10 rounded-xl bg-white"
                value={form.fecha_termino_real ?? ""}
                onChange={e => setForm(p => ({ ...p, fecha_termino_real: e.target.value }))}
              />
            </div>

            {/* Responsable */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Responsable</Label>
              <Input
                className="h-10 rounded-xl bg-white"
                placeholder="Nombre del responsable"
                value={form.responsable ?? ""}
                onChange={e => setForm(p => ({ ...p, responsable: e.target.value }))}
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Avance: <span className="text-brand-indigo">{form.porcentaje_avance}%</span>
              </Label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={form.porcentaje_avance ?? 0}
                onChange={e => setForm(p => ({ ...p, porcentaje_avance: Number(e.target.value) }))}
                className="w-full accent-brand-indigo cursor-pointer"
              />
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Observaciones</Label>
            <Textarea
              className="rounded-xl bg-white resize-none text-sm"
              rows={2}
              placeholder="Notas internas sobre esta etapa..."
              value={form.observaciones ?? ""}
              onChange={e => setForm(p => ({ ...p, observaciones: e.target.value }))}
            />
          </div>

          {/* Galería de Fotos */}
          <StagePhotos 
            stageId={stage.id} 
            projectId={projectId} 
            initialFiles={(stage as any).files || []} 
          />

          {/* Retraso */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, tiene_retraso: !p.tiene_retraso }))}
              className={cn(
                "flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-colors",
                form.tiene_retraso ? "text-amber-700" : "text-slate-400"
              )}
            >
              <AlertTriangle className={cn("w-4 h-4", form.tiene_retraso ? "text-amber-500" : "text-slate-300")} />
              {form.tiene_retraso ? "Retraso activo" : "Marcar como retrasada"}
            </button>
            {form.tiene_retraso && (
              <Input
                className="flex-1 h-8 text-xs rounded-lg bg-white border-amber-200"
                placeholder="Motivo del retraso..."
                value={form.motivo_retraso ?? ""}
                onChange={e => setForm(p => ({ ...p, motivo_retraso: e.target.value }))}
              />
            )}
          </div>

          {/* Guardar */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="rounded-xl px-8 font-black uppercase tracking-wider text-[11px] bg-brand-indigo text-white shadow-lg shadow-brand-indigo/20"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Save className="w-3.5 h-3.5 mr-2" />}
              Guardar Cambios
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function StagesManager({ stages, projectId }: { stages: ObraStage[]; projectId: string }) {
  const [key, setKey] = useState(0); // force re-fetch hint for parent
  const [isImporting, setIsImporting] = useState(false);

  const handleImportDefault = async () => {
    if (!confirm("¿Cargar las etapas estándar para este proyecto?")) return;
    
    setIsImporting(true);
    try {
      const res = await fetch(`/api/obras/${projectId}/stages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: 'default' }),
      });
      if (res.ok) {
        window.location.reload(); // Refresh to show new stages
      } else {
        alert("Error al cargar etapas");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-3">
      {stages.map(stage => (
        <StageRow
          key={`${stage.id}-${key}`}
          stage={stage}
          projectId={projectId}
          onSaved={() => setKey(k => k + 1)}
        />
      ))}
      
      {stages.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-border/60 space-y-6">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
            <Layers className="w-8 h-8" />
          </div>
          <div className="max-w-xs mx-auto space-y-2">
            <p className="font-black text-foreground">Sin etapas definidas</p>
            <p className="text-sm text-muted-foreground font-medium">
              Este proyecto aún no tiene una línea de tiempo. Puedes cargar las etapas estándar de construcción ahora.
            </p>
          </div>
          <Button
            onClick={handleImportDefault}
            disabled={isImporting}
            className="rounded-2xl px-8 font-black uppercase tracking-wider text-xs bg-brand-indigo text-white shadow-xl shadow-brand-indigo/20"
          >
            {isImporting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Cargar Etapas Estándar
          </Button>
        </div>
      )}
    </div>
  );
}
