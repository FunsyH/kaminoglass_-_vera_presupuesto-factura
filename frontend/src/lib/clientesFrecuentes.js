// clientesFrecuentes.js
// Lista de clientes ya usados en alguna factura, guardada en el navegador,
// para no tener que re-escribir sus datos cada vez. Sin React, sin UI.

const CLAVE = 'factura-clientes-frecuentes'

// Devuelve la lista guardada (o [] si todavía no hay ninguno).
export function listarClientes() {
  const guardado = localStorage.getItem(CLAVE)
  if (!guardado) return []
  try {
    return JSON.parse(guardado)
  } catch {
    return []
  }
}

// Añade un cliente nuevo o, si ya existe uno con el mismo nombre, actualiza
// sus datos (dirección/ciudad/CIF pueden haber cambiado desde la última vez).
export function guardarCliente(cliente) {
  if (!cliente || !cliente.nombre) return
  const clientes = listarClientes()
  const indice = clientes.findIndex((c) => c.nombre === cliente.nombre)
  if (indice === -1) {
    clientes.push(cliente)
  } else {
    clientes[indice] = cliente
  }
  localStorage.setItem(CLAVE, JSON.stringify(clientes))
}
