import FilaItem from './FilaItem'
import { crearItemVacio } from '../../lib/estadoInicial'

// Una sección editable: título opcional, interruptor de subtotal, sus líneas
// y botones para añadir línea o eliminar la sección entera.
function SeccionItems({ section, onChange, onEliminar }) {
  // Cambia el título o el interruptor de subtotal.
  function cambiarCampo(campo, valor) {
    onChange({ ...section, [campo]: valor })
  }

  // Reemplaza una línea por su versión editada.
  function cambiarItem(indice, itemNuevo) {
    const items = section.items.map((it, i) => (i === indice ? itemNuevo : it))
    onChange({ ...section, items })
  }

  // Añade una línea vacía al final.
  function anadirItem() {
    onChange({ ...section, items: [...section.items, crearItemVacio()] })
  }

  // Elimina una línea por su índice.
  function eliminarItem(indice) {
    const items = section.items.filter((_, i) => i !== indice)
    onChange({ ...section, items })
  }

  return (
    <div className="mb-4 rounded-lg border border-gray-200 p-3 bg-white">
      <div className="flex items-center gap-2 mb-2">
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

      {section.items.map((item, i) => (
        <FilaItem
          key={i}
          item={item}
          onChange={(itemNuevo) => cambiarItem(i, itemNuevo)}
          onEliminar={() => eliminarItem(i)}
        />
      ))}

      <button
        type="button"
        onClick={anadirItem}
        className="mt-1 text-sm text-kng-gold hover:underline"
      >
        + Añadir línea
      </button>
    </div>
  )
}

export default SeccionItems
