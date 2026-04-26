export function slugify(text: string): string {
  return (
    text
      .normalize('NFD')                  // decompõe: ç → c + cedilha, ã → a + til, é → e + acento…
      .replace(/[̀-ͯ]/g, '') // remove todas as marcas de combinação (U+0300–U+036F)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')      // remove tudo que não é letra, número ou espaço
      .trim()
      .replace(/\s+/g, '-')             // espaços → hífens
      .replace(/-+/g, '-')              // hífens duplos → um único
  );
}

/** Builds the URL-safe slug for a tournament using the name only. */
export function toTournamentSlug(_id: number, name: string): string {
  return slugify(name);
}

/**
 * Extracts a numeric ID from a purely numeric slug segment.
 * Used by inscricoes pages that still navigate via numeric IDs.
 */
export function extractIdFromSlug(slug: string): number | null {
  const id = parseInt(slug, 10);
  return isNaN(id) ? null : id;
}
