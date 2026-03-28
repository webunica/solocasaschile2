import { 
  Box, Layers, Hammer, Key, Zap, 
  ArrowRight, TreePine, 
  Users, CheckCircle2 
} from "lucide-react";

export const CONSTRUCTION_SYSTEMS = [
  {
    id: "sip",
    title: "Panel SIP",
    description: "Máxima eficiencia térmica con paneles aislados estructurales de alta densidad.",
    icon: <Layers className="w-8 h-8" />,
    color: "from-brand-teal/20 to-brand-teal/5",
    accent: "bg-brand-teal",
    link: "/tipos/sip"
  },
  {
    id: "prefabricada",
    title: "Prefabricada",
    description: "Construcción por paneles de madera o metalcom, rápida y económica.",
    icon: <Box className="w-8 h-8" />,
    color: "from-brand-indigo/20 to-brand-indigo/5",
    accent: "bg-brand-indigo",
    link: "/tipos/prefabricada"
  },
  {
    id: "modular",
    title: "Modular",
    description: "Módulos volumétricos completos fabricados en planta y ensamblados en sitio.",
    icon: <Hammer className="w-8 h-8" />,
    color: "from-brand-teal/20 to-brand-teal/5",
    accent: "bg-brand-teal",
    link: "/tipos/modular"
  },
  {
    id: "container",
    title: "Container",
    description: "Arquitectura industrial y sustentable a partir de contenedores marítimos.",
    icon: <ArrowRight className="w-8 h-8 rotate-[-45deg]" />,
    color: "from-brand-indigo/20 to-brand-indigo/5",
    accent: "bg-brand-indigo",
    link: "/tipos/container"
  },
  {
    id: "steel-framing",
    title: "Steel Framing",
    description: "Estructura de perfiles de acero galvanizado para proyectos de alta resistencia.",
    icon: <Zap className="w-8 h-8" />,
    color: "from-brand-teal/20 to-brand-teal/5",
    accent: "bg-brand-teal",
    link: "/tipos/steel-framing"
  },
  {
    id: "madera",
    title: "Madera",
    description: "Construcción tradicional y sólida en maderas nativas o tratadas.",
    icon: <TreePine className="w-8 h-8" />,
    color: "from-brand-indigo/20 to-brand-indigo/5",
    accent: "bg-brand-indigo",
    link: "/tipos/madera"
  },
  {
    id: "hormigon",
    title: "Hormigón",
    description: "Viviendas de hormigón celular o prefabricado de máxima durabilidad.",
    icon: <Layers className="w-8 h-8 opacity-50" />,
    color: "from-brand-teal/20 to-brand-teal/5",
    accent: "bg-brand-teal",
    link: "/tipos/hormigon"
  }
];

export const SYSTEM_DETAILS: Record<string, { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  benefits: string[];
  specs: { label: string; value: string }[];
  image: string;
}> = {
  sip: {
    title: "Casas Panel SIP",
    description: "Paneles aislados estructurales que ofrecen una eficiencia térmica inigualable.",
    icon: <Layers className="w-10 h-10 text-brand-teal" />,
    benefits: ["Ahorro 50% en calefacción", "Estructuralmente antisísmica", "Menos residuos en obra"],
    specs: [
        { label: "Eficiencia Térmica", value: "A+" },
        { label: "Precio base", value: "15-25 UF/m2" },
        { label: "Aislación Acústica", value: "Excelente" }
    ],
    image: "https://images.unsplash.com/photo-1582266255745-9e509426a597?q=80&w=2070"
  },
  prefabricada: {
    title: "Casas Prefabricadas",
    description: "La opción más rápida y económica para construir tu hogar.",
    icon: <Box className="w-10 h-10 text-brand-indigo" />,
    benefits: ["Bajo costo por m2", "Montaje en tiempo récord", "Fácil de ampliar"],
    specs: [
        { label: "Tiempo montaje", value: "7-15 días" },
        { label: "Precio base", value: "8-18 UF/m2" },
        { label: "Escalabilidad", value: "Alta" }
    ],
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000"
  },
  modular: {
    title: "Casas Modulares",
    description: "Módulos volumétricos 3D terminados en fábrica.",
    icon: <Hammer className="w-10 h-10 text-brand-teal" />,
    benefits: ["Calidad de fábrica", "Entrega inmediata", "Mínimo impacto"],
    specs: [
        { label: "Grado de avance", value: "95% en planta" },
        { label: "Precio base", value: "20-30 UF/m2" },
        { label: "Durabilidad", value: "Alta" }
    ],
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2080"
  },
  container: {
    title: "Casas Container",
    description: "Arquitectura industrial a partir de contenedores reciclados.",
    icon: <ArrowRight className="w-10 h-10 text-brand-indigo rotate-[-45deg]" />,
    benefits: ["Indestructible", "Movilidad geográfica", "Vanguardista"],
    specs: [
        { label: "Resistencia", value: "Ultra alta" },
        { label: "Precio base", value: "12-22 UF/m2" },
        { label: "Sustentabilidad", value: "Reciclado" }
    ],
    image: "https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=2070"
  },
  "steel-framing": {
    title: "Steel Framing",
    description: "Sistema ligero de altísima resistencia en acero galvanizado.",
    icon: <Zap className="w-10 h-10 text-brand-teal" />,
    benefits: ["Precisión milimétrica", "Excelente resistencia sísmica", "Vida útil superior"],
    specs: [
        { label: "Estructura", value: "Acero Cerdado" },
        { label: "Precio base", value: "18-28 UF/m2" },
        { label: "Mantención", value: "Baja" }
    ],
    image: "https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=2070"
  },
  madera: {
    title: "Construcción en Madera",
    description: "Calidez natural unida a tecnología moderna de protección.",
    icon: <TreePine className="w-10 h-10 text-brand-indigo" />,
    benefits: ["Confort natural", "Huella de carbono negativa", "Vigas a la vista"],
    specs: [
        { label: "Material", value: "Pino/Nativo" },
        { label: "Precio base", value: "10-20 UF/m2" },
        { label: "Térmica", value: "Natural" }
    ],
    image: "https://images.unsplash.com/photo-1449156001934-06d1be2f12f0?q=80&w=2070"
  },
  hormigon: {
    title: "Construcción Hormigón",
    description: "Durabilidad máxima con tecnología de hormigón celular.",
    icon: <Layers className="w-10 h-10 text-brand-teal" />,
    benefits: ["Aislamiento acústico", "Incombustible", "Plusvalía garantizada"],
    specs: [
        { label: "Estructura", value: "Concreto G25" },
        { label: "Precio base", value: "25-35 UF/m2" },
        { label: "Resistencia", value: "Máxima" }
    ],
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070"
  },
  "llave-en-mano": {
    title: "Casas Llave en Mano",
    description: "Gestión integral desde el diseño hasta la entrega final.",
    icon: <Key className="w-10 h-10 text-brand-teal" />,
    benefits: ["Un solo interlocutor", "Precio cerrado", "Garantía total"],
    specs: [
        { label: "Esfuerzo Cliente", value: "Nulo" },
        { label: "Precio base", value: "22-35 UF/m2" },
        { label: "Personalización", value: "Total" }
    ],
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000"
  },
  sociales: {
    title: "Casas Sociales",
    description: "Soluciones habitacionales dignas con subsidio estatal.",
    icon: <Users className="w-10 h-10 text-brand-indigo" />,
    benefits: ["DS19/DS49", "Diseño optimizado", "Integración"],
    specs: [
        { label: "Financiamiento", value: "Subsidios" },
        { label: "Tiempo montaje", value: "20-40 días" },
        { label: "Integración", value: "Comunitaria" }
    ],
    image: "https://images.unsplash.com/photo-1448630360428-65ff2c0257ef?q=80&w=2070"
  }
};

export const FORM_SYSTEM_OPTIONS = [
  { value: "sip", label: "Panel SIP" },
  { value: "prefabricada", label: "Prefabricada panelizada" },
  { value: "modular", label: "Modular" },
  { value: "container", label: "Container" },
  { value: "steel-framing", label: "Steel framing" },
  { value: "madera", label: "Madera" },
  { value: "hormigon", label: "Hormigón" },
  { value: "llave-en-mano", label: "Llave en Mano" },
  { value: "sociales", label: "Casas Sociales (Subsidio)" },
];
