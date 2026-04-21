import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { FlowService } from './flow';

describe('FlowService', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
    vi.useRealTimers();
  });

  describe('createPayment', () => {
    it('debe generar la solicitud de pago correctamente y retornar datos de Flow', async () => {
      const mockResponse = {
        url: 'https://sandbox.flow.cl/api/pay',
        token: 'TEST_TOKEN_123',
        flowOrder: 12345
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as unknown as Response);

      const result = await FlowService.createPayment({
        subject: 'Pago Test',
        amount: 15000,
        email: 'test@example.com',
        externalId: 'CONST-123'
      });

      expect(result.url).toBe(mockResponse.url);
      expect(result.token).toBe(mockResponse.token);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      const fetchArgs = vi.mocked(global.fetch).mock.calls[0];
      expect(fetchArgs[0]).toContain('/payment/create');
      
      const body = fetchArgs[1]?.body as URLSearchParams;
      expect(body).toBeInstanceOf(URLSearchParams);
      expect(body.get('amount')).toBe('15000');
      expect(body.get('email')).toBe('test@example.com');
      expect(body.get('s')).toBeDefined(); // Firma generada
    });

    it('debe enviar parametros optional como JSON firmado por Flow', async () => {
      const mockResponse = {
        url: 'https://sandbox.flow.cl/api/pay',
        token: 'TEST_TOKEN_123',
        flowOrder: 12345
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as unknown as Response);

      await FlowService.createPayment({
        subject: 'Pago Test',
        amount: 15000,
        email: 'test@example.com',
        externalId: 'CONST-123',
        optional: {
          constructoraId: 'CONST-123',
          plan: 'pro',
          billing: 'yearly',
        },
      });

      const fetchArgs = vi.mocked(global.fetch).mock.calls[0];
      const body = fetchArgs[1]?.body as URLSearchParams;

      expect(body.get('optional')).toBe(JSON.stringify({
        constructoraId: 'CONST-123',
        plan: 'pro',
        billing: 'yearly',
      }));
      expect(body.get('optional[constructoraId]')).toBeNull();
      expect(body.get('s')).toBeDefined();
    });

    it('debe lanzar error si la API de Flow responde con error HTTP', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Bad Request',
        text: () => Promise.resolve('Invalid signature')
      } as unknown as Response);

      await expect(FlowService.createPayment({
        subject: 'Pago', amount: 1000, email: 't@t.com', externalId: '1'
      })).rejects.toThrow('Flow Payment Create Failed: Bad Request (Invalid signature)');
    });
  });

  describe('getPaymentStatus', () => {
    it('debe consultar el estado del pago usando el token', async () => {
      const mockStatus = {
        status: 2, // 2 = pagado
        amount: 15000,
        payer: 'test@example.com'
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStatus),
      } as unknown as Response);

      const result = await FlowService.getPaymentStatus('TEST_TOKEN_123');

      expect(result.status).toBe(2);
      expect(result.amount).toBe(15000);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      
      const url = vi.mocked(global.fetch).mock.calls[0][0] as string;
      expect(url).toContain('token=TEST_TOKEN_123');
      expect(url).toContain('s='); 
    });

    it('debe parsear optional cuando Flow lo retorna como JSON string', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          status: 2,
          amount: 15000,
          optional: JSON.stringify({
            constructoraId: 'CONST-123',
            plan: 'pro',
            billing: 'yearly',
          }),
        }),
      } as unknown as Response);

      const result = await FlowService.getPaymentStatus('TEST_TOKEN_123');

      expect(result.optional?.constructoraId).toBe('CONST-123');
      expect(result.optional?.plan).toBe('pro');
      expect(result.optional?.billing).toBe('yearly');
    });

    it('debe manejar errores de red o timeout', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      await expect(FlowService.getPaymentStatus('123')).rejects.toThrow('Network error');
    });
  });
});
