"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Bed,
  Bath,
  Home,
  Sparkles,
  ShieldCheck,
  Ruler,
  DollarSign,
  Send,
  ArrowRight,
  ArrowLeft,
  Check,
  Layers,
  MapPin,
  CheckCircle2,
  Loader2,
  Lock,
  Zap,
  Info,
  Clock,
  Compass,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HoneypotFields } from "@/components/security/honeypot-fields";
import { REGIONES_CHILE } from "@/config/regions";
import { trackCotizacionStart, trackCotizacionSubmit } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// Estilos arquitectónicos
const ESTILOS_CASA = [
  {
    id: "mediterranea",
    nombre: "Mediterránea",
    subtitulo: "Líneas rectas, techos ocultos y amplios ventanales",
    icono: "🏛️",
    popular: true,
  },
  {
    id: "tradicional",
    nombre: "Tradicional / Chilena",
    subtitulo: "Techos a dos aguas, vigas a la vista y estilo acogedor",
    icono: "🏡",
    popular: false,
  },
  {
    id: "cabana",
    nombre: "Cabaña / Rústica",
    subtitulo: "Madera cálida, estilo alpino, ideal parcelas y lagos",
    icono: "🌲",
    popular: true,
  },
  {
    id: "modular",
    nombre: "Modular / Contemporánea",
    subtitulo: "Diseño vanguardista, ampliación por módulos transportables",
    icono: "📦",
    popular: false,
  },
  {
    id: "tiny",
    nombre: "Tiny House",
    subtitulo: "Compacta, funcional, ultraeficiente (< 40 m²)",
    icono: "🌿",
    popular: false,
  },
] as const;

// Sistemas constructivos
const SISTEMAS_CONSTRUCTIVOS = [
  {
    id: "sip",
    nombre: "Panel SIP",
    ventaja: "Máxima eficiencia térmica (hasta 60% ahorro calefacción)",
    badge: "Más eficiente",
  },
  {
    id: "metalcon",
    nombre: "Metalcon / Acero",
    ventaja: "Estructura sismorresistente, no se deforma ni apolilla",
    badge: "Alta durabilidad",
  },
  {
    id: "madera",
    nombre: "Madera Tradicional",
    ventaja: "Prefabricada clásica probada en Chile, económica y versátil",
    badge: "Más económica",
  },
  {
    id: "modular_fabrica",
    nombre: "Modular de Fábrica",
    ventaja: "Montaje express en terreno en días sin residuos de obra",
    badge: "Montaje rápido",
  },
  {
    id: "indiferente",
    nombre: "Recomiéndenme la mejor opción",
    ventaja: "Nuestros asesores te sugerirán el sistema ideal según tu zona",
    badge: "Asesoría experta",
  },
] as const;

// Niveles de terminación
const NIVELES_ENTREGA = [
  {
    id: "kit_basico",
    nombre: "Kit Básico Estructural",
    desc: "Muros, cerchas y paneles listos para armar. Para autoconstrucción.",
    rangoUfM2: [6, 11],
  },
  {
    id: "obra_gruesa",
    nombre: "Obra Gruesa Habitable",
    desc: "Instalada en terreno con techumbre, tabiquería y ventanas.",
    rangoUfM2: [14, 21],
  },
  {
    id: "llave_mano",
    nombre: "Llave en Mano Completo",
    desc: "100% terminada, con pisos, baños, cocina e instalaciones operativas.",
    rangoUfM2: [24, 36],
  },
] as const;

const UF_VALOR_ESTIMADO = 38500; // Valor de referencia en pesos chilenos

export function SmartCotizador() {
  const formId = useId();
  const [step, setStep] = useState(1);

  // Estado del configurador
  const [habitantes, setHabitantes] = useState("3-4");
  const [invitados, setInvitados] = useState("frecuente");
  const [dormitorios, setDormitorios] = useState(3);
  const [literas, setLiteras] = useState(true);
  const [banos, setBanos] = useState(2);

  const [estilo, setEstilo] = useState<string>("mediterranea");
  const [sistema, setSistema] = useState<string>("sip");
  const [nivelEntrega, setNivelEntrega] = useState<string>("llave_mano");

  const [superficieM2, setSuperficieM2] = useState(85);
  const [estadoTerreno, setEstadoTerreno] = useState("propio");
  const [region, setRegion] = useState("Valparaíso");

  // Estado del formulario de contacto final
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensajeExtra, setMensajeExtra] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cálculo inteligente de sugerencia de m²
  const calcularM2Sugerido = (numDorm: number, numBanos: number, conLiteras: boolean) => {
    let base = 35 + numDorm * 18 + numBanos * 8;
    if (conLiteras) base += 4;
    return Math.min(220, Math.max(36, base));
  };

  const handleDormitoriosChange = (num: number) => {
    setDormitorios(num);
    setSuperficieM2(calcularM2Sugerido(num, banos, literas));
  };

  const handleBanosChange = (num: number) => {
    setBanos(num);
    setSuperficieM2(calcularM2Sugerido(dormitorios, num, literas));
  };

  const handleLiterasChange = (val: boolean) => {
    setLiteras(val);
    setSuperficieM2(calcularM2Sugerido(dormitorios, banos, val));
  };

  // Cálculo de presupuesto estimado
  const nivelSeleccionado =
    NIVELES_ENTREGA.find((n) => n.id === nivelEntrega) || NIVELES_ENTREGA[2];
  const precioMinUf = Math.round(superficieM2 * nivelSeleccionado.rangoUfM2[0]);
  const precioMaxUf = Math.round(superficieM2 * nivelSeleccionado.rangoUfM2[1]);
  const precioMinClp = precioMinUf * UF_VALOR_ESTIMADO;
  const precioMaxClp = precioMaxUf * UF_VALOR_ESTIMADO;

  const formatearClp = (monto: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(monto);
  };

  // Enlace directo al catálogo con filtros listos
  const linkCatalogoFiltrado = `/catalogo?dormitorios=${dormitorios}&banos=${banos}&m2min=${Math.max(
    25,
    superficieM2 - 25
  )}&m2max=${superficieM2 + 35}`;

  const handleSubmitLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const resumenCotizacion = `
📋 COTIZACIÓN CONFIGURADA DESDE EL COTIZADOR INTERACTIVO (3-5 MIN):
• Habitantes habituales: ${habitantes} personas
• Frecuencia de invitados: ${invitados}
• Distribución: ${dormitorios} dormitorios (${literas ? "Con literas/camarotes para visitas" : "Camas normales"}), ${banos} baños
• Estilo arquitectónico: ${estilo}
• Sistema constructivo: ${sistema}
• Nivel de terminación: ${nivelSeleccionado.nombre}
• Superficie calculada: ${superficieM2} m²
• Estado del terreno: ${estadoTerreno}
• Región de construcción: ${region}
• Rango de presupuesto estimado: ${precioMinUf.toLocaleString("es-CL")} - ${precioMaxUf.toLocaleString("es-CL")} UF (${formatearClp(precioMinClp)} a ${formatearClp(precioMaxClp)})
• Comentarios adicionales del cliente: ${mensajeExtra || "Ninguno"}
    `.trim();

    const payload = {
      nombre_cliente: nombre,
      email_cliente: email,
      telefono_cliente: telefono,
      mensaje: resumenCotizacion,
      website: (formData.get("website") as string) || "",
      b_website: (formData.get("b_website") as string) || "",
      _form_time: Number(formData.get("_form_time")) || undefined,
    };

    try {
      const response = await fetch("/api/leads/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData?.error || "Error al enviar la solicitud.");
      }

      setSuccess(true);
      trackCotizacionSubmit({ source: "hero_form" });
    } catch (err: unknown) {
      console.error("Error al enviar cotización:", err);
      setError("No pudimos enviar la cotización. Por favor verifica tus datos e intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full py-12 md:py-16 bg-[#FAFAF7]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Encabezado Principal de la Sección */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#073E48]/8 border border-[#073E48]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#073E48] mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#27D8BE]" />
            <span>COTIZADOR INTELIGENTE DE CASAS</span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 lowercase border-l border-slate-300 pl-2">
              <Clock className="h-3 w-3" /> 3 min
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#073E48] tracking-tight leading-[1.08] mb-3 text-balance">
            Encuentra y cotiza tu casa según tu estilo de vida
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed text-pretty">
            Configura cantidad de personas, literas para invitados, baños, estilo y metros cuadrados. Obtén una estimación de precios y compárala con constructoras verificadas de tu región.
          </p>
        </div>

        {/* Tarjeta Contenedora Principal del Cotizador */}
        <div className="relative rounded-[2rem] bg-white border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(7,62,72,0.1)] overflow-hidden max-w-4xl mx-auto">
          {/* Barra de Progreso y Pasos */}
          <div className="bg-[#073E48] text-white px-6 py-4 sm:px-8 border-b border-[#073E48]/40">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#27D8BE]">
                Paso {step} de 4
              </span>
              <span className="text-xs font-semibold text-slate-200">
                {step === 1 && "1. Habitabilidad y personas"}
                {step === 2 && "2. Estilo y sistema constructivo"}
                {step === 3 && "3. Metros cuadrados y terreno"}
                {step === 4 && "4. Tu cotización y recomendación"}
              </span>
            </div>

            {/* Línea de Progreso */}
            <div className="h-2 w-full bg-white/15 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#27D8BE] rounded-full"
                initial={{ width: "25%" }}
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Cuerpo del Asistente */}
          <div className="p-6 sm:p-8 lg:p-10">
            <AnimatePresence mode="wait">
              {/* ────────────────────────────────────────────────────────── */}
              {/* PASO 1: PERSONAS, INVITADOS, DORMITORIOS, LITERAS Y BAÑOS */}
              {/* ────────────────────────────────────────────────────────── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Pregunta 1: Personas */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-[#073E48] mb-1.5">
                      ¿Cuántas personas vivirán habitualmente en la casa?
                    </label>
                    <p className="text-xs text-slate-500 mb-4">
                      Nos ayuda a calcular el espacio común necesario para vivir con comodidad.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: "1-2", label: "1 a 2", sub: "Soltero / Pareja" },
                        { id: "3-4", label: "3 a 4", sub: "Familia pequeña" },
                        { id: "5-6", label: "5 a 6", sub: "Familia en crecimiento" },
                        { id: "7+", label: "7 o más", sub: "Familia numerosa" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setHabitantes(item.id)}
                          className={cn(
                            "flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border-2 transition-all text-center",
                            habitantes === item.id
                              ? "border-[#27D8BE] bg-[#27D8BE]/10 text-[#073E48] shadow-sm font-bold"
                              : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                          )}
                        >
                          <Users className="h-5 w-5 mb-1 text-[#073E48]" />
                          <span className="text-base font-extrabold text-[#073E48]">
                            {item.label}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {item.sub}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pregunta 2: Invitados y Visitas */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-[#073E48] mb-1.5">
                      ¿Sueles recibir invitados o visitas frecuentes?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          id: "raro",
                          label: "Solo nosotros",
                          sub: "Pocas veces recibimos personas a dormir",
                        },
                        {
                          id: "frecuente",
                          label: "Fines de semana",
                          sub: "Familiares o amigos se quedan a menudo",
                        },
                        {
                          id: "veraneo",
                          label: "Casa de descanso / Turismo",
                          sub: "Gran flujo de visitas en vacaciones y feriados",
                        },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setInvitados(item.id)}
                          className={cn(
                            "p-3.5 rounded-2xl border-2 transition-all text-left flex flex-col justify-between",
                            invitados === item.id
                              ? "border-[#27D8BE] bg-[#27D8BE]/10 text-[#073E48] font-bold"
                              : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                          )}
                        >
                          <span className="text-sm font-bold text-[#073E48] mb-0.5">
                            {item.label}
                          </span>
                          <span className="text-xs text-slate-500 font-normal leading-tight">
                            {item.sub}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pregunta 3: Dormitorios y Literas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider text-[#073E48] mb-2 flex items-center gap-2">
                        <Bed className="h-4 w-4 text-[#27D8BE]" />
                        Dormitorios necesarios
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => handleDormitoriosChange(num)}
                            className={cn(
                              "flex-1 h-12 rounded-xl border-2 font-bold text-sm transition-all",
                              dormitorios === num
                                ? "border-[#27D8BE] bg-[#073E48] text-white shadow-md scale-105"
                                : "border-slate-200 text-slate-700 hover:border-slate-300 bg-white"
                            )}
                          >
                            {num === 5 ? "5+" : num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider text-[#073E48] mb-2 flex items-center gap-2">
                        <Layers className="h-4 w-4 text-[#27D8BE]" />
                        ¿Espacio para literas / camarotes?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleLiterasChange(true)}
                          className={cn(
                            "h-12 px-3 rounded-xl border-2 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5",
                            literas
                              ? "border-[#27D8BE] bg-[#27D8BE]/15 text-[#073E48]"
                              : "border-slate-200 text-slate-700 hover:border-slate-300 bg-white"
                          )}
                        >
                          <Check className={cn("h-4 w-4", literas ? "opacity-100" : "opacity-0")} />
                          <span>Sí, optimizar camas</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLiterasChange(false)}
                          className={cn(
                            "h-12 px-3 rounded-xl border-2 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5",
                            !literas
                              ? "border-[#27D8BE] bg-[#27D8BE]/15 text-[#073E48]"
                              : "border-slate-200 text-slate-700 hover:border-slate-300 bg-white"
                          )}
                        >
                          <Check className={cn("h-4 w-4", !literas ? "opacity-100" : "opacity-0")} />
                          <span>Solo camas normales</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pregunta 4: Baños */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-[#073E48] mb-2 flex items-center gap-2">
                      <Bath className="h-4 w-4 text-[#27D8BE]" />
                      Cantidad de baños requeridos
                    </label>
                    <div className="flex items-center gap-2 max-w-sm">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleBanosChange(num)}
                          className={cn(
                            "flex-1 h-12 rounded-xl border-2 font-bold text-sm transition-all",
                            banos === num
                              ? "border-[#27D8BE] bg-[#073E48] text-white shadow-md scale-105"
                              : "border-slate-200 text-slate-700 hover:border-slate-300 bg-white"
                          )}
                        >
                          {num === 4 ? "4+" : num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Botón Siguiente */}
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      className="h-13 px-8 rounded-full bg-[#073E48] text-white font-bold text-sm tracking-wider uppercase shadow-lg hover:bg-[#0a4d59] gap-2 transition-transform hover:scale-105"
                    >
                      <span>Siguiente: Estilo y Sistema</span>
                      <ArrowRight className="h-4 w-4 text-[#27D8BE]" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ────────────────────────────────────────────────────────── */}
              {/* PASO 2: ESTILO, SISTEMA CONSTRUCTIVO Y NIVEL DE ENTREGA    */}
              {/* ────────────────────────────────────────────────────────── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Estilo Arquitectónico */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-[#073E48] mb-1.5">
                      ¿Qué estilo de casa va más con tus gustos?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {ESTILOS_CASA.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setEstilo(item.id)}
                          className={cn(
                            "p-4 rounded-2xl border-2 transition-all text-left flex flex-col justify-between relative",
                            estilo === item.id
                              ? "border-[#27D8BE] bg-[#27D8BE]/10 shadow-sm"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          )}
                        >
                          {item.popular && (
                            <span className="absolute top-2.5 right-2.5 bg-[#073E48] text-[#27D8BE] text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                              Popular
                            </span>
                          )}
                          <div className="text-2xl mb-2">{item.icono}</div>
                          <span className="text-sm font-extrabold text-[#073E48]">
                            {item.nombre}
                          </span>
                          <span className="text-xs text-slate-500 font-normal mt-1 leading-snug">
                            {item.subtitulo}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sistema Constructivo */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-[#073E48] mb-1.5">
                      Sistema o material constructivo preferido
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SISTEMAS_CONSTRUCTIVOS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSistema(item.id)}
                          className={cn(
                            "p-4 rounded-2xl border-2 transition-all text-left flex flex-col justify-between",
                            sistema === item.id
                              ? "border-[#27D8BE] bg-[#27D8BE]/10 shadow-sm"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-extrabold text-[#073E48]">
                              {item.nombre}
                            </span>
                            <span className="text-[10px] font-bold text-[#073E48] bg-slate-100 px-2 py-0.5 rounded-md">
                              {item.badge}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 font-normal leading-relaxed">
                            {item.ventaja}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nivel de Entrega */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-[#073E48] mb-1.5">
                      ¿Qué nivel de terminación buscas?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {NIVELES_ENTREGA.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setNivelEntrega(item.id)}
                          className={cn(
                            "p-4 rounded-2xl border-2 transition-all text-left flex flex-col justify-between",
                            nivelEntrega === item.id
                              ? "border-[#27D8BE] bg-[#27D8BE]/10 shadow-sm"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          )}
                        >
                          <span className="text-sm font-extrabold text-[#073E48] mb-1">
                            {item.nombre}
                          </span>
                          <span className="text-xs text-slate-500 font-normal leading-tight">
                            {item.desc}
                          </span>
                          <span className="mt-3 text-[11px] font-bold text-[#073E48] bg-white border border-slate-200 px-2 py-1 rounded-lg w-fit">
                            Ref: {item.rangoUfM2[0]} a {item.rangoUfM2[1]} UF/m²
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Botones de Navegación */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="text-slate-600 font-bold hover:bg-slate-100 rounded-full"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      className="h-13 px-8 rounded-full bg-[#073E48] text-white font-bold text-sm tracking-wider uppercase shadow-lg hover:bg-[#0a4d59] gap-2 transition-transform hover:scale-105"
                    >
                      <span>Siguiente: Metros y Terreno</span>
                      <ArrowRight className="h-4 w-4 text-[#27D8BE]" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ────────────────────────────────────────────────────────── */}
              {/* PASO 3: METROS CUADRADOS, TERRENO Y UBICACIÓN             */}
              {/* ────────────────────────────────────────────────────────── */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Slider de Metros Cuadrados */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-[#073E48] flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-[#27D8BE]" />
                        Superficie aproximada de la casa
                      </label>
                      <div className="text-right">
                        <span className="text-2xl font-black text-[#073E48]">
                          {superficieM2} m²
                        </span>
                        <span className="text-xs text-slate-500 block">
                          Sugerido según tus {dormitorios} dorms y {banos} baños
                        </span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min={36}
                      max={220}
                      step={4}
                      value={superficieM2}
                      onChange={(e) => setSuperficieM2(Number(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#073E48] mt-2 mb-4"
                    />

                    {/* Presets rápidos */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                        Tamaños típicos:
                      </span>
                      {[40, 54, 72, 85, 105, 130, 160].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setSuperficieM2(m)}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold border transition-colors",
                            superficieM2 === m
                              ? "bg-[#073E48] text-white border-[#073E48]"
                              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                          )}
                        >
                          {m} m²
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estado del Terreno */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-[#073E48] mb-2 flex items-center gap-2">
                      <Compass className="h-4 w-4 text-[#27D8BE]" />
                      ¿Tienes terreno disponible para construir?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          id: "propio",
                          label: "Sí, terreno propio con rol",
                          desc: "Listo para emplazar la vivienda",
                        },
                        {
                          id: "en_compra",
                          label: "En proceso de compra",
                          desc: "Promesa o búsqueda avanzada",
                        },
                        {
                          id: "buscando",
                          label: "Aún buscando terreno",
                          desc: "Planificando para los próximos meses",
                        },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setEstadoTerreno(item.id)}
                          className={cn(
                            "p-4 rounded-2xl border-2 transition-all text-left flex flex-col justify-between",
                            estadoTerreno === item.id
                              ? "border-[#27D8BE] bg-[#27D8BE]/10 shadow-sm font-bold"
                              : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                          )}
                        >
                          <span className="text-sm font-extrabold text-[#073E48] mb-1">
                            {item.label}
                          </span>
                          <span className="text-xs text-slate-500 font-normal leading-tight">
                            {item.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Región de Construcción */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-[#073E48] mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#27D8BE]" />
                      Región de Chile donde se construirá
                    </label>
                    <p className="text-xs text-slate-500 mb-2">
                      Filtraremos automáticamente las empresas y constructoras verificadas que tienen cobertura en tu zona.
                    </p>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-bold text-[#073E48] focus:border-[#27D8BE] focus:outline-none"
                    >
                      {REGIONES_CHILE.map((reg) => (
                        <option key={reg} value={reg}>
                          Región {reg}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Botones de Navegación */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep(2)}
                      className="text-slate-600 font-bold hover:bg-slate-100 rounded-full"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setStep(4);
                        trackCotizacionStart({ source: "hero_form" });
                      }}
                      className="h-13 px-8 rounded-full bg-[#073E48] text-white font-bold text-sm tracking-wider uppercase shadow-lg hover:bg-[#0a4d59] gap-2 transition-transform hover:scale-105"
                    >
                      <span>Ver Mi Cotización y Modelos</span>
                      <ArrowRight className="h-4 w-4 text-[#27D8BE]" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ────────────────────────────────────────────────────────── */}
              {/* PASO 4: RESULTADO DE COTIZACIÓN, MODELOS Y FORMULARIO     */}
              {/* ────────────────────────────────────────────────────────── */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Tarjeta Resumen de Cotización */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#073E48] to-[#04282F] text-white p-6 sm:p-8 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#27D8BE] block mb-1">
                          CONFIGURACIÓN PERSONALIZADA
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                          Tu Casa Ideal de {superficieM2} m²
                        </h3>
                      </div>
                      <div className="bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-bold text-[#27D8BE] flex items-center gap-1.5">
                        <BadgeCheck className="h-4 w-4" />
                        <span>Región {region}</span>
                      </div>
                    </div>

                    {/* Ficha Resumen de Parámetros */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 text-slate-200 text-xs">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Capacidad
                        </span>
                        <span className="font-bold text-white text-sm">
                          {habitantes} personas
                        </span>
                        <span className="text-[11px] text-[#27D8BE] block">
                          {literas ? "Con literas/visitas" : "Camas estándar"}
                        </span>
                      </div>

                      <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Distribución
                        </span>
                        <span className="font-bold text-white text-sm">
                          {dormitorios} Dorms · {banos} Baños
                        </span>
                        <span className="text-[11px] text-slate-300 block">
                          {superficieM2} m² construidos
                        </span>
                      </div>

                      <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Estilo
                        </span>
                        <span className="font-bold text-white text-sm capitalize">
                          {estilo}
                        </span>
                        <span className="text-[11px] text-[#27D8BE] block">
                          {sistema.toUpperCase()}
                        </span>
                      </div>

                      <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Terminación
                        </span>
                        <span className="font-bold text-white text-sm">
                          {nivelSeleccionado.nombre.split(" ")[0]}
                        </span>
                        <span className="text-[11px] text-slate-300 block">
                          {nivelSeleccionado.nombre}
                        </span>
                      </div>
                    </div>

                    {/* Estimación de Precio */}
                    <div className="bg-white/10 rounded-2xl p-4 sm:p-5 border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-0.5">
                          Rango de Inversión Estimado:
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-black text-[#27D8BE]">
                            {precioMinUf.toLocaleString("es-CL")} a {precioMaxUf.toLocaleString("es-CL")} UF
                          </span>
                          <span className="text-xs text-slate-300 font-semibold">
                            (aprox. {formatearClp(precioMinClp)} – {formatearClp(precioMaxClp)})
                          </span>
                        </div>
                      </div>

                      <Link
                        href={linkCatalogoFiltrado}
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-full bg-[#27D8BE] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#073E48] transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
                      >
                        <span>Ver modelos afines</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Formulario de Envío a Constructoras Verificadas */}
                  {success ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-8 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <h4 className="text-2xl font-black text-[#073E48] mb-2">
                        ¡Cotización enviada con éxito!
                      </h4>
                      <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                        Hemos recibido tu configuración de {superficieM2} m² para la Región {region}. Empresas verificadas de tu zona revisarán tu proyecto y te contactarán vía WhatsApp o correo con propuestas reales sin costo.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                          href={linkCatalogoFiltrado}
                          className="inline-flex items-center gap-2 rounded-full bg-[#073E48] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#0a4d59]"
                        >
                          Explorar modelos compatibles en catálogo
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSuccess(false);
                            setStep(1);
                          }}
                          className="rounded-full text-xs font-bold"
                        >
                          Configurar otra vivienda
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmitLead} className="space-y-4">
                      <div className="text-left mb-2">
                        <h4 className="text-lg font-black text-[#073E48]">
                          Recibe propuestas formales de constructoras en tu región
                        </h4>
                        <p className="text-xs text-slate-500">
                          Sin costo ni compromiso. Tu solicitud se enviará exclusivamente a empresas verificadas con cobertura en Región {region}.
                        </p>
                      </div>

                      <HoneypotFields />

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label
                            htmlFor={`${formId}-nombre`}
                            className="block text-xs font-bold text-[#073E48] uppercase tracking-wider mb-1"
                          >
                            Tu Nombre
                          </label>
                          <Input
                            id={`${formId}-nombre`}
                            name="nombre"
                            required
                            placeholder="Nombre y Apellido"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="h-12 rounded-xl text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`${formId}-telefono`}
                            className="block text-xs font-bold text-[#073E48] uppercase tracking-wider mb-1"
                          >
                            WhatsApp / Teléfono
                          </label>
                          <Input
                            id={`${formId}-telefono`}
                            name="telefono"
                            type="tel"
                            required
                            placeholder="+56 9 1234 5678"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className="h-12 rounded-xl text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`${formId}-email`}
                            className="block text-xs font-bold text-[#073E48] uppercase tracking-wider mb-1"
                          >
                            Correo Electrónico
                          </label>
                          <Input
                            id={`${formId}-email`}
                            name="email"
                            type="email"
                            required
                            placeholder="tu@correo.cl"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 rounded-xl text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor={`${formId}-mensaje`}
                          className="block text-xs font-bold text-[#073E48] uppercase tracking-wider mb-1"
                        >
                          Detalles o requerimientos especiales (Opcional)
                        </label>
                        <Input
                          id={`${formId}-mensaje`}
                          name="mensaje"
                          placeholder="Ej: Terreno con pendiente, necesito terraza amplia o entrega en 6 meses..."
                          value={mensajeExtra}
                          onChange={(e) => setMensajeExtra(e.target.value)}
                          className="h-12 rounded-xl text-sm"
                        />
                      </div>

                      {error && (
                        <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                          {error}
                        </p>
                      )}

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setStep(3)}
                          className="text-slate-600 font-bold hover:bg-slate-100 rounded-full order-2 sm:order-1"
                        >
                          <ArrowLeft className="h-4 w-4 mr-1.5" /> Modificar metros o terreno
                        </Button>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="h-14 px-8 rounded-full bg-[#073E48] text-white font-extrabold text-sm uppercase tracking-wider shadow-xl hover:bg-[#0a4d59] transition-all hover:scale-105 active:scale-95 gap-2 w-full sm:w-auto order-1 sm:order-2"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <span>Enviando cotización...</span>
                            </>
                          ) : (
                            <>
                              <span>SOLICITAR COTIZACIÓN FORMAL</span>
                              <Send className="h-4 w-4 text-[#27D8BE]" />
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-[11px] text-slate-500 font-semibold border-t border-slate-100">
                        <span className="flex items-center gap-1.5">
                          <Lock className="h-3.5 w-3.5 text-[#073E48]" /> Tus datos están 100% protegidos
                        </span>
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#27D8BE]" /> Constructoras verificadas
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5 text-amber-500" /> Cotización 100% gratuita
                        </span>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
