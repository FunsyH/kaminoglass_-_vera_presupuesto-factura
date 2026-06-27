// paginar.js
// Reparte una lista de "bloques" (titulo de seccion, fila de item, subtotal)
// en hojas A4 segun el alto util disponible. Logica pura: recibe numeros,
// devuelve estructura. Sin React, sin DOM.
//
// bloque = { tipo: 'titulo'|'item'|'subtotal', alto: number, ref: any }
// Hoja   = { bloques: bloque[] }

// Mira hacia delante: ¿el bloque en la posicion i es un 'titulo' que se
// quedaria huerfano? (es titulo y su siguiente bloque NO cabe con el en la hoja)
function tituloQuedariaHuerfano(bloques, i, usado, altoUtil) {
  const actual = bloques[i]
  if (actual.tipo !== 'titulo') return false
  const siguiente = bloques[i + 1]
  if (!siguiente) return false
  // ¿caben titulo + siguiente juntos en lo que queda de hoja?
  return usado + actual.alto + siguiente.alto > altoUtil
}

export function paginarBloques(bloques, altoUtilPrimera, altoUtilSiguientes) {
  const hojas = []
  let actual = { bloques: [] }
  let usado = 0
  let esPrimera = true
  const altoDe = () => (esPrimera ? altoUtilPrimera : altoUtilSiguientes)

  // Cierra la hoja actual y empieza una nueva.
  const cerrarHoja = () => {
    hojas.push(actual)
    actual = { bloques: [] }
    usado = 0
    esPrimera = false
  }

  for (let i = 0; i < bloques.length; i++) {
    const b = bloques[i]
    const altoUtil = altoDe()

    // Caso titulo huerfano: si el titulo se quedaria solo al pie, cerramos
    // hoja para que titulo + su item bajen juntos a la siguiente.
    if (actual.bloques.length > 0 && tituloQuedariaHuerfano(bloques, i, usado, altoUtil)) {
      cerrarHoja()
    }

    // ¿Cabe el bloque en lo que queda de hoja?
    if (actual.bloques.length > 0 && usado + b.alto > altoDe()) {
      cerrarHoja()
    }

    // Tras posibles cierres, colocamos el bloque (aunque sea gigante: va solo).
    actual.bloques.push(b)
    usado += b.alto
  }

  // Siempre cerramos la ultima hoja (incluso si quedo vacia -> 1 hoja vacia).
  hojas.push(actual)
  return hojas
}
