// clientesFrecuentes.js
// Lista de clientes compartida en Supabase. Todas las funciones son async.

import { supabase } from './supabase'

// Devuelve todos los clientes guardados, ordenados por nombre.
export async function listarClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('nombre, direccion, ciudad, cif')
    .order('nombre')

  if (error || !data) return []
  return data
}

// Añade o actualiza un cliente por nombre (upsert).
export async function guardarCliente(cliente) {
  if (!cliente?.nombre) return
  await supabase
    .from('clientes')
    .upsert(
      {
        nombre: cliente.nombre,
        direccion: cliente.direccion || '',
        ciudad: cliente.ciudad || '',
        cif: cliente.cif || '',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'nombre' }
    )
}
