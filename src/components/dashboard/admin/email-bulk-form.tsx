"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Users, Send, CheckCircle2, 
  AlertCircle, Smartphone, Eye, History,
  Loader2, ArrowRight, Search, Check, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { sendBulkEmail } from "@/lib/supabase/actions";
import { toast } from "sonner";

interface Constructora {
  id: string;
  nombre: string;
  email: string | null;
  plan: string;
}

export function EmailBulkForm({ constructoras }: { constructoras: Constructora[] }) {
  const [loading, setLoading] = useState(false);
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [previewMode, setPreviewMode] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  const filteredList = useMemo(() => {
    return constructoras.filter(c => 
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (c.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [constructoras, searchTerm]);

  const selectByPlan = (plan: string) => {
    const list = plan === 'todos' 
      ? constructoras.filter(c => !!c.email)
      : constructoras.filter(c => c.plan === plan && !!c.email);
    
    setSelectedIds(new Set(list.map(c => c.id)));
  };

  const toggleSelection = (id: string, hasEmail: boolean) => {
    if (!hasEmail) return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!asunto || !mensaje) return toast.error("Por favor completa el Asunto y el Mensaje.");
    if (selectedIds.size === 0) return toast.error("Selecciona al menos un destinatario con correo.");

    const ok = confirm(`¿Estás seguro de enviar este mensaje a las ${selectedIds.size} constructoras seleccionadas?`);
    if (!ok) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("asunto", asunto);
      formData.append("mensaje", mensaje);
      formData.append("audiencia", "seleccion_manual");
      formData.append("selected_ids", JSON.stringify(Array.from(selectedIds)));

      const result = await sendBulkEmail(formData);
      if (result.success) {
        setSentCount(result.count);
        setShowSuccess(true);
        
        // Confeti Celebration
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0b9e86', '#1a1b26', '#ffffff']
        });

        setAsunto("");
        setMensaje("");
        setSelectedIds(new Set());
      } else {
        toast.error(result.error || "Algo salió mal en el envío.");
      }
    } catch (error: any) {
      console.error("Error en el envío:", error);
      toast.error("Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-emerald-500/20 rounded-[2.5rem] p-12 text-center space-y-6 shadow-2xl shadow-emerald-500/10 min-h-[500px] flex flex-col items-center justify-center"
      >
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4">
           <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <div className="space-y-2">
           <h2 className="text-3xl font-heading font-black tracking-tight text-foreground">¡Anuncio Enviado!</h2>
           <p className="text-muted-foreground font-medium max-w-sm mx-auto">
             Tu mensaje ha sido entregado correctamente a <span className="text-foreground font-black">{sentCount} empresas</span> seleccionadas.
           </p>
        </div>
        <div className="pt-4">
          <Button 
            onClick={() => setShowSuccess(false)}
            className="h-14 px-10 rounded-2xl bg-brand-indigo text-white font-bold uppercase tracking-widest hover:scale-105 transition-transform"
          >
             Redactar otro mensaje
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Form Side */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/[0.02] space-y-8"
      >
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Mail className="w-6 h-6" />
           </div>
           <div>
              <h2 className="text-2xl font-heading font-black tracking-tight">Nueva Comunicación</h2>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">Selecciona destinatarios específicos</p>
           </div>
        </div>

        <div className="space-y-6">
          {/* Quick Select Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['todos', 'gratis', 'pro', 'premium'].map((p) => (
              <button
                key={p}
                onClick={() => selectByPlan(p)}
                className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border/40 bg-muted/20 hover:bg-muted/40 transition-all text-muted-foreground hover:text-foreground italic"
              >
                Cargar {p}
              </button>
            ))}
          </div>

          {/* List Selection Area */}
          <div className="space-y-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                <Input 
                   placeholder="Buscar empresa o email..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="pl-10 h-11 rounded-xl bg-muted/10 border-border/30"
                />
             </div>
             
             <div className="border border-border/30 rounded-2xl h-[220px] overflow-y-auto bg-muted/5 p-2 space-y-1">
                {filteredList.map(c => {
                  const hasEmail = !!c.email;
                  const isSelected = selectedIds.has(c.id);
                  return (
                    <div 
                      key={c.id} 
                      onClick={() => toggleSelection(c.id, hasEmail)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border",
                        !hasEmail ? "opacity-40 grayscale cursor-not-allowed border-transparent" : 
                        isSelected ? "bg-primary/10 border-primary/20" : "hover:bg-muted border-transparent"
                      )}
                    >
                       <div className="flex items-center gap-3 min-w-0">
                          <div className={cn(
                            "w-5 h-5 rounded flex items-center justify-center border",
                            isSelected ? "bg-primary border-primary text-white" : "border-border/60"
                          )}>
                             {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div className="truncate">
                             <p className="text-xs font-black truncate">{c.nombre}</p>
                             <p className="text-[10px] text-muted-foreground font-medium truncate">{c.email || '⚠️ Sin correo registrado'}</p>
                          </div>
                       </div>
                       <Badge variant="outline" className="text-[8px] font-black uppercase h-5 px-1.5 opacity-60">
                          {c.plan}
                       </Badge>
                    </div>
                  );
                })}
             </div>
             <div className="flex justify-between items-center px-1">
                <p className="text-[10px] font-bold text-muted-foreground opacity-60">
                    Seleccionados: <span className="text-foreground">{selectedIds.size}</span> de {constructoras.length}
                </p>
                {selectedIds.size > 0 && (
                  <button onClick={() => setSelectedIds(new Set())} className="text-[9px] font-black uppercase text-destructive hover:underline">Limpiar</button>
                )}
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
               <Label htmlFor="asunto" className="text-[10px] font-black uppercase tracking-widest opacity-60">Asunto del correo</Label>
               <Input 
                  id="asunto"
                  placeholder="Escribe el asunto aquí..."
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  className="h-14 rounded-2xl bg-muted/20 border-border/40 font-bold"
               />
            </div>

            <div className="space-y-3">
               <Label htmlFor="mensaje" className="text-[10px] font-black uppercase tracking-widest opacity-60">Mensaje Central</Label>
               <Textarea 
                  id="mensaje"
                  placeholder="Redacta el mensaje masivo..."
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  className="min-h-[140px] rounded-3xl bg-muted/20 border-border/40 p-5 resize-none font-medium leading-relaxed"
               />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-16 rounded-2xl bg-brand-indigo text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2",
                loading ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.01] active:scale-95 shadow-primary/20"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  Enviar a {selectedIds.size} empresas <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>

      {/* Preview Side (Mobile Mockup) */}
      <div className="sticky top-24 hidden lg:flex flex-col items-center">
        <div className="mb-6 flex items-center gap-3 bg-muted/30 p-1 rounded-full border border-border/40">
           <button 
             onClick={() => setPreviewMode(true)}
             className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", previewMode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}
           >
              Mobile Preview
           </button>
           <button 
             onClick={() => setPreviewMode(false)}
             className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", !previewMode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}
           >
              Raw HTML View
           </button>
        </div>

        <div className="relative w-[320px] h-[640px] bg-zinc-900 rounded-[3rem] p-3 shadow-[0_0_0_8px_#18181b,0_20px_50px_rgba(0,0,0,0.3)] border-[2px] border-zinc-800">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-20 flex items-center justify-center">
              <div className="w-10 h-1 bg-zinc-800 rounded-full" />
           </div>

           <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden flex flex-col border border-slate-200">
              <div className="bg-white p-5 text-center border-b-[3px] border-brand-teal flex justify-center items-center">
                 {/* Simulate Logo */}
                 <img src="/images/logo.png" alt="Logo" className="h-5 w-auto object-contain opacity-90" />
              </div>
              <div className="flex-1 p-5 overflow-y-auto whitespace-pre-line text-[11px] text-slate-700 leading-relaxed font-medium">
                 {asunto && <div className="font-black text-slate-900 border-b border-slate-100 pb-3 mb-3 text-[13px] leading-tight">{asunto}</div>}
                 {mensaje || "El contenido del correo aparecerá aquí..."}
              </div>
              <div className="bg-slate-50 p-4 text-center border-t border-slate-200">
                 <p className="text-[9px] text-slate-400 font-bold tracking-tight leading-none">
                   Enviado por <span className="text-brand-teal">SolocasasChile.com</span>
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
