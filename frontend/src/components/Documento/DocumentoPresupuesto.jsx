import { useMemo } from 'react'
import '../../styles/documento.css'
import { datosEmpresa } from '../../data/datosEmpresa'
import { etiquetas } from '../../data/textosFijos'
import { calcularTotales } from '../../lib/calculos'
import { paginarBloques } from '../../lib/paginar'
import { useMedidasDocumento } from '../../hooks/useMedidasDocumento'
import HojaA4 from './HojaA4'
import PaginaCondiciones from './PaginaCondiciones'

// Alto util de una hoja A4 para CONTENIDO, en px. Se calcula a partir de las
// medidas reales: alto de hoja menos margenes, cabeceras y (en la ultima) total.
// A4 = 297mm. Asumimos 1mm ≈ 3.78px (96dpi). Margenes verticales 18mm arriba +
// 18mm abajo. El resto lo descuentan las cabeceras medidas.
const MM_TO_PX = 3.7795
const ALTO_HOJA_PX = 297 * MM_TO_PX
const MARGEN_VERTICAL_PX = 2 * 18 * MM_TO_PX

// Construye la lista lineal de bloques (titulo, item, subtotal) desde quote.
function construirBloques(quote) {
  const bloques = []
  for (const section of quote.sections) {
    if (section.title) {
      bloques.push({ tipo: 'titulo', ref: { tipoRef: 'titulo', section } })
    }
    section.items.forEach((item) => {
      bloques.push({ tipo: 'item', ref: { tipoRef: 'item', item, sectionId: section.id } })
    })
    if (section.showSubtotal) {
      bloques.push({ tipo: 'subtotal', ref: { tipoRef: 'subtotal', section } })
    }
  }
  return bloques
}

function DocumentoPresupuesto({ quote }) {
  const empresa = datosEmpresa[quote.brand][quote.lang]
  const t = etiquetas[quote.lang]
  const totales = calcularTotales(quote)

  const bloquesBase = useMemo(() => construirBloques(quote), [quote])
  const { medidas, listo, refMedicion } = useMedidasDocumento(quote)

  // Combina bloques + sus alturas medidas (por indice) para paginar.
  const hojas = useMemo(() => {
    if (!listo) return null
    const conAlto = bloquesBase.map((b, i) => ({
      ...b,
      alto: medidas.bloques[i] ? medidas.bloques[i].alto : 0,
    }))
    const altoCabeceras = medidas.cabeceraMarca + medidas.cabeceraTabla
    // Se resta medidas.totalFooter del alto util de TODAS las hojas (no solo
    // la ultima), porque no sabemos de antemano cual hoja sera la ultima sin
    // crear una dependencia circular con el propio resultado de paginar.
    // Enfoque conservador: reservar siempre ese espacio garantiza que el
    // total+footer (margin-top:auto) nunca se recorten en la hoja final,
    // a cambio de un pequeno desperdicio de espacio en hojas intermedias.
    const altoUtilPrimera = ALTO_HOJA_PX - MARGEN_VERTICAL_PX - altoCabeceras - medidas.metaEvento - medidas.totalFooter
    const altoUtilSiguientes = ALTO_HOJA_PX - MARGEN_VERTICAL_PX - altoCabeceras - medidas.totalFooter
    return paginarBloques(conAlto, altoUtilPrimera, altoUtilSiguientes)
  }, [listo, bloquesBase, medidas])

  return (
    <div className="documento" data-brand={quote.brand} data-lang={quote.lang}>
      {/* Contenedor invisible de medicion: HojaA4 real medida por el hook. */}
      <ContenedorMedicion refMedicion={refMedicion} quote={quote} empresa={empresa} t={t} bloques={bloquesBase} totales={totales} />

      {!listo || !hojas ? (
        // Hoja provisional mientras se mide (evita parpadeo)
        <HojaA4 brand={quote.brand} lang={quote.lang} empresa={empresa} t={t}
          bloques={bloquesBase} esPrimera esUltima metaEvento={quote.event} totales={totales} />
      ) : (
        hojas.map((hoja, i) => (
          <HojaA4 key={i} brand={quote.brand} lang={quote.lang} empresa={empresa} t={t}
            bloques={hoja.bloques} esPrimera={i === 0} esUltima={i === hojas.length - 1}
            metaEvento={quote.event} totales={totales} />
        ))
      )}

      <PaginaCondiciones brand={quote.brand} lang={quote.lang} />
    </div>
  )
}

// Render invisible para medir con el MARKUP REAL. Renderiza una HojaA4 idéntica
// a la pintada (misma cabecera, mismas filas via FilaBloque, mismo total) dentro
// de un contenedor del ancho real de una hoja A4 (210mm). Así las alturas medidas
// COINCIDEN con las pintadas y la paginación corta donde debe.
//
// El hook lee:
//  - cada fila real .hoja-lineas tbody tr  -> alto de cada bloque (en orden)
//  - .head -> cabecera de marca; thead.hoja-thead -> cabecera de tabla
//  - .doc-meta -> meta del evento; .hoja-total -> bloque de total
function ContenedorMedicion({ refMedicion, quote, empresa, t, bloques, totales }) {
  return (
    <div ref={refMedicion} aria-hidden="true" className="zona-medicion"
      style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none',
        left: '-9999px', top: 0 }}>
      <div className="documento" data-brand={quote.brand} data-lang={quote.lang}>
        <HojaA4 brand={quote.brand} lang={quote.lang} empresa={empresa} t={t}
          bloques={bloques} esPrimera esUltima metaEvento={quote.event} totales={totales} />
      </div>
    </div>
  )
}

export default DocumentoPresupuesto
