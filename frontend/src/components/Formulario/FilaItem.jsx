import { importeLinea } from '../../lib/calculos'
import { formatEuro } from '../../lib/formato'

// Una fila editable del formulario: concepto, nota, cantidad y PRECIO UNITARIO.
// El importe total (cantidad × unitario) se calcula y se muestra a la derecha,
// no se teclea. El precio unitario es opcional (línea solo descriptiva).
function FilaItem({ item, onChange, onEliminar }) {
  function cambiar(campo, valor) {
    onChange({ ...item, [campo]: valor })
  }

  // Convierte el texto de un input numérico a número (o null si está vacío).
  function aNumero(texto) {
    if (texto === '' || texto === null) return null
    const n = Number(texto)
    return Number.isNaN(n) ? null : n
  }

  // Importe total de la línea para mostrarlo (cantidad × precio unitario).
  const total = importeLinea(item)

  return (
    <div className="grid grid-cols-12 gap-1 mb-1 items-start">
      <div className="col-span-5">
        <input
          type="text"
          placeholder="Concepto"
          value={item.description}
          onChange={(e) => cambiar('description', e.target.value)}
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-kng-gold focus:outline-none"
        />
        <input
          type="text"
          placeholder="Nota (opcional)"
          value={item.note ?? ''}
          onChange={(e) => cambiar('note', e.target.value)}
          className="w-full mt-0.5 rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-500 focus:border-kng-gold focus:outline-none"
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          placeholder="Cant."
          value={item.qty ?? ''}
          onChange={(e) => cambiar('qty', aNumero(e.target.value))}
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-kng-gold focus:outline-none"
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          placeholder="P. unit."
          value={item.unitPrice ?? ''}
          onChange={(e) => cambiar('unitPrice', aNumero(e.target.value))}
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-kng-gold focus:outline-none"
        />
      </div>
      {/* Importe total calculado (solo lectura) */}
      <div className="col-span-2 px-1 py-1 text-sm text-right text-gray-700 whitespace-nowrap">
        {item.unitPrice != null ? formatEuro(total) : '—'}
      </div>
      <div className="col-span-1">
        <button
          type="button"
          onClick={onEliminar}
          title="Eliminar línea"
          className="w-full rounded border border-gray-200 px-1 py-1 text-sm text-gray-400 hover:border-red-300 hover:text-red-500"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default FilaItem
