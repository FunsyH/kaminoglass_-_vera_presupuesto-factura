// Barra de navegación entre las secciones principales de la app.
// Hoy solo decide qué layout se ve debajo (Presupuesto o Factura); no toca
// el estado de ninguna de las dos secciones.
const TABS = [
  { id: 'presupuesto', label: 'Presupuesto' },
  { id: 'factura', label: 'Factura' },
]

function TabsPrincipales({ tabActivo, setTabActivo }) {
  return (
    <div className="no-print flex gap-1 border-b border-gray-200 bg-white px-5 pt-3">
      {TABS.map((tab) => {
        const activo = tab.id === tabActivo
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTabActivo(tab.id)}
            className={
              'px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors ' +
              (activo
                ? 'border-kng-ink text-kng-ink'
                : 'border-transparent text-gray-400 hover:text-gray-600')
            }
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export default TabsPrincipales
