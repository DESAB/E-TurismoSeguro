import { font } from '@/shared/ui'

const colors: Record<string, { bg: string; text: string }> = {
  Naturaleza: { bg: '#e8f5e2', text: '#007934' },
  Patrimonio: { bg: '#e8f0fb', text: '#1a56ab' },
  Cultura: { bg: '#fef3e2', text: '#92500a' },
  Gastronomía: { bg: '#fde8e8', text: '#9b1c1c' },
  Familiar: { bg: '#f3e8ff', text: '#6b21a8' },
  Aventura: { bg: '#fff3cd', text: '#92400e' },
}

export function CategoryBadge({ category }: { category: string }) {
  const c = colors[category] || { bg: '#f1f1ef', text: '#333' }
  return (
    <span style={{ backgroundColor: c.bg, color: c.text, fontFamily: font.body, fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.04em' }}>
      {category.toUpperCase()}
    </span>
  )
}
