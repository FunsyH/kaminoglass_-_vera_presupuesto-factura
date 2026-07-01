import { confirmarNumeroPresupuestoUsado, siguienteNumeroPresupuesto } from '../../lib/estadoInicial'

// Botón que genera el PDF usando la impresión del navegador.
// Al imprimir: guarda el número usado para que la siguiente sugerencia
// avance automáticamente, y actualiza el campo docNumber en el formulario.
function BotonGenerarPDF({ quote, setQuote }) {
  function generar() {
    const { brand, event } = quote
    confirmarNumeroPresupuestoUsado(brand, event.docNumber)
    // Actualiza el formulario con el siguiente número para el próximo presupuesto.
    const siguiente = siguienteNumeroPresupuesto(brand, event.docNumber)
    setQuote((q) => ({ ...q, event: { ...q.event, docNumber: siguiente } }))
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

export default BotonGenerarPDF
