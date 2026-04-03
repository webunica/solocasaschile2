'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DynamicUrgencyProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export function DynamicUrgency({ className, variant = 'full' }: DynamicUrgencyProps) {
  const [count, setCount] = useState<number>(3); // Initial placeholder

  useEffect(() => {
    // Generate a random number between 2 and 6
    const randomCount = Math.floor(Math.random() * 5) + 2;
    setCount(randomCount);
  }, []);

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-3 text-[10px] text-muted-foreground font-medium bg-muted/20 p-3 rounded-lg border border-border/10", className)}>
        <Zap className="w-4 h-4 text-amber-500 fill-current animate-pulse" />
        <span>Alta Demanda: {count} cotizaciones hoy</span>
      </div>
    );
  }

  return (
    <div className={cn("bg-muted/20 rounded-2xl p-4 flex items-center gap-4 border border-border/20", className)}>
      <div className="w-10 h-10 rounded-xl bg-brand-indigo flex items-center justify-center text-white shrink-0">
        <Zap className="w-5 h-5 fill-current" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Alta Demanda</p>
        <p className="text-base font-bold text-muted-foreground">{count} personas cotizaron hoy</p>
      </div>
    </div>
  );
}
