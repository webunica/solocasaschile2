import { describe, expect, it } from 'vitest';
import { cn, getYoutubeEmbedUrl } from './utils';

describe('utils', () => {
  describe('cn (classnames builder)', () => {
    it('debe concatenar clases normales usando clsx y twMerge', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    });

    it('debe resolver conflictos de Tailwind preservando la última clase', () => {
      // bg-red-500 y bg-blue-500 son colisiones, gana la última
      expect(cn('bg-red-500 bg-blue-500', 'text-white')).toBe('bg-blue-500 text-white');
    });

    it('debe ignorar valores condicionales falsy', () => {
      expect(cn('text-sm', false && 'text-lg', null, undefined, 'font-bold')).toBe('text-sm font-bold');
    });
  });

  describe('getYoutubeEmbedUrl', () => {
    it('debe retornar null si la url es vacía o nula', () => {
      expect(getYoutubeEmbedUrl()).toBeNull();
      expect(getYoutubeEmbedUrl('')).toBeNull();
    });

    it('debe formatear a embed cualquier formato de link de Youtube estándar', () => {
      const expected = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      expect(getYoutubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(expected);
      expect(getYoutubeEmbedUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(expected);
      expect(getYoutubeEmbedUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(expected);
    });

    it('debe retornar null si el ID de video no tiene largo 11 o es otra plataforma', () => {
      expect(getYoutubeEmbedUrl('https://vimeo.com/12345')).toBeNull();
      expect(getYoutubeEmbedUrl('https://youtube.com/watch?v=a1B2')).toBeNull(); 
    });
  });
});
