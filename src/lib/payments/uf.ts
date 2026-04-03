
/**
 * Servicio para obtener el valor de la UF (Unidad de Fomento) chilena.
 * Utiliza mindicador.cl como fuente gratuita.
 */

const FALLBACK_UF = 38500; // Valor seguro por si falla la API

export async function getUfValue(): Promise<number> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 segundos de gracia

  try {
    const response = await fetch('https://mindicador.cl/api/uf', { 
        next: { revalidate: 3600 }, // Cachear por 1 hora
        signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn('UF_FETCH_WARN: No se pudo obtener UF de mindicador.cl, usando fallback.');
      return FALLBACK_UF;
    }

    const data = await response.json();
    const valor = data.serie?.[0]?.valor;

    if (!valor || typeof valor !== 'number') {
      console.warn('UF_VALOR_INVALIDO: Estructura de API cambiada, usando fallback.');
      return FALLBACK_UF;
    }

    return valor;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('UF_TIMEOUT: La API de UF tardó demasiado, usando fallback.');
    } else {
      console.error('UF_FETCH_ERROR:', error);
    }
    return FALLBACK_UF;
  }
}
