export type VerificationStatus = 
  | "Verificada documentalmente"
  | "Información básica validada"
  | "Perfil en revisión"
  | "No verificada";

export function getVerificationStatus(constructora: { verificada: boolean; score_confianza: number; plan: string }): VerificationStatus {
  if (constructora.verificada) {
    if (constructora.score_confianza >= 80) {
      return "Verificada documentalmente";
    }
    return "Información básica validada";
  }

  // Si no está verificada pero tiene un plan pagado, asumimos que está en revisión
  if (constructora.plan && constructora.plan !== 'gratis' && constructora.plan !== 'informativo') {
    return "Perfil en revisión";
  }

  return "No verificada";
}

export function getStatusColor(status: VerificationStatus): string {
  switch (status) {
    case "Verificada documentalmente":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "Información básica validada":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "Perfil en revisión":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "No verificada":
      return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    default:
      return "bg-slate-500/10 text-slate-500 border-slate-500/20";
  }
}
