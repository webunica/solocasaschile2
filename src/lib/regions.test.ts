import { describe, expect, it, vi } from 'vitest';
import { slugifyRegion, getRegionDisplayName } from './regions';

// Hacemos mock de la constante de regiones para no depender de la lista real exacta en el test
vi.mock('@/config/regions', () => ({
  REGIONES_CHILE: [
    'Región Metropolitana',
    'La Araucanía',
    'Biobío',
    'Magallanes y de la Antártica Chilena'
  ]
}));

describe('regions helpers', () => {
  describe('slugifyRegion', () => {
    it('debe normalizar tildes y espacios y convertir a lowercase', () => {
      expect(slugifyRegion('Región Metropolitana')).toBe('region-metropolitana');
      expect(slugifyRegion('La Araucanía')).toBe('la-araucania');
      expect(slugifyRegion('Biobío')).toBe('biobio');
    });

    it('debe limpiar espacios adicionales al principio y al final', () => {
      expect(slugifyRegion(' Magallanes y de la Antártica Chilena ')).toBe('magallanes-y-de-la-antartica-chilena');
    });
  });

  describe('getRegionDisplayName', () => {
    it('debe resolver el nombre formal de la región desde su slug', () => {
      expect(getRegionDisplayName('region-metropolitana')).toBe('Región Metropolitana');
      expect(getRegionDisplayName('la-araucania')).toBe('La Araucanía');
    });

    it('debe soportar la retro-compatibilidad manual del slug corto araucania', () => {
      expect(getRegionDisplayName('araucania')).toBe('La Araucanía');
    });

    it('debe retornar original indefinido si el slug se envía ausente', () => {
      expect(getRegionDisplayName(undefined)).toBeUndefined();
    });

    it('debe retornar el input original si no encuentra matching region en la configuración', () => {
      expect(getRegionDisplayName('region-falsa-xyz')).toBe('region-falsa-xyz');
    });
  });
});
