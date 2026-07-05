import { useState, useEffect } from 'react'
import { listarClientes } from '../../lib/clientesFrecuentes'

function DatosCliente({ factura, setFactura, errores }) {
  const [clientes, setClientes] = useState([])

  useEffect(() => {
    listarClientes().then(setClientes)
  }, [])

  function cambiar(campo, valor) {
    setFactura((f) => ({ ...f, cliente: { ...f.cliente, [campo]: valor } }))
  }

  function elegirCliente(nombre) {
    const cliente = clientes.find((c) => c.nombre === nombre)
    if (cliente) setFactura((f) => ({ ...f, cliente }))
  }

  const cl = factura.cliente

  return (
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Datos del cliente</h2>

      {clientes.length > 0 ? (
        <label className="block mb-2">
          <span className="block text-xs text-gray-500 mb-0.5">Cliente frecuente</span>
          <select
            defaultValue=""
            onChange={(e) => elegirCliente(e.target.value)}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-kng-gold focus:outline-none"
          >
            <option value="" disabled>Elegir de la lista…</option>
            {clientes.map((c) => (
              <option key={c.nombre} value={c.nombre}>{c.nombre}</option>
            ))}
          </select>
        </label>
      ) : null}

      <Campo
        label="Nombre *"
        valor={cl.nombre}
        onChange={(v) => cambiar('nombre', v)}
        placeholder="Nombre completo o empresa"
        error={errores?.nombre}
      />
      <Campo
        label="Dirección *"
        valor={cl.direccion}
        onChange={(v) => cambiar('direccion', v)}
        placeholder="Calle, número"
        error={errores?.direccion}
      />
      <div className="grid grid-cols-2 gap-2">
        <Campo
          label="Ciudad *"
          valor={cl.ciudad}
          onChange={(v) => cambiar('ciudad', v)}
          placeholder="Ciudad"
          error={errores?.ciudad}
        />
        <Campo
          label="CIF / NIF *"
          valor={cl.cif}
          onChange={(v) => cambiar('cif', v)}
          placeholder="B12345678"
          error={errores?.cif}
        />
      </div>
    </div>
  )
}

function Campo({ label, valor, onChange, placeholder, error }) {
  return (
    <label className="block mb-2">
      <span className="block text-xs text-gray-500 mb-0.5">{label}</span>
      <input
        type="text"
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded border px-2 py-1 text-sm focus:outline-none ${
          error
            ? 'border-red-400 bg-red-50 focus:border-red-500'
            : 'border-gray-300 focus:border-kng-gold'
        }`}
      />
      {error ? <span className="text-xs text-red-500 mt-0.5 block">{error}</span> : null}
    </label>
  )
}

export default DatosCliente
