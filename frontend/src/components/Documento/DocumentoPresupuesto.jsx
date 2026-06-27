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
    const altoUtilPrimera = ALTO_HOJA_PX - MARGEN_VERTICAL_PX - altoCabeceras - medidas.metaEvento
    const altoUtilSiguientes = ALTO_HOJA_PX - MARGEN_VERTICAL_PX - altoCabeceras
    return paginarBloques(conAlto, altoUtilPrimera, altoUtilSiguientes)
  }, [listo, bloquesBase, medidas])

  return (
    <div className="documento" data-brand={quote.brand} data-lang={quote.lang}>
      {/* Contenedor invisible de medicion (Task 3 lo lee por data-attrs) */}
      <ContenedorMedicion refMedicion={refMedicion} quote={quote} empresa={empresa} t={t} bloques={bloquesBase} />

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

// Render invisible para medir: cada bloque lleva data-medir/data-tipo; los
// elementos fijos llevan data-fijo. position:absolute + visibility:hidden para
// que no se vea ni ocupe sitio en el layout real.
function ContenedorMedicion({ refMedicion, quote, empresa, t, bloques }) {
  return (
    <div ref={refMedicion} aria-hidden="true"
      style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none',
        width: '174mm', left: '-9999px', top: 0 }}>
      <div className="documento" data-brand={quote.brand} data-lang={quote.lang}>
        <div data-fijo="cabeceraMarca" className="head">{empresa.nombre}</div>
        <div data-fijo="metaEvento" className="doc-meta">{quote.event.title}</div>
        <table className="lineas"><thead data-fijo="cabeceraTabla"><tr>
          <th>{t.concepto}</th><th>{t.cant}</th><th>{t.precioUnit}</th><th>{t.importe}</th>
        </tr></thead><tbody>
          {bloques.map((b, i) => (
            <tr key={i} data-medir={i} data-tipo={b.tipo}>
              <td colSpan={4}>{rotuloMedicion(b)}</td>
            </tr>
          ))}
        </tbody></table>
        <div data-fijo="totalFooter" className="totals">{t.total}</div>
      </div>
    </div>
  )
}

// Texto representativo para medir el alto de cada bloque (mismo contenido real
// que determina su altura: descripcion + nota para items).
function rotuloMedicion(b) {
  if (b.tipo === 'titulo') return b.ref.section.title
  if (b.tipo === 'subtotal') return 'subtotal'
  const item = b.ref.item
  return item.note ? `${item.description} ${item.note}` : item.description
}

export default DocumentoPresupuesto
