import { sugerirSiguienteNumero } from '../../lib/numeracionFactura'

function SelectorMarcaFactura({ factura, setFactura }) {
  async function cambiarBrand(nuevaBrand) {
    const year = new Date().getFullYear()
    const docNumber = await sugerirSiguienteNumero(nuevaBrand, year)
    setFactura((f) => ({ ...f, brand: nuevaBrand, docNumber }))
  }

  return (
    <div className="mb-5">
      <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Empresa</div>
      <div className="flex gap-2">
        <Boton activo={factura.brand === 'kng'} onClick={() => cambiarBrand('kng')}>KNG</Boton>
        <Boton activo={factura.brand === 'vera'} onClick={() => cambiarBrand('vera')}>VERA</Boton>
      </div>
    </div>
  )
}

function Boton({ activo, onClick, children }) {
  const base = 'flex-1 rounded-md px-3 py-1.5 text-sm border transition'
  const estilo = activo
    ? 'bg-kng-gold border-kng-gold text-kng-ink font-semibold'
    : 'border-gray-300 text-gray-600 hover:border-kng-gold'
  return (
    <button type="button" className={`${base} ${estilo}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default SelectorMarcaFactura
