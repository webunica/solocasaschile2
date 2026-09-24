"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  Gift,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BILLING_OPTIONS,
  CHECKOUT_PLANS,
  type BillingCycle,
  getBillingCycleSavingsUf,
  getCheckoutPlanPriceUf,
  getCheckoutCoupon,
  getCheckoutPriceWithCoupon,
  normalizeCouponCode,
  isBillingCycle,
  isDirectCheckoutPlan,
} from "@/lib/payments/plans";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const rawPlan = searchParams.get("plan") || "pro";
  const rawBilling = searchParams.get("billing") || "yearly";
  const plan = isDirectCheckoutPlan(rawPlan) ? rawPlan : "pro";
  const initialBilling: BillingCycle = isBillingCycle(rawBilling) ? rawBilling : "yearly";
  const [billing, setBilling] = useState<BillingCycle>(initialBilling);
  const planConfig = CHECKOUT_PLANS[plan];
  const selectedBillingOption = BILLING_OPTIONS.find((option) => option.id === billing) ?? BILLING_OPTIONS[0];
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const price = useMemo(
    () => getCheckoutPriceWithCoupon(plan, billing, appliedCouponCode),
    [plan, billing, appliedCouponCode]
  );
  const appliedCoupon = price.coupon;

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados sincronizados con la constructora
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [repName, setRepName] = useState("");
  const [phone, setPhone] = useState("");
  const [rut, setRut] = useState("");

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setIsAuthenticated(true);
          const emailVal = user.email || "";
          setUserEmail(emailVal);

          // Buscar datos de la constructora asociada para prellenar
          const { data: constructora } = await supabase
            .from("constructoras")
            .select("nombre, telefono, rut, razon_social")
            .eq("id", user.id)
            .maybeSingle();

          const metaName = (user.user_metadata?.nombre as string) || "";
          const metaRep = (user.user_metadata?.representante as string) || "";
          const metaPhone = (user.user_metadata?.telefono as string) || "";
          const metaRut = (user.user_metadata?.rut as string) || "";

          if (constructora?.nombre || metaName) setCompanyName(constructora?.nombre || metaName);
          if (metaRep) setRepName(metaRep);
          if (constructora?.telefono || metaPhone) setPhone(constructora?.telefono || metaPhone);
          if (constructora?.rut || metaRut) setRut(constructora?.rut || metaRut);
        }
      } catch (e) {
        console.error("Error prellenando checkout:", e);
      }
    }
    loadCurrentUser();
  }, []);

  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.trim().toLowerCase();
    if (!val || isAuthenticated) return;
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data } = await supabase
        .from("constructoras")
        .select("nombre, telefono, rut")
        .ilike("email", val)
        .maybeSingle();

      if (data) {
        if (data.nombre && !companyName) setCompanyName(data.nombre);
        if (data.telefono && !phone) setPhone(data.telefono);
        if (data.rut && !rut) setRut(data.rut);
      }
    } catch {
      // Ignorar errores en lookup anónimo
    }
  };

  const handleApplyCoupon = () => {
    const normalized = normalizeCouponCode(couponInput);

    if (!normalized) {
      setAppliedCouponCode("");
      setCouponError(null);
      return;
    }

    const coupon = getCheckoutCoupon(normalized);

    if (!coupon) {
      setAppliedCouponCode("");
      setCouponError("Cupón no válido o expirado.");
      return;
    }

    setAppliedCouponCode(coupon.code);
    setCouponInput(coupon.code);
    setCouponError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (!isAuthenticated) {
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
      if (!password || password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          billing,
          email: isAuthenticated ? userEmail : String(formData.get("email") || userEmail),
          password: isAuthenticated ? "" : password,
          companyName: String(formData.get("companyName") || companyName),
          repName: String(formData.get("repName") || repName),
          phone: String(formData.get("phone") || phone),
          rut: String(formData.get("rut") || rut),
          couponCode: appliedCoupon?.code,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        setError(data.error || "No pudimos iniciar el pago. Intenta nuevamente.");
        setIsLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Ocurrió un error inesperado. Intenta nuevamente.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-28 md:px-10 md:py-36">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <section className="space-y-8">
          <Link
            href="/planes"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground transition-colors hover:text-brand-indigo"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a planes
          </Link>

          <div className="space-y-5">
            <Link href="/" className="inline-flex">
              <Image
                src="/images/solocasaschile-logo.png"
                alt="SolocasasChile"
                width={434}
                height={70}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>
            <Badge className="bg-brand-teal/10 text-brand-indigo border-brand-teal/20 font-black uppercase tracking-widest">
              Checkout seguro
            </Badge>
            <h1 className="max-w-2xl text-4xl font-heading font-black leading-none tracking-tighter text-brand-indigo md:text-6xl">
              Crea tu cuenta y activa tu plan en un solo paso
            </h1>
            <p className="max-w-xl text-lg font-medium leading-relaxed text-muted-foreground">
              Primero dejamos tu perfil listo, luego te enviamos a Flow. Al confirmarse el pago,
              tu plan queda activo de inmediato y entras directo a tu panel.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: LockKeyhole, title: "Cuenta segura", text: "Sesion creada antes del pago." },
              { icon: CreditCard, title: "Pago Flow", text: "Transaccion bancaria protegida." },
              { icon: ShieldCheck, title: "Activacion", text: "Plan activo al confirmar." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/50 bg-white p-5 shadow-sm">
                <item.icon className="mb-4 h-5 w-5 text-brand-teal" />
                <p className="text-sm font-black uppercase tracking-tight text-foreground">{item.title}</p>
                <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6">
          <div className="rounded-[2rem] border border-border/50 bg-white p-6 shadow-xl shadow-slate-200/70 md:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-border/50 pb-6">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-brand-teal">Resumen</p>
                <h2 className="mt-2 text-3xl font-black tracking-tighter text-foreground">{planConfig.name}</h2>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Elige cuanto tiempo quieres activar tu cuenta.
                </p>
              </div>
              <div className="rounded-2xl bg-brand-teal/10 p-3 text-brand-teal">
                <Zap className="h-6 w-6" />
              </div>
            </div>

            <div className="grid gap-3 py-6">
              {BILLING_OPTIONS.map((option) => {
                const optionPrice = getCheckoutPlanPriceUf(plan, option.id);
                const savings = getBillingCycleSavingsUf(plan, option.id);
                const isSelected = billing === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setBilling(option.id)}
                    className={cn(
                      "w-full rounded-2xl border p-4 text-left transition-all",
                      "hover:-translate-y-0.5 hover:border-brand-teal/70 hover:bg-brand-teal/5",
                      isSelected
                        ? "border-brand-teal bg-brand-teal/10 shadow-lg shadow-brand-teal/10"
                        : "border-border/60 bg-slate-50"
                    )}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span
                          className={cn(
                            "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                            isSelected ? "border-brand-teal bg-brand-teal" : "border-slate-300 bg-white"
                          )}
                        >
                          {isSelected && <span className="h-2 w-2 rounded-full bg-brand-indigo" />}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-black uppercase tracking-tight text-foreground">
                              {option.title}
                            </p>
                            {option.badge && (
                              <Badge className="rounded-md border-none bg-brand-indigo text-[10px] font-black uppercase tracking-widest text-white">
                                {option.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground">
                            {option.benefit}
                          </p>
                          <p className="mt-2 text-xs font-bold text-slate-500">
                            {optionPrice.displayUf} UF x {option.months} {option.months === 1 ? "mes" : "meses"} = {optionPrice.totalUf} UF
                          </p>
                          {savings > 0 && (
                            <p className="mt-2 text-xs font-black uppercase tracking-widest text-emerald-600">
                              Ahorras {savings} UF frente al pago mensual
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black tracking-tighter text-brand-indigo">
                          {optionPrice.displayUf}
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          UF / mes
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-end justify-between gap-4 border-t border-border/50 py-6">
              <div>
                <p className="text-5xl font-black tracking-tighter text-brand-indigo">
                  {price.displayUf}
                </p>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{price.label}</p>
              </div>
              {billing !== "monthly" && (
                <Badge className="bg-red-500 text-white border-none font-black uppercase tracking-widest">
                  {billing === "yearly" ? planConfig.annualDiscountLabel : "10% OFF semestral"}
                </Badge>
              )}
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Total a pagar ahora
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-4 text-sm font-bold text-muted-foreground">
                  <span>Subtotal ({selectedBillingOption.months} {selectedBillingOption.months === 1 ? "mes" : "meses"})</span>
                  <span>{price.subtotalUf} UF</span>
                </div>
                <p className="text-xs font-semibold text-slate-500">
                  {getCheckoutPlanPriceUf(plan, billing).displayUf} UF x {selectedBillingOption.months} {selectedBillingOption.months === 1 ? "mes" : "meses"} = {price.subtotalUf} UF
                </p>
                {appliedCoupon && (
                  <div className="flex items-center justify-between gap-4 text-sm font-black text-emerald-600">
                    <span>{appliedCoupon.label}</span>
                    <span>-{price.discountUf} UF</span>
                  </div>
                )}
                <div className="flex items-end justify-between gap-4 border-t border-border/60 pt-3">
                  <span className="text-sm font-black uppercase tracking-widest text-foreground">Total</span>
                  <span className="text-2xl font-black tracking-tighter text-foreground">{price.totalUf} UF</span>
                </div>
                {selectedBillingOption.months > 1 && (
                  <p className="text-xs font-semibold text-slate-500">
                    Equivale a {price.displayUf} UF por mes durante {selectedBillingOption.months} meses.
                  </p>
                )}
              </div>
              <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground">
                Flow calcula el cargo en pesos chilenos al valor UF vigente del dia.
              </p>
            </div>

            <div className="mt-4 border-t border-border/50 pt-4">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-brand-teal" />
                <p className="text-xs font-black uppercase tracking-widest text-brand-indigo">
                  Cupon de descuento
                </p>
              </div>
              <div className="mt-3 flex gap-2">
                <Input
                  value={couponInput}
                  onChange={(event) => {
                    setCouponInput(event.target.value);
                    setCouponError(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleApplyCoupon();
                    }
                  }}
                  placeholder="SOLOCASAS10"
                  className="h-11 rounded-xl bg-slate-50 font-black uppercase tracking-widest"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleApplyCoupon}
                  className="h-11 rounded-xl px-4 font-black uppercase tracking-widest"
                >
                  Aplicar
                </Button>
              </div>
              {couponError && (
                <p className="mt-2 text-xs font-bold text-red-600">{couponError}</p>
              )}
              {appliedCoupon && !couponError && (
                <p className="mt-2 text-xs font-bold text-emerald-600">
                  {appliedCoupon.code} aplicado: {appliedCoupon.description}
                </p>
              )}
            </div>

            <ul className="mt-6 space-y-3">
              {planConfig.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-border/50 bg-white p-6 shadow-xl shadow-slate-200/70 md:p-8">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-widest text-brand-teal">Datos de acceso</p>
              <h2 className="mt-2 text-2xl font-black tracking-tighter text-foreground">
                {isAuthenticated ? "Confirma tus datos y activa tu plan" : "Registra tu constructora"}
              </h2>
            </div>

            {isAuthenticated && (
              <div className="mb-5 flex items-center justify-between rounded-2xl border border-brand-teal/20 bg-brand-teal/10 p-4 text-brand-teal">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-teal" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-brand-indigo">Sesión iniciada</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{userEmail}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-brand-teal/30 bg-white/80 text-[10px] font-bold text-brand-teal">
                  Datos sincronizados
                </Badge>
              </div>
            )}

            {error && (
              <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold leading-relaxed text-red-600">
                {error}
              </div>
            )}

            <div className="grid gap-5">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Nombre constructora
                </Label>
                <Input 
                  id="companyName" 
                  name="companyName" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ej: Constructora Modular SpA"
                  required 
                  className="h-13 rounded-xl bg-slate-50 font-bold" 
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="repName" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Nombre responsable
                  </Label>
                  <Input 
                    id="repName" 
                    name="repName" 
                    value={repName}
                    onChange={(e) => setRepName(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    required 
                    className="h-13 rounded-xl bg-slate-50 font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    WhatsApp
                  </Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+56 9 1234 5678"
                    required 
                    className="h-13 rounded-xl bg-slate-50 font-bold" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rut" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  RUT empresa
                </Label>
                <Input 
                  id="rut" 
                  name="rut" 
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  placeholder="76.123.456-K"
                  className="h-13 rounded-xl bg-slate-50 font-bold" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Email
                </Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={isAuthenticated ? userEmail : undefined}
                  defaultValue={!isAuthenticated ? userEmail : undefined}
                  readOnly={isAuthenticated}
                  onBlur={handleEmailBlur}
                  required 
                  placeholder="contacto@tuempresa.cl"
                  className={cn(
                    "h-13 rounded-xl font-bold",
                    isAuthenticated ? "bg-slate-100 text-muted-foreground cursor-not-allowed" : "bg-slate-50"
                  )} 
                />
                {isAuthenticated && (
                  <p className="text-[10px] text-muted-foreground italic">
                    Tu suscripción se vinculará directamente a esta cuenta.
                  </p>
                )}
              </div>

              {!isAuthenticated && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        minLength={6}
                        required
                        placeholder="Mínimo 6 caracteres"
                        className="h-13 rounded-xl bg-slate-50 pr-11 font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Confirmar
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      minLength={6}
                      required
                      placeholder="Repite la contraseña"
                      className="h-13 rounded-xl bg-slate-50 font-bold"
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={cn(
                "mt-7 h-14 w-full rounded-xl bg-brand-teal text-brand-indigo font-black uppercase tracking-widest shadow-xl shadow-brand-teal/20 transition-transform active:scale-95",
                "hover:bg-[#34dac5]"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isAuthenticated ? "Continuar al pago con Flow" : "Crear cuenta y pagar"}{" "}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <p className="mt-5 text-center text-xs font-medium leading-relaxed text-muted-foreground">
              Al continuar aceptas los{" "}
              <Link href="/terminos" className="font-bold text-brand-indigo hover:underline">
                terminos
              </Link>{" "}
              y la{" "}
              <Link href="/privacidad" className="font-bold text-brand-indigo hover:underline">
                privacidad
              </Link>
              . Si ya tienes cuenta, usa el mismo email y contrasena para continuar.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-brand-indigo" />
        </main>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}
