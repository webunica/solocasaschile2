"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronRight,
  FileCheck,
  FileText,
  Hammer,
  HelpCircle,
  Home,
  Layers,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type EtapaGuia = {
  id: string;
  numero: string;
  titulo: string;
  subtitulo: string;
  icon: any;
  resumen: string;
  itemsClave: {
    titulo: string;
    descripcion: string;
    consejo?: string;
  }[];
  advertencia?: string;
};

const ETAPAS_CONSTRUCCION: EtapaGuia[] = [
  {
    id: "legal",
    numero: "01",
    titulo: "Factibilidad Legal y Títulos del Terreno",
    subtitulo: "Asegura la propiedad antes de firmar cualquier contrato",
    icon: FileCheck,
    resumen:
      "Tener un terreno legalmente saneado es el primer e innegociable paso. Sin rol propio ni títulos al día, ninguna municipalidad autorizará la construcción ni podrás conectar servicios básicos definitivos.",
    itemsClave: [
      {
        titulo: "Rol Propio e Inscripción en el CBR",
        descripcion:
          "Verifica que el terreno tenga Rol de avalúo propio asignado por el SII y copia de inscripción de dominio vigente a nombre del vendedor en el Conservador de Bienes Raíces (CBR).",
        consejo:
          "Solicita un Certificado de Dominio Vigente y de Hipotecas y Gravámenes (máximo 30 días de antigüedad).",
      },
      {
        titulo: "Certificado de Informaciones Previas (CIP)",
        descripcion:
          "Se tramita en la Dirección de Obras Municipales (DOM). Define las normas urbanísticas aplicables: coeficientes de ocupación de suelo, constructibilidad, rasantes y distanciamientos mínimos a deslindes.",
        consejo:
          "El CIP te indica exactamente cuántos metros cuadrados puedes edificar y a qué distancia de los vecinos debes situar la casa.",
      },
      {
        titulo: "Terrenos Rurales y Loteos SAG (D.L. 3.516)",
        descripcion:
          "Si el terreno es una parcela de agrado de 5.000 m² en zona rural, revisa la normativa del SAG. Para construcciones de vivienda unifamiliar se debe respetar el uso de suelo y solicitar el Informe Favorable para la Construcción (IFC) cuando corresponda.",
      },
    ],
    advertencia:
      "¡Cuidado con las cesiones de derechos y loteos irregulares (loteos brujos)! Comprar una 'parte' de un terreno sin subdivisión aprobada ni rol propio impide obtener permiso de edificación, empalmes de luz o agua, y créditos hipotecarios.",
  },
  {
    id: "acceso-suelo",
    numero: "02",
    titulo: "Topografía, Estudio de Suelo y Accesibilidad",
    subtitulo: "Verifica que los camiones y la estructura puedan llegar sin problemas",
    icon: Truck,
    resumen:
      "Una casa prefabricada se traslada en camiones de gran envergadura (ramplas o camiones pluma de 10 a 16 metros). El terreno debe ser física y logísticamente accesible.",
    itemsClave: [
      {
        titulo: "Accesibilidad Vial para Camiones de Alto Tonelaje",
        descripcion:
          "Revisa el ancho del camino rural o servidumbre de paso (mínimo 4 a 5 metros libres), radio de giro en curvas pronunciadas, capacidad de carga de puentes y pendientes máximas de subida.",
        consejo:
          "Chequea cables de tendido eléctrico aéreos bajos y ramas de árboles frondosos en la ruta de acceso que puedan obstaculizar la altura del camión.",
      },
      {
        titulo: "Mecánica de Suelo y Calicatas",
        descripcion:
          "Inspecciona el tipo de estrato de apoyo (roca, arcilla, arena o relleno). Una calicata o estudio geotécnico básico evita fundar sobre rellenos inestables o napas subterráneas superficiales.",
      },
      {
        titulo: "Topografía y Movimiento de Tierras",
        descripcion:
          "En terrenos planos basta con escarpe vegetal y nivelación. En terrenos con pendiente se debe planificar si se construirá sobre pilotes/poyos de hormigón o si se requerirán terrazas con muros de contención.",
      },
    ],
    advertencia:
      "Si el camión no puede entrar hasta el punto exacto de descarga, las constructoras cobrarán sobrecostos por acarreo manual de paneles o requerirán grúa pluma adicional.",
  },
  {
    id: "servicios",
    numero: "03",
    titulo: "Factibilidad de Servicios Básicos",
    subtitulo: "Agua potable, electricidad y evacuación de aguas servidas",
    icon: Zap,
    resumen:
      "Sin agua ni electricidad no es posible el montaje ni las pruebas de instalaciones. Debes gestionar la factibilidad técnica o soluciones autónomas antes de comenzar las obras.",
    itemsClave: [
      {
        titulo: "Agua Potable (Red, APR o Pozo Profundo)",
        descripcion:
          "En zonas urbanas solicita factibilidad a la empresa sanitaria. En parcelas rurales existen dos caminos: incorporación a comité de APR (Agua Potable Rural) o perforación de pozo/noria con derechos de aprovechamiento de aguas tramitados ante la DGA y análisis bacteriológico.",
        consejo:
          "Instala un estanque acumulador de 1.000 a 2.500 litros con bomba hidroneumática para garantizar presión constante.",
      },
      {
        titulo: "Electricidad (Empalme de Red o Sistema Solar)",
        descripcion:
          "Para empalme definitivo a la distribuidora (CGE, Enel, Saesa, Chilquinta) se necesita proyecto firmado por instalador autorizado SEC con formulario TE1. En zonas sin red, se proyecta un sistema fotovoltaico off-grid con paneles solares, inversor y baterías de litio.",
      },
      {
        titulo: "Alcantarillado y Tratamiento de Aguas Servidas",
        descripcion:
          "Si no hay red pública de alcantarillado, es obligatorio instalar un sistema particular: fosa séptica con cámara desgrasadora para cocina, fosa biológica y drenes de infiltración. Este sistema debe contar con autorización sanitaria del SEREMI de Salud.",
      },
    ],
  },
  {
    id: "fundaciones",
    numero: "04",
    titulo: "Fundaciones y Obras Previas (Cota Cero)",
    subtitulo: "La base estructural donde descansará la casa prefabricada",
    icon: Layers,
    resumen:
      "La calidad y durabilidad de una casa prefabricada dependen de sus cimientos. Las fundaciones deben estar perfectamente niveladas y con las pasadas sanitarias listas antes de la llegada de los paneles.",
    itemsClave: [
      {
        titulo: "Radier de Hormigón Armado",
        descripcion:
          "La opción preferida en terrenos planos. Se compone de emplantillado de ripio compactado, barrera hidrófuga de polietileno de 0.2 mm para evitar humedad por capilaridad, malla electrosoldada (tipo Acma) y hormigón de espesor mínimo de 10 a 12 cm.",
        consejo:
          "La escuadra y nivelación del radier deben ser milimétricas; un desnivel de 2 cm puede descuadrar tabiques completos.",
      },
      {
        titulo: "Fundación sobre Pilotes o Poyos",
        descripcion:
          "Ideal para parcelas en pendiente o terrenos húmedos del sur de Chile. Los pilotes (de hormigón armado o madera impregnada con CCA) elevan la vivienda, generan una cámara de aire ventilada que previene hongos y humedad, y reducen el movimiento de tierra.",
      },
      {
        titulo: "Instalaciones Sanitarias Bajo Cota Cero",
        descripcion:
          "Todas las descargas de desagüe (PVC sanitario de 110 mm para WC y 50/40 mm para tinas, duchas, lavaplatos y sifones) deben quedar posicionadas y probadas antes de hormigonar el radier.",
      },
    ],
  },
  {
    id: "permisos",
    numero: "05",
    titulo: "Permisos Municipales y Regularización",
    subtitulo: "La legalidad y habitabilidad ante la DOM y la SEC",
    icon: Building2,
    resumen:
      "En Chile, las casas prefabricadas están sujetas a la misma normativa que una edificación tradicional (Ordenanza General de Urbanismo y Construcciones - OGUC). Contar con la Recepción Final es imprescindible para que tu vivienda sea un activo legal asegurable.",
    itemsClave: [
      {
        titulo: "Permiso de Edificación (DOM)",
        descripcion:
          "Se ingresa en la Dirección de Obras Municipales con el patrocinio de un arquitecto colegiado. Incluye planos de arquitectura, cálculo estructural sismorresistente según NCh433, especificaciones técnicas y memorias de cálculo.",
      },
      {
        titulo: "Certificaciones SEC (TE1 y TC6)",
        descripcion:
          "La instalación eléctrica debe estar inscrita ante la SEC mediante declaración TE1 por un instalador autorizado. Si la casa tiene gas de cañería o GLP, se requiere el certificado TC6.",
      },
      {
        titulo: "Recepción Final de Obras",
        descripcion:
          "Una vez finalizada la construcción, el inspector municipal visita el inmueble para verificar la concordancia con los planos aprobados. Con el certificado de recepción final la vivienda queda debidamente empadronada en el SII y apta para créditos hipotecarios.",
        consejo:
          "Muchas constructoras ofrecen el servicio de 'Gestión de Permisos y Recepción DOM' como servicio adicional o incluido en la modalidad Llave en Mano.",
      },
    ],
  },
  {
    id: "modalidades",
    numero: "06",
    titulo: "Modalidades de Compra y Elección de Constructora",
    subtitulo: "Kit Básico vs. Kit Armado vs. Llave en Mano",
    icon: Hammer,
    resumen:
      "Entender qué incluye cada modalidad te evitará falsas expectativas y sobrecostos inesperados. Compara siempre el alcance de cada presupuesto.",
    itemsClave: [
      {
        titulo: "Kit Básico (Solo Materiales en Fábrica)",
        descripcion:
          "Incluye paneles exteriores e interiores, cerchas y techumbre. NO incluye fundaciones, flete, montaje, ventanas, instalaciones de agua/luz ni terminaciones. Recomendado solo si tienes maestro o cuadrilla propia de confianza.",
      },
      {
        titulo: "Kit Armado (Obra Gruesa Montada)",
        descripcion:
          "La constructora suministra el kit y envía una cuadrilla especializada a armar la estructura sobre tus fundaciones preparadas. Incluye techumbre y paneles levantados, quedando lista para instalaciones interiores.",
      },
      {
        titulo: "Llave en Mano (Turnkey Completo)",
        descripcion:
          "La constructora se encarga de todo: diseño, fundaciones, montaje, instalaciones eléctricas y sanitarias certificadas, terminaciones (pisos, cerámicos, muebles de cocina, pintura) y entrega lista para habitar.",
        consejo:
          "Estructura siempre los pagos por hitos verificables: por ejemplo, 20% al firmar, 30% a la llegada de paneles al terreno, 30% al terminar obra gruesa y 20% a la entrega y recepción conforme.",
      },
    ],
  },
];

const CHECKLIST_TERRENO = [
  { id: "c1", texto: "Terreno con Rol propio inscrito en el Conservador de Bienes Raíces (CBR)", categoria: "Legal" },
  { id: "c2", texto: "Certificado de Informaciones Previas (CIP) emitido por la DOM respectiva", categoria: "Legal" },
  { id: "c3", texto: "Camino de acceso con al menos 4.5 m libres y sin cables bajos ni ramas", categoria: "Acceso" },
  { id: "c4", texto: "Punto de descarga nivelado y despejado para camión y materiales", categoria: "Acceso" },
  { id: "c5", texto: "Factibilidad o empalme provisorio de agua potable (APR, pozo o camión aljibe)", categoria: "Servicios" },
  { id: "c6", texto: "Factibilidad o empalme eléctrico (o generador/kit solar para faenas)", categoria: "Servicios" },
  { id: "c7", texto: "Proyecto de fosa séptica con drenes o conexión a red de alcantarillado", categoria: "Servicios" },
  { id: "c8", texto: "Fundaciones terminadas y niveladas (radier o pilotes) con tuberías pasadas", categoria: "Obra" },
  { id: "c9", texto: "Permiso de Edificación aprobado o en trámite en la DOM", categoria: "Municipal" },
  { id: "c10", texto: "Contrato firmado con constructora verificada con hitos de pago por avance", categoria: "Contrato" },
];

export function GuiaConstruccionTerreno() {
  const [etapaActiva, setEtapaActiva] = useState(0);
  const [checklistChecked, setChecklistChecked] = useState<Record<string, boolean>>({});

  const toggleChecklist = (id: string) => {
    setChecklistChecked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalCompletados = Object.values(checklistChecked).filter(Boolean).length;
  const porcentaje = Math.round((totalCompletados / CHECKLIST_TERRENO.length) * 100);

  const etapaActual = ETAPAS_CONSTRUCCION[etapaActiva];
  const EtapaIcon = etapaActual.icon;

  return (
    <section className="mt-16 space-y-12">
      {/* Header Banner Guía */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-brand-teal/25 bg-gradient-to-br from-brand-indigo via-[#03313a] to-brand-teal/90 p-8 text-white shadow-2xl md:p-12">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-80 w-80 rounded-full bg-brand-teal/15 blur-3xl" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-teal/30 bg-brand-teal/20 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#8fffe0]">
            <BookOpen className="h-3.5 w-3.5" />
            Guía Práctica Oficial 2026
          </div>
          <h2 className="font-heading text-3xl font-black tracking-tight text-white md:text-5xl">
            ¿Qué necesitas para construir una casa prefabricada en tu terreno?
          </h2>
          <p className="text-base font-medium leading-relaxed text-white/85 md:text-lg">
            Guía paso a paso para propietarios y compradores en Chile: desde los títulos legales y el estudio de suelo
            hasta la factibilidad de agua, luz, fundaciones y permisos municipales ante la DOM.
          </p>
        </div>
      </div>

      {/* Tabs Selector de Etapas */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {ETAPAS_CONSTRUCCION.map((etapa, idx) => {
          const Icon = etapa.icon;
          const isSelected = etapaActiva === idx;

          return (
            <button
              key={etapa.id}
              onClick={() => setEtapaActiva(idx)}
              className={cn(
                "group relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-200",
                isSelected
                  ? "border-brand-teal bg-brand-indigo text-white shadow-lg shadow-brand-indigo/30"
                  : "border-border/60 bg-card hover:border-brand-teal/40 hover:bg-slate-50 dark:hover:bg-slate-900"
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={cn(
                    "text-[11px] font-black uppercase tracking-wider",
                    isSelected ? "text-[#8fffe0]" : "text-muted-foreground"
                  )}
                >
                  Paso {etapa.numero}
                </span>
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform group-hover:scale-110",
                    isSelected ? "text-[#8fffe0]" : "text-muted-foreground"
                  )}
                />
              </div>
              <p
                className={cn(
                  "line-clamp-2 text-xs font-extrabold leading-snug",
                  isSelected ? "text-white" : "text-foreground"
                )}
              >
                {etapa.titulo}
              </p>
            </button>
          );
        })}
      </div>

      {/* Contenedor Detallado de la Etapa Activa */}
      <div className="rounded-[2.5rem] border border-border/60 bg-card p-6 shadow-sm md:p-10 space-y-8">
        <div className="flex flex-col gap-4 border-b border-border/40 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-teal/15 text-brand-teal">
                <EtapaIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-teal">
                  Etapa {etapaActual.numero} de {ETAPAS_CONSTRUCCION.length}
                </p>
                <h3 className="font-heading text-2xl font-black tracking-tight text-foreground md:text-3xl">
                  {etapaActual.titulo}
                </h3>
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground pt-1">{etapaActual.subtitulo}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={etapaActiva === 0}
              onClick={() => setEtapaActiva((prev) => Math.max(0, prev - 1))}
              className="rounded-full border border-border/80 px-4 py-2 text-xs font-bold transition-colors hover:bg-muted disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              disabled={etapaActiva === ETAPAS_CONSTRUCCION.length - 1}
              onClick={() => setEtapaActiva((prev) => Math.min(ETAPAS_CONSTRUCCION.length - 1, prev + 1))}
              className="cta-pill min-h-0 px-4 py-2 text-xs font-black uppercase tracking-wider disabled:opacity-40"
            >
              Siguiente etapa
            </button>
          </div>
        </div>

        {/* Resumen contextual */}
        <p className="text-base font-medium leading-relaxed text-foreground/90 bg-muted/40 p-4 rounded-2xl border border-border/40">
          {etapaActual.resumen}
        </p>

        {/* Advertencia si existe */}
        {etapaActual.advertencia && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <p className="text-xs font-bold leading-relaxed">{etapaActual.advertencia}</p>
          </div>
        )}

        {/* Items Clave */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {etapaActual.itemsClave.map((item, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-border/50 bg-background/60 p-5 transition-all hover:border-brand-teal/30 hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-brand-teal">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <h4 className="font-heading text-base font-bold text-foreground">{item.titulo}</h4>
                </div>
                <p className="text-xs font-medium leading-relaxed text-muted-foreground">{item.descripcion}</p>
              </div>

              {item.consejo && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-brand-teal/5 p-3 border border-brand-teal/15 text-[11px] font-semibold text-brand-indigo dark:text-brand-teal">
                  <Lightbulb className="h-4 w-4 shrink-0 text-brand-teal mt-0.5" />
                  <span>{item.consejo}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Checklist Interactivo */}
      <div className="rounded-[2.5rem] border border-border/60 bg-gradient-to-b from-card to-background p-6 shadow-md md:p-10 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand-teal">
              <ShieldCheck className="h-4 w-4" />
              Checklist de Verificación
            </div>
            <h3 className="font-heading text-2xl font-black tracking-tight text-foreground md:text-3xl">
              ¿Está tu terreno listo para el montaje?
            </h3>
            <p className="text-xs text-muted-foreground">
              Marca los puntos que ya tienes resueltos para calcular el avance antes de la entrega del kit.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-background rounded-2xl border border-border/60 p-4 min-w-[200px] justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Progreso</p>
              <p className="text-xl font-black text-brand-indigo dark:text-brand-teal">
                {totalCompletados} de {CHECKLIST_TERRENO.length}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-brand-teal">{porcentaje}%</span>
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-gradient-to-r from-brand-indigo via-brand-teal to-[#8fffe0] transition-all duration-500"
            style={{ width: `${porcentaje}%` }}
          />
        </div>

        {/* Lista de Checkboxes */}
        <div className="grid gap-3 sm:grid-cols-2">
          {CHECKLIST_TERRENO.map((item) => {
            const isChecked = Boolean(checklistChecked[item.id]);

            return (
              <label
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={cn(
                  "flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 transition-all duration-200",
                  isChecked
                    ? "border-emerald-500/40 bg-emerald-500/5 text-foreground shadow-sm"
                    : "border-border/50 bg-card hover:bg-muted/40 text-muted-foreground"
                )}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="mt-1 h-4 w-4 rounded border-border text-brand-teal focus:ring-brand-teal"
                />
                <div className="space-y-1">
                  <Badge
                    variant="outline"
                    className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md"
                  >
                    {item.categoria}
                  </Badge>
                  <p className={cn("text-xs font-semibold leading-relaxed", isChecked && "text-foreground")}>
                    {item.texto}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Call to action de cierre */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl bg-brand-indigo/5 border border-brand-indigo/15 p-6 text-center sm:flex-row sm:text-left">
          <div className="space-y-1">
            <p className="font-heading text-lg font-black text-brand-indigo dark:text-white">
              ¿Listo para dar el siguiente paso?
            </p>
            <p className="text-xs text-muted-foreground">
              Compara modelos de casas prefabricadas y solicita cotización directa a constructoras verificadas en tu región.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="cta-pill min-h-0 px-6 py-2.5 text-xs font-extrabold uppercase tracking-[0.14em]"
            >
              Ver modelos
            </Link>
            <Link
              href="/constructoras"
              className="rounded-full border border-brand-indigo/30 bg-white dark:bg-slate-900 px-5 py-2.5 text-xs font-bold text-brand-indigo dark:text-white hover:bg-brand-indigo/5 transition-colors"
            >
              Buscar constructoras
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
