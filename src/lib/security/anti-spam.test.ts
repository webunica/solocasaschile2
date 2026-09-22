import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  checkHoneypot,
  checkSubmissionVelocity,
  checkBotName,
  checkContentFilter,
  checkDisposableEmail,
  checkIpRateLimit,
  evaluateAntiSpam,
  SILENT_DROP_RESPONSE,
} from "./anti-spam";

describe("Anti-Spam Security Engine", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Capa 1: Honeypot Secreto", () => {
    it("debe rechazar solicitudes con campo website lleno", () => {
      const res = checkHoneypot("http://spam-bot.com", "");
      expect(res.isSpam).toBe(true);
      expect(res.reason).toBe("honeypot_field_populated");
    });

    it("debe rechazar solicitudes con campo alternativo lleno (b_website)", () => {
      const res = checkHoneypot("", "spam content");
      expect(res.isSpam).toBe(true);
      expect(res.reason).toBe("honeypot_alt_field_populated");
    });

    it("debe aceptar cuando los campos trampa están vacíos o null", () => {
      const res = checkHoneypot("", "");
      expect(res.isSpam).toBe(false);

      const resNull = checkHoneypot(null, undefined);
      expect(resNull.isSpam).toBe(false);
    });
  });

  describe("Capa 2: Control de Velocidad (Timestamp Guard)", () => {
    it("debe rechazar envíos inhumanamente rápidos (< 2 segundos)", () => {
      const now = Date.now();
      const formTime = now - 400; // 400 ms desde carga
      const res = checkSubmissionVelocity(formTime, 2);
      expect(res.isSpam).toBe(true);
      expect(res.reason).toBe("submitted_too_fast");
    });

    it("debe rechazar solicitudes sin timestamp", () => {
      const res = checkSubmissionVelocity(undefined, 2);
      expect(res.isSpam).toBe(true);
      expect(res.reason).toBe("missing_form_timestamp");
    });

    it("debe aceptar envíos humanos (> 2 segundos)", () => {
      const now = Date.now();
      const formTime = now - 4500; // 4.5 segundos
      const res = checkSubmissionVelocity(formTime, 2);
      expect(res.isSpam).toBe(false);
    });
  });

  describe("Capa 3: Detector Heurístico de Cadenas Aleatorias / Nombres Bot", () => {
    it("debe detectar los ejemplos exactos de bots reportados por el usuario", () => {
      // 5+ consonantes consecutivas o mezcla caótica
      expect(checkBotName("cQTKNttFO").isSpam).toBe(true);
      expect(checkBotName("pBAMFPzH").isSpam).toBe(true);
      expect(checkBotName("BNPGWHn").isSpam).toBe(true);
      expect(checkBotName("XzTkPlm").isSpam).toBe(true);
    });

    it("debe rechazar nombres que contengan URLs o dominios sospechosos", () => {
      expect(checkBotName("John https://casino.xyz").isSpam).toBe(true);
      expect(checkBotName("Best SEO .ru agency").isSpam).toBe(true);
    });

    it("debe rechazar nombres con etiquetas HTML", () => {
      expect(checkBotName("<a href='hack'>Click</a>").isSpam).toBe(true);
    });

    it("debe permitir nombres humanos chilenos y extranjeros reales", () => {
      expect(checkBotName("Carlos Morales").isSpam).toBe(false);
      expect(checkBotName("María José O'Higgins").isSpam).toBe(false);
      expect(checkBotName("Javier Miller").isSpam).toBe(false);
      expect(checkBotName("Rodrigo Del Canto").isSpam).toBe(false);
      expect(checkBotName("Ana").isSpam).toBe(false);
      expect(checkBotName("McGregor").isSpam).toBe(false);
    });
  });

  describe("Capa 4: Filtro de Contenido, Cirílico y Enlaces Múltiples", () => {
    it("debe rechazar mensajes con caracteres cirílicos (rusos)", () => {
      const res = checkContentFilter("Привет, мы предлагаем продвижение сайтов и сео");
      expect(res.isSpam).toBe(true);
      expect(res.reason).toBe("cyrillic_characters_detected");
    });

    it("debe rechazar mensajes con 2 o más enlaces comerciales", () => {
      const res = checkContentFilter("Visita https://sitio1.com y también www.sitio2.com");
      expect(res.isSpam).toBe(true);
      expect(res.reason).toBe("multiple_links_detected");
    });

    it("debe rechazar mensajes con palabras clave de spam masivo (SEO, cripto, etc.)", () => {
      expect(checkContentFilter("We can guarantee top seo ranking and backlinks").isSpam).toBe(true);
      expect(checkContentFilter("Earn passive income crypto binance telegram bot").isSpam).toBe(true);
      expect(checkContentFilter("Buy cheap viagra and online casino jackpot").isSpam).toBe(true);
    });

    it("debe permitir consultas legítimas sobre casas y construcción", () => {
      const legit =
        "Hola, me interesa cotizar el modelo Roble Andino en la Región del Maule. Tengo terreno propio con rol único y factibilidad de luz y agua.";
      expect(checkContentFilter(legit).isSpam).toBe(false);
    });
  });

  describe("Capa 5: Filtro de Correos Desechables / Temporales", () => {
    it("debe rechazar dominios conocidos de correos desechables", () => {
      expect(checkDisposableEmail("bot123@mailinator.com").isSpam).toBe(true);
      expect(checkDisposableEmail("spammer@tempmail.com").isSpam).toBe(true);
      expect(checkDisposableEmail("user@10minutemail.com").isSpam).toBe(true);
      expect(checkDisposableEmail("test@guerrillamail.com").isSpam).toBe(true);
      expect(checkDisposableEmail("test@yopmail.com").isSpam).toBe(true);
      expect(checkDisposableEmail("bot@sharklasers.com").isSpam).toBe(true);
    });

    it("debe permitir correos corporativos y proveedores comunes", () => {
      expect(checkDisposableEmail("juan.perez@gmail.com").isSpam).toBe(false);
      expect(checkDisposableEmail("contacto@arquitectura.cl").isSpam).toBe(false);
      expect(checkDisposableEmail("carolina@outlook.com").isSpam).toBe(false);
      expect(checkDisposableEmail("pedro@mi-empresa.cl").isSpam).toBe(false);
    });
  });

  describe("Capa 6: Limitador de Tasa por IP", () => {
    it("debe permitir hasta 5 envíos y bloquear el 6to dentro de la ventana", () => {
      const ip = "192.168.1.99";
      for (let i = 0; i < 5; i++) {
        const res = checkIpRateLimit(ip, 5, 10);
        expect(res.isSpam).toBe(false);
      }
      // El 6to intento debe ser bloqueado
      const blocked = checkIpRateLimit(ip, 5, 10);
      expect(blocked.isSpam).toBe(true);
      expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    });
  });

  describe("Capa 7: Motor Integral evaluateAntiSpam con Descarte Silencioso", () => {
    it("debe validar un lead humano perfecto", () => {
      const res = evaluateAntiSpam({
        name: "Gonzalo Valenzuela",
        email: "gonzalo.valenzuela@gmail.com",
        phone: "+56912345678",
        message: "Hola, me gustaría saber si instalan en Villarrica y el costo de fundaciones.",
        formTime: Date.now() - 5000,
        honeypot: "",
        honeypotAlt: "",
        ip: "200.89.68.10",
      });

      expect(res.isSpam).toBe(false);
    });

    it("debe descartar silenciosamente bots con Honeypot lleno", () => {
      const res = evaluateAntiSpam({
        name: "Carlos",
        email: "carlos@gmail.com",
        honeypot: "http://bot.site",
        formTime: Date.now() - 6000,
      });

      expect(res.isSpam).toBe(true);
      expect(res.layer).toBe("honeypot");
    });

    it("debe descartar silenciosamente bots ultrarrápidos con nombres caóticos", () => {
      const res = evaluateAntiSpam({
        name: "cQTKNttFO",
        email: "cqt@tempmail.com",
        formTime: Date.now() - 200, // 200ms
      });

      expect(res.isSpam).toBe(true);
    });

    it("debe tener definida la respuesta de descarte silencioso", () => {
      expect(SILENT_DROP_RESPONSE.success).toBe(true);
      expect(SILENT_DROP_RESPONSE.filtered).toBe(true);
    });
  });
});
