import { sugerirSiguientePresupuesto, confirmarPresupuestoUsado, parsearCorrelativoPresupuesto } from '../../lib/numeracionFactura'

function BotonGenerarPDF({ quote, setQuote }) {
  async function generar() {
    const { brand } = quote
    const year = new Date().getFullYear()

    // Leer número actual desde Supabase (fuente de verdad compartida).
    const numeroActual = await sugerirSiguientePresupuesto(brand, year)
    const parsed = parsearCorrelativoPresupuesto(numeroActual)
    if (parsed) {
      await confirmarPresupuestoUsado(brand, parsed.year, parsed.correlativo)
    }

    // Cargar el siguiente y actualizar el formulario.
    const siguiente = await sugerirSiguientePresupuesto(brand, year)
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
        Guardar Presupuesto
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
