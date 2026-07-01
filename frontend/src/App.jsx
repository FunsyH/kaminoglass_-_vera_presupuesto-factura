import { useState } from 'react'
import TabsPrincipales from './components/Tabs/TabsPrincipales'
import FormularioPresupuesto from './components/Formulario/FormularioPresupuesto'
import DocumentoPresupuesto from './components/Documento/DocumentoPresupuesto'
import FormularioFactura from './components/Formulario/FormularioFactura'
import DocumentoFactura from './components/Documento/DocumentoFactura'
import { crearQuoteInicial } from './lib/estadoInicial'
import { crearFacturaInicial } from './lib/estadoInicialFactura'

// App raíz: tabs arriba (Presupuesto / Factura) y, debajo, el layout de la
// sección activa. El estado de cada sección (`quote` y `factura`) vive aquí,
// son independientes entre sí, y cada uno alimenta a su propio formulario +
// documento: editar el formulario actualiza el documento al instante.
function App() {
  const [tabActivo, setTabActivo] = useState('presupuesto')
  const [quote, setQuote] = useState(crearQuoteInicial)
  const [factura, setFactura] = useState(crearFacturaInicial)

  return (
    <div className="app-layout h-screen flex flex-col">
      <TabsPrincipales tabActivo={tabActivo} setTabActivo={setTabActivo} />

      {tabActivo === 'presupuesto' ? (
        <div className="flex flex-1 overflow-hidden">
          <FormularioPresupuesto quote={quote} setQuote={setQuote} />

          {/* Zona del documento: centrada, con scroll, fondo neutro */}
          <div className="zona-documento flex-1 h-full overflow-y-auto py-8 flex justify-center">
            <DocumentoPresupuesto quote={quote} />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <FormularioFactura factura={factura} setFactura={setFactura} />

          <div className="zona-documento flex-1 h-full overflow-y-auto py-8 flex justify-center">
            <DocumentoFactura factura={factura} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
