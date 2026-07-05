import { useRef } from 'react'
import FilaItem from './FilaItem'
import { crearItemVacio } from '../../lib/estadoInicial'

function SeccionItems({ section, onChange, onEliminar }) {
  // Refs al concepto y al precio de la ÚLTIMA fila, para foco y detección de Tab/Enter.
  const refConceptoUltima = useRef(null)
  const refPrecioUltima = useRef(null)

  function cambiarCampo(campo, valor) {
    onChange({ ...section, [campo]: valor })
  }

  function cambiarItem(indice, itemNuevo) {
    const items = section.items.map((it, i) => (i === indice ? itemNuevo : it))
    onChange({ ...section, items })
  }

  function anadirItem() {
    onChange({ ...section, items: [...section.items, crearItemVacio()] })
    setTimeout(() => refConceptoUltima.current?.focus(), 0)
  }

  function eliminarItem(indice) {
    const items = section.items.filter((_, i) => i !== indice)
    onChange({ ...section, items })
  }

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <input
          type="text"
          placeholder="Título de sección (opcional)"
          value={section.title}
          onChange={(e) => cambiarCampo('title', e.target.value)}
          className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm font-semibold focus:border-kng-gold focus:outline-none"
        />
        <label className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
          <input
            type="checkbox"
            checked={section.showSubtotal}
            onChange={(e) => cambiarCampo('showSubtotal', e.target.checked)}
          />
          Subtotal
        </label>
        <button
          type="button"
          onClick={onEliminar}
          title="Eliminar sección"
          className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-400 hover:border-red-300 hover:text-red-500"
        >
          Quitar
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-3 py-1 text-left text-xs font-medium text-gray-400">Concepto</th>
            <th className="px-1 py-1 text-center text-xs font-medium text-gray-400 w-16">Cant.</th>
            <th className="px-1 py-1 text-right text-xs font-medium text-gray-400 w-24">P. unit.</th>
            <th className="pr-3 py-1 text-right text-xs font-medium text-gray-400 w-20">Importe</th>
            <th className="w-6" />
          </tr>
        </thead>
        <tbody>
          {section.items.map((item, i) => {
            const esUltima = i === section.items.length - 1
            return (
              <FilaItem
                key={i}
                item={item}
                onChange={(itemNuevo) => cambiarItem(i, itemNuevo)}
                onEliminar={() => eliminarItem(i)}
                onNuevaFila={anadirItem}
                onUltimoTab={esUltima ? anadirItem : undefined}
                refConcepto={esUltima ? refConceptoUltima : undefined}
                refPrecio={esUltima ? refPrecioUltima : undefined}
              />
            )
          })}
        </tbody>
      </table>

      <div className="px-3 py-2">
        <button
          type="button"
          onClick={anadirItem}
          className="text-sm text-kng-gold hover:underline"
        >
          + Añadir línea
        </button>
      </div>
    </div>
  )
}

export default SeccionItems
