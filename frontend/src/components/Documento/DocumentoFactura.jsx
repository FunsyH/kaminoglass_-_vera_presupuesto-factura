import { useMemo } from 'react'
import '../../styles/documento.css'
import { datosEmpresa } from '../../data/datosEmpresa'
import { etiquetas } from '../../data/textosFijos'
import { calcularTotales } from '../../lib/calculos'
import { paginarBloques } from '../../lib/paginar'
import { useMedidasDocumento } from '../../hooks/useMedidasDocumento'
import HojaA4Factura from './HojaA4Factura'

// Misma logica de medidas/paginacion que DocumentoPresupuesto. Ver ese
// archivo para el razonamiento de por que se descuenta totalFooter de TODAS
// las hojas (no solo la ultima).
const MM_TO_PX = 3.7795
const ALTO_HOJA_PX = 297 * MM_TO_PX
const MARGEN_VERTICAL_PX = 2 * 18 * MM_TO_PX

function construirBloques(factura) {
  const bloques = []
  for (const section of factura.sections) {
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

function DocumentoFactura({ factura }) {
  const empresa = datosEmpresa[factura.brand].es
  const t = etiquetas.es
  // Sin totalMode -> calcularTotales usa el modo 'auto' (suma de lineas + IVA).
  const totales = calcularTotales(factura)

  const bloquesBase = useMemo(() => construirBloques(factura), [factura])
  const { medidas, listo, refMedicion } = useMedidasDocumento(factura)

  const hojas = useMemo(() => {
    if (!listo) return null
    const conAlto = bloquesBase.map((b, i) => ({
      ...b,
      alto: medidas.bloques[i] ? medidas.bloques[i].alto : 0,
    }))
    const altoCabeceras = medidas.cabeceraMarca + medidas.cabeceraTabla
    const altoUtilPrimera = ALTO_HOJA_PX - MARGEN_VERTICAL_PX - altoCabeceras - medidas.metaEvento - medidas.totalFooter
    const altoUtilSiguientes = ALTO_HOJA_PX - MARGEN_VERTICAL_PX - altoCabeceras - medidas.totalFooter
    return paginarBloques(conAlto, altoUtilPrimera, altoUtilSiguientes)
  }, [listo, bloquesBase, medidas])

  return (
    <div className="documento" data-brand={factura.brand}>
      <ContenedorMedicion refMedicion={refMedicion} factura={factura} empresa={empresa} t={t} bloques={bloquesBase} totales={totales} />

      {!listo || !hojas ? (
        <HojaA4Factura brand={factura.brand} empresa={empresa} t={t}
          bloques={bloquesBase} esPrimera esUltima factura={factura} totales={totales} />
      ) : (
        hojas.map((hoja, i) => (
          <HojaA4Factura key={i} brand={factura.brand} empresa={empresa} t={t}
            bloques={hoja.bloques} esPrimera={i === 0} esUltima={i === hojas.length - 1}
            factura={factura} totales={totales} />
        ))
      )}
    </div>
  )
}

function ContenedorMedicion({ refMedicion, factura, empresa, t, bloques, totales }) {
  return (
    <div ref={refMedicion} aria-hidden="true" className="zona-medicion"
      style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none',
        left: '-9999px', top: 0 }}>
      <div className="documento" data-brand={factura.brand}>
        <HojaA4Factura brand={factura.brand} empresa={empresa} t={t}
          bloques={bloques} esPrimera esUltima factura={factura} totales={totales} />
      </div>
    </div>
  )
}

export default DocumentoFactura
