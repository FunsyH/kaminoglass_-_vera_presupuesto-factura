// numeracionFactura.js
// Sugiere y guarda el siguiente número de factura, por marca y año.
// Sin React, sin UI: solo lee/escribe localStorage.
//
// Formato:
// - Años hasta 2026: correlativo simple "N/AÑO" (p.ej. "11/2026").
// - Desde 2027: prefijo de marca + correlativo de 3 cifras + año
//   (p.ej. "K-001/2027" para KNG, "V-001/2027" para VERA).
// - El correlativo es independiente por marca y se reinicia cada año nuevo
//   (la clave de localStorage incluye el año, así que un año nuevo arranca
//   siempre en 0 sin necesidad de "resetear" nada a mano).
//
// Por qué aislado en su propio archivo: hoy guarda en localStorage, pero el
// proyecto migrará a Supabase más adelante. Cuando eso pase, solo hay que
// cambiar las dos funciones de aquí (cómo se lee y cómo se guarda); el resto
// de la app solo conoce `sugerirSiguienteNumero` y `confirmarNumeroUsado`.

const PRIMER_ANIO_CON_PREFIJO = 2027

const PREFIJOS = { kng: 'K', vera: 'V' }

function claveCorrelativo(brand, year) {
  return `factura-correlativo-${brand}-${year}`
}

function formatearNumero(brand, year, correlativo) {
  if (year < PRIMER_ANIO_CON_PREFIJO) {
    return `${correlativo}/${year}`
  }
  const prefijo = PREFIJOS[brand] || ''
  return `${prefijo}-${String(correlativo).padStart(3, '0')}/${year}`
}

// Números de partida para cada marca. El valor es el último USADO antes de
// arrancar la app, así que la primera sugerencia será siempre este + 1.
// Solo se aplica si localStorage no tiene ningún valor previo (es decir,
// no sobreescribe facturas ya emitidas desde la app).
const CORRELATIVOS_INICIALES = {
  kng:  { 2026: 10 },
  vera: { 2026: 14 },
}

export function inicializarCorrelativos() {
  const year = new Date().getFullYear()
  for (const [brand, porAnio] of Object.entries(CORRELATIVOS_INICIALES)) {
    const clave = claveCorrelativo(brand, year)
    if (!localStorage.getItem(clave) && porAnio[year] != null) {
      localStorage.setItem(clave, String(porAnio[year]))
    }
  }
}

// Devuelve el número que se le sugerirá al usuario para la PRÓXIMA factura
// de esa marca y año (no consume el número: solo lo propone).
export function sugerirSiguienteNumero(brand, year) {
  const ultimo = Number(localStorage.getItem(claveCorrelativo(brand, year))) || 0
  return formatearNumero(brand, year, ultimo + 1)
}

// Guarda el correlativo como "usado" tras generar el PDF, para que la
// siguiente sugerencia avance. Se llama solo en ese momento (no en cada
// tecla), así mirar el formulario sin generar nada no quema números.
export function confirmarNumeroUsado(brand, year, correlativo) {
  localStorage.setItem(claveCorrelativo(brand, year), String(correlativo))
}
