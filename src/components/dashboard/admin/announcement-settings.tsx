'use client'

import { useState } from 'react'
import { Megaphone, Save, CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react'
import { updateSiteSettings } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function AnnouncementSettings({ initialSettings }: { initialSettings: any }) {
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setLoading(true)
    setSuccess(false)
    setError(null)
    try {
      await updateSiteSettings('announcement_bar', settings)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const themes: Record<string, string> = {
    brand: "bg-brand-indigo text-white",
    dark: "bg-slate-950 text-white",
    emerald: "bg-emerald-600 text-white"
  }

  return (
    <div className="space-y-10">
      {/* Preview Section */}
      <div className="space-y-3">
        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Vista Previa (En Vivo)</Label>
        <div className="relative group perspective-1000">
          <div className={cn(
            "h-[50px] w-full flex items-center justify-center px-4 rounded-2xl shadow-xl transition-all duration-500 overflow-hidden",
            settings.active ? themes[settings.theme || 'brand'] : "bg-muted text-muted-foreground opacity-50 grayscale"
          )}>
             {/* Background decoration */}
             {settings.active && (
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-32 h-full bg-white/40 skew-x-12 -translate-x-1/2"></div>
                <div className="absolute top-0 left-3/4 w-16 h-full bg-white/20 skew-x-12 -translate-x-1/2"></div>
              </div>
            )}

            <div className="flex items-center gap-2 relative z-10 text-xs md:text-sm font-bold tracking-tight">
               <Megaphone className="w-4 h-4" />
               <span>{settings.text}</span>
               {settings.link && (
                 <span className="flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm ml-2">
                   {settings.buttonText || 'Ver más'}
                   <ArrowRight className="w-3 h-3" />
                 </span>
               )}
            </div>
            {!settings.active && <span className="absolute z-10 text-[10px] uppercase font-black tracking-widest bg-background/50 px-3 py-1 rounded-full border border-border/50">Desactivado</span>}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/20 border border-border/10 rounded-2xl">
            <div className="space-y-0.5">
              <Label className="text-base font-bold tracking-tight mb-1 cursor-pointer" htmlFor="active">Estado Visible</Label>
              <p className="text-xs text-muted-foreground">Activa o desactiva la barra para los visitantes.</p>
            </div>
            <Switch 
              id="active"
              checked={settings.active} 
              onCheckedChange={(v: boolean) => setSettings({...settings, active: v})} 
            />
          </div>

          <div className="space-y-2.5">
            <Label className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Mensaje del Anuncio</Label>
            <Input 
              value={settings.text} 
              onChange={(e) => setSettings({...settings, text: e.target.value})} 
              placeholder="Ej: ¡Nuevo modelo SIP Premium ya disponible!"
              className="h-12 bg-background border-border/40 focus:ring-primary/20 rounded-xl font-medium"
            />
          </div>

          <div className="space-y-2.5">
            <Label className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Tema Visual</Label>
            <Select 
              value={settings.theme} 
              onValueChange={(v: string) => setSettings({...settings, theme: v})}
            >
              <SelectTrigger className="h-12 bg-background border-border/40 rounded-xl font-bold">
                <SelectValue placeholder="Selecciona un tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brand">Corporativo (Degradado)</SelectItem>
                <SelectItem value="dark">Elegante (Oscuro)</SelectItem>
                <SelectItem value="emerald">Éxito (Verde Esmeralda)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2.5">
            <Label className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Enlace (Opcional)</Label>
            <Input 
              value={settings.link} 
              onChange={(e) => setSettings({...settings, link: e.target.value})} 
              placeholder="Ej: /catalogo/m0"
              className="h-12 bg-background border-border/40 focus:ring-primary/20 rounded-xl font-medium"
            />
          </div>

          <div className="space-y-2.5">
            <Label className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Texto del Botón</Label>
            <Input 
              value={settings.buttonText} 
              onChange={(e) => setSettings({...settings, buttonText: e.target.value})} 
              placeholder="Ej: Ver más"
              className="h-12 bg-background border-border/40 focus:ring-primary/20 rounded-xl font-medium"
            />
          </div>

          <div className="pt-2">
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="w-full h-14 bg-brand-indigo text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {loading ? (
                 <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : success ? (
                <CheckCircle2 className="w-5 h-5 mr-2" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {loading ? 'Guardando...' : success ? 'Configuración Guardada' : 'Publicar Cambios'}
            </Button>
            
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl flex items-center gap-2 text-xs font-bold leading-tight">
                <XCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
