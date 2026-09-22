/**
 * ==============================================================================
 * ANTI-SPAM MULTI-LAYER SECURITY ENGINE
 * SoloCasasChile - Enterprise Grade Contact & Lead Protection
 * ==============================================================================
 * Protege formularios públicos contra bots automatizados y spam masivo
 * sin necesidad de CAPTCHAs intrusivos que degraden la UX.
 *
 * Capas implementadas:
 * 1. Honeypot Secreto (Campos trampa)
 * 2. Control de Velocidad / Timestamp Guard
 * 3. Detector Heurístico de Cadenas Aleatorias y Nombres de Bot
 * 4. Filtro de Contenido, Caracteres Cirílicos y Enlaces Múltiples
 * 5. Filtro de Correos Desechables / Temporales
 * 6. Limitador de Tasa por IP (Rate Limiter en Memoria)
 * 7. Descarte Silencioso (Silent Drop)
 */

import { checkRateLimit } from "./admin-guard";

// Lista curada de dominios de correos temporales / desechables
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "10minutemail.net",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamailblock.com",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "trashmail.com",
  "trashmail.net",
  "trashmail.org",
  "sharklasers.com",
  "dispostable.com",
  "getairmail.com",
  "fakemailgenerator.com",
  "throwawaymail.com",
  "getnada.com",
  "inboxkitten.com",
  "dropmail.me",
  "mohmal.com",
  "generator.email",
  "emailondeck.com",
  "burnermail.io",
  "crazymailing.com",
  "mytemp.email",
]);

// Palabras clave recurrentes en spam de bots comerciales
export const SPAM_KEYWORD_PATTERNS = [
  /\b(seo ranking|increase traffic|search engine ranking|backlinks?|guest post|outreach link)\b/i,
  /\b(crypto|bitcoin|btc|usdt|ethereum|binance|forex trading|invest binary|passive income crypto)\b/i,
  /\b(telegram (bot|channel|group)|whatsapp marketing|bulk messages?)\b/i,
  /\b(online casino|slot online|poker online|gambling|sports betting|jackpot)\b/i,
  /\b(viagra|cialis|pharmacy online|weight loss pills)\b/i,
  /\b(dating site|hot girls|hookup|sugar daddy|webcam girls|onlyfans leak)\b/i,
  /\b(rank your website|page 1 on google|digital marketing agency in (india|pakistan))\b/i,
];

export interface AntiSpamInput {
  honeypot?: string | null;
  honeypotAlt?: string | null;
  formTime?: number | string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  ip?: string | null;
  /** Mínimo de segundos requerido desde el montaje del formulario (default: 2) */
  minSeconds?: number;
  /** Permite saltar la validación de tiempo en contextos controlados o llamadas internas */
  skipVelocityCheck?: boolean;
}

export interface AntiSpamResult {
  isSpam: boolean;
  layer?:
    | "honeypot"
    | "velocity"
    | "bot_name"
    | "content_filter"
    | "disposable_email"
    | "rate_limit";
  reason?: string;
  details?: Record<string, unknown>;
}

// ------------------------------------------------------------------------------
// 1. Capa Honeypot
// ------------------------------------------------------------------------------
export function checkHoneypot(
  honeypot?: string | null,
  honeypotAlt?: string | null
): { isSpam: boolean; reason?: string } {
  if (honeypot && typeof honeypot === "string" && honeypot.trim().length > 0) {
    return { isSpam: true, reason: "honeypot_field_populated" };
  }
  if (honeypotAlt && typeof honeypotAlt === "string" && honeypotAlt.trim().length > 0) {
    return { isSpam: true, reason: "honeypot_alt_field_populated" };
  }
  return { isSpam: false };
}

// ------------------------------------------------------------------------------
// 2. Capa Timestamp Guard (Velocity Check)
// ------------------------------------------------------------------------------
export function checkSubmissionVelocity(
  formTime?: number | string | null,
  minSeconds = 2
): { isSpam: boolean; reason?: string; elapsedMs?: number } {
  if (formTime === undefined || formTime === null || formTime === "") {
    return { isSpam: true, reason: "missing_form_timestamp" };
  }

  const parsedTime = Number(formTime);
  if (isNaN(parsedTime) || parsedTime <= 0) {
    return { isSpam: true, reason: "invalid_form_timestamp" };
  }

  const now = Date.now();
  const elapsed = now - parsedTime;

  // Si fue enviado en menos de minSeconds segundos (un humano no lee y llena en < 2s)
  if (elapsed < minSeconds * 1000) {
    return { isSpam: true, reason: "submitted_too_fast", elapsedMs: elapsed };
  }

  // Si el timestamp viene del futuro por más de 10s (reloj alterado/bot)
  if (elapsed < -10000) {
    return { isSpam: true, reason: "future_timestamp", elapsedMs: elapsed };
  }

  // Si el formulario estuvo abierto más de 24 horas (opcional: expirado/stale)
  if (elapsed > 24 * 60 * 60 * 1000) {
    return { isSpam: true, reason: "expired_form_timestamp", elapsedMs: elapsed };
  }

  return { isSpam: false, elapsedMs: elapsed };
}

// ------------------------------------------------------------------------------
// 3. Capa Detector Heurístico de Cadenas Aleatorias / Nombres de Bot
// ------------------------------------------------------------------------------
export function checkBotName(name?: string | null): { isSpam: boolean; reason?: string } {
  if (!name || typeof name !== "string") return { isSpam: false };
  const trimmed = name.trim();
  if (trimmed.length === 0) return { isSpam: false };

  // a) Presencia de etiquetas HTML o URLs en el campo de nombre
  if (/<[^>]*>/i.test(trimmed) || /(href|src)\s*=/i.test(trimmed)) {
    return { isSpam: true, reason: "name_contains_html" };
  }

  if (/(https?:\/\/|www\.|\.(xyz|ru|cn|top|click|link|biz|info)\b)/i.test(trimmed)) {
    return { isSpam: true, reason: "name_contains_url" };
  }

  // b) Análisis de tokens (palabras individuales)
  const tokens = trimmed.split(/\s+/).filter(Boolean);

  for (const token of tokens) {
    // Si la palabra tiene 6 o más caracteres, evaluamos patrones de generadores
    if (token.length >= 6) {
      // 1) Inicia con minúscula seguida inmediatamente por mayúscula (ej: cQTKNttFO, pBAMFPzH, fGmY...)
      // En nombres humanos reales NUNCA una palabra empieza en minúscula seguida de mayúscula
      if (/^[a-z][A-Z]/.test(token)) {
        return { isSpam: true, reason: "name_lowercase_to_uppercase_prefix" };
      }

      // 2) 5 o más consonantes consecutivas sin vocales (ej: BNPGWHn, cQTKNtt, pBAMFPzH)
      // Consonantes en español/inglés: bcdfghjklmnpqrstvwxyz (sin vocales aeiouáéíóúü)
      if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(token)) {
        return { isSpam: true, reason: "name_consecutive_consonants" };
      }

      // 3) Mezcla caótica de mayúsculas y minúsculas sin espacios
      // Excluyendo prefijos humanos conocidos como Mc, Mac, De, etc.
      let switches = 0;
      let prevUpper: boolean | null = null;
      for (const ch of token) {
        if (/[a-zA-Z]/.test(ch)) {
          const isUpper = ch === ch.toUpperCase();
          if (prevUpper !== null && isUpper !== prevUpper) {
            switches++;
          }
          prevUpper = isUpper;
        }
      }

      const isKnownPrefix = /^(Mc|Mac|De|Van|Von|La|Le|Du)/.test(token);
      if (switches >= 3 && !isKnownPrefix) {
        return { isSpam: true, reason: "name_chaotic_casing_detected" };
      }
      if (switches >= 4) {
        return { isSpam: true, reason: "name_chaotic_casing_detected" };
      }

      // 4) Solo consonantes (palabra larga sin ninguna vocal ni 'y')
      if (token.length >= 6 && !/[aeiouáéíóúü]/i.test(token)) {
        return { isSpam: true, reason: "name_no_vowels" };
      }
    }
  }

  return { isSpam: false };
}

// ------------------------------------------------------------------------------
// 4. Capa Filtro de Contenido y Caracteres Extraños
// ------------------------------------------------------------------------------
export function checkContentFilter(message?: string | null): { isSpam: boolean; reason?: string } {
  if (!message || typeof message !== "string") return { isSpam: false };
  const text = message.trim();
  if (text.length === 0) return { isSpam: false };

  // a) Caracteres Cirílicos (Ruso / Europa del Este en formularios chilenos)
  if (/[а-яА-ЯёЁ]/.test(text)) {
    return { isSpam: true, reason: "cyrillic_characters_detected" };
  }

  // b) Detección de 2 o más enlaces en el cuerpo del mensaje
  const linkMatches = text.match(/(https?:\/\/|www\.)/gi) || [];
  if (linkMatches.length >= 2) {
    return { isSpam: true, reason: "multiple_links_detected" };
  }

  // c) Palabras clave de spam masivo
  for (const pattern of SPAM_KEYWORD_PATTERNS) {
    if (pattern.test(text)) {
      return { isSpam: true, reason: "spam_keywords_detected" };
    }
  }

  return { isSpam: false };
}

// ------------------------------------------------------------------------------
// 5. Capa Filtro de Correos Desechables / Temporales
// ------------------------------------------------------------------------------
export function checkDisposableEmail(email?: string | null): { isSpam: boolean; reason?: string } {
  if (!email || typeof email !== "string") return { isSpam: false };
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) return { isSpam: false };

  const domain = parts[1];
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { isSpam: true, reason: "disposable_email_domain" };
  }

  // Patrones sospechosos de dominios temporales
  if (/(temp|fake|dispos|trash|burner|throwaway|generator)mail/i.test(domain)) {
    return { isSpam: true, reason: "disposable_email_pattern" };
  }

  return { isSpam: false };
}

// ------------------------------------------------------------------------------
// 6. Capa Limitador de Tasa por IP (3 a 5 envíos cada 10 minutos)
// ------------------------------------------------------------------------------
export function checkIpRateLimit(
  ip: string,
  limit = 5,
  windowMinutes = 10
): { isSpam: boolean; retryAfterSeconds: number } {
  if (!ip || ip === "unknown") return { isSpam: false, retryAfterSeconds: 0 };

  const windowMs = windowMinutes * 60 * 1000;
  const result = checkRateLimit({
    key: `anti-spam:lead:${ip}`,
    limit,
    windowMs,
  });

  if (!result.ok) {
    return { isSpam: true, retryAfterSeconds: result.retryAfterSeconds };
  }

  return { isSpam: false, retryAfterSeconds: 0 };
}

// ------------------------------------------------------------------------------
// 7. Motor Unificado Multi-Capa con Descarte Silencioso (Silent Drop)
// ------------------------------------------------------------------------------
export function evaluateAntiSpam(input: AntiSpamInput): AntiSpamResult {
  // Capa 1: Honeypot (trampas ocultas)
  const honeypotCheck = checkHoneypot(input.honeypot, input.honeypotAlt);
  if (honeypotCheck.isSpam) {
    return {
      isSpam: true,
      layer: "honeypot",
      reason: honeypotCheck.reason,
    };
  }

  // Capa 2: Velocidad de envío (Timestamp Guard)
  if (!input.skipVelocityCheck) {
    const velocityCheck = checkSubmissionVelocity(input.formTime, input.minSeconds ?? 2);
    if (velocityCheck.isSpam) {
      return {
        isSpam: true,
        layer: "velocity",
        reason: velocityCheck.reason,
        details: { elapsedMs: velocityCheck.elapsedMs },
      };
    }
  }

  // Capa 3: Nombre de bot / Cadenas caóticas
  const botNameCheck = checkBotName(input.name);
  if (botNameCheck.isSpam) {
    return {
      isSpam: true,
      layer: "bot_name",
      reason: botNameCheck.reason,
      details: { name: input.name },
    };
  }

  // Capa 4: Contenido, Cirílico y Enlaces
  const contentCheck = checkContentFilter(input.message);
  if (contentCheck.isSpam) {
    return {
      isSpam: true,
      layer: "content_filter",
      reason: contentCheck.reason,
    };
  }

  // Capa 5: Correo desechable
  const emailCheck = checkDisposableEmail(input.email);
  if (emailCheck.isSpam) {
    return {
      isSpam: true,
      layer: "disposable_email",
      reason: emailCheck.reason,
      details: { email: input.email },
    };
  }

  // Capa 6: Limitador por IP (5 envíos / 10 min)
  if (input.ip) {
    const rateCheck = checkIpRateLimit(input.ip, 5, 10);
    if (rateCheck.isSpam) {
      return {
        isSpam: true,
        layer: "rate_limit",
        reason: "ip_rate_limit_exceeded",
        details: { retryAfterSeconds: rateCheck.retryAfterSeconds },
      };
    }
  }

  return { isSpam: false };
}

/**
 * Payload de respuesta de descarte silencioso para engañar a los bots.
 * Retorna estado de éxito aparente para evitar que reintenten o prueben nuevas técnicas.
 */
export const SILENT_DROP_RESPONSE = {
  success: true,
  ok: true,
  filtered: true,
} as const;
