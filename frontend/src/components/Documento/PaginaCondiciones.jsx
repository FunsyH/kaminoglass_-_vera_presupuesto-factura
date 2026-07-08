import { condicionesContratacion, titulosTerminos, clausulas } from '../../data/textosFijos'
import { etiquetas } from '../../data/textosFijos'

// Página 2 del documento: condiciones de contratación (resumen) + los 10
// Términos y Condiciones en dos columnas. Todos los textos son fijos: vienen
// por defecto según marca e idioma (el usuario no los edita en el formulario).
function PaginaCondiciones({ brand, lang }) {
  const t = etiquetas[lang]
  const titulo = titulosTerminos[brand][lang]
  const listaClausulas = clausulas[lang]

  return (
    <div className="page pagina-condiciones">
      {/* Resumen de condiciones, antes de los términos largos */}
      <div className="terms">
        <h4>{t.condiciones}</h4>
        <p>{condicionesContratacion[lang]}</p>
      </div>

      {/* Cabecera: título + subtítulo de ámbito según la marca */}
      <header className="terms-head">
        <h2 className="tt-title display">{titulo.h2}</h2>
        <div className="tt-brand">{titulo.sub}</div>
      </header>

      {/* Las 10 cláusulas en dos columnas */}
      <div className="clauses">
        {listaClausulas.map((c) => (
          <div className="clause" key={c.n}>
            <h5>
              <span className="num">{c.n}</span>
              {c.titulo}
            </h5>
            <p>{c.texto}</p>
          </div>
        ))}
      </div>

      {/* Nota de aceptación */}
      <p className="nota-aceptacion">
        {lang === 'es'
          ? 'Al confirmar el depósito, el cliente acepta estos Términos y Condiciones.'
          : 'By confirming the deposit, the client accepts these Terms & Conditions.'}
      </p>

      {/* Espaciador: reserva el alto del pie fijo para que el footer global
          (position:fixed, anclado al fondo de la hoja) no tape la última
          cláusula ni la nota de aceptación. */}
      <div className="foot-espaciador-pagina" aria-hidden="true" />
    </div>
  )
}

export default PaginaCondiciones
