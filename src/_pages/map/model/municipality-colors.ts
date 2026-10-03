// Colores de los puntos de la lista de municipios (paleta verde del prototipo, en ciclo).
const PALETTE = ['#007934', '#61A60E', '#3E9B55', '#56AF89', '#00665F', '#316649']

export function municipalityColor(index: number): string {
  return PALETTE[index % PALETTE.length]
}
