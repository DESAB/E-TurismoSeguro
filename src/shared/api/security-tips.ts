import { Backpack, Car, Eye, Lock, MapPin, MapPinCheck, Recycle, ScanEye, ShieldCheck, Smartphone, Sprout } from 'lucide'

type IconNode = typeof Lock

// Recomendaciones de seguridad (copiadas del prototipo). Las usan Inicio (las 4 primeras) y Seguridad.

export interface SecurityTip {
  /** Ícono (datos de `lucide`, serializables para pasarlos a Client Components) */
  icon: IconNode
  /** Ícono al que se transforma al pasar el mouse (morphicons) */
  hoverIcon: IconNode
  title: string
  tips: string[]
}

const securityTips: SecurityTip[] = [
  {
    icon: Backpack,
    hoverIcon: Lock,
    title: 'Cuida tus pertenencias',
    tips: ['Usa mochila con cierre de seguridad', 'No exhibas objetos de valor en zonas turísticas', 'Registra los números seriales de tus dispositivos', 'Usa bolsos cruzados que permanezcan al frente'],
  },
  {
    icon: Smartphone,
    hoverIcon: ShieldCheck,
    title: 'Seguridad digital',
    tips: ['Evita conectarte a redes Wi-Fi públicas sin VPN', 'Activa la localización de tu dispositivo', 'No compartas tu ubicación en tiempo real en redes sociales', 'Lleva un cargador portátil para mantener tu teléfono activo'],
  },
  {
    icon: Eye,
    hoverIcon: ScanEye,
    title: 'Atención al entorno',
    tips: ['Planifica tu ruta antes de salir', 'Informa a un contacto de confianza tu itinerario', 'Evita desplazarte solo en zonas aisladas de noche', 'Confía en tu intuición ante situaciones sospechosas'],
  },
  {
    icon: MapPin,
    hoverIcon: MapPinCheck,
    title: 'Puntos de atención',
    tips: ['Identifica la estación de Policía más cercana', 'Anota los números de emergencia locales', 'Consulta sobre centros de salud en el municipio', 'Activa el botón de pánico de tu app policial si la tienes'],
  },
  {
    icon: Car,
    hoverIcon: ShieldCheck,
    title: 'Transporte seguro',
    tips: ['Usa aplicaciones de transporte verificadas', 'Verifica la placa y foto del conductor', 'Comparte el viaje en tiempo real con un contacto', 'Evita abordar vehículos informales en destinos turísticos'],
  },
  {
    icon: Recycle,
    hoverIcon: Sprout,
    title: 'Turismo responsable',
    tips: ['Respeta la señalización y zonas protegidas', 'No colecciones flora ni fauna silvestre', 'Recoge tu basura y deposítala en sitios autorizados', 'Respeta las comunidades y su cultura local'],
  },
]

export function getSecurityTips(): SecurityTip[] {
  return securityTips
}
