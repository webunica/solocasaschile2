import crypto from 'crypto';

const FLOW_CONFIG = {
  apiKey: (process.env.FLOW_API_KEY || '').trim(),
  secretKey: (process.env.FLOW_SECRET_KEY || '').trim(),
  baseUrl: process.env.FLOW_ENV === 'production' 
    ? 'https://www.flow.cl/api' 
    : 'https://sandbox.flow.cl/api',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
};

// Log settings on load (masked)
console.info(`[FLOW-CONFIG] Env: ${process.env.FLOW_ENV || 'sandbox'}, Base: ${FLOW_CONFIG.baseUrl}, App: ${FLOW_CONFIG.appUrl}`);

export interface FlowPaymentResponse {
  url: string;
  token: string;
  flowOrder: number;
}

export class FlowService {
  /**
   * Genera la firma requerida por Flow
   */
  private static generateSignature(params: Record<string, any>): string {
    const keys = Object.keys(params).sort();
    let stringToSign = '';
    
    for (const key of keys) {
      // Flow v3: Solo se firman los parámetros REQUERIDOS. 's' y 'optional' se excluyen.
      if (key !== 's' && !key.startsWith('optional[')) {
        const value = params[key];
        stringToSign += `${key}${value}`;
      }
    }
    
    console.debug(`[FLOW-SIGN] String: ${stringToSign}`);
    
    return crypto
      .createHmac('sha256', FLOW_CONFIG.secretKey)
      .update(stringToSign)
      .digest('hex');
  }

  /**
   * Crea una solicitud de pago en Flow
   */
  static async createPayment(params: {
    subject: string;
    amount: number;
    email: string;
    externalId: string; // El ID de la constructora
    optional?: Record<string, string>;
  }): Promise<FlowPaymentResponse> {
    const flowParams: Record<string, any> = {
      apiKey: FLOW_CONFIG.apiKey,
      subject: String(params.subject).substring(0, 50), // Evitar caracteres extraños y límite de Flow
      currency: 'CLP',
      amount: Math.round(params.amount), // Asegurar entero
      email: params.email,
      commerceOrder: `ORD-${Date.now()}`,
      urlConfirmation: `${FLOW_CONFIG.appUrl}/api/payments/flow/confirm`,
      urlReturn: `${FLOW_CONFIG.appUrl}/dashboard/success`,
      urlError: `${FLOW_CONFIG.appUrl}/dashboard/failure`
    };

    console.log('[FLOW] Generando pago:', flowParams);
    flowParams.s = this.generateSignature(flowParams);
    console.log('[FLOW] Firma generada:', flowParams.s);

    const formData = new URLSearchParams();
    for (const key in flowParams) {
      formData.append(key, String(flowParams[key]));
    }

    const apiUrl = `${FLOW_CONFIG.baseUrl}/payment/create`;
    console.log(`[FLOW] Solicitando a: ${apiUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos para Flow

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Flow Payment Create Failed: ${response.statusText} (${errorText})`);
      }

      const data = await response.json();
      console.log('[FLOW] Pago Creado con Éxito:', data);
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') throw new Error('El servicio de Flow no respondió a tiempo. Intenta de nuevo.');
      throw error;
    }
  }

  /**
   * Obtiene el estado de un pago usando el token recibido en el webhook
   */
  static async getPaymentStatus(token: string) {
    const params: Record<string, any> = {
      apiKey: FLOW_CONFIG.apiKey,
      token
    };

    params.s = this.generateSignature(params);

    const url = new URL(`${FLOW_CONFIG.baseUrl}/payment/getStatus`);
    for (const key in params) {
      url.searchParams.append(key, String(params[key]));
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(url.toString(), { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
          throw new Error(`Flow getStatus failed: ${response.statusText}`);
      }

      return response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}
