import Image from 'next/image'
import logo from './escudo-policia.png'

/** Escudo de la Policía Nacional (PNG con fondo transparente). `size` es la altura; el ancho sale de la proporción del logo. */
export function PoliceShield({ size = 40 }: { size?: number }) {
  const width = Math.round((size * logo.width) / logo.height)
  return (
    <Image
      src={logo}
      alt="Escudo Policía Nacional de Colombia"
      width={width}
      height={size}
      style={{ width, height: size, objectFit: 'contain', flexShrink: 0, display: 'block' }}
    />
  )
}

/** El escudo como import estático, para usos sin el componente (p. ej. la barra del panel de administración). */
export const policeShieldImage = logo
