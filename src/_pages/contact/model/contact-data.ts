import { Earth, Globe, Mail, MailOpen, MapPin, MapPinCheck, Phone, PhoneCall, ScanSearch, Search, Shield, ShieldCheck } from 'lucide'

// Datos de Contacto. Íconos como datos de `lucide` (serializables): el de reposo y el que aparece al pasar el mouse.
type IconData = typeof Phone

export interface ContactItem {
  icon: IconData
  hoverIcon: IconData
  label: string
  value: string
  href?: string
}

export interface Channel {
  icon: IconData
  hoverIcon: IconData
  title: string
  desc: string
  href?: string
}

export const contactInfo: ContactItem[] = [
  { icon: MapPin, hoverIcon: MapPinCheck, label: 'Dirección',  value: 'Calle. 2 # 1 Este,34 Mosquera,Cundinamarca' },
  { icon: Phone,  hoverIcon: PhoneCall,   label: 'Conmutador', value: '+573223486071', href: 'tel:+573223486071' },
  { icon: Mail,   hoverIcon: MailOpen,    label: 'Correo',     value: 'desab.gutur@policia.gov.co', href: 'mailto:desab.gutur@policia.gov.co' },
  { icon: Globe,  hoverIcon: Earth,       label: 'Web',        value: 'www.policia.gov.co', href: 'https://www.policia.gov.co' },
]

export const channels: Channel[] = [
  { icon: Shield, hoverIcon: ShieldCheck, title: 'Denuncia en línea',    desc: 'Plataforma ADENUNCIAR para reportar delitos', href: 'https://adenunciar.policia.gov.co/Adenunciar/Login.aspx' },
  { icon: Phone,  hoverIcon: PhoneCall,   title: 'Línea anticorrupción', desc: '018000910600 — gratuita las 24 horas', href: 'tel:018000910600' },
]
