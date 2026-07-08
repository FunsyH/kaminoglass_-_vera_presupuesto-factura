import { useState } from 'react'
import SelectorMarcaFactura from './SelectorMarcaFactura'
import DatosFacturaCabecera from './DatosFacturaCabecera'
import DatosCliente from './DatosCliente'
import EditorSecciones from './EditorSecciones'
import MetodoPago from './MetodoPago'
import BotonGenerarPDFFactura from '../ui/BotonGenerarPDFFactura'

const CAMPOS_OBLIGATORIOS = ['nombre', 'direccion', 'ciudad', 'cif']
const ETIQUETAS = { nombre: 'Nombre', direccion: 'Dirección', ciudad: 'Ciudad', cif: 'CIF / NIF' }

function validarCliente(cliente) {
  const errores = {}
  for (const campo of CAMPOS_OBLIGATORIOS) {
    if (!cliente[campo]?.trim()) {
      errores[campo] = `${ETIQUETAS[campo]} es obligatorio`
    }
  }
  return errores
}

function FormularioFactura({ factura, setFactura }) {
  const [errores, setErrores] = useState({})

  function intentarGenerar() {
    const nuevosErrores = validarCliente(factura.cliente)
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  // Limpiar el error de un campo cuando el usuario empieza a rellenarlo.
  function setFacturaYLimpiarError(actualizador) {
    setFactura(actualizador)
    setErrores({})
  }

  return (
    <div className="no-print w-full md:w-[480px] md:shrink-0 h-auto md:h-full overflow-visible md:overflow-y-auto bg-white border-r border-gray-200 p-5">
      <h1 className="text-lg font-semibold text-kng-ink mb-4">
        Facturas · KNG &amp; VERA
      </h1>

      <SelectorMarcaFactura factura={factura} setFactura={setFactura} />
      <DatosFacturaCabecera factura={factura} setFactura={setFactura} />
      <DatosCliente
        factura={factura}
        setFactura={setFacturaYLimpiarError}
        errores={errores}
      />
      <EditorSecciones quote={factura} setQuote={setFactura} />
      <MetodoPago factura={factura} setFactura={setFactura} />
      <BotonGenerarPDFFactura factura={factura} setFactura={setFactura} onValidar={intentarGenerar} />
    </div>
  )
}

export default FormularioFactura
