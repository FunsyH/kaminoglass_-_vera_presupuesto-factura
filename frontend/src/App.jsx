import { useState } from 'react'
import FormularioPresupuesto from './components/Formulario/FormularioPresupuesto'
import DocumentoPresupuesto from './components/Documento/DocumentoPresupuesto'
import { crearQuoteInicial } from './lib/estadoInicial'

// App raíz: layout de 2 columnas.
// Izquierda = formulario (no se imprime). Derecha = documento/PDF en vivo.
// El estado `quote` vive aquí y alimenta a ambos: editar el formulario
// actualiza el documento al instante.
function App() {
  const [quote, setQuote] = useState(crearQuoteInicial)

  return (
    <div className="app-layout flex">
      <FormularioPresupuesto quote={quote} setQuote={setQuote} />

      {/* Zona del documento: centrada, con scroll, fondo neutro */}
      <div className="zona-documento flex-1 h-screen overflow-y-auto py-8 flex justify-center">
        <DocumentoPresupuesto quote={quote} />
      </div>
    </div>
  )
}

export default App
