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
    console.log("Submit clicked", { asunto, mensaje, selectedCount: selectedIds.size });

    if (!asunto || !mensaje) {
      toast.error("Por favor completa el Asunto y el Mensaje.");
      return;
    }
    
    if (selectedIds.size === 0) {
      toast.error("Debes seleccionar al menos un destinatario que tenga correo electrónico.");
      return;
    }

    const ok = confirm(`¿Estás seguro de enviar este mensaje a las ${selectedIds.size} constructoras seleccionadas?`);
    if (!ok) return;

    setLoading(true);
    const toastId = toast.loading("Enviando correos masivos...");
    
    try {
      const formData = new FormData();
      formData.append("asunto", asunto);
      formData.append("mensaje", mensaje);
      formData.append("audiencia", "seleccion_manual");
      formData.append("selected_ids", JSON.stringify(Array.from(selectedIds)));

      const result = await sendBulkEmail(formData);
      setLoading(false);

      if (result.success) {
        toast.success(`¡Mensaje enviado con éxito a ${result.count} destinatarios!`, { id: toastId });
        setAsunto("");
        setMensaje("");
        setSelectedIds(new Set());
      } else {
        toast.error(result.error || "Algo salió mal en el servidor", { id: toastId });
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Error in handleSubmit:", error);
      toast.error("Error inesperado al intentar enviar: " + error.message, { id: toastId });
    }
  };

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
              <h2 className="text-2xl font-heading font-black tracking-tight">Segmentación Avanzada</h2>
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
                className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border/40 bg-muted/20 hover:bg-muted/40 transition-all text-muted-foreground hover:text-foreground"
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
             
             <div className="border border-border/30 rounded-2xl h-[250px] overflow-y-auto bg-muted/5 p-2 space-y-1">
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
             <p className="text-[10px] font-bold text-muted-foreground opacity-60 ml-2">
                Seleccionados: {selectedIds.size} de {constructoras.length} empresas.
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
               <Label htmlFor="asunto" className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Asunto</Label>
               <Input 
                  id="asunto"
                  placeholder="Mensaje importante para tu constructora..."
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  className="h-14 rounded-2xl bg-muted/20 border-border/40 font-bold"
               />
            </div>

            <div className="space-y-3">
               <Label htmlFor="mensaje" className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Cuerpo del Mensaje</Label>
               <Textarea 
                  id="mensaje"
                  placeholder="Contenido del anuncio..."
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  className="min-h-[160px] rounded-3xl bg-muted/20 border-border/40 p-5 resize-none font-medium leading-relaxed"
               />
            </div>

            <Button 
              disabled={loading}
              className="w-full h-16 rounded-2xl brand-gradient text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.01] transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <span className="flex items-center gap-2">
                  Enviar a {selectedIds.size} destinatarios <Send className="w-4 h-4" />
                </span>
              )}
            </Button>
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

           <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden flex flex-col">
              <div className="bg-[#1a1b26] p-6 text-center">
                 <h1 className="text-white text-lg font-black tracking-tight m-0">SolocasasChile</h1>
              </div>
              <div className="flex-1 p-6 overflow-y-auto whitespace-pre-line text-xs text-zinc-700 leading-relaxed">
                 {asunto && <div className="font-black text-zinc-900 border-b border-zinc-100 pb-3 mb-4 text-sm">{asunto}</div>}
                 {mensaje || "Escribe el mensaje para previsualizar aquí..."}
              </div>
              <div className="bg-zinc-50 p-4 text-center border-t border-zinc-100">
                 <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Enviado por SolocasasChile.com</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
