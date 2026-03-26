export default function NewModelPlaceholder() {
  return (
    <div className="py-12 space-y-6">
      <div className="flex flex-col gap-2">
         <h1 className="text-4xl font-black tracking-tighter text-foreground">Crear <span className="gradient-text">Modelo</span></h1>
         <p className="text-muted-foreground font-medium">Formulario de registro en preparación para la Fase 4 (Integración Storage).</p>
      </div>

      <div className="glass p-10 rounded-[3rem] border border-border/40 text-center space-y-4">
         <div className="w-16 h-16 bg-muted rounded-2xl mx-auto flex items-center justify-center text-2xl font-black opacity-40">🚀</div>
         <h3 className="text-2xl font-black tracking-tight">Próximamente</h3>
         <p className="text-muted-foreground max-w-md mx-auto">En la próxima iteración podrás subir tus modelos completos, incluyendo la galería de imágenes (Supabase Storage) y las especificaciones técnicas avanzadas.</p>
      </div>
    </div>
  )
}
