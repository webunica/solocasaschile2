import { Loader2 } from "lucide-react";

export default function SettingsLoading() {
  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-300">
      <div className="flex flex-col gap-3">
        <div className="h-10 w-64 bg-muted/40 rounded-2xl animate-pulse" />
        <div className="h-5 w-96 bg-muted/30 rounded-xl animate-pulse" />
      </div>

      <div className="flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Cargando configuración centralizada de la constructora...
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-[460px] bg-card/60 border border-border/40 rounded-3xl p-8 space-y-6 animate-pulse">
            <div className="h-6 w-48 bg-muted/40 rounded-xl" />
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="h-12 bg-muted/30 rounded-xl" />
              <div className="h-12 bg-muted/30 rounded-xl" />
              <div className="h-12 bg-muted/30 rounded-xl" />
              <div className="h-12 bg-muted/30 rounded-xl" />
            </div>
            <div className="h-32 bg-muted/30 rounded-xl" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-[280px] bg-card/60 border border-border/40 rounded-3xl p-6 space-y-4 animate-pulse">
            <div className="h-5 w-36 bg-muted/40 rounded-xl" />
            <div className="h-32 w-32 mx-auto bg-muted/30 rounded-2xl" />
          </div>
          <div className="h-[180px] bg-primary/20 border border-primary/30 rounded-3xl p-6 space-y-4 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
