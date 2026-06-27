import { useState, useLayoutEffect, useRef } from 'react'

// Mide en px el alto real de cada bloque del documento, renderizandolos en un
// contenedor invisible fuera de pantalla. Asi paginar.js puede repartir con
// medidas reales (una nota larga ocupa mas, un titulo ocupa lo suyo, etc.).
//
// Devuelve { medidas, listo }. Mientras listo===false, el llamador pinta una
// hoja provisional para evitar parpadeo.
export function useMedidasDocumento(quote) {
  const [medidas, setMedidas] = useState(null)
  const ref = useRef(null)

  useLayoutEffect(() => {
    const cont = ref.current
    if (!cont) return

    // Cada bloque medible lleva data-medir="<indice>"; los fijos, data-fijo="<clave>".
    const altoDe = (sel) => {
      const el = cont.querySelector(sel)
      return el ? el.getBoundingClientRect().height : 0
    }

    const nodosBloque = cont.querySelectorAll('[data-medir]')
    const bloques = Array.from(nodosBloque).map((el) => ({
      tipo: el.getAttribute('data-tipo'),
      alto: el.getBoundingClientRect().height,
    }))

    setMedidas({
      bloques,
      cabeceraMarca: altoDe('[data-fijo="cabeceraMarca"]'),
      cabeceraTabla: altoDe('[data-fijo="cabeceraTabla"]'),
      metaEvento: altoDe('[data-fijo="metaEvento"]'),
      totalFooter: altoDe('[data-fijo="totalFooter"]'),
    })
  }, [quote])

  return { medidas, listo: medidas !== null, refMedicion: ref }
}
