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
