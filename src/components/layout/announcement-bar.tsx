'use client'

import { useState, useEffect } from 'react'
import { X, Megaphone, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false)
  const [settings, setSettings] = useState<{
    active: boolean;
    text: string;
    link?: string;
    buttonText?: string;
    theme?: 'brand' | 'dark' | 'emerald';
  } | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient()
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'announcement_bar')
        .maybeSingle()

      if (data?.value && data.value.active) {
        setSettings(data.value)
        setIsVisible(true)
      }
    }
    fetchSettings()
  }, [])

  useEffect(() => {
    if (isVisible && settings?.active) {
      document.body.classList.add('has-announcement-bar');
    } else {
      document.body.classList.remove('has-announcement-bar');
    }
    return () => document.body.classList.remove('has-announcement-bar');
  }, [isVisible, settings?.active]);

  if (!isVisible || !settings?.active) return null

  const themes = {
    brand: "bg-brand-indigo text-white",
    dark: "bg-slate-950 text-white",
    emerald: "bg-emerald-600 text-white"
  }

  return (
    <div id="announcement-bar" className={cn(
      "fixed top-0 left-0 right-0 z-[150] h-[40px] md:h-[50px] w-full flex items-center justify-center px-4 overflow-hidden transition-all duration-500 animate-in slide-in-from-top shadow-md",
      themes[settings.theme || 'brand']
    )}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-full bg-white/40 skew-x-12 -translate-x-1/2"></div>
        <div className="absolute top-0 left-3/4 w-16 h-full bg-white/20 skew-x-12 -translate-x-1/2"></div>
      </div>

      <div className="flex items-center gap-3 relative z-10 w-full max-w-7xl mx-auto justify-center">
        <div className="hidden md:flex w-8 h-8 rounded-full bg-white/20 items-center justify-center backdrop-blur-sm shrink-0">
           <Megaphone className="w-4 h-4" />
        </div>
        
        <p className="text-[11px] md:text-sm font-bold tracking-tight text-center truncate pr-8 md:pr-0">
          {settings.text}
        </p>

        {settings.link && (
          <Link 
            href={settings.link} 
            className="hidden md:flex items-center gap-1.5 bg-white text-primary px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-black/10 shrink-0"
          >
            {settings.buttonText || 'Ver más'}
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-2 md:right-4 w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all shrink-0 z-20"
        aria-label="Cerrar anuncio"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
