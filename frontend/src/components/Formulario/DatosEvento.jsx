// Formulario con los datos del evento (título, fecha, lugar, nº, etc.).
// Cada campo actualiza quote.event en el componente padre.
function DatosEvento({ quote, setQuote }) {
  // Actualiza un campo de event sin tocar el resto del quote.
  function cambiar(campo, valor) {
    setQuote((q) => ({ ...q, event: { ...q.event, [campo]: valor } }))
  }

  const ev = quote.event

  return (
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Datos del evento</h2>

      <Campo label="Título / cliente" valor={ev.title} onChange={(v) => cambiar('title', v)} />
      <Campo label="Fecha (texto)" valor={ev.dateText} onChange={(v) => cambiar('dateText', v)} />
      <Campo label="Lugar" valor={ev.place} onChange={(v) => cambiar('place', v)} />
      <Campo label="Servicio / horario" valor={ev.serviceText} onChange={(v) => cambiar('serviceText', v)} />

      <div className="grid grid-cols-3 gap-2">
        <Campo label="Nº presupuesto" valor={ev.docNumber} onChange={(v) => cambiar('docNumber', v)} />
        <Campo label="Fecha emisión" valor={ev.issueDate} onChange={(v) => cambiar('issueDate', v)} />
        <Campo label="Validez (días)" valor={ev.validityDays} onChange={(v) => cambiar('validityDays', v)} />
      </div>
    </div>
  )
}

// Campo de texto reutilizable con su etiqueta.
function Campo({ label, valor, onChange }) {
  return (
    <label className="block mb-2">
      <span className="block text-xs text-gray-500 mb-0.5">{label}</span>
      <input
        type="text"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-kng-gold focus:outline-none"
      />
    </label>
  )
}

export default DatosEvento
