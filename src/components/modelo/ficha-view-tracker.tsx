"use client";

import { useEffect } from "react";
import { trackFichaView } from "@/lib/analytics";

interface FichaViewTrackerProps {
  modelId: string;
  modelName: string;
  constructoraId: string;
  constructoraName: string;
  tipo?: string;
  precioUf?: number;
}

export function FichaViewTracker({
  modelId,
  modelName,
  constructoraId,
  constructoraName,
  tipo,
  precioUf,
}: FichaViewTrackerProps) {
  useEffect(() => {
    trackFichaView({
      modelId,
      modelName,
      constructoraId,
      constructoraName,
      tipo,
      precioUf,
    });
  }, [modelId, modelName, constructoraId, constructoraName, tipo, precioUf]);

  return null;
}
