import { importeLinea } from '../../lib/calculos'
import { formatEuro } from '../../lib/formato'

// Fila de tabla editable: concepto, nota, cantidad, precio unitario e importe calculado.
// refConcepto / refPrecio: refs opcionales que SeccionItems pasa solo a la última fila.
// onUltimoTab: se llama cuando Tab o Enter se pulsa desde el precio de la última fila.
function FilaItem({ item, onChange, onEliminar, onUltimoTab, refConcepto, refPrecio }) {
  function cambiar(campo, valor) {
    onChange({ ...item, [campo]: valor })
  }

  function aNumero(texto) {
    if (texto === '' || texto === null) return null
    const n = Number(texto)
    return Number.isNaN(n) ? null : n
  }

  function manejarKeyDownPrecio(e) {
    if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'Enter') {
      e.preventDefault()
      onUltimoTab?.()
    }
  }

  const total = importeLinea(item)

  return (
    <tr className="group border-b border-gray-100 last:border-0">
      {/* Concepto + nota */}
      <td className="py-0.5 px-2">
        <input
          ref={refConcepto}
          type="text"
          placeholder="Concepto"
          value={item.description}
          onChange={(e) => cambiar('description', e.target.value)}
          className="w-full rounded border border-transparent px-2 py-1 text-sm focus:border-kng-gold focus:outline-none hover:border-gray-300"
        />
        <input
          type="text"
          placeholder="Nota (opcional)"
          value={item.note ?? ''}
          onChange={(e) => cambiar('note', e.target.value)}
          className="w-full rounded border border-transparent px-2 py-0.5 text-xs text-gray-400 placeholder-gray-300 focus:border-kng-gold focus:outline-none hover:border-gray-200"
        />
      </td>
      {/* Cantidad */}
      <td className="py-0.5 px-1 w-16">
        <input
          type="number"
          placeholder="—"
          value={item.qty ?? ''}
          onChange={(e) => cambiar('qty', aNumero(e.target.value))}
          className="w-full rounded border border-transparent px-2 py-1 text-sm text-center focus:border-kng-gold focus:outline-none hover:border-gray-300"
        />
      </td>
      {/* Precio unitario */}
      <td className="py-0.5 px-1 w-24">
        <input
          ref={refPrecio}
          type="number"
          placeholder="—"
          value={item.unitPrice ?? ''}
          onChange={(e) => cambiar('unitPrice', aNumero(e.target.value))}
          onKeyDown={onUltimoTab ? manejarKeyDownPrecio : undefined}
          className="w-full rounded border border-transparent px-2 py-1 text-sm text-right focus:border-kng-gold focus:outline-none hover:border-gray-300"
        />
      </td>
      {/* Importe calculado (solo lectura) */}
      <td className="py-0.5 pr-3 w-20 text-right text-sm text-gray-600 whitespace-nowrap">
        {item.unitPrice != null ? formatEuro(total) : '—'}
      </td>
      {/* Botón eliminar: visible solo al hacer hover sobre la fila */}
      <td className="py-0.5 w-6">
        <button
          type="button"
          onClick={onEliminar}
          title="Eliminar línea"
          className="opacity-0 group-hover:opacity-100 rounded px-1 py-0.5 text-xs text-gray-400 hover:text-red-500 transition-opacity"
        >
          ×
        </button>
      </td>
    </tr>
  )
}

export default FilaItem
