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
//
// IMPORTANTE (por qué re-medimos): la altura de la cabecera depende del LOGO
// (una <img>) y de las fuentes de Adobe (Typekit), que cargan de forma ASÍNCRONA.
// Si midiéramos una sola vez y ese primer frame ocurre antes de que el logo o
// la fuente tengan su tamaño final, el alto útil por hoja queda mal calibrado
// y la factura se parte en dos hojas aunque tenga pocas líneas. Por eso, además
// de medir al montar, volvemos a medir cuando las fuentes e imágenes terminan
// de cargar. Es como medir una estantería antes de que lleguen los estantes:
// hay que volver a medir cuando ya están todos puestos.
export function useMedidasDocumento(quote) {
  const [medidas, setMedidas] = useState(null)
  const ref = useRef(null)

  useLayoutEffect(() => {
    const cont = ref.current
    if (!cont) return

    // Toma todas las medidas del DOM actual del contenedor de medición.
    const medir = () => {
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
    }

    // 1) Medición inmediata (evita parpadeo; puede usar fuentes/logo provisionales).
    medir()

    // 2) Re-medir cuando las FUENTES de Adobe terminen de cargar. document.fonts
    //    es una promesa que resuelve cuando ya no hay fuentes pendientes.
    let vivo = true
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (vivo) medir()
      })
    }

    // 3) Re-medir cuando cada IMAGEN (logo de la cabecera) termine de cargar.
    //    Una imagen sin cargar reporta alto 0/placeholder; al cargar cambia el
    //    alto de .head y por tanto el espacio útil de cada hoja.
    const imgs = Array.from(cont.querySelectorAll('img'))
    const reMedir = () => { if (vivo) medir() }
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', reMedir, { once: true })
    })

    return () => {
      vivo = false
      imgs.forEach((img) => img.removeEventListener('load', reMedir))
    }
  }, [quote])

  return { medidas, listo: medidas !== null, refMedicion: ref }
}
