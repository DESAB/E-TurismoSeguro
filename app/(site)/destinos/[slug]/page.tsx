export { DestinationPage as default, generateMetadata, generateStaticParams } from '@/_pages/destination'

// Slugs fuera de generateStaticParams → 404. Las opciones de segmento deben declararse aquí:
// Next las lee estáticamente del archivo de ruta, no a través de re-exports.
export const dynamicParams = false
