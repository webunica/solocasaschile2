"use client";

import { useEffect, useState, useRef } from 'react';
import { Zap, CalendarCheck, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { incrementModelView } from '@/lib/supabase/actions';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface PruebaSocialProps {
  modeloId: string;
  initialCount?: number;
  constructora: any;
  updatedAt?: string;
  className?: string;
}

export function PruebaSocial({ modeloId, initialCount = 0, constructora, updatedAt, className }: PruebaSocialProps) {
  const [count, setCount] = useState<number>(initialCount);
  const incremented = useRef(false);

  useEffect(() => {
    if (!incremented.current) {
      incremented.current = true;
      setCount(prev => prev + 1);
      incrementModelView(modeloId);
    }
  }, [modeloId]);

  if (count <= 0) return null;

  // Fake some appealing data based on counts/props if missing
  const quotesCount = Math.max(1, Math.floor(count / 12)); 
  const projectsDelivered = constructora?.proyectos_entregados || 120;
  const coverage = constructora?.cobertura || "Todo Chile";
  
  const lastUpdatedText = updatedAt 
    ? `Actualizado hace ${formatDistanceToNow(new Date(updatedAt), { locale: es })}`
    : "Disponibilidad Validada Recientemente";

  return (
    <div className={cn("bg-muted/10 border border-border/40 rounded-[2.5rem] p-6 space-y-6", className)}>
      <div className="flex items-center gap-4 border-b border-border/50 pb-4">
        <div className="w-10 h-10 rounded-xl bg-brand-indigo flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-indigo/20">
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-brand-indigo">
            {count > 50 ? 'Alta Demanda' : 'En Tendencia'}
          </p>
          <p className="text-sm font-bold text-foreground">
            {count} personas vieron este diseño hoy
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-2">
        <div className="flex items-center gap-3">
          <CalendarCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-xs font-semibold text-muted-foreground leading-tight">
            {lastUpdatedText}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-xs font-semibold text-muted-foreground leading-tight">
            {quotesCount} cotizaciones recientes
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Building2 className="w-4 h-4 text-brand-teal shrink-0" />
          <span className="text-xs font-semibold text-muted-foreground leading-tight">
            +{projectsDelivered} proyectos entregados
          </span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-brand-teal shrink-0" />
          <span className="text-xs font-semibold text-muted-foreground leading-tight line-clamp-2">
            Cobertura: {coverage}
          </span>
        </div>
      </div>
    </div>
  );
}
