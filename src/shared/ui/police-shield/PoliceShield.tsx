import Image from 'next/image'
import logo from './logo-etourismo.png'

export function PoliceShield({ size = 40 }: { size?: number }) {
  return (
    <Image
      src={logo}
      alt="Escudo Policía Nacional de Colombia"
      width={size}
      height={size}
      style={{ objectFit: 'contain', flexShrink: 0, display: 'block' }}
    />
  )
}

/** El escudo como import estático, para usos sin el componente (p. ej. la barra del panel de administración). */
export const policeShieldImage = logo
