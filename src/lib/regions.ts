import { REGIONES_CHILE } from "@/config/regions";

export function slugifyRegion(text: string) {
  return text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getRegionDisplayName(slug?: string) {
  if (!slug) return slug;
  const s = slugifyRegion(slug);
  
  // Alia soporte/compatibilidad con URLs anteriores
  if (s === "araucania") return "La Araucanía";
  
  return REGIONES_CHILE.find(r => slugifyRegion(r) === s) || slug;
}

export function normalizeRegionName(raw?: string | null): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  const directMatch = REGIONES_CHILE.find(r => r.toLowerCase() === trimmed.toLowerCase());
  if (directMatch) return directMatch;

  const stripped = trimmed
    .replace(/^Regi[oó]n (de |del |de la )?/i, "")
    .replace(/ de Santiago$/i, "")
    .replace(/^Libertador General Bernardo /i, "")
    .trim();

  const strippedMatch = REGIONES_CHILE.find(r => r.toLowerCase() === stripped.toLowerCase());
  if (strippedMatch) return strippedMatch;

  const partialMatch = REGIONES_CHILE.find(r => trimmed.toLowerCase().includes(r.toLowerCase()));
  if (partialMatch) return partialMatch;

  return trimmed;
}
