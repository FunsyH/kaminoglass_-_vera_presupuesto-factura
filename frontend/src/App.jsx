import { useState, useEffect } from 'react'
import TabsPrincipales from './components/Tabs/TabsPrincipales'
import FormularioPresupuesto from './components/Formulario/FormularioPresupuesto'
import DocumentoPresupuesto from './components/Documento/DocumentoPresupuesto'
import FormularioFactura from './components/Formulario/FormularioFactura'
import DocumentoFactura from './components/Documento/DocumentoFactura'
import { crearQuoteInicial } from './lib/estadoInicial'
import { crearFacturaInicial } from './lib/estadoInicialFactura'
import { sugerirSiguienteNumero, sugerirSiguientePresupuesto } from './lib/numeracionFactura'

function App() {
  const [tabActivo, setTabActivo] = useState('presupuesto')
  const [quote, setQuote] = useState(crearQuoteInicial)
  const [factura, setFactura] = useState(crearFacturaInicial)

  // Carga los números reales desde Supabase al arrancar.
  useEffect(() => {
    const year = new Date().getFullYear()
    sugerirSiguienteNumero('kng', year).then((docNumber) => {
      setFactura((f) => ({ ...f, docNumber }))
    })
    sugerirSiguientePresupuesto('kng', year).then((docNumber) => {
      setQuote((q) => ({ ...q, event: { ...q.event, docNumber } }))
    })
  }, [])

  return (
    <div className="app-layout h-auto md:h-screen flex flex-col">
      <TabsPrincipales tabActivo={tabActivo} setTabActivo={setTabActivo} />

      {tabActivo === 'presupuesto' ? (
        <div className="flex flex-1 flex-col md:flex-row overflow-visible md:overflow-hidden">
          <FormularioPresupuesto quote={quote} setQuote={setQuote} />
          <div className="zona-documento flex-1 md:h-full overflow-visible md:overflow-y-auto py-8 flex justify-center">
            <DocumentoPresupuesto quote={quote} />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col md:flex-row overflow-visible md:overflow-hidden">
          <FormularioFactura factura={factura} setFactura={setFactura} />
          <div className="zona-documento flex-1 md:h-full overflow-visible md:overflow-y-auto py-8 flex justify-center">
            <DocumentoFactura factura={factura} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
