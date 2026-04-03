'use client';

import { useEffect, useState, useRef } from 'react';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { incrementModelView } from '@/lib/supabase/actions';

interface DynamicUrgencyProps {
  className?: string;
  variant?: 'compact' | 'full';
  modeloId: string;
  initialCount?: number;
}

export function DynamicUrgency({ className, variant = 'full', modeloId, initialCount = 0 }: DynamicUrgencyProps) {
  const [count, setCount] = useState<number>(initialCount);
  const incremented = useRef(false);

  useEffect(() => {
    if (!incremented.current) {
      incremented.current = true;
      // Incrementa optimísticamente en la UI
      setCount(prev => prev + 1);
      // Registra en DB real
      incrementModelView(modeloId);
    }
  }, [modeloId]);

  if (count <= 0) return null;

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-3 text-[10px] text-muted-foreground font-medium bg-muted/20 p-3 rounded-lg border border-border/10", className)}>
        <Zap className="w-4 h-4 text-amber-500 fill-current animate-pulse shrink-0" />
        <span>Alta Demanda: {count} {count === 1 ? 'persona vio' : 'personas vieron'} esto</span>
      </div>
    );
  }

  return (
    <div className={cn("bg-muted/20 rounded-2xl p-4 flex items-center gap-4 border border-border/20", className)}>
      <div className="w-10 h-10 rounded-xl bg-brand-indigo flex items-center justify-center text-white shrink-0">
        <Zap className="w-5 h-5 fill-current" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
          {count > 20 ? 'Alta Demanda' : 'En Tendencia'}
        </p>
        <p className="text-base font-bold text-muted-foreground">
          {count} {count === 1 ? 'persona vio' : 'personas vieron'} este diseño
        </p>
      </div>
    </div>
  );
}

