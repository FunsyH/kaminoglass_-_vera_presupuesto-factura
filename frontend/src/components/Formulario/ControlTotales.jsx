import { calcularTotales } from '../../lib/calculos'
import { formatEuro } from '../../lib/formato'

// Controla cómo se calcula el total:
// - 'auto': suma de las líneas (+ IVA 21% encima).
// - 'manual': el usuario teclea el total final (con IVA); se desglosa hacia atrás.
function ControlTotales({ quote, setQuote }) {
  const { base, iva, total } = calcularTotales(quote)

  function cambiarModo(modo) {
    setQuote((q) => ({ ...q, totalMode: modo }))
  }

  function cambiarTotalManual(texto) {
    const n = texto === '' ? null : Number(texto)
    setQuote((q) => ({ ...q, manualTotal: Number.isNaN(n) ? null : n }))
  }

  return (
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Total</h2>

      <div className="flex gap-3 mb-2 text-sm">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={quote.totalMode === 'auto'}
            onChange={() => cambiarModo('auto')}
          />
          Automático (suma de líneas)
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={quote.totalMode === 'manual'}
            onChange={() => cambiarModo('manual')}
          />
          Total a mano
        </label>
      </div>

      {quote.totalMode === 'manual' ? (
        <label className="block mb-2">
          <span className="block text-xs text-gray-500 mb-0.5">Total final (con IVA)</span>
          <input
            type="number"
            value={quote.manualTotal ?? ''}
            onChange={(e) => cambiarTotalManual(e.target.value)}
            className="w-40 rounded border border-gray-300 px-2 py-1 text-sm focus:border-kng-gold focus:outline-none"
          />
        </label>
      ) : null}

      {/* Vista rápida del desglose (siempre con IVA) */}
      <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
        <div>Base imponible: <b>{formatEuro(base)}</b></div>
        <div>IVA 21%: <b>{formatEuro(iva)}</b></div>
        <div className="text-kng-ink">TOTAL: <b>{formatEuro(total)}</b></div>
      </div>
    </div>
  )
}

export default ControlTotales
