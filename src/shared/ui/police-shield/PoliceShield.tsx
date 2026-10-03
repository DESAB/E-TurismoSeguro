import logo from './logo-etourismo.png'

export function PoliceShield({ size = 40 }: { size?: number }) {
  return (
    <img
      src={logo.src}
      alt="Escudo Policía Nacional de Colombia"
      width={size}
      height={size}
      style={{ objectFit: 'contain', flexShrink: 0, display: 'block' }}
    />
  )
}

/** Ruta del escudo para usos sin el componente (p. ej. la barra del panel de administración). */
export const policeShieldSrc = logo.src
