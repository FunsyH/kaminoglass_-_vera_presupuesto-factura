// estadoInicialFactura.js
// Datos de arranque de una factura nueva. Sin React, sin UI.
import { crearSeccionVacia, fechaHoy } from './estadoInicial';
import { sugerirSiguienteNumero } from './numeracionFactura';

// Devuelve una factura VACÍA lista para rellenar: marca por defecto KNG,
// número sugerido para hoy, fecha de emisión = hoy, pago por transferencia
// (con eso el documento ya muestra el IBAN sin que el usuario toque nada),
// y 2 secciones vacías para empezar a escribir conceptos.
export function crearFacturaInicial() {
  const brand = 'kng';
  return {
    brand,
    cliente: { nombre: '', direccion: '', ciudad: '', cif: '' },
    docNumber: sugerirSiguienteNumero(brand, new Date().getFullYear()),
    issueDate: fechaHoy(),
    metodoPago: 'transferencia',
    sections: [crearSeccionVacia(), crearSeccionVacia()],
    ivaRate: 0.21,
  };
}
