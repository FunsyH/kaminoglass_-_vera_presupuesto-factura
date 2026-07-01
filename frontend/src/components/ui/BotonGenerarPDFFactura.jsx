import { confirmarNumeroUsado } from '../../lib/numeracionFactura'
import { guardarCliente } from '../../lib/clientesFrecuentes'

// Extrae el correlativo (la parte numérica) de un docNumber ya formateado,
// para poder guardarlo como "usado" antes de imprimir. Funciona con los dos
// formatos: "12/2026" y "K-001/2027".
function correlativoDe(docNumber) {
  const match = docNumber.match(/(\d+)\/\d{4}$/)
  return match ? Number(match[1]) : null
}

// Botón que genera el PDF de la factura. Antes de imprimir: guarda el
// correlativo usado (para que la siguiente factura sugiera el número
// siguiente) y guarda el cliente en la lista de frecuentes.
function BotonGenerarPDFFactura({ factura }) {
  function generar() {
    const year = new Date(factura.issueDate.split('/').reverse().join('-')).getFullYear()
    const correlativo = correlativoDe(factura.docNumber)
    if (correlativo !== null) {
      confirmarNumeroUsado(factura.brand, year, correlativo)
    }
    guardarCliente(factura.cliente)
    window.print()
  }

  return (
    <div>
      <button
        type="button"
        onClick={generar}
        className="w-full rounded-md bg-kng-gold px-4 py-2 text-sm font-semibold text-kng-ink hover:opacity-90"
      >
        Generar PDF
      </button>
      <div className="mt-2 text-xs text-gray-500 leading-snug">
        <b className="text-gray-700">Al guardar el PDF:</b>
        <ul className="mt-1 list-disc pl-4 space-y-0.5">
          <li>Destino: <b>Guardar como PDF</b></li>
          <li>Tamaño: <b>A4</b></li>
          <li>
            Desactiva <b>«Encabezados y pies de página»</b> (quita la fecha de arriba
            y la dirección web de abajo que pone el navegador).
          </li>
        </ul>
      </div>
    </div>
  )
}

export default BotonGenerarPDFFactura
