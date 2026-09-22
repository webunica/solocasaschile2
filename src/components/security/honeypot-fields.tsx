"use client";

import { useEffect, useState } from "react";

interface HoneypotFieldsProps {
  onTimeReady?: (timestamp: number) => void;
  className?: string;
}

/**
 * HoneypotFields
 * Componente de seguridad anti-spam multicapa invisible para usuarios humanos.
 * Contiene:
 * 1. Trampas honeypot (`b_website` y `website`) ocultas mediante posicionamiento fuera de pantalla.
 * 2. Timestamp guard (`_form_time`) para medir la velocidad de interacción del formulario.
 */
export function HoneypotFields({ onTimeReady, className }: HoneypotFieldsProps) {
  const [formTime, setFormTime] = useState<number>(() =>
    typeof window !== "undefined" ? Date.now() : 0
  );

  useEffect(() => {
    if (!formTime) {
      const now = Date.now();
      setFormTime(now);
      onTimeReady?.(now);
    }
  }, [formTime, onTimeReady]);

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        width: "1px",
        height: "1px",
        opacity: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: -1,
      }}
      tabIndex={-1}
    >
      {/* Decoy field 1: b_website */}
      <input
        type="text"
        name="b_website"
        defaultValue=""
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {/* Decoy field 2: website */}
      <input
        type="text"
        name="website"
        defaultValue=""
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {/* Timestamp guard */}
      <input
        type="hidden"
        name="_form_time"
        value={formTime || ""}
        suppressHydrationWarning
      />
    </div>
  );
}
