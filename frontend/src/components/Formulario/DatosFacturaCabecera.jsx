// Número y fecha de la factura. El número llega ya sugerido desde
// crearFacturaInicial(), pero queda editable por si hay que corregirlo.
function DatosFacturaCabecera({ factura, setFactura }) {
  function cambiar(campo, valor) {
    setFactura((f) => ({ ...f, [campo]: valor }))
  }

  return (
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Datos de la factura</h2>
      <div className="grid grid-cols-2 gap-2">
        <Campo label="Nº factura" valor={factura.docNumber} onChange={(v) => cambiar('docNumber', v)} placeholder="12/2026" />
        <Campo label="Fecha emisión" valor={factura.issueDate} onChange={(v) => cambiar('issueDate', v)} placeholder="dd/mm/aaaa" />
      </div>
    </div>
  )
}

function Campo({ label, valor, onChange, placeholder }) {
  return (
    <label className="block mb-2">
      <span className="block text-xs text-gray-500 mb-0.5">{label}</span>
      <input
        type="text"
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-kng-gold focus:outline-none"
      />
    </label>
  )
}

export default DatosFacturaCabecera
