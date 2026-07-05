import { crearSeccionVacia, fechaHoy } from './estadoInicial'
import { sugerirSiguienteNumeroSync } from './numeracionFactura'

// Devuelve una factura inicial con número placeholder ("…/2026").
// El número real se carga de Supabase en App.jsx al montar el componente.
export function crearFacturaInicial() {
  const brand = 'kng'
  const year = new Date().getFullYear()
  return {
    brand,
    cliente: { nombre: '', direccion: '', ciudad: '', cif: '' },
    docNumber: sugerirSiguienteNumeroSync(brand, year),
    issueDate: fechaHoy(),
    metodoPago: 'transferencia',
    sections: [crearSeccionVacia()],
    ivaRate: 0.21,
  }
}
