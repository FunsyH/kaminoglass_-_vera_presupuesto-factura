import { useState, useLayoutEffect, useRef } from 'react'

// Mide en px el alto REAL de cada bloque del documento. El contenedor de
// medición renderiza una HojaA4 idéntica a la pintada (mismo markup), así las
// alturas medidas coinciden EXACTAMENTE con las pintadas y la paginación corta
// donde debe (medir placeholders simplificados infra-medía y nunca paginaba).
//
// Devuelve { medidas, listo, refMedicion }. Mientras listo===false, el llamador
// pinta una hoja provisional para evitar parpadeo.
//
// medidas.bloques[i] = { tipo, alto } en el MISMO orden que las filas de la
// tabla (las filas reales de .hoja-lineas tbody tr).
export function useMedidasDocumento(quote) {
  const [medidas, setMedidas] = useState(null)
  const ref = useRef(null)

  useLayoutEffect(() => {
    const cont = ref.current
    if (!cont) return

    const altoDe = (sel) => {
      const el = cont.querySelector(sel)
      return el ? el.getBoundingClientRect().height : 0
    }

    // Filas reales de items/titulos/subtotales: cada <tr> del cuerpo de la tabla.
    const filas = cont.querySelectorAll('.hoja-lineas tbody tr')
    const bloques = Array.from(filas).map((tr) => ({
      tipo: tr.getAttribute('data-tipo') || 'item',
      alto: tr.getBoundingClientRect().height,
    }))

    // Cabecera de marca (.head) + cabecera de tabla (thead de .hoja-lineas).
    const cabeceraMarca = altoDe('.head')
    const cabeceraTabla = altoDe('.hoja-lineas thead')

    // Meta del evento = bloque doc-meta + el subtitulo event-sub (solo hoja 1).
    const metaEvento = altoDe('.doc-meta') + altoDe('.event-sub')

    // Bloque del total tal como se pinta (clavado al fondo en la ultima hoja).
    const totalFooter = altoDe('.hoja-total') + altoDe('.hoja-foot')

    setMedidas({ bloques, cabeceraMarca, cabeceraTabla, metaEvento, totalFooter })
  }, [quote])

  return { medidas, listo: medidas !== null, refMedicion: ref }
}
