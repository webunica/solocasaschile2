import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { POST } from './route';
import { createClient } from '@supabase/supabase-js';
import * as adminGuard from '@/lib/security/admin-guard';
import { NextResponse } from 'next/server';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn()
}));

vi.mock('@/lib/security/admin-guard', () => ({
  checkRateLimit: vi.fn()
}));

describe('Public Leads API Endpoint Integration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://test-supabase-url';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
    (adminGuard.checkRateLimit as unknown as vi.Mock).mockReturnValue({ ok: true, retryAfterSeconds: 0 });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const validLeadBody = {
    nombre_cliente: 'Cliente de Pruebas',
    email_cliente: 'contacto@cliente.com',
    telefono_cliente: '+56911223344',
    mensaje: 'Hola, cotizar'
  };

  it('debe retornar HTTP 500 si las keys de variables de entorno no están configuradas', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    const req = new Request('http://localhost/api/leads/public', { method: 'POST' });
    const res = await POST(req) as NextResponse;
    expect(res.status).toBe(500);
  });

  it('debe proteger contra requests secuenciales limitados por Rate Limiter (HTTP 429)', async () => {
    (adminGuard.checkRateLimit as unknown as vi.Mock).mockReturnValue({ ok: false, retryAfterSeconds: 60 });
    
    const req = new Request('http://localhost/api/leads/public', {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify(validLeadBody)
    });

    const res = await POST(req) as NextResponse;
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBe('60');
  });

  it('debe bloquear formatos inválidos con Zod validación (HTTP 400)', async () => {
    const req = new Request('http://localhost/api/leads/public', {
      method: 'POST',
      body: JSON.stringify({ nombre_cliente: 'A' }) // El nombre es muy corto
    });

    const res = await POST(req) as NextResponse;
    expect(res.status).toBe(400);
  });

  it('debe filtrar submissions con campos Honeypot, mitigando spambots sin fallar ruidosamente (HTTP 200 Fake)', async () => {
    const req = new Request('http://localhost/api/leads/public', {
      method: 'POST',
      body: JSON.stringify({ ...validLeadBody, website: 'http://soy.un-bot.com' })
    });

    const res = await POST(req) as NextResponse;
    expect(res.status).toBe(200);
    // Verificamos que no se intentó realizar una inserción perniciosa en la BaseDeDatos
    expect(createClient).not.toHaveBeenCalled();
  });

  it('debe inicializar el cliente en modo administrativo y asegurar persistencia', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    (createClient as unknown as vi.Mock).mockReturnValue({
      from: vi.fn().mockReturnValue({ insert: mockInsert })
    });

    const req = new Request('http://localhost/api/leads/public', {
      method: 'POST',
      body: JSON.stringify(validLeadBody)
    });

    const res = await POST(req) as NextResponse;
    
    // Evaluar Status exitoso
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true });

    // Evaluar que interactúa estrictamente con la DB
    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockInsert.mock.calls[0][0][0]).toMatchObject({
      nombre_cliente: validLeadBody.nombre_cliente,
      email_cliente: validLeadBody.email_cliente,
      telefono_cliente: validLeadBody.telefono_cliente,
      estado: 'nuevo'
    });
  });
});
