import crypto from 'crypto';

const FLOW_CONFIG = {
  apiKey: (process.env.FLOW_API_KEY || '').trim(),
  secretKey: (process.env.FLOW_SECRET_KEY || '').trim(),
  baseUrl: process.env.FLOW_ENV === 'production' 
    ? 'https://www.flow.cl/api' 
    : 'https://sandbox.flow.cl/api',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
};

function debugFlow(event: string, fields: Record<string, unknown> = {}) {
  if (process.env.FLOW_DEBUG !== 'true') return;
  console.info(JSON.stringify({ level: 'debug', event, component: 'flow', ...fields }));
}

export interface FlowPaymentResponse {
  url: string;
  token: string;
  flowOrder: number;
}

interface FlowStatusResponse {
  status?: number;
  flowOrder?: number;
  commerceOrder?: string;
  amount?: number;
  payer?: string;
  optional?: {
    constructoraId?: string;
    plan?: string;
    billing?: 'monthly' | 'semiannual' | 'yearly' | string;
    [key: string]: string | undefined;
  };
  paymentData?: unknown;
}

type FlowSignableValue = string | number | boolean | null | undefined;
type FlowParams = Record<string, FlowSignableValue>;

function normalizeOptionalParams(optional: Record<string, string> = {}) {
  const normalized: Record<string, string> = {};

  for (const [key, value] of Object.entries(optional)) {
    const match = key.match(/^optional\[(.+)\]$/);
    normalized[match?.[1] ?? key] = value;
  }

  return normalized;
}

function isAbortError(error: unknown): error is DOMException {
  return error instanceof DOMException && error.name === "AbortError";
}

export class FlowService {
  /**
   * Genera la firma requerida por Flow
   */
  private static generateSignature(params: FlowParams): string {
    const keys = Object.keys(params).sort();
    let stringToSign = '';
    
    for (const key of keys) {
      // Flow firma todos los parametros enviados excepto "s".
      if (key !== 's') {
        const value = params[key];
        stringToSign += `${key}${value}`;
      }
    }
    
    debugFlow('flow_signature_generated', {
      signedKeys: keys.filter(key => key !== 's'),
    });
    
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
    const flowParams: FlowParams = {
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

    const optional = normalizeOptionalParams(params.optional);

    if (Object.keys(optional).length > 0) {
      flowParams.optional = JSON.stringify(optional);
    }

    debugFlow('flow_payment_create_started', {
      amount: flowParams.amount,
      subject: flowParams.subject,
      hasEmail: Boolean(flowParams.email),
    });
    flowParams.s = this.generateSignature(flowParams);

    const formData = new URLSearchParams();
    for (const key in flowParams) {
      formData.append(key, String(flowParams[key]));
    }

    const apiUrl = `${FLOW_CONFIG.baseUrl}/payment/create`;
    debugFlow('flow_payment_create_request', {
      baseUrl: FLOW_CONFIG.baseUrl,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos para Flow

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Flow Payment Create Failed: ${response.statusText} (${errorText})`);
      }

      const data = (await response.json()) as FlowPaymentResponse;
      debugFlow('flow_payment_create_completed', {
        flowOrder: data.flowOrder,
        hasToken: Boolean(data.token),
      });
      return data;
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      if (isAbortError(error)) throw new Error('El servicio de Flow no respondió a tiempo. Intenta de nuevo.');
      throw error;
    }
  }

  /**
   * Obtiene el estado de un pago usando el token recibido en el webhook
   */
  static async getPaymentStatus(token: string): Promise<FlowStatusResponse> {
    const params: FlowParams = {
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

      return (await response.json()) as FlowStatusResponse;
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}
