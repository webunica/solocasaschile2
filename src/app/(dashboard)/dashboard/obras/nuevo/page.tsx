"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, HardHat, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import type { ObraProjectPrioridad } from "@/types/obra";
import { REGIONES_CHILE } from "@/config/regions";

export default function NuevoProyectoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    codigo_interno: "",
    modelo_id: "ninguno",
    tipo_construccion: "",
    region: "",
    comuna: "",
    direccion_referencia: "",
    fecha_inicio_estimada: "",
    fecha_termino_estimada: "",
    ejecutivo_responsable: "",
    observaciones_generales: "",
    prioridad: "normal" as ObraProjectPrioridad,
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const [modelos, setModelos] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<any | null>(null);

  useEffect(() => {
    const fetchModelos = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: profile } = await supabase.from('constructoras').select('role').eq('id', user.id).maybeSingle();
      const isSuperAdmin = profile?.role === 'superadmin' || user.app_metadata?.is_superadmin === true;

      let query = supabase
        .from("modelos")
        .select("id, nombre, tipo, superficie_m2, dormitorios, banos, construccion, terminaciones, aislacion, instalaciones, constructora:constructoras(nombre)")
        .order("nombre", { ascending: true });
        
      if (!isSuperAdmin) {
        query = query.eq("constructora_id", user.id);
      }
        
      const { data } = await query;
      if (data) setModelos(data);
    };
    fetchModelos();
  }, []);

  const handleModelChange = (id: string) => {
    if (id === "ninguno") {
      setForm(prev => ({ ...prev, modelo_id: "ninguno" }));
      setSelectedModel(null);
      return;
    }
    const model = modelos.find(m => m.id === id);
    if (!model) return;
    
    setSelectedModel(model);
    setForm(prev => ({
      ...prev,
      modelo_id: id,
      tipo_construccion: model.tipo ? model.tipo.toLowerCase().replace(/ /g, '-') : prev.tipo_construccion
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre) return;
    setLoading(true);

    try {
      const payload = {
        ...form,
        modelo_id: form.modelo_id === "ninguno" ? undefined : form.modelo_id
      };

      const res = await fetch("/api/obras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess(true);
        setTimeout(() => router.push(`/dashboard/obras/${data.id}`), 1200);
      }
    } catch (err) {
      console.error("Error creating project:", err);
    } finally {
      setLoading(false);
    }
  };

  const TIPOS = [
    "Prefabricada", "Panel SIP", "Modular", "Container",
    "Steel Framing", "Madera", "Hormigón", "Mixto", "Otro"
  ];

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <p className="text-xl font-black text-foreground">¡Proyecto creado exitosamente!</p>
        <p className="text-sm text-muted-foreground font-medium">Redirigiendo al detalle...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/dashboard/obras" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-brand-indigo transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a Proyectos
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-indigo/10 flex items-center justify-center">
            <HardHat className="w-5 h-5 text-brand-indigo" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-black tracking-tight">Nuevo Proyecto de Obra</h1>
            <p className="text-sm text-muted-foreground font-medium">Completa la información para crear un nuevo seguimiento</p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Datos principales */}
        <div className="p-8 rounded-[2rem] bg-white border border-border/40 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-brand-indigo/60">Datos del Proyecto</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Modelo Asociado (Opcional)</Label>
              <Select value={form.modelo_id} onValueChange={(v: string | null) => handleModelChange(v ?? "ninguno")}>
                <SelectTrigger className="w-full h-12 rounded-xl">
                  <SelectValue placeholder="Seleccionar modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ninguno">Ningún modelo (A medida)</SelectItem>
                  {modelos.map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nombre} {m.constructora ? `(${m.constructora.nombre})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nombre del Proyecto *</Label>
              <Input
                placeholder="Ej: Casa Modelo Alerce - Fam. González"
                value={form.nombre}
                onChange={e => handleChange("nombre", e.target.value)}
                required
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Código Interno</Label>
              <Input
                placeholder="Ej: PRJ-2026-001"
                value={form.codigo_interno}
                onChange={e => handleChange("codigo_interno", e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tipo de Construcción</Label>
              <Select value={form.tipo_construccion} onValueChange={(v: string | null) => handleChange("tipo_construccion", v ?? "")}>
                <SelectTrigger className="w-full h-12 rounded-xl">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS.map(t => (
                    <SelectItem key={t} value={t.toLowerCase().replace(/ /g, '-')}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Model Data Preview */}
        {selectedModel && (
          <div className="p-8 rounded-[2rem] bg-brand-indigo/5 border border-brand-indigo/10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-indigo/20 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-brand-indigo" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-brand-indigo">Especificaciones a importar</h3>
            </div>
            <p className="text-sm text-brand-indigo/70 font-medium">Al crear el proyecto, estos datos técnicos del modelo se cargarán automáticamente como elementos gestionables (checklists de estado) dentro de su ficha de seguimiento.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-brand-indigo/10">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase text-brand-indigo/40 tracking-widest">Sup. M2</p>
                <p className="text-sm font-bold text-brand-indigo">{selectedModel.superficie_m2 || "--"} m²</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase text-brand-indigo/40 tracking-widest">Dormitorios</p>
                <p className="text-sm font-bold text-brand-indigo">{selectedModel.dormitorios || "--"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase text-brand-indigo/40 tracking-widest">Baños</p>
                <p className="text-sm font-bold text-brand-indigo">{selectedModel.banos || "--"}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-sm">
              {['construccion', 'terminaciones', 'aislacion', 'instalaciones'].map((cat) => {
                const data = selectedModel[cat];
                if (!data || Object.keys(data).filter(k => k !== 'notas' && data[k]).length === 0) return null;
                return (
                  <div key={cat} className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest text-brand-indigo/50 bg-white/50 inline-block px-3 py-1 rounded-full">{cat}</p>
                    <ul className="space-y-2">
                      {Object.entries(data).filter(([k,v]) => k !== 'notas' && v).map(([key, value]) => (
                        <li key={key} className="flex gap-2 text-brand-indigo font-medium">
                          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-brand-teal mt-1.5" />
                          <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                          <span className="text-brand-indigo/70 font-normal">{String(value)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ubicación */}
        <div className="p-8 rounded-[2rem] bg-white border border-border/40 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-brand-indigo/60">Ubicación</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Región</Label>
              <Select value={form.region} onValueChange={(v: string | null) => handleChange("region", v ?? "")}>
                <SelectTrigger className="w-full h-12 rounded-xl">
                  <SelectValue placeholder="Seleccionar región" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONES_CHILE.map((r: string) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Comuna</Label>
              <Input
                placeholder="Ej: Temuco"
                value={form.comuna}
                onChange={e => handleChange("comuna", e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Dirección / Referencia de Terreno</Label>
              <Input
                placeholder="Ej: Parcela 12, camino a Maquehue km 5"
                value={form.direccion_referencia}
                onChange={e => handleChange("direccion_referencia", e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Fechas y prioridad */}
        <div className="p-8 rounded-[2rem] bg-white border border-border/40 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-brand-indigo/60">Planificación</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Fecha Inicio Estimada</Label>
              <Input
                type="date"
                value={form.fecha_inicio_estimada}
                onChange={e => handleChange("fecha_inicio_estimada", e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Fecha Término Estimada</Label>
              <Input
                type="date"
                value={form.fecha_termino_estimada}
                onChange={e => handleChange("fecha_termino_estimada", e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Prioridad</Label>
              <Select value={form.prioridad} onValueChange={(v: string | null) => handleChange("prioridad", v ?? "")}>
                <SelectTrigger className="w-full h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Responsable y notas */}
        <div className="p-8 rounded-[2rem] bg-white border border-border/40 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-brand-indigo/60">Responsable y Notas</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Ejecutivo Responsable</Label>
              <Input
                placeholder="Nombre del responsable"
                value={form.ejecutivo_responsable}
                onChange={e => handleChange("ejecutivo_responsable", e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Observaciones Generales</Label>
            <Textarea
              placeholder="Notas internas sobre el proyecto..."
              value={form.observaciones_generales}
              onChange={e => handleChange("observaciones_generales", e.target.value)}
              rows={4}
              className="rounded-xl resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard/obras">
            <Button type="button" variant="outline" className="rounded-xl h-12 px-8 font-bold">
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading || !form.nombre}
            className="rounded-xl h-12 px-10 font-black uppercase tracking-wider bg-brand-indigo shadow-xl shadow-brand-indigo/20 text-white"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Crear Proyecto
          </Button>
        </div>
      </form>
    </div>
  );
}
