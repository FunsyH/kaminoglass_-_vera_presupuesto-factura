import { calcularTotales } from '../../lib/calculos'
import { formatEuro } from '../../lib/formato'
import { etiquetas } from '../../data/textosFijos'

// Caja de totales del documento: Base imponible + IVA 21% + TOTAL.
// El IVA SIEMPRE se muestra desglosado (decisión del usuario).
function CajaTotales({ quote }) {
  const t = etiquetas[quote.lang]
  const { base, iva, total } = calcularTotales(quote)

  return (
    <div className="totals">
      <div className="totals-box">
        <div className="totals-row">
          <span>{t.baseImponible}</span>
          <span>{formatEuro(base)}</span>
        </div>
        <div className="totals-row">
          <span>{t.iva}</span>
          <span>{formatEuro(iva)}</span>
        </div>
        <div className="totals-row grand">
          <span className="label">{t.total}</span>
          <span className="value">{formatEuro(total)}</span>
        </div>
      </div>
    </div>
  )
}

export default CajaTotales
