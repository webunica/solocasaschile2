import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { GET } from './route';
import { openai } from '@/lib/openai';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

vi.mock('@/lib/openai', () => ({
  openai: {
    chat: { completions: { create: vi.fn() } },
    images: { generate: vi.fn() }
  }
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn()
}));

describe('Cron Blog Generation API endpoint', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.CRON_SECRET = 'SECRET_CRON';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://test';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('debe rechazar llamadas sin authorization (HTTP 401)', async () => {
    const req = new Request('http://localhost/api/cron/generate-blog');
    const res = await GET(req) as NextResponse;
    expect(res.status).toBe(401);
  });

  it('debe rechazar llamadas con un token authorization incorrecto (HTTP 401)', async () => {
    const req = new Request('http://localhost/api/cron/generate-blog', {
      headers: { authorization: 'Bearer INVALID_TOKEN' }
    });
    const res = await GET(req) as NextResponse;
    expect(res.status).toBe(401);
  });

  it('debe completar todo el pipeline asincrónico (OpenAI + Storage) si la autorización es válida (HTTP 200)', async () => {
    (openai.chat.completions.create as unknown as vi.Mock).mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ title: 'Test', slug: 'test-slug', category: 'test' }) } }]
    });

    (openai.images.generate as unknown as vi.Mock).mockResolvedValue({
      data: [{ url: 'http://mock.img.com/test.png' }]
    });

    global.fetch = vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(new Blob(['mock data img output']))
    } as unknown as Response);

    const mockStorage = {
      upload: vi.fn().mockResolvedValue({ error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'http://img.pub.com/test.png' } })
    };

    const mockDb = {
      insert: vi.fn().mockResolvedValue({ error: null })
    };

    (createClient as unknown as vi.Mock).mockReturnValue({
      storage: { from: vi.fn().mockReturnValue(mockStorage) },
      from: vi.fn().mockReturnValue(mockDb)
    });

    const req = new Request('http://localhost/api/cron/generate-blog', {
      headers: { authorization: 'Bearer SECRET_CRON' }
    });

    const res = await GET(req) as NextResponse;
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    
    // Verificamos transacciones en la red
    expect(openai.chat.completions.create).toHaveBeenCalledTimes(1);
    expect(openai.images.generate).toHaveBeenCalledTimes(1);
    
    // Verificamos Persistencia
    expect(mockStorage.upload).toHaveBeenCalledTimes(1);
    expect(mockDb.insert).toHaveBeenCalledTimes(1);
    expect(mockDb.insert.mock.calls[0][0][0]).toMatchObject({
      title: 'Test',
      slug: 'test-slug',
      cover_image_url: 'http://img.pub.com/test.png'
    });
  });

  it('debe capturar internamente y retornar un error HTTP 500 si falla OpenAI de forma irrecuperable', async () => {
    (openai.chat.completions.create as unknown as vi.Mock).mockRejectedValue(new Error('OpenAi API out of credits'));

    const req = new Request('http://localhost/api/cron/generate-blog', {
      headers: { authorization: 'Bearer SECRET_CRON' }
    });

    const res = await GET(req) as NextResponse;
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data.success).toBe(false);
    // Verificamos que aunque el cliente de Supabase se inicia, la inserción se detiene
    const supabaseMockInstance = vi.mocked(createClient).mock.results[0]?.value;
    if (supabaseMockInstance) {
      expect(supabaseMockInstance.from).not.toHaveBeenCalled();
    }
  });
});
