// numeracionFactura.js
// Sugiere y confirma números de factura usando Supabase como backend compartido.
// Todas las funciones son async porque hacen llamadas a la red.
//
// Formato:
// - Años hasta 2026: "N/AÑO"  (p.ej. "11/2026")
// - Desde 2027: "K-001/2027" (KNG) / "V-001/2027" (VERA)

import { supabase } from './supabase'

const PRIMER_ANIO_CON_PREFIJO = 2027
const PREFIJOS = { kng: 'K', vera: 'V' }

function formatearNumero(brand, year, correlativo) {
  if (year < PRIMER_ANIO_CON_PREFIJO) {
    return `${correlativo}/${year}`
  }
  const prefijo = PREFIJOS[brand] || ''
  return `${prefijo}-${String(correlativo).padStart(3, '0')}/${year}`
}

function correlativoDe(docNumber) {
  const match = docNumber.match(/(\d+)\/\d{4}$/)
  return match ? Number(match[1]) : null
}

// Lee el último correlativo usado desde Supabase y devuelve el siguiente formateado.
export async function sugerirSiguienteNumero(brand, year) {
  const { data, error } = await supabase
    .from('contadores')
    .select('ultimo')
    .eq('marca', brand)
    .eq('tipo', 'factura')
    .eq('anio', year)
    .single()

  if (error || !data) {
    // Si no existe fila aún, empezar desde 1.
    return formatearNumero(brand, year, 1)
  }
  return formatearNumero(brand, year, data.ultimo + 1)
}

// Guarda el correlativo usado como el nuevo último, usando upsert para que
// funcione tanto si la fila ya existe como si no.
export async function confirmarNumeroUsado(brand, year, correlativo) {
  await supabase
    .from('contadores')
    .upsert(
      { marca: brand, tipo: 'factura', anio: year, ultimo: correlativo },
      { onConflict: 'marca,tipo,anio' }
    )
}

// Versión síncrona para compatibilidad con el estado inicial (antes de que
// cargue el valor real de Supabase). Devuelve un placeholder que se actualiza
// en cuanto el componente monta y llama a sugerirSiguienteNumero.
export function sugerirSiguienteNumeroSync(brand, year) {
  return formatearNumero(brand, year, '…')
}

export { correlativoDe }
