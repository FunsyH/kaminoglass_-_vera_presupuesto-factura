import SelectorMarcaFactura from './SelectorMarcaFactura'
import DatosFacturaCabecera from './DatosFacturaCabecera'
import DatosCliente from './DatosCliente'
import EditorSecciones from './EditorSecciones'
import MetodoPago from './MetodoPago'
import BotonGenerarPDFFactura from '../ui/BotonGenerarPDFFactura'

// Panel de formulario completo de Factura. EditorSecciones se reutiliza tal
// cual del módulo de Presupuesto: solo lee/escribe `sections`, que tiene la
// misma forma en ambos estados.
function FormularioFactura({ factura, setFactura }) {
  return (
    <div className="no-print w-[480px] shrink-0 h-full overflow-y-auto bg-white border-r border-gray-200 p-5">
      <h1 className="text-lg font-semibold text-kng-ink mb-4">
        Facturas · KNG &amp; VERA
      </h1>

      <SelectorMarcaFactura factura={factura} setFactura={setFactura} />
      <DatosFacturaCabecera factura={factura} setFactura={setFactura} />
      <DatosCliente factura={factura} setFactura={setFactura} />
      <EditorSecciones quote={factura} setQuote={setFactura} />
      <MetodoPago factura={factura} setFactura={setFactura} />
      <BotonGenerarPDFFactura factura={factura} />
    </div>
  )
}

export default FormularioFactura
