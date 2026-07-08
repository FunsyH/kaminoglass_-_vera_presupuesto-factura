import '../../styles/documento.css'
import { datosEmpresa } from '../../data/datosEmpresa'
import { etiquetas } from '../../data/textosFijos'
import { calcularTotales, subtotalSeccion, importeLinea } from '../../lib/calculos'
import { formatEuro } from '../../lib/formato'
import PaginaCondiciones from './PaginaCondiciones'

// Documento del presupuesto (el "PDF" en vivo).
//
// Estructura clave para la impresión: TODA la página 1 es UNA tabla.
//  - <thead>  = cabecera de marca (logo + datos). El navegador la REPITE en cada hoja.
//  - <tfoot>  = pie (nombre empresa + web). El navegador lo REPITE en cada hoja.
//  - <tbody>  = el contenido (evento, líneas, totales), que fluye y se pagina.
// Esta es la técnica nativa y robusta para cabecera/pie repetidos por hoja.
function DocumentoPresupuesto({ quote }) {
  const empresa = datosEmpresa[quote.brand][quote.lang]
  const t = etiquetas[quote.lang]
  const ev = quote.event
  const totales = calcularTotales(quote)

  return (
    <div className="documento" data-brand={quote.brand} data-lang={quote.lang}>
      {/* Marca de agua de fondo (fija a cada hoja en impresión). */}
      <MarcaDeAgua brand={quote.brand} />

      {/* Pie de página VISIBLE: en impresión es position:fixed y se ancla al
          fondo de CADA hoja física (dentro del margen inferior de @page), así
          queda siempre pegado abajo, haya mucho o poco contenido. El <tfoot>
          de la tabla solo reserva el hueco para que el contenido no lo invada. */}
      <footer className="foot foot-fijo">
        <span>{empresa.footerNombre}</span>
        <span className="web">{empresa.web}</span>
      </footer>

      {/* ===== PÁGINA(S) 1 · tabla maestra con cabecera repetida ===== */}
      <table className="doc-table">
        {/* Cabecera de marca: se repite arriba de cada hoja */}
        <thead>
          <tr>
            <td>
              <CabeceraMarca empresa={empresa} brand={quote.brand} />
            </td>
          </tr>
        </thead>

        {/* Contenido que fluye */}
        <tbody>
          <tr>
            <td>
              {/* TÍTULO Y REFERENCIA (solo aquí, no se repite) */}
              <div className="doc-meta">
                <div>
                  <div className="doc-kind">{t.presupuesto}</div>
                  <div className="event-title display">{ev.title}</div>
                </div>
                <div className="doc-ref">
                  {t.num} <b>{ev.docNumber}</b><br />
                  {t.fecha} <b>{ev.issueDate}</b><br />
                  {t.validez} <b>{ev.validityDays} {t.dias}</b>
                </div>
              </div>

              <div className="event-sub">
                <span>{ev.dateText}</span>
                <span className="dot">•</span>
                <span>{ev.place}</span>
                <span className="dot">•</span>
                <span>{ev.serviceText}</span>
              </div>

              {/* SECCIONES DE PARTIDAS */}
              {quote.sections.map((section) => (
                <SeccionPartidas key={section.id} section={section} t={t} />
              ))}

              {/* TOTALES */}
              <div className="totals">
                <div className="totals-box">
                  <div className="totals-row">
                    <span>{t.baseImponible}</span>
                    <span>{formatEuro(totales.base)}</span>
                  </div>
                  <div className="totals-row">
                    <span>{t.iva}</span>
                    <span>{formatEuro(totales.iva)}</span>
                  </div>
                  <div className="totals-row grand">
                    <span className="label">{t.total}</span>
                    <span className="value">{formatEuro(totales.total)}</span>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>

        {/* <tfoot> ESPACIADOR: se repite abajo de cada hoja (table-footer-group)
            y reserva el alto del pie, pero es invisible (visibility:hidden en
            impresión). El pie VISIBLE es el footer fixed de arriba. Así el
            contenido nunca invade la banda del pie y el pie queda anclado abajo. */}
        <tfoot aria-hidden="true">
          <tr>
            <td>
              <div className="foot foot-espaciador">
                <span>{empresa.footerNombre}</span>
                <span className="web">{empresa.web}</span>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>

      {/* ===== PÁGINA 2 · CONDICIONES + TÉRMINOS ===== */}
      <PaginaCondiciones brand={quote.brand} lang={quote.lang} />
    </div>
  )
}

// Bloque visual de la cabecera de marca (logo + datos de empresa).
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

// Una sección de partidas (título opcional + tabla de líneas + subtotal opcional).
function SeccionPartidas({ section, t }) {
  return (
    <section className="section">
      {section.title ? (
        <div className="section-title">
          <h3>{section.title}</h3>
          <div className="rule" />
        </div>
      ) : null}

      <table className="lineas">
        <thead>
          <tr>
            <th>{t.concepto}</th>
            <th className="qty">{t.cant}</th>
            <th className="num unit">{t.precioUnit}</th>
            <th className="num amt">{t.importe}</th>
          </tr>
        </thead>
        <tbody>
          {section.items.map((item, i) => {
            const tienePrecio = typeof item.unitPrice === 'number'
            return (
              <tr key={i}>
                <td>
                  <div className="desc-main">{item.description}</div>
                  {item.note ? <div className="desc-note">{item.note}</div> : null}
                </td>
                <td className="qty">{item.qty ?? ''}</td>
                <td className="num unit">{tienePrecio ? formatEuro(item.unitPrice) : ''}</td>
                <td className="num amt">{tienePrecio ? formatEuro(importeLinea(item)) : ''}</td>
              </tr>
            )
          })}
          {section.showSubtotal ? (
            <tr className="subtotal">
              <td>{t.baseImponible}</td>
              <td className="qty" />
              <td className="num unit" />
              <td className="num amt">{formatEuro(subtotalSeccion(section))}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  )
}

// Marca de agua de fondo: el logo del Enzo (KNG) o el wordmark "VERA",
// gigante, centrado y muy tenue. Va detrás del contenido.
function MarcaDeAgua({ brand }) {
  if (brand === 'kng') {
    return (
      <img className="marca-agua marca-agua-kng" src="/assets/logo-kng.png" alt="" aria-hidden="true" />
    )
  }
  return <div className="marca-agua marca-agua-vera" aria-hidden="true">VERA</div>
}

export default DocumentoPresupuesto
