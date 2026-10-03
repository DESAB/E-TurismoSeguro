// Destinos turísticos de la Regional Metropolitana de la Sabana.
// Fuente: "SITIOS TURÍSTICOS DE LA REGIONAL METROPOLITANA DE LA SABANA.docx" (textos y fotos) y la tipificación
// entregada por el usuario. Solo se usan datos de esos documentos: donde no hay dirección u horario, el campo se omite.
// Fotos optimizadas en public/destinos/<slug>/<n>.jpg.
// Ubicaciones: OpenStreetMap (Nominatim/Overpass), revisadas a mano; las marcadas `approximate` deben verificarse.
// Fase 5: reemplazar por consultas a Supabase sin cambiar las firmas de los getters.

export const CATEGORIES = ['Naturaleza', 'Patrimonio', 'Cultura', 'Gastronomía', 'Familiar', 'Aventura'] as const

export type Category = (typeof CATEGORIES)[number]

export interface Destination {
  id: string
  /** Segmento de URL: /destinos/[slug] (también nombre de la carpeta de fotos) */
  slug: string
  name: string
  municipality: string
  /** Tipología; la primera es la que se muestra en las tarjetas */
  categories: Category[]
  /** Resumen de una o dos líneas para tarjetas y buscadores */
  description: string
  /** Texto completo; los párrafos se separan con una línea en blanco */
  longDescription: string
  /** Rutas de las fotos; la primera es la portada */
  images: string[]
  /** Ubicación (OpenStreetMap). `approximate`: no está en OSM y se estimó; pendiente de verificar */
  location: { lat: number; lon: number; approximate?: string }
  address?: string
  hours?: string
  phone?: string
  /** Página o red social del sitio, si el documento la trae */
  website?: string
  /** Recomendaciones de la Policía para la visita (se muestran 3) */
  tips: string[]
}

const photos = (slug: string, ...n: number[]) => n.map(i => `/destinos/${slug}/${i}.jpg`)

// Recomendaciones generales (de la sección "Viaja seguro") para los sitios sin indicaciones propias.
const route = 'Planifica tu ruta antes de salir e informa tu itinerario a un contacto de confianza'
const belongings = 'No exhibas objetos de valor y cuida tus pertenencias en zonas concurridas'
const emergency = 'Ante cualquier emergencia llama al 123 o acude a la estación de Policía más cercana'
const nature = 'Respeta la señalización y las zonas protegidas; recoge tu basura'
const generalTips = [route, belongings, emergency]
const natureTips = [route, nature, emergency]

const destinations: Destination[] = [
  // ── Zipaquirá ──────────────────────────────────────────────────────────────
  {
    id: 'catedral-de-sal',
    slug: 'catedral-de-sal',
    name: 'Catedral de Sal',
    municipality: 'Zipaquirá',
    categories: ['Patrimonio', 'Cultura'],
    description: 'La "Primera Maravilla de Colombia": una iglesia construida en el interior de una mina de sal, a 180 metros bajo tierra.',
    longDescription: 'Considerada la "Primera Maravilla de Colombia", es una iglesia única construida en el interior de una mina de sal a 180 metros bajo tierra. En su recorrido se aprecian las Estaciones del Vía Crucis talladas en la roca de sal, la Cúpula Central y una imponente cruz.\n\nOfrece experiencias adicionales como recorridos temáticos y actividades de bienestar.',
    images: photos('catedral-de-sal', 1),
    location: { lat: 5.01871, lon: -74.01033 },
    tips: generalTips,
  },
  {
    id: 'mina-de-sal-de-nemocon',
    slug: 'mina-de-sal-de-nemocon',
    name: 'Mina de Sal de Nemocón',
    municipality: 'Nemocón',
    categories: ['Patrimonio', 'Cultura'],
    description: 'Mina de más de 500 años con un recorrido a 80 metros bajo tierra, la Capilla de la Virgen del Carmen y un espejo de salmuera.',
    longDescription: 'La Mina de Sal de Nemocón es, sin duda, el atractivo más emblemático del municipio. Esta mina, que data de más de 500 años, ofrece una fascinante experiencia subterránea a 80 metros bajo tierra.\n\nDurante el recorrido, los visitantes pueden admirar la impresionante Capilla de la Virgen del Carmen, una réplica del corazón humano tallada en sal y un espejo de salmuera que refleja la majestuosidad de la mina.',
    images: photos('mina-de-sal-de-nemocon', 1),
    location: { lat: 5.06389, lon: -73.87462 },
    tips: generalTips,
  },
  {
    id: 'embalse-del-neusa',
    slug: 'embalse-del-neusa',
    name: 'Embalse del Neusa',
    municipality: 'Cogua',
    categories: ['Naturaleza', 'Aventura', 'Familiar'],
    description: 'Lago artificial rodeado de naturaleza, ideal para camping, pesca y senderismo.',
    longDescription: 'Cogua es un destino atractivo para el turismo ecológico y rural. Entre sus lugares de interés se encuentra el Embalse del Neusa, un lago artificial rodeado de naturaleza, ideal para actividades como el camping, la pesca y el senderismo.\n\nEl municipio también ofrece rutas de ecoturismo que permiten a los visitantes explorar la belleza natural de la región.',
    images: photos('embalse-del-neusa', 1),
    location: { lat: 5.16162, lon: -73.95192 },
    tips: [route, nature, 'La Subestación de Policía Neusa atiende la zona del embalse'],
  },
  {
    id: 'centro-historico-de-zipaquira',
    slug: 'centro-historico-de-zipaquira',
    name: 'Centro Histórico de Zipaquirá',
    municipality: 'Zipaquirá',
    categories: ['Patrimonio', 'Cultura'],
    description: 'Calles empedradas, balcones coloniales y plazas históricas como la Plaza de los Comuneros y la Catedral Diocesana.',
    longDescription: 'Un paseo por el centro de Zipaquirá transporta a sus visitantes al pasado colonial. Sus calles empedradas y edificaciones históricas albergan varios puntos de interés.\n\nPlaza de los Comuneros: la plaza principal, testigo de eventos históricos como la firma de las Capitulaciones Comuneras en 1781. Está rodeada de importantes edificios como la Catedral Diocesana y el Palacio Municipal.\n\nCatedral Diocesana: ubicada en la Plaza de los Comuneros, presenta una interesante arquitectura que combina elementos originales con restauraciones posteriores a un terremoto.\n\nCasa de los Virreyes: antigua casona que perteneció a los virreyes y personajes ilustres, quienes la utilizaban como vivienda de veraneo. Durante la presidencia de Antonio Nariño (1811), Zipaquirá fue nombrada Subpresidencia de la Primera República y la casa fue sede del Palacio Presidencial del Gobierno Patriota de las Provincias Unidas de la Nueva Granada (1811-1816).\n\nBalcones coloniales: casas coloniales de robustas paredes y balcones que recuerdan la historia señorial de la antigua Zipaquirá. La mayoría fueron elaborados casi sin piezas metálicas, para evitar el deterioro causado por el ambiente salino de los hornos de sal que rodeaban el pueblo.\n\nPlaza de la Independencia: inaugurada en 2010 donde antes funcionaba la plaza de mercado. Está rodeada de cafés, restaurantes y bares, con una amplia oferta gastronómica.\n\nPlaza de los Mártires Zipaquireños: conocida como "Plaza de la Floresta", fue remodelada en 2016 en el marco del Bicentenario del Sacrificio de los Mártires Zipaquireños. En su centro se yergue un obelisco con los nombres de los héroes de la patria.',
    images: photos('centro-historico-de-zipaquira', 2, 1, 3, 4, 5, 6, 7),
    location: { lat: 5.02396, lon: -74.00362 },
    tips: generalTips,
  },
  {
    id: 'estacion-del-tren-de-zipaquira',
    slug: 'estacion-del-tren-de-zipaquira',
    name: 'Estación del Tren y Parque La Esperanza',
    municipality: 'Zipaquirá',
    // Tipología propuesta (no venía en la tabla del usuario): pendiente de revisión
    categories: ['Patrimonio', 'Cultura', 'Familiar'],
    description: 'Estación neoclásica de 1927, Monumento Nacional y parada del Tren Turístico de la Sabana, junto al Parque La Esperanza.',
    longDescription: 'Conocida como estación Tres Esquinas, fue diseñada por el arquitecto Alfredo Bazzani en estilo neoclásico francés e inaugurada el 8 de diciembre de 1927. Es Monumento Nacional según el Decreto 0746 de 1996. Hoy alberga la sede del Instituto Municipal de Cultura, Recreación y Deporte de Zipaquirá (IMCRDZ) y el Punto de Información Turística (PIT).\n\nForma parte del recorrido del Tren Turístico de la Sabana, que conecta Zipaquirá con Bogotá los fines de semana y festivos.\n\nParque La Esperanza: ubicado donde se encontraba la antigua Plaza de Ferias, fue inaugurado en abril de 2003. Cuenta con 33.000 metros cuadrados de espacio público y fue creado para exaltar la Estación del Tren y brindar un nuevo espacio de esparcimiento.',
    images: photos('estacion-del-tren-de-zipaquira', 1, 2),
    location: { lat: 5.02165, lon: -74.00055 },
    address: 'Carrera 11 N° 4-00, Zipaquirá',
    tips: generalTips,
  },
  {
    id: 'sendero-de-los-zipas',
    slug: 'sendero-de-los-zipas',
    name: 'Sendero de los Zipas',
    municipality: 'Zipaquirá',
    categories: ['Naturaleza', 'Cultura'],
    description: 'Un recorrido por la ancestralidad del municipio en homenaje al cacicazgo de los Zipas.',
    longDescription: 'Este sendero es un homenaje al cacicazgo de los Zipas, su territorio y su poder. Es un recorrido por la ancestralidad del municipio que busca motivar el conocimiento sobre nuestros orígenes e identidad.',
    images: photos('sendero-de-los-zipas', 1),
    location: { lat: 5.01950, lon: -74.00850, approximate: 'cerca de la Catedral de Sal; no está en OpenStreetMap' },
    tips: generalTips,
  },
  {
    id: 'museo-arqueologico-de-zipaquira',
    slug: 'museo-arqueologico-de-zipaquira',
    name: 'Museo Arqueológico de Zipaquirá',
    municipality: 'Zipaquirá',
    categories: ['Cultura', 'Patrimonio'],
    description: 'Más de mil piezas de 19 culturas prehispánicas, con énfasis en la importancia de la sal para los pueblos indígenas.',
    longDescription: 'Este museo exhibe una colección de artefactos precolombinos que permiten conocer las culturas indígenas que habitaron la región antes de la llegada de los españoles, con un enfoque particular en la importancia de la sal para estas comunidades.\n\nCuenta con una exposición permanente de más de mil piezas pertenecientes a 19 culturas prehispánicas de todo el territorio nacional: piezas en arcilla, líticos, metales, huesos, maderas, ámbar, jade y espóndilos.',
    images: photos('museo-arqueologico-de-zipaquira', 1, 2),
    location: { lat: 5.02102, lon: -74.00672 },
    address: 'Calle 1 N° 6-21, Zipaquirá',
    phone: '315 823 5281',
    website: 'https://www.facebook.com/museoarqueologicodezipaquira/?ref=page_internal',
    tips: generalTips,
  },
  {
    id: 'casa-museo-guillermo-quevedo-zornoza',
    slug: 'casa-museo-guillermo-quevedo-zornoza',
    name: 'Casa Museo Guillermo Quevedo Zornoza',
    municipality: 'Zipaquirá',
    // Tipología propuesta (no venía en la tabla del usuario): pendiente de revisión
    categories: ['Cultura', 'Patrimonio'],
    description: 'Casa del siglo XVII con recuerdos de la familia Quevedo y objetos usados por Bolívar, Santander y Nariño.',
    longDescription: 'Esta casa del siglo XVII conserva los recuerdos de varias generaciones de la familia Quevedo, compuesta por cultores de las letras, la poesía, la música y la pintura.\n\nGuarda objetos de los últimos siglos, especialmente piezas usadas por héroes de la independencia como Bolívar, Santander y Nariño.',
    images: photos('casa-museo-guillermo-quevedo-zornoza', 1),
    location: { lat: 5.02260, lon: -74.00500, approximate: 'estimada por la dirección Calle 3 N° 7-69' },
    address: 'Calle 3 N° 7-69, Zipaquirá',
    phone: '(601) 852 2220',
    website: 'https://www.facebook.com/casaquevedoz/photos/?ref=page_internal',
    tips: generalTips,
  },
  {
    id: 'plaza-ignacio-villaveces',
    slug: 'plaza-ignacio-villaveces',
    name: 'Plaza Ignacio Villaveces',
    municipality: 'Zipaquirá',
    // Tipología propuesta (no venía en la tabla del usuario): pendiente de revisión
    categories: ['Patrimonio'],
    description: 'Plaza que honra al administrador de las Salinas de 1942 a 1945, desde donde se veían las chimeneas de los hornos de sal.',
    longDescription: 'Esta plaza lleva el nombre del ingeniero Ignacio Villaveces, administrador de las Salinas de Zipaquirá entre 1942 y 1945. Desde allí se observaban las chimeneas de los hornos para el procesamiento de la sal, ya que en esa época no había refinería y todo se procesaba en fondos metálicos.',
    images: photos('plaza-ignacio-villaveces', 1),
    location: { lat: 5.02130, lon: -74.00642 },
    tips: generalTips,
  },
  {
    id: 'parque-la-esmeralda',
    slug: 'parque-la-esmeralda',
    name: 'Parque La Esmeralda',
    municipality: 'Zipaquirá',
    // Tipología propuesta (no venía en la tabla del usuario): pendiente de revisión
    categories: ['Familiar'],
    description: 'Parque con zonas verdes, jardines y chorros de agua frente a la Iglesia del Divino Niño.',
    longDescription: 'Ubicado en un amplio sector comercial de Zipaquirá, cuenta con magníficos espacios de esparcimiento y tranquilidad. Tiene zonas verdes con amplios jardines, chorros de agua y pompeyanos que exaltan la Iglesia del Divino Niño.\n\nA su alrededor se encuentran la Secretaría de Seguridad y Convivencia Ciudadana y establecimientos de hospedaje.',
    images: photos('parque-la-esmeralda', 1),
    location: { lat: 5.02901, lon: -73.99967, approximate: 'centro del barrio La Esmeralda' },
    tips: generalTips,
  },

  // ── Nemocón ────────────────────────────────────────────────────────────────
  {
    id: 'museo-de-historia-natural-de-nemocon',
    slug: 'museo-de-historia-natural-de-nemocon',
    name: 'Museo de Historia Natural de Nemocón',
    municipality: 'Nemocón',
    categories: ['Cultura'],
    description: 'Colección de fósiles de la región, incluidos restos de mastodontes, en el mismo complejo de las minas.',
    longDescription: 'Ubicado en el mismo complejo de las minas, este museo alberga una colección de fósiles de la región, incluidos restos de mastodontes y otras especies prehistóricas.\n\nEs un lugar ideal para aprender sobre la biodiversidad y la historia geológica de la zona, con una experiencia educativa para adultos y niños.',
    images: photos('museo-de-historia-natural-de-nemocon', 1),
    location: { lat: 5.06371, lon: -73.87471 },
    tips: generalTips,
  },
  {
    id: 'iglesia-san-francisco-de-asis',
    slug: 'iglesia-san-francisco-de-asis',
    name: 'Iglesia San Francisco de Asís',
    municipality: 'Nemocón',
    // Tipología propuesta (no venía en la tabla del usuario): pendiente de revisión
    categories: ['Patrimonio', 'Cultura'],
    description: 'Templo colonial del siglo XVIII con fachada de piedra, en el corazón del pueblo.',
    longDescription: 'La Iglesia San Francisco de Asís es un encantador templo colonial en el corazón del pueblo. Construida en el siglo XVIII, es un ejemplo de la arquitectura religiosa de la época, con su fachada de piedra y un interior decorado con detalles artísticos que reflejan la fe y la tradición de los habitantes de Nemocón.',
    images: photos('iglesia-san-francisco-de-asis', 1),
    location: { lat: 5.06602, lon: -73.87674 },
    tips: generalTips,
  },

  // ── La Calera ──────────────────────────────────────────────────────────────
  {
    id: 'parque-nacional-natural-chingaza',
    slug: 'parque-nacional-natural-chingaza',
    name: 'Parque Nacional Natural Chingaza',
    municipality: 'La Calera',
    categories: ['Naturaleza', 'Aventura'],
    description: 'Bosques altoandinos, subandinos y páramos en la cordillera Oriental, al noreste de Bogotá.',
    longDescription: 'Está ubicado en la cordillera Oriental de los Andes, al noreste de Bogotá, y lo conforman 11 municipios: 7 de Cundinamarca (Fómeque, Choachí, La Calera, Guasca, Junín, Gachalá y Medina) y 4 del Meta (San Juanito, El Calvario, Restrepo y Cumaral).\n\nSus ecosistemas predominantes son los bosques altoandinos, subandinos y los páramos, refugio de fauna y flora. Un lugar para reencontrarse con la naturaleza y conocer paisajes únicos.',
    images: photos('parque-nacional-natural-chingaza', 1),
    location: { lat: 4.56916, lon: -73.74311 },
    tips: natureTips,
  },

  // ── Guasca ─────────────────────────────────────────────────────────────────
  {
    id: 'termales-de-guasca',
    slug: 'termales-de-guasca',
    name: 'Termales de Guasca',
    municipality: 'Guasca',
    categories: ['Naturaleza', 'Familiar'],
    description: 'Aguas termales ricas en minerales, con piscinas a diferentes temperaturas, zonas de descanso y gastronomía.',
    longDescription: 'Ofrecen una experiencia termal perfecta para escapar del frío y relajarse en medio de la naturaleza. Sus aguas, ricas en minerales, brindan beneficios terapéuticos y revitalizantes.\n\nDisponen de diversas piscinas a diferentes temperaturas, zonas de descanso y opciones gastronómicas. Es un lugar ideal para disfrutar en familia, en pareja o con amigos.',
    images: photos('termales-de-guasca', 1),
    location: { lat: 4.87580, lon: -73.85807 },
    tips: generalTips,
  },

  // ── Chía ───────────────────────────────────────────────────────────────────
  {
    id: 'cerro-la-valvanera',
    slug: 'cerro-la-valvanera',
    name: 'Cerro La Valvanera',
    municipality: 'Chía',
    categories: ['Naturaleza', 'Aventura'],
    description: 'Caminata y ruta ciclista hasta la iglesia La Valvanera, a 2.780 metros sobre el nivel del mar.',
    longDescription: 'Es un destino preferido por los ciclistas; además, muchos turistas llegan para hacer la caminata de ascenso y conocer la bella iglesia La Valvanera, que se encuentra en la cima.\n\nEstá a 2.780 metros sobre el nivel del mar y la temperatura promedio es de 13 °C. El recorrido es de ascenso y de dificultad baja: son aproximadamente 3 horas de caminata desde el parque de Chía, u hora y media en bicicleta.',
    images: photos('cerro-la-valvanera', 1),
    location: { lat: 4.86373, lon: -74.07902 },
    tips: ['La caminata desde el parque de Chía toma unas 3 horas (hora y media en bicicleta): sal temprano', 'La temperatura promedio en la cima es de 13 °C: lleva ropa abrigada', emergency],
  },

  // ── Tabio ──────────────────────────────────────────────────────────────────
  {
    id: 'termales-el-zipa',
    slug: 'termales-el-zipa',
    name: 'Termales El Zipa',
    municipality: 'Tabio',
    categories: ['Naturaleza', 'Familiar'],
    description: 'Aguas termales volcánicas con más de 12 minerales, piscina recreativa, piscina medicinal y restaurante típico.',
    longDescription: 'Balneario ubicado en las afueras de Tabio, cuyas aguas termales volcánicas, totalmente naturales, tienen diversos efectos medicinales. Fue creado hace más de 40 años para la diversión de familias y turistas.\n\nCuenta con una piscina turística y una piscina medicinal, jacuzzi, baño turco (en remodelación), un lago natural y un restaurante de comida típica de la región. Sus aguas tienen más de 12 minerales.\n\nTemperatura del manantial: 58 °C. Piscina natural: 35 a 40 °C. Baño turco natural: 40 °C.',
    images: photos('termales-el-zipa', 1),
    location: { lat: 4.92366, lon: -74.10505 },
    tips: ['El manantial alcanza 58 °C: usa solo las piscinas habilitadas', belongings, emergency],
  },

  // ── Tocancipá ──────────────────────────────────────────────────────────────
  {
    id: 'parque-jaime-duque',
    slug: 'parque-jaime-duque',
    name: 'Parque Jaime Duque',
    municipality: 'Tocancipá',
    categories: ['Familiar', 'Cultura'],
    description: 'Parque temático de 200 hectáreas con atracciones, actividades culturales y zonas de reserva ambiental.',
    longDescription: 'Es un parque temático dedicado a la recreación familiar, inaugurado el 27 de febrero de 1983 por Jaime Duque Grisales, figura de la aviación civil colombiana y primer jefe de pilotos nacional de Avianca. Quiso crear un espacio cultural y recreativo para toda la familia, con el fin de apoyar a entidades sin ánimo de lucro dedicadas al servicio de adultos mayores y niños.\n\nEs un complejo de 200 hectáreas que reúne una gran variedad de atracciones y actividades recreativas y culturales, enmarcadas en zonas de reserva ambiental: "un mundo de experiencias en un solo lugar".',
    images: photos('parque-jaime-duque', 1),
    location: { lat: 4.94910, lon: -73.96375 },
    address: 'Km 34 Autopista Norte, Tocancipá',
    tips: generalTips,
  },
  {
    id: 'reserva-natural-ecoparque-sabana',
    slug: 'reserva-natural-ecoparque-sabana',
    name: 'Reserva Natural Ecoparque Sabana',
    municipality: 'Tocancipá',
    categories: ['Naturaleza'],
    description: 'Reserva de 60 hectáreas con humedales restaurados, hogar de más de 100 especies de aves.',
    longDescription: 'Ubicada en la Fundación Parque Jaime Duque, cuenta con 60 hectáreas donde se desarrollan actividades relacionadas con la conservación de la vida, la memoria histórica y la naturaleza.\n\nA través de la restauración ecológica se han recuperado humedales y espacios naturales que hoy son el hábitat de más de 100 especies de aves.',
    images: photos('reserva-natural-ecoparque-sabana', 1),
    location: { lat: 4.94850, lon: -73.95538 },
    tips: natureTips,
  },
  {
    id: 'museo-aeroespacial-colombiano',
    slug: 'museo-aeroespacial-colombiano',
    name: 'Museo Aeroespacial Colombiano',
    municipality: 'Tocancipá',
    categories: ['Cultura'],
    description: 'La historia de la Fuerza Aérea Colombiana en dos salas de exposición y un parque aeronáutico.',
    longDescription: 'Explora la historia de las aeronaves militares que han protegido los cielos de Colombia. Los visitantes pueden conocer la historia de la Fuerza Aérea Colombiana en un amplio recorrido por dos salas de exposición y el parque aeronáutico.',
    images: photos('museo-aeroespacial-colombiano', 1),
    location: { lat: 4.95046, lon: -73.96130 },
    address: 'Km 1 Vía Briceño–Zipaquirá, Tocancipá',
    phone: '318 661 8807',
    tips: generalTips,
  },
  {
    id: 'iglesia-nuestra-senora-de-fatima',
    slug: 'iglesia-nuestra-senora-de-fatima',
    name: 'Iglesia Nuestra Señora de Fátima',
    municipality: 'Tocancipá',
    categories: ['Patrimonio', 'Cultura'],
    description: 'Templo de estilo gótico policromado de los Heraldos del Evangelio, uno de los más bellos de la Ruta de la Fe.',
    longDescription: 'Llamada también Iglesia de los Caballeros de la Virgen, está a 22 km de Bogotá. Su interior, de estilo gótico policromado, la convierte en uno de los lugares más bonitos de la Ruta de la Fe. Fue construida por los Heraldos del Evangelio, conocidos popularmente como Caballeros de la Virgen; su construcción tomó diez años y terminó el 8 de agosto de 2015.\n\nLos arcos ojivales dan una sensación de verticalidad y los vitrales, los colores y las entradas de luz natural producen un gran impacto estético. Las eucaristías se acompañan con un coro polifónico y uno gregoriano. Recibe a miles de devotos de todo el país.',
    images: photos('iglesia-nuestra-senora-de-fatima', 1),
    location: { lat: 4.97948, lon: -73.91843 },
    tips: generalTips,
  },

  // ── Sopó ───────────────────────────────────────────────────────────────────
  {
    id: 'santuario-del-senor-de-la-piedra',
    slug: 'santuario-del-senor-de-la-piedra',
    name: 'Santuario del Señor de la Piedra',
    municipality: 'Sopó',
    categories: ['Patrimonio', 'Cultura'],
    description: 'Lugar de peregrinación con una piedra milagrosa, cerca de la colonial Iglesia del Divino Salvador.',
    longDescription: 'El Santuario del Señor de la Piedra es un lugar de peregrinación con una piedra milagrosa.\n\nEn Sopó también se encuentra la Iglesia del Divino Salvador, un templo colonial que alberga un valioso patrimonio artístico, incluida una colección de lienzos de los 12 arcángeles y un antiguo reloj de torre.',
    images: photos('santuario-del-senor-de-la-piedra', 1),
    location: { lat: 4.90878, lon: -73.93591 },
    tips: generalTips,
  },
  {
    id: 'parque-ecologico-pionono',
    slug: 'parque-ecologico-pionono',
    name: 'Parque Ecológico Pionono',
    municipality: 'Sopó',
    categories: ['Naturaleza', 'Aventura'],
    description: 'El punto más alto de Sopó: caminatas ecológicas, camping, parapente y vista panorámica del valle.',
    longDescription: 'El propósito del parque es conservar los recursos naturales para las futuras generaciones e incentivar el ecoturismo. Por ser el punto más alto de Sopó, ofrece una panorámica del municipio, su valle y buena parte de los municipios vecinos.\n\nAbrió sus puertas en mayo de 1999. Tiene fácil acceso y permite caminatas ecológicas, deportes de aventura como el parapente y el ala delta, y camping bajo las estrellas.',
    images: photos('parque-ecologico-pionono', 1),
    location: { lat: 4.90265, lon: -73.92519 },
    tips: [route, 'Practica parapente o ala delta solo con operadores autorizados', emergency],
  },

  // ── Facatativá ─────────────────────────────────────────────────────────────
  {
    id: 'parque-arqueologico-de-facatativa',
    slug: 'parque-arqueologico-de-facatativa',
    name: 'Parque Arqueológico de Facatativá',
    municipality: 'Facatativá',
    categories: ['Patrimonio', 'Cultura'],
    description: '27 hectáreas de abrigos rocosos y pintura rupestre que podría tener unos 12.000 años, a 2.600 msnm.',
    longDescription: 'Es un conjunto de pictogramas cuyo origen exacto se desconoce; su antigüedad no se ha determinado, pero podrían datar de aproximadamente 12.000 años.\n\nSe creó en 1946 tras un proceso de expropiación iniciado por el ministro de Educación Germán Arciniegas, que se concretó en 1969. Su administración pasó al Instituto Etnológico Nacional (luego ICANH), que lo declaró Parque Arqueológico; después a Colcultura y, desde 1972, a la Corporación Autónoma Regional (CAR) en comodato.\n\nComprende unas 27 hectáreas con abrigos rocosos, pintura rupestre y paisajes de gran riqueza ambiental, a 2.600 metros sobre el nivel del mar.',
    images: photos('parque-arqueologico-de-facatativa', 1),
    location: { lat: 4.81670, lon: -74.34600 },
    tips: [route, 'No toques ni marques las rocas: la pintura rupestre es patrimonio', emergency],
  },
  {
    id: 'iglesia-nuestra-senora-del-rosario',
    slug: 'iglesia-nuestra-senora-del-rosario',
    name: 'Catedral Nuestra Señora del Rosario',
    municipality: 'Facatativá',
    // Tipología propuesta (no venía en la tabla del usuario): pendiente de revisión
    categories: ['Patrimonio', 'Cultura'],
    description: 'Principal templo de la Diócesis de Facatativá, de estilo neoclásico, inaugurado en 1895.',
    longDescription: 'Oficialmente Parroquia Catedral de Nuestra Señora del Rosario, es el principal templo de la Diócesis de Facatativá. Su construcción comenzó en 1871 bajo la dirección de José María Quiroga, en estilo neoclásico ("republicano"), a contracorriente del antiguo estilo colonial.\n\nSe inauguró el 10 de agosto de 1895 y fue consagrada como catedral el 16 de marzo de 1962 por el papa Juan XXIII. Un terremoto en 1967 deterioró sus torres, que fueron remodeladas para reabrirla en 1971.',
    images: photos('iglesia-nuestra-senora-del-rosario', 1),
    location: { lat: 4.80925, lon: -74.35367 },
    tips: generalTips,
  },

  // ── Madrid ─────────────────────────────────────────────────────────────────
  {
    id: 'parque-de-las-flores',
    slug: 'parque-de-las-flores',
    name: 'Parque de las Flores',
    municipality: 'Madrid',
    categories: ['Familiar'],
    description: 'Seis hectáreas con canchas, juegos infantiles, patinódromo, concha acústica y zonas de asadores.',
    longDescription: 'Es un espacio recreativo y familiar de la Sabana de Occidente con una extensión de 6 hectáreas, destinado a la práctica de deportes, reuniones y eventos culturales.\n\nIncluye canchas de fútbol, microfútbol, baloncesto, voleibol y tenis, juegos infantiles, arenero, patinódromo, concha acústica y zonas de asadores para las familias.',
    images: photos('parque-de-las-flores', 1),
    location: { lat: 4.72329, lon: -74.25022 },
    tips: generalTips,
  },

  // ── Subachoque ─────────────────────────────────────────────────────────────
  {
    id: 'cerro-el-tablazo',
    slug: 'cerro-el-tablazo',
    name: 'Cerro El Tablazo',
    municipality: 'Subachoque',
    categories: ['Naturaleza', 'Aventura'],
    description: 'Mirador natural a 3.504 msnm, rodeado de bosque altoandino, con vista al valle del río Magdalena.',
    longDescription: 'Es un mirador natural que se alza a 3.504 metros sobre el nivel del mar, rodeado de bosque altoandino, donde se pueden observar orquídeas, quiches, frailejones, musgos y numerosas especies de aves.\n\nDesde allí se contemplan el valle del río Magdalena, la cordillera Central y los centros poblados de Subachoque y San Francisco. Es una barrera natural que detiene la humedad de tierras cálidas, por lo que suele estar cubierto de una densa neblina.',
    images: photos('cerro-el-tablazo', 1),
    location: { lat: 5.01407, lon: -74.19619 },
    tips: [route, 'A 3.504 msnm la neblina es frecuente: lleva ropa abrigada e impermeable', emergency],
  },

  // ── Mosquera ───────────────────────────────────────────────────────────────
  {
    id: 'desierto-de-sabrinsky',
    slug: 'desierto-de-sabrinsky',
    name: 'Desierto de Sabrinsky',
    municipality: 'Mosquera',
    categories: ['Naturaleza'],
    description: 'Ecosistema semiárido con formaciones rocosas y tonos rojizos, ideal para el senderismo.',
    longDescription: 'Es un ecosistema semiárido único en Colombia. Aunque no es un desierto en el sentido tradicional, su paisaje árido, sus formaciones rocosas y sus tonos rojizos crean un escenario espectacular.\n\nEs un lugar ideal para el senderismo y la conexión con la naturaleza.',
    images: photos('desierto-de-sabrinsky', 1),
    location: { lat: 4.66597, lon: -74.28389 },
    tips: natureTips,
  },

  // ── Bojacá ─────────────────────────────────────────────────────────────────
  {
    id: 'piedras-de-chivonegro',
    slug: 'piedras-de-chivonegro',
    name: 'Parque Arqueológico Piedras de Chivonegro',
    municipality: 'Bojacá',
    categories: ['Patrimonio', 'Cultura'],
    description: 'Más de 50 piedras con arte muisca grabado, Bien de Interés Cultural desde 2008, con vista de 360° a la Sabana.',
    longDescription: 'Tiene más de 50 piedras que, por su tamaño y el arte muisca grabado en ellas, se consideran principales. Fueron declaradas Bien de Interés Cultural en 2008.\n\nEl parque tiene una parte alta desde la que se ve la Sabana en 360 grados, vegetación diversa y, en el centro, un kiosco con techo verde para reuniones. Los caminos recorren el entorno del parque.',
    images: photos('piedras-de-chivonegro', 1),
    location: { lat: 4.71673, lon: -74.32283 },
    tips: [route, 'No toques ni marques las piedras: el arte muisca es patrimonio', emergency],
  },
  {
    id: 'santuario-nuestra-senora-de-la-salud',
    slug: 'santuario-nuestra-senora-de-la-salud',
    name: 'Santuario de Nuestra Señora de la Salud',
    municipality: 'Bojacá',
    categories: ['Patrimonio', 'Cultura'],
    description: 'Santuario agustino fundado hacia 1750, conocido como "La Roma Chiquita".',
    longDescription: 'Es uno de los principales santuarios de Cundinamarca, custodiado por la Orden de San Agustín. Fue fundado hacia 1750 y alberga la imagen de Nuestra Señora de los Dolores.\n\nSu aspecto colonial y la visita de los campesinos cada domingo le dieron el nombre de "La Roma Chiquita". También alberga el Convento de Novicios de la Provincia de Nuestra Señora de Gracia de Colombia y Ecuador de la Orden de San Agustín.',
    images: photos('santuario-nuestra-senora-de-la-salud', 1),
    location: { lat: 4.73167, lon: -74.34145 },
    tips: generalTips,
  },
  {
    id: 'parque-natural-chicaque',
    slug: 'parque-natural-chicaque',
    name: 'Parque Natural Chicaque',
    municipality: 'Bojacá',
    categories: ['Naturaleza', 'Aventura'],
    description: 'Reserva de más de 300 hectáreas con 7 tipos de bosque y más de 100 especies de aves.',
    longDescription: 'Esta reserva natural, conformada por 7 tipos de bosque, guarda innumerables especies de flora y fauna. Con más de 300 hectáreas verdes, es el hogar de más de 100 especies de aves.\n\nEstá dedicada a la conservación de la naturaleza, la educación ambiental y el ecoturismo; su diversidad de aves y mamíferos la hace muy popular.',
    images: photos('parque-natural-chicaque', 1),
    location: { lat: 4.59752, lon: -74.28270 },
    tips: natureTips,
  },
]

export function getDestinations(): Destination[] {
  return destinations
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find(d => d.slug === slug)
}
