import { formatEuro } from '../../lib/formato'
import { importeLinea, subtotalSeccion } from '../../lib/calculos'

// Pinta UNA hoja A4 de alto fijo. Cabecera de marca siempre; meta del evento
// solo en la primera; cabecera de tabla siempre (referencia de columnas);
// los bloques de esta hoja; y en la ultima, el total clavado al fondo + footer.
function HojaA4({ brand, lang, empresa, t, bloques, esPrimera, esUltima, metaEvento, totales }) {
  // En modo "Total a mano (sin IVA)" no hay desglose por línea: se muestra solo
  // la columna Concepto (sin Cantidad, Precio unitario ni Importe).
  const soloConcepto = Boolean(totales.sinIva)
  return (
    <div className="hoja-a4" data-brand={brand} data-lang={lang}>
      <MarcaDeAgua brand={brand} />

      {/* Cabecera de marca (se repite en cada hoja) */}
      <CabeceraMarca empresa={empresa} brand={brand} />

      {/* Meta del evento: SOLO en la primera hoja */}
      {esPrimera ? (
        <>
          <div className="doc-meta">
            <div>
              <div className="doc-kind">{t.presupuesto}</div>
              <div className="event-title display">{metaEvento.title}</div>
            </div>
            <div className="doc-ref">
              {t.num} <b>{metaEvento.docNumber}</b><br />
              {t.fecha} <b>{metaEvento.issueDate}</b><br />
              {t.validez} <b>{metaEvento.validityDays} {t.dias}</b>
            </div>
          </div>
          <div className="event-sub">
            <span>{metaEvento.dateText}</span>
            <span className="dot">•</span>
            <span>{metaEvento.place}</span>
            <span className="dot">•</span>
            <span>{metaEvento.serviceText}</span>
          </div>
        </>
      ) : null}

      {/* Cabecera de tabla (columnas) — referencia repetida en cada hoja.
          En modo sin IVA solo se muestra la columna Concepto. */}
      <table className="lineas hoja-lineas">
        <thead>
          <tr>
            <th>{t.concepto}</th>
            {soloConcepto ? null : (
              <>
                <th className="qty">{t.cant}</th>
                <th className="num unit">{t.precioUnit}</th>
                <th className="num amt">{t.importe}</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {bloques.map((b, i) => <FilaBloque key={i} bloque={b} t={t} soloConcepto={soloConcepto} />)}
        </tbody>
      </table>

      {/* Total clavado al fondo (solo ultima hoja). En modo sin IVA solo se
          muestra la fila TOTAL con la etiqueta "SIN IVA"; se omiten Base e IVA. */}
      {esUltima ? (
        <div className="totals hoja-total">
          <div className="totals-box">
            {totales.sinIva ? null : (
              <>
                <div className="totals-row">
                  <span>{t.baseImponible}</span><span>{formatEuro(totales.base)}</span>
                </div>
                <div className="totals-row">
                  <span>{t.iva}</span><span>{formatEuro(totales.iva)}</span>
                </div>
              </>
            )}
            <div className="totals-row grand">
              <span className="label">
                {t.total}
                {totales.sinIva ? <span className="total-sin-iva"> (SIN IVA)</span> : null}
              </span>
              <span className="value">{formatEuro(totales.total)}</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Footer (se repite en cada hoja, al fondo) */}
      <footer className="foot hoja-foot">
        <span>{empresa.footerNombre}</span>
        <span className="web">{empresa.web}</span>
      </footer>
    </div>
  )
}

// Pinta un bloque segun su tipo (titulo de seccion, fila de item, subtotal).
// soloConcepto=true (modo sin IVA): se omiten las columnas Cant/P.Unit/Importe.
function FilaBloque({ bloque, t, soloConcepto }) {
  const { tipo, ref } = bloque
  if (tipo === 'titulo') {
    return (
      <tr className="fila-titulo" data-tipo="titulo">
        <td colSpan={soloConcepto ? 1 : 4}>
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
        {soloConcepto ? null : (
          <>
            <td className="qty" />
            <td className="num unit" />
            <td className="num amt">{formatEuro(subtotalSeccion(ref.section))}</td>
          </>
        )}
      </tr>
    )
  }
  // item
  const item = ref.item
  const tienePrecio = typeof item.unitPrice === 'number'
  return (
    <tr data-tipo="item">
      <td>
        <div className="desc-main">{item.description}</div>
        {item.note ? <div className="desc-note">{item.note}</div> : null}
      </td>
      {soloConcepto ? null : (
        <>
          <td className="qty">{item.qty ?? ''}</td>
          <td className="num unit">{tienePrecio ? formatEuro(item.unitPrice) : ''}</td>
          <td className="num amt">{tienePrecio ? formatEuro(importeLinea(item)) : ''}</td>
        </>
      )}
    </tr>
  )
}

function CabeceraMarca({ empresa, brand }) {
  return (
    <div className="head">
      <div className="brandmark">
        {brand === 'kng' ? (
          <img className="logo-kng" src="/assets/logo-kng.png" alt="Kami No Glass" />
        ) : (
          <div className="logo-vera">
            <div className="wordmark">VERA</div>
            <div className="tag">Equipment &amp; Rentals</div>
          </div>
        )}
      </div>
      <div className="company">
        <div className="name">{empresa.nombre}</div>
        <div className="cif">{empresa.cifLabel} · {empresa.cif}</div>
        {empresa.contacto.map((linea, i) => (
          <span key={i}>{linea}<br /></span>
        ))}
      </div>
    </div>
  )
}

function MarcaDeAgua({ brand }) {
  if (brand === 'kng') {
    return <img className="marca-agua marca-agua-kng" src="/assets/logo-kng.png" alt="" aria-hidden="true" />
  }
  return <div className="marca-agua marca-agua-vera" aria-hidden="true">VERA</div>
}

export default HojaA4
