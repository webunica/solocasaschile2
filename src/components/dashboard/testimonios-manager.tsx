"use client";

import { useState } from "react";
import { updateTestimonios } from "@/lib/supabase/actions";
import { 
  Quote, Plus, Trash2, Star, Save, 
  CheckCircle2, AlertCircle, Loader2, User, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Testimonio {
  nombre: string;
  texto: string;
  cargo: string;
  estrellas: number;
  modelo_id?: string;
}

interface TestimoniosManagerProps {
  initialTestimonios: Testimonio[];
  models: any[];
}

export function TestimoniosManager({ initialTestimonios, models }: TestimoniosManagerProps) {
  const [testimonios, setTestimonios] = useState<Testimonio[]>(initialTestimonios || []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const addTestimonio = () => {
    setTestimonios([{ nombre: "", texto: "", cargo: "", estrellas: 5, modelo_id: "general" }, ...testimonios]);
  };

  const removeTestimonio = (index: number) => {
    setTestimonios(testimonios.filter((_, i) => i !== index));
  };

  const updateTestimonio = (index: number, field: keyof Testimonio, value: string | number) => {
    const newTestimonios = [...testimonios];
    (newTestimonios[index] as any)[field] = value;
    setTestimonios(newTestimonios);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    const result = await updateTestimonios(testimonios);
    if (result.success) {
      setMessage({ type: "success", text: "Testimonios actualizados correctamente." });
    } else {
      setMessage({ type: "error", text: result.error || "Error al guardar los testimonios." });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-heading font-black tracking-tighter italic">Testimonios <span className="gradient-text">Verificados</span></h1>
          <p className="text-muted-foreground font-medium">Gestiona la reputación social de tu constructora.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button 
            onClick={addTestimonio}
            variant="outline"
            className="flex-1 md:flex-none h-12 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest border-brand-indigo/20 text-brand-indigo hover:bg-brand-indigo/5"
          >
            <Plus className="w-4 h-4 mr-2" /> Agregar Nuevo
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading}
            className="flex-1 md:flex-none bg-brand-indigo h-12 px-10 rounded-xl font-black uppercase text-[10px] tracking-widest text-white hover:text-white shadow-xl shadow-brand-indigo/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar Cambios
          </Button>
        </div>
      </div>

      {message && (
        <div className={cn(
          "p-5 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-500",
          message.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
        )}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-xs font-bold uppercase tracking-widest">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {testimonios.map((t, index) => (
          <Card key={index} className="rounded-[3rem] border-border/40 bg-card/40 backdrop-blur-xl relative group transition-all hover:border-brand-indigo/30 shadow-sm hover:shadow-xl">
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-4 flex-1">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => updateTestimonio(index, "estrellas", star)}
                        className="transition-transform hover:scale-125"
                      >
                        <Star className={cn("w-5 h-5 transition-colors", t.estrellas >= star ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20")} />
                      </button>
                    ))}
                  </div>
                  
                  <div className="w-full max-w-[280px]">
                    <label className="text-[9px] font-black uppercase tracking-widest text-brand-indigo mb-1.5 block ml-1">Asignar a Modelo</label>
                    <Select 
                      value={t.modelo_id || "general"} 
                      onValueChange={(val: string) => updateTestimonio(index, "modelo_id", val)}
                    >
                      <SelectTrigger className="h-10 rounded-xl bg-muted/40 border-none font-bold text-xs ring-0 focus:ring-1 focus:ring-brand-indigo/30">
                        <Building2 className="w-3 h-3 mr-2 opacity-40" />
                        <SelectValue placeholder="General (Toda la constructora)" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-border/40 shadow-2xl">
                        <SelectItem value="general" className="rounded-xl font-bold py-3">General (Constructor)</SelectItem>
                        {models.map(m => (
                          <SelectItem key={m.id} value={m.id} className="rounded-xl font-bold py-3 italic">
                             {m.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeTestimonio(index)}
                  className="h-10 w-10 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 ml-2">¿Qué dice el cliente?</label>
                  <Textarea 
                    value={t.texto}
                    onChange={(e) => updateTestimonio(index, "texto", e.target.value)}
                    placeholder="Excelente experiencia, muy profesionales..."
                    className="min-h-[120px] rounded-3xl bg-muted/30 border-none p-6 font-medium italic text-lg resize-none placeholder:text-muted-foreground/30 focus:ring-2 focus:ring-brand-indigo/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 ml-2">Nombre Completo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-40" />
                      <Input 
                        value={t.nombre}
                        onChange={(e) => updateTestimonio(index, "nombre", e.target.value)}
                        placeholder="Juan Pérez"
                        className="h-14 pl-12 rounded-2xl bg-muted/30 border-none font-bold focus:ring-2 focus:ring-brand-indigo/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 ml-2">Referencia / Cargo</label>
                    <Input 
                      value={t.cargo}
                      onChange={(e) => updateTestimonio(index, "cargo", e.target.value)}
                      placeholder="Dueño de Casa Ensenada"
                      className="h-14 rounded-2xl bg-muted/30 border-none font-bold focus:ring-2 focus:ring-brand-indigo/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-10 pointer-events-none opacity-5">
              <Quote className="w-24 h-24 rotate-180" />
            </div>
          </Card>
        ))}

        {testimonios.length === 0 && (
          <div className="col-span-full py-32 text-center border-2 border-dashed border-border/40 rounded-[4rem] bg-muted/5 space-y-6">
             <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mx-auto shadow-inner">
                <Quote className="w-12 h-12 text-muted-foreground opacity-20" />
             </div>
             <div className="space-y-2">
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-40">Sin testimonios publicados</p>
                <p className="text-muted-foreground text-xs font-medium">Empieza a construir tu reputación social agregando tu primer testimonio.</p>
             </div>
             <Button 
                onClick={addTestimonio}
                className="bg-brand-indigo h-12 px-10 rounded-xl font-black uppercase text-[10px] tracking-widest text-white hover:text-white"
             >
                <Plus className="w-4 h-4 mr-2" /> Agregar Primer Testimonio
             </Button>
          </div>
        )}
      </div>
    </div>
  );
}
