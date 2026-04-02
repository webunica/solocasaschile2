"use client";

import { useState } from "react";
import { 
  CheckCircle2, XCircle, Star, ShieldCheck, 
  Trash2, Loader2, Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  toggleVerification, 
  updateConstructoraPlan, 
  updateConstructoraScore 
} from "@/lib/supabase/actions";
import { toast } from "sonner";

interface Props {
  constructora: any;
}

export function ConstructoraAdminControls({ constructora }: Props) {
  const [loading, setLoading] = useState(false);

  const onToggleVerify = async () => {
    setLoading(true);
    try {
      await toggleVerification(constructora.id, !constructora.verificada);
      toast.success(constructora.verificada ? "Verificación removida" : "Constructora verificada con éxito");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onChangePlan = async (plan: string) => {
    setLoading(true);
    try {
      await updateConstructoraPlan(constructora.id, plan);
      toast.success(`Plan actualizado a ${plan.toUpperCase()}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateScore = async () => {
    const newScore = prompt("Introduce el nuevo Score de Confianza (0-100):", constructora.score_confianza);
    if (!newScore) return;
    
    setLoading(true);
    try {
      await updateConstructoraScore(constructora.id, parseInt(newScore));
      toast.success("Score actualizado correctamente");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button 
        variant={constructora.verificada ? "outline" : "default"} 
        size="sm"
        disabled={loading}
        onClick={onToggleVerify}
        className={constructora.verificada 
          ? "border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 bg-emerald-50/20" 
          : "bg-brand-indigo"}
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : (constructora.verificada ? <XCircle className="w-3 h-3 mr-2" /> : <ShieldCheck className="w-3 h-3 mr-2" />)}
        {constructora.verificada ? "Quitar Verificación" : "Verificar"}
      </Button>

      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/50">
        {['gratis', 'pro', 'premium'].map((p) => (
          <Button
            key={p}
            size="sm"
            variant="ghost"
            disabled={loading}
            onClick={() => onChangePlan(p)}
            className={`h-8 px-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
              constructora.plan === p ? "bg-background shadow-sm text-primary" : "text-muted-foreground opacity-50"
            }`}
          >
            {p}
          </Button>
        ))}
      </div>

      <Button 
        variant="outline" 
        size="sm"
        disabled={loading}
        onClick={onUpdateScore}
        className="h-9 rounded-xl border-dashed border-primary/20 hover:border-primary/60"
      >
        <Star className="w-3 h-3 mr-2 text-primary" />
        Score: {constructora.score_confianza}
      </Button>
    </div>
  );
}
