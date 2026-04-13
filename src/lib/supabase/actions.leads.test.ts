import {  describe, expect, it, vi, beforeEach , Mock } from 'vitest';
import { submitLead } from './actions';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/resend';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn()
}));

vi.mock('@/lib/resend', () => ({
  resend: {
    emails: {
      send: vi.fn()
    }
  }
}));

describe('actions > submitLead', () => {
  const mockSupabaseQuery = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    insert: vi.fn()
  };

  const mockSupabaseClient = {
    from: vi.fn(() => mockSupabaseQuery)
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as unknown as Mock).mockResolvedValue(mockSupabaseClient);
  });

  const validLeadData = {
    nombre_cliente: 'Juan Perez',
    email_cliente: 'juan@test.com',
    telefono_cliente: '+56912345678',
    mensaje: 'Cotizar cabaña',
    modelo_id: 'mod-123',
    constructora_id: 'con-123',
    modelo_nombre: 'Cabaña Sur',
    constructora_nombre: 'Constructora del Sur'
  };

  it('debe insertar correctamente el lead en supabase y enviar los tres correos', async () => {
    // Definimos qué responde la DB: Info del modelo y constructora
    mockSupabaseQuery.single.mockResolvedValue({
      data: {
        contacto_email: null,
        constructora: { email: 'ventas@constructorasur.cl', nombre: 'Constructora del Sur' }
      },
      error: null
    });
    
    // Y qué responde el insert
    mockSupabaseQuery.insert.mockResolvedValue({ error: null });

    // Y qué responde resend
    (resend.emails.send as unknown as Mock).mockResolvedValue({ data: { id: 'test-email-id' } });

    const result = await submitLead(validLeadData);

    // 1. Debe retornar success true
    expect(result.success).toBe(true);

    // 2. Debe buscar el email en la tabla modelos
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('modelos');
    
    // 3. Debe insertar en la tabla leads
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('leads');
    expect(mockSupabaseQuery.insert).toHaveBeenCalledWith([{
      nombre_cliente: validLeadData.nombre_cliente,
      email_cliente: validLeadData.email_cliente,
      telefono_cliente: validLeadData.telefono_cliente,
      mensaje: validLeadData.mensaje,
      modelo_id: validLeadData.modelo_id,
      constructora_id: validLeadData.constructora_id,
      estado: 'nuevo'
    }]);

    // 4. Debe enviar 3 correos (Cliente, Constructora, Plataforma/Log)
    expect(resend.emails.send).toHaveBeenCalledTimes(3);
    
    const sendCalls = (resend.emails.send as unknown as Mock).mock.calls;
    // Email 1 al cliente
    expect(sendCalls[0][0].to).toEqual([validLeadData.email_cliente]);
    // Email 2 a la constructora (ventas@constructorasur.cl)
    expect(sendCalls[1][0].to).toEqual(['ventas@constructorasur.cl']);
    // Email 3 a plataforma (contacto@solocasaschile.com)
    expect(sendCalls[2][0].to).toEqual(['contacto@solocasaschile.com']);
  });

  it('debe retornar error si la inserción en base de datos falla', async () => {
    mockSupabaseQuery.single.mockResolvedValue({
      data: { contacto_email: 'modelo@constructorasur.cl' },
      error: null
    });
    
    // Error al insertar
    mockSupabaseQuery.insert.mockResolvedValue({ error: new Error('DB Constraint') });

    const result = await submitLead(validLeadData);

    expect(result.error).toBeDefined();
    // No debe enviar emails si falla el insert
    expect(resend.emails.send).not.toHaveBeenCalled();
  });

  it('debe retornar success incluso si el envío de correos falla (gracias al catch de email)', async () => {
    mockSupabaseQuery.single.mockResolvedValue({
      data: { contacto_email: 'modelo@constructorasur.cl' },
      error: null
    });
    mockSupabaseQuery.insert.mockResolvedValue({ error: null });

    // Forzamos error en correos
    (resend.emails.send as unknown as Mock).mockRejectedValue(new Error('Resend Auth'));

    const result = await submitLead(validLeadData);

    expect(result.success).toBe(true);
    expect(mockSupabaseQuery.insert).toHaveBeenCalled();
  });
});
