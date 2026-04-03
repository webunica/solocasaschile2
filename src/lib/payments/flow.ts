import crypto from 'crypto';

const FLOW_CONFIG = {
  apiKey: process.env.FLOW_API_KEY || '',
  secretKey: process.env.FLOW_SECRET_KEY || '',
  baseUrl: process.env.FLOW_ENV === 'production' 
    ? 'https://www.flow.cl/api' 
    : 'https://sandbox.flow.cl/api',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
};

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
      if (key !== 's') {
        const value = params[key];
        // En Flow v3, los parámetros se concatenan como llavevalorllavevalor sin separadores
        stringToSign += `${key}${value}`;
      }
    }
    
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
      subject: params.subject,
      currency: 'CLP',
      amount: params.amount,
      email: params.email,
      commerceOrder: `ORD-${Date.now()}`,
      urlConfirmation: `${FLOW_CONFIG.appUrl}/api/payments/flow/confirm`,
      urlReturn: `${FLOW_CONFIG.appUrl}/dashboard/success?externalId=${params.externalId}`,
      ...params.optional
    };

    flowParams.s = this.generateSignature(flowParams);

    const formData = new URLSearchParams();
    for (const key in flowParams) {
      formData.append(key, String(flowParams[key]));
    }

    const response = await fetch(`${FLOW_CONFIG.baseUrl}/payment/create`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Flow Error:', errorText);
      throw new Error(`Flow Payment Create Failed: ${response.statusText}`);
    }

    return response.json();
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

    const response = await fetch(url.toString());
    
    if (!response.ok) {
        throw new Error(`Flow getStatus failed: ${response.statusText}`);
    }

    return response.json();
  }
}
