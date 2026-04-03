'use client';

import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function PromotionCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // Fecha fin: 30 de Abril 2026 a las 23:59:59
    const targetDate = new Date('2026-04-30T23:59:59').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 bg-brand-indigo/10 backdrop-blur-md border border-brand-indigo/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-brand-indigo/10">
      <div className="text-center">
        <p className="text-3xl sm:text-5xl font-black tracking-tighter text-brand-indigo">{timeLeft.days}</p>
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60">Días</p>
      </div>
      <div className="h-10 w-px bg-brand-indigo/20 hidden sm:block" />
      <div className="text-center">
        <p className="text-3xl sm:text-5xl font-black tracking-tighter text-brand-indigo">{String(timeLeft.hours).padStart(2, '0')}</p>
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60">Hrs</p>
      </div>
      <div className="h-10 w-px bg-brand-indigo/20 hidden sm:block" />
      <div className="text-center">
        <p className="text-3xl sm:text-5xl font-black tracking-tighter text-brand-indigo">{String(timeLeft.minutes).padStart(2, '0')}</p>
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60">Min</p>
      </div>
      <div className="h-10 w-px bg-brand-indigo/20 hidden sm:block" />
      <div className="text-center">
        <p className="text-3xl sm:text-5xl font-black tracking-tighter text-brand-indigo">{String(timeLeft.seconds).padStart(2, '0')}</p>
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60">Seg</p>
      </div>
    </div>
  );
}
