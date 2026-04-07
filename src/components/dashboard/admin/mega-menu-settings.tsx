'use client'

import { useState } from 'react'
import { Layout, Save, CheckCircle2, Loader2, Building2, Home } from 'lucide-react'
import { updateSiteSettings } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

export function MegaMenuSettings({ 
  initialSettings, 
  constructoras, 
  modelos 
}: { 
  initialSettings: any, 
  constructoras: any[], 
  modelos: any[] 
}) {
  const [settings, setSettings] = useState({
    featuredConstructoraId: initialSettings?.featuredConstructoraId || initialSettings?.featured_constructora_id || '',
    featuredModeloId: initialSettings?.featuredModeloId || initialSettings?.featured_modelo_id || ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setLoading(true)
    setSuccess(false)
    setError(null)
    try {
      await updateSiteSettings('mega_menu_ads', settings)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-border/10 pb-6">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Publicidad en Mega Menú</h3>
            <p className="text-sm text-muted-foreground">Selecciona qué constructora y qué modelo aparecerán destacados en el menú de navegación principal.</p>
          </div>
          <Layout className="w-8 h-8 text-primary opacity-20" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Constructora Featured */}
          <div className="space-y-4 p-6 bg-muted/20 rounded-2xl border border-border/10">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
              <Building2 className="w-4 h-4" />
              <span>Lado Izquierdo</span>
            </div>
            <div className="space-y-2.5">
              <Label className="text-sm font-bold opacity-80">Constructora Destacada</Label>
              <Select 
                value={settings.featuredConstructoraId} 
                onValueChange={(v) => setSettings({...settings, featuredConstructoraId: v})}
              >
                <SelectTrigger className="h-12 bg-background border-border/40 rounded-xl font-medium">
                  <SelectValue placeholder="Selecciona una constructora" />
                </SelectTrigger>
                <SelectContent>
                  {constructoras.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              Aparecerá en el lado izquierdo del catálogo con su logo y descripción activa.
            </p>
          </div>

          {/* Modelo Featured */}
          <div className="space-y-4 p-6 bg-muted/20 rounded-2xl border border-border/10">
            <div className="flex items-center gap-2 text-orange-500 font-black uppercase tracking-widest text-[10px]">
              <Home className="w-4 h-4" />
              <span>Lado Derecho</span>
            </div>
            <div className="space-y-2.5">
              <Label className="text-sm font-bold opacity-80">Modelo Destacado</Label>
              <Select 
                value={settings.featuredModeloId} 
                onValueChange={(v) => setSettings({...settings, featuredModeloId: v})}
              >
                <SelectTrigger className="h-12 bg-background border-border/40 rounded-xl font-medium">
                  <SelectValue placeholder="Selecciona un modelo" />
                </SelectTrigger>
                <SelectContent>
                  {modelos.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.nombre} ({m.constructora_nombre || 'DB'})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              Aparecerá en el lado derecho con su imagen principal, precio y características.
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="px-10 h-14 bg-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : success ? (
              <CheckCircle2 className="w-5 h-5 mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            {loading ? 'Guardando...' : success ? 'Actualizado en Vivo' : 'Publicar en Mega Menú'}
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-bold">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
