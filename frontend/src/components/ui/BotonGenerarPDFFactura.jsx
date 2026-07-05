import { confirmarNumeroUsado, sugerirSiguienteNumero } from '../../lib/numeracionFactura'
import { guardarCliente } from '../../lib/clientesFrecuentes'

function correlativoDe(docNumber) {
  const match = docNumber.match(/(\d+)\/\d{4}$/)
  return match ? Number(match[1]) : null
}

function BotonGenerarPDFFactura({ factura, setFactura, onValidar }) {
  function generar() {
    if (!onValidar?.()) return

    const year = new Date(factura.issueDate.split('/').reverse().join('-')).getFullYear()
    const correlativo = correlativoDe(factura.docNumber)
    if (correlativo !== null) {
      confirmarNumeroUsado(factura.brand, year, correlativo)
    }
    guardarCliente(factura.cliente)

    // Avanza el número para la siguiente factura antes de imprimir.
    const siguiente = sugerirSiguienteNumero(factura.brand, year)
    setFactura((f) => ({ ...f, docNumber: siguiente }))

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
          <li>Desactiva <b>«Encabezados y pies de página»</b></li>
        </ul>
      </div>
    </div>
  )
}

export default BotonGenerarPDFFactura
