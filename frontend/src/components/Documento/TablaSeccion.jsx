import { subtotalSeccion, importeLinea } from '../../lib/calculos'
import { formatEuro } from '../../lib/formato'
import { etiquetas } from '../../data/textosFijos'

// Una sección del presupuesto: título opcional + tabla de líneas + subtotal opcional.
// Cada línea: concepto (con nota opcional), cantidad, precio unitario e importe total.
// El importe total = cantidad × precio unitario (se calcula, no se teclea).
// Si una línea no tiene precio unitario, es solo descriptiva (columnas vacías).
function TablaSeccion({ section, lang }) {
  const t = etiquetas[lang]

  return (
    <section className="section">
      {/* El título de sección solo se muestra si existe */}
      {section.title ? (
        <div className="section-title">
          <h3>{section.title}</h3>
          <div className="rule" />
        </div>
      ) : null}

      <table>
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

          {/* Subtotal de la sección (opcional) */}
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

export default TablaSeccion
