// Tipografía del sitio: Inter en todo (la variable la define next/font en src/_app/styles/fonts.ts).
// Usar siempre estas constantes en estilos inline: next/font renombra la fuente, así que
// 'Inter' como texto literal no funciona. `heading` y `body` hoy son la misma familia;
// se mantienen separadas por si los títulos cambian de fuente más adelante.
export const font = {
  heading: 'var(--font-inter), "Helvetica", "Arial", sans-serif',
  body: 'var(--font-inter), "Helvetica", "Arial", sans-serif',
} as const
