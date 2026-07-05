import SeccionItems from './SeccionItems'
import { crearSeccionVacia } from '../../lib/estadoInicial'

// Gestiona la lista de secciones del presupuesto: permite editar cada una,
// añadir secciones nuevas y eliminarlas.
function EditorSecciones({ quote, setQuote }) {
  // Reemplaza una sección por su versión editada.
  function cambiarSeccion(indice, seccionNueva) {
    setQuote((q) => ({
      ...q,
      sections: q.sections.map((s, i) => (i === indice ? seccionNueva : s)),
    }))
  }

  // Añade una sección vacía al final.
  function anadirSeccion() {
    setQuote((q) => ({ ...q, sections: [...q.sections, crearSeccionVacia()] }))
  }

  // Elimina una sección por su índice.
  function eliminarSeccion(indice) {
    setQuote((q) => ({ ...q, sections: q.sections.filter((_, i) => i !== indice) }))
  }

  return (
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Conceptos</h2>

      {quote.sections.map((section, i) => (
        <SeccionItems
          key={section.id}
          section={section}
          onChange={(seccionNueva) => cambiarSeccion(i, seccionNueva)}
          onEliminar={() => eliminarSeccion(i)}
        />
      ))}

      <button
        type="button"
        onClick={anadirSeccion}
        className="rounded-md border border-kng-gold px-3 py-1.5 text-sm text-kng-gold hover:bg-kng-cream"
      >
        + Añadir sección
      </button>
    </div>
  )
}

export default EditorSecciones
