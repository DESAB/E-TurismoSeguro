/**
 * Datos estructurados schema.org para buscadores.
 * Se reemplaza `<` por su escape unicode para que el contenido no pueda cerrar el <script> (XSS),
 * como recomienda la guía de JSON-LD de Next.js.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
