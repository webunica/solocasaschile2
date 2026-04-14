"use client";

import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AuthError = {
  code: string;
  desc: string;
};

function getAuthErrorFromHash(): AuthError | null {
  if (typeof window === "undefined") return null;

  const hash = window.location.hash;
  if (!hash.includes("error=access_denied")) return null;

  const params = new URLSearchParams(hash.replace("#", "?"));
  return {
    code: params.get("error_code") || "error",
    desc: params.get("error_description") || "Ocurrio un error con el enlace.",
  };
}

export function AuthErrorHandler() {
  const [errorObj, setErrorObj] = useState<AuthError | null>(() => getAuthErrorFromHash());

  useEffect(() => {
    if (errorObj) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, [errorObj]);

  return (
    <AnimatePresence>
      {errorObj && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[100] max-w-sm"
        >
          <div className="bg-destructive/10 border-2 border-destructive text-destructive rounded-3xl p-5 shadow-2xl shadow-destructive/20 relative pr-12">
            <button
              onClick={() => setErrorObj(null)}
              className="absolute top-4 right-4 text-destructive/50 hover:text-destructive transition-colors"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-black text-sm uppercase tracking-widest leading-tight">
                  {errorObj.code === "otp_expired" ? "Enlace Expirado" : "Error de Acceso"}
                </p>
                <p className="text-xs font-medium opacity-80 leading-relaxed">
                  {errorObj.code === "otp_expired"
                    ? "Este enlace ya fue utilizado o ha expirado. Por favor, solicita uno nuevo desde la pantalla de inicio de sesion."
                    : errorObj.desc.replace(/\+/g, " ")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
