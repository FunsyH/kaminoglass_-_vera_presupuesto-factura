const OPCIONES = [
  { id: 'transferencia', label: 'Transferencia' },
  { id: 'efectivo', label: 'Efectivo' },
  { id: 'cheque', label: 'Cheque' },
]

// Selector del método de pago. Si es "transferencia", el documento muestra
// automáticamente el IBAN de la marca activa (ver HojaA4Factura).
function MetodoPago({ factura, setFactura }) {
  return (
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Método de pago</h2>
      <div className="flex gap-2">
        {OPCIONES.map((op) => {
          const activo = factura.metodoPago === op.id
          const base = 'flex-1 rounded-md px-3 py-1.5 text-sm border transition'
          const estilo = activo
            ? 'bg-kng-gold border-kng-gold text-kng-ink font-semibold'
            : 'border-gray-300 text-gray-600 hover:border-kng-gold'
          return (
            <button
              key={op.id}
              type="button"
              className={`${base} ${estilo}`}
              onClick={() => setFactura((f) => ({ ...f, metodoPago: op.id }))}
            >
              {op.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MetodoPago
