import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { getUfValue } from './uf';

const FALLBACK_UF = 38500;

describe('getUfValue', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
    vi.useRealTimers();
  });

  it('debe retornar el valor correcto de UF si la API responde exitosamente', async () => {
    const mockUf = 39500.5;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ serie: [{ valor: mockUf }] }),
    } as unknown as Response);

    const valor = await getUfValue();
    expect(valor).toBe(mockUf);
    expect(global.fetch).toHaveBeenCalledWith('https://mindicador.cl/api/uf', expect.any(Object));
  });

  it('debe retornar FALLBACK_UF si la respuesta HTTP de mindicador no es ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500
    } as unknown as Response);

    const valor = await getUfValue();
    expect(valor).toBe(FALLBACK_UF);
  });

  it('debe retornar FALLBACK_UF si el JSON devuelto no contiene la estructura esperada', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ serie: [] }),
    } as unknown as Response);

    const valor = await getUfValue();
    expect(valor).toBe(FALLBACK_UF);
  });

  it('debe retornar FALLBACK_UF si ocurre un error de red o fetch falla', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const valor = await getUfValue();
    expect(valor).toBe(FALLBACK_UF);
  });
});
