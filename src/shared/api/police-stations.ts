// Estaciones, subestaciones y CAI de la Policía por municipio.
// Fuente: "CONTACTOS TELEFONICOS DESAB.docx" (entregado por la Policía para publicación).
// Los números se conservan tal cual; solo se normalizaron mayúsculas y espacios de los nombres.

export interface PoliceStation {
  municipality: string
  name: string
  phone: string
}

const stations: PoliceStation[] = [
  { municipality: 'Cajicá',     name: 'Estación de Policía Cajicá',                 phone: '3173976877' },
  { municipality: 'Chía',       name: 'Estación de Policía Chía',                   phone: '3017780544' },
  { municipality: 'Cogua',      name: 'Estación de Policía Cogua',                  phone: '3173609565' },
  { municipality: 'Cogua',      name: 'Subestación de Policía Neusa (Cuadrante 001)', phone: '3182333883' },
  { municipality: 'Cota',       name: 'Estación de Policía Cota',                   phone: '3184471562' },
  { municipality: 'Gachancipá', name: 'Estación de Policía Gachancipá',             phone: '3158781465' },
  { municipality: 'Gachancipá', name: 'Nueva zona de atención',                     phone: '3158781465' },
  { municipality: 'Guasca',     name: 'Estación de Policía Guasca',                 phone: '3182076388' },
  { municipality: 'La Calera',  name: 'Estación de Policía La Calera',              phone: '3016528353' },
  { municipality: 'La Calera',  name: 'Subestación La Aurora',                      phone: '3159061881' },
  { municipality: 'Nemocón',    name: 'Estación de Policía Nemocón',                phone: '3167570195' },
  { municipality: 'Sopó',       name: 'Estación de Policía Sopó',                   phone: '3158651366' },
  { municipality: 'Sopó',       name: 'Estación de Policía Sopó - Briceño',         phone: '3168228325' },
  { municipality: 'Sopó',       name: 'Subestación de Policía Meusa (Cuadrante 001)', phone: '3159086201' },
  { municipality: 'Tabio',      name: 'Estación de Policía Tabio',                  phone: '3156761674' },
  { municipality: 'Tabio',      name: 'Subestación de Policía Río Frío',            phone: '3159116025' },
  { municipality: 'Tenjo',      name: 'Estación de Policía Tenjo',                  phone: '3173919030' },
  { municipality: 'Tenjo',      name: 'Subestación de Policía La Punta',            phone: '3157419774' },
  { municipality: 'Tocancipá',  name: 'Estación de Policía Tocancipá',              phone: '3186133153' },
  { municipality: 'Zipaquirá',  name: 'Estación de Policía Zipaquirá',              phone: '3208502950' },
  { municipality: 'Bojacá',     name: 'Estación de Policía Bojacá',                 phone: '3168202554' },
  { municipality: 'El Rosal',   name: 'Estación de Policía El Rosal',               phone: '3183941952' },
  { municipality: 'Facatativá', name: 'CAI San Benito',                             phone: '3508191680' },
  { municipality: 'Facatativá', name: 'CAI Santa Rita',                             phone: '3164951795' },
  { municipality: 'Facatativá', name: 'CAI Tisquesusa',                             phone: '3175764272' },
  { municipality: 'Facatativá', name: 'Subestación de Policía Cartagenita',         phone: '3508191681' },
  { municipality: 'Funza',      name: 'Estación de Policía Funza',                  phone: '3017780724' },
  { municipality: 'Madrid',     name: 'Estación de Policía Madrid',                 phone: '3016528091' },
  { municipality: 'Madrid',     name: 'Estación de Policía Puente Piedra',          phone: '3016528965' },
  { municipality: 'Mosquera',   name: 'Estación de Policía Mosquera',               phone: '3167577392' },
  { municipality: 'Mosquera',   name: 'CAI Porvenir Río',                           phone: '3167529041' },
  { municipality: 'Subachoque', name: 'Estación de Policía Subachoque',             phone: '3167597231' },
  { municipality: 'Subachoque', name: 'Subestación de Policía La Pradera',          phone: '3182333239' },
]

export function getPoliceStations(municipality?: string): PoliceStation[] {
  return municipality ? stations.filter(s => s.municipality === municipality) : stations
}

