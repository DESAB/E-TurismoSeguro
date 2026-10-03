// Familias tipográficas del prototipo. Las variables las define next/font en src/_app/styles/fonts.ts.
// Usar siempre estas constantes en estilos inline: next/font renombra las fuentes, así que
// 'Jost' o 'Barlow Condensed' como texto literal no funcionan.
export const font = {
  jost: 'var(--font-jost), sans-serif',
  barlow: 'var(--font-barlow), sans-serif',
} as const
