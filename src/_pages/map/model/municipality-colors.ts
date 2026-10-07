// Colores de los puntos de la lista de municipios (paleta institucional de la Policía Nacional, en ciclo).
const PALETTE = ['#007934', '#A8D42E', '#56AF89', '#135657', '#134159', '#142749']

export function municipalityColor(index: number): string {
  return PALETTE[index % PALETTE.length]
}
