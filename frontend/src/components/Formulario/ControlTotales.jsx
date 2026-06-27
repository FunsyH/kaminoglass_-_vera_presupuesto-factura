import { calcularTotales } from '../../lib/calculos'
import { formatEuro } from '../../lib/formato'

// Controla cómo se calcula el total:
// - 'auto': suma de las líneas (+ IVA 21% encima).
// - 'manual': el usuario teclea el total final (con IVA); se desglosa hacia atrás.
// - 'manualBase': el usuario teclea la base (sin IVA); se le suma el IVA encima.
function ControlTotales({ quote, setQuote }) {
  const { base, iva, total, sinIva } = calcularTotales(quote)

  function cambiarModo(modo) {
    setQuote((q) => ({ ...q, totalMode: modo }))
  }

  function cambiarTotalManual(texto) {
    const n = texto === '' ? null : Number(texto)
    setQuote((q) => ({ ...q, manualTotal: Number.isNaN(n) ? null : n }))
  }

  function cambiarBaseManual(texto) {
    const n = texto === '' ? null : Number(texto)
    setQuote((q) => ({ ...q, manualBase: Number.isNaN(n) ? null : n }))
  }

  return (
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Total</h2>

      {/* Menú desplegable: más limpio que varios radios juntos. */}
      <label className="block mb-2">
        <span className="block text-xs text-gray-500 mb-0.5">Cómo calcular el total</span>
        <select
          value={quote.totalMode}
          onChange={(e) => cambiarModo(e.target.value)}
          className="w-full max-w-xs rounded border border-gray-300 px-2 py-1 text-sm focus:border-kng-gold focus:outline-none"
        >
          <option value="auto">Automático (suma de líneas)</option>
          <option value="manualSinIva">Total a mano (sin IVA)</option>
          <option value="manualBase">Base a mano (sin IVA, + IVA encima)</option>
        </select>
      </label>

      {quote.totalMode === 'manualSinIva' ? (
        <label className="block mb-2">
          <span className="block text-xs text-gray-500 mb-0.5">Total final (sin IVA)</span>
          <input
            type="number"
            value={quote.manualTotal ?? ''}
            onChange={(e) => cambiarTotalManual(e.target.value)}
            className="w-40 rounded border border-gray-300 px-2 py-1 text-sm focus:border-kng-gold focus:outline-none"
          />
        </label>
      ) : null}

      {quote.totalMode === 'manualBase' ? (
        <label className="block mb-2">
          <span className="block text-xs text-gray-500 mb-0.5">Base imponible (sin IVA)</span>
          <input
            type="number"
            value={quote.manualBase ?? ''}
            onChange={(e) => cambiarBaseManual(e.target.value)}
            className="w-40 rounded border border-gray-300 px-2 py-1 text-sm focus:border-kng-gold focus:outline-none"
          />
        </label>
      ) : null}

      {/* Vista rápida del desglose. En modo sin IVA solo se muestra el TOTAL. */}
      <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
        {sinIva ? (
          <div className="text-kng-ink">TOTAL: <b>{formatEuro(total)}</b> <span className="text-gray-500">(SIN IVA)</span></div>
        ) : (
          <>
            <div>Base imponible: <b>{formatEuro(base)}</b></div>
            <div>IVA 21%: <b>{formatEuro(iva)}</b></div>
            <div className="text-kng-ink">TOTAL: <b>{formatEuro(total)}</b></div>
          </>
        )}
      </div>
    </div>
  )
}

export default ControlTotales
