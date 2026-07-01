import { formatEuro } from '../../lib/formato'
import { importeLinea, subtotalSeccion } from '../../lib/calculos'
import { MarcaDeAgua } from './HojaA4'

const ETIQUETAS_METODO_PAGO = {
  efectivo: 'En efectivo',
  transferencia: 'Transferencia bancaria',
  cheque: 'Cheque',
}

// Pinta UNA hoja A4 de una factura. Reutiliza MarcaDeAgua de HojaA4 (mismo
// logo de fondo que en Presupuesto), pero usa su PROPIA cabecera: una
// factura para Hacienda debe llevar nombre/CIF/dirección del emisor, no
// contacto comercial (web, redes, teléfonos) como sí lleva el presupuesto.
// Usa las MISMAS clases CSS que HojaA4 (.head, .doc-meta, .event-sub,
// .hoja-lineas, .hoja-total, .hoja-foot) aunque el contenido sea de factura,
// para que useMedidasDocumento (que mide por esas clases) funcione sin tocarlo.
function HojaA4Factura({ brand, empresa, t, bloques, esPrimera, esUltima, factura, totales }) {
  return (
    <div className="hoja-a4" data-brand={brand}>
      <MarcaDeAgua brand={brand} />

      <CabeceraMarcaFactura empresa={empresa} brand={brand} />

      {/* Meta de la factura: numero/fecha + datos del cliente. Solo 1ª hoja. */}
      {esPrimera ? (
        <>
          <div className="doc-meta">
            <div>
              <div className="doc-kind">{t.factura}</div>
              <div className="event-title display">{factura.cliente.nombre}</div>
            </div>
            <div className="doc-ref">
              {t.num} <b>{factura.docNumber}</b><br />
              {t.fecha} <b>{factura.issueDate}</b>
            </div>
          </div>
          <div className="event-sub">
            <span>{factura.cliente.direccion}</span>
            {factura.cliente.ciudad ? <><span className="dot">•</span><span>{factura.cliente.ciudad}</span></> : null}
            {factura.cliente.cif ? <><span className="dot">•</span><span>{t.cif} {factura.cliente.cif}</span></> : null}
          </div>
        </>
      ) : null}

      <table className="lineas hoja-lineas">
        <thead>
          <tr>
            <th>{t.concepto}</th>
            <th className="qty">{t.cant}</th>
            <th className="num unit">{t.precioUnit}</th>
            <th className="num amt">{t.importe}</th>
          </tr>
        </thead>
        <tbody>
          {bloques.map((b, i) => <FilaBloque key={i} bloque={b} t={t} />)}
        </tbody>
      </table>

      {/* Total + metodo de pago, clavado al fondo (solo ultima hoja). */}
      {esUltima ? (
        <div className="totals hoja-total">
          <div className="totals-box">
            <div className="totals-row">
              <span>{t.baseImponible}</span><span>{formatEuro(totales.base)}</span>
            </div>
            <div className="totals-row">
              <span>{t.iva}</span><span>{formatEuro(totales.iva)}</span>
            </div>
            <div className="totals-row grand">
              <span className="label">{t.total}</span>
              <span className="value">{formatEuro(totales.total)}</span>
            </div>
          </div>
          <div className="metodo-pago">
            <div className="metodo-pago-label">{ETIQUETAS_METODO_PAGO[factura.metodoPago]}</div>
            {factura.metodoPago === 'transferencia' ? (
              <div className="metodo-pago-iban">
                {empresa.nombreCuenta}<br />{empresa.iban}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <footer className="foot hoja-foot">
        <span>{empresa.footerNombre}</span>
      </footer>
    </div>
  )
}

// Cabecera con los datos del EMISOR exigidos por Hacienda (nombre, CIF,
// dirección). Sin contacto comercial (web, redes, teléfonos): eso es propio
// del presupuesto, no de una factura que se presenta a la Agencia Tributaria.
function CabeceraMarcaFactura({ empresa, brand }) {
  return (
    <div className="head">
      <div className="brandmark">
        {brand === 'kng' ? (
          <img className="logo-kng" src="/assets/logo-kng.png" alt="Kami No Glass" />
        ) : (
          <img className="logo-vera-img" src="/assets/logo-vera.png" alt="VERA" />
        )}
      </div>
      <div className="company">
        <div className="name">{empresa.nombre}</div>
        <div className="cif">{empresa.cifLabel} · {empresa.cif}</div>
        <div>{empresa.direccion}</div>
        <div>{empresa.ciudad}</div>
      </div>
    </div>
  )
}

function FilaBloque({ bloque, t }) {
  const { tipo, ref } = bloque
  if (tipo === 'titulo') {
    return (
      <tr className="fila-titulo" data-tipo="titulo">
        <td colSpan={4}>
          <div className="section-title">
            <h3>{ref.section.title}</h3>
            <div className="rule" />
          </div>
        </td>
      </tr>
    )
  }
  if (tipo === 'subtotal') {
    return (
      <tr className="subtotal" data-tipo="subtotal">
        <td>{t.baseImponible}</td>
        <td className="qty" />
        <td className="num unit" />
        <td className="num amt">{formatEuro(subtotalSeccion(ref.section))}</td>
      </tr>
    )
  }
  const item = ref.item
  const tienePrecio = typeof item.unitPrice === 'number'
  return (
    <tr data-tipo="item">
      <td>
        <div className="desc-main">{item.description}</div>
        {item.note ? <div className="desc-note">{item.note}</div> : null}
      </td>
      <td className="qty">{item.qty ?? ''}</td>
      <td className="num unit">{tienePrecio ? formatEuro(item.unitPrice) : ''}</td>
      <td className="num amt">{tienePrecio ? formatEuro(importeLinea(item)) : ''}</td>
    </tr>
  )
}

export default HojaA4Factura
