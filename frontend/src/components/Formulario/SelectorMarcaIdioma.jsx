// Botones para elegir la empresa (KNG/VERA) y el idioma (ES/EN).
// Al pulsar, actualiza el quote en el componente padre.
function SelectorMarcaIdioma({ quote, setQuote }) {
  // Cambia una propiedad del quote (brand o lang) sin tocar el resto.
  function cambiar(campo, valor) {
    setQuote((q) => ({ ...q, [campo]: valor }))
  }

  return (
    <div className="mb-5">
      <Grupo titulo="Empresa">
        <Boton activo={quote.brand === 'kng'} onClick={() => cambiar('brand', 'kng')}>KNG</Boton>
        <Boton activo={quote.brand === 'vera'} onClick={() => cambiar('brand', 'vera')}>VERA</Boton>
      </Grupo>
      <Grupo titulo="Idioma">
        <Boton activo={quote.lang === 'es'} onClick={() => cambiar('lang', 'es')}>ES</Boton>
        <Boton activo={quote.lang === 'en'} onClick={() => cambiar('lang', 'en')}>EN</Boton>
      </Grupo>
    </div>
  )
}

// Grupo de botones con un título pequeño encima.
function Grupo({ titulo, children }) {
  return (
    <div className="mb-3">
      <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">{titulo}</div>
      <div className="flex gap-2">{children}</div>
    </div>
  )
}

// Botón individual; cambia de estilo si está activo.
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

export default SelectorMarcaIdioma
